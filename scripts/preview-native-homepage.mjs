import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { extname, resolve, sep } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const theme = resolve(root, 'wordpress/wp-content/themes/farmtree-native');
const themeSettings = JSON.parse(readFileSync(resolve(theme, 'theme.json'), 'utf8'));
const portArgument = process.argv.find((argument) => argument.startsWith('--port='));
const requestedPort = Number.parseInt(portArgument?.split('=')[1] ?? '4173', 10);
const port = Number.isInteger(requestedPort) && requestedPort > 0 ? requestedPort : 4173;
const checkOnly = process.argv.includes('--check');

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.webp': 'image/webp'
};

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function parseBlockAttributes(serialised) {
  try {
    return JSON.parse(serialised);
  } catch {
    return {};
  }
}

function renderNavigation(serialised, innerMarkup) {
  const attributes = parseBlockAttributes(serialised);
  const classNames = [
    'wp-block-navigation',
    attributes.className,
    attributes.textColor ? `has-${attributes.textColor}-color has-text-color` : '',
    attributes.fontSize ? `has-${attributes.fontSize}-font-size` : '',
    attributes.layout?.orientation === 'vertical' ? 'is-vertical' : ''
  ].filter(Boolean).join(' ');
  const label = attributes.ariaLabel || (
    attributes.className?.includes('ft-native-primary-nav')
      ? 'Primary navigation'
      : attributes.className?.includes('ft-native-menu-trigger')
        ? 'Site navigation'
        : 'Footer navigation'
  );

  function renderLink(link) {
    const target = link.opensInNewTab ? ' target="_blank" rel="noreferrer noopener"' : '';
    const itemClasses = ['wp-block-navigation-item', link.className].filter(Boolean).join(' ');

    return `<li class="${itemClasses}"><a class="wp-block-navigation-item__content" href="${escapeHtml(link.url ?? '#')}"${target}>${escapeHtml(link.label ?? '')}</a></li>`;
  }

  const submenuItems = Array.from(
    innerMarkup.matchAll(
      /<!-- wp:navigation-submenu ([^\n]*?) -->([\s\S]*?)<!-- \/wp:navigation-submenu -->/g
    ),
    (match) => {
      const submenu = parseBlockAttributes(match[1]);
      const links = Array.from(
        match[2].matchAll(/<!-- wp:navigation-link ([^\n]*?) \/-->/g),
        (linkMatch) => parseBlockAttributes(linkMatch[1])
      ).map(renderLink).join('');
      const itemClasses = [
        'wp-block-navigation-item',
        'has-child',
        'wp-block-navigation-submenu',
        submenu.className
      ].filter(Boolean).join(' ');

      return `<li class="${itemClasses}"><button class="wp-block-navigation-submenu__toggle" type="button" aria-expanded="true">${escapeHtml(submenu.label ?? '')}</button><ul class="wp-block-navigation__submenu-container">${links}</ul></li>`;
    }
  );
  const items = submenuItems.length > 0
    ? submenuItems.join('')
    : Array.from(
      innerMarkup.matchAll(/<!-- wp:navigation-link ([^\n]*?) \/-->/g),
      (match) => renderLink(parseBlockAttributes(match[1]))
    ).join('');

  if (attributes.overlayMenu === 'always') {
    const menuId = 'ft-preview-site-menu';

    return `<nav class="${classNames}" aria-label="${label}"><button class="wp-block-navigation__responsive-container-open" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="${menuId}" data-ft-preview-menu-open><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24"><path d="M4 7.5h16v1.5H4zm0 7.5h16v1.5H4z"></path></svg></button><div class="wp-block-navigation__responsive-container" id="${menuId}" hidden data-ft-preview-menu><button class="wp-block-navigation__responsive-container-close" type="button" aria-label="Close menu" data-ft-preview-menu-close><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24"><path d="m6.7 5.6 5.3 5.3 5.3-5.3 1.1 1.1-5.3 5.3 5.3 5.3-1.1 1.1-5.3-5.3-5.3 5.3-1.1-1.1 5.3-5.3-5.3-5.3z"></path></svg></button><div class="wp-block-navigation__responsive-container-content"><ul class="wp-block-navigation__container">${items}</ul></div></div></nav>`;
  }

  return `<nav class="${classNames}" aria-label="${label}"><ul class="wp-block-navigation__container">${items}</ul></nav>`;
}

