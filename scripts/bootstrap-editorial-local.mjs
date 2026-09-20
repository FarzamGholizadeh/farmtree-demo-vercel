import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { loadEditorialArticles } from './news-editorial-content.mjs';

// Deliberately no production mode. Production requires a separately reviewed
// ownership-aware plan after the unresolved bootstrap safety gate is resolved.
const base = new URL(process.env.FARMTREE_LOCAL_WP_URL || 'http://localhost:8888');
if (!['localhost', '127.0.0.1', '[::1]'].includes(base.hostname)) throw new Error('Editorial preview is loopback-only');
if (process.argv.slice(2).some(arg => !['--verify', '--refresh-preview'].includes(arg))) throw new Error('Unsupported local option');
const verify = process.argv.includes('--verify');
const refresh = process.argv.includes('--refresh-preview');
if (verify && refresh) throw new Error('Verify cannot refresh');
const articles = await loadEditorialArticles();
const ledgerPath = new URL('../qa/live-360/news-preview-ownership.json', import.meta.url);
const ledger = JSON.parse(await readFile(ledgerPath, 'utf8').catch(error => { if (error.code === 'ENOENT') return '{}'; throw error; }));
const hash = value => createHash('sha256').update(value).digest('hex');
if (articles.length !== 12) throw new Error('Exactly twelve articles are required');
const response = await fetch(base, { redirect: 'manual' });
const cookie = response.headers.getSetCookie().map(value => value.split(';')[0]).join('; ');
if (!cookie.includes('wordpress_logged_in_')) throw new Error('Local auto-login unavailable');
const editor = await (await fetch(new URL('/wp-admin/post-new.php', base), { redirect: 'error', headers: { Cookie: cookie } })).text();
const nonce = JSON.parse(editor.match(/wpApiSettings\s*=\s*(\{[^;]+\});/)?.[1] || '{}').nonce;
if (!nonce) throw new Error('Local editor nonce unavailable');
async function api(path, options = {}) {
  if (verify && options.method) throw new Error('Verify mode cannot write');
  const result = await fetch(new URL(`/wp-json/wp/v2/${path}`, base), { redirect: 'error', ...options,
    headers: { Cookie: cookie, 'X-WP-Nonce': nonce, 'Content-Type': 'application/json', ...options.headers } });
  const body = await result.json();
  if (!result.ok) throw new Error(`Local API ${path}: ${result.status}`);
  return body;
}
const slugify = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const report = [];
for (const article of articles) {
  let categories = await api(`categories?slug=${slugify(article.category)}&context=edit`);
  if (!categories.length && !verify) categories = [await api('categories', { method: 'POST', body: JSON.stringify({ name: article.category, slug: slugify(article.category) }) })];
  if (categories.length !== 1) throw new Error(`Category missing/ambiguous: ${article.slug}`);
  const { filename, directory, alt } = article.image;
  let media = await api(`media?slug=${filename.replace(/\.jpg$/, '')}&context=edit`);
  if (!media.length && !verify) {
    const bytes = await readFile(new URL(`../wordpress/wp-content/themes/farmtree-native/assets/images/${directory}/${filename}`, import.meta.url));
    media = [await api('media', { method: 'POST', headers: { 'Content-Type': 'image/jpeg', 'Content-Disposition': `attachment; filename="${filename}"` }, body: bytes })];
    media = [await api(`media/${media[0].id}`, { method: 'POST', body: JSON.stringify({ alt_text: alt, title: alt }) })];
  }
  if (media.length !== 1 || media[0].alt_text !== alt) throw new Error(`Media missing/ambiguous/changed: ${article.slug}`);
  let posts = await api(`posts?slug=${article.slug}&status=publish,draft,private,pending,future&context=edit`);
  const expected = { title: article.title, content: article.content, excerpt: article.deck, status: 'publish', slug: article.slug, categories: [categories[0].id], featured_media: media[0].id, comment_status: 'closed', ping_status: 'closed' };
  if (!posts.length && !verify) posts = [await api('posts', { method: 'POST', body: JSON.stringify(expected) })];
  if (posts.length !== 1) throw new Error(`Post missing/ambiguous: ${article.slug}`);
  let post = posts[0];
  if (refresh && post.content.raw.trim() !== expected.content.trim() && post.title.raw === expected.title && post.excerpt.raw === expected.excerpt
      && post.featured_media === expected.featured_media && post.status === 'publish'
      && post.content.raw.startsWith('<!-- wp:paragraph {"fontSize":"caption"} -->')) {
    if (ledger[article.slug]?.id !== post.id || ledger[article.slug]?.contentHash !== hash(post.content.raw.trim())) throw new Error(`Local content ownership changed or evidence missing: ${article.slug}`);
    post = await api(`posts/${post.id}`, { method: 'POST', body: JSON.stringify({ content: expected.content }) });
  }
  // No blind overwrite, even in local preview. Existing discrepancies require review.
  for (const key of ['title', 'content', 'excerpt']) {
    if (post[key].raw.trim() !== expected[key].trim()) throw new Error(`Existing ${key} differs: ${article.slug}`);
  }
  for (const key of ['status', 'slug', 'featured_media', 'comment_status', 'ping_status']) {
    if (post[key] !== expected[key]) throw new Error(`Existing ${key} differs: ${article.slug}`);
  }
  if (JSON.stringify(post.categories) !== JSON.stringify(expected.categories)) throw new Error(`Category differs: ${article.slug}`);
  report.push({ slug: article.slug, id: post.id, result: 'matched', date: post.date });
  ledger[article.slug] = { id: post.id, contentHash: hash(post.content.raw.trim()) };
}
await mkdir(new URL('../qa/live-360/', import.meta.url), { recursive: true });
await writeFile(ledgerPath, JSON.stringify(ledger, null, 2) + '\n');
console.log(JSON.stringify({ environment: 'loopback preview only', posts: report, production: 'untouched' }, null, 2));
