import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pluginRoot = resolve(repositoryRoot, 'wordpress/wp-content/plugins/farmtree-content');
const themeRoot = resolve(repositoryRoot, 'wordpress/wp-content/themes/farmtree-native');
const outputPath = resolve(pluginRoot, 'includes/managed-content-manifest.php');
const checkOnly = process.argv.includes('--check');

const readJson = async (filename) => JSON.parse(await readFile(resolve(pluginRoot, 'data', filename), 'utf8'));
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const fileSha256 = async (path) => sha256(await readFile(path));

const segmentDefinitions = await readJson('customer-segments.json');
const editorialDefinitions = await readJson('editorial-drafts.json');
const proofStoryDefinitions = await readJson('proof-stories.json');
const englishPageDefinitions = await readJson('english-pages.json');
const teamMemberDefinitions = await readJson('team-members.json');

const segmentPresentation = {
  'consultancy-agroforestry-advisors': ['segment-consultancy-advisors-v1-1600.webp', 'Agroforestry advisers reviewing a field plan with a farmer'],
  'development-banks-donor-organisations': ['segment-development-banks-donors-v1-1600.webp', 'Development finance specialists reviewing an agroforestry landscape investment plan'],
  'ngos-conservation-organisations': ['segment-ngos-conservation-v1-1600.webp', 'Conservation practitioners surveying a diverse agroforestry landscape'],
  'nbs-carbon-project-developers': ['segment-nbs-carbon-developers-v1-1600.webp', 'Nature-based project developers documenting an agroforestry plot'],
  'mrv-esg-platforms': ['segment-mrv-esg-platforms-v1-1600.webp', 'Field data specialist comparing digital records in an agroforestry landscape'],
  'government-parastatal-institutions': ['segment-government-institutions-v1-1600.webp', 'Public-sector planners discussing a regional agroforestry map'],
  'industry-associations-multi-stakeholder-platforms': ['segment-industry-associations-v1-1600.webp', 'Representatives from several organisations meeting beside an agroforestry site'],
  'large-agri-corporate': ['segment-large-agri-corporate-v1-1600.webp', 'Agricultural supply-chain team walking through a mixed tree and crop system'],
  'social-enterprise': ['segment-social-enterprise-v1-1600.webp', 'Social-enterprise team discussing a farm plan with local producers'],
  investors: ['segment-investors-v1-1600.webp', 'Investment team reviewing landscape information overlooking an agroforestry project']
};

const proofPresentation = {
  'carbon-planning': ['proof-carbon-documentary-v2.jpg', 'Field team measuring a mature tree and recording observations in an agroforestry landscape'],
  'farm-value-projection': ['proof-farm-value-documentary-v2.jpg', 'Farmer and adviser reviewing scenario materials at a farm-office table'],
  'cocoa-scenario-planning': ['proof-cocoa-documentary-v2.jpg', 'Cocoa field team inspecting pods and recording observations beneath shade trees'],
  'landscape-hydrology': ['proof-water-documentary-v2.jpg', 'Field team examining soil and recording water observations beside a stream']
};

const proofKeys = {
  'carbon-planning': 'proof_story.en.carbon_planning',
  'farm-value-projection': 'proof_story.en.farm_value',
  'cocoa-scenario-planning': 'proof_story.en.cocoa_scenario',
  'landscape-hydrology': 'proof_story.en.landscape_hydrology'
};

const proofLegacySlugs = {
  'farm-value-projection': ['farm-value-modelling'],
  'landscape-hydrology': ['water-landscape-resilience']
};

