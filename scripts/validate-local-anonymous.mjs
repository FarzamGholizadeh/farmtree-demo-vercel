import { readFile } from 'node:fs/promises';

const baseUrl = new URL(process.env.FARMTREE_LOCAL_WP_URL ?? 'http://localhost:8888');
if (!['127.0.0.1', 'localhost', '::1'].includes(baseUrl.hostname)) {
  throw new Error('Anonymous local QA refuses to inspect a non-loopback host.');
}

const headers = {
  // Prevent WordPress Playground's development-only auto-login redirect without
  // supplying a WordPress authentication cookie. Requests remain anonymous.
  Cookie: 'playground_auto_login_already_happened=1'
};

const loadJson = (path) => readFile(new URL(path, import.meta.url), 'utf8').then(JSON.parse);
const [pages, proofs, segments, articles] = await Promise.all([
  loadJson('../wordpress/wp-content/plugins/farmtree-content/data/english-pages.json'),
  loadJson('../wordpress/wp-content/plugins/farmtree-content/data/proof-stories.json'),
  loadJson('../wordpress/wp-content/plugins/farmtree-content/data/customer-segments.json'),
  loadJson('../wordpress/wp-content/plugins/farmtree-content/data/editorial-drafts.json')
]);

const targetRoutes = [
  '/',
  ...pages.map(({ slug }) => `/${slug}/`),
  '/news-insights/',
  ...proofs.map(({ slug }) => `/proof-stories/${slug}/`),
  ...segments.map(({ slug }) => `/customer-segments/${slug}/`),
  ...articles.map(({ slug, sourceDate }) => `/${sourceDate.replaceAll('-', '/')}/${slug}/`)
];

async function fetchLocal(path, options = {}) {
  const response = await fetch(new URL(path, baseUrl), {
    redirect: 'manual',
    ...options,
    headers: { ...headers, ...options.headers }
  });
  return { response, body: await response.text() };
}

const routeResults = await Promise.all(targetRoutes.map(async (path) => {
  const { response, body } = await fetchLocal(path);
  const problems = [];
  if (response.status !== 200) problems.push(`HTTP ${response.status}`);
  if (!/\bnoindex\b/i.test(response.headers.get('x-robots-tag') ?? '') || !/\bnofollow\b/i.test(response.headers.get('x-robots-tag') ?? '')) problems.push('no X-Robots-Tag noindex,nofollow');
  if (!/<meta name=['"]robots['"][^>]*content=['"][^'"]*noindex/i.test(body)) problems.push('no noindex meta');
  if (/PHP (?:Warning|Fatal error)|<b>(?:Warning|Fatal error)<\/b>/i.test(body)) problems.push('PHP runtime error');
  if ((body.match(/<h1\b/gi) ?? []).length !== 1) problems.push('not exactly one H1');
  return { path, status: response.status, body, problems };
}));

const failures = routeResults.filter(({ problems }) => problems.length > 0);
if (failures.length > 0) {
  throw new Error(`Anonymous route failures: ${JSON.stringify(failures.map(({ path, problems }) => ({ path, problems })), null, 2)}`);
}

const homepage = routeResults.find(({ path }) => path === '/')?.body ?? '';
for (const article of articles) {
  if (!homepage.includes(`/${article.slug}/`)) throw new Error(`Homepage News omits: ${article.slug}`);
}
if ((homepage.match(/class="[^"\n]*ft-news-item/g) ?? []).length !== 9) throw new Error('Homepage News does not render exactly nine cards.');
if ((homepage.match(/class="[^"\n]*wp-block-post-featured-image/g) ?? []).length < 9) throw new Error('Homepage News cards are missing featured images.');
if ((homepage.match(/>Read article<span class="screen-reader-text">/g) ?? []).length !== 9) throw new Error('Homepage News cards do not each expose the Read article CTA.');
if ((homepage.match(/class="[^"\n]*wp-block-post-terms/g) ?? []).length < 9) throw new Error('Homepage News cards are missing topics.');
if ((homepage.match(/<time\b/g) ?? []).length < 9) throw new Error('Homepage News cards are missing publication dates.');
if ((homepage.match(/class="[^"\n]*wp-block-post-excerpt/g) ?? []).length < 9) throw new Error('Homepage News cards are missing excerpts.');
if ((homepage.match(/\bsrcset=/g) ?? []).length < 9) throw new Error('Homepage News images are missing responsive srcset attributes.');
if ((homepage.match(/<img\b[^>]*\bwidth=/g) ?? []).length < 9 || (homepage.match(/<img\b[^>]*\bheight=/g) ?? []).length < 9) {
  throw new Error('Homepage News images are missing intrinsic dimensions.');
}

