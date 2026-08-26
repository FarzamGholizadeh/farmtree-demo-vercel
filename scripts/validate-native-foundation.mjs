import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const theme = resolve(root, 'wordpress/wp-content/themes/farmtree-native');
const plugin = resolve(root, 'wordpress/wp-content/plugins/farmtree-content');

const required = [
  'style.css',
  'theme.json',
  'functions.php',
  'parts/header.html',
  'parts/footer.html',
  'templates/index.html',
  'templates/front-page.html',
  'templates/page.html',
  'templates/content-only-page.html',
  'templates/single.html',
  'templates/archive.html',
  'templates/404.html',
  'patterns/homepage-foundation.php',
  'patterns/page-intro.php',
  'patterns/call-to-action.php',
  'styles/scientific.json',
  'assets/css/editor.css',
  'assets/images/brand/farmtree-logo.webp',
  'assets/images/home/hero-project-workshop.webp',
  'assets/images/home/platform-slide-1.png',
  'assets/images/home/platform-slide-2.png',
  'assets/images/home/technology-model.webp',
  'assets/images/home/proof-carbon.webp',
  'assets/images/home/proof-farm-value.webp',
  'assets/images/home/proof-cocoa.webp',
  'assets/images/home/proof-water.webp',
  'assets/images/partners/giz.png',
  'assets/images/partners/rabobank.png',
  'assets/images/partners/cgiar.png',
  'assets/images/partners/fao.png',
  'assets/images/partners/catie.png',
  'assets/images/partners/helvetas.png'
];

for (const file of required) {
  if (!existsSync(resolve(theme, file))) {
    throw new Error(`Missing Block Theme file: ${file}`);
  }
}

for (const directory of ['parts', 'templates', 'patterns']) {
  for (const entry of readdirSync(resolve(theme, directory))) {
    if (!entry.endsWith('.html') && !entry.endsWith('.php')) {
      continue;
    }

    const markup = readFileSync(resolve(theme, directory, entry), 'utf8');
    for (const match of markup.matchAll(/<!-- wp:[^\s]+ (\{.*?\}) -->/g)) {
      try {
        JSON.parse(match[1]);
      } catch {
        throw new Error(`${directory}/${entry} contains invalid block attribute JSON.`);
      }
    }
  }
}

for (const file of ['farmtree-content.php', 'includes/architecture.php', 'README.md']) {
  if (!existsSync(resolve(plugin, file))) {
    throw new Error(`Missing content plugin file: ${file}`);
  }
}

const themeJson = JSON.parse(readFileSync(resolve(theme, 'theme.json'), 'utf8'));
const variation = JSON.parse(readFileSync(resolve(theme, 'styles/scientific.json'), 'utf8'));

if (themeJson.version !== 3 || variation.version !== 3) {
  throw new Error('Theme JSON files must use schema version 3.');
}

if (themeJson.settings?.layout?.contentSize !== '760px') {
  throw new Error('Expected the controlled 760px content width.');
}

const palette = new Set(
  themeJson.settings?.color?.palette?.map(({ slug }) => slug) ?? []
);

for (const slug of ['farmtree-green', 'farmtree-ink', 'farmtree-ivory', 'farmtree-gold']) {
  if (!palette.has(slug)) {
    throw new Error(`Missing required design token: ${slug}`);
  }
}

for (const preset of themeJson.settings?.typography?.fontSizes ?? []) {
  if (String(preset.size).includes('vw')) {
    throw new Error(`Typography preset must not scale with viewport width: ${preset.slug}`);
  }
}

for (const part of ['parts/header.html', 'parts/footer.html']) {
  const markup = readFileSync(resolve(theme, part), 'utf8');
  if (!markup.includes('"templateLock":"contentOnly"')) {
    throw new Error(`${part} must retain content-only locking.`);
  }
  if (/"tagName":"(?:header|footer)"/.test(markup)) {
    throw new Error(`${part} must let the semantic template-part area own its landmark.`);
  }
}

const templatePartAreas = new Map(
  themeJson.templateParts?.map(({ name, area }) => [name, area]) ?? []
);
for (const area of ['header', 'footer']) {
  if (templatePartAreas.get(area) !== area) {
    throw new Error(`theme.json must assign the ${area} part to the semantic ${area} area.`);
  }
}

for (const template of readdirSync(resolve(theme, 'templates'))) {
  if (!template.endsWith('.html')) {
    continue;
  }

  const markup = readFileSync(resolve(theme, 'templates', template), 'utf8');
  if (/wp:template-part[^\n]+"tagName":"(?:header|footer)"/.test(markup)) {
    throw new Error(`${template} must not wrap semantic header/footer parts in duplicate landmarks.`);
  }
}

for (const pattern of [
  'patterns/homepage-foundation.php',
  'patterns/page-intro.php',
  'patterns/call-to-action.php'
]) {
  const markup = readFileSync(resolve(theme, pattern), 'utf8');
  for (const header of ['Title:', 'Slug:', 'Categories:', 'Description:']) {
    if (!markup.includes(header)) {
      throw new Error(`${pattern} is missing ${header}`);
    }
  }
  if (markup.includes('*** Add File:')) {
    throw new Error(`${pattern} contains patch metadata.`);
  }
}

const homepage = readFileSync(resolve(theme, 'patterns/homepage-foundation.php'), 'utf8');
const frontPage = readFileSync(resolve(theme, 'templates/front-page.html'), 'utf8');
const themeStyles = readFileSync(resolve(theme, 'style.css'), 'utf8');

