import { readFile } from 'node:fs/promises';

const baseUrl = new URL(process.env.FARMTREE_LOCAL_WP_URL ?? 'http://localhost:8888');
const verifyOnly = process.argv.includes('--verify-only');
const localQaStatus = 'publish';

if (!['127.0.0.1', 'localhost', '::1'].includes(baseUrl.hostname)) {
  throw new Error('Local WordPress bootstrap refuses to modify a non-loopback host.');
}

function cookieHeader(response) {
  const setCookies = response.headers.getSetCookie?.() ?? [];

  return setCookies.map((cookie) => cookie.split(';', 1)[0]).join('; ');
}

const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function waitForAutoLoginSession() {
  const deadline = Date.now() + 60_000;
  let lastProblem = 'the runtime did not respond';

  do {
    try {
      const response = await fetch(baseUrl, {
        redirect: 'manual',
        signal: AbortSignal.timeout(5_000)
      });
      const cookie = cookieHeader(response);

      if (cookie.includes('wordpress_logged_in_')) return cookie;
      lastProblem = `HTTP ${response.status} did not provide the Playground auto-login cookie`;
    } catch (error) {
      lastProblem = error instanceof Error ? error.message : String(error);
    }

    await pause(500);
  } while (Date.now() < deadline);

  throw new Error(`The local Playground auto-login session was not available: ${lastProblem}.`);
}

async function authenticatedJson(path, { cookie, nonce }, options = {}) {
  const response = await fetch(new URL(`/wp-json${path}`, baseUrl), {
    ...options,
    headers: {
      Accept: 'application/json',
      Cookie: cookie,
      'Content-Type': 'application/json',
      'X-WP-Nonce': nonce,
      ...options.headers
    }
  });
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(`Local WordPress API ${path} failed (${response.status}): ${JSON.stringify(body)}`);
  }

  return body;
}

