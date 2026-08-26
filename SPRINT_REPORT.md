# FT-NATIVE-002 Sprint Report

Status: Visual-first implementation and real local WordPress validation
complete; browser-rendered evidence pending

## Homepage Structure

The native Homepage now follows Hero, Platform, Technology, Trust, Proof
Stories, FAQ, News & Insights and Final CTA. It is implemented in
`farmtree-native` as core block markup and a content-only locked pattern.

## Visual Parity Correction

The approved public FarmTree frontend and existing production `farmtree` theme
are now the permanent visual source of truth. The native implementation restores
the fixed green Header, asset-backed brand-logo pill, approved Header actions
and five-card Bento menu; centered cinematic Hero with the approved positioning
statement and manual image controls; Manrope/Inter type system; exact green,
cream and gold palette; approved wide layout and section rhythm; media-first
Platform composition; warm Technology cards; light Trust/testimonial treatment;
2x2 Proof Stories; centered FAQ cards; rounded News cards; dark conversion CTA;
and the approved four-column Footer language.

The Hero is built from four editor-owned core Image slides rather than a Cover
block. Its manually selected states reuse one persistent editable primary H1;
three alternate editor-visible core-block sources provide the other approved
messages without adding frontend H1 elements.

The Platform module uses the byte-identical approved MP4 and poster plus the
approved plot-definition screenshot in an editor-visible two-slide carousel.
Arrows, dots and keyboard navigation select slides manually, and a visible
Play/Pause control lets the visitor stop or restart the footage. Playback is
muted and visibility-aware: it pauses whenever the video slide or document is
not visible. With reduced motion requested, it stays on the poster unless the
visitor explicitly presses Play.

The current selector is explicitly English-only, with Nederlands and Deutsch
shown disabled; locale routing is deferred to FT-NATIVE-003. The quotation
dialog matches the approved shell, but submit deliberately sends no network
request. A production endpoint, consent/privacy copy, delivery verification and
publication approval remain gated under FT-WEB-004.

The correction stays in the Block Theme architecture. It does not modify the
current production `farmtree` theme or restore the legacy SPA as the runtime.

## Frank Feedback Implemented

- Reframed Platform copy around project staff creating investment plans,
  comparing options and understanding future scenarios.
- Reframed Technology around planning, monitoring and reporting with climate,
  soil and species data connected into a science-based, multi-KPI business plan.
- Moved Trust above proof content and integrated testimonial/reference material.
- Replaced Homepage Use Cases with prominent working proof themes: Carbon, Farm
  Value Modelling, Cocoa Scenario Planning and Monitoring, and Water and
  Landscape Resilience Monitoring.
- Removed the large audience section, moved News lower, retained FAQ and CTA,
  and shortened the overall page.

## Editorial And Design Ownership

Editors can manage normal headings, copy, media, testimonials, proof content,
FAQs and CTA fields. WordPress posts supply News through a Query block. Pattern
content locking prevents structural movement/removal, while the theme owns
section order, layout, typography, spacing, brand tokens and responsive rules.

## Local Evidence

- Native foundation validation checks required files, JSON, valid block
  structure (including self-closing block comments), exact approved palette and
  typography, Homepage order, prohibited legacy sections, Header/Footer and CTA
  contracts, manual Hero behavior, editable content and content-only locks.
- Final source review aligned the core Image and Video markup with Gutenberg
  save serialization, removed duplicate header/footer landmark wrappers and
  added a two-tone focus indicator that remains visible on light and dark
  sections.
- Regression validation guards the single-H1/four-image Hero contract,
  approved Platform MP4/poster/screenshot contract, semantic template-part
  ownership and the focus treatment.
- The visual-first regression gate compares production and native theme source,
  checks the approved layout/token mappings and proves SHA-256 equality for 17
  shared logo, Hero, Platform, proof and partner assets. It exposed and fixed
  the native Header's width formula and two-pixel logo-height drift.
- `@wordpress/env` 11.14.0 now provides an isolated loopback-only WordPress
  Playground runtime at `http://localhost:8888` without Docker. The runtime is
  WordPress 7.1 on PHP 8.2 with SQLite; it mounts the native theme/plugin and the
  unchanged production theme as an inactive visual reference.
- The safety-scoped bootstrap refuses non-loopback hosts, activates
  `farmtree-native` only locally, creates a private Homepage from the registered
  native pattern and configures that private page as the local front page.
- Real WordPress integration verifies Block Theme and plugin recognition,
  Site/Page Editor HTTP 200, seven templates, three template parts, four native
  patterns, content-only locking, Query Loop rendering, exactly one H1,
  save/reload persistence, a revision, private status and all 18 rendered theme
  assets. The frontend is HTTP 200 with no rendered PHP warning or fatal.
