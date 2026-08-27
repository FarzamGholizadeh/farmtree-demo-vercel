# FT-NATIVE-002 Sprint Report

Status: Final English experience implemented and locally validated; stopped at
pre-release

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

The Platform module uses the exact supplied 14.5-second GIF byte-for-byte in
one media composition; the original remains under
`assets/media/source/platform/`. Reduced-motion visitors receive a static
poster extracted from that file. The obsolete video controls and decorative
technology-flow overlay are removed.

The selector is explicitly English-only: English owns `/`, while Nederlands
`/nl/` and Deutsch `/de/` are reserved but unpublished, unlinked and disabled.
The locale contract creates no routes or SEO alternates until approved
translations exist. The quotation dialog matches the approved shell, states
that online delivery is unavailable, collects no personal data and exposes
only the approved email fallback. There is no submit-success simulation,
placeholder endpoint, storage or logging path.

The final pre-release enhancement adds private-first customer-segment and Proof
Story models, 15 private English support pages, nine source-attributed editorial
drafts, the supplied Platform sequence, technology flow, counters, opposing
rails, a disabled Contact form with safe fallback, restrained motion/density
tuning, expanded discovery metadata and the configurable source-first FT Bot
plugin. Full evidence is in
`docs/FT-NATIVE-003-ENHANCEMENT-READINESS.md`.

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
- Final rendered QA exposed and corrected the missing Block Theme stylesheet
  enqueue, WordPress core Header spacing inflation, Hero control/call-to-action
  drift, Platform component geometry/media fit and normal-flow indicator strip,
  approved SVG chevrons/insets/hover feedback, Technology badge color,
  partner-logo wrapping, Footer breakpoint drift, menu cascade/nested-list
  overlap, hover sheen and 280 ms card easing, external navigation rel values
  and deterministic component keyboard/focus contracts. The full matrix and
  interaction walkthrough were rerun after the corrections.
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
  save/reload persistence, revision history, private status and all 19 rendered theme
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

## Final English Experience Evidence

The final loopback QA runtime contains one locally published Homepage, ten
segment entries, four Proof Stories, 16 English support pages and nine News
articles so anonymous rendering can be tested. The exact canonical sample post
is non-public. All 40 intended English routes resolve anonymously; `/nl/` and
`/de/` remain 404. Production content and activation were not changed.
Contact fields are disabled until an approved backend/privacy design exists,
with no endpoint, fake success, transmission, storage or logging. FT Bot is
invisible until configured with a valid server-side provider.

Five testimonials and the four counter values match the approved production
theme source. The sixth testimonial remains explicitly labelled unapproved.
Logo relationships, testimonial permissions, metric currency, proof/editorial
claims, legal copy, Contact delivery and FT Bot provider configuration remain
human publication gates.

## Preview And Screenshots

The corrected static preview and the real local WordPress runtime are both
available without changing production WordPress state. The in-app browser
captured the real WordPress frontend at 320, 375, 390, 430, 768, 1024, 1280,
1440 and 1920 pixels. Final full-page, mobile/desktop section, contact and
interaction evidence is stored in `qa/screenshots/final-english-experience/`.
All nine widths reported zero document overflow with one H1, four Proof cards,
eight FAQs and four Homepage News cards. The Blog, Team, Vacancies, segment and
News detail captures also reported zero overflow and no console warning/error.

The final browser walkthrough found no console errors or warnings. It verified
Hero navigation/live status, FAQ disclosure, focus treatment, full-bleed
segment imagery, lazy-media loading and the email-only unavailable state.
Rendered semantic audits at 390 and 1440 found one H1, complete landmarks and
no heading jumps, duplicate IDs, missing alt text, unnamed controls, positive
tabindex values, insecure external targets or broken ARIA references. Contrast
checks covered 94 mobile and 96 desktop opaque-surface text nodes without a
failure. Reduced-motion emulation confirmed that motion remains paused until
explicit input. Native Chrome key events completed sequential forward-Tab
walkthroughs at 390 and 1440 pixels, including the whole page and dialog
forward/reverse focus containment. A Chrome accessibility-tree screen-reader
smoke test found one banner, one main, one contentinfo, four navigation regions,
26 headings and no ignored focusable node. The sequential Tab pass covered 34
unique stops and every stop exposed a visible focus indicator. The detailed
performance sample recorded 1,186,225 transferred bytes across 21 resources,
FCP 1,092 ms, LCP 1,160 ms, CLS 0.00284 and zero long tasks.

The bootstrap now drafts only the exact canonical WordPress `Hello world!`
sample fingerprint and never deletes or changes unrelated posts. The visitor
News section therefore exposes its approved empty state until real posts are
published. The four-slide native Hero, English-only selector and updated
Frank-approved copy/IA are intentional product differences inside the approved
visual language.

## Runtime Safety

This rendered-QA pass did not dispatch a workflow, deploy, change production
theme/plugin activation, publish content, change Coming Soon or modify the
production database.
FT-NATIVE-001B is temporarily blocked by the orphaned GitHub Actions run.
Required Reviewer protection does not block the current private/manual
compensating release policy.

## Production/Publication Validation Still Required

- Production recognition while both native components remain inactive and any
  later approved temporary production activation remain separately gated.
- A real screen-reader listening walkthrough remains a human publication check;
  Chrome's accessibility-tree smoke test passed in the available environment.
- NL/DE translations and public routes remain unpublished. Their reserved path
  contract is complete and deliberately creates no incomplete locale output.
- Human approval is required for the email-only quotation fallback; an online
  backend remains deferred if form delivery is required.
- Human permission/relationship sign-off remains required for testimonial
  attribution, partner/reference logos and the working proof labels recorded in
  `docs/FT-NATIVE-002-PUBLICATION-EVIDENCE.md`.

## Next Action

Complete the decision-only checklist in `PRE_RELEASE_HUMAN_SIGNOFF.md` and wait
for explicit user approval before any release or production action. A read-only
27 August recheck found GitHub run `32985108587` still `queued`, with zero jobs
and zero pending deployment approvals. Do not dispatch a replacement while it
remains non-terminal; before any future approved dispatch, recheck that it is
terminal or absent and has no jobs, deployments or pending approvals. Keep
Coming Soon and public noindex active and `farmtree-native` inactive in
production.
