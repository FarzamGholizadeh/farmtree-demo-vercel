# FarmTree Website — Architecture

_Last updated: 2026-07-15_

## Shape
Static single-document SPA (`index.html`, no build step) deployed on Vercel.
All CSS/JS inline (62 style / 43 script blocks); modular extraction is the
top deferred item (see RELEASE-CHECKLIST §F). Assets under `assets/`
(brand masters in `assets/brand/`, superseded audit evidence in
`assets/brand/superseded-opaque-source/`).

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
`window.FT_FORM_ENDPOINT` (Formspree placeholder — release blocker, see
FORMS.md). Honest error state when unconfigured; `_gotcha` honeypots;
no PII logging (zero console.* in codebase).

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
Staging: `noindex, nofollow` (RELEASE TOGGLE in head). Production domain:
`https://farmtree.earth/` (canonical/OG/JSON-LD; assets 404 until deploy —
sequencing item). Hash routes = one indexable document; segment pages are
not independently indexable. Future option (needs approval): path-based
URLs (e.g. `/segments/advisors`) via static per-route HTML shells or a
Vercel rewrite layer; benefit = independent indexing/sharing per segment,
risk = URL migration + duplicate-content management.
