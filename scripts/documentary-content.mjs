import { readFileSync } from 'node:fs';

const plan = JSON.parse(readFileSync(new URL('../config/farmtree-documentary-images.json', import.meta.url), 'utf8'));
const captions = {
  1: 'People and vegetation in an open field landscape.',
  2: 'Walking through a field with dry crop stalks.',
  8: 'Harvested onions gathered beneath trees.',
  10: 'Examining long green pods on a plant.',
  12: 'Trees scattered across a sandy field.',
  14: 'Field context: cropping beneath an overcast sky, independent of the news events above.',
  17: 'Mixed crops and fruit trees around a small garden shelter.',
  20: 'Field layout context: crop beds, small trees and earthen paths. Not a Platform output.'
};
const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export function documentaryContent(slug, themeUrl = (path) => `%%FARMTREE_THEME_URI:${path}%%`) {
  if (!['platform', 'solutions', 'proof-stories', 'customer-segments', 'blog'].includes(slug)) return '';
  const entries = plan.images.filter((image) => image.selected && image.page.split(',').includes(slug));
  const figures = entries.map((image) => {
    const url = themeUrl(`assets/images/documentary/${image.slug}-content.jpg`);
    return `<!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"ft-documentary-image"} --><figure class="wp-block-image size-full ft-documentary-image"><img src="${escape(url)}" alt="${escape(image.alt)}"/><figcaption class="wp-element-caption">${escape(captions[image.number])}</figcaption></figure><!-- /wp:image -->`;
  }).join('\n\n');
  const context = slug === 'proof-stories' ? '<!-- wp:paragraph --><p>Documentary field context, shown independently of the four Proof Stories above.</p><!-- /wp:paragraph -->\n\n' : '';
  return `${context}<!-- wp:group {"className":"ft-documentary-context","layout":{"type":"default"}} --><div class="wp-block-group ft-documentary-context">${figures}</div><!-- /wp:group -->`;
}
