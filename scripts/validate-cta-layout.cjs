// Local, read-only regression for the shared CTA pattern and unaffected pages.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const puppeteer = require('puppeteer-core');
const data = name => JSON.parse(fs.readFileSync(`wordpress/wp-content/plugins/farmtree-content/data/${name}.json`));
const routes = ['/', ...data('customer-segments').map(p => `/customer-segments/${p.slug}/`),
  ...data('proof-stories').map(p => `/proof-stories/${p.slug}/`), '/solutions/', '/blog/',
  `/${data('editorial-drafts')[0].slug}/`];
const widths = [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920];
const base = process.argv[2] || 'http://localhost:8888/';
assert.ok(['http://localhost:8888/', 'https://farmtree.eu/'].includes(base));
(async () => {
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  const results = [], errors = [];
  const out = `qa/screenshots/cta-layout/${base.includes('localhost') ? 'local' : 'production'}`;
  fs.mkdirSync(out, { recursive: true });
  try {
    const page = await browser.newPage();
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    if (base.includes('localhost')) await page.setCookie({ name: 'playground_auto_login_already_happened', value: '1', domain: 'localhost', path: '/' });
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', e => { if (e.type() === 'error') errors.push(e.text()); });
    for (const width of widths) {
      await page.setViewport({ width, height: 1000 });
      for (const route of routes) {
        assert.equal((await page.goto(new URL(route, base).href, { waitUntil: 'networkidle2' })).status(), 200);
        await page.evaluate(() => document.fonts.ready);
        const result = await page.evaluate(() => {
          const cta = document.querySelector('.ft-final-cta');
          const style = e => { const s = getComputedStyle(e); return Object.fromEntries(['fontSize', 'fontWeight', 'lineHeight', 'color', 'backgroundColor', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'gap', 'textAlign', 'borderRadius'].map(k => [k, s[k]])); };
          const box = e => { const b = e.getBoundingClientRect(); return { x: b.x, width: b.width, height: b.height }; };
          const result = { overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1, cta: null };
          if (!cta) return result;
          const elements = [cta, ...cta.querySelectorAll('h2, p, .wp-block-buttons, a')];
          const after = elements.map(style), afterBox = box(cta);
          cta.classList.remove('alignfull');
          const before = elements.map(style), beforeBox = box(cta);
          cta.classList.add('alignfull');
          const rect = cta.getBoundingClientRect(), footer = document.querySelector('.ft-native-site-footer').getBoundingClientRect();
          result.cta = { before, after, beforeBox, afterBox, viewport: document.documentElement.clientWidth,
            footerGap: footer.top - rect.bottom,
            links: [...cta.querySelectorAll('a')].map(a => a.getAttribute('href')),
            centered: [...cta.children].every(e => Math.abs((e.getBoundingClientRect().left + e.getBoundingClientRect().right) / 2 - (rect.left + rect.right) / 2) < 1) };
          return result;
        });
        assert.ok(!result.overflow, `${route} ${width}: overflow`);
        if (result.cta) {
          const c = result.cta;
          assert.ok(Math.abs(c.afterBox.x) < 1 && Math.abs(c.afterBox.width - c.viewport) < 1, `${route} ${width}: boxed CTA`);
          assert.deepEqual(c.after, c.before, 'Typography, padding and button styling unchanged');
          assert.ok(c.centered && Math.abs(c.footerGap) < 1, `${route}: alignment/footer gap`);
          assert.deepEqual(c.links, ['https://tool.farmtree.earth/Identity/Account/Register', 'mailto:info@farmtree.earth?subject=FarmTree%20quotation%20request']);
          if (route === '/') assert.deepEqual(c.afterBox, c.beforeBox, 'Homepage geometry unchanged');
          if ([390, 768, 1440, 1920].includes(width) && ['/', '/customer-segments/investors/', '/proof-stories/farm-value-projection/'].includes(route)) {
            await page.$eval('.ft-final-cta', e => e.scrollIntoView({ behavior: 'instant', block: 'start' }));
            await page.screenshot({ path: `${out}/${route.replaceAll('/', '-')}-${width}.png` });
          }
        } else assert.ok(['/solutions/', '/blog/', `/${data('editorial-drafts')[0].slug}/`].includes(route), `Missing CTA ${route}`);
        results.push({ route, width, ...result });
      }
    }
    assert.deepEqual(errors, []);
    fs.writeFileSync(`${out}/report.json`, JSON.stringify({ results, errors }, null, 2));
    console.log(JSON.stringify({ views: results.length, ctaViews: results.filter(r => r.cta).length, widths, errors }));
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