const editorialPresentation = {
  'farmtree-water-erosion-microclimate-model-update-2026': ['FarmTree Updates', 'news-water-erosion-microclimate-2026-v1-1600.webp', 'Agroforestry rows after rainfall with surface water moving between planted contours'],
  'eu-carbon-farming-methodologies-agroforestry-2026': ['Policy & Standards', 'news-eu-carbon-farming-methodologies-2026-v1-1600.webp', 'Soil sampling equipment and scenario-planning materials beside an agroforestry field'],
  'eudr-2026-agroforestry-data-readiness': ['Policy & Standards', 'news-eudr-data-readiness-2026-v1-1600.webp', 'Field technician reviewing a parcel map at the edge of a mixed agroforestry plot'],
  'verra-vm0042-v22-agricultural-land-management': ['Data & Evidence', 'news-verra-vm0042-v22-v1-1600.webp', 'Careful soil-core sampling in a diversified agroforestry field'],
  'verra-vm0042-v30-consultation-lessons': ['Data & Evidence', 'news-verra-vm0042-v30-governance-v1-1600.webp', 'Scenario diagrams and field measurements being compared beside agroforestry rows'],
  'smallholder-agroforestry-wood-production-lessons-2025': ['Species & Design', 'news-smallholder-wood-production-v1-1600.webp', 'A small diversified farm combining managed trees, crops and stacked pruning wood'],
  'carbon-pricing-2026-nature-project-quality': ['Project Finance', 'news-carbon-pricing-2026-v1-1600.webp', 'A planner comparing scenario materials while overlooking an agroforestry landscape'],
  'agroforestry-species-data-switchboard-2025': ['Species & Design', 'news-species-data-provenance-v1-1600.webp', 'Leaves and seed pods being compared with field records at a botanical work table'],
  'nature-restoration-plans-report-once-agroforestry-2025': ['Landscape Planning', 'news-nature-restoration-planning-v1-1600.webp', 'Landscape planners reviewing a restoration map above a mosaic of fields and tree corridors']
};

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const slugify = (value) => String(value)
  .toLowerCase()
  .replaceAll(/[^a-z0-9]+/g, '-')
  .replaceAll(/^-|-$/g, '');

function segmentContent(segment) {
  return [
    '<!-- wp:heading --><h2 class="wp-block-heading">Who this is for</h2><!-- /wp:heading -->',
    `<!-- wp:paragraph --><p>${escapeHtml(segment.excerpt)}</p><!-- /wp:paragraph -->`,
    '<!-- wp:heading --><h2 class="wp-block-heading">The planning need</h2><!-- /wp:heading -->',
    `<!-- wp:paragraph --><p>${escapeHtml(segment.need)}</p><!-- /wp:paragraph -->`,
    '<!-- wp:heading --><h2 class="wp-block-heading">Common challenges</h2><!-- /wp:heading -->',
    `<!-- wp:list --><ul>${segment.challenges.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul><!-- /wp:list -->`,
    '<!-- wp:heading --><h2 class="wp-block-heading">How FarmTree can support the work</h2><!-- /wp:heading -->',
    `<!-- wp:paragraph --><p>${escapeHtml(segment.use)}</p><!-- /wp:paragraph -->`,
    '<!-- wp:heading --><h2 class="wp-block-heading">Relevant capabilities</h2><!-- /wp:heading -->',
    `<!-- wp:list --><ul>${segment.capabilities.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul><!-- /wp:list -->`,
    '<!-- wp:heading --><h2 class="wp-block-heading">Example workflow</h2><!-- /wp:heading -->',
    `<!-- wp:paragraph --><p>${escapeHtml(segment.workflow)}</p><!-- /wp:paragraph -->`,
    '<!-- wp:heading --><h2 class="wp-block-heading">Frequently asked question</h2><!-- /wp:heading -->',
    `<!-- wp:details --><details class="wp-block-details"><summary>${escapeHtml(segment.faq[0])}</summary><!-- wp:paragraph --><p>${escapeHtml(segment.faq[1])}</p><!-- /wp:paragraph --></details><!-- /wp:details -->`,
    '<!-- wp:heading --><h2 class="wp-block-heading">Related evidence</h2><!-- /wp:heading -->',
    '<!-- wp:paragraph --><p><a href="/proof-stories/">Explore Proof Stories</a> or <a href="/blog/">read source-led insights</a>. When you are ready, <a href="/contact/">contact FarmTree</a> to define a proportionate modelling scope.</p><!-- /wp:paragraph -->'
  ].join('\n\n');
}