async function startSession() {
  const cookie = await waitForAutoLoginSession();

  const initialEditorResponse = await fetch(
    new URL('/wp-admin/post-new.php?post_type=page', baseUrl),
    { headers: { Cookie: cookie } }
  );
  const initialEditorHtml = await initialEditorResponse.text();
  const initialSettingsMatch = initialEditorHtml.match(/wpApiSettings\s*=\s*(\{[^;]+\});/);

  if (!initialEditorResponse.ok || !initialSettingsMatch) {
    throw new Error('Could not establish an authenticated local WordPress editor session.');
  }

  const session = { cookie, nonce: JSON.parse(initialSettingsMatch[1]).nonce };
  const requiredPlugins = [
    'farmtree-content/farmtree-content',
    'farmtree-ai-assistant/farmtree-ai-assistant'
  ];
  const installedPlugins = await authenticatedJson('/wp/v2/plugins?context=edit&per_page=100', session);

  for (const pluginId of requiredPlugins) {
    const installedPlugin = installedPlugins.find(({ plugin }) => plugin === pluginId);

    if (!installedPlugin) {
      throw new Error(`WordPress did not recognize the mounted local plugin: ${pluginId}.`);
    }
    if (installedPlugin.status === 'active') continue;
    if (verifyOnly) {
      throw new Error(`${pluginId} is not active in the local WordPress runtime.`);
    }

    await authenticatedJson(`/wp/v2/plugins/${pluginId}`, session, {
      method: 'POST',
      body: JSON.stringify({ status: 'active' })
    });
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
  return authenticatedJson(path, session, options);
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
const teamMemberDefinitions = JSON.parse(await readFile(
  new URL('../wordpress/wp-content/plugins/farmtree-content/data/team-members.json', import.meta.url),
  'utf8'
));

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
  'carbon-planning': ['proof-carbon-planning-1600.webp', 'Agroforestry planners comparing maps and a laptop in a field office'],
  'farm-value-modelling': ['proof-farm-value-modelling-1600.webp', 'Farmer and adviser reviewing a farm plan and calculator in an agroforestry field'],
  'cocoa-scenario-planning': ['proof-cocoa-scenario-planning-1600.webp', 'Ripe cocoa pods in a shaded agroforestry plot with a field technician in the distance'],
  'water-landscape-resilience': ['proof-water-landscape-resilience-1600.webp', 'Water moving through a vegetated agroforestry landscape while a technician takes measurements']
};

// These publication settings are deliberately confined to the loopback-only QA
// bootstrap. Source content remains approval-gated and production is untouched.
const localEnglishPageDefinitions = [
  ...englishPageDefinitions,
  {
    title: 'News & Insights',
    slug: 'news-insights',
    excerpt: 'Source-led FarmTree analysis for agroforestry planning teams.',
    body: 'news'
  }
];

const editorialPresentation = {
  'farmtree-water-erosion-microclimate-model-update-2026': {
    category: 'FarmTree Updates',
    image: 'news-water-erosion-microclimate-2026-v1-1600.webp',
    alt: 'Agroforestry rows after rainfall with surface water moving between planted contours'
  },
  'eu-carbon-farming-methodologies-agroforestry-2026': {
    category: 'Policy & Standards',
    image: 'news-eu-carbon-farming-methodologies-2026-v1-1600.webp',
    alt: 'Soil sampling equipment and scenario-planning materials beside an agroforestry field'
  },
  'eudr-2026-agroforestry-data-readiness': {
    category: 'Policy & Standards',
    image: 'news-eudr-data-readiness-2026-v1-1600.webp',
    alt: 'Field technician reviewing a parcel map at the edge of a mixed agroforestry plot'
  },
  'verra-vm0042-v22-agricultural-land-management': {
    category: 'Data & Evidence',
    image: 'news-verra-vm0042-v22-v1-1600.webp',
    alt: 'Careful soil-core sampling in a diversified agroforestry field'
  },
  'verra-vm0042-v30-consultation-lessons': {
    category: 'Data & Evidence',
    image: 'news-verra-vm0042-v30-governance-v1-1600.webp',
    alt: 'Scenario diagrams and field measurements being compared beside agroforestry rows'
  },
  'smallholder-agroforestry-wood-production-lessons-2025': {
    category: 'Species & Design',
    image: 'news-smallholder-wood-production-v1-1600.webp',
    alt: 'A small diversified farm combining managed trees, crops and stacked pruning wood'
  },
  'carbon-pricing-2026-nature-project-quality': {
    category: 'Project Finance',
    image: 'news-carbon-pricing-2026-v1-1600.webp',
    alt: 'A planner comparing scenario materials while overlooking an agroforestry landscape'
  },
  'agroforestry-species-data-switchboard-2025': {
    category: 'Species & Design',
    image: 'news-species-data-provenance-v1-1600.webp',
    alt: 'Leaves and seed pods being compared with field records at a botanical work table'
  },
  'nature-restoration-plans-report-once-agroforestry-2025': {
    category: 'Landscape Planning',
    image: 'news-nature-restoration-planning-v1-1600.webp',
    alt: 'Landscape planners reviewing a restoration map above a mosaic of fields and tree corridors'
  }
};

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

async function ensureThemeMedia({ directory, filename, alt, title }) {
  const mediaSlug = filename.replace(/\.[^.]+$/, '');
  let media = await api(`/wp/v2/media?slug=${encodeURIComponent(mediaSlug)}&context=edit&per_page=1`);
  if (!media[0] && verifyOnly) throw new Error(`Required media is missing: ${filename}`);
  if (!media[0]) {
    const imageBuffer = await readFile(new URL(`../wordpress/wp-content/themes/farmtree-native/assets/images/${directory}/${filename}`, import.meta.url));
    media = [await api('/wp/v2/media', {
      method: 'POST',
      headers: {
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type': 'image/webp'
      },
      body: imageBuffer
    })];
  }
  if (!verifyOnly) {
    media[0] = await api(`/wp/v2/media/${media[0].id}`, {
      method: 'POST',
      body: JSON.stringify({ alt_text: alt, title })
    });
  }
  return media[0];
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

function teamPageContent(mediaBySlug) {
  const cards = teamMemberDefinitions.map((member) => {
    const media = mediaBySlug.get(member.slug);
    const linkedin = member.linkedin
      ? `<!-- wp:paragraph {"className":"ft-team-link"} --><p class="ft-team-link"><a href="${escapeHtml(member.linkedin)}" target="_blank" rel="noreferrer noopener">LinkedIn ↗</a></p><!-- /wp:paragraph -->`
      : '';
    return `<!-- wp:group {"className":"ft-team-card","layout":{"type":"constrained"}} --><article class="wp-block-group ft-team-card"><!-- wp:image {"id":${media.id},"sizeSlug":"large","linkDestination":"none","className":"ft-team-portrait"} --><figure class="wp-block-image size-large ft-team-portrait"><img src="${escapeHtml(media.source_url)}" alt="${escapeHtml(member.name)}, ${escapeHtml(member.role)}" class="wp-image-${media.id}"/></figure><!-- /wp:image --><!-- wp:heading {"level":2,"fontSize":"lead"} --><h2 class="wp-block-heading has-lead-font-size">${escapeHtml(member.name)}</h2><!-- /wp:heading --><!-- wp:paragraph {"className":"ft-team-role"} --><p class="ft-team-role">${escapeHtml(member.role)}</p><!-- /wp:paragraph --><!-- wp:paragraph {"fontSize":"small"} --><p class="has-small-font-size">${escapeHtml(member.bio)}</p><!-- /wp:paragraph -->${linkedin}</article><!-- /wp:group -->`;
  }).join('');
  return `<!-- wp:paragraph {"className":"ft-team-intro","fontSize":"lead"} --><p class="ft-team-intro has-lead-font-size">FarmTree combines agroforestry science, modelling, technology and project experience. Meet the people building and supporting the Platform.</p><!-- /wp:paragraph --><!-- wp:group {"className":"ft-team-grid","layout":{"type":"grid","minimumColumnWidth":"18rem"}} --><div class="wp-block-group ft-team-grid">${cards}</div><!-- /wp:group -->`;
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

function englishPageContent(page, teamMedia = new Map()) {
  if (page.body === 'news' || page.slug === 'blog') {
    return newsHubContent();
  }
  if (page.body === 'contact') {
    return [
      '<!-- wp:paragraph --><p>The local pre-release form is intentionally unavailable until an approved delivery backend and privacy review are complete. No information entered here is transmitted, stored or logged.</p><!-- /wp:paragraph -->',
      '<!-- wp:html --><form class="ft-contact-form" aria-describedby="ft-contact-unavailable"><fieldset disabled><legend>Contact details</legend><label>Name *<input name="name" autocomplete="name" required></label><label>Email *<input type="email" name="email" autocomplete="email" required></label><label>Phone <input type="tel" name="phone" autocomplete="tel"></label><label>Organisation <input name="organisation" autocomplete="organization"></label><label>Topic *<select name="topic" required><option value="">Choose a topic</option><option>Platform and demo</option><option>Project modelling</option><option>Quotation</option><option>Other</option></select></label><label>Message *<textarea name="message" rows="6" required></textarea></label><label><input type="checkbox" name="consent" required> I agree that FarmTree may use my details to respond.</label><button type="submit" disabled>Delivery unavailable</button></fieldset></form><p id="ft-contact-unavailable"><strong>Safe fallback:</strong> email <a href="mailto:info@farmtree.earth?subject=FarmTree%20contact%20request">info@farmtree.earth</a>. Your mail application will show exactly what is sent.</p><!-- /wp:html -->',
      '<!-- wp:heading --><h2 class="wp-block-heading">Visit FarmTree</h2><!-- /wp:heading -->',
      '<!-- wp:paragraph --><p>FarmTree B.V.<br>Plus Ultra Building<br>Bronland 12C-1<br>6708 WH Wageningen<br>The Netherlands</p><!-- /wp:paragraph -->',
      '<!-- wp:paragraph --><p><a href="https://www.openstreetmap.org/search?query=Bronland%2012C-1%2C%206708%20WH%20Wageningen" target="_blank" rel="noreferrer noopener">View the location on OpenStreetMap ↗</a></p><!-- /wp:paragraph -->'
    ].join('\n\n');
  }
  if (page.slug === 'team') return teamPageContent(teamMedia);
  if (page.slug === 'vacancies') return vacanciesPageContent();
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

const segmentMedia = new Map();
for (const segment of segmentDefinitions) {
  const [filename, alt] = segmentPresentation[segment.slug] ?? [];
  if (!filename) throw new Error(`Segment presentation metadata is missing: ${segment.slug}`);
  segmentMedia.set(segment.slug, await ensureThemeMedia({ directory: 'segments', filename, alt, title: segment.title }));
}

const proofMedia = new Map();
for (const story of proofStoryDefinitions) {
  const [filename, alt] = proofPresentation[story.slug] ?? [];
  if (!filename) throw new Error(`Proof presentation metadata is missing: ${story.slug}`);
  proofMedia.set(story.slug, await ensureThemeMedia({ directory: 'proof', filename, alt, title: story.title }));
}

const teamMedia = new Map();
for (const member of teamMemberDefinitions) {
  teamMedia.set(member.slug, await ensureThemeMedia({ directory: 'team', filename: member.image, alt: `${member.name}, ${member.role}`, title: member.name }));
}

const segmentPosts = [];
for (const segment of segmentDefinitions) {
  const featuredMedia = segmentMedia.get(segment.slug);
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
        status: localQaStatus,
        excerpt: segment.excerpt,
        content: segmentContent(segment),
        menu_order: segment.order,
        featured_media: featuredMedia.id
      })
    });
  }

  if (!verifyOnly) {
    post = await api(`/wp/v2/customer-segments/${post.id}`, {
      method: 'POST',
      body: JSON.stringify({ title: segment.title, slug: segment.slug, status: localQaStatus, excerpt: segment.excerpt, content: segmentContent(segment), menu_order: segment.order, featured_media: featuredMedia.id })
    });
  }

  if (post.status !== localQaStatus || post.featured_media !== featuredMedia.id) {
    throw new Error(`Customer segment is not published in the loopback QA runtime: ${segment.slug}`);
  }
  if (normaliseSampleText(post.title?.raw ?? post.title?.rendered) !== segment.title) {
    throw new Error(`Customer segment title differs from the approved order: ${segment.slug}`);
  }

  segmentPosts.push(post);
}