- Workflow validation confirms that private deployment remains manual,
  inactive-code-only and guarded by backup, Coming Soon, noindex,
  `blog_public=0` and active-theme checks.
- `npm test` passes the agent system, native foundation, workflow safeguards,
  composed-preview regression, visual-baseline/runtime-safety regression,
  JavaScript syntax and native-theme CSS lint checks.
- `npm run preview:native` provides a read-only composed local Homepage preview
  using the real native Header/Footer and values derived from `theme.json`.
- The composed-preview gate confirms the current Frank-approved Hero and copy,
  one H1, real Header/Footer, exact section order, resolved PHP/block markup,
  referenced assets, manual controls, quotation fail-safe and explicit local
  noindex. A fresh served preview returned HTTP 200 with
  `X-Robots-Tag: noindex, nofollow`.
- The repository-local `$farmtree-autonomous-delivery` skill passes both the
  project validator and the Codex skill schema validator.
- Subsequent release-preparation checks verified the public Coming Soon response
  with explicit `X-Robots-Tag: noindex, nofollow`; Coming Soon remains active.
- The approved baseline commits were pushed to the native-rebuild branch through
  `2f810ef`; GitHub native validation run `32956292922` passed the earlier
  `897a991` source.
- PR #3 merged the workflow-only reconciliation to `main` at `3df2ae2`.
  GitHub registers `deploy-wordpress-native.yml` as active and manual-only with
  zero runs, and `deploy-wordpress-staging.yml` is absent from `main`.
- GitHub API verification found that the repository is private, only the owner
  has access, and `Production` has no rules. Required Reviewer protection is a
  deferred governance enhancement under the documented compensating
  manual-release policy; repository visibility, ownership and billing remain
  unchanged.
- Matching recoverable files and database backups were verified and downloaded
  locally before activation testing was considered. The deployment workflow
  retains its non-secret evidence reference and typed confirmation gates.
- GitHub Actions run `32985108587` remains orphaned in `queued`/null state with
  zero jobs and an unchanged update timestamp. No replacement run is permitted
  until that stale run is terminal or absent and the GitHub APIs show no jobs,
  deployments or pending environment approvals.
- Merging PR #3 caused `vercel[bot]` to create GitHub deployment record
  `6101732202`; its successful status points to the legacy/reference static
  project at a Vercel-authenticated `vercel.app` URL. It did not run the native
  Actions workflow or deploy to the WordPress runtime at `farmtree.eu`.
- Homepage foundation source commit: `c27da77`. The visual-parity correction is
  included through pushed commit `2f810ef`; this visual-first local-runtime pass
  remains local and has not been pushed.

## Preview And Screenshots

The corrected static preview and the real local WordPress runtime are both
available without changing production WordPress state. The in-app browser
reported that no browser session was available, so no new screenshots are
claimed. Responsive source contracts cover 320, 375, 390, 430, 768, 1024,
1280, 1440 and 1920 pixels, but rendered screenshots, console inspection,
scroll-width measurements, axe and keyboard walkthrough evidence remain pending
until a supported browser session is connected.

## Runtime Safety

This local completion pass did not dispatch a workflow, deploy, activate a
theme/plugin, publish content, change Coming Soon or modify the database.
FT-NATIVE-001B is temporarily blocked by the orphaned GitHub Actions run.
Required Reviewer protection does not block the current private/manual
compensating release policy.

## Runtime Validation Still Required

- Production recognition while both native components remain inactive and any
  later approved temporary production activation remain separately gated.
- Browser-console, video visibility/playback and responsive visual review at
  all nine target widths in the real local WordPress renderer.
- Keyboard, focus, reduced-motion and screen-reader checks in rendered
  WordPress.
- Locale-aware routing remains deferred to FT-NATIVE-003; the current Header is
  English-only and its NL/DE choices are disabled.
- Production quotation endpoint, consent/privacy copy and delivery verification
  remain deferred to FT-WEB-004; the current submit control sends no request.
- Final approved imagery, proof labels, testimonials and partner evidence before
  publication.

## Next Action

Connect a supported in-app browser session and validate the local native
WordPress Homepage at all nine target widths with screenshots, console,
overflow, axe, keyboard and reduced-motion checks. Do not dispatch a replacement
production workflow while GitHub run `32985108587` remains non-terminal; before
any future approved dispatch, recheck through the GitHub APIs that it is
terminal or absent and has no jobs, deployments or pending environment
approvals. Keep Coming Soon and public noindex active and `farmtree-native`
inactive in production.