function renderDynamicBlocks(source) {
  return source
    .replace(
      /<!-- wp:navigation ([^\n]*?) -->([\s\S]*?)<!-- \/wp:navigation -->/g,
      (_match, serialised, innerMarkup) => renderNavigation(serialised, innerMarkup)
    )
    .replace(/<!-- wp:social-link ([^\n]*?) \/-->/g, (_match, serialised) => {
      const attributes = parseBlockAttributes(serialised);
      const service = String(attributes.service ?? 'social');
      const label = service.charAt(0).toUpperCase() + service.slice(1);
      const symbol = service === 'linkedin' ? 'in' : service === 'youtube' ? '▶' : '↗';
      return `<li class="wp-social-link wp-social-link-${escapeHtml(service)}"><a href="${escapeHtml(attributes.url ?? '#')}" target="_blank" rel="noreferrer noopener"><span class="screen-reader-text">${escapeHtml(label)}</span><span aria-hidden="true">${symbol}</span></a></li>`;
    });
}

function renderSource(source) {
  return renderDynamicBlocks(source)
    .replace(
      /<figure class="([^"]*\bft-partner-logos\b[^"]*)">/g,
      '<figure class="$1" aria-label="Partner and reference logos">'
    )
    .replace(
      /<\?php echo esc_url\( get_theme_file_uri\( '([^']+)' \) \); \?>/g,
      '/theme/$1'
    )
    .replace(
      /<\?php echo esc_url\( home_url\( '\/' \) \); \?>/g,
      '/'
    )
    .replace(/<\?php[\s\S]*?\?>/g, '')
    .replace(/<!--\s*\/?wp:[\s\S]*?-->/g, '');
}

function themePresetVariables(settings) {
  const presetGroups = [
    ['color', settings.settings?.color?.palette ?? [], 'color'],
    ['spacing', settings.settings?.spacing?.spacingSizes ?? [], 'size'],
    ['font-family', settings.settings?.typography?.fontFamilies ?? [], 'fontFamily'],
    ['font-size', settings.settings?.typography?.fontSizes ?? [], 'size']
  ];

  return presetGroups.flatMap(([namespace, presets, valueKey]) => presets.map(
    (preset) => `--wp--preset--${namespace}--${preset.slug}:${preset[valueKey]}`
  )).join(';');
}

function themeUtilityClasses(settings) {
  const palette = settings.settings?.color?.palette ?? [];
  const fontSizes = settings.settings?.typography?.fontSizes ?? [];
  const fontFamilies = settings.settings?.typography?.fontFamilies ?? [];

  return [
    ...palette.flatMap((preset) => [
      `.has-${preset.slug}-background-color{background-color:var(--wp--preset--color--${preset.slug})}`,
      `.has-${preset.slug}-color{color:var(--wp--preset--color--${preset.slug})}`
    ]),
    ...fontSizes.map(
      (preset) => `.has-${preset.slug}-font-size{font-size:var(--wp--preset--font-size--${preset.slug})}`
    ),
    ...fontFamilies.map(
      (preset) => `.has-${preset.slug}-font-family{font-family:var(--wp--preset--font-family--${preset.slug})}`
    )
  ].join('');
}

function resolveThemePreset(value) {
  return String(value).replace(
    /var:preset\|([a-z-]+)\|([a-z0-9-]+)/gi,
    'var(--wp--preset--$1--$2)'
  );
}

const brandLogo = renderSource(
  readFileSync(resolve(theme, 'patterns/brand-logo.php'), 'utf8')
);
const callToAction = renderSource(
  readFileSync(resolve(theme, 'patterns/call-to-action.php'), 'utf8')
);
const homepageSource = readFileSync(
  resolve(theme, 'patterns/homepage-foundation.php'),
  'utf8'
).replace('<!-- wp:pattern {"slug":"farmtree-native/call-to-action"} /-->', callToAction);
const homepage = renderSource(homepageSource)
  .replace(
    /<div class="wp-block-group ft-news-item">\s*<\/div>/,
    ''
  );
const header = renderSource(
  readFileSync(resolve(theme, 'parts/header.html'), 'utf8')
    .replace('<!-- wp:pattern {"slug":"farmtree-native/brand-logo"} /-->', brandLogo)
);
const footer = renderSource(
  readFileSync(resolve(theme, 'parts/footer.html'), 'utf8')
    .replace('<!-- wp:pattern {"slug":"farmtree-native/brand-logo"} /-->', brandLogo)
);
const quotationModal = renderSource(
  readFileSync(resolve(theme, 'parts/quotation-modal.html'), 'utf8')
);

const wideSize = themeSettings.settings?.layout?.wideSize ?? '1280px';
const contentSize = themeSettings.settings?.layout?.contentSize ?? '760px';
const bodyBackground = resolveThemePreset(
  themeSettings.styles?.color?.background ?? 'var:preset|color|farmtree-cream'
);
const bodyText = resolveThemePreset(
  themeSettings.styles?.color?.text ?? 'var:preset|color|farmtree-ink'
);

