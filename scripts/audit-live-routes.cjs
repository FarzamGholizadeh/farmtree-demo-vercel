// Read-only public discovery/link crawl. No form submissions or WP writes.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const puppeteer = require('puppeteer-core');
const base = 'https://farmtree.eu';
const out = process.argv[2] || 'qa/live-360/routes-production';
assert(out.startsWith('qa/'));
fs.mkdirSync(out, { recursive: true });
const data = name => JSON.parse(fs.readFileSync(`wordpress/wp-content/plugins/farmtree-content/data/${name}.json`));
const routes = new Set(['/', '/news-insights/', ...data('english-pages').map(x => `/${x.slug}/`), ...data('proof-stories').map(x => `/proof-stories/${x.slug}/`), ...data('customer-segments').map(x => `/customer-segments/${x.slug}/`), ...data('editorial-drafts').map(x => `/${x.slug}/`)]);
const report = { started: new Date().toISOString(), routes: [], sitemaps: [], links: [], expected404s: [], failures: [] };
const save = () => fs.writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 2));
async function get(url) {
  const chain = [];
  for (let n = 0; n < 8; n++) {
    assert.equal(new URL(url).origin, base, 'Unexpected cross-origin redirect');
    const r = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(30000) });
    chain.push({ url, status: r.status });
    if (r.status >= 300 && r.status < 400 && r.headers.get('location')) { url = new URL(r.headers.get('location'), url).href; await r.body?.cancel(); continue; }
    return { url, status: r.status, chain, xRobots: r.headers.get('x-robots-tag'), body: await r.text() };
  }
  throw Error('Redirect loop');
}
(async () => {
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  try {
    const page = await browser.newPage(); // Detached HTML parsing only; no page scripts/resources execute.
    const robots = await get(`${base}/robots.txt`);
    report.robots = { status: robots.status, body: robots.body };
    if (robots.status !== 200 || /^Disallow:\s*\/\s*$/mi.test(robots.body)) report.failures.push({ reason: 'Public robots.txt blocks crawling or unavailable' });
    const root = await get(`${base}/wp-sitemap.xml`);
    assert.equal(root.status, 200);
    for (const [, loc] of root.body.matchAll(/<loc>(.*?)<\/loc>/g)) {
      const sitemap = await get(loc); assert.equal(sitemap.status, 200);
      const urls = [...sitemap.body.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
      report.sitemaps.push({ url: loc, urls });
      for (const url of urls) { assert.equal(new URL(url).origin, base); routes.add(new URL(url).pathname); }
    }
    const destinations = new Set();
    for (const route of routes) {
      const r = await get(base + route);
      const parsed = await page.evaluate(html => {
        const d = new DOMParser().parseFromString(html, 'text/html');
        const all = s => [...d.querySelectorAll(s)];
        return { title: d.title, description: d.querySelector('meta[name="description"]')?.content, robots: d.querySelector('meta[name="robots"]')?.content, canonicals: all('link[rel="canonical"]').map(e => e.getAttribute('href')), h1: all('h1').map(e => e.textContent.trim()), links: all('a[href]').map(e => e.getAttribute('href')), schema: all('script[type="application/ld+json"]').map(e => { try { return JSON.parse(e.textContent); } catch { return { invalid: true }; } }) };
      }, r.body);
      report.routes.push({ route, status: r.status, finalURL: r.url, chain: r.chain, xRobots: r.xRobots, ...parsed });
      if (r.status !== 200 || !parsed.title || !parsed.description || /noindex/i.test(`${r.xRobots} ${parsed.robots}`) || parsed.canonicals.length !== 1 || parsed.h1.length !== 1 || parsed.schema.some(s => s.invalid)) report.failures.push({ route, reason: 'Status/title/description/indexability/canonical/H1/schema' });
      for (const href of parsed.links) {
        const url = new URL(href, r.url);
        if (url.origin === base && !url.pathname.startsWith('/wp-admin') && url.pathname !== '/wp-login.php') { url.hash = ''; destinations.add(url.href); }
      }
      save();
    }
    for (const url of destinations) { const r = await get(url); report.links.push({ url, status: r.status, finalURL: r.url }); if (r.status !== 200) report.failures.push({ url, reason: `Internal link HTTP${r.status}` }); }
    const sitemapURLs = report.sitemaps.flatMap(s => s.urls);
    if (sitemapURLs.includes(`${base}/news-insights/`) || !sitemapURLs.includes(`${base}/blog/`)) report.failures.push({ reason: 'Duplicate News sitemap ownership mismatch' });
    for (const route of ['/nl/', '/de/', '/live-360-confirmed-nonexistent-route/']) { const r = await get(base + route); report.expected404s.push({ route, status: r.status }); if (r.status !== 404) report.failures.push({ route, reason: 'Reserved/unknown route not404' }); }
    report.finished = new Date().toISOString();
    report.summary = { routes: report.routes.length, sitemapURLs: report.sitemaps.reduce((n, s) => n + s.urls.length, 0), internalLinks: report.links.length, brokenLinks: report.links.filter(r => r.status !== 200).length, failures: report.failures.length };
    save(); console.log(report.summary);
    if (report.failures.length) process.exitCode = 1;
  } finally { await browser.close(); }
})().catch(e => { report.exception = e.stack; save(); console.error(e); process.exitCode = 1; });
