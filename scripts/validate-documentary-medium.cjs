// Cold-context responsive candidate selection; read-only local/production QA.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const puppeteer = require('puppeteer-core');
const base = process.argv[2] || 'http://localhost:8888/';
assert.ok(['http://localhost:8888/', 'https://farmtree.eu/'].includes(base), 'Unapproved target');
const output = `qa/live-360/documentary-medium-${base.includes('localhost') ? 'local' : 'production'}.json`;
const candidates = set => set.split(',').map(part => {
  const match = part.trim().match(/^(\S+)\s+(\d+)w$/);
  assert.ok(match, `Malformed candidate: ${part}`);
  return { url: match[1], width: Number(match[2]) };
});
(async () => {
  const { proofPhotographs, newsPhotographs } = await import('./editorial-photographs.mjs');
  const routes = [
    // Existing rendered News attachment alt (pre-medium lcp-local.json), not
    // the source photograph's descriptive alt; this test must preserve it.
    { path: 'blog/', selector: '.ft-blog-featured-card > figure img', photo: newsPhotographs['farmtree-water-erosion-microclimate-model-update-2026'], expectedAlt: 'What FarmTree’s 2026 water, erosion and microclimate update means for scenario planning' },
    { path: 'proof-stories/farm-value-projection/', selector: '.ft-segment-intro-image img', photo: proofPhotographs['farm-value-projection'] }
  ];
  const report = { base, started: new Date().toISOString(), rows: [], errors: [], failure: null };
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  try {
    for (const viewport of [{ width: 390, dpr: 2 }, { width: 390, dpr: 1 }, { width: 1440, dpr: 1 }]) for (const route of routes) {
      const context = await browser.createBrowserContext();
      try {
        const page = await context.newPage();
        await page.setViewport({ width: viewport.width, height: 1000, deviceScaleFactor: viewport.dpr });
        await page.setCacheEnabled(false);
        if (base.includes('localhost')) await page.setCookie({ name: 'playground_auto_login_already_happened', value: '1', domain: 'localhost', path: '/' });
        const responses = [], requests = [];
        page.on('pageerror', error => report.errors.push({ route: route.path, viewport, message: error.message }));
        page.on('console', message => { if (message.type() === 'error') report.errors.push({ route: route.path, viewport, message: message.text() }); });
        page.on('response', response => { if (response.request().resourceType() === 'image') responses.push({ url: response.url(), status: response.status() }); });
        // Decode cannot supply intrinsic sizing before the reserved-box measurement.
        const held = []; let hold = true;
        await page.setRequestInterception(true);
        page.on('request', request => {
          if (request.resourceType() === 'image') requests.push(request.url());
          if (hold && request.resourceType() === 'image') held.push(request);
          else request.continue();
        });
        const status = (await page.goto(base + route.path, { waitUntil: 'domcontentloaded', timeout: 60000 })).status();
        assert.equal(status, 200);
        await page.waitForSelector(route.selector);
        await page.evaluate(() => document.fonts.ready);
        const geometry = () => page.$eval(route.selector, image => {
          const rect = image.getBoundingClientRect(), figure = image.closest('figure').getBoundingClientRect();
          return { width: rect.width, height: rect.height, top: rect.top, figureWidth: figure.width, figureHeight: figure.height, naturalWidth: image.naturalWidth, objectFit: getComputedStyle(image).objectFit };
        });
        const before = await geometry();
        assert.equal(before.naturalWidth, 0, 'Cold geometry must precede image decode');
        hold = false; await Promise.all(held.map(request => request.continue()));
        await page.waitForFunction(selector => { const image = document.querySelector(selector); return image?.complete && image.naturalWidth > 0; }, { timeout: 30000 }, route.selector);
        await page.$eval(route.selector, image => image.decode());
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        const after = await geometry();
        const image = await page.$eval(route.selector, image => {
          const sources = [...image.closest('picture').querySelectorAll('source')].map(source => ({ type: source.type, srcset: source.srcset, sizes: source.sizes }));
          // Resolve the actual sizes slot through browser CSS, not rendered width
          // or a guessed mobile/desktop breakpoint.
          let length = null;
          for (const part of image.sizes.split(',')) {
            const value = part.trim(), media = value.match(/^(\([^)]*\))\s+(.+)$/);
            if (!media || matchMedia(media[1]).matches) { length = media ? media[2] : value; break; }
          }
          const probe = document.createElement('div');
          probe.style.cssText = `position:fixed;visibility:hidden;pointer-events:none;width:${length};height:0`;
          document.body.append(probe); const slot = probe.getBoundingClientRect().width; probe.remove();
          return { currentSrc: image.currentSrc, src: image.getAttribute('src'), srcset: image.srcset, sizes: image.sizes, slot, sources, width: image.getAttribute('width'), height: image.getAttribute('height'), alt: image.alt, loading: image.loading, priority: image.fetchPriority };
        });
        const audit = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          preloads: [...document.querySelectorAll('link[rel="preload"][as="image"]')].map(e => ({ href: e.href, srcset: e.imageSrcset })),
          belowFold: [...document.querySelectorAll('main .ft-documentary-picture img')].filter(e => e.getBoundingClientRect().top >= innerHeight).map(e => ({ src: e.src, loading: e.loading }))
        }));
        const row = { route: route.path, viewport, status, before, after, image, audit, responses, requests };
        report.rows.push(row);
        assert.equal(image.alt, route.expectedAlt ?? route.photo.alt, 'Existing rendered alt text');
        assert.equal(image.width, '1200'); assert.equal(image.height, '900');
        assert.notEqual(image.loading, 'lazy', 'Primary must not lazy-load');
        assert.ok(image.slot > 0 && image.slot <= 1440, `Invalid sizes slot ${image.slot}`);
        const stem = route.photo.filename.replace(/-content\.jpg$/, '');
        for (const [type, extension, set] of [
          ['image/avif', 'avif', image.sources.find(s => s.type === 'image/avif')?.srcset],
          ['image/webp', 'webp', image.sources.find(s => s.type === 'image/webp')?.srcset],
          ['image/jpeg', 'jpg', image.srcset]
        ]) {
          assert.ok(set, `Missing ${type}`);
          const blog = route.path === 'blog/';
          const list = candidates(set); assert.deepEqual(list.map(c => c.width), blog ? [480, 800, 1200] : [480, 1200]);
          for (const [index, variant] of (blog ? ['preview', 'medium', 'content'] : ['preview', 'content']).entries()) assert.equal(list[index].url, new URL(`wp-content/themes/farmtree-native/assets/images/documentary/${stem}-${variant}.${extension}`, base).href);
          if (type !== 'image/jpeg') assert.equal(image.sources.find(s => s.type === type).sizes, image.sizes);
        }
        const avif = candidates(image.sources.find(s => s.type === 'image/avif').srcset);
        const selected = avif.find(c => c.width >= image.slot * viewport.dpr) || avif.at(-1);
        row.expectedCandidate = selected;
        row.selectionScope = route.path === 'blog/' ? 'Blog medium candidate selection' : 'Existing Proof candidate/sizes behavior preserved; cover-resolution adequacy not certified';
        assert.equal(image.currentSrc, selected.url, 'Cold candidate must match actual sizes/DPR');
        if (viewport.width === 390) assert.equal(selected.width, viewport.dpr === 2 ? (route.path === 'blog/' ? 800 : 1200) : 480);
        assert.ok(responses.some(r => r.url === image.currentSrc && r.status === 200), 'Selected resource HTTP200');
        assert.equal(requests.filter(url => url === image.currentSrc).length, 1, 'No duplicate primary request');
        assert.equal(audit.preloads.length, 0, 'No added image preload');
        assert.ok(!audit.overflow); audit.belowFold.forEach(e => assert.equal(e.loading, 'lazy'));
        assert.equal(after.objectFit, 'cover');
        for (const key of ['width', 'height', 'top', 'figureWidth', 'figureHeight']) assert.ok(Math.abs(before[key] - after[key]) < 0.5, `Decode changed ${key}`);
        assert.ok(after.width > 0 && after.height > 0);
        assert.ok(Math.abs(after.width / after.height - after.figureWidth / after.figureHeight) < 0.01, 'Image must retain figure crop ratio');
        console.log(`PASS ${route.path} ${viewport.width}@${viewport.dpr}: slot${image.slot}, selected${selected.width}, rendered${after.width}`);
      } finally { await context.close(); }
    }
    assert.deepEqual(report.errors, []);
  } catch (error) { report.failure = error.stack; throw error; }
  finally { fs.mkdirSync('qa/live-360', { recursive: true }); fs.writeFileSync(output, JSON.stringify(report, null, 2)); await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
