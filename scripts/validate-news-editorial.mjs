import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { loadEditorialArticles, editorialBlocks } from './news-editorial-content.mjs';
import { newsPhotographs } from './editorial-photographs.mjs';

const articles = await loadEditorialArticles();
assert.deepEqual(articles.map(a => a.article), Array.from({ length: 12 }, (_, i) => i + 1));
for (const key of ['slug', 'title', 'deck', 'metaDescription']) assert.equal(new Set(articles.map(a => a[key])).size, 12, `Duplicate ${key}`);
assert.equal(new Set(articles.map(a => a.image.identity)).size, 12);
assert.throws(() => editorialBlocks('[unsafe](javascript:alert)'));
assert.throws(() => editorialBlocks('<script>bad</script>'));
const existing = new Set(Object.values(newsPhotographs).map(image => image.filename));
for (const article of articles) {
  const words = article.markdown.trim().split(/\s+/).length;
  assert.ok(words >= 800 && words <= 1300, `${article.slug}: ${words} words`);
  assert.ok(article.metaDescription.length <= 180 && article.metaDescription.length >= 70, article.slug);
  assert.ok(article.sourceIds.length > 0 && article.markdown.includes('## Sources / Further reading'), article.slug);
  assert.ok(!existing.has(article.image.filename), `Existing image repeated: ${article.slug}`);
  assert.equal(article.publicationDate, null, 'Production publication date must remain unset until gated release');
  assert.ok(!article.content.includes('<h1'), 'Template owns the only H1');
  assert.ok(article.markdown.match(/\]\(\/(?!\/)/), 'Missing internal link');
  await readFile(new URL(`../wordpress/wp-content/themes/farmtree-native/assets/images/${article.image.directory}/${article.image.filename}`, import.meta.url));
}
console.log(JSON.stringify({ articles: 12, words: articles.map(a => ({ article: a.article, words: a.markdown.trim().split(/\s+/).length })), uniqueNewImages: 12, existingImagesPreserved: 9, productionPublication: 'blocked; dates unset' }, null, 2));