const restChecks = [
  ['/wp-json/wp/v2/pages?per_page=100', [...pages.map(({ slug }) => slug), 'news-insights', 'farmtree-native-local-home']],
  ['/wp-json/wp/v2/proof-stories?per_page=100', proofs.map(({ slug }) => slug)],
  ['/wp-json/wp/v2/customer-segments?per_page=100', segments.map(({ slug }) => slug)],
  ['/wp-json/wp/v2/posts?per_page=100', articles.map(({ slug }) => slug)]
];
for (const [path, expectedSlugs] of restChecks) {
  const { response, body } = await fetchLocal(path);
  const items = JSON.parse(body);
  if (response.status !== 200 || !Array.isArray(items)) throw new Error(`Anonymous REST collection failed: ${path}`);
  for (const slug of expectedSlugs) {
    const item = items.find((candidate) => candidate.slug === slug);
    if (!item || item.status !== 'publish') throw new Error(`Published anonymous REST item missing: ${slug}`);
  }
}

const { body: publicPostsBody } = await fetchLocal('/wp-json/wp/v2/posts?slug=hello-world');
if (JSON.parse(publicPostsBody).length !== 0) throw new Error('Default Hello world post is still anonymously public.');

for (const reserved of ['/nl/', '/de/']) {
  const { response } = await fetchLocal(reserved);
  if (response.status !== 404) throw new Error(`Reserved locale must remain unpublished: ${reserved} returned ${response.status}`);
}

const internalPaths = new Set();
for (const { body } of routeResults) {
  for (const match of body.matchAll(/href=["']([^"']+)["']/g)) {
    const href = match[1].replaceAll('&amp;', '&');
    const url = new URL(href, baseUrl);
    if (url.origin !== baseUrl.origin || url.pathname.startsWith('/wp-admin/') || url.pathname.startsWith('/wp-json/')) continue;
    internalPaths.add(`${url.pathname}${url.search}`);
  }
}
const linkResults = await Promise.all(Array.from(internalPaths, async (path) => {
  const { response } = await fetchLocal(path, { method: 'HEAD' });
  return { path, status: response.status };
}));
const brokenLinks = linkResults.filter(({ status }) => status >= 400);
if (brokenLinks.length > 0) throw new Error(`Broken internal links: ${JSON.stringify(brokenLinks, null, 2)}`);

console.log(JSON.stringify({
  anonymous: true,
  targetRoutes: targetRoutes.length,
  routeStatus: Object.fromEntries(routeResults.map(({ path, status }) => [path, status])),
  published: { pages: pages.length + 2, proofStories: proofs.length, customerSegments: segments.length, news: articles.length },
  homepageNews: { cards: 9, featuredImages: 9, topics: 9, excerpts: 9, dates: 9, ctas: 9, responsiveImages: true },
  checkedInternalLinks: linkResults.length,
  brokenInternalLinks: brokenLinks.length,
  noindex: { meta: true, xRobotsTag: 'noindex, nofollow', searchVisibility: 'disabled' },
  reservedLocales: { nl: 404, de: 404 },
  defaultSamplePost: 'not public'
}, null, 2));
