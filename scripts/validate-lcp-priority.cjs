// Read-only rendered-image regression; never changes page loading attributes.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const puppeteer = createRequire(path.resolve('qa/tools/package.json'))('puppeteer-core');
const base = process.argv[2] || 'http://localhost:8888/';
assert.ok(['http://localhost:8888/', 'https://farmtree.eu/'].includes(base));
(async () => {
  const { proofPhotographs, newsPhotographs } = await import('./editorial-photographs.mjs');
  const routes = ['blog/', ...Object.keys(proofPhotographs).map(s => `proof-stories/${s}/`), ...Object.keys(newsPhotographs).map(s => `${s}/`)];
  const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  const rows = [], errors = [];
  try {
    const page = await browser.newPage();
    if (base.includes('localhost')) await page.setCookie({ name: 'playground_auto_login_already_happened', value: '1', domain: 'localhost', path: '/' });
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', e => { if (e.type() === 'error') errors.push(e.text()); });
    await page.evaluateOnNewDocument(() => {
      window.imageMetrics = { cls: 0, lcp: null };
      new PerformanceObserver(list => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.imageMetrics.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver(list => { for (const e of list.getEntries()) window.imageMetrics.lcp = { tag: e.element?.tagName, src: e.element?.currentSrc, time: e.startTime }; }).observe({ type: 'largest-contentful-paint', buffered: true });
    });
    for (const width of [390, 1440, 1920]) {
      await page.setViewport({ width, height: 1000 });
      for (const route of routes) {
        assert.equal((await page.goto(base + route, { waitUntil: 'networkidle2', timeout: 60000 })).status(), 200);
        await page.evaluate(() => document.fonts.ready);
        const row = await page.evaluate(() => ({
          images: [...document.querySelectorAll('.ft-documentary-picture img')].map(i => ({ src: i.currentSrc, loading: i.loading, priority: i.fetchPriority, top: i.getBoundingClientRect().top, width: i.getAttribute('width'), height: i.getAttribute('height'), alt: i.alt, srcset: i.srcset, sizes: i.sizes, formats: [...i.parentElement.querySelectorAll('source')].map(s => s.type) })),
          preloads: [...document.querySelectorAll('link[rel="preload"][as="image"]')].map(e => e.href),
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          metrics: window.imageMetrics
        }));
        assert.ok(row.images.length && row.images[0].top < 1000);
        assert.notEqual(row.images[0].loading, 'lazy', `${route} primary lazy`);
        assert.ok(row.images.filter(i => i.priority === 'high').length <= 1);
        for (const i of row.images) {
          assert.ok(i.width && i.height && i.alt && i.srcset && i.sizes);
          assert.ok(i.formats.includes('image/avif') && i.formats.includes('image/webp'));
          if (i.top >= 1000) assert.equal(i.loading, 'lazy');
        }
        assert.equal(row.preloads.length, 0, 'No duplicate image preload path');
        assert.ok(!row.overflow && row.metrics.cls < 0.1);
        rows.push({ width, route, ...row });
      }
    }
    assert.deepEqual(errors, []);
    fs.mkdirSync('qa/image-release', { recursive: true });
    fs.writeFileSync(`qa/image-release/lcp-${base.includes('localhost') ? 'local' : 'production'}.json`, JSON.stringify({ rows, errors }, null, 2));
    console.log(JSON.stringify({ status: 'pass', views: rows.length, errors }));
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
