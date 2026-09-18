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
  'templates/single-customer_segment.html',
  'templates/single-proof_story.html',
  'templates/archive.html',
  'templates/404.html',
  'patterns/homepage-foundation.php',
  'patterns/brand-logo.php',
  'patterns/page-intro.php',
  'patterns/call-to-action.php',
  'styles/scientific.json',
  'assets/css/editor.css',
  'assets/js/native-interactions.js',
  'assets/data/world-land-110m.json',
  'assets/data/README.md',
  'assets/images/brand/farmtree-logo.webp',
  'assets/images/home/hero-field-planning-v1.jpg',
  'assets/images/home/hero-impact-reporting-v2.jpg',
  'assets/images/home/earth-blue-marble-nasa-2048.jpg',
  'assets/images/home/hero-project-workshop.webp',
  'assets/images/home/hero-project-teams.webp',
  'assets/images/home/platform-slide-1.png',
  'assets/images/home/platform-slide-2.png',
  'assets/images/home/technology-model.webp',
  'assets/images/home/proof-carbon.webp',
  'assets/images/home/proof-farm-value.webp',
  'assets/images/home/proof-cocoa.webp',
  'assets/images/home/proof-water.webp',
  'assets/images/proof/proof-carbon-planning-1600.webp',
  'assets/images/proof/proof-farm-value-modelling-1600.webp',
  'assets/images/proof/proof-cocoa-scenario-planning-1600.webp',
  'assets/images/proof/proof-water-landscape-resilience-1600.webp',
  'assets/images/proof/proof-carbon-documentary-v2.jpg',
  'assets/images/proof/proof-farm-value-documentary-v2.jpg',
  'assets/images/proof/proof-cocoa-documentary-v2.jpg',
  'assets/images/proof/proof-water-documentary-v2.jpg',
  'assets/images/partners/giz.png',
  'assets/images/partners/rabobank.png',
  'assets/images/partners/cgiar.png',
  'assets/images/partners/fao.png',
  'assets/images/partners/catie.png',
  'assets/images/partners/helvetas.png',
  'assets/images/team/team-field-collaboration-v1.jpg',
  'assets/images/team/maximilian-michael-moeller-800.jpg',
  'assets/images/team/germaine-van-teeffelen-800.jpg',
  'assets/images/testimonials/generated-placeholders/portrait-01.jpg',
  'assets/images/testimonials/generated-placeholders/portrait-02.jpg',
  'assets/images/testimonials/generated-placeholders/portrait-03.jpg',
  'assets/images/testimonials/generated-placeholders/portrait-04.jpg',
  'assets/images/testimonials/generated-placeholders/portrait-05.jpg',
  'assets/media/farmtree-platform-final-tools-review-poster.jpg',
  'assets/media/farmtree-platform-final-tools-review.mp4',
  'assets/media/farmtree-platform-final-tools-review.webm',
  'assets/media/final-tools-review-11s-to-40s-2x.gif',
  'assets/media/final-tools-review-11s-to-40s-poster.png',
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

for (const file of [
  'farmtree-content.php',
  'includes/architecture.php',
  'data/customer-segments.json',
  'data/editorial-drafts.json',
  'data/proof-stories.json',
  'data/english-pages.json',
  'data/team-members.json',
  'README.md'
]) {
  if (!existsSync(resolve(plugin, file))) {
    throw new Error(`Missing content plugin file: ${file}`);
  }
}

