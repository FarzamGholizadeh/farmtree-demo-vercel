const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const puppeteer = require('puppeteer-core');
const segments = JSON.parse(fs.readFileSync('wordpress/wp-content/plugins/farmtree-content/data/customer-segments.json'));
const base = process.argv[2] || 'http://localhost:8888/';
assert.ok(['http://localhost:8888/', 'https://farmtree.eu/'].includes(base));
(async () => {
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  const rows = [], errors = [], out = `qa/screenshots/menu-links/${base.includes('localhost') ? 'local' : 'production'}`;
  fs.mkdirSync(out, { recursive: true });
  try {
    const page = await browser.newPage();
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    if (base.includes('localhost')) await page.setCookie({ name: 'playground_auto_login_already_happened', value: '1', domain: 'localhost', path: '/' });
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', e => { if (e.type() === 'error') errors.push(e.text()); });
    for (const width of [320, 360, 375, 390, 414, 430, 768, 1024, 1280, 1440, 1920]) {
      await page.setViewport({ width, height: 1000 });
      for (const route of ['/', '/proof-stories/farm-value-projection/', '/customer-segments/investors/']) {
        assert.equal((await page.goto(new URL(route, base).href, { waitUntil: 'networkidle2' })).status(), 200);
        await page.click('.wp-block-navigation__responsive-container-open');
        await page.waitForSelector('.wp-block-navigation__responsive-container.is-menu-open');
        // Let the existing modal focus/scroll-lock animation-frame callbacks settle.
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        await new Promise(resolve => setTimeout(resolve, 600));
        const row = await page.evaluate(() => {
          const links = selector => [...document.querySelectorAll(selector + ' .wp-block-navigation__submenu-container a')].map(a => ({ label: a.textContent.trim(), href: a.getAttribute('href') }));
          const menu = document.querySelector('.wp-block-navigation__responsive-container.is-menu-open');
          return { farmtree: links('.ft-native-menu-farmtree'), segments: links('.ft-native-menu-segments'),
            overflow: menu.scrollWidth > menu.clientWidth + 1 || document.documentElement.scrollWidth > innerWidth + 1,
            emptyItems: [...menu.querySelectorAll('li')].filter(e => !e.textContent.trim()).length };
        });
        assert.deepEqual(row.farmtree.map(a => a.label), ['Platform', 'User Videos', 'Cocoa Focus', 'Case Studies']);
        assert.equal(row.segments.length, 10);
        assert.deepEqual(row.segments.map(a => a.href), segments.map(s => `/customer-segments/${s.slug}/`));
        assert.ok(row.segments.some(a => a.label === 'Investors' && a.href === '/customer-segments/investors/'));
        assert.ok(row.segments.some(a => a.label === 'Consultancy & Agroforestry Advisors'));
        assert.ok(!row.overflow && row.emptyItems === 0);
        if (route === '/' && [390, 768, 1440, 1920].includes(width)) await page.screenshot({ path: `${out}/${width}.png`, fullPage: true });
        const investor = '.ft-native-menu-segments a[href="/customer-segments/investors/"]';
        await page.$eval(investor, e => e.scrollIntoView({ behavior: 'instant', block: 'center' }));
        await new Promise(resolve => setTimeout(resolve, 600));
        if (route !== '/customer-segments/investors/') {
          console.log(`Checking Investors navigation: ${width}px ${route}`);
          // The local runtime can complete pointer navigation without satisfying
          // Puppeteer's lifecycle watcher. Check the actual destination instead.
          await page.click(investor);
          await page.waitForFunction(() => location.pathname === '/customer-segments/investors/' && document.readyState === 'complete' && !document.querySelector('.wp-block-navigation__responsive-container.is-menu-open'));
          assert.equal(await page.evaluate(async () => (await fetch(location.href)).status), 200);
        }
        assert.equal(new URL(page.url()).pathname, '/customer-segments/investors/');
        rows.push({ width, route, ...row });
      }
    }
    assert.deepEqual(errors, []);
    fs.writeFileSync(`${out}/report.json`, JSON.stringify({ rows, errors }, null, 2));
    console.log(JSON.stringify({ views: rows.length, investorPointerActivations: rows.filter(r => r.route !== '/customer-segments/investors/').length, errors }));
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
