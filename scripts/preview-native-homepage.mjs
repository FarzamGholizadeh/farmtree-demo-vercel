import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { extname, resolve, sep } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const theme = resolve(root, 'wordpress/wp-content/themes/farmtree-native');
const portArgument = process.argv.find((argument) => argument.startsWith('--port='));
const requestedPort = Number.parseInt(portArgument?.split('=')[1] ?? '4173', 10);
const port = Number.isInteger(requestedPort) && requestedPort > 0 ? requestedPort : 4173;

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp'
};

function renderSource(source) {
  return source
    .replace(
      /<\?php echo esc_url\( get_theme_file_uri\( '([^']+)' \) \); \?>/g,
      '/theme/$1'
    )
    .replace(/<\?php[\s\S]*?\?>/g, '')
    .replace(/<!--\s*\/?wp:[\s\S]*?-->/g, '');
}

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
    '<div class="ft-preview-news-empty">Dynamic WordPress posts appear here in runtime preview</div>'
  )
  .replace('<p>No insights have been published yet</p>', '');

const previewCss = `
:root{--wp--preset--color--farmtree-green:#214f2a;--wp--preset--color--farmtree-forest:#123a2a;--wp--preset--color--farmtree-ink:#163126;--wp--preset--color--farmtree-ivory:#faf8f1;--wp--preset--color--farmtree-cream:#f2ecdd;--wp--preset--color--farmtree-mist:#dce7d2;--wp--preset--color--farmtree-gold:#c9a85f;--wp--preset--color--farmtree-sky:#c9dde3;--wp--preset--color--white:#fff;--wp--preset--spacing--20:.5rem;--wp--preset--spacing--30:.75rem;--wp--preset--spacing--40:1rem;--wp--preset--spacing--50:1.5rem;--wp--preset--spacing--60:2rem;--wp--preset--spacing--70:4rem;--wp--preset--spacing--80:6rem;--wp--preset--font-family--editorial:Manrope,Inter,system-ui,sans-serif;--wp--preset--font-family--interface:Inter,system-ui,sans-serif;--wp--preset--font-size--caption:.8125rem;--wp--preset--font-size--small:.9375rem;--wp--preset--font-size--body:1.0625rem;--wp--preset--font-size--lead:1.375rem;--wp--preset--font-size--heading-small:2.5rem;--wp--preset--font-size--heading:4.75rem}
*{box-sizing:border-box}body{margin:0;color:var(--wp--preset--color--farmtree-ink);background:var(--wp--preset--color--farmtree-ivory);font:400 var(--wp--preset--font-size--body)/1.65 var(--wp--preset--font-family--interface)}h1,h2,h3{margin-block:0 1.25rem;font-family:var(--wp--preset--font-family--editorial);font-weight:800;line-height:1.08}p,ul,blockquote{margin-block:0 1.5rem}a{color:var(--wp--preset--color--farmtree-green);text-decoration:none}img{max-width:100%}.alignwide{width:min(100%,1280px);margin-inline:auto}.wp-block-group,.wp-block-cover{padding-inline:var(--wp--preset--spacing--50)}.wp-block-group .wp-block-group,.wp-block-cover .wp-block-group{padding-inline:0}.wp-block-columns{display:flex;gap:var(--wp--preset--spacing--50)}.wp-block-column{min-width:0;flex:1}.wp-block-cover{position:relative;display:flex;align-items:center;overflow:hidden}.wp-block-cover__image-background{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.wp-block-cover__background{position:absolute;z-index:1;inset:0;opacity:.65}.wp-block-cover__inner-container{position:relative;z-index:2;width:100%}.wp-block-buttons{display:flex;flex-wrap:wrap;gap:.75rem}.wp-block-button__link{display:inline-block;padding:.8rem 1.2rem;border:2px solid transparent;border-radius:999px;background:var(--wp--preset--color--farmtree-green);color:#fff;font-weight:700}.is-style-outline .wp-block-button__link{border-color:currentcolor;background:transparent;color:var(--wp--preset--color--farmtree-green)}.has-white-background-color{background:#fff}.has-farmtree-ivory-background-color{background:var(--wp--preset--color--farmtree-ivory)}.has-farmtree-cream-background-color{background:var(--wp--preset--color--farmtree-cream)}.has-farmtree-sky-background-color{background:var(--wp--preset--color--farmtree-sky)}.has-farmtree-mist-background-color{background:var(--wp--preset--color--farmtree-mist)}.has-farmtree-forest-background-color{background:var(--wp--preset--color--farmtree-forest)}.has-farmtree-gold-background-color{background:var(--wp--preset--color--farmtree-gold)}.has-white-color{color:#fff}.has-farmtree-ink-color{color:var(--wp--preset--color--farmtree-ink)}.has-farmtree-green-color{color:var(--wp--preset--color--farmtree-green)}.has-farmtree-mist-color{color:var(--wp--preset--color--farmtree-mist)}.has-caption-font-size{font-size:var(--wp--preset--font-size--caption)}.has-small-font-size{font-size:var(--wp--preset--font-size--small)}.has-lead-font-size{font-size:var(--wp--preset--font-size--lead)}.has-heading-small-font-size{font-size:var(--wp--preset--font-size--heading-small)}.has-heading-font-size{font-size:var(--wp--preset--font-size--heading)}.wp-block-gallery{display:grid;grid-template-columns:repeat(6,minmax(0,1fr))}.wp-block-gallery>.wp-block-image{width:auto!important}.wp-block-post-template{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));padding:0;list-style:none}.ft-preview-header{position:relative;z-index:10;border-bottom:1px solid rgb(22 49 38/14%);background:var(--wp--preset--color--farmtree-ivory)}.ft-preview-header-inner{display:flex;min-height:78px;align-items:center;justify-content:space-between;gap:1.5rem}.ft-preview-header img{display:block;width:126px}.ft-preview-nav{display:flex;align-items:center;gap:1.5rem;font-size:.9375rem;font-weight:700}.ft-preview-demo{padding:.65rem 1rem;border-radius:999px;background:var(--wp--preset--color--farmtree-green);color:#fff!important}.ft-preview-footer{padding-block:4rem;background:var(--wp--preset--color--farmtree-forest);color:#fff}.ft-preview-footer-inner{display:flex;align-items:end;justify-content:space-between;gap:2rem}.ft-preview-footer img{width:150px;filter:brightness(0) invert(1)}.ft-preview-news-empty{grid-column:1/-1;padding:2rem 0;border-top:2px solid var(--wp--preset--color--farmtree-green);color:var(--wp--preset--color--farmtree-green)}
@media(width <= 781px){:root{--wp--preset--font-size--heading:3rem;--wp--preset--font-size--heading-small:2rem;--wp--preset--font-size--lead:1.2rem;--wp--preset--spacing--70:3rem;--wp--preset--spacing--80:4rem}.wp-block-columns{flex-direction:column}.wp-block-column{flex-basis:auto!important}.ft-preview-nav a:not(.ft-preview-demo){display:none}.ft-preview-footer-inner{align-items:start;flex-direction:column}}
`;

const document = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>FarmTree Native Homepage Preview</title><style>${previewCss}</style><link rel="stylesheet" href="/theme/style.css"></head><body><div class="wp-site-blocks"><header class="ft-preview-header"><div class="alignwide ft-preview-header-inner"><img src="/theme/assets/images/brand/farmtree-logo.webp" alt="FarmTree"><nav class="ft-preview-nav" aria-label="Preview navigation"><a href="#platform">Platform</a><a href="#proof">Proof Stories</a><a href="#faq">FAQ</a><a class="ft-preview-demo" href="#contact">Request a demo</a></nav></div></header><main>${homepage}</main><footer class="ft-preview-footer"><div class="alignwide ft-preview-footer-inner"><div><img src="/theme/assets/images/brand/farmtree-logo.webp" alt="FarmTree"><p>Plan agroforestry with scientific confidence</p></div><p>Native local preview</p></div></footer></div></body></html>`;

createServer((request, response) => {
  const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
  if (pathname === '/' || pathname === '/index.html') {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
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
