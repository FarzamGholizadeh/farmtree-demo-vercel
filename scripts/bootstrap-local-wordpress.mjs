import { readFile } from 'node:fs/promises';

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

const canonicalSamplePost = {
  slug: 'hello-world',
  title: 'Hello world!',
  content: 'Welcome to WordPress. This is your first post. Edit or delete it, then start writing!'
};

function normaliseSampleText(value) {
  return String(value ?? '')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replaceAll('&nbsp;', ' ')
    .replaceAll('&#8217;', '’')
    .replaceAll('&rsquo;', '’')
    .replace(/\s+/g, ' ')
    .trim();
}

function isCanonicalSamplePost(post) {
  return post.slug === canonicalSamplePost.slug &&
    normaliseSampleText(post.title?.raw ?? post.title?.rendered) === canonicalSamplePost.title &&
    normaliseSampleText(post.content?.raw ?? post.content?.rendered) === canonicalSamplePost.content;
}

const samplePostQuery = '/wp/v2/posts?slug=hello-world&status=publish,draft,pending,private,future&context=edit&per_page=100';
let samplePostCandidates = await api(samplePostQuery);

if (!verifyOnly) {
  for (const post of samplePostCandidates.filter(
    (candidate) => candidate.status === 'publish' && isCanonicalSamplePost(candidate)
  )) {
    await api(`/wp/v2/posts/${post.id}`, {
      method: 'POST',
      body: JSON.stringify({ status: 'draft' })
    });
  }

  samplePostCandidates = await api(samplePostQuery);
}

const exactSamplePosts = samplePostCandidates.filter(isCanonicalSamplePost);
if (exactSamplePosts.some(({ status }) => status === 'publish')) {
  throw new Error('The exact default WordPress sample post remains published in the local runtime.');
}
const samplePostState = exactSamplePosts.length > 0 ? 'draft-or-nonpublic' : 'absent';

const segmentDefinitions = JSON.parse(await readFile(
  new URL('../wordpress/wp-content/plugins/farmtree-content/data/customer-segments.json', import.meta.url),
  'utf8'
));
const editorialDefinitions = JSON.parse(await readFile(
  new URL('../wordpress/wp-content/plugins/farmtree-content/data/editorial-drafts.json', import.meta.url),
  'utf8'
));
const proofStoryDefinitions = JSON.parse(await readFile(
  new URL('../wordpress/wp-content/plugins/farmtree-content/data/proof-stories.json', import.meta.url),
  'utf8'
));
const englishPageDefinitions = JSON.parse(await readFile(
  new URL('../wordpress/wp-content/plugins/farmtree-content/data/english-pages.json', import.meta.url),
  'utf8'
));

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

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

function proofStoryContent(story) {
  return story.sections.map(([heading, paragraph]) => [
    `<!-- wp:heading --><h2 class="wp-block-heading">${escapeHtml(heading)}</h2><!-- /wp:heading -->`,
    `<!-- wp:paragraph --><p>${escapeHtml(paragraph)}</p><!-- /wp:paragraph -->`
  ].join('\n\n')).join('\n\n');
}

