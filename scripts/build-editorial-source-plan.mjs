import { writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { loadEditorialArticles } from './news-editorial-content.mjs';
const articles = await loadEditorialArticles();
if (articles.length !== 12) throw new Error('Expected twelve articles');
const entities = await Promise.all(articles.map(async article => ({
  key: `post.en.${article.slug.replaceAll('-', '_')}`,
  postType: 'post', slug: article.slug, title: article.title, excerpt: article.deck,
  content: article.content, category: article.category,
  publicationDate: null, commentStatus: 'closed', pingStatus: 'closed',
  sourceSha256: article.sourceSha256,
  contentSha256: createHash('sha256').update(article.content).digest('hex'),
  image: { ...article.image, sha256: createHash('sha256').update(await readFile(new URL(`../wordpress/wp-content/themes/farmtree-native/assets/images/${article.image.directory}/${article.image.filename}`, import.meta.url))).digest('hex') }
})));
const plan = { schemaVersion: 1, executable: false,
  gate: 'Non-executable inventory; the separately pinned News12 profile requires prospective diagnostics, exact production dry-run scope, reviewed digest and verified backups',
  purpose: 'Deterministic internal source inventory, not a production dry-run or ownership verdict',
  productionRequirements: ['fresh exact ownership preflight', 'actual publication date', 'reviewed independent plan and digest', 'valid off-webroot recovery backup', 'unchanged unrelated content and release-critical state'],
  entities };
const output = JSON.stringify(plan, null, 2) + '\n';
const path = new URL('../content/news-release-source-plan.json', import.meta.url);
if (process.argv.includes('--check')) {
  if (await readFile(path, 'utf8') !== output) throw new Error('Editorial source plan is stale');
} else { await writeFile(path, output); }
console.log('Editorial source plan: twelve entities; non-executable; guarded production plan required');