function editorialContent(article) {
  return [
    ...article.sections.map(([heading, paragraph]) => [
      `<!-- wp:heading --><h2 class="wp-block-heading">${escapeHtml(heading)}</h2><!-- /wp:heading -->`,
      `<!-- wp:paragraph --><p>${escapeHtml(paragraph)}</p><!-- /wp:paragraph -->`
    ].join('\n\n')),
    '<!-- wp:heading --><h2 class="wp-block-heading">Primary source</h2><!-- /wp:heading -->',
    `<!-- wp:paragraph --><p><a href="${escapeHtml(article.sourceUrl)}" target="_blank" rel="noreferrer noopener">${escapeHtml(article.sourceTitle)}</a>, published ${escapeHtml(article.sourceDate)}. External facts above are attributed to this source; interpretation is FarmTree editorial analysis.</p><!-- /wp:paragraph -->`,
    '<!-- wp:paragraph --><p>Continue with <a href="/platform/">the FarmTree Platform</a>, <a href="/proof-stories/">Proof Stories</a> or <a href="/contact/">contact the team</a>.</p><!-- /wp:paragraph -->'
  ].join('\n\n');
}

function newsHubContent() {
  return [
    '<!-- wp:group {"className":"ft-blog-intro","layout":{"type":"constrained"}} --><div class="wp-block-group ft-blog-intro"><!-- wp:paragraph {"className":"ft-native-eyebrow"} --><p class="ft-native-eyebrow">Ideas for better decisions</p><!-- /wp:paragraph --><!-- wp:paragraph {"fontSize":"lead"} --><p class="has-lead-font-size">Source-led FarmTree analysis and practical interpretation for agroforestry planning teams.</p><!-- /wp:paragraph --></div><!-- /wp:group -->',
    '<!-- wp:query {"queryId":8,"query":{"perPage":1,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false},"className":"ft-blog-featured"} -->',
    '<div class="wp-block-query ft-blog-featured"><!-- wp:post-template --><!-- wp:group {"className":"ft-blog-featured-card","layout":{"type":"constrained"}} --><div class="wp-block-group ft-blog-featured-card"><!-- wp:post-featured-image {"isLink":true,"aspectRatio":"16/9"} /--><div class="ft-blog-featured-copy"><!-- wp:post-terms {"term":"category","fontSize":"caption"} /--><!-- wp:post-date {"fontSize":"caption"} /--><!-- wp:post-title {"level":2,"isLink":true,"fontSize":"heading-small"} /--><!-- wp:post-excerpt {"moreText":"","excerptLength":34} /--><!-- wp:read-more {"content":"Read feature","className":"ft-news-read-more"} /--></div></div><!-- /wp:group --><!-- /wp:post-template --></div><!-- /wp:query -->',
    '<!-- wp:heading {"level":2,"className":"ft-blog-latest","fontSize":"heading-small"} --><h2 class="wp-block-heading ft-blog-latest has-heading-small-font-size">Latest insights</h2><!-- /wp:heading -->',
    '<!-- wp:query {"queryId":9,"query":{"perPage":8,"pages":0,"offset":1,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false},"className":"ft-blog-grid"} -->',
    '<div class="wp-block-query ft-blog-grid"><!-- wp:post-template {"layout":{"type":"grid","columnCount":3}} -->',
    '<!-- wp:group {"className":"ft-news-item","layout":{"type":"constrained"}} --><div class="wp-block-group ft-news-item">',
    '<!-- wp:post-featured-image {"isLink":true,"aspectRatio":"4/3"} /-->',
    '<!-- wp:post-terms {"term":"category","fontSize":"caption"} /-->',
    '<!-- wp:post-date {"fontSize":"caption"} /-->',
    '<!-- wp:post-title {"level":2,"isLink":true,"fontSize":"lead"} /-->',
    '<!-- wp:post-excerpt {"moreText":"","excerptLength":24,"fontSize":"small"} /-->',
    '<!-- wp:read-more {"content":"Read article","className":"ft-news-read-more"} /-->',
    '</div><!-- /wp:group -->',
    '<!-- /wp:post-template --></div><!-- /wp:query -->'
  ].join('\n');
}