function englishPageContent(page) {
  if (page.body === 'contact') {
    return [
      '<!-- wp:paragraph --><p>The local pre-release form is intentionally unavailable until an approved delivery backend and privacy review are complete. No information entered here is transmitted, stored or logged.</p><!-- /wp:paragraph -->',
      '<!-- wp:html --><form class="ft-contact-form" aria-describedby="ft-contact-unavailable"><fieldset disabled><legend>Contact details</legend><label>Name *<input name="name" autocomplete="name" required></label><label>Email *<input type="email" name="email" autocomplete="email" required></label><label>Phone <input type="tel" name="phone" autocomplete="tel"></label><label>Organisation <input name="organisation" autocomplete="organization"></label><label>Topic *<select name="topic" required><option value="">Choose a topic</option><option>Platform and demo</option><option>Project modelling</option><option>Quotation</option><option>Other</option></select></label><label>Message *<textarea name="message" rows="6" required></textarea></label><label><input type="checkbox" name="consent" required> I agree that FarmTree may use my details to respond.</label><button type="submit" disabled>Delivery unavailable</button></fieldset></form><p id="ft-contact-unavailable"><strong>Safe fallback:</strong> email <a href="mailto:info@farmtree.earth?subject=FarmTree%20contact%20request">info@farmtree.earth</a>. Your mail application will show exactly what is sent.</p><!-- /wp:html -->',
      '<!-- wp:heading --><h2 class="wp-block-heading">Visit FarmTree</h2><!-- /wp:heading -->',
      '<!-- wp:paragraph --><p>FarmTree B.V.<br>Plus Ultra Building<br>Bronland 12C-1<br>6708 WH Wageningen<br>The Netherlands</p><!-- /wp:paragraph -->',
      '<!-- wp:paragraph --><p><a href="https://www.openstreetmap.org/search?query=Bronland%2012C-1%2C%206708%20WH%20Wageningen" target="_blank" rel="noreferrer noopener">View the location on OpenStreetMap ↗</a></p><!-- /wp:paragraph -->'
    ].join('\n\n');
  }
  if (page.slug === 'proof-stories') {
    const links = proofStoryDefinitions.map((story) => `<li><a href="/proof-stories/${escapeHtml(story.slug)}/">${escapeHtml(story.title)}</a> — ${escapeHtml(story.excerpt)}</li>`).join('');
    return `<!-- wp:paragraph {"fontSize":"lead"} --><p class="has-lead-font-size">${escapeHtml(page.body)}</p><!-- /wp:paragraph --><!-- wp:list --><ul>${links}</ul><!-- /wp:list -->`;
  }
  if (page.slug === 'customer-segments') {
    const links = segmentDefinitions.map((segment) => `<li><a href="/customer-segments/${escapeHtml(segment.slug)}/">${escapeHtml(segment.title)}</a> — ${escapeHtml(segment.excerpt)}</li>`).join('');
    return `<!-- wp:paragraph {"fontSize":"lead"} --><p class="has-lead-font-size">${escapeHtml(page.body)}</p><!-- /wp:paragraph --><!-- wp:list {"ordered":true} --><ol>${links}</ol><!-- /wp:list -->`;
  }
  return [
    `<!-- wp:paragraph {"fontSize":"lead"} --><p class="has-lead-font-size">${escapeHtml(page.body)}</p><!-- /wp:paragraph -->`,
    '<!-- wp:heading --><h2 class="wp-block-heading">A useful next step</h2><!-- /wp:heading -->',
    '<!-- wp:paragraph --><p>Explore <a href="/platform/">the Platform</a>, review <a href="/proof-stories/">Proof Stories</a>, or <a href="/contact/">contact FarmTree</a> with a specific planning question.</p><!-- /wp:paragraph -->'
  ].join('\n\n');
}

const segmentPosts = [];
for (const segment of segmentDefinitions) {
  let existing = await api(
    `/wp/v2/customer-segments?slug=${encodeURIComponent(segment.slug)}&status=publish,draft,pending,private,future&context=edit&per_page=1`
  );
  if (!verifyOnly && existing.length === 0) {
    const possibleRenames = await api(`/wp/v2/customer-segments?search=${encodeURIComponent(segment.title)}&status=publish,draft,pending,private,future&context=edit&per_page=100`);
    existing = possibleRenames.filter((candidate) => normaliseSampleText(candidate.title?.raw ?? candidate.title?.rendered) === segment.title);
  }
  let post = existing[0];

  if (!post) {
    if (verifyOnly) {
      throw new Error(`Private customer segment is missing: ${segment.slug}`);
    }

    post = await api('/wp/v2/customer-segments', {
      method: 'POST',
      body: JSON.stringify({
        title: segment.title,
        slug: segment.slug,
        status: 'private',
        excerpt: segment.excerpt,
        content: segmentContent(segment),
        menu_order: segment.order
      })
    });
  }

  if (!verifyOnly) {
    post = await api(`/wp/v2/customer-segments/${post.id}`, {
      method: 'POST',
      body: JSON.stringify({ title: segment.title, slug: segment.slug, status: 'private', excerpt: segment.excerpt, content: segmentContent(segment), menu_order: segment.order })
    });
  }

  if (post.status !== 'private') {
    throw new Error(`Customer segment must remain private before approval: ${segment.slug}`);
  }
  if (normaliseSampleText(post.title?.raw ?? post.title?.rendered) !== segment.title) {
    throw new Error(`Customer segment title differs from the approved order: ${segment.slug}`);
  }

  segmentPosts.push(post);
}

const editorialDrafts = [];
for (const article of editorialDefinitions) {
  const existing = await api(
    `/wp/v2/posts?slug=${encodeURIComponent(article.slug)}&status=publish,draft,pending,private,future&context=edit&per_page=1`
  );
  let post = existing[0];

  if (!post) {
    if (verifyOnly) {
      throw new Error(`Editorial draft is missing: ${article.slug}`);
    }

    post = await api('/wp/v2/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: article.title,
        slug: article.slug,
        status: 'draft',
        excerpt: article.excerpt,
        content: editorialContent(article)
      })
    });
  }


  if (!verifyOnly) {
    post = await api(`/wp/v2/posts/${post.id}`, {
      method: 'POST',
      body: JSON.stringify({ title: article.title, slug: article.slug, status: 'draft', excerpt: article.excerpt, content: editorialContent(article) })
    });
  }

  if (post.status !== 'draft') {
    throw new Error(`Editorial foundation content must remain draft: ${article.slug}`);
  }
  editorialDrafts.push(post);
}

