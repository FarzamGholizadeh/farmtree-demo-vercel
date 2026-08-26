const baseUrl = new URL(process.env.FARMTREE_LOCAL_WP_URL ?? 'http://localhost:8888');
const verifyOnly = process.argv.includes('--verify-only');

if (!['127.0.0.1', 'localhost', '::1'].includes(baseUrl.hostname)) {
  throw new Error('Local WordPress bootstrap refuses to modify a non-loopback host.');
}

function cookieHeader(response) {
  const setCookies = response.headers.getSetCookie?.() ?? [];

  return setCookies.map((cookie) => cookie.split(';', 1)[0]).join('; ');
}

async function startSession() {
  const response = await fetch(baseUrl, { redirect: 'manual' });
  const cookie = cookieHeader(response);

  if (!cookie.includes('wordpress_logged_in_')) {
    throw new Error('The local Playground auto-login session was not available.');
  }

  const themesResponse = await fetch(new URL('/wp-admin/themes.php', baseUrl), {
    headers: { Cookie: cookie }
  });
  const themesHtml = await themesResponse.text();
  const themeSettingsMatch = themesHtml.match(/var _wpThemeSettings = (\{.*\});/);

  if (!themesResponse.ok || !themeSettingsMatch) {
    throw new Error('Could not inspect themes in the local WordPress runtime.');
  }

  const nativeTheme = JSON.parse(themeSettingsMatch[1]).themes.find(
    ({ id }) => id === 'farmtree-native'
  );

  if (!nativeTheme) {
    throw new Error('WordPress did not recognize the mounted farmtree-native theme.');
  }

  if (!nativeTheme.active) {
    if (verifyOnly) {
      throw new Error('farmtree-native is not active in the local WordPress runtime.');
    }

    const activationUrl = nativeTheme.actions.activate
      .replaceAll('&amp;', '&')
      .replaceAll('&#038;', '&');
    const activationResponse = await fetch(activationUrl, {
      headers: { Cookie: cookie }
    });

    if (!activationResponse.ok) {
      throw new Error(`Local farmtree-native activation failed (${activationResponse.status}).`);
    }
  }

  const editorResponse = await fetch(
    new URL('/wp-admin/post-new.php?post_type=page', baseUrl),
    { headers: { Cookie: cookie } }
  );
  const editorHtml = await editorResponse.text();
  const settingsMatch = editorHtml.match(/wpApiSettings\s*=\s*(\{[^;]+\});/);

  if (!editorResponse.ok || !settingsMatch) {
    throw new Error('Could not establish an authenticated local WordPress editor session.');
  }

  return { cookie, nonce: JSON.parse(settingsMatch[1]).nonce };
}

const session = await startSession();

async function api(path, options = {}) {
  const response = await fetch(new URL(`/wp-json${path}`, baseUrl), {
    ...options,
    headers: {
      Accept: 'application/json',
      Cookie: session.cookie,
      'Content-Type': 'application/json',
      'X-WP-Nonce': session.nonce,
      ...options.headers
    }
  });
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(`Local WordPress API ${path} failed (${response.status}): ${JSON.stringify(body)}`);
  }

  return body;
}

const patterns = await api('/wp/v2/block-patterns/patterns');
const homepagePattern = patterns.find(({ name }) => name === 'farmtree-native/homepage-foundation');

if (!homepagePattern?.content) {
  throw new Error('WordPress did not register the FarmTree Homepage pattern.');
}

const existingPages = await api(
  '/wp/v2/pages?slug=farmtree-native-local-home&status=publish,draft,pending,private,future&context=edit'
);
let homepage = existingPages[0];

if (!homepage) {
  if (verifyOnly) {
    throw new Error('The private local FarmTree Homepage has not been bootstrapped.');
  }

  homepage = await api('/wp/v2/pages', {
    method: 'POST',
    body: JSON.stringify({
      title: 'FarmTree Native Local Homepage',
      slug: 'farmtree-native-local-home',
      status: 'private',
      content: '<!-- wp:paragraph --><p>Local runtime bootstrap</p><!-- /wp:paragraph -->'
    })
  });
}

if (!verifyOnly && homepage.content?.raw !== homepagePattern.content) {
  homepage = await api(`/wp/v2/pages/${homepage.id}`, {
    method: 'POST',
    body: JSON.stringify({
      title: 'FarmTree Native Local Homepage',
      slug: 'farmtree-native-local-home',
      status: 'private',
      content: homepagePattern.content
    })
  });
}

if (!verifyOnly) {
  await api('/wp/v2/settings', {
    method: 'POST',
    body: JSON.stringify({
      title: 'FarmTree Native Local',
      description: 'Isolated visual-first WordPress development runtime',
      show_on_front: 'page',
      page_on_front: homepage.id,
      posts_per_page: 3,
      default_comment_status: 'closed',
      default_ping_status: 'closed'
    })
  });
}

