import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const productionTheme = resolve(root, 'wordpress/wp-content/themes/farmtree');
const nativeTheme = resolve(root, 'wordpress/wp-content/themes/farmtree-native');
const wpEnv = JSON.parse(readFileSync(resolve(root, '.wp-env.json'), 'utf8'));
const bootstrapSource = readFileSync(resolve(root, 'scripts/bootstrap-local-wordpress.mjs'), 'utf8');

function read(base, path) {
  return readFileSync(resolve(base, path), 'utf8');
}

function digest(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

const productionBase = read(productionTheme, 'assets/css/base.css');
const productionComponents = read(productionTheme, 'assets/css/components.css');
const productionResponsive = read(productionTheme, 'assets/css/responsive.css');
const productionHeader = read(productionTheme, 'template-parts/header-chrome.php');
const productionFooter = read(productionTheme, 'template-parts/footer-chrome.php');
const nativeStyles = read(nativeTheme, 'style.css');
const nativeHeader = read(nativeTheme, 'parts/header.html');
const nativeFooter = read(nativeTheme, 'parts/footer.html');
const nativeHomepage = read(nativeTheme, 'patterns/homepage-foundation.php');

const expectedRuntimeMounts = {
  plugins: ['./wordpress/wp-content/plugins/farmtree-content'],
  themes: ['./wordpress/wp-content/themes/farmtree-native']
};

if (
  wpEnv.core !== null ||
  wpEnv.phpVersion !== '8.2' ||
  wpEnv.port !== 8888 ||
  wpEnv.testsEnvironment !== false ||
  JSON.stringify(wpEnv.plugins) !== JSON.stringify(expectedRuntimeMounts.plugins) ||
  JSON.stringify(wpEnv.themes) !== JSON.stringify(expectedRuntimeMounts.themes) ||
  wpEnv.mappings?.['wp-content/themes/farmtree'] !== './wordpress/wp-content/themes/farmtree'
) {
  throw new Error('The isolated local WordPress runtime configuration drifted.');
}

for (const contract of [
  "['127.0.0.1', 'localhost', '::1']",
  "status: 'private'",
  "name === 'farmtree-native/homepage-foundation'",
  "stylesheet === 'farmtree-native'",
  "plugin === 'farmtree-content/farmtree-content'"
]) {
  if (!bootstrapSource.includes(contract)) {
    throw new Error(`Local WordPress bootstrap safety contract is missing: ${contract}`);
  }
}

const sharedProductionContracts = [
  '--ftd-header-h: 74px',
  '--ftd-logo-w: 174px',
  '--ftd-logo-h: 48px',
  '--ftd-logo-img-h: 34px',
  '--ftd-control-h: 48px',
  '--ftd-hero-h1: clamp(58px, 3vw + 1.6rem, 76px)',
  '--ftd-hero-h1-lh: 1.0',
  '--ftd-hero-p: clamp(15px, 1.2vw, 18px)',
  '.header-inner { width:min(1360px,90vw); }',
  'width:min(1180px,88vw)!important',
  'min-height:430px!important',
  'padding:56px!important',
  'border-radius:26px!important'
];

for (const contract of sharedProductionContracts) {
  if (!`${productionBase}\n${productionComponents}\n${productionResponsive}`.includes(contract)) {
    throw new Error(`Approved production baseline is missing: ${contract}`);
  }
}

const nativeGeometryContracts = [
  '--ft-approved-green: #00613f',
  '--ft-approved-cream: #f5f1e8',
  '--ft-approved-gold: #d3b06b',
  '--ft-approved-mist: #dce7d2',
  '--ft-content-wide: 1240px',
  'width: min(1360px, 90vw) !important',
  'min-height: 74px',
  'width: 174px',
  'height: 48px',
  'height: 34px',
  'font-size: clamp(58px, calc(3vw + 1.6rem), 76px) !important',
  'font-size: clamp(15px, 1.2vw, 18px) !important',
  'width: min(1180px, 88vw) !important',
  'min-height: 430px',
  'padding: 56px',
  'gap: 34px !important'
];

for (const contract of nativeGeometryContracts) {
  if (!nativeStyles.includes(contract)) {
    throw new Error(`Native theme drifted from approved production geometry: ${contract}`);
  }
}

const semanticPairs = [
  [productionHeader, 'header-actions', nativeHeader, 'ft-native-header-actions'],
  [productionHeader, 'mobile-grid ft-bento', nativeHeader, 'ft-native-menu-segments'],
  [productionHeader, 'lang-switcher', nativeHeader, 'ft-native-language'],
  [productionFooter, 'footer-top', nativeFooter, 'ft-native-footer-top'],
  [productionFooter, 'footer-links', nativeFooter, 'ft-native-footer-grid'],
  [productionFooter, 'footer-bottom', nativeFooter, 'ft-native-footer-bottom'],
  [productionComponents, '.overlap-card', nativeStyles, '.ft-platform-copy'],
  [productionComponents, '.ft-testimonial-card', nativeStyles, '.ft-trust-quote'],
  [productionComponents, '.ft-proof-theme-grid', nativeStyles, '.ft-proof-grid'],
  [productionComponents, '.ft-faq-grid', nativeStyles, '.ft-faq-list']
];

for (const [productionSource, productionContract, nativeSource, nativeContract] of semanticPairs) {
  if (!productionSource.includes(productionContract) || !nativeSource.includes(nativeContract)) {
    throw new Error(`Visual baseline mapping is incomplete: ${productionContract} -> ${nativeContract}`);
  }
}

const assetPairs = [
  ['assets/brand/farmtree-logo-primary-320.webp', 'assets/images/brand/farmtree-logo.webp'],
  ['assets/embedded_000_opt.webp', 'assets/images/home/hero-project-workshop.webp'],
  ['assets/embedded_014_opt.webp', 'assets/images/home/hero-project-teams.webp'],
  ['assets/base-technology/home-ecosystem-current-brand.webp', 'assets/images/home/technology-model.webp'],
  ['assets/case-acorn_opt.webp', 'assets/images/home/proof-carbon.webp'],
  ['assets/case-giz_opt.webp', 'assets/images/home/proof-farm-value.webp'],
  ['assets/case-cocoa_opt.webp', 'assets/images/home/proof-cocoa.webp'],
  ['assets/case-water_opt.webp', 'assets/images/home/proof-water.webp'],
  ['assets/embedded_055.png', 'assets/images/partners/giz.png'],
  ['assets/embedded_058.png', 'assets/images/partners/rabobank.png'],
  ['assets/embedded_057.png', 'assets/images/partners/cgiar.png'],
  ['assets/embedded_059.png', 'assets/images/partners/fao.png'],
  ['assets/embedded_060.png', 'assets/images/partners/catie.png'],
  ['assets/embedded_056.png', 'assets/images/partners/helvetas.png'],
  ['assets/media/power-project-staff-landscape-poster.webp', 'assets/media/power-project-staff-landscape-poster.webp'],
  ['assets/media/power-project-staff-landscape.mp4', 'assets/media/power-project-staff-landscape.mp4'],
  ['assets/media/power-project-staff-plot-definition.png', 'assets/media/power-project-staff-plot-definition.png']
];

for (const [productionAsset, nativeAsset] of assetPairs) {
  const productionDigest = digest(resolve(productionTheme, productionAsset));
  const nativeDigest = digest(resolve(nativeTheme, nativeAsset));

  if (productionDigest !== nativeDigest) {
    throw new Error(`Native asset drifted from approved source: ${nativeAsset}`);
  }
}

for (const requiredClass of [
  'ft-home-hero',
  'ft-home-platform',
  'ft-home-technology',
  'ft-home-trust',
  'ft-home-proof',
  'ft-home-faq',
  'ft-home-news'
]) {
  if (!nativeHomepage.includes(requiredClass)) {
    throw new Error(`Native Homepage is missing visual-baseline section: ${requiredClass}`);
  }
}

if (/data-page=|location\.hash|farmtree-app\.js/.test(`${nativeHeader}\n${nativeFooter}\n${nativeHomepage}`)) {
  throw new Error('Native output must not reintroduce legacy SPA routing or state management.');
}

console.log('FARMTREE_VISUAL_BASELINE_OK');
