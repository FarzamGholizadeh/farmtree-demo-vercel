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

function normaliseSelector(selector) {
  return selector.replace(/\s+/g, ' ').trim();
}

function selectorListIncludes(selectorList, wanted) {
  return selectorList === wanted ||
    selectorList.startsWith(`${wanted},`) ||
    selectorList.endsWith(`, ${wanted}`) ||
    selectorList.includes(`, ${wanted},`);
}

function cssRuleBlocks(source, selector) {
  const wanted = normaliseSelector(selector);
  const cssWithoutComments = source.replace(/\/\*[\s\S]*?\*\//g, '');

  return Array.from(cssWithoutComments.matchAll(/([^{}]+)\{([^{}]*)\}/g))
    .filter((match) => {
      const selectorList = normaliseSelector(match[1]);

      return selectorListIncludes(selectorList, wanted);
    })
    .map((match) => match[2]);
}

function cssTopLevelRuleBlocks(source, selector) {
  const wanted = normaliseSelector(selector);
  const cssWithoutComments = source.replace(/\/\*[\s\S]*?\*\//g, '');
  const blocks = [];
  let depth = 0;
  let headerStart = 0;

  for (let index = 0; index < cssWithoutComments.length; index += 1) {
    if (cssWithoutComments[index] === '{') {
      const selectorList = normaliseSelector(cssWithoutComments.slice(headerStart, index));

      if (depth === 0 && selectorListIncludes(selectorList, wanted)) {
        const blockEnd = cssWithoutComments.indexOf('}', index + 1);

        if (blockEnd === -1) {
          break;
        }

        blocks.push(cssWithoutComments.slice(index + 1, blockEnd));
        index = blockEnd;
        headerStart = blockEnd + 1;
        continue;
      }

      depth += 1;
    } else if (cssWithoutComments[index] === '}') {
      depth -= 1;

      if (depth === 0) {
        headerStart = index + 1;
      }
    }
  }

  return blocks;
}

function assertTopLevelCssRule(source, selector, declarations) {
  const blocks = cssTopLevelRuleBlocks(source, selector);

  if (!blocks.some((block) => declarations.every((declaration) => block.includes(declaration)))) {
    throw new Error(
      `Native reduced-motion-safe visual feedback drifted: ${selector} -> ${declarations.join(', ')}`
    );
  }
}

function assertCssRule(source, selector, declarations) {
  const blocks = cssRuleBlocks(source, selector);

  if (!blocks.some((block) => declarations.every((declaration) => block.includes(declaration)))) {
    throw new Error(
      `Native theme drifted from approved production geometry: ${selector} -> ${declarations.join(', ')}`
    );
  }
}

function cssAtRuleBlocks(source, atRule) {
  const cssWithoutComments = source.replace(/\/\*[\s\S]*?\*\//g, '');
  const blocks = [];
  let searchFrom = 0;

  while (searchFrom < cssWithoutComments.length) {
    const atRuleStart = cssWithoutComments.indexOf(atRule, searchFrom);

    if (atRuleStart === -1) {
      break;
    }

    const blockStart = cssWithoutComments.indexOf('{', atRuleStart + atRule.length);

    if (blockStart === -1) {
      break;
    }

    let depth = 1;
    let blockEnd = blockStart + 1;

    for (; blockEnd < cssWithoutComments.length && depth > 0; blockEnd += 1) {
      if (cssWithoutComments[blockEnd] === '{') {
        depth += 1;
      } else if (cssWithoutComments[blockEnd] === '}') {
        depth -= 1;
      }
    }

    if (depth !== 0) {
      break;
    }

    blocks.push(cssWithoutComments.slice(blockStart + 1, blockEnd - 1));
    searchFrom = blockEnd;
  }

  return blocks;
}

function assertCssRuleInAtRule(source, atRule, selector, declarations) {
  const blocks = cssAtRuleBlocks(source, atRule)
    .flatMap((atRuleBlock) => cssRuleBlocks(atRuleBlock, selector));

  if (!blocks.some((block) => declarations.every((declaration) => block.includes(declaration)))) {
    throw new Error(
      `Native responsive parity drifted: ${atRule} / ${selector} -> ${declarations.join(', ')}`
    );
  }
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

const nativeRuleContracts = [
  [':root', [
    '--ft-approved-green: #00613f',
    '--ft-approved-green-2: #2e6a35',
    '--ft-approved-cream: #f5f1e8',
    '--ft-approved-gold: #d3b06b',
    '--ft-approved-mist: #dce7d2',
    '--ft-content-wide: 1240px'
  ]],
  ['.ft-native-site-header', ['padding: 0 !important', 'background: var(--ft-approved-green) !important']],
  ['.ft-native-header-inner', [
    'width: min(1360px, 90vw) !important',
    'min-height: 74px',
    'margin-block: 0 !important'
  ]],
  ['.ft-native-logo-shell', ['width: 174px', 'height: 48px']],
  ['.ft-native-logo-shell img', ['height: 34px']],
  ['.ft-home-hero-content :where(h1, h2)', [
    'font-size: clamp(58px, calc(3vw + 1.6rem), 76px) !important'
  ]],
  ['.ft-home-hero-current > .has-lead-font-size', [
    'font-size: clamp(15px, 1.2vw, 18px) !important'
  ]],
  ['.ft-home-hero-actions .wp-block-button__link', [
    'border-color: rgb(255 255 255 / 62%) !important',
    'background: rgb(255 255 255 / 10%) !important'
  ]],
  ['.ft-home-hero-copy-sources', ['display: none !important']],
  ['.ft-platform-layout', [
    'width: min(1180px, 88vw) !important',
    'grid-template-columns: minmax(360px, 1fr) minmax(360px, 0.92fr)',
    'gap: 34px !important'
  ]],
  ['.ft-platform-copy', ['min-height: 430px', 'margin-left: 0', 'padding: 56px']],
  ['.ft-platform-visual', [
    'padding: 16px',
    'background: linear-gradient(160deg, #edf3e9 0%, #dce7d2 100%)'
  ]],
  ['.ft-platform-video-slide video', ['object-fit: contain !important']],
  ['.ft-platform-controls', ['top: 16px', 'right: 16px', 'left: 16px', 'aspect-ratio: 16 / 9']],
  ['.ft-platform-nav', [
    'position: absolute',
    'top: 50%',
    'z-index: 3',
    'width: 42px',
    'height: 42px',
    'transform: translateY(-50%)'
  ]],
  ['.ft-platform-nav svg', ['width: 22px', 'height: 22px']],
  ['.ft-platform-prev', ['left: 12px']],
  ['.ft-platform-next', ['right: 12px']],
  ['.ft-platform-nav:hover', ['background: #fff']],
  ['.ft-platform-nav:focus-visible', [
    'outline: 2px solid var(--ft-approved-ink)',
    'outline-offset: 2px',
    'box-shadow: none'
  ]],
  ['.ft-platform-dots', ['align-items: center', 'justify-content: center', 'gap: 9px', 'margin-top: 14px']],
  ['.ft-platform-dot', ['width: 9px', 'height: 9px']],
  ['.ft-platform-dot.is-active', ['width: 22px']],
  ['.ft-platform-dot:hover::before', ['background: rgb(33 79 42 / 50%)']],
  ['.ft-platform-dot.is-active::before', ['width: 100%', 'background: #214f2a']],
  ['.ft-platform-dot:focus-visible', [
    'outline: 2px solid var(--ft-approved-ink)',
    'outline-offset: 3px',
    'box-shadow: none'
  ]],
  ['.ft-home-input-number', ['color: var(--ft-approved-green-2)']],
  [
    '.ft-native-menu-trigger .wp-block-navigation__responsive-container.is-menu-open .wp-block-navigation__container > .ft-native-menu-card:hover',
    ['border-color: rgb(211 176 107 / 42%)', 'background: rgb(255 255 255 / 8.5%) !important']
  ],
  [
    '.ft-native-menu-trigger .wp-block-navigation__responsive-container.is-menu-open .wp-block-navigation__container > .ft-native-menu-card::before',
    ['background: linear-gradient(135deg, rgb(211 176 107 / 16%), transparent 48%)', 'opacity: 0']
  ],
  [
    '.ft-native-menu-trigger .wp-block-navigation__responsive-container.is-menu-open .wp-block-navigation__container > .ft-native-menu-card:hover::before',
    ['opacity: 1']
  ],
  ['.ft-home-inputs', ['grid-template-columns: repeat(2, minmax(0, 1fr))']]
];

for (const [selector, declarations] of nativeRuleContracts) {
  assertCssRule(nativeStyles, selector, declarations);
}

for (const [selector, declarations] of [
  [
    '.ft-native-menu-trigger .wp-block-navigation__responsive-container.is-menu-open .wp-block-navigation__container > .ft-native-menu-card:hover',
    ['border-color: rgb(211 176 107 / 42%)', 'background: rgb(255 255 255 / 8.5%) !important']
  ],
  [
    '.ft-native-menu-trigger .wp-block-navigation__responsive-container.is-menu-open .wp-block-navigation__container > .ft-native-menu-card::before',
    ['background: linear-gradient(135deg, rgb(211 176 107 / 16%), transparent 48%)', 'opacity: 0']
  ],
  [
    '.ft-native-menu-trigger .wp-block-navigation__responsive-container.is-menu-open .wp-block-navigation__container > .ft-native-menu-card:hover::before',
    ['opacity: 1']
  ]
]) {
  assertTopLevelCssRule(nativeStyles, selector, declarations);
}

const nativeMobileRuleContracts = [
  ['.ft-platform-dots', ['gap: 0']],
  ['.ft-platform-dot', ['width: 44px', 'height: 44px']],
  ['.ft-platform-dot.is-active', ['width: 44px']],
  ['.ft-platform-dot.is-active::before', ['width: 9px']],
  ['.ft-platform-dot:focus-visible', ['outline: none', 'box-shadow: none']],
  ['.ft-platform-dot:focus-visible::before', [
    'outline: 2px solid var(--ft-approved-ink)',
    'outline-offset: 3px'
  ]]
];

for (const [selector, declarations] of nativeMobileRuleContracts) {
  assertCssRuleInAtRule(nativeStyles, '@media (width <= 768px)', selector, declarations);
}

assertCssRuleInAtRule(
  nativeStyles,
  '@media (prefers-reduced-motion: no-preference)',
  '.ft-native-menu-trigger .wp-block-navigation__responsive-container.is-menu-open .wp-block-navigation__container > .ft-native-menu-card:hover',
  ['transform: translateY(-4px) !important']
);

assertCssRuleInAtRule(
  nativeStyles,
  '@media (prefers-reduced-motion: no-preference)',
  '.ft-native-menu-trigger .wp-block-navigation__responsive-container.is-menu-open .wp-block-navigation__container > .ft-native-menu-card',
  ['transition: background 280ms ease, border-color 280ms ease, transform 280ms ease']
);

assertCssRuleInAtRule(
  nativeStyles,
  '@media (prefers-reduced-motion: no-preference)',
  '.ft-platform-nav',
  ['transition: background 200ms ease, transform 200ms ease']
);

assertCssRuleInAtRule(
  nativeStyles,
  '@media (prefers-reduced-motion: no-preference)',
  '.ft-platform-nav:hover',
  ['transform: translateY(-50%) scale(1.06)']
);

assertCssRuleInAtRule(
  nativeStyles,
  '@media (width <= 560px)',
  '.ft-platform-nav',
  ['width: 36px', 'height: 36px']
);

assertCssRuleInAtRule(
  nativeStyles,
  '@media (width <= 560px)',
  '.ft-platform-nav svg',
  ['width: 18px', 'height: 18px']
);

if (!nativeHomepage.includes(
  '</div>\n<div class="ft-platform-dots" role="group" aria-label="Choose Platform media item">'
)) {
  throw new Error('Platform dots must remain in the approved normal-flow strip outside the media overlay controls.');
}

for (const platformArrowContract of [
  '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">',
  'd="M15 5l-7 7 7 7"',
  'd="M9 5l7 7-7 7"'
]) {
  if (!nativeHomepage.includes(platformArrowContract)) {
    throw new Error(`Platform carousel control drifted from the approved SVG geometry: ${platformArrowContract}`);
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