const mediaIdToken = (key) => `%%FARMTREE_MEDIA_ID:${key}%%`;
const mediaUrlToken = (key) => `%%FARMTREE_MEDIA_URL:${key}%%`;

function teamPageContent() {
  const cards = teamMemberDefinitions.map((member) => {
    const key = `asset.team.${member.slug}`;
    const id = mediaIdToken(key);
    const url = mediaUrlToken(key);
    const portrait = `<!-- wp:image {"id":${id},"sizeSlug":"large","linkDestination":"none","className":"ft-team-portrait"} --><figure class="wp-block-image size-large ft-team-portrait"><img src="${url}" alt="${escapeHtml(member.name)}, ${escapeHtml(member.role)}" class="wp-image-${id}"/></figure><!-- /wp:image -->`;
    const role = member.role ? `<!-- wp:paragraph {"className":"ft-team-role"} --><p class="ft-team-role">${escapeHtml(member.role)}</p><!-- /wp:paragraph -->` : '';
    const bio = member.bio ? `<!-- wp:paragraph {"fontSize":"small"} --><p class="has-small-font-size">${escapeHtml(member.bio)}</p><!-- /wp:paragraph -->` : '';
    const linkedin = member.linkedin ? `<!-- wp:paragraph {"className":"ft-team-link"} --><p class="ft-team-link"><a href="${escapeHtml(member.linkedin)}" target="_blank" rel="noreferrer noopener"><span>View LinkedIn profile</span><span aria-hidden="true">↗</span></a></p><!-- /wp:paragraph -->` : '';
    return `<!-- wp:group {"className":"ft-team-card","layout":{"type":"constrained"}} --><article class="wp-block-group ft-team-card">${portrait}<!-- wp:heading {"level":2,"fontSize":"lead"} --><h2 class="wp-block-heading has-lead-font-size">${escapeHtml(member.name)}</h2><!-- /wp:heading -->${role}${bio}${linkedin}</article><!-- /wp:group -->`;
  }).join('');
  const heroKey = 'asset.team.hero';
  const heroId = mediaIdToken(heroKey);
  const heroUrl = mediaUrlToken(heroKey);
  return `<!-- wp:cover {"url":"${heroUrl}","id":${heroId},"dimRatio":60,"overlayColor":"black","isUserOverlayColor":true,"minHeight":520,"contentPosition":"center center","align":"full","className":"ft-team-hero"} --><div class="wp-block-cover alignfull ft-team-hero" style="min-height:520px"><img class="wp-block-cover__image-background wp-image-${heroId}" alt="" src="${heroUrl}" data-object-fit="cover"/><span aria-hidden="true" class="wp-block-cover__background has-black-background-color has-background-dim-60 has-background-dim"></span><div class="wp-block-cover__inner-container"><!-- wp:paragraph {"className":"ft-native-eyebrow","textColor":"farmtree-gold","fontSize":"small"} --><p class="ft-native-eyebrow has-farmtree-gold-color has-text-color has-small-font-size">People behind the platform</p><!-- /wp:paragraph --><!-- wp:heading {"level":1,"textColor":"white","fontSize":"heading"} --><h1 class="wp-block-heading has-white-color has-text-color has-heading-font-size">Meet the FarmTree team</h1><!-- /wp:heading --><!-- wp:paragraph {"textColor":"white","fontSize":"lead"} --><p class="has-white-color has-text-color has-lead-font-size">Agroforestry science, modelling, technology and project experience in one multidisciplinary team.</p><!-- /wp:paragraph --><!-- wp:paragraph {"className":"ft-team-hero-caption","textColor":"white","fontSize":"caption"} --><p class="ft-team-hero-caption has-white-color has-text-color has-caption-font-size">Illustrative field collaboration</p><!-- /wp:paragraph --></div></div><!-- /wp:cover --><!-- wp:paragraph {"className":"ft-team-intro","fontSize":"lead"} --><p class="ft-team-intro has-lead-font-size">Meet the people building and supporting the FarmTree Platform.</p><!-- /wp:paragraph --><!-- wp:group {"className":"ft-team-grid","layout":{"type":"grid","minimumColumnWidth":"18rem"}} --><div class="wp-block-group ft-team-grid">${cards}</div><!-- /wp:group -->`;
}

