// Repeatable cold-cache lab observations; never label these as field CWV/INP.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const puppeteer = require('puppeteer-core');
const base = process.argv[2] || 'http://localhost:8888/';
assert(['http://localhost:8888/', 'https://farmtree.eu/'].includes(base));
const articles = JSON.parse(fs.readFileSync('wordpress/wp-content/plugins/farmtree-content/data/editorial-drafts.json'));
const routes = ['/', '/platform/', '/customer-segments/investors/', '/proof-stories/farm-value-projection/', '/blog/', `/${articles[0].slug}/`];
const out = `qa/live-360/performance-${base.includes('localhost') ? 'local' : 'production'}.json`;
const report = { base, started: new Date().toISOString(), methodology: 'Three fresh browser-context/cold-cache runs per route and viewport. Mobile390: CPU4x, latency150ms/down1.6Mbps/up750Kbps. Desktop1440: unthrottled. LCP/CLS load window8s then menu click/Escape event-duration sample. Not field CWV or statistically representative INP.', rows: [], errors: [] };
fs.mkdirSync('qa/live-360', { recursive: true });
(async () => {
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  try {
    for (const width of [390, 1440]) for (const route of routes) for (let run = 1; run <= 3; run++) {
      const context = await browser.createBrowserContext();
      const page = await context.newPage();
      try {
        await page.setViewport({ width, height: 900, deviceScaleFactor: width === 390 ? 2 : 1 });
        await page.setCacheEnabled(false);
        if (base.includes('localhost')) await page.setCookie({ name: 'playground_auto_login_already_happened', value: '1', domain: 'localhost', path: '/' });
        const cdp = await page.createCDPSession();
        if (width === 390) {
          await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
          await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1600000 / 8, uploadThroughput: 750000 / 8 });
        }
        page.on('pageerror', e => report.errors.push({ route, width, run, message: e.message }));
        await page.evaluateOnNewDocument(() => {
          window.lab = { lcp: 0, cls: 0, longTasks: [], interactions: [], lcpElement: null };
          new PerformanceObserver(l => { for (const e of l.getEntries()) { window.lab.lcp = e.startTime; window.lab.lcpElement = { tag: e.element?.tagName, className: e.element?.className, source: e.element?.currentSrc }; } }).observe({ type: 'largest-contentful-paint', buffered: true });
          new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.lab.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
          new PerformanceObserver(l => { for (const e of l.getEntries()) window.lab.longTasks.push(e.duration); }).observe({ type: 'longtask', buffered: true });
          new PerformanceObserver(l => { for (const e of l.getEntries()) if (e.interactionId) window.lab.interactions.push({ name: e.name, duration: e.duration }); }).observe({ type: 'event', buffered: true, durationThreshold: 16 });
        });
        const response = await page.goto(new URL(route, base).href, { waitUntil: 'load', timeout: 90000 });
        await new Promise(r => setTimeout(r, 8000));
        const load = await page.evaluate(() => ({ ...window.lab, navigation: performance.getEntriesByType('navigation').map(n => ({ ttfb: n.responseStart, dom: n.domContentLoadedEventEnd })), resources: performance.getEntriesByType('resource').map(r => ({ url: r.name, bytes: r.transferSize, duration: r.duration, initiator: r.initiatorType })) }));
        await page.click('.wp-block-navigation__responsive-container-open');
        await page.waitForSelector('.is-menu-open');
        await page.keyboard.press('Escape');
        await new Promise(r => setTimeout(r, 250));
        report.rows.push({ route, width, run, status: response.status(), ...load, menuEvents: await page.evaluate(() => window.lab.interactions) });
        console.log(`${width} ${route} run${run}: LCP=${load.lcp.toFixed(0)}ms CLS=${load.cls.toFixed(4)}`);
      } finally { await context.close(); fs.writeFileSync(out, JSON.stringify(report, null, 2)); }
    }
  } finally { await browser.close(); }
  report.finished = new Date().toISOString();
  report.summary = [];
  for (const width of [390, 1440]) for (const route of routes) {
    const rows = report.rows.filter(r => r.width === width && r.route === route);
    const median = key => rows.map(r => r[key]).sort((a, b) => a - b)[1];
    report.summary.push({ route, width, medianLCP: median('lcp'), medianCLS: median('cls'), pass: median('lcp') > 0 && median('lcp') <= 2500 && median('cls') <= 0.1 });
  }
  fs.writeFileSync(out, JSON.stringify(report, null, 2));
  if (report.errors.length || report.summary.some(r => !r.pass)) process.exitCode = 1;
})().catch(e => { report.exception = e.stack; fs.writeFileSync(out, JSON.stringify(report, null, 2)); console.error(e); process.exitCode = 1; });