const previewCss = `
:root{${themePresetVariables(themeSettings)};--wp--style--global--wide-size:${wideSize};--wp--style--global--content-size:${contentSize}}
${themeUtilityClasses(themeSettings)}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;color:${bodyText};background:${bodyBackground};font:400 var(--wp--preset--font-size--body)/1.65 var(--wp--preset--font-family--interface)}
h1,h2,h3{margin-block:0 1.25rem;font-family:var(--wp--preset--font-family--editorial);font-weight:800;line-height:1.08}
p,ul,blockquote{margin-block:0 1.5rem}
a{color:var(--wp--preset--color--farmtree-green);text-decoration:none}
img{max-width:100%;height:auto}
button{font:inherit}
.screen-reader-text{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.alignwide{width:min(100%,var(--wp--style--global--wide-size));margin-inline:auto}
.wp-block-group,.wp-block-cover{padding-inline:var(--wp--preset--spacing--50)}
.wp-block-group .wp-block-group,.wp-block-cover .wp-block-group{padding-inline:0}
.wp-block-columns{display:flex;gap:var(--wp--preset--spacing--50)}
.wp-block-column{min-width:0;flex:1}
.wp-block-cover{position:relative;display:flex;align-items:center;overflow:hidden}
.wp-block-cover__image-background{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.wp-block-cover__background{position:absolute;z-index:1;inset:0;opacity:.5}
.wp-block-cover__inner-container{position:relative;z-index:2;width:100%}
.wp-block-buttons{display:flex;flex-wrap:wrap;gap:.75rem}
.wp-block-button__link{display:inline-block;padding:.95rem 1.625rem;border:2px solid transparent;border-radius:999px;background:var(--wp--preset--color--farmtree-green);color:var(--wp--preset--color--white);font-weight:800}
.is-style-outline .wp-block-button__link{border-color:currentcolor;background:transparent;color:var(--wp--preset--color--farmtree-green)}
.wp-block-navigation{display:flex;align-items:center}
.wp-block-navigation__container{display:flex;align-items:center;gap:1.5rem;padding:0;margin:0;list-style:none}
.wp-block-navigation.is-vertical .wp-block-navigation__container{align-items:flex-start;flex-direction:column;gap:.5rem}
.wp-block-navigation__responsive-container-open{display:flex;padding:0;border:0;background:transparent;color:inherit;cursor:pointer}
.ft-native-menu-trigger .wp-block-navigation__responsive-container.is-menu-open{position:fixed;inset:0;z-index:100;display:flex;overflow:auto}
.ft-native-menu-trigger .wp-block-navigation__responsive-container-close{position:absolute;top:1.25rem;right:1.25rem}
body.ft-preview-menu-open{overflow:hidden}
.wp-block-gallery{display:grid;grid-template-columns:repeat(6,minmax(0,1fr))}
.wp-block-gallery>.wp-block-image{width:auto!important}
.wp-block-post-template{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));padding:0;list-style:none}
.wp-block-social-links{display:flex;gap:.75rem;padding:0;list-style:none}
.wp-block-social-links a{display:grid;width:2.5rem;height:2.5rem;place-items:center;border:1px solid currentcolor;border-radius:999px;color:inherit;font-weight:800}
.ft-native-header-inner,.ft-native-logo-shell,.ft-native-footer-logo-shell,.ft-native-footer-bottom,.ft-home-news-header{display:flex;align-items:center}
.ft-native-header-inner,.ft-native-footer-bottom,.ft-home-news-header{justify-content:space-between}
.ft-native-header-inner{flex-wrap:nowrap}
.ft-native-logo-shell,.ft-native-footer-logo-shell{justify-content:center}
.ft-native-footer-bottom,.ft-home-news-header{flex-wrap:wrap}
.ft-preview-news-empty{grid-column:1/-1;padding:2rem 0;border-top:2px solid var(--wp--preset--color--farmtree-green);color:var(--wp--preset--color--farmtree-green)}
@media(width <= 781px){.wp-block-columns{flex-direction:column}.wp-block-column{flex-basis:auto!important}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
`;

const previewMenuScript = `
(() => {
  const openButton = document.querySelector('[data-ft-preview-menu-open]');
  const closeButton = document.querySelector('[data-ft-preview-menu-close]');
  const menu = document.querySelector('[data-ft-preview-menu]');

  if (!openButton || !closeButton || !menu) return;

  const closeMenu = () => {
    menu.hidden = true;
    menu.classList.remove('is-menu-open');
    document.body.classList.remove('ft-preview-menu-open');
    openButton.setAttribute('aria-expanded', 'false');
    openButton.focus();
  };

  openButton.addEventListener('click', () => {
    menu.hidden = false;
    menu.classList.add('is-menu-open');
    document.body.classList.add('ft-preview-menu-open');
    openButton.setAttribute('aria-expanded', 'true');
    closeButton.focus();
  });
  closeButton.addEventListener('click', closeMenu);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) closeMenu();
  });
})();
`;

