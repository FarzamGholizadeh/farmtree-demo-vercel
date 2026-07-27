# FarmTree Website — Architecture

_Last updated: 2026-07-27_

## Shape
The production FarmTree website source is the WordPress implementation on the
`wordpress-integration` branch:

- Theme: `wordpress/wp-content/themes/farmtree`
- Core plugin: `wordpress/wp-content/plugins/farmtree-core`
- AI plugin: `wordpress/wp-content/plugins/farmtree-ai-assistant`
- Production domain: `https://farmtree.eu/`

The root `index.html` and any Vercel/static SPA artifacts are legacy/reference
material only. Vercel is not the production source.

## Routing (single authority)
The **early stable router** (`ft-stable-router-v6-early`) owns everything:
- one normalize map (aliases: solutions→services, cocoa-focus→cocoa,
  implementers→ngos, farmtree-platform→platform, …; unknown ids pass
  through and resolve against `#page-<id>`)
- one delegated `[data-page]` click handler (capture,
  stopImmediatePropagation) → `render()`
- one hashchange path, one initial-load path (DOMContentLoaded + one
  settled re-render on window load)
- `render()` = single active-page transition: toggles `main > section`,
  body classes, `data-current-page`, hash (replaceState), scroll
- deep-link alias: `#request` → `#contact` + contact modal (load-time)
All legacy routers/wrappers/reconciliation timers were removed in commit
`0fac982` (marker comments left in place). Remaining hashchange listeners
are UI refreshers only (content patchers, sliders, segment page titles).

## Pages
- Static `<section class="page" id="page-…">` elements in `<main>`.
- **Customer-segment pages** (10) are template-generated from structured
  data (`ft-segment-pages` script) and injected synchronously at parse
  time, so the router resolves `#segment-*` on direct load/refresh/history.
  #case-studies is a dedicated page (hero + the four original project
  cards moved verbatim from the homepage + CTA pair).
  Data: slug, menu label, H1, value prop, decision context, 4 help cards,
  capability chips (approved capability areas only), 4 outputs, workflow
  note. `window.FT_SEGMENTS` exposes {slug, short, title}.
- Use-case pages (investors/ngos) are enhanced at DOMContentLoaded by the
  ghostwriter script (`enhanceUseCasePage`).

## Base Technology connectors
`ft-basetech-connectors`: decorative SVG overlay drawing 4 diagram->card
paths from live bounding boxes (debounced ResizeObserver, IntersectionObserver
pause/redraw), animateMotion gold pulse, reduced-motion aware, aria-hidden.

## Desktop density + title system
`ft-density-title-system-v1` (>=1024 only): token-driven type/spacing
reduction (--fx-section-y, heading clamps, card padding) approximating the
prior 80%-zoom density with NO css zoom / transform / viewport / root-font.
`.ft-hsec` reusable section-title class.