function vacanciesPageContent() {
  return '<!-- wp:group {"className":"ft-careers-empty","layout":{"type":"constrained"}} --><section class="wp-block-group ft-careers-empty"><!-- wp:paragraph {"className":"ft-native-eyebrow"} --><p class="ft-native-eyebrow">Careers at FarmTree</p><!-- /wp:paragraph --><!-- wp:heading {"level":2,"fontSize":"heading-small"} --><h2 class="wp-block-heading has-heading-small-font-size">No approved vacancies are open right now</h2><!-- /wp:heading --><!-- wp:paragraph {"fontSize":"lead"} --><p class="has-lead-font-size">New roles will appear here after they have been approved for publication. Until then, learn more about the people and work behind FarmTree.</p><!-- /wp:paragraph --><!-- wp:buttons --><div class="wp-block-buttons"><!-- wp:button --><div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="/team/">Meet the team</a></div><!-- /wp:button --><!-- wp:button {"className":"is-style-outline"} --><div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="/contact/">Contact FarmTree</a></div><!-- /wp:button --></div><!-- /wp:buttons --></section><!-- /wp:group -->';
}

function proofStoryContent(story) {
  return story.sections.map(([heading, paragraph]) => [
    `<!-- wp:heading --><h2 class="wp-block-heading">${escapeHtml(heading)}</h2><!-- /wp:heading -->`,
    `<!-- wp:paragraph --><p>${escapeHtml(paragraph)}</p><!-- /wp:paragraph -->`
  ].join('\n\n')).join('\n\n');
}