const proofStories = [];
for (const story of proofStoryDefinitions) {
  const existing = await api(`/wp/v2/proof-stories?slug=${encodeURIComponent(story.slug)}&status=publish,draft,pending,private,future&context=edit&per_page=1`);
  let post = existing[0];
  if (!post && verifyOnly) throw new Error(`Private Proof Story is missing: ${story.slug}`);
  if (!post) post = await api('/wp/v2/proof-stories', { method: 'POST', body: JSON.stringify({ title: story.title, slug: story.slug, status: 'private', excerpt: story.excerpt, content: proofStoryContent(story), menu_order: story.order }) });
  if (!verifyOnly) post = await api(`/wp/v2/proof-stories/${post.id}`, { method: 'POST', body: JSON.stringify({ title: story.title, slug: story.slug, status: 'private', excerpt: story.excerpt, content: proofStoryContent(story), menu_order: story.order }) });
  if (post.status !== 'private') throw new Error(`Proof Story must remain private: ${story.slug}`);
  proofStories.push(post);
}

const englishPages = [];
for (const page of englishPageDefinitions) {
  const existing = await api(`/wp/v2/pages?slug=${encodeURIComponent(page.slug)}&status=publish,draft,pending,private,future&context=edit&per_page=1`);
  let post = existing[0];
  if (!post && verifyOnly) throw new Error(`Private English page is missing: ${page.slug}`);
  if (!post) post = await api('/wp/v2/pages', { method: 'POST', body: JSON.stringify({ title: page.title, slug: page.slug, status: 'private', excerpt: page.excerpt, content: englishPageContent(page) }) });
  if (!verifyOnly) post = await api(`/wp/v2/pages/${post.id}`, { method: 'POST', body: JSON.stringify({ title: page.title, slug: page.slug, status: 'private', excerpt: page.excerpt, content: englishPageContent(page) }) });
  if (post.status !== 'private') throw new Error(`English page must remain private: ${page.slug}`);
  englishPages.push(post);
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
  frontendResponse,
  dutchRouteResponse,
  germanRouteResponse
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
  fetch(baseUrl, { headers: { Cookie: session.cookie } }),
  fetch(new URL('/nl/', baseUrl), { headers: { Cookie: session.cookie }, redirect: 'manual' }),
  fetch(new URL('/de/', baseUrl), { headers: { Cookie: session.cookie }, redirect: 'manual' })
]);
const frontendHtml = await frontendResponse.text();
const activeTheme = activeThemes.find(({ stylesheet }) => stylesheet === 'farmtree-native');
const activePlugin = activePlugins.find(({ plugin }) => plugin === 'farmtree-content/farmtree-content');
const activeAiPlugin = activePlugins.find(({ plugin }) => plugin === 'farmtree-ai-assistant/farmtree-ai-assistant');
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
if (!activeAiPlugin) {
  throw new Error('farmtree-ai-assistant is not active in local WordPress for safe configuration testing.');
}
if (frontendHtml.includes('id="ft-ai-root"')) {
  throw new Error('FT Bot must remain absent while no valid provider configuration exists.');
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
if (frontendHtml.includes(canonicalSamplePost.content)) {
  throw new Error('Local WordPress frontend still exposes the default sample-post content.');
}
if (dutchRouteResponse.status !== 404 || germanRouteResponse.status !== 404) {
  throw new Error('Reserved /nl/ and /de/ locale paths must remain unpublished 404 routes.');
}

const requiredTemplates = ['404', 'archive', 'content-only-page', 'front-page', 'index', 'page', 'single', 'single-customer_segment', 'single-proof_story'];
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
if (!/<meta name=['"]robots['"][^>]*content=['"][^'"]*noindex/i.test(frontendHtml)) {
  throw new Error('The native frontend must remain noindex before release approval.');
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
  aiPlugin: { plugin: activeAiPlugin.plugin, frontend: 'inactive-until-configured' },
  homepageId: homepage.id,
  homepageStatus: savedPage.status,
  revisions: revisions.length,
  templates: requiredTemplates.length,
  templateParts: requiredTemplateParts.length,
  patterns: patterns.filter(({ name }) => name.startsWith('farmtree-native/')).length,
  themeAssets: themeAssets.size,
  siteEditor: siteEditorResponse.status,
  pageEditor: pageEditorResponse.status,
  frontend: frontendResponse.status,
  defaultSamplePost: samplePostState,
  customerSegments: {
    count: segmentPosts.length,
    status: 'private',
    order: segmentDefinitions.map(({ title }) => title)
  },
  editorialDrafts: {
    count: editorialDrafts.length,
    status: 'draft'
  },
  proofStories: { count: proofStories.length, status: 'private' },
  englishPages: { count: englishPages.length, status: 'private', routes: englishPageDefinitions.map(({ slug }) => `/${slug}/`) },
  locales: {
    en: frontendResponse.status,
    nl: dutchRouteResponse.status,
    de: germanRouteResponse.status
  }
}, null, 2));