## Brand assets
Favicons: assets/brand/favicons/* + root favicon.ico (from master, full logo
on white square). Loader + AI-assistant header + Base Technology diagram
model box all use the current logo (shared farmtree-logo-primary-320 webp;
diagram is a scripted raster composite, originals in assets/base-technology/).

## Fullscreen menu
Five-card Bento grid (12-col: MAIN/FARMTREE/COMPANY 4-4-4; CUSTOMER
SEGMENTS 8 + FORMS & LEGAL 4; 2-col tablet with segments full-row;
1-col mobile). SVG close control (grid-centred, 52px), Escape-to-close
with focus return, Tab focus-trap while open.

## CTA system (final product decision)
- External controls are **native anchors**: platform-entry (header/footer
  pills, mobile menu "Platform", "See/Explore the platform") →
  `…/Identity/Account/Login`; every "Request a demo" →
  `…/Identity/Account/Register`. `data-ft-action` is classification only.
- The one scripted action: `data-ft-action="request-quotation"` and
  `data-ftmodal="request"` open the local contact modal
  (`window.ftOpenContactModal`, idempotent buildModal+openModal).
- `rewriteRequestButtons`/`refineContact` still convert the remaining
  non-demo `data-page="request"` controls (Design tool, Open request
  form, Request workflow session) to the modal path.

## Forms
Three lead surfaces (request page, contact modal, chat) POST JSON to
`window.FT_FORM_ENDPOINT` via `ftSubmitLead()`. While the endpoint holds the
`YOUR_FORM_ID` placeholder (`ftFormConfigured()` false), submission is rejected
**before any network request** — nothing is sent, no fake success, input is not
cleared — and each surface shows "Form submission is not configured yet. Please
contact FarmTree directly." `_gotcha` honeypots; no PII logging (zero console.*
in codebase). Go live by replacing `YOUR_FORM_ID` (Formspree / WP REST /
CRM-Odoo). Release blocker, see FORMS.md.

## Counters
Generic block animates digit-bearing `.metric h3` / `.ft-proof-metric
strong` (observe-set == initialised-set guard, commit `5add78f`);
`fixCounterValues` owns the Track-Record row (50 yrs/4/3/MRV). The About
proof row (+100/+30/+40/+1,000,000) is intentionally static.

## QA tooling (`qa/tools/`, run against `python3 -m http.server 8899`)
- `console-regression.js` — zero-pageerror matrix + counter finals
- `platform-route-regression.js` — Platform/Cocoa routing + history
- `cta-regression.js` — exact CTA URLs, single-action, keyboard,
  straggler invariant, modifier-click freedom
- `segments-regression.js` — footer socials, About proof/icon, segments
  removal, menu, all 10 segment routes
- `baseline-shots.js`, `logo-shots.js`, `form-smoke.js` — visual/functional
  harnesses; artifacts in `qa/final-hardening/`, `qa/logo-qc/`

## SEO / environment
Production domain: `https://farmtree.eu/`. In the WordPress theme,
canonical/OG URL generation uses WordPress URL helpers such as `home_url()`;
robots behavior is owned by WordPress Settings / approved SEO configuration.
Hash routing remains from the static-era implementation, so hash sections are
not independently indexable WordPress routes. Future clean URLs require a
separate approved routing/SEO implementation.

## WordPress integration (`wordpress-integration` branch)
Phase-1 port of the approved static site into a **classic** custom theme
(`wordpress/wp-content/themes/farmtree`) + companion plugin
(`wordpress/wp-content/plugins/farmtree-core`), served from
`https://farmtree.eu`. No page builder, no jQuery. Full detail:
`wordpress/README.md`.

- **Extraction (deterministic, one-off).** `index.html` was split by source
  order: 64 `<style>` blocks → four ordered CSS files (`base → components →
  pages → responsive`, enqueued via a dependency chain to preserve the exact
  cascade); 45 inline scripts → two ordered JS bundles — `farmtree-head.js`
  (CTA capture listener + early hash router, `<head>`, both defer to
  `DOMContentLoaded`) and `farmtree-app.js` (all in-body IIFEs, footer). Body
  markup → three template parts (`header-chrome`, `main-home`, `footer-chrome`)
  wrapped by `header.php` / `front-page.php` / `footer.php`.
- **Templates.** `front-page.php` (and the `index.php` fallback) render the full
  homepage document; the head hash router resolves `#platform`, `#case-studies`,
  `#segment-*`. Title via WordPress' title system (`pre_get_document_title`),
  not a hard-coded `<title>`.
- **Asset URLs.** `farmtree_asset()` (markup, escaped `get_theme_file_uri`),
  `window.FT_ASSETS` (JS-built markup), `url(../…)` (CSS). Nothing hard-codes
  `assets/…` or a filesystem path. Production assets copied into the theme
  minus the 23.9 MB source GIF, `superseded-opaque-source/`, `icons/`, QA.
- **SEO/env.** No hard-coded `noindex` (Settings → Reading / SEO plugin owns
  robots); canonical/OG use `home_url()` = `farmtree.eu`; no Vercel preview
  domain reference. Hash routing preserved this phase; clean permalinks
  deferred.
- **Plugin.** Foundations only — `farmtree_core_planned_content_models()`
  documents the future editable models (News, Case Studies, Testimonials, Team,
  Vacancies, Customer Segments, FAQ, Videos); **no public post type is
  registered yet**, so activation shows complete approved content immediately.
- **Deploy.** `.github/workflows/deploy-wordpress.yml` — manual-only via
  `workflow_dispatch`. The workflow validates files and PHP syntax, then
  deploys the theme and plugins to Vimexx over SSH/rsync only after the GitHub
  `production` environment approval boundary is cleared.
  `.github/workflows/test-vimexx-ssh.yml` is manual-only.

## WordPress-native foundation (`FT-WP-001`)
The theme now has a hybrid Gutenberg foundation while keeping the approved
single-document frontend shell:

- Custom block: `farmtree/homepage-hero`.
- Pilot page template: `template-farmtree-native-homepage.php`.
- Pattern: `farmtree/homepage-hero-pilot`.
- Editor guardrail: the pilot page template allows only
  `farmtree/homepage-hero`, so editors can change approved content fields
  without free-form page-builder layout drift.
- Runtime bridge: `template-parts/main-home.php` renders the hero through the
  block renderer. If the configured static front page contains the pilot block,
  the theme reads that block's attributes; otherwise it renders approved default
  hero content.
- Content-model roadmap:
  `farmtree_core_target_content_architecture()` documents future Pages, CPTs,
  taxonomies, global settings, blocks, and editor locking without registering
  public content types prematurely.

The rest of the homepage and hash-routed inner sections remain in the legacy
PHP/JS shell until their own focused native-block or content-model sprints.

## Governance gates
FarmTree website changes follow six approval gates:

- Gate 1 - spec approval.
- Gate 2 - implementation approval.
- Gate 3 - push approval.
- Gate 4 - merge/release-candidate approval.
- Gate 5 - deployment approval.
- Gate 6 - WordPress publication/activation/database approval.

### FarmTree AI Assistant plugin (`wordpress/wp-content/plugins/farmtree-ai-assistant`)
Optional, **ships inactive**. A manageable AI assistant with an admin area
(Overview / Knowledge / Behavior / Skills / Settings), a server-side chat REST
endpoint, and a refactored front-end widget. Full detail: the plugin's
`README.md`.

- **Secret handling (non-negotiable).** The AI API key is read **only** from a
  server constant/env (`FARMTREE_AI_API_KEY`) via `FT_AI_Settings::get_api_key()`
  — never the DB, never the admin UI, never localized to the browser, never in a
  REST response, never logged. `is_provider_configured()` / `is_assistant_active()`
  gate every "active" claim; enabling the switch alone never fakes activity.
- **Provider adapter.** `FT_AI_Provider_Interface` + `…_OpenAI` (OpenAI-compatible
  Chat Completions) behind `FT_AI_Provider_Factory` (filterable
  `farmtree_ai_providers`). Provider calls are server-to-server only.
- **No fabricated answers.** With no provider configured, the REST endpoint
  (`POST /wp-json/farmtree-ai/v1/chat`) returns a structured `unavailable` error;
  it never invents a reply. Answers are grounded in approved **Knowledge**
  (lightweight keyword retrieval in `FT_AI_Retrieval`, capped context — not
  vector search), and `FT_AI_Behavior`'s always-on safe-fallback rule makes the
  model defer uncovered questions to the FarmTree team.
- **Knowledge scanner.** `FT_AI_Scanner` fetches a submitted public URL
  server-side with SSRF protection (rejects localhost/private/reserved IPs incl.
  the cloud metadata address, `wp_safe_remote_get` with size/redirect caps),
  extracts readable text only, and shows it for review before saving.
- **Data.** `dbDelta` tables (`wp_ft_ai_knowledge|skills|conversations|messages`)
  versioned by `ft_ai_db_version`; options `ft_ai_settings` / `ft_ai_behavior`.
  Five example **Skills** seed **disabled** (Platform → login URL, Demo → register
  URL). Conversation logging is opt-in and stores a one-way hashed IP only.
  `uninstall.php` preserves data unless the admin opted into removal.
- **Theme handoff.** `footer-chrome.php` renders the built-in static chatbot
  unless `apply_filters('farmtree_ai_plugin_active', false)` is true — the plugin
  returns true only when activated **and** configured, so the default (plugin
  absent/inactive) is unchanged.
- **Tests.** `node tests/verify.mjs` — runnable-now static gate asserting the
  secret/no-fake-AI invariants (96 checks); PHPUnit (`tests/test-plugin.php`) for
  runtime behavior in CI.