const publicationEvidencePath = resolve(root, 'docs/FT-NATIVE-002-PUBLICATION-EVIDENCE.md');
if (!existsSync(publicationEvidencePath)) {
  throw new Error('Missing FT-NATIVE-002 publication evidence register.');
}
const publicationEvidence = readFileSync(publicationEvidencePath, 'utf8');
for (const contract of [
  'Exact source restored; publication permission/attribution sign-off remains human',
  'FAO reference logo',
  'CATIE reference logo',
  'Helvetas reference logo',
  'Approved production reference strip only',
  'final human label approval remains required',
  'numerical performance claim or star rating'
]) {
  if (!publicationEvidence.includes(contract)) {
    throw new Error(`Publication evidence register is missing: ${contract}`);
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
if (header.includes('ft-skip-link') || (header.match(/Skip to content/g) ?? []).length > 0) {
  throw new Error('Header must defer to the single skip link injected by WordPress core.');
}
for (const localeContract of [
  'data-ft-locale="en" data-ft-locale-path="/" data-ft-locale-status="active"',
  'data-ft-locale="nl" data-ft-locale-path="/nl/" data-ft-locale-status="reserved"',
  'data-ft-locale="de" data-ft-locale-path="/de/" data-ft-locale-status="reserved"'
]) {
  if (!header.includes(localeContract)) {
    throw new Error(`Header is missing locale availability metadata: ${localeContract}`);
  }
}
if (/<a[^>]+(?:href|hreflang)="\/(?:nl|de)\/?"/i.test(header)) {
  throw new Error('Reserved Dutch and German locales must not be published as links or hreflang alternates.');
}
if (header.includes('wp:site-title') || header.includes('wp:site-logo')) {
  throw new Error('Approved Header must use the asset-backed logo pattern without a duplicate/dynamic Site Logo dependency.');
}

const footer = readFileSync(resolve(theme, 'parts/footer.html'), 'utf8');
for (const contract of [
  'ft-native-footer-location',
  'About Us',
  'Platform',
  'FarmTree in the field',
  'Plus Ultra Building',
  'Bronland 12C-1',
  'info@farmtree.earth',
  'Copyright © 2026 FarmTree B.V.'
]) {
  if (!footer.includes(contract)) {
    throw new Error(`Footer is missing approved visual contract: ${contract}`);
  }
}
for (const removedFooterCtaContract of [
  'ft-native-footer-top',
  'Take action',
  'Join us in growing better agroforestry decisions',
  'Request a FarmTree demo ↗'
]) {
  if (footer.includes(removedFooterCtaContract)) {
    throw new Error(`Shared Footer must not retain its removed CTA contract: ${removedFooterCtaContract}`);
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

const homepage = readFileSync(resolve(theme, 'patterns/homepage-foundation.php'), 'utf8')
  .replaceAll('\\u0026#x2197;', '↗').replaceAll('&#x2197;', '↗');
const frontPage = readFileSync(resolve(theme, 'templates/front-page.html'), 'utf8');
const errorPage = readFileSync(resolve(theme, 'templates/404.html'), 'utf8');
const themeStyles = readFileSync(resolve(theme, 'style.css'), 'utf8');
const editorStyles = readFileSync(resolve(theme, 'assets/css/editor.css'), 'utf8');
const callToAction = readFileSync(resolve(theme, 'patterns/call-to-action.php'), 'utf8');
const interactions = readFileSync(resolve(theme, 'assets/js/native-interactions.js'), 'utf8');
const functions = readFileSync(resolve(theme, 'functions.php'), 'utf8');
const preview = readFileSync(resolve(root, 'scripts/preview-native-homepage.mjs'), 'utf8');
const bootstrap = readFileSync(resolve(root, 'scripts/bootstrap-local-wordpress.mjs'), 'utf8');
const localStart = readFileSync(resolve(root, 'scripts/start-local-wordpress.mjs'), 'utf8');
const packageJson = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
const teamMembers = JSON.parse(readFileSync(resolve(plugin, 'data/team-members.json'), 'utf8'));
const editorialDrafts = readFileSync(resolve(plugin, 'data/editorial-drafts.json'), 'utf8');
const englishPages = JSON.parse(readFileSync(resolve(plugin, 'data/english-pages.json'), 'utf8'));
const managedContentManifest = readFileSync(resolve(plugin, 'includes/managed-content-manifest.php'), 'utf8');

if ((managedContentManifest.match(/'comment_status' => 'closed'/g) ?? []).length !== 9) {
  throw new Error('All nine managed News posts, and only those posts, must declare closed comments.');
}
for (const [slug, title] of [['privacy', 'Privacy Policy'], ['terms', 'Terms & Conditions']]) {
  const legalPage = englishPages.find((page) => page.slug === slug);
  if (legalPage?.title !== title || legalPage.lastUpdated !== '3 September 2026' || legalPage.sections?.length !== 16) {
    throw new Error(`${title} must contain the complete audited 3 September 2026 review copy.`);
  }
}

if (teamMembers.length !== 10) {
  throw new Error('Team data must contain the ten requested current entries.');
}
for (const removedName of ['Mia Beyens', 'Ruben van Voorst', 'Nikolaos Mantzaridis', 'Mary Theodorah Ajal', 'Crésus Odjo']) {
  if (teamMembers.some(({ name }) => name === removedName)) {
    throw new Error(`Removed Team member remains in current data: ${removedName}`);
  }
}
const maximilian = teamMembers.find(({ name }) => name === 'Maximilian Michael Möller');
if (
  maximilian?.linkedin !== 'https://www.linkedin.com/in/maximilian-michael-moeller/' ||
  maximilian.role !== 'Chief Growth Officer' ||
  maximilian.image !== 'maximilian-michael-moeller-800.jpg' ||
  maximilian.order !== 2 ||
  teamMembers.findIndex(({ name }) => name === 'Maximilian Michael Möller') !== 1
) {
  throw new Error('Maximilian must use the supplied portrait, supported role and approved position between Arnoud and Frank.');
}
const germaine = teamMembers.find(({ name }) => name === 'Germaine van Teeffelen');
if (
  germaine?.linkedin !== 'https://www.linkedin.com/in/germaine-van-teeffelen/' ||
  germaine.role !== 'Interim Project Manager' ||
  germaine.image !== 'germaine-van-teeffelen-800.jpg' ||
  germaine.order !== 4 ||
  teamMembers.slice(3, 6).map(({ name }) => name).join('|') !== 'Germaine van Teeffelen|Irene Vinkenburg|Betelehem Beyene'
) {
  throw new Error('The second desktop Team row must begin Germaine, Irene and Betelehem with Germaine using the supplied portrait and verified role.');
}

for (const visibleSource of [homepage, footer, editorialDrafts]) {
  if (visibleSource.includes('—')) {
    throw new Error('Visible website copy must not contain em dash characters.');
  }
}

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
  'science-based, multi-KPI business plans',
  'Connect local conditions, opportunities and risks',
  'Compare business and impact projections time - based',
  'Global perspective',
  'Agroforestry decisions across diverse landscapes',
  'FarmTree supports scenario thinking across tropical, temperate, dryland and highland contexts.',
  'FarmTree Client',
  'Trusted by organisations, practitioners and partners working across agroforestry and climate.',
  'Proof Stories',
  '>Carbon</h3>',
  'Farm Valuation',
  'Cocoa scenario planning and monitoring',
  'Landscape Hydrology',
  'FAQ',
  'Last News',
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
  'final-tools-review-11s-to-40s-poster.png',
  'final-tools-review-11s-to-40s-2x.gif',
  'The approved FarmTree Platform workflow',
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
  'data-ft-globe-shell',
  'data-ft-globe',
  'Interactive realistic Earth showing FarmTree locations and connections',
  'perPage":3',
  'ft-home-news-more',
  'Read article ↗',
  'ft-testimonial-marquee',
  'ft-testimonial-cards',
  'ft-testimonial-card'
]) {
  if (!homepage.includes(contract)) {
    throw new Error(`Homepage is missing finalization contract: ${contract}`);
  }
}
for (const contract of [
  'ft-error-code',
  'Page not found',
  "The page you're looking for might have been moved or doesn't exist.",
  'href="/">Go Home</a>',
  'href="/platform/">Explore</a>'
]) {
  if (!errorPage.includes(contract)) {
    throw new Error(`404 template is missing finalization contract: ${contract}`);
  }
}
if (packageJson.scripts?.['wp:start'] !== 'node scripts/start-local-wordpress.mjs') {
  throw new Error('wp:start must always pass through the idempotent local runtime launcher.');
}
for (const contract of [
  "['start', '--runtime=playground']",
  'if (!(await runtimeIsReachable()))',
  "new URL('./bootstrap-local-wordpress.mjs', import.meta.url)",
  'Local WordPress startup refuses to inspect or modify a non-loopback host.'
]) {
  if (!localStart.includes(contract)) {
    throw new Error(`Local runtime launcher is missing its restart-safety contract: ${contract}`);
  }
}
for (const contract of [
  "'farmtree-content/farmtree-content'",
  "'farmtree-ai-assistant/farmtree-ai-assistant'",
  "JSON.stringify({ status: 'active' })",
  'waitForAutoLoginSession'
]) {
  if (!bootstrap.includes(contract)) {
    throw new Error(`Local bootstrap is missing its reconstruction contract: ${contract}`);
  }
}

for (const contract of [
  '.editor-styles-wrapper .ft-home-hero-media',
  '.editor-styles-wrapper .ft-home-hero-slide:not(.is-active)',
  '.editor-styles-wrapper .ft-home-hero-copy-sources',
  '.editor-styles-wrapper .ft-home-hero-copy-source',
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
  !homepage.includes('farmtree-mixed-agricultural-landscape-hero.jpg')
) {
  throw new Error('Homepage Hero must pair one persistent H1 with four editable approved media/message states.');
}

if (
  !homepage.includes('ft-platform-screen ft-platform-gif') ||
  !homepage.includes('ft-platform-screen ft-platform-poster') ||
  !homepage.includes('ft-platform-media-frame') ||
  /ft-platform-device(?:-lid|-screen|-base|-camera)?/.test(homepage) ||
  /data-ft-platform-(?:dot|prev|next)|<video\b/i.test(homepage)
) {
  throw new Error('Platform media must expose the approved GIF/poster directly with no obsolete device, video or carousel UI.');
}

for (const image of homepage.matchAll(/<img\b[\s\S]*?\/>/g)) {
  const isDecorativeReducedMotionPoster = image[0].includes('class="ft-platform-poster-image"') && image[0].includes('alt=""');
  if (!isDecorativeReducedMotionPoster && !/\balt="[^"\s][^"]*"/.test(image[0])) {
    throw new Error(`Homepage image must have meaningful alternative text: ${image[0]}`);
  }
  if (!image[0].includes('assets/images/proof/') && !image[0].includes('assets/images/testimonials/') && !image[0].includes('assets/media/final-tools-review-11s-to-40s-2x.gif') && !image[0].includes('assets/media/final-tools-review-11s-to-40s-poster.png') && /\s(?:width|height|loading|decoding|fetchpriority)="/i.test(image[0])) {
    throw new Error(`Core Image saved markup must leave runtime-only image attributes to WordPress: ${image[0]}`);
  }
}

for (const link of `${homepage}\n${callToAction}\n${header}\n${footer}`.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
  if (!/\brel="[^"]*noopener[^"]*"/.test(link[0]) || !/\brel="[^"]*noreferrer[^"]*"/.test(link[0])) {
    throw new Error(`External target link must retain noopener and noreferrer: ${link[0]}`);
  }
}

for (const link of `${header}\n${footer}`.matchAll(/<!-- wp:navigation-link (\{[^\n]+"opensInNewTab":true[^\n]+\}) \/-->/g)) {
  if (!link[1].includes('"rel":"noreferrer noopener"')) {
    throw new Error(`External Navigation Link block must retain noopener and noreferrer: ${link[0]}`);
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
  "event.key === 'Enter'",
  "event.key === ' '",
  'selector.open = !selector.open',
  '!event.repeat',
  "event.key === 'Escape'",
  "selector.removeAttribute('open')",
  'summary.focus()'
]) {
  if (!interactions.includes(contract)) {
    throw new Error(`Language selector is missing keyboard accessibility contract: ${contract}`);
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
  'prefers-reduced-motion: reduce',
  'pointerdown',
  'pointerup',
  'pointercancel'
]) {
  if (!interactions.includes(contract)) {
    throw new Error(`Manual Hero interactions are missing accessibility contract: ${contract}`);
  }
}

if (!interactions.includes('const heroAutoplayDelay = 5000') || !interactions.includes('interactionPaused')) {
  throw new Error('Homepage Hero must schedule the approved five-second loop and pause for direct interaction.');
}

for (const contract of [
  'const rotationPerFrame = 0.00135',
  'native-canvas-blue-marble',
  'loadEarthTexture',
  'nasa-blue-marble-january',
  'world-land-110m.json',
  'decodeTopology',
  'pointInPolygon',
  'pointInLand',
  'arcBetween',
  'initialiseMenuOverlay',
  "document.body.style.position = 'fixed'",
  'window.scrollTo(0, savedScrollY)'
]) {
  if (!interactions.includes(contract)) {
    throw new Error(`Homepage V2 interaction contract is missing: ${contract}`);
  }
}

if (interactions.includes('initialiseProofSpotlights') || interactions.includes('--ft-spot-x')) {
  throw new Error('The removed Proof Story pointer spotlight must not remain in the native runtime.');
}

for (const removedInteraction of ['initialiseTechnologySignal', 'initialiseTestimonials']) {
  if (interactions.includes(removedInteraction)) {
    throw new Error(`Removed interaction must not remain in the native runtime: ${removedInteraction}`);
  }
}

const themeStyle = readFileSync(resolve(theme, 'style.css'), 'utf8');
for (const localFontContract of [
  '@font-face',
  'assets/fonts/inter-latin-variable.woff2',
  'assets/fonts/manrope-latin-variable.woff2',
  'font-weight: 400 900',
  'font-weight: 500 800'
]) {
  if (!themeStyle.includes(localFontContract)) {
    throw new Error(`Theme is missing self-hosted font contract: ${localFontContract}`);
  }
}
for (const forbiddenFontHost of ['fonts.googleapis.com', 'fonts.gstatic.com']) {
  if (functions.includes(forbiddenFontHost) || themeStyle.includes(forbiddenFontHost)) {
    throw new Error(`Theme must not request public fonts from ${forbiddenFontHost}.`);
  }
}
for (const localFontFile of [
  'assets/fonts/inter-latin-variable.woff2',
  'assets/fonts/manrope-latin-variable.woff2',
  'assets/fonts/INTER-OFL.txt',
  'assets/fonts/MANROPE-OFL.txt'
]) {
  if (!existsSync(resolve(theme, localFontFile))) {
    throw new Error(`Theme is missing self-hosted font runtime file: ${localFontFile}`);
  }
}

if (
  !functions.includes('farmtree-native-style') ||
  !functions.includes('get_stylesheet_uri()') ||
  !functions.includes("add_action('wp_enqueue_scripts', 'farmtree_native_enqueue_styles')") ||
  !functions.includes('assets/js/native-interactions.js') ||
  !functions.includes('farmtree_native_image_loading_attributes') ||
  !functions.includes('farmtree_native_partner_gallery_attributes') ||
  !functions.includes("add_action('wp_enqueue_scripts', 'farmtree_native_enqueue_interactions')") ||
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
  'aria-describedby="ft-quotation-status"',
  'Ask for a quotation',
  'Request your quotation by email.',
  'does not collect, store or send personal data',
  'Email FarmTree about a quotation',
  'do not include sensitive or confidential information'
]) {
  if (!quotationModal.includes(contract)) {
    throw new Error(`Quotation dialog is missing fail-safe parity contract: ${contract}`);
  }
}

if (
  /<(?:form|input|textarea|select)\b|type="submit"|\baction=|data-ft-quotation-error|submission (?:succeeded|successful)/i.test(quotationModal) ||
  !quotationModal.includes('mailto:info@farmtree.earth?subject=FarmTree%20quotation%20request')
) {
  throw new Error('Unconfigured quotation delivery must collect no PII, expose no submit/success state and provide the approved email fallback.');
}

const quotationTriggers = [header, homepage, callToAction].join('\n');
if (
  (quotationTriggers.match(/mailto:info@farmtree\.earth\?subject=FarmTree%20quotation%20request/g) ?? []).length !== 4 ||
  /ft-native-quotation-action[^\n]*\/contact\//.test(quotationTriggers)
) {
  throw new Error('All four quotation triggers must use the real email fallback when JavaScript is unavailable.');
}

const quotationInteractions = interactions.slice(
  interactions.indexOf('function initialiseQuotationDialog'),
  interactions.indexOf('function initialise()', interactions.indexOf('function initialiseQuotationDialog'))
);
if (/\b(?:fetch|XMLHttpRequest|sendBeacon|FormData|localStorage|sessionStorage|console)\b/.test(quotationInteractions)) {
  throw new Error('Native quotation interactions must not transport, persist or log personal information.');
}

for (const contract of [
  'initialiseQuotationDialog',
  'showModal',
  "event.preventDefault()",
  "document.body.classList.add('ft-quotation-open')",
  "dialog.addEventListener('keydown'",
  "event.key === 'Tab'",
  "last?.focus()",
  "first?.focus()",
  "dialog.addEventListener('cancel'",
  'initialiseBentoGroups',
  "document.createElement('h2')",
  'ft-native-menu-card-heading',
  'heading.hidden = true',
  'initialiseFaqDetails',
  'summary.parentElement.open = !summary.parentElement.open'
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
  '.ft-quotation-unavailable',
  '.ft-quotation-email',
  'body.ft-quotation-open',
  '.ft-platform-visual:focus-visible',
  '.ft-partner-logos:focus-visible',
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
if (!preview.includes('<a class="ft-skip-link" href="#main-content">Skip to content</a>')) {
  throw new Error('Static preview must provide one skip link because WordPress core is not present there.');
}
if (!preview.includes('aria-label="Partner and reference logos"')) {
  throw new Error('Static preview must name the keyboard-focusable partner-logo rail.');
}

const sectionOrder = [
  'ft-home-hero',
  'ft-home-platform',
  'ft-home-technology',
  'ft-home-metrics',
  'ft-home-globe',
  'ft-home-trust',
  'ft-home-proof',
  'ft-home-news',
  'ft-home-faq',
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

if ((homepage.match(/class="wp-block-details"/g) ?? []).length !== 8) {
  throw new Error('Homepage must provide eight editable core Details FAQ entries.');
}

if ((homepage.match(/class="wp-block-group ft-proof-card /g) ?? []).length !== 4) {
  throw new Error('Homepage must provide four editable Proof Story theme cards.');
}

if ((homepage.match(/assets\/images\/partners\//g) ?? []).length !== 6) {
  throw new Error('Homepage must provide six editable partner/reference logos.');
}

for (const contract of [
  'The FarmTree Tool and team helped us understand the value of different agroforestry systems and the potential for increased revenue over a few decades.',
  'FarmTree is the first and only service that makes science-based agroforestry projections at scale: water, carbon, biomass, even cost and revenue. They do everything!',
  '>Carbon</h3>',
  '>Farm Valuation</h3>',
  '>Cocoa scenario planning and monitoring</h3>',
  '>Landscape Hydrology</h3>',
  'alt="Tall green crops growing between leafy trees"',
  'alt="Green ground vegetation growing between rows of small trees"',
  'alt="Trees and low crops on sandy ground beside rural structures"',
  'alt="Rectangular green crop beds divided by earthen paths and small trees"',
  'alt="Field team measuring a mature tree and recording observations in an agroforestry landscape"',
  'alt="Farmer and adviser reviewing scenario materials at a farm-office table"',
  'alt="Cocoa field team inspecting pods and recording observations beneath shade trees"',
  'alt="Field team examining soil and recording water observations beside a stream"',
  'The approved FarmTree Platform workflow'
]) {
  if (!homepage.includes(contract)) {
    throw new Error(`Homepage is missing approved publication copy or literal media text: ${contract}`);
  }
}


if ((homepage.match(/class="[^"]*\bft-testimonial-card\b/g) ?? []).length !== 5) {
  throw new Error('Homepage must provide five core-block testimonial cards without a sixth placeholder.');
}

for (let portrait = 1; portrait <= 5; portrait += 1) {
  if (!homepage.includes(`generated-placeholders/portrait-0${portrait}.jpg`)) {
    throw new Error(`Homepage testimonial portrait ${portrait} is missing.`);
  }
}

for (const contract of [
  'ft-testimonial-verified',
  'ft-testimonial-identity',
  'data-ft-earth-texture',
  'earth-blue-marble-nasa-2048.jpg',
  'farmtree-structured-field-plots-hero.jpg'
]) {
  if (!homepage.includes(contract)) {
    throw new Error(`Homepage refinement contract is missing: ${contract}`);
  }
}

for (const contract of [
  "sequence.dataset.ftRailOriginal = 'true'",
  "rail.dataset.ftRailStart = 'middle-sequence-card-3'",
  'Math.max(2, Math.ceil(railWidth / sequenceWidth) + 1)',
  "track.prepend(before)",
  "rail.classList.add('is-ready')",
  "clone.setAttribute('inert', '')",
  "card.classList.remove('ft-motion-target', 'is-visible')",
  'document.fonts.ready.then(startMeasuring)',
  "rail.dataset.ftRailTrackWidth = String(Math.round(track.scrollWidth))",
  '--ft-testimonial-start-x',
  'ft-native-testimonial-marquee 46s linear infinite',
  'min-width: max-content',
  'flex: 0 0 auto',
  'visibility: visible !important',
  '.ft-platform-media-frame',
  '.ft-testimonial-verified',
  '.ft-proof-card::before',
  'display: none !important',
  'background: rgb(6 35 26 / 82%)',
  'opacity: .6'
]) {
  if (!`${interactions}\n${themeStyles}`.includes(contract)) {
    throw new Error(`Homepage or Team final refinement contract is missing: ${contract}`);
  }
}

if (interactions.includes("track.style.animationDelay = '-8s'") || themeStyles.includes('animation-delay: -8s')) {
  throw new Error('Testimonial marquee must begin at its measured middle-sequence offset without a delayed zero-origin animation phase.');
}

for (const location of [
  'Kenya', 'Tanzania', 'Uganda', 'Brazil', 'Benin', 'Ghana', 'Nigeria', 'Senegal',
  'Indonesia', 'Ethiopia', 'Bhutan', 'Colombia', 'Peru', 'Netherlands',
  'United Kingdom', 'Hungary', 'France', 'Bulgaria', 'Belgium', 'Denmark', 'Iran', 'Jordan'
]) {
  if (!interactions.includes(`name: '${location}'`)) {
    throw new Error(`Homepage globe is missing location data: ${location}`);
  }
}

for (const removedCopy of [
  'Drag in any direction or use the arrow keys to explore.',
  'The markers illustrate landscape contexts, not claimed project locations.'
]) {
  if (homepage.includes(removedCopy)) {
    throw new Error(`Homepage retains removed Global Perspective copy: ${removedCopy}`);
  }
}

for (const excludedCopy of [
  'Generated visual placeholders',
  'Sixth testimonial',
  'Approved testimonial and portrait pending'
]) {
  if (homepage.includes(excludedCopy)) {
    throw new Error(`Homepage exposes non-publishable testimonial copy: ${excludedCopy}`);
  }
}

for (const unsupported of [
  'Approved FarmTree Platform media',
  'Agroforestry landscape planning with project teams in Madagascar',
  'Science-based carbon and agroforestry modelling',
  'Water and landscape resilience planning'
]) {
  if (homepage.includes(unsupported)) {
    throw new Error(`Homepage retains unsupported or internal publication copy: ${unsupported}`);
  }
}

if (themeStyles.includes('★★★★★') || themeStyles.includes('content: "○"')) {
  throw new Error('Generated content must not create unsupported ratings or alter accessible footer-link names.');
}
if (
  !themeStyles.includes('.ft-native-site-footer .wp-block-navigation-item__content::before') ||
  !themeStyles.includes('content: ""')
) {
  throw new Error('Footer navigation decoration must remain visual-only generated content.');
}

for (const match of homepage.matchAll(/<h[12][^>]*>(.*?)<\/h[12]>/g)) {
  const heading = match[1].replace(/<[^>]+>/g, '').trim();
  if (heading.endsWith('.')) {
    throw new Error(`Display heading has an unnecessary full stop: ${heading}`);
  }
}

const pluginBootstrap = readFileSync(resolve(plugin, 'farmtree-content.php'), 'utf8');
const pluginArchitecture = readFileSync(resolve(plugin, 'includes/architecture.php'), 'utf8');
if (
  !pluginBootstrap.includes("register_post_type('customer_segment'") ||
  !pluginBootstrap.includes("'show_in_rest'       => true") ||
  !pluginBootstrap.includes("'template_lock'      => 'contentOnly'")
) {
  throw new Error('farmtree-content must register the controlled REST-enabled customer segment model.');
}

for (const contract of [
  "'strategy' => 'path_prefix'",
  "'default' => 'en'",
  "'locale' => 'en_GB'",
  "'path' => '/'",
  "'locale' => 'nl_NL'",
  "'path' => '/nl/'",
  "'locale' => 'de_DE'",
  "'path' => '/de/'",
  "'status' => 'reserved'",
  "'published' => false",
  "'quotation_delivery'",
  "'status' => 'unconfigured'",
  "'owner' => 'farmtree-content'"
]) {
  if (!pluginArchitecture.includes(contract)) {
    throw new Error(`Content architecture is missing publication-readiness contract: ${contract}`);
  }
}
for (const contract of [
  "'ai_assistant'",
  "'inactive_until_configured'",
  'No simulated responses',
  "'private_until_editor_approval'",
  "'publication_status' => 'draft'"
]) {
  if (!pluginArchitecture.includes(contract)) {
    throw new Error(`Content architecture is missing safe enhancement contract: ${contract}`);
  }
}

const segments = JSON.parse(readFileSync(resolve(plugin, 'data/customer-segments.json'), 'utf8'));
const approvedSegmentOrder = [
  'Consultancy & Agroforestry Advisors',
  'Development Banks & Donor Organisations',
  'NGOs & Conservation Organisations',
  'NbS & Carbon Project Developers',
  'MRV & ESG Platforms',
  'Government & Parastatal Institutions',
  'Industry Associations & Multi-Stakeholder Platforms',
  'Large Agri-Corporate',
  'Social Enterprise',
  'Investors'
];
if (segments.map(({ title }) => title).join('|') !== approvedSegmentOrder.join('|')) {
  throw new Error('Customer segment data must preserve the approved PDF order exactly.');
}
if (segments.some(({ order }, index) => order !== index + 1)) {
  throw new Error('Customer segment menu_order values must be sequential and source-aligned.');
}
if (/exemplary clients|guarantee(?:d)? returns?|€|\bROI\b/i.test(JSON.stringify(segments))) {
  throw new Error('Customer segment drafts contain an unsupported sales or performance claim.');
}
if (/\b(?:add_rewrite_rule|add_rewrite_tag|flush_rewrite_rules)\s*\(/.test(pluginArchitecture)) {
  throw new Error('Reserved locale metadata must not register or publish routes.');
}

for (const contract of [
  "slug: 'hello-world'",
  "title: 'Hello world!'",
  'Welcome to WordPress. This is your first post. Edit or delete it, then start writing!',
  "body: JSON.stringify({ status: 'draft' })",
  'must remain noindex before release approval',
  "new URL('/nl/', baseUrl)",
  "new URL('/de/', baseUrl)",
  "dutchRouteResponse.status !== 404",
  "germanRouteResponse.status !== 404"
]) {
  if (!bootstrap.includes(contract)) {
    throw new Error(`Local bootstrap is missing publication-readiness contract: ${contract}`);
  }
}
if (
  !functions.includes('farmtree_native_pre_release_robots') ||
  !functions.includes("$robots['noindex'] = true") ||
  !functions.includes("$robots['nofollow'] = true") ||
  !functions.includes("$headers['X-Robots-Tag'] = 'noindex, nofollow'") ||
  !functions.includes("'1' !== (string) get_option('blog_public')") ||
  functions.includes("add_filter('pre_option_blog_public'")
) {
  throw new Error('Native theme must enforce the pre-release noindex/nofollow gate.');
}
if (/method:\s*['"]DELETE['"]|\/wp\/v2\/posts\/\$\{post\.id\}[^\n]*delete/i.test(bootstrap)) {
  throw new Error('Local sample-post neutralization must never delete WordPress content.');
}

console.log('FARMTREE_NATIVE_FOUNDATION_OK');
