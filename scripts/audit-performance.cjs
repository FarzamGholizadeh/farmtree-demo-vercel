// Repeatable cold-cache lab observations; never label these as field CWV/INP.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const puppeteer = require('puppeteer-core');
const base = process.argv[2] || 'http://localhost:8888/';
assert(['http://localhost:8888/', 'https://farmtree.eu/'].includes(base));
const articles = JSON.parse(fs.readFileSync('wordpress/wp-content/plugins/farmtree-content/data/editorial-drafts.json'));
const routes = ['/', '/platform/', '/customer-segments/investors/', '/proof-stories/farm-value-projection/', '/blog/', `/${articles[0].slug}/`];
const out = `qa/live-360/performance-${base.includes('localhost') ? 'local' : 'production'}.json`;
const report = { base, started: new Date().toISOString(), methodology: 'Three fresh browser-context/cold-cache runs per route and viewport. Mobile390: CPU4x, latency150ms/down1.6Mbps/up750Kbps. Desktop1440: unthrottled. Observe8s after DOMContentLoaded then menu click/Escape event-duration sample. Incomplete native load is a failed gate, not a passing truncated LCP sample. Not field CWV or statistically representative INP.', rows: [], errors: [] };
fs.mkdirSync('qa/live-360', { recursive: true });
(async () => {
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  try {
    for (const width of [390, 1440]) for (const route of routes) for (let run = 1; run <= 3; run++) {
      const context = await browser.createBrowserContext();
      const page = await context.newPage();
      let recording = true;
      const pendingRequests = new Map();
      page.on('request', request => pendingRequests.set(request, { url: request.url(), type: request.resourceType() }));
      page.on('requestfinished', request => pendingRequests.delete(request));
      page.on('requestfailed', request => {
        pendingRequests.delete(request);
        if (recording) report.errors.push({ route, width, run, type: 'requestfailed', url: request.url(), message: request.failure()?.errorText });
      });
      page.on('console', message => {
        if (recording && message.type() === 'error') report.errors.push({ route, width, run, type: 'console', message: message.text() });
      });
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
          window.lab = { lcp: 0, cls: 0, layoutShiftSum: 0, shifts: [], longTasks: [], interactions: [], lcpElement: null };
          let shiftWindowStart = 0, previousShift = 0, shiftWindowValue = 0;
          new PerformanceObserver(l => { for (const e of l.getEntries()) { window.lab.lcp = e.startTime; window.lab.lcpElement = { tag: e.element?.tagName, className: e.element?.className, source: e.element?.currentSrc }; } }).observe({ type: 'largest-contentful-paint', buffered: true });
          // CLS is maximum session window, not lifetime shift sum:
          // https://web.dev/articles/cls (1s gap / 5s maximum window).
          new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) {
            if (!shiftWindowValue || e.startTime - previousShift >= 1000 || e.startTime - shiftWindowStart >= 5000) { shiftWindowStart = e.startTime; shiftWindowValue = 0; }
            shiftWindowValue += e.value; previousShift = e.startTime;
            window.lab.cls = Math.max(window.lab.cls, shiftWindowValue);
            window.lab.layoutShiftSum += e.value;
            window.lab.shifts.push({ time: e.startTime, value: e.value, sources: e.sources.map(s => ({ tag: s.node?.tagName, className: s.node?.className, previous: s.previousRect.toJSON(), current: s.currentRect.toJSON() })) });
          } }).observe({ type: 'layout-shift', buffered: true });
          new PerformanceObserver(l => { for (const e of l.getEntries()) window.lab.longTasks.push(e.duration); }).observe({ type: 'longtask', buffered: true });
          new PerformanceObserver(l => { for (const e of l.getEntries()) if (e.interactionId) window.lab.interactions.push({ name: e.name, duration: e.duration }); }).observe({ type: 'event', buffered: true, durationThreshold: 16 });
        });
        const response = await page.goto(new URL(route, base).href, { waitUntil: 'domcontentloaded', timeout: 90000 });
        assert.equal(response.status(), 200, `Unexpected HTTP status for ${route}`);
        await new Promise(r => setTimeout(r, 8000));
        const load = await page.evaluate(() => ({ ...window.lab, loadComplete: document.readyState === 'complete', navigation: performance.getEntriesByType('navigation').map(n => ({ ttfb: n.responseStart, dom: n.domContentLoadedEventEnd, load: n.loadEventEnd })), resources: performance.getEntriesByType('resource').map(r => ({ url: r.name, bytes: r.transferSize, duration: r.duration, initiator: r.initiatorType })) }));
        load.pendingRequests = [...pendingRequests.values()];
        await page.click('.wp-block-navigation__responsive-container-open');
        await page.waitForSelector('.is-menu-open');
        await page.keyboard.press('Escape');
        await new Promise(r => setTimeout(r, 250));
        report.rows.push({ route, width, run, status: response.status(), ...load, menuEvents: await page.evaluate(() => window.lab.interactions), interactionCount: await page.evaluate(() => performance.interactionCount ?? null) });
        console.log(`${width} ${route} run${run}: LCP=${load.lcp.toFixed(0)}ms CLS=${load.cls.toFixed(4)}`);
      } catch (error) {
        report.failedRun = { route, width, run, pendingRequests: [...pendingRequests.values()], diagnostic: await page.evaluate(() => ({ url: location.href, readyState: document.readyState, lab: window.lab, resources: performance.getEntriesByType('resource').map(r => ({ url: r.name, bytes: r.transferSize, duration: r.duration })) })).catch(() => null) };
        throw error;
      } finally { recording = false; await context.close(); fs.writeFileSync(out, JSON.stringify(report, null, 2)); }
    }
  } finally { await browser.close(); }
  report.finished = new Date().toISOString();
  report.summary = [];
  for (const width of [390, 1440]) for (const route of routes) {
    const rows = report.rows.filter(r => r.width === width && r.route === route);
    const median = key => rows.map(r => r[key]).sort((a, b) => a - b)[1];
    const events = rows.flatMap(r => r.menuEvents);
    const maxObservedMenuEventMs = events.length ? Math.max(...events.map(e => e.duration)) : null;
    report.summary.push({ route, width, completeLoads: rows.filter(r => r.loadComplete).length, medianLCP: median('lcp'), medianCLS: median('cls'), maxObservedMenuEventMs, interactionEvidence: events.length ? 'Observed trusted menu event durations; not field INP' : 'No >=16ms event entry captured; no field INP claim', pass: rows.length === 3 && rows.every(r => r.loadComplete) && median('lcp') > 0 && median('lcp') <= 2500 && median('cls') <= 0.1 && (maxObservedMenuEventMs === null || maxObservedMenuEventMs <= 200) });
  }
  fs.writeFileSync(out, JSON.stringify(report, null, 2));
  if (report.errors.length || report.summary.some(r => !r.pass)) process.exitCode = 1;
})().catch(e => { report.exception = e.stack; fs.writeFileSync(out, JSON.stringify(report, null, 2)); console.error(e); process.exitCode = 1; });