const [
  savedPage,
  revisions,
  activeThemes,
  activePlugins,
  templates,
  templateParts,
  settings,
  siteEditorResponse,
  pageEditorResponse,
  frontendResponse
] = await Promise.all([
  api(`/wp/v2/pages/${homepage.id}?context=edit`),
  api(`/wp/v2/pages/${homepage.id}/revisions?context=edit`),
  api('/wp/v2/themes?status=active'),
  api('/wp/v2/plugins?status=active'),
  api('/wp/v2/templates?context=edit&per_page=100'),
  api('/wp/v2/template-parts?context=edit&per_page=100'),
  api('/wp/v2/settings'),
  fetch(new URL('/wp-admin/site-editor.php', baseUrl), { headers: { Cookie: session.cookie } }),
  fetch(new URL(`/wp-admin/post.php?post=${homepage.id}&action=edit`, baseUrl), {
    headers: { Cookie: session.cookie }
  }),
  fetch(baseUrl, { headers: { Cookie: session.cookie } })
]);
const frontendHtml = await frontendResponse.text();
const activeTheme = activeThemes.find(({ stylesheet }) => stylesheet === 'farmtree-native');
const activePlugin = activePlugins.find(({ plugin }) => plugin === 'farmtree-content/farmtree-content');
const requiredFrontendContent = [
  'ft-native-site-header',
  'Make agroforestry measurable, investable and scalable',
  'The FarmTree Platform',
  'Trust and references',
  'Proof Stories',
  'News &amp; Insights',
  'ft-final-cta',
  'ft-native-site-footer'
];

if (!activeTheme || !activeTheme.is_block_theme) {
  throw new Error('farmtree-native is not the active recognized Block Theme in local WordPress.');
}
if (!activePlugin) {
  throw new Error('farmtree-content is not active in local WordPress.');
}
if (savedPage.content.raw !== homepagePattern.content) {
  throw new Error('Local Homepage content did not persist after save/reload.');
}
if (savedPage.status !== 'private') {
  throw new Error('The local Homepage must remain private.');
}
if (revisions.length < 1) {
  throw new Error('Local Homepage revision history was not created.');
}
if (!siteEditorResponse.ok || !siteEditorResponse.url.includes('site-editor.php')) {
  throw new Error('The local WordPress Site Editor is unavailable.');
}
if (!pageEditorResponse.ok || !pageEditorResponse.url.includes('post.php')) {
  throw new Error('The local WordPress Page Editor is unavailable.');
}
if (!frontendResponse.ok) {
  throw new Error(`Local WordPress frontend returned HTTP ${frontendResponse.status}.`);
}
for (const content of requiredFrontendContent) {
  if (!frontendHtml.includes(content)) {
    throw new Error(`Local WordPress frontend is missing: ${content}`);
  }
}
if (/PHP (?:Warning|Fatal error)|<b>Warning<\/b>|<b>Fatal error<\/b>/i.test(frontendHtml)) {
  throw new Error('Local WordPress frontend contains a PHP warning or fatal error.');
}

const requiredTemplates = ['404', 'archive', 'content-only-page', 'front-page', 'index', 'page', 'single'];
const registeredTemplates = new Set(templates.map(({ slug }) => slug));
for (const template of requiredTemplates) {
  if (!registeredTemplates.has(template)) {
    throw new Error(`Local WordPress did not register native template: ${template}`);
  }
}

const requiredTemplateParts = ['footer', 'header', 'quotation-modal'];
const registeredTemplateParts = new Set(templateParts.map(({ slug }) => slug));
for (const part of requiredTemplateParts) {
  if (!registeredTemplateParts.has(part)) {
    throw new Error(`Local WordPress did not register native template part: ${part}`);
  }
}

for (const pattern of [
  'farmtree-native/brand-logo',
  'farmtree-native/call-to-action',
  'farmtree-native/homepage-foundation',
  'farmtree-native/page-intro'
]) {
  if (!patterns.some(({ name }) => name === pattern)) {
    throw new Error(`Local WordPress did not register native pattern: ${pattern}`);
  }
}

if (
  !savedPage.content.raw.includes('"templateLock":"contentOnly"') ||
  !savedPage.content.raw.includes('<!-- wp:query')
) {
  throw new Error('Local Homepage lost its content-only lock or Query Loop.');
}

if (!frontendHtml.includes('wp-block-query') || (frontendHtml.match(/<h1\b/g) ?? []).length !== 1) {
  throw new Error('Local Homepage must render its Query Loop and exactly one H1.');
}

if (settings.show_on_front !== 'page' || settings.page_on_front !== homepage.id) {
  throw new Error('Local WordPress is not configured to render the private native Homepage on the front.');
}

const themeAssets = new Set(
  Array.from(
    frontendHtml.matchAll(/(?:src|href|poster)=["']([^"']*\/wp-content\/themes\/farmtree-native\/[^"'?#]+)[^"']*["']/g),
    (match) => new URL(match[1], baseUrl).href
  )
);
const assetResponses = await Promise.all(
  Array.from(themeAssets, async (assetUrl) => ({ assetUrl, response: await fetch(assetUrl) }))
);
for (const { assetUrl, response } of assetResponses) {
  if (!response.ok) {
    throw new Error(`Local WordPress theme asset failed (${response.status}): ${assetUrl}`);
  }
}

console.log(JSON.stringify({
  url: baseUrl.href,
  wordpress: frontendHtml.match(/generator" content="WordPress ([^"]+)/)?.[1] ?? 'detected',
  php: frontendResponse.headers.get('x-powered-by') ?? 'PHP runtime detected',
  theme: activeTheme.stylesheet,
  blockTheme: activeTheme.is_block_theme,
  plugin: activePlugin.plugin,
  homepageId: homepage.id,
  homepageStatus: savedPage.status,
  revisions: revisions.length,
  templates: requiredTemplates.length,
  templateParts: requiredTemplateParts.length,
  patterns: patterns.filter(({ name }) => name.startsWith('farmtree-native/')).length,
  themeAssets: themeAssets.size,
  siteEditor: siteEditorResponse.status,
  pageEditor: pageEditorResponse.status,
  frontend: frontendResponse.status
}, null, 2));