if (!homepage.includes('"templateLock":"contentOnly"')) {
  throw new Error('The Homepage pattern must retain content-only locking.');
}

if (!frontPage.includes('wp:post-content')) {
  throw new Error('The front-page template must render normal WordPress page content.');
}

if (frontPage.includes('wp:pattern')) {
  throw new Error('The front-page template must not hard-code Homepage content in the Site Editor.');
}

const coverComment = homepage.match(/<!-- wp:cover (\{.*?\}) -->/);
if (!coverComment) {
  throw new Error('Homepage must provide a serialized core Cover block.');
}
const coverAttributes = JSON.parse(coverComment[1]);
if (!coverAttributes.alt?.trim()) {
  throw new Error('Homepage Cover block must serialize its alternative text attribute.');
}
if (/<div class="[^"]*\bwp-block-cover\b[^"]*\bis-dark\b/.test(homepage)) {
  throw new Error('Homepage Cover wrapper must not retain Gutenberg\'s obsolete is-dark class.');
}
const expectedDimClass = `has-background-dim-${10 * Math.round(coverAttributes.dimRatio / 10)}`;
if (!homepage.includes(expectedDimClass)) {
  throw new Error(`Homepage Cover markup must match its dimRatio via ${expectedDimClass}.`);
}
const coverImageIndex = homepage.indexOf('wp-block-cover__image-background');
const coverOverlayIndex = homepage.indexOf('wp-block-cover__background');
const coverContentIndex = homepage.indexOf('wp-block-cover__inner-container');
if (!(coverImageIndex < coverOverlayIndex && coverOverlayIndex < coverContentIndex)) {
  throw new Error('Homepage Cover children must follow Gutenberg image, overlay and content order.');
}

if (
  !themeStyles.includes('outline: 3px solid var(--wp--preset--color--white)') ||
  !themeStyles.includes('box-shadow: 0 0 0 5px var(--wp--preset--color--farmtree-ink)')
) {
  throw new Error('Focus indicators must retain a two-tone high-contrast treatment.');
}

const requiredHomepageContent = [
  'Plan agroforestry with scientific confidence',
  'The FarmTree Platform',
  'Create agroforestry investment plans',
  'Compare farm and project options',
  'Understand future scenarios',
  'How agroforestry projects are planned, monitored and reported',
  'science-based, multi-KPI business plan',
  'Trust and references',
  'Proof Stories',
  'Carbon planning',
  'Farm value modelling',
  'Cocoa scenario planning and monitoring',
  'Water and landscape resilience monitoring',
  'FAQ',
  'News &amp; Insights',
  'farmtree-native/call-to-action'
];

for (const content of requiredHomepageContent) {
  if (!homepage.includes(content)) {
    throw new Error(`Homepage is missing approved content: ${content}`);
  }
}

for (const forbidden of [
  'Use Cases',
  'How different organisations use FarmTree',
  'local teams',
  'Farmers &amp; Farmer Organisations'
]) {
  if (homepage.toLowerCase().includes(forbidden.toLowerCase())) {
    throw new Error(`Homepage contains removed Frank-review content: ${forbidden}`);
  }
}

const sectionOrder = [
  'ft-home-hero',
  'ft-home-platform',
  'ft-home-technology',
  'ft-home-trust',
  'ft-home-proof',
  'ft-home-faq',
  'ft-home-news',
  'farmtree-native/call-to-action'
];

let lastSectionIndex = -1;
for (const section of sectionOrder) {
  const sectionIndex = homepage.indexOf(section);
  if (sectionIndex <= lastSectionIndex) {
    throw new Error(`Homepage section is missing or out of order: ${section}`);
  }
  lastSectionIndex = sectionIndex;
}

for (const match of homepage.matchAll(/<!-- wp:([^\s]+)(?:\s|\/-->)/g)) {
  const blockName = match[1];
  if (blockName.includes('/') && blockName !== 'farmtree-native/call-to-action') {
    throw new Error(`Homepage must use core blocks and approved patterns first: ${blockName}`);
  }
}

if ((homepage.match(/class="wp-block-details"/g) ?? []).length !== 4) {
  throw new Error('Homepage must provide four editable core Details FAQ entries.');
}

if ((homepage.match(/class="wp-block-group ft-proof-card /g) ?? []).length !== 4) {
  throw new Error('Homepage must provide four editable Proof Story theme cards.');
}

if ((homepage.match(/assets\/images\/partners\//g) ?? []).length !== 6) {
  throw new Error('Homepage must provide six editable partner/reference logos.');
}

for (const match of homepage.matchAll(/<h[12][^>]*>(.*?)<\/h[12]>/g)) {
  const heading = match[1].replace(/<[^>]+>/g, '').trim();
  if (heading.endsWith('.')) {
    throw new Error(`Display heading has an unnecessary full stop: ${heading}`);
  }
}

const pluginBootstrap = readFileSync(resolve(plugin, 'farmtree-content.php'), 'utf8');
const pluginArchitecture = readFileSync(resolve(plugin, 'includes/architecture.php'), 'utf8');
const runtimeRegistration = /register_(post_type|taxonomy|setting)\s*\(/;

if (runtimeRegistration.test(pluginBootstrap) || runtimeRegistration.test(pluginArchitecture)) {
  throw new Error('FT-NATIVE-001 must not register runtime content models.');
}

console.log('FARMTREE_NATIVE_FOUNDATION_OK');
