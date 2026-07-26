# FarmTree — WordPress integration

Custom classic WordPress theme (`farmtree`) and companion plugin (`farmtree-core`)
that reproduce the approved static FarmTree website
(repo root `index.html`, live reference <https://farmtree-demo-vercel.vercel.app/#home>)
with visual and functional parity, served from <https://farmtree.eu>.

This is **Phase 1 — visual parity + editorial groundwork**. The homepage renders
entirely from theme markup; no content is database-driven yet. The theme and
plugin are **inactive** until activated in wp-admin.

> No page builder (Elementor et al.) is used or required.

---

## Theme structure — `wp-content/themes/farmtree/`

```
style.css                 Theme header (metadata only; not enqueued)
theme.json                Editor palette / layout settings (block editor)
functions.php             Bootstrap: constants + require inc/*
header.php                <head> (migrated meta, fonts, JSON-LD) + top chrome
footer.php                footer chrome + wp_footer()
front-page.php            Homepage: <main> + template-parts/main-home
index.php                 Fallback: renders the same homepage document
inc/
  setup.php               Theme supports, menus, content width, front-page title
  enqueue.php             Ordered CSS + JS bundles, window.FT_ASSETS base
  template-tags.php       farmtree_asset() — resolves theme asset URLs
  helpers.php             farmtree_asset_exists()
template-parts/
  header-chrome.php       Site loader + header/nav + Bento mobile menu
  main-home.php           All homepage sections + in-page routes (#platform,
                          #case-studies, #segment-*)
  footer-chrome.php       Footer + contact-modal + AI-assistant chrome
assets/
  css/  base.css components.css pages.css responsive.css   (ordered cascade)
  js/   farmtree-head.js  farmtree-app.js
  <images / media / brand / base-technology / favicons>    (production assets)
```

### CSS
The 64 inline `<style>` blocks from `index.html` were extracted **in source
order** and split into four ordered segments (`base → components → pages →
responsive`). They are enqueued via a dependency chain so WordPress always
prints them in the original order — preserving every specificity / `!important`
tie in the original cascade. **The files are ordered segments, not independent
concerns; do not reorder them.**

### JavaScript
The 45 inline scripts were extracted **in execution order** into two bundles:

- **`farmtree-head.js`** — the CTA capture listener + the early hash router.
  Enqueued in `<head>`; both defer real DOM work to `DOMContentLoaded`, so head
  loading preserves the original timing.
- **`farmtree-app.js`** — every in-body script (self-contained IIFEs) in order,
  enqueued in the footer.

No jQuery. `window.FT_ASSETS` (the theme `assets/` URL, from
`get_theme_file_uri`) is injected immediately before `farmtree-app.js`; markup
that scripts build at runtime resolves asset URLs against the theme, not the
site root. Bundles are ordered; do not reorder.

### Asset URLs
Nothing hard-codes `assets/…` (which would resolve against the site root) or a
filesystem path. Markup uses `farmtree_asset('path')` (→ escaped
`get_theme_file_uri`); JS uses `window.FT_ASSETS`; CSS uses `url(../…)` relative
to `assets/css/`.

---

## Plugin structure — `wp-content/plugins/farmtree-core/`

```
farmtree-core.php            Bootstrap + safe activation/deactivation
includes/content-models.php  Documented roadmap of future editable models
                             (registers NOTHING public yet — foundations only)
```

Phase 1 registers **no public post types**: the homepage is fully rendered by
the theme, so empty content types would only add non-functional admin UI and
risk showing empty queries where approved content should be. The agreed future
models are published as data via `farmtree_core_planned_content_models()`.

---

## What is controlled by code (now) vs WordPress Admin (later)

| Now — in code (theme)                                  | Later — WordPress Admin                    |
|--------------------------------------------------------|--------------------------------------------|
| All homepage sections, copy, layout, animation         | News, Case Studies, Testimonials, Team     |
| Hash routes (#platform, #case-studies, #segment-*)     | Vacancies, Customer Segments, FAQ, Videos  |
| External CTA destinations (Login / Register)           | Menus (locations already registered)       |
| Media slider + video lifecycle, loader, AI assistant   | Site title / tagline, front-page selection |
| Colours, typography, responsive rules                  | Search-engine visibility (robots)          |

See `includes/content-models.php` for the full future content-model plan.

---

## Local development

There is **no build step in production** — the theme ships the extracted files
directly. The one-off extraction from `index.html` was performed by a
deterministic script (kept out of the repo). To iterate:

1. Edit template parts / CSS / JS under `wp-content/themes/farmtree/`.
2. Preview without a full WordPress install by rendering the template parts to a
   standalone HTML file (resolve `farmtree_asset('x')` → `assets/x`, set
   `window.FT_ASSETS = "assets"`, link the four CSS files in order and the two
   JS bundles) served from the theme root. This is how parity was verified
   (zero 404s, routing, slider/video, menu, FAQ, all breakpoints 320–1920).
3. For a real WordPress check, symlink the theme + plugin into a local WP 6.6+
   install (PHP 8.1+), activate both, set Settings → Reading → front page.

`php -l` is run in CI on every push (see below); run it locally if PHP is
available before pushing.

---

## GitHub Actions deployment path

`.github/workflows/deploy-wordpress.yml` deploys on push to
`wordpress-integration` (paths under the theme / plugin / workflow):

1. Validates required files exist.
2. Runs `php -l` on every theme + plugin PHP file.
3. `rsync -az --delete` the theme and plugin to the Vimexx host over SSH
   (host / user / path / key from repo secrets `VIMEXX_*`).

Because rsync uses `--delete`, the deployed directories mirror these exactly —
keep non-production files (previews, notes) out of the theme/plugin dirs.

---

## Activation procedure (in wp-admin, when approved)

1. Deploy the code (push, or manual upload) — do **not** activate automatically.
2. Appearance → Themes → activate **FarmTree**.
3. Plugins → activate **FarmTree Core**.
4. Settings → Reading → *Your homepage displays* → a static page, or leave on
   posts (the fallback `index.php` also renders the homepage document).
5. Settings → Reading → set *Search engine visibility* as desired (indexing is
   **not** hard-coded in the theme).
6. Settings → General → set Site Title (the front-page `<title>` is provided by
   the theme via WordPress' title system).

## Rollback procedure

- Theme: Appearance → Themes → activate the previous theme. The FarmTree theme
  makes no database changes, so deactivation is clean.
- Plugin: Plugins → deactivate **FarmTree Core** (activation only flushes
  rewrite rules; deactivation flushes them again — no data is created).
- Code: `git revert` the relevant commit(s) on `wordpress-integration`; the next
  push redeploys the reverted state.

---

## Remaining blockers

- **Forms (endpoint not yet configured)** — the contact-modal / request / chat
  forms keep the approved UI and modal layout. Until `window.FT_FORM_ENDPOINT`
  is set to a real endpoint (it still holds the `YOUR_FORM_ID` placeholder),
  `ftSubmitLead()` rejects **before any network request** — no data leaves the
  browser, no invented endpoint/recipient is contacted, no fake success is
  shown, and the user's input is **not** cleared. Each surface shows a clear
  unavailable state: *"Form submission is not configured yet. Please contact
  FarmTree directly."* Go live by replacing `YOUR_FORM_ID` in one place
  (`inc`/`farmtree-app.js` `FT_FORM_ENDPOINT`) with a Formspree form, a
  WordPress REST route, or a CRM/Odoo webhook — no other change required. See
  FORMS.md at repo root.
- **Clean permalinks** — internal navigation stays hash-based this phase
  (`#segment-*`, `#case-studies`, …); path-based URLs are a later phase.
- **Editable content** — News / Case Studies / Testimonials / Team / Vacancies /
  Customer Segments / FAQ / Videos are documented but not yet registered.

*Resolved in the pre-push corrective pass:* the broken
`home-deep-roots-v11.png` reference (dead `setImage` calls targeting a
superseded `.section.cream .feature-image` element that no longer exists) was
removed from the app bundle and `index.html`; a router-safe skip link was added.

---

## Guarantees this phase

- No page-builder dependency; no jQuery; no external asset origins beyond Google
  Fonts (as in the approved site).
- Production page references **no** original 23.9 MB GIF, **no**
  `farmtree-demo-vercel.vercel.app`, and **no** hard-coded `noindex`.
- The official logo master is unchanged.
- The theme and plugin remain **inactive** until activated in wp-admin.