const editorialDrafts = [];
for (const article of editorialDefinitions) {
  const presentation = editorialPresentation[article.slug];
  if (!presentation) throw new Error(`Editorial presentation metadata is missing: ${article.slug}`);
  let categories = await api(`/wp/v2/categories?slug=${encodeURIComponent(presentation.category.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replaceAll(/^-|-$/g, ''))}&context=edit&per_page=1`);
  if (!categories[0] && verifyOnly) throw new Error(`Editorial category is missing: ${presentation.category}`);
  if (!categories[0]) categories = [await api('/wp/v2/categories', { method: 'POST', body: JSON.stringify({ name: presentation.category }) })];

  const mediaSlug = presentation.image.replace(/\.[^.]+$/, '');
  let media = await api(`/wp/v2/media?slug=${encodeURIComponent(mediaSlug)}&context=edit&per_page=1`);
  if (!media[0] && verifyOnly) throw new Error(`Editorial featured image is missing: ${presentation.image}`);
  if (!media[0]) {
    const imageBuffer = await readFile(new URL(`../wordpress/wp-content/themes/farmtree-native/assets/images/news/${presentation.image}`, import.meta.url));
    media = [await api('/wp/v2/media', {
      method: 'POST',
      headers: {
        'Content-Disposition': `attachment; filename="${presentation.image}"`,
        'Content-Type': 'image/webp'
      },
      body: imageBuffer
    })];
  }
  if (!verifyOnly) {
    media[0] = await api(`/wp/v2/media/${media[0].id}`, {
      method: 'POST',
      body: JSON.stringify({ alt_text: presentation.alt, title: article.title })
    });
  }
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
        status: localQaStatus,
        excerpt: article.excerpt,
        content: editorialContent(article),
        date: `${article.sourceDate}T09:00:00`,
        categories: [categories[0].id],
        featured_media: media[0].id
      })
    });
  }


  if (!verifyOnly) {
    post = await api(`/wp/v2/posts/${post.id}`, {
      method: 'POST',
      body: JSON.stringify({ title: article.title, slug: article.slug, status: localQaStatus, excerpt: article.excerpt, content: editorialContent(article), date: `${article.sourceDate}T09:00:00`, categories: [categories[0].id], featured_media: media[0].id })
    });
  }

  if (post.status !== localQaStatus || post.featured_media !== media[0].id || !post.categories.includes(categories[0].id)) {
    throw new Error(`Editorial post is not fully published in the loopback QA runtime: ${article.slug}`);
  }
  editorialDrafts.push(post);
}

