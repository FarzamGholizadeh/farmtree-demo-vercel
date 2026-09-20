import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import YAML from 'yaml';

const root = new URL('../', import.meta.url);
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
function inline(value) {
  return escape(value).replace(/\[([^\]]+)\]\(([^\s)]+)\)/g, (_, label, href) => {
    if (!/^(https:\/\/|\/(?!\/))/.test(href)) throw new Error(`Unsupported editorial link: ${href}`);
    return `<a href="${href}">${label}</a>`;
  }).replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
}
export function editorialBlocks(markdown) {
  return markdown.trim().split(/\n\s*\n/).map(part => {
    if (part.startsWith('## ')) return `<!-- wp:heading --><h2 class="wp-block-heading">${inline(part.slice(3).trim())}</h2><!-- /wp:heading -->`;
    if (part.startsWith('- ')) return `<!-- wp:list --><ul class="wp-block-list">${part.split('\n').map(line => {
      if (!line.startsWith('- ')) throw new Error('Unsupported multiline editorial list');
      return `<!-- wp:list-item --><li>${inline(line.slice(2))}</li><!-- /wp:list-item -->`;
    }).join('')}</ul><!-- /wp:list -->`;
    if (/^#|^```|^</.test(part)) throw new Error('Unsupported editorial block');
    return `<!-- wp:paragraph --><p>${inline(part.replaceAll('\n', ' '))}</p><!-- /wp:paragraph -->`;
  }).join('\n\n');
}

// Source identities, not crops: none overlaps the nine existing News photographs.
const numbers = { 1: 13, 2: null, 3: 17, 4: 6, 5: 9, 6: 7, 7: 18, 8: 4, 9: 1, 10: 16, 11: 3, 12: 5 };
export async function loadEditorialArticles() {
  const library = JSON.parse(await readFile(new URL('config/farmtree-documentary-images.json', root))).images;
  const files = (await readdir(new URL('content/news/', root))).filter(file => file.endsWith('.md')).sort();
  const articles = [];
  for (const filename of files) {
    const source = await readFile(new URL(`content/news/${filename}`, root), 'utf8');
    const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) throw new Error(`Missing frontmatter: ${filename}`);
    const data = YAML.parse(match[1]);
    if (filename !== `${data.slug}.md` || !/^[a-z0-9-]+$/.test(data.slug)) throw new Error(`Invalid slug: ${filename}`);
    const photo = library.find(image => image.number === numbers[data.article]);
    const image = photo ? { directory: 'documentary', filename: `${photo.slug}-content.jpg`, alt: photo.alt, identity: `documentary:${photo.number}` }
      : { directory: 'editorial', filename: 'farmtree-evidence-chain-content.jpg', alt: 'Conceptual diagram of field observations, model processing and evidence review connected in sequence', identity: 'diagram:evidence-chain' };
    const context = photo ? 'Documentary photograph shown for agricultural context, not as evidence of the project, event or outcomes discussed below.' : 'Conceptual editorial illustration, not a depiction of an actual project or a certification decision.';
    articles.push({ ...data, image, filename, sourceSha256: createHash('sha256').update(source).digest('hex'), markdown: match[2],
      content: `<!-- wp:paragraph {"fontSize":"caption"} --><p class="has-caption-font-size">${context}</p><!-- /wp:paragraph -->\n\n${editorialBlocks(match[2])}` });
  }
  return articles.sort((a, b) => a.article - b.article);
}
