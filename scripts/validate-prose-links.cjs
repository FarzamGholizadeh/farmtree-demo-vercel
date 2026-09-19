// Read-only live/local regression for non-color prose-link distinction.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const puppeteer = require('puppeteer-core');
const base = process.argv[2] || 'http://localhost:8888/';
assert.ok(['http://localhost:8888/', 'https://farmtree.eu/'].includes(base));
const prose = '.ft-native-page-main .wp-block-post-content :where(p, .wp-block-list) a:not(.wp-element-button, .wp-block-button__link)';
const controls = '.wp-block-button__link, .wp-element-button, .wp-block-navigation a, .ft-proof-card, .ft-proof-card a, .wp-block-post-title a';
(async () => {
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  const rows = [], errors = [];
  try {
    const page = await browser.newPage();
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', e => { if (e.type() === 'error') errors.push(e.text()); });
    if (base.includes('localhost')) await page.setCookie({ name: 'playground_auto_login_already_happened', value: '1', domain: 'localhost', path: '/' });
    for (const width of [320, 1440]) for (const route of ['platform/', 'solutions/', 'customer-segments/investors/', 'proof-stories/farm-value-projection/', '']) {
      await page.setViewport({ width, height: 1000 });
      assert.equal((await page.goto(base + route, { waitUntil: 'networkidle2' })).status(), 200);
      await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
      const result = await page.evaluate(async ({ prose, controls }) => {
        const anchors = [...document.querySelectorAll(prose)];
        const links = anchors.map(e => ({ label: e.textContent.trim(), href: e.getAttribute('href'), decoration: getComputedStyle(e).textDecorationLine }));
        const controlLinks = [...document.querySelectorAll(controls)].map(e => ({ label: e.textContent.trim().slice(0,70), matchesProse: e.matches(prose), decoration: getComputedStyle(e).textDecorationLine }));
        const audit = await axe.run(document, { runOnly: { type: 'rule', values: ['link-in-text-block'] } });
        return { links, controlLinks, violations: audit.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) })), overflow: document.documentElement.scrollWidth > innerWidth + 1 };
      }, { prose, controls });
      for (const link of result.links) assert.ok(link.decoration.includes('underline'), `${route}: ${link.label} lacks distinction`);
      for (const link of result.controlLinks) assert.equal(link.matchesProse, false, `Prose fix reaches control ${link.label}`);
      if (['platform/', 'solutions/', 'customer-segments/investors/'].includes(route)) assert.ok(result.links.length >= 3, `Missing expected prose links on ${route}`);
      assert.deepEqual(result.violations, [], `${route} link-in-text-block`);
      assert.equal(result.overflow, false);
      rows.push({ width, route, ...result });
    }
    assert.deepEqual(errors, []);
    fs.mkdirSync('qa/live-360/prose-links', { recursive: true });
    const target = base.includes('localhost') ? 'local' : 'production';
    fs.writeFileSync(`qa/live-360/prose-links/${target}.json`, JSON.stringify({ base, rows, errors }, null, 2));
    console.log(`PASS: ${rows.length} prose-link views; no control-selector overlap, accessibility violations, overflow or console errors.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
