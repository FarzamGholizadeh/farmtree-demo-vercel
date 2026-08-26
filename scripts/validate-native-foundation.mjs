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
  'parts/quotation-modal.html',
  'templates/index.html',
  'templates/front-page.html',
  'templates/page.html',
  'templates/content-only-page.html',
  'templates/single.html',
  'templates/archive.html',
  'templates/404.html',
  'patterns/homepage-foundation.php',
  'patterns/brand-logo.php',
  'patterns/page-intro.php',
  'patterns/call-to-action.php',
  'styles/scientific.json',
  'assets/css/editor.css',
  'assets/js/native-interactions.js',
  'assets/images/brand/farmtree-logo.webp',
  'assets/images/home/hero-project-workshop.webp',
  'assets/images/home/hero-project-teams.webp',
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
  'assets/images/partners/helvetas.png',
  'assets/media/power-project-staff-landscape-poster.webp',
  'assets/media/power-project-staff-landscape.mp4',
  'assets/media/power-project-staff-plot-definition.png'
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
    const blockStack = [];
    for (const match of markup.matchAll(/<!-- wp:[^\s]+(?:\s+(\{.*?\}))?\s*\/?-->/g)) {
      if (!match[1]) {
        continue;
      }

      try {
        JSON.parse(match[1]);
      } catch {
        throw new Error(`${directory}/${entry} contains invalid block attribute JSON.`);
      }
    }

    for (const match of markup.matchAll(
      /<!--\s*(\/?)wp:([a-z0-9-]+(?:\/[a-z0-9-]+)?)(?:\s+\{[^\n]*\})?\s*(\/?)-->/gi
    )) {
      const [, closing, blockName, selfClosing] = match;

      if (closing) {
        const expected = blockStack.pop();
        if (expected !== blockName) {
          throw new Error(
            `${directory}/${entry} closes ${blockName} while ${expected ?? 'nothing'} is open.`
          );
        }
      } else if (!selfClosing) {
        blockStack.push(blockName);
      }
    }

    if (blockStack.length > 0) {
      throw new Error(
        `${directory}/${entry} has unclosed block comments: ${blockStack.join(', ')}.`
      );
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

if (themeJson.settings?.layout?.wideSize !== '1240px') {
  throw new Error('Expected the approved 1240px wide content cap.');
}

const approvedPalette = new Map([
  ['farmtree-green', '#00613F'],
  ['farmtree-forest', '#00613F'],
  ['farmtree-ink', '#163126'],
  ['farmtree-ivory', '#FAF8F1'],
  ['farmtree-cream', '#F5F1E8'],
  ['farmtree-gold', '#D3B06B'],
  ['farmtree-mist', '#DCE7D2'],
  ['farmtree-sky', '#F5F0E4']
]);

for (const [sourceName, settings] of [
  ['theme.json', themeJson],
  ['styles/scientific.json', variation]
]) {
  const palette = new Map(
    settings.settings?.color?.palette?.map(({ slug, color }) => [slug, color]) ?? []
  );

  for (const [slug, color] of approvedPalette) {
    if (palette.get(slug)?.toUpperCase() !== color.toUpperCase()) {
      throw new Error(`${sourceName} must retain approved ${slug} token ${color}.`);
    }
  }
}

const themeFontFamilies = themeJson.settings?.typography?.fontFamilies ?? [];
if (
  !themeFontFamilies.some(({ fontFamily }) => fontFamily.includes('Manrope')) ||
  !themeFontFamilies.some(({ fontFamily }) => fontFamily.includes('Inter'))
) {
  throw new Error('Theme typography must retain the approved Manrope and Inter families.');
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

const header = readFileSync(resolve(theme, 'parts/header.html'), 'utf8');
for (const contract of [
  'ft-skip-link',
  'ft-native-logo-shell',
  'ft-native-primary-nav',
  'Contact',
  'FarmTree Platform',
  'ft-native-language-options',
  'Nederlands is not yet available',
  '"overlayMenu":"always"',
  'ft-native-menu-trigger',
  'ft-native-menu-main',
  'ft-native-menu-farmtree',
  'ft-native-menu-company',
  'ft-native-menu-segments',
  'ft-native-menu-forms'
]) {
  if (!header.includes(contract)) {
    throw new Error(`Header is missing approved visual contract: ${contract}`);
  }
}
if (header.includes('wp:site-title') || header.includes('wp:site-logo')) {
  throw new Error('Approved Header must use the asset-backed logo pattern without a duplicate/dynamic Site Logo dependency.');
}

const footer = readFileSync(resolve(theme, 'parts/footer.html'), 'utf8');
for (const contract of [
  'ft-native-footer-logo-shell',
  'ft-native-footer-top',
  'Take action',
  'Join us in growing better agroforestry decisions',
  'Request a FarmTree demo ↗',
  'About Us',
  'Platform',
  'FarmTree B.V.',
  'Plus Ultra Building',
  'Bronland 12C-1',
  'info@farmtree.earth',
  'Copyright © 2026 FarmTree B.V.'
]) {
  if (!footer.includes(contract)) {
    throw new Error(`Footer is missing approved visual contract: ${contract}`);
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
if (templatePartAreas.get('quotation-modal') !== 'uncategorized') {
  throw new Error('theme.json must register the non-landmark quotation-modal template part.');
}

for (const template of readdirSync(resolve(theme, 'templates'))) {
  if (!template.endsWith('.html')) {
    continue;
  }

  const markup = readFileSync(resolve(theme, 'templates', template), 'utf8');
  if (/wp:template-part[^\n]+"tagName":"(?:header|footer)"/.test(markup)) {
    throw new Error(`${template} must not wrap semantic header/footer parts in duplicate landmarks.`);
  }
  if ((markup.match(/id="main-content"/g) ?? []).length !== 1 || !markup.includes('anchor":"main-content"')) {
    throw new Error(`${template} must provide exactly one skip-link target on its main landmark.`);
  }
  if (template !== 'front-page.html' && !markup.includes('ft-native-page-main')) {
    throw new Error(`${template} must offset its content below the fixed Header.`);
  }
  if (!markup.includes('wp:template-part {"slug":"quotation-modal"}')) {
    throw new Error(`${template} must include the site-wide quotation dialog once.`);
  }
}

for (const pattern of [
  'patterns/homepage-foundation.php',
  'patterns/brand-logo.php',
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
const editorStyles = readFileSync(resolve(theme, 'assets/css/editor.css'), 'utf8');
const callToAction = readFileSync(resolve(theme, 'patterns/call-to-action.php'), 'utf8');
const interactions = readFileSync(resolve(theme, 'assets/js/native-interactions.js'), 'utf8');
const functions = readFileSync(resolve(theme, 'functions.php'), 'utf8');
const preview = readFileSync(resolve(root, 'scripts/preview-native-homepage.mjs'), 'utf8');

for (const part of [header, footer, readFileSync(resolve(theme, 'parts/quotation-modal.html'), 'utf8')]) {
  if (part.includes('<?php')) {
    throw new Error('Block Theme HTML template parts must not contain non-executable PHP.');
  }
}

if (!homepage.includes('"templateLock":"contentOnly"')) {
  throw new Error('The Homepage pattern must retain content-only locking.');
}

if (!frontPage.includes('wp:post-content')) {
  throw new Error('The front-page template must render normal WordPress page content.');
}

if (!header.includes('href="#main-content"')) {
  throw new Error('Header must retain the shared skip link.');
}

if (frontPage.includes('wp:pattern')) {
  throw new Error('The front-page template must not hard-code Homepage content in the Site Editor.');
}

if (
  !homepage.includes('metadata":{"name":"FarmTree Hero"}') ||
  !homepage.includes('metadata":{"name":"Editable Hero images"}') ||
  homepage.includes('wp:cover')
) {
  throw new Error('Homepage Hero must use the native editable Image-slide group, not a URL-overwritten Cover.');
}
if ((homepage.match(/class="wp-block-image size-full ft-home-hero-slide/g) ?? []).length !== 4) {
  throw new Error('Homepage Hero must expose four editor-owned core Image slides.');
}

if (
  !themeStyles.includes('outline: 3px solid var(--wp--preset--color--white)') ||
  !themeStyles.includes('box-shadow: 0 0 0 5px var(--wp--preset--color--farmtree-ink)')
) {
  throw new Error('Focus indicators must retain a two-tone high-contrast treatment.');
}

const requiredHomepageContent = [
  'Make agroforestry measurable, investable and scalable',
  'Turn field data into investment scenarios',
  'Support project staff with clearer planning tools',
  'Report carbon, farmer value and long-term performance',
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
  'Plan agroforestry with scientific confidence',
  'Use Cases',
  'How different organisations use FarmTree',
  'local teams',
  'Farmers &amp; Farmer Organisations'
]) {
  if (homepage.toLowerCase().includes(forbidden.toLowerCase())) {
    throw new Error(`Homepage contains removed Frank-review content: ${forbidden}`);
  }
}

if ((homepage.match(/<h1\b/g) ?? []).length !== 1) {
  throw new Error('Homepage must contain exactly one visible H1.');
}

for (const contract of [
  'ft-platform-layout',
  'ft-platform-copy',
  'ft-platform-media',
  'power-project-staff-landscape-poster.webp',
  'power-project-staff-landscape.mp4',
  'power-project-staff-plot-definition.png',
  'data-ft-platform-prev',
  'data-ft-platform-next',
  'data-ft-platform-video-toggle',
  'data-ft-platform-status',
  'Site information',
  'Climate, soil and terrain',
  'Species database',
  'Plan, monitor and report',
  'ft-faq-layout',
  'data-ft-hero-prev',
  'data-ft-hero-next',
  'data-ft-hero-status'
]) {
  if (!homepage.includes(contract)) {
    throw new Error(`Homepage is missing native parity contract: ${contract}`);
  }
}

for (const contract of [
  '.editor-styles-wrapper .ft-home-hero-media',
  '.editor-styles-wrapper .ft-home-hero-slide:not(.is-active)',
  '.editor-styles-wrapper .ft-home-hero-copy-sources',
  '.editor-styles-wrapper .ft-home-hero-copy-source',
  '.editor-styles-wrapper .ft-platform-slide:not(.is-active)',
  'display: block !important'
]) {
  if (!editorStyles.includes(contract)) {
    throw new Error(`Editor CSS must expose every editor-owned carousel item: ${contract}`);
  }
}

if ((homepage.match(/data-ft-hero-dot/g) ?? []).length !== 4) {
  throw new Error('Homepage Hero must expose four manual image choices.');
}
if (
  (homepage.match(/class="wp-block-group ft-home-hero-current"/g) ?? []).length !== 1 ||
  (homepage.match(/class="wp-block-group ft-home-hero-copy-source"/g) ?? []).length !== 3 ||
  !homepage.includes('ft-home-hero-current-heading') ||
  !homepage.includes('hero-project-teams.webp')
) {
  throw new Error('Homepage Hero must pair one persistent H1 with four editable approved media/message states.');
}

if (
  (homepage.match(/class="wp-block-group ft-platform-screen ft-platform-slide ft-platform-video-slide is-active"/g) ?? []).length !== 1 ||
  (homepage.match(/class="wp-block-video ft-platform-video"/g) ?? []).length !== 1 ||
  (homepage.match(/class="wp-block-image size-full ft-platform-screen ft-platform-slide"/g) ?? []).length !== 1 ||
  (homepage.match(/data-ft-platform-dot/g) ?? []).length !== 2
) {
  throw new Error('Platform media must expose approved editable video/image media and two manual choices.');
}

if (
  !homepage.includes('"controls":false') ||
  !homepage.includes('loop muted playsinline') ||
  homepage.includes('preload="metadata"') ||
  /<video\b[^>]*\bautoplay\b/i.test(homepage)
) {
  throw new Error('Platform footage saved markup must stay canonical, muted, looping, inline and visibility-controlled.');
}

for (const image of homepage.matchAll(/<img\b[\s\S]*?\/>/g)) {
  if (!/\balt="[^"\s][^"]*"/.test(image[0])) {
    throw new Error(`Homepage image must have meaningful alternative text: ${image[0]}`);
  }
  if (/\s(?:width|height|loading|decoding|fetchpriority)="/i.test(image[0])) {
    throw new Error(`Core Image saved markup must leave runtime-only image attributes to WordPress: ${image[0]}`);
  }
}

for (const link of `${homepage}\n${callToAction}\n${header}\n${footer}`.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
  if (!/\brel="[^"]*noopener[^"]*"/.test(link[0]) || !/\brel="[^"]*noreferrer[^"]*"/.test(link[0])) {
    throw new Error(`External target link must retain noopener and noreferrer: ${link[0]}`);
  }
}

for (const contract of [
  'ft-final-cta',
  'Make agroforestry measurable, investable and scalable.',
  'Ready to build a stronger agroforestry investment case?',
  'Request a demo',
  'Ask for a quotation'
]) {
  if (!callToAction.includes(contract)) {
    throw new Error(`Call To Action is missing approved visual contract: ${contract}`);
  }
}

for (const contract of [
  '--ft-approved-green: #00613f',
  '--ft-approved-cream: #f5f1e8',
  '--ft-approved-gold: #d3b06b',
  '--ft-approved-mist: #dce7d2',
  '--ft-content-wide: 1240px',
  '.ft-platform-copy',
  'grid-template-columns: repeat(4, minmax(0, 1fr))',
  '.ft-trust-quote',
  '.ft-proof-grid',
  'grid-template-columns: repeat(2, minmax(0, 1fr))',
  '.ft-faq-layout',
  '.ft-home-news-query .wp-block-post-template',
  '@media (width <= 1100px)',
  '@media (width <= 1050px)',
  '@media (width <= 1023px)',
  '@media (width <= 1000px)',
  '@media (width <= 900px)',
  '@media (width <= 768px)',
  '@media (width <= 760px)',
  '@media (width <= 700px)',
  '@media (width <= 680px)',
  '@media (width <= 640px)',
  '@media (width <= 620px)',
  '@media (width <= 560px)',
  '@media (width <= 480px)',
  '@media (width <= 430px)',
  '@media (width <= 360px)',
  'width: 44px',
  'height: 44px'
]) {
  if (!themeStyles.includes(contract)) {
    throw new Error(`Native CSS is missing approved responsive contract: ${contract}`);
  }
}

if (!themeStyles.includes('box-sizing: border-box')) {
  throw new Error('Theme and preview must share a predictable border-box sizing model.');
}

if (/\.ft-native-home\s*\{[^}]*overflow(?:-x)?\s*:\s*(?:hidden|clip)/is.test(themeStyles)) {
  throw new Error('Homepage root must not mask horizontal layout defects with overflow clipping.');
}

if (/\bzoom\s*:/i.test(themeStyles) || /(?:^|})\s*(?::root|html|body)\s*\{[^}]*\btransform\s*:/ims.test(themeStyles)) {
  throw new Error('Native CSS must not use page-level zoom or root transforms for visual parity.');
}

for (const contract of [
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
  'aria-pressed',
  'aria-controls',
  'prefers-reduced-motion: reduce'
]) {
  if (!interactions.includes(contract)) {
    throw new Error(`Manual Hero interactions are missing accessibility contract: ${contract}`);
  }
}

for (const contract of [
  'ft-platform-slide',
  'data-ft-platform-dot',
  'data-ft-platform-prev',
  'data-ft-platform-next',
  'aria-roledescription',
  'FarmTree Platform media',
  'IntersectionObserver',
  'document.hidden',
  'reducedMotionQuery.matches',
  'video.play()',
  'video.pause()',
  'userPausedVideo',
  'Pause landscape video'
]) {
  if (!interactions.includes(contract)) {
    throw new Error(`Manual Platform interactions are missing accessibility contract: ${contract}`);
  }
}

if (/\bsetInterval\s*\(|\bsetTimeout\s*\(/.test(interactions)) {
  throw new Error('Homepage Hero must remain manual-only and must not schedule autoplay.');
}

if (
  !functions.includes('farmtree-native-fonts') ||
  !functions.includes('family=Manrope') ||
  !functions.includes('family=Inter') ||
  !functions.includes('assets/js/native-interactions.js') ||
  !functions.includes('farmtree_native_image_loading_attributes') ||
  !functions.includes('farmtree_native_platform_video_attributes') ||
  !functions.includes("add_action('wp_enqueue_scripts', 'farmtree_native_enqueue_interactions')") ||
  !functions.includes("set_attribute('preload', 'metadata')") ||
  !functions.includes("set_attribute('fetchpriority', 'high')") ||
  !functions.includes("set_attribute('loading', $is_primary_hero ? 'eager' : 'lazy')")
) {
  throw new Error('Theme must enqueue approved assets and add image hints at render time.');
}

if (functions.includes("add_action('enqueue_block_editor_assets', 'farmtree_native_enqueue_interactions')")) {
  throw new Error('Frontend carousel/dialog interactions must not mutate Block Editor content.');
}

const quotationModal = readFileSync(resolve(theme, 'parts/quotation-modal.html'), 'utf8');
for (const contract of [
  'data-ft-quotation-dialog',
  'method="dialog"',
  'Request information',
  'Full name',
  'Company or organisation',
  'Email address',
  'Area of interest',
  'Your question or project brief',
  'data-ft-quotation-error',
  'Form submission is not configured yet'
]) {
  if (!quotationModal.includes(contract)) {
    throw new Error(`Quotation dialog is missing fail-safe parity contract: ${contract}`);
  }
}

if (/\baction=/.test(quotationModal) || !quotationModal.includes('mailto:info@farmtree.earth')) {
  throw new Error('Quotation dialog must fail without a network request and expose the approved email fallback.');
}

for (const contract of [
  'initialiseQuotationDialog',
  'showModal',
  "event.preventDefault()",
  "document.body.classList.add('ft-quotation-open')",
  'error.hidden = false',
  'initialiseBentoGroups',
  "document.createElement('h2')",
  'ft-native-menu-card-heading',
  'heading.hidden = true'
]) {
  if (!interactions.includes(contract)) {
    throw new Error(`Native interactions are missing menu/dialog contract: ${contract}`);
  }
}

if (interactions.includes("setAttribute('role', 'heading')")) {
  throw new Error('Bento disclosure buttons must not be assigned an invalid ARIA heading role.');
}

for (const contract of [
  '.ft-quotation-modal',
  '.ft-quotation-modal::backdrop',
  '.ft-quotation-grid',
  'body.ft-quotation-open',
  '.ft-native-menu-segments',
  'grid-template-columns: repeat(12, minmax(0, 1fr))'
]) {
  if (!themeStyles.includes(contract)) {
    throw new Error(`Native CSS is missing Bento/dialog parity contract: ${contract}`);
  }
}

if (
  preview.includes('.ft-preview-header') ||
  preview.includes('.ft-preview-footer') ||
  !preview.includes("readFileSync(resolve(theme, 'theme.json')") ||
  !preview.includes("parts/header.html") ||
  !preview.includes("parts/footer.html") ||
  !preview.includes('noindex,nofollow')
) {
  throw new Error('Local preview must use real native parts/tokens and remain explicitly noindex.');
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
