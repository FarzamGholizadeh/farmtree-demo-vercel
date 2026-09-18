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
const newestHomepageArticles = [...articles]
  .sort((left, right) => right.sourceDate.localeCompare(left.sourceDate))
  .slice(0, 3);
for (const article of newestHomepageArticles) {
  if (!homepage.includes(`/${article.slug}/`)) throw new Error(`Homepage News omits: ${article.slug}`);
}
if ((homepage.match(/class="[^"\n]*ft-news-item/g) ?? []).length !== 3) throw new Error('Homepage News does not render the three-item editorial feature.');
if ((homepage.match(/class="[^"\n]*wp-block-post-featured-image/g) ?? []).length < 3) throw new Error('Homepage News cards are missing featured images.');
if ((homepage.match(/>Read article (?:↗|&#x2197;)<span class="screen-reader-text">/g) ?? []).length !== 3) throw new Error('Homepage News cards do not each expose the Read article CTA.');
if ((homepage.match(/class="[^"\n]*wp-block-post-terms/g) ?? []).length < 3) throw new Error('Homepage News cards are missing topics.');
if ((homepage.match(/<time\b/g) ?? []).length < 3) throw new Error('Homepage News cards are missing publication dates.');
if ((homepage.match(/class="[^"\n]*wp-block-post-excerpt/g) ?? []).length < 3) throw new Error('Homepage News cards are missing excerpts.');
if ((homepage.match(/\bsrcset=/g) ?? []).length < 3) throw new Error('Homepage News images are missing responsive srcset attributes.');
if ((homepage.match(/<img\b[^>]*\bwidth=/g) ?? []).length < 3 || (homepage.match(/<img\b[^>]*\bheight=/g) ?? []).length < 3) {
  throw new Error('Homepage News images are missing intrinsic dimensions.');
}

const blog = routeResults.find(({ path }) => path === '/blog/')?.body ?? '';
for (const article of articles) {
  if (!blog.includes(`/${article.slug}/`)) throw new Error(`Blog omits: ${article.slug}`);
}
if ((blog.match(/class="[^"\n]*ft-blog-featured-card/g) ?? []).length !== 1 || (blog.match(/class="[^"\n]*ft-news-item/g) ?? []).length !== 8) {
  throw new Error('Blog must render one featured article and eight editorial cards.');
}

const team = routeResults.find(({ path }) => path === '/team/')?.body ?? '';
const teamCardCount = (team.match(/class="[^"\n]*ft-team-card/g) ?? []).length;
const teamPortraitCount = (team.match(/class="[^"\n]*ft-team-portrait(?:\s|")/g) ?? []).length;
if (teamCardCount !== 10 || teamPortraitCount !== 10) {
  throw new Error('Team page must render the ten requested member cards and portrait areas.');
}
if (team.includes('ft-team-fallback')) {
  throw new Error('Team page must not render a fallback portrait when all ten supplied portraits are available.');
}
for (const contract of ['ft-team-hero', 'Illustrative field collaboration', 'Maximilian Michael Möller', 'Chief Growth Officer', 'https://www.linkedin.com/in/maximilian-michael-moeller/', 'maximilian-michael-moeller-800.jpg', 'Germaine van Teeffelen', 'Interim Project Manager', 'https://www.linkedin.com/in/germaine-van-teeffelen/', 'germaine-van-teeffelen-800.jpg']) {
  if (!team.includes(contract)) throw new Error(`Team page is missing: ${contract}`);
}
let previousTeamIndex = -1;
for (const name of ['Arnoud Braun', 'Maximilian Michael Möller', 'Frank van Schoubroeck', 'Germaine van Teeffelen', 'Irene Vinkenburg', 'Betelehem Beyene']) {
  const memberIndex = team.indexOf(name);
  if (memberIndex <= previousTeamIndex) throw new Error(`Team desktop order is incorrect at: ${name}`);
  previousTeamIndex = memberIndex;
}
for (const removedName of ['Mia Beyens', 'Ruben van Voorst', 'Nikolaos Mantzaridis', 'Mary Theodorah Ajal', 'Crésus Odjo']) {
  if (team.includes(removedName)) throw new Error(`Team page still exposes removed member: ${removedName}`);
}

for (const segment of segments) {
  const body = routeResults.find(({ path }) => path === `/customer-segments/${segment.slug}/`)?.body ?? '';
  if (!body.includes('ft-segment-intro-image') || !/class="[^"\n]*ft-segment-intro-image[^"\n]*"[\s\S]*?<img\b/.test(body)) {
    throw new Error(`Customer segment is missing its distinct hero image: ${segment.slug}`);
  }
}

const restChecks = [
  ['/wp-json/wp/v2/pages?per_page=100', [...pages.map(({ slug }) => slug), 'news-insights', 'home']],
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

for (const [legacyPath, destinationPath] of [
  ['/proof-stories/farm-value-modelling/', '/proof-stories/farm-value-projection/'],
  ['/proof-stories/water-landscape-resilience/', '/proof-stories/landscape-hydrology/']
]) {
  const { response } = await fetchLocal(legacyPath);
  const location = response.headers.get('location');
  if (response.status !== 301 || new URL(location, baseUrl).pathname !== destinationPath) {
    throw new Error(`Legacy Proof Story route does not redirect safely: ${legacyPath}`);
  }
}

const { response: notFoundResponse, body: notFoundBody } = await fetchLocal('/homepage-finalization-missing-page/');
if (notFoundResponse.status !== 404) throw new Error(`Missing-page route returned ${notFoundResponse.status} instead of 404.`);
if (!/<h1\b[^>]*>[^<]*This page is outside the current landscape/i.test(notFoundBody) || !notFoundBody.includes('Page not found')) {
  throw new Error('404 page is missing its accessible heading treatment.');
}
if (!/The page you(?:'|’|&#8217;)re looking for might have been moved or doesn(?:'|’|&#8217;)t exist\./i.test(notFoundBody)) {
  throw new Error('404 page is missing the approved message.');
}
if (!/href=["']\/["']/.test(notFoundBody) || !/href=["']\/platform\/["']/.test(notFoundBody)) throw new Error('404 recovery actions are missing their real destinations.');
if (!/<meta name=['"]robots['"][^>]*content=['"][^'"]*noindex/i.test(notFoundBody)) throw new Error('404 page is missing noindex.');

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
  homepageNews: { cards: 3, featuredImages: 3, topics: 3, excerpts: 3, dates: 3, ctas: 3, responsiveImages: true },
  blog: { featured: 1, cards: 8, total: 9 },
  team: { members: teamCardCount, portraits: teamPortraitCount, fallbackPortraits: 0 },
  segmentHeroes: segments.length,
  checkedInternalLinks: linkResults.length,
  brokenInternalLinks: brokenLinks.length,
  noindex: { meta: true, xRobotsTag: 'noindex, nofollow', searchVisibility: 'disabled' },
  reservedLocales: { nl: 404, de: 404 },
  notFound: { status: 404, approvedMessage: true, recoveryLinks: ['/', '/platform/'], noindex: true },
  defaultSamplePost: 'not public'
}, null, 2));
