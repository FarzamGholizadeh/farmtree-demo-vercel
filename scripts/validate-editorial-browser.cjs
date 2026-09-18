// Local-only visual and editorial regression. Uses the repository QA toolchain.
const { createRequire } = require('node:module');
const path = require('node:path');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const qa = createRequire(path.resolve(__dirname, '../qa/tools/package.json'));
const puppeteer = qa('puppeteer-core');
const { pathToFileURL } = require('node:url');
const out = path.resolve(__dirname, '../qa/screenshots/editorial-audit');
fs.mkdirSync(out, { recursive: true });
(async () => {
  const { proofPhotographs, newsPhotographs } = await import(pathToFileURL(path.join(__dirname, 'editorial-photographs.mjs')));
  const routes = ['', 'platform/', 'solutions/', 'proof-stories/', 'customer-segments/', 'blog/',
    ...Object.keys(proofPhotographs).map(s => `proof-stories/${s}/`),
    ...Object.keys(newsPhotographs).map(s => `${s}/`)];
  const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  const evidence = [];
  try {
    const page = await browser.newPage();
    await page.setCookie({ name: 'playground_auto_login_already_happened', value: '1', domain: 'localhost', path: '/' });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', e => { if (e.type() === 'error') errors.push(e.text()); });
    for (const width of [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920]) {
      await page.setViewport({ width, height: 950 });
      for (const route of routes) {
        errors.length = 0;
        const response = await page.goto(`http://localhost:8888/${route}`, { waitUntil: 'networkidle0' });
        assert.equal(response.status(), 200, route);
        await page.evaluate(async () => {
          await document.fonts.ready;
          const images = [...document.querySelectorAll('picture.ft-documentary-picture img')];
          for (const image of images) { image.loading = 'eager'; }
          await Promise.all(images.filter(i => i.getBoundingClientRect().width).map(i => i.decode()));
        });
        const result = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          cardOverflow: [...document.querySelectorAll('.ft-proof-card-copy, .ft-news-item h2, .ft-news-item h3')].some(e => e.scrollWidth > e.clientWidth + 1),
          images: [...document.querySelectorAll('picture.ft-documentary-picture img')].map(i => ({
            src: i.currentSrc.split('/').pop(), alt: i.alt, loaded: i.complete && i.naturalWidth > 0,
            visible: i.getBoundingClientRect().width > 0, sizes: i.sizes, srcset: i.srcset,
            fit: getComputedStyle(i).objectFit, width: i.getAttribute('width'), height: i.getAttribute('height'),
            formats: [...i.parentElement.querySelectorAll('source')].map(s => s.type)
          })),
          clients: document.body.innerText.includes('FarmTree Clients'),
          valuation: document.body.innerText.includes('Farm Valuation')
        }));
        assert.ok(!result.overflow && !result.cardOverflow, `${route}/${width}: overflow`);
        assert.ok(result.images.length > 0, `${route}/${width}: no documentary images`);
        for (const image of result.images) {
          assert.ok(image.alt && image.sizes && image.srcset && image.width && image.height);
          assert.ok(image.formats.includes('image/avif') && image.formats.includes('image/webp'));
          if (image.visible) assert.ok(image.loaded && image.src.endsWith('.avif'), `${route}/${width}: ${image.src}`);
        }
        const slug = route.split('/').filter(Boolean).at(-1);
        const selected = proofPhotographs[slug] || newsPhotographs[slug];
        if (selected) assert.ok(result.images.some(i => i.src.startsWith(selected.filename.replace('-content.jpg', '-')) && i.alt === selected.alt), route);
        if (!route) assert.ok(result.clients && result.valuation);
        assert.deepEqual(errors, [], `${route}/${width}: console`);
        if ([390, 1440].includes(width)) {
          const target = await page.$(!route ? '.ft-home-proof' : 'main');
          await target.screenshot({ path: `${out}/${route.replaceAll('/', '-') || 'home'}-${width}.png` });
        }
        evidence.push({ route: route || '/', width, ...result, errors: [...errors] });
      }
    }
    fs.writeFileSync(`${out}/report.json`, JSON.stringify(evidence, null, 2));
    console.log(JSON.stringify({ status: 'pass', views: evidence.length, widths: 9, routes: routes.length, overflow: 0, consoleErrors: 0, screenshots: out }));
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
