import assert from 'node:assert/strict';

const base = new URL(process.env.FARMTREE_LOCAL_WP_URL ?? 'http://localhost:8888');
assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(base.hostname), 'This verification is loopback-only');
let count = 0;
for (const [route, expected] of [['/', 11], ['/platform/', 1], ['/solutions/', 2], ['/proof-stories/', 2], ['/customer-segments/', 2], ['/blog/', 10]]) {
  const response = await fetch(new URL(route, base), {
    redirect: 'manual', signal: AbortSignal.timeout(30000),
    // Skip Playground auto-login without supplying any authentication cookie.
    headers: { Cookie: 'playground_auto_login_already_happened=1' }
  });
  assert.equal(response.status, 200, route);
  const html = await response.text();
  const pictures = [...html.matchAll(/<picture class="ft-documentary-picture">([\s\S]*?)<\/picture>/g)];
  assert.equal(pictures.length, expected, route);
  for (const [index, [, picture]] of pictures.entries()) {
    const image = picture.match(/<img\b[^>]+>/)?.[0] ?? '';
    assert.match(image, /alt="[^"]+"/, route);
    assert.match(image, /width="(?:1200|1920)"/, route);
    assert.match(image, /height="(?:900|1080)"/, route);
    assert.match(picture, /type="image\/avif"/, route);
    assert.match(picture, /type="image\/webp"/, route);
    assert.match(image, /src="[^"]+\.jpg"/, route);
    assert.match(image, /sizes="[^"]+"/, route);
    if (route === '/' && index === 0) {
      assert.match(image, /loading="eager"/, route);
      assert.match(image, /fetchpriority="high"/, route);
    } else {
      assert.match(image, /loading="lazy"/, route);
      assert.doesNotMatch(image, /fetchpriority="high"/, route);
    }
    count++;
  }
}
console.log(JSON.stringify({ status: 'pass', routes: 6, pictures: count, responsiveFormats: ['avif', 'webp', 'jpeg'], loading: 'verified' }));
