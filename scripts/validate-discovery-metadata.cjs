/* Read-only metadata integration checks. Local by default; production opt-in. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = new URL(process.env.FARMTREE_METADATA_URL || 'http://localhost:8888');
// The legacy local bootstrap does not install reconciler ownership metadata.
// Managed consolidation is tested in a disposable fixture and on production.
const managedHubs = process.env.FARMTREE_METADATA_MANAGED_HUBS === '1' || base.hostname === 'farmtree.eu';
assert(['localhost', '127.0.0.1', 'farmtree.eu'].includes(base.hostname), 'Unexpected audit host');
const articles = JSON.parse(fs.readFileSync('wordpress/wp-content/plugins/farmtree-content/data/editorial-drafts.json'));
const paths = ['/', '/platform/', '/blog/', '/news-insights/', '/category/data-evidence/', '/category/farmtree-updates/', '/category/landscape-planning/', '/category/policy-standards/', '/category/project-finance/', '/category/species-design/', ...articles.map(a => `/${a.slug}/`)];
const decode = s => s.replaceAll('&amp;', '&').replaceAll('&#038;', '&').replaceAll('&#8217;', '’').replaceAll('&quot;', '"');
const results = [];
(async () => {
  for (const pathname of paths) {
    const response = await fetch(new URL(pathname, base), { headers: { Cookie: 'playground_auto_login_already_happened=1' } });
    assert.equal(response.status, 200, pathname);
    const html = await response.text();
    const meta = name => [...html.matchAll(/<meta\b[^>]+>/g)].filter(m => new RegExp(`(?:name|property)=["']${name}["']`).test(m[0])).map(m => decode(m[0].match(/content=["']([^"']*)["']/)?.[1] || ''));
    const graphs = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].flatMap(m => JSON.parse(m[1])['@graph'] || []);
    assert.equal(meta('description').length, 1, pathname + ': description ownership');
    assert(meta('description')[0], pathname + ': description');
    assert.equal(meta('og:image').length, 1, pathname + ': image ownership');
    assert.equal(new URL(meta('og:image')[0]).origin, base.origin, 'External social image');
    assert(Number(meta('og:image:width')[0]) > 0);
    assert(Number(meta('og:image:height')[0]) > 0);
    assert(!/<title>[^<]*Farmtree/.test(html), 'Incorrect brand casing');
    const canonical = [...html.matchAll(/<link rel=['"]canonical['"] href=['"]([^'"]+)/g)].map(m => decode(m[1]));
    assert.equal(canonical.length, 1, pathname + ': one canonical owner');
    const expectedCanonical = managedHubs && pathname === '/news-insights/' ? new URL('/blog/', base).href : response.url;
    assert.equal(canonical[0], expectedCanonical, pathname + ': canonical');
    assert.equal(meta('og:url')[0], expectedCanonical, pathname + ': social identity');
    if (pathname === '/news-insights/' || pathname === '/blog/') {
      assert.equal(response.url, new URL(pathname, base).href, 'Hub route must not redirect');
      assert.equal(graphs.find(g => g['@type'] === 'WebPage').url, expectedCanonical);
      const privateHost = ['localhost', '127.0.0.1'].includes(base.hostname);
      assert.equal(/noindex/.test(meta('robots').join(',')), privateHost, 'Indexability unchanged');
    }
    const org = graphs.find(g => g['@type'] === 'Organization');
    assert.equal(org.description, 'FarmTree helps organisations plan, compare, monitor and report agroforestry investments with science-based project intelligence.');
    const article = graphs.find(g => g['@type'] === 'BlogPosting');
    if (articles.some(a => pathname === `/${a.slug}/`)) {
      assert(article, pathname + ': BlogPosting');
      assert.equal(article.headline, article.name);
      assert.match(article.datePublished, /^\d{4}-\d{2}-\d{2}T/);
      assert(html.includes(article.datePublished), pathname + ': date matches rendered time');
      assert.equal(article.image, meta('og:image')[0]);
      assert(html.includes(article.image), pathname + ': actual image');
      assert(!article.author, 'Do not infer author from administrative identity');
      assert(!article.dateModified, 'Do not imply visible editorial review date');
    }
    assert(!/PHP (Warning|Fatal error)|<b>Fatal error<\/b>/.test(html));
    results.push({ pathname, status: response.status, canonical, article: !!article });
  }
  console.log(JSON.stringify({ base: base.origin, passed: results.length, results }, null, 2));
})().catch(e => { console.error(e); process.exitCode = 1; });
