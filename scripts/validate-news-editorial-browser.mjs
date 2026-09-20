import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { loadEditorialArticles } from './news-editorial-content.mjs';

const base = process.env.FARMTREE_NEWS_BASE_URL || 'http://localhost:8888';
assert.ok(['http://localhost:8888', 'https://farmtree.eu'].includes(base), 'Use only the approved local or public production origin');
const production = base === 'https://farmtree.eu';
const phase = process.env.FARMTREE_NEWS_PHASE || 'complete';
assert.ok(['complete', 'runtime-staged'].includes(phase));
assert.ok(phase !== 'runtime-staged' || production, 'Intermediate runtime QA is production-only');
const staged = phase === 'runtime-staged';
const expectedCards = staged ? 9 : 21;
const out = production ? `qa/live-360/news-editorial-production${staged ? '-staged' : ''}` : 'qa/live-360/news-editorial';
await mkdir(out, { recursive: true });
const articles = await loadEditorialArticles();
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const results = [];
const links = new Set();
try {
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => {
    window.editorialVitals = { cls: 0, lcp: null, shifts: [] };
    new PerformanceObserver(list => { for (const e of list.getEntries()) if (!e.hadRecentInput) { window.editorialVitals.cls += e.value; window.editorialVitals.shifts.push({ value: e.value, sources: e.sources.map(s => ({ tag: s.node?.tagName, className: s.node?.className, previous: s.previousRect.toJSON(), current: s.currentRect.toJSON() })) }); } }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver(list => { for (const e of list.getEntries()) window.editorialVitals.lcp = { time: e.startTime, tag: e.element?.tagName, leadImage: !!e.element?.closest('.ft-editorial-card--lead'), source: e.url || null }; }).observe({ type: 'largest-contentful-paint', buffered: true });
  });
  if (!production) await page.setCookie({ name: 'playground_auto_login_already_happened', value: '1', domain: 'localhost', path: '/' });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', e => { if (e.type() === 'error') errors.push(e.text()); });
  for (const width of [320, 360, 390, 414, 768, 1024, 1280, 1440, 1920, 2560]) {
    await page.setViewport({ width, height: 950 });
    const response = await page.goto(`${base}/blog/`, { waitUntil: 'networkidle0' });
    assert.equal(response.status(), 200);
    if (production) {
      assert.ok(!/noindex/i.test(response.headers()['x-robots-tag'] || ''), 'Production indexing header');
      assert.ok(!await page.evaluate(() => /noindex/i.test(document.querySelector('meta[name="robots"]')?.content || '')), 'Production indexing meta');
    }
    const initial = await page.evaluate(() => ({
      leadLoading: document.querySelector('.ft-editorial-card--lead img')?.loading,
      high: document.querySelectorAll('.ft-editorial-hub img[fetchpriority="high"]').length,
      belowLazy: [...document.querySelectorAll('.ft-editorial-hub img')].slice(3).every(img => img.loading === 'lazy'),
      preloads: document.querySelectorAll('link[rel="preload"][as="image"]').length,
      vitals: window.editorialVitals
    }));
    assert.notEqual(initial.leadLoading, 'lazy');
    assert.equal(initial.high, 1);
    assert.ok(initial.belowLazy);
    assert.equal(initial.preloads, 0);
    await writeFile(`${out}/vitals-${width}.json`, JSON.stringify(initial.vitals, null, 2));
    assert.ok(initial.vitals.cls <= 0.1, `Initial CLS ${width}: ${initial.vitals.cls}`);
    if (initial.vitals.lcp?.tag === 'IMG') assert.ok(initial.vitals.lcp.leadImage, `Unexpected image LCP at ${width}`);
    await page.evaluate(async () => {
      await document.fonts.ready;
      for (const image of document.querySelectorAll('.ft-editorial-hub img')) {
        image.scrollIntoView();
        await image.decode();
      }
      scrollTo(0, 0);
    });
    const data = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      ids: [...document.querySelectorAll('[data-ft-story]')].map(e => e.dataset.ftStory),
      decks: [...document.querySelectorAll('.ft-editorial-card-copy > p:not(.ft-editorial-meta)')].map(e => e.textContent),
      images: [...document.querySelectorAll('.ft-editorial-hub img')].map(e => ({ src: e.currentSrc, loaded: e.naturalWidth > 0, alt: e.alt, sizes: e.sizes, srcset: e.srcset, width: e.getAttribute('width'), height: e.getAttribute('height'), formats: [...e.closest('picture').querySelectorAll('source')].map(s => s.type) })),
      links: [...document.querySelectorAll('a[href]')].map(e => e.href).filter(href => href.startsWith(location.origin)),
      h1: document.querySelectorAll('h1').length
    }));
    const discovery = await page.evaluate(() => ({
      topics: ['planning', 'carbon', 'policy', 'landscape', 'updates'].map(key => ({
        key, heading: document.querySelector(`#insights-title-${key}`)?.textContent,
        stories: document.querySelectorAll(`#insights-${key} [data-ft-story]`).length
      })),
      topicCards: document.querySelectorAll('.ft-editorial-topic-cards > a').length,
      brokenAnchors: [...document.querySelectorAll('.ft-editorial-hub a[href^="#"]')].filter(a => !document.getElementById(a.hash.slice(1))).length,
      subscription: document.querySelector('.ft-editorial-subscribe a')?.getAttribute('href'),
      subscriptionDisclosure: document.querySelector('.ft-editorial-subscribe-note')?.textContent,
      forms: document.querySelectorAll('.ft-editorial-hub form, .ft-editorial-hub input').length,
      lead: document.querySelectorAll('#insights-featured .ft-editorial-card--lead').length,
      companions: document.querySelectorAll('#insights-featured .ft-editorial-card:not(.ft-editorial-card--lead)').length
    }));
    assert.ok(discovery.topics.every(topic => topic.heading && topic.stories > 0), 'All five topic groups remain discoverable');
    assert.equal(discovery.topicCards, 5);
    assert.equal(discovery.brokenAnchors, 0);
    assert.equal(discovery.lead, 1);
    assert.equal(discovery.companions, 2);
    assert.ok(discovery.subscription?.startsWith('mailto:info@farmtree.earth?'));
    assert.ok(discovery.subscriptionDisclosure?.includes('does not automatically subscribe'));
    assert.equal(discovery.forms, 0, 'No unconfigured subscription capture');
    assert.equal(data.ids.length, expectedCards);
    assert.equal(new Set(data.ids).size, expectedCards);
    assert.equal(new Set(data.decks).size, expectedCards);
    assert.equal(data.images.length, expectedCards);
    assert.equal(new Set(data.images.map(i => i.src.replace(/-(preview|medium|content)\.(avif|webp|jpg)$/, ''))).size, expectedCards);
    assert.ok(!data.overflow);
    assert.equal(data.h1, 1);
    for (const image of data.images) assert.ok(image.loaded && image.alt && image.sizes && image.srcset && image.width && image.height && image.formats.includes('image/avif') && image.formats.includes('image/webp'));
    data.links.forEach(link => links.add(link.split('#')[0]));
    await page.screenshot({ path: `${out}/hub-${width}.png`, fullPage: true });
    results.push({ width, ...initial, cards: data.ids.length, images: data.images.length, overflow: data.overflow, discovery });
  }
  for (const article of staged ? [] : articles) {
    for (const width of [390, 1440]) {
      await page.setViewport({ width, height: 950 });
      const articleResponse = await page.goto(`${base}/${article.slug}/`, { waitUntil: 'networkidle0' });
      assert.equal(articleResponse.status(), 200);
      if (production) assert.ok(!/noindex/i.test(articleResponse.headers()['x-robots-tag'] || ''));
      const data = await page.evaluate(() => ({ h1: document.querySelectorAll('h1').length, overflow: document.documentElement.scrollWidth > innerWidth + 1,
        canonical: document.querySelector('link[rel="canonical"]')?.href,
        sources: document.body.innerText.includes('Sources / Further reading'),
        hero: document.querySelector('.wp-block-post-featured-image img')?.loading,
        description: document.querySelector('meta[name="description"]')?.content,
        robots: document.querySelector('meta[name="robots"]')?.content || '',
        og: ['og:title', 'og:description', 'og:image'].every(key => document.querySelector(`meta[property="${key}"]`)?.content),
        schemas: [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap(e => { const j = JSON.parse(e.textContent); return j['@graph'] || [j]; }),
        links: [...document.querySelectorAll('main a[href]')].map(e => e.href).filter(href => href.startsWith(location.origin)) }));
      assert.equal(data.h1, 1); assert.ok(!data.overflow && data.sources); assert.ok(data.canonical?.includes(article.slug)); assert.notEqual(data.hero, 'lazy');
      assert.ok(data.description && data.og);
      if (production) assert.ok(!/noindex/i.test(data.robots));
      const schema = data.schemas.find(s => s['@type'] === 'BlogPosting');
      assert.ok(schema?.datePublished && schema.dateModified && schema.publisher && schema.image && !schema.author);
      data.links.forEach(link => links.add(link.split('#')[0]));
    }
  }
  const broken = [];
  for (const link of links) {
    const status = await page.evaluate(async url => (await fetch(url)).status, link);
    if (status !== 200) broken.push({ link, status });
  }
  assert.deepEqual(broken, []);
  assert.deepEqual(errors, []);
  const accessibility = [];
  for (const width of [390, 1440]) {
    await page.setViewport({ width, height: 950 });
    await page.goto(`${base}/blog/`, { waitUntil: 'networkidle0' });
    await page.addScriptTag({ content: await readFile('node_modules/axe-core/axe.min.js', 'utf8') });
    accessibility.push(...await page.evaluate(async () => (await axe.run('.ft-editorial-main')).violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length }))));
    await page.evaluate(() => document.querySelector('.ft-editorial-topics a').focus());
    const visited = new Set();
    for (let i = 0; i < 100 && visited.size < expectedCards; i++) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => {
        const card = document.activeElement.closest('[data-ft-story]');
        return card ? { id: card.dataset.ftStory, outline: getComputedStyle(card).outlineStyle } : null;
      });
      if (focused) { assert.equal(focused.outline, 'solid'); visited.add(focused.id); }
    }
    assert.equal(visited.size, expectedCards, `Keyboard card reachability ${width}`);
    const target = await page.evaluate(() => document.activeElement.href);
    await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), page.keyboard.press('Enter')]);
    assert.equal(page.url(), target);
  }
  await writeFile(`${out}/report.json`, JSON.stringify({ phase, expectedCards, results, articleRoutes: staged ? 0 : 12, checkedLinks: links.size, broken, errors, accessibility }, null, 2));
  assert.deepEqual(errors, []);
  assert.deepEqual(accessibility, []);
  console.log(JSON.stringify({ phase, expectedCards, widths: results.length, articleRoutes: staged ? 0 : 12, checkedLinks: links.size, broken: 0, errors: 0, axeViolations: 0 }));
} finally { await browser.close(); }
