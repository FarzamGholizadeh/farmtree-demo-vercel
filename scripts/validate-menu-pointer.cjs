const assert = require('node:assert/strict');
const fs = require('node:fs');
const puppeteer = require('../qa/tools/node_modules/puppeteer-core');
const menu = '.wp-block-navigation__responsive-container.is-menu-open';
const links = `${menu} .wp-block-navigation__container a`;
const investor = `${menu} .ft-native-menu-segments a[href="/customer-segments/investors/"]`;
const pause = () => new Promise(resolve => setTimeout(resolve, 700));

(async () => {
  const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  const rows = [], errors = [];
  try {
    for (const width of [320, 360, 390, 414]) for (const mode of ['mouse', 'touch']) {
      const page = await browser.newPage();
      page.on('pageerror', e => errors.push(e.message));
      page.on('console', e => { if (e.type() === 'error') errors.push(e.text()); });
      await page.setViewport({ width, height: 1000, isMobile: mode === 'touch', hasTouch: mode === 'touch' });
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      await page.setCookie({ name: 'playground_auto_login_already_happened', value: '1', domain: 'localhost', path: '/' });
      const activate = selector => mode === 'touch' ? page.tap(selector) : page.click(selector);
      const open = async () => {
        await activate('.wp-block-navigation__responsive-container-open');
        await page.waitForSelector(menu);
        await pause();
        assert.equal(await page.$$eval(menu, els => els.length), 1);
      };
      await page.goto('http://localhost:8888/', { waitUntil: 'networkidle2' });
      await open();
      // Check real pointer dispatch for every link without opening external
      // accounts/mail clients or submitting anything. Destination checks follow.
      await page.evaluate(selector => {
        window.menuHits = [];
        window.captureMenuHit = e => {
          const a = e.target.closest(selector);
          if (a) { window.menuHits.push({ label: a.textContent.trim(), trusted: e.isTrusted }); e.preventDefault(); e.stopImmediatePropagation(); }
        };
        document.addEventListener('click', window.captureMenuHit, true);
      }, links);
      const count = await page.$$eval(links, els => els.length);
      const geometry = [];
      for (let i = 0; i < count; i++) {
        const handle = (await page.$$(links))[i];
        await handle.evaluate(e => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
        await pause();
        const g = await handle.evaluate(e => {
          const r = e.getBoundingClientRect(), s = getComputedStyle(e), hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
          return { label: e.textContent.trim(), width: r.width, height: r.height, hit: e === hit || e.contains(hit), inert: !!e.closest('[inert]'), pointer: s.pointerEvents, overflow: document.documentElement.scrollWidth > innerWidth + 1 };
        });
        assert.ok(g.hit && !g.inert && g.pointer !== 'none' && !g.overflow, JSON.stringify(g));
        assert.ok(g.width >= 24 && g.height >= 24, JSON.stringify(g));
        mode === 'touch' ? await handle.tap() : await handle.click();
        assert.equal(await page.evaluate(() => window.menuHits.length), i + 1);
        geometry.push(g);
      }
      assert.ok(await page.evaluate(() => window.menuHits.every(hit => hit.trusted)));
      await page.evaluate(() => document.removeEventListener('click', window.captureMenuHit, true));
      await page.$eval(investor, e => e.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await pause();
      await activate(investor);
      await page.waitForFunction(() => location.pathname === '/customer-segments/investors/' && document.readyState === 'complete' && !document.querySelector('.is-menu-open'));
      assert.equal(await page.evaluate(async () => (await fetch(location.href)).status), 200);
      await open();
      // Traverse the complete native tab order, including focus trapping.
      const order = await page.$$eval(`${menu} a[href], ${menu} button`, els => els.filter(e => !e.hidden && e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden' && e.tabIndex >= 0).map((e, i) => { e.dataset.testFocus = String(i); return String(i); }));
      await page.focus(`${menu} [data-test-focus="0"]`);
      for (let i = 1; i <= order.length; i++) {
        await page.keyboard.press('Tab');
        assert.equal(await page.evaluate(() => document.activeElement.dataset.testFocus), order[i % order.length]);
      }
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => !document.querySelector('.is-menu-open'));
      await pause();
      assert.ok(await page.$eval('.wp-block-navigation__responsive-container-open', e => document.activeElement === e));
      await page.goto('http://localhost:8888/', { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('.ft-native-menu-topbar');
      await open();
      await page.focus(investor);
      await page.keyboard.press('Enter');
      await page.waitForFunction(() => location.pathname === '/customer-segments/investors/' && document.readyState === 'complete' && !document.querySelector('.is-menu-open'));
      rows.push({ width, mode, links: count, geometry, keyboard: 'pass', destination: 'pass' });
      console.log(`${width}px ${mode}: ${count} trusted link activations, Investors navigation and keyboard PASS`);
      await page.close();
    }
    assert.deepEqual(errors, []);
    fs.mkdirSync('qa/screenshots/menu-links', { recursive: true });
    fs.writeFileSync('qa/screenshots/menu-links/pointer-report.json', JSON.stringify({ rows, errors }, null, 2));
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