function englishPageContent(page) {
  if (page.body === 'news' || page.slug === 'blog') return newsHubContent();
  if (page.body === 'contact') {
    return [
      '<!-- wp:paragraph --><p>The local pre-release form is intentionally unavailable until an approved delivery backend and privacy review are complete. No information entered here is transmitted, stored or logged.</p><!-- /wp:paragraph -->',
      '<!-- wp:html --><form class="ft-contact-form" aria-describedby="ft-contact-unavailable"><fieldset disabled><legend>Contact details</legend><label>Name *<input name="name" autocomplete="name" required></label><label>Email *<input type="email" name="email" autocomplete="email" required></label><label>Phone <input type="tel" name="phone" autocomplete="tel"></label><label>Organisation <input name="organisation" autocomplete="organization"></label><label>Topic *<select name="topic" required><option value="">Choose a topic</option><option>Platform and demo</option><option>Project modelling</option><option>Quotation</option><option>Other</option></select></label><label>Message *<textarea name="message" rows="6" required></textarea></label><label><input type="checkbox" name="consent" required> I agree that FarmTree may use my details to respond.</label><button type="submit" disabled>Delivery unavailable</button></fieldset></form><p id="ft-contact-unavailable"><strong>Safe fallback:</strong> email <a href="mailto:info@farmtree.earth?subject=FarmTree%20contact%20request">info@farmtree.earth</a>. Your mail application will show exactly what is sent.</p><!-- /wp:html -->',
      '<!-- wp:heading --><h2 class="wp-block-heading">Visit FarmTree</h2><!-- /wp:heading -->',
      '<!-- wp:paragraph --><p>FarmTree B.V.<br>Plus Ultra Building<br>Bronland 12C-1<br>6708 WH Wageningen<br>The Netherlands</p><!-- /wp:paragraph -->',
      '<!-- wp:paragraph --><p><a href="https://www.openstreetmap.org/search?query=Bronland%2012C-1%2C%206708%20WH%20Wageningen" target="_blank" rel="noreferrer noopener">View the location on OpenStreetMap ↗</a></p><!-- /wp:paragraph -->'
    ].join('\n\n');
  }
  if (page.slug === 'team') return teamPageContent();
  if (page.slug === 'vacancies') return vacanciesPageContent();
  if (page.slug === 'proof-stories') {
    const links = proofStoryDefinitions.map((story) => `<li><a href="/proof-stories/${escapeHtml(story.slug)}/">${escapeHtml(story.title)}</a>: ${escapeHtml(story.excerpt)}</li>`).join('');
    return `<!-- wp:paragraph {"fontSize":"lead"} --><p class="has-lead-font-size">${escapeHtml(page.body)}</p><!-- /wp:paragraph --><!-- wp:list --><ul>${links}</ul><!-- /wp:list -->`;
  }
  if (page.slug === 'customer-segments') {
    const links = segmentDefinitions.map((segment) => `<li><a href="/customer-segments/${escapeHtml(segment.slug)}/">${escapeHtml(segment.title)}</a>: ${escapeHtml(segment.excerpt)}</li>`).join('');
    return `<!-- wp:paragraph {"fontSize":"lead"} --><p class="has-lead-font-size">${escapeHtml(page.body)}</p><!-- /wp:paragraph --><!-- wp:list {"ordered":true} --><ol>${links}</ol><!-- /wp:list -->`;
  }
  return [
    `<!-- wp:paragraph {"fontSize":"lead"} --><p class="has-lead-font-size">${escapeHtml(page.body)}</p><!-- /wp:paragraph -->`,
    '<!-- wp:heading --><h2 class="wp-block-heading">A useful next step</h2><!-- /wp:heading -->',
    '<!-- wp:paragraph --><p>Explore <a href="/platform/">the Platform</a>, review <a href="/proof-stories/">Proof Stories</a>, or <a href="/contact/">contact FarmTree</a> with a specific planning question.</p><!-- /wp:paragraph -->'
  ].join('\n\n');
}

async function homepageContent() {
  const pattern = await readFile(resolve(themeRoot, 'patterns/homepage-foundation.php'), 'utf8');
  const closingTag = pattern.indexOf('?>');
  if (closingTag < 0) throw new Error('Homepage pattern PHP header is missing its closing tag.');
  const content = pattern.slice(closingTag + 2).replace(
    /<\?php\s+echo\s+esc_url\(\s*get_theme_file_uri\(\s*'([^']+)'\s*\)\s*\);\s*\?>/g,
    (_match, relativePath) => `%%FARMTREE_THEME_URI:${relativePath}%%`
  );
  if (content.includes('<?php')) throw new Error('Homepage pattern contains an unsupported PHP expression.');
  return content;
}

