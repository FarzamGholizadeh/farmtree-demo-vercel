/* Platform-route regression test.
   Asserts #platform always shows the Platform page and the Cocoa route
   always shows Cocoa, across direct load, hash navigation, history
   back/forward, refresh, desktop + mobile viewports.
   Fails (exit 1) on any mismatch or page error.
   Usage: node qa/tools/platform-route-regression.js [baseUrl]           */
const puppeteer = require('puppeteer-core');
const BASE = process.argv[2] || 'http://localhost:8899/index.html';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  const failures = [];
  const settle = ms => new Promise(r => setTimeout(r, ms));

  async function activePage(p) {
    return p.evaluate(() => {
      const actives = [...document.querySelectorAll('.page.active')];
      const visible = actives.filter(s => getComputedStyle(s).display !== 'none');
      return { ids: actives.map(s => s.id), visible: visible.map(s => s.id), hash: location.hash };
    });
  }
  function assert(name, cond, detail) {
    if (!cond) failures.push(`${name}: ${detail}`);
  }

  for (const [w, h, label] of [[1280, 900, 'desktop'], [390, 844, 'mobile']]) {
    const p = await browser.newPage();
    await p.setViewport({ width: w, height: h });
    p.on('pageerror', e => failures.push(`[${label}] pageerror: ${e.message.slice(0, 100)}`));

    // 1) direct #platform load shows Platform content, not Cocoa
    await p.goto(`${BASE}#platform`, { waitUntil: 'networkidle2' });
    await settle(1100);
    let s = await activePage(p);
    assert(`[${label}] direct #platform`, s.visible.length === 1 && s.visible[0] === 'page-platform',
      JSON.stringify(s));
    const platMarker = await p.evaluate(() =>
      !!document.querySelector('#page-platform .subhero') &&
      getComputedStyle(document.getElementById('page-cocoa')).display === 'none');
    assert(`[${label}] platform content visible / cocoa hidden`, platMarker, 'marker check failed');

    // 2) hash-navigate to cocoa -> cocoa active
    await p.evaluate(() => { location.hash = 'cocoa'; });
    await settle(900);
    s = await activePage(p);
    assert(`[${label}] hash -> #cocoa`, s.visible.length === 1 && s.visible[0] === 'page-cocoa', JSON.stringify(s));

    // 3) back -> platform again (history)
    await p.goBack();
    await settle(900);
    s = await activePage(p);
    assert(`[${label}] history back -> platform`, s.visible[0] === 'page-platform' && s.hash === '#platform', JSON.stringify(s));

    // 4) forward -> cocoa
    await p.goForward();
    await settle(900);
    s = await activePage(p);
    assert(`[${label}] history forward -> cocoa`, s.visible[0] === 'page-cocoa', JSON.stringify(s));

    // 5) the original stale-content defect: cocoa -> hash platform
    await p.evaluate(() => { location.hash = 'platform'; });
    await settle(900);
    s = await activePage(p);
    assert(`[${label}] cocoa -> hash #platform (stale-state defect)`,
      s.visible.length === 1 && s.visible[0] === 'page-platform', JSON.stringify(s));

    // 6) refresh persistence on #platform
    await p.reload({ waitUntil: 'networkidle2' });
    await settle(1100);
    s = await activePage(p);
    assert(`[${label}] refresh on #platform`, s.visible[0] === 'page-platform' && s.hash === '#platform', JSON.stringify(s));

    // 7) repeated platform <-> home <-> track
    for (const r of ['home', 'platform', 'track', 'platform']) {
      await p.evaluate(hh => { location.hash = hh; }, r);
      await settle(600);
    }
    s = await activePage(p);
    assert(`[${label}] repeated route changes end on platform`, s.visible[0] === 'page-platform', JSON.stringify(s));

    // 8) mobile menu Platform button (final product decision 2026-07:
    //    this is a platform-ENTRY control -> external tool Login;
    //    the #platform ROUTE itself stays internal, asserted above)
    if (label === 'mobile') {
      await p.evaluate(() => { location.hash = 'home'; });
      await settle(600);
      const navs = [];
      await p.setRequestInterception(true);
      const onReq = r => { if (r.isNavigationRequest() && r.url().startsWith('https://tool.farmtree.earth')) { navs.push(r.url()); r.abort(); } else r.continue(); };
      p.on('request', onReq);
      await p.evaluate(() => document.getElementById('openMenu')?.click());
      await settle(400);
      await p.evaluate(() => { [...document.querySelectorAll('.mobile-card button')].find(b => b.textContent.trim() === 'Platform')?.click(); });
      await settle(800);
      assert('[mobile] menu Platform button -> external Login',
        navs.length === 1 && navs[0] === 'https://tool.farmtree.earth/Identity/Account/Login',
        JSON.stringify(navs));
      p.off('request', onReq);
      await p.setRequestInterception(false);
    }
    await p.close();
  }

  await browser.close();
  if (failures.length) { console.error('FAIL:'); failures.forEach(f => console.error(' -', f)); process.exit(1); }
  console.log('PASS: #platform and Cocoa routes deterministic across all scenarios, both viewports.');
})().catch(e => { console.error('TEST CRASH:', e.message); process.exit(1); });