const proofStories = [];
for (const story of proofStoryDefinitions) {
  const featuredMedia = proofMedia.get(story.slug);
  const existing = await api(`/wp/v2/proof-stories?slug=${encodeURIComponent(story.slug)}&status=publish,draft,pending,private,future&context=edit&per_page=1`);
  let post = existing[0];
  if (!post && verifyOnly) throw new Error(`Private Proof Story is missing: ${story.slug}`);
  if (!post) post = await api('/wp/v2/proof-stories', { method: 'POST', body: JSON.stringify({ title: story.title, slug: story.slug, status: localQaStatus, excerpt: story.excerpt, content: proofStoryContent(story), menu_order: story.order, featured_media: featuredMedia.id }) });
  if (!verifyOnly) post = await api(`/wp/v2/proof-stories/${post.id}`, { method: 'POST', body: JSON.stringify({ title: story.title, slug: story.slug, status: localQaStatus, excerpt: story.excerpt, content: proofStoryContent(story), menu_order: story.order, featured_media: featuredMedia.id }) });
  if (post.status !== localQaStatus || post.featured_media !== featuredMedia.id) throw new Error(`Proof Story is not fully published in the loopback QA runtime: ${story.slug}`);
  proofStories.push(post);
}

const englishPages = [];
for (const page of localEnglishPageDefinitions) {
  const existing = await api(`/wp/v2/pages?slug=${encodeURIComponent(page.slug)}&status=publish,draft,pending,private,future&context=edit&per_page=1`);
  let post = existing[0];
  if (!post && verifyOnly) throw new Error(`Private English page is missing: ${page.slug}`);
  if (!post) post = await api('/wp/v2/pages', { method: 'POST', body: JSON.stringify({ title: page.title, slug: page.slug, status: localQaStatus, excerpt: page.excerpt, content: englishPageContent(page, teamMedia) }) });
  if (!verifyOnly) post = await api(`/wp/v2/pages/${post.id}`, { method: 'POST', body: JSON.stringify({ title: page.title, slug: page.slug, status: localQaStatus, excerpt: page.excerpt, content: englishPageContent(page, teamMedia) }) });
  if (post.status !== localQaStatus) throw new Error(`English page is not published in the loopback QA runtime: ${page.slug}`);
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
      status: localQaStatus,
      content: '<!-- wp:paragraph --><p>Local runtime bootstrap</p><!-- /wp:paragraph -->'
    })
  });
}

if (!verifyOnly) {
  homepage = await api(`/wp/v2/pages/${homepage.id}`, {
    method: 'POST',
    body: JSON.stringify({
      title: 'FarmTree Native Local Homepage',
      slug: 'farmtree-native-local-home',
      status: localQaStatus,
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
      posts_per_page: 9,
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
  'Agroforestry decisions across diverse landscapes',
  'Trust and references',
  'Proof Stories',
  'Last News',
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
if (savedPage.status !== localQaStatus) {
  throw new Error('The local Homepage is not published for anonymous loopback QA.');
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
  throw new Error('Local WordPress is not configured to render the native QA Homepage on the front.');
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
    status: localQaStatus,
    order: segmentDefinitions.map(({ title }) => title)
  },
  editorialDrafts: {
    count: editorialDrafts.length,
    status: localQaStatus
  },
  proofStories: { count: proofStories.length, status: localQaStatus },
  englishPages: { count: englishPages.length, status: localQaStatus, routes: localEnglishPageDefinitions.map(({ slug }) => `/${slug}/`) },
  locales: {
    en: frontendResponse.status,
    nl: dutchRouteResponse.status,
    de: germanRouteResponse.status
  }
}, null, 2));