const assets = [];
async function addAsset({ key, relativePath, title, alt }) {
  const absolutePath = resolve(themeRoot, relativePath);
  const extension = extname(relativePath).slice(1).toLowerCase();
  const mimeTypes = { avif: 'image/avif', jpeg: 'image/jpeg', jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
  if (!mimeTypes[extension]) throw new Error(`Unsupported managed media type: ${relativePath}`);
  assets.push({
    key,
    slug: relativePath.split('/').at(-1).replace(/\.[^.]+$/, ''),
    relative_path: relativePath,
    title,
    alt,
    mime_type: mimeTypes[extension],
    sha256: await fileSha256(absolutePath)
  });
}

for (const segment of segmentDefinitions) {
  const [filename, alt] = segmentPresentation[segment.slug] ?? [];
  if (!filename) throw new Error(`Segment presentation metadata is missing: ${segment.slug}`);
  await addAsset({ key: `asset.segment.${segment.slug}`, relativePath: `assets/images/segments/${filename}`, title: segment.title, alt });
}
for (const story of proofStoryDefinitions) {
  const [filename, alt] = proofPresentation[story.slug] ?? [];
  if (!filename) throw new Error(`Proof presentation metadata is missing: ${story.slug}`);
  await addAsset({ key: `asset.proof.${story.slug}`, relativePath: `assets/images/proof/${filename}`, title: story.title, alt });
}
for (const member of teamMemberDefinitions) {
  if (!member.image) throw new Error(`Approved Team portrait is missing: ${member.slug}`);
  await addAsset({ key: `asset.team.${member.slug}`, relativePath: `assets/images/team/${member.image}`, title: member.name, alt: `${member.name}, ${member.role}` });
}
await addAsset({
  key: 'asset.team.hero',
  relativePath: 'assets/images/team/team-field-collaboration-v1.jpg',
  title: 'Illustrative FarmTree team field collaboration',
  alt: 'Illustrative group of agroforestry professionals walking through a diversified farm'
});
for (const article of editorialDefinitions) {
  const presentation = editorialPresentation[article.slug];
  if (!presentation) throw new Error(`Editorial presentation metadata is missing: ${article.slug}`);
  await addAsset({ key: `asset.news.${article.slug}`, relativePath: `assets/images/news/${presentation[1]}`, title: article.title, alt: presentation[2] });
}

const categoryNames = [...new Set(Object.values(editorialPresentation).map(([category]) => category))];
const terms = categoryNames.map((name) => ({
  key: `category.en.${slugify(name)}`,
  taxonomy: 'category',
  slug: slugify(name),
  name,
  description: ''
}));

const entities = [];
const addEntity = ({ key, postType, title, slug, excerpt = '', content, order = 0, date = '', featuredAssetKey = '', categoryKeys = [], legacySlugs = [], childKeys = [] }) => {
  entities.push({
    key,
    post_type: postType,
    slug,
    legacy_slugs: legacySlugs,
    fields: {
      post_title: title,
      post_name: slug,
      post_status: 'private',
      post_excerpt: excerpt,
      post_content: content,
      menu_order: order,
      post_date: date
    },
    featured_asset_key: featuredAssetKey,
    category_keys: categoryKeys,
    child_keys: childKeys
  });
};

addEntity({
  key: 'page.en.home',
  postType: 'page',
  title: 'FarmTree Native Homepage',
  slug: 'home',
  content: await homepageContent()
});
for (const segment of segmentDefinitions) {
  addEntity({
    key: `customer_segment.en.${segment.slug.replaceAll('-', '_')}`,
    postType: 'customer_segment',
    title: segment.title,
    slug: segment.slug,
    excerpt: segment.excerpt,
    content: segmentContent(segment),
    order: segment.order,
    featuredAssetKey: `asset.segment.${segment.slug}`
  });
}
for (const article of editorialDefinitions) {
  const category = editorialPresentation[article.slug][0];
  addEntity({
    key: `post.en.${article.slug.replaceAll('-', '_')}`,
    postType: 'post',
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: editorialContent(article),
    date: `${article.sourceDate} 09:00:00`,
    featuredAssetKey: `asset.news.${article.slug}`,
    categoryKeys: [`category.en.${slugify(category)}`]
  });
}
for (const story of proofStoryDefinitions) {
  addEntity({
    key: proofKeys[story.slug],
    postType: 'proof_story',
    title: story.title,
    slug: story.slug,
    excerpt: story.excerpt,
    content: proofStoryContent(story),
    order: story.order,
    featuredAssetKey: `asset.proof.${story.slug}`,
    legacySlugs: proofLegacySlugs[story.slug] ?? []
  });
}
const pages = [
  ...englishPageDefinitions,
  { title: 'News & Insights', slug: 'news-insights', excerpt: 'Source-led FarmTree analysis for agroforestry planning teams.', body: 'news' }
];
for (const page of pages) {
  addEntity({
    key: page.slug === 'team' ? 'page.en.team' : `page.en.${page.slug.replaceAll('-', '_')}`,
    postType: 'page',
    title: page.title,
    slug: page.slug,
    excerpt: page.excerpt,
    content: englishPageContent(page),
    childKeys: page.slug === 'team' ? teamMemberDefinitions.map(({ slug }) => `team_member.${slug}`) : []
  });
}

const assertUnique = (items, field, label) => {
  const values = items.map((item) => item[field]);
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
  if (duplicates.length > 0) throw new Error(`${label} contains duplicate ${field} values: ${[...new Set(duplicates)].join(', ')}`);
};
assertUnique(assets, 'key', 'Managed assets');
assertUnique(assets, 'relative_path', 'Managed assets');
assertUnique(terms, 'key', 'Managed terms');
assertUnique(entities, 'key', 'Managed entities');
for (const postType of [...new Set(entities.map(({ post_type: postType }) => postType))]) {
  assertUnique(entities.filter(({ post_type: candidate }) => candidate === postType), 'slug', `Managed ${postType} entities`);
}
assertUnique(teamMemberDefinitions, 'slug', 'Team members');

assets.sort((left, right) => left.key.localeCompare(right.key));
terms.sort((left, right) => left.key.localeCompare(right.key));

const manifest = {
  manifest_version: '2026-09-01-private-review-1',
  profile: 'private-review',
  publication_note: 'English content is materialized as authenticated private-review content; public publication remains a separate approval.',
  reserved_locales: ['nl', 'de'],
  team_member_keys: teamMemberDefinitions.map(({ slug }) => `team_member.${slug}`),
  terms,
  assets,
  entities
};

function toPhp(value, depth = 0) {
  const indent = '    '.repeat(depth);
  const childIndent = '    '.repeat(depth + 1);
  if (value === null) return 'null';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return `'${value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`;
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    return `[\n${value.map((item) => `${childIndent}${toPhp(item, depth + 1)},`).join('\n')}\n${indent}]`;
  }
  const entries = Object.entries(value);
  if (entries.length === 0) return '[]';
  return `[\n${entries.map(([key, item]) => `${childIndent}${toPhp(key)} => ${toPhp(item, depth + 1)},`).join('\n')}\n${indent}]`;
}

