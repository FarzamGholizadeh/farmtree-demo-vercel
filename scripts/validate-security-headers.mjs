import assert from 'node:assert/strict';

const base = new URL(process.argv[2] || 'http://localhost:8888/');
assert(['localhost', '127.0.0.1', 'farmtree.eu'].includes(base.hostname));
const local = base.hostname !== 'farmtree.eu';
const routes = ['/', '/platform/', '/contact/', '/privacy/', '/category/data-evidence/', '/live360-missing-route-20260919/'];
for (const route of routes) {
  const response = await fetch(new URL(route, base), {
    headers: local ? { Cookie: 'playground_auto_login_already_happened=1' } : {},
  });
  assert.equal(response.status, route.includes('missing-route') ? 404 : 200, route);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff', route);
  assert.equal(response.headers.get('referrer-policy'), 'strict-origin-when-cross-origin', route);
  const html = await response.text();
  if (local) assert.match(response.headers.get('x-robots-tag') || '', /noindex/);
  else if (response.status === 200) {
    assert.doesNotMatch(response.headers.get('x-robots-tag') || '', /noindex/);
    assert.doesNotMatch(html, /<meta[^>]+name=['"]robots['"][^>]+content=['"][^'"]*noindex/);
  }
  assert.doesNotMatch(html, /PHP (?:Warning|Fatal error)|<b>Fatal error<\/b>/);
}
console.log(`PASS: ${routes.length} responses; nosniff/referrer policy, route status and indexing preserved (${base.origin}).`);