const document = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>FarmTree Native Homepage Preview</title>
  <style>${previewCss}</style>
  <link rel="stylesheet" href="/theme/style.css">
  <script src="/theme/assets/js/native-interactions.js" defer></script>
</head>
<body>
  <a class="ft-skip-link" href="#main-content">Skip to content</a>
  <div class="wp-site-blocks">
    <header>${header}</header>
    <main id="main-content" class="wp-block-group">${homepage}</main>
    <footer>${footer}</footer>
  </div>
  ${quotationModal}
  <script>${previewMenuScript}</script>
</body>
</html>`;

const previewResponseHeaders = {
  'Content-Type': 'text/html; charset=utf-8',
  'X-Robots-Tag': 'noindex, nofollow'
};

function validateComposedPreview() {
  const requiredContent = [
    '<meta name="robots" content="noindex,nofollow">',
    'Make agroforestry measurable, investable and scalable',
    'The FarmTree Platform',
    'How agroforestry projects are planned, monitored and reported',
    'Trust and references',
    'Proof Stories',
    'News &amp; insights',
    'FAQ',
    'Ready to build a stronger agroforestry investment case?',
    'No insights have been published yet',
    'data-ft-hero-prev',
    'final-tools-review-11s-to-40s-2x.gif',
    'final-tools-review-11s-to-40s-poster.png',
    'data-ft-quotation-dialog'
  ];

  for (const content of requiredContent) {
    if (!document.includes(content)) {
      throw new Error(`Composed preview is missing approved content or behavior: ${content}`);
    }
  }

  if (previewResponseHeaders['X-Robots-Tag'] !== 'noindex, nofollow') {
    throw new Error('Preview response must remain explicitly noindex and nofollow.');
  }

  if ((document.match(/<h1\b/g) ?? []).length !== 1) {
    throw new Error('Composed preview must contain exactly one H1.');
  }

  if (document.includes('<?php') || document.includes('<!-- wp:')) {
    throw new Error('Composed preview contains unresolved PHP or WordPress block markup.');
  }

  const sectionClasses = [
    'ft-home-hero',
    'ft-home-platform',
    'ft-home-technology',
    'ft-home-metrics',
    'ft-home-globe',
    'ft-home-trust',
    'ft-home-proof',
    'ft-home-news',
    'ft-home-faq',
    'ft-final-cta'
  ];
  let previousIndex = -1;

  for (const className of sectionClasses) {
    const section = new RegExp(`<section\\b[^>]*class="[^"]*\\b${className}\\b[^"]*"`, 'i').exec(document);
    const markerIndex = section?.index ?? -1;
    if (markerIndex <= previousIndex) {
      throw new Error(`Composed preview section is missing or out of order: ${className}`);
    }
    previousIndex = markerIndex;
  }

  const assetPaths = new Set(
    Array.from(document.matchAll(/(?:src|href|poster)="\/theme\/([^"?#]+)["?#]/g), (match) => match[1])
  );

  for (const assetPath of assetPaths) {
    const asset = resolve(theme, decodeURIComponent(assetPath));
    if (!asset.startsWith(`${theme}${sep}`) || !readFileSync(asset)) {
      throw new Error(`Composed preview references a missing or unsafe theme asset: ${assetPath}`);
    }
  }
}

if (checkOnly) {
  validateComposedPreview();
  console.log('FARMTREE_NATIVE_PREVIEW_OK');
  process.exit(0);
}

createServer((request, response) => {
  const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
  if (pathname === '/' || pathname === '/index.html') {
    response.writeHead(200, previewResponseHeaders);
    response.end(document);
    return;
  }
  if (pathname.startsWith('/theme/')) {
    const file = resolve(theme, decodeURIComponent(pathname.slice(7)));
    if (!file.startsWith(`${theme}${sep}`)) {
      response.writeHead(403).end();
      return;
    }
    try {
      response.writeHead(200, { 'Content-Type': mimeTypes[extname(file)] ?? 'application/octet-stream' });
      response.end(readFileSync(file));
    } catch {
      response.writeHead(404).end();
    }
    return;
  }
  response.writeHead(404).end();
}).listen(port, '127.0.0.1', () => {
  console.log(`FARMTREE_NATIVE_PREVIEW http://127.0.0.1:${port}`);
});