const generated = `<?php\n/**\n * Generated production-safe FarmTree managed-content manifest.\n *\n * Source JSON remains local/repository-only and is excluded from release artifacts.\n * Regenerate with: npm run content:manifest\n *\n * @package FarmTree_Content\n */\n\nif (!defined('ABSPATH')) {\n    exit;\n}\n\nreturn ${toPhp(manifest)};\n`;

if (checkOnly) {
  const existing = await readFile(outputPath, 'utf8').catch(() => '');
  if (existing !== generated) {
    throw new Error('Managed-content PHP manifest is missing or stale. Run npm run content:manifest.');
  }
  console.log(JSON.stringify({
    status: 'ok',
    manifestVersion: manifest.manifest_version,
    manifestSha256: sha256(generated),
    entities: entities.length,
    terms: terms.length,
    assets: assets.length,
    teamMembers: manifest.team_member_keys.length
  }, null, 2));
} else {
  await writeFile(outputPath, generated);
  console.log(JSON.stringify({
    status: 'generated',
    output: outputPath,
    manifestVersion: manifest.manifest_version,
    manifestSha256: sha256(generated),
    entities: entities.length,
    terms: terms.length,
    assets: assets.length,
    teamMembers: manifest.team_member_keys.length
  }, null, 2));
}
