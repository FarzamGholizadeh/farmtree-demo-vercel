# Current FarmTree Sprint

## FT-NATIVE-002 - Native Homepage

Status: final pre-publish Homepage and Team refinement implemented and locally
validated; stopped at pre-release for visual and publication approval

### Objective

Build the Frank-approved Homepage locally in the inactive `farmtree-native`
Block Theme using WordPress core blocks and locked patterns. Keep normal content
editable while preserving FarmTree's approved visual identity and structural
design controls.

### Audited Release Preparation

The native release candidate now has a separate production-safety layer. The
deployment workflow builds an exhaustive allowlisted `.release/wordpress`
artifact: 81 intended runtime files are staged and 114 repository-only,
development or obsolete files are excluded. Raw content JSON is compiled into
an `ABSPATH`-guarded PHP manifest and never shipped as public data.

The `farmtree-content` 0.4.5 plugin exposes a WP-CLI-only reconciler that defaults to
JSON dry-run. It manages 40 English content entities, six categories and 34
media assets by stable key, type/taxonomy, slug and canonical fingerprints.
Exact unowned matches may be adopted in place; ambiguity, foreign ownership,
duplicate identity, manual drift and media-binary drift are conflicts. It has
no delete, blanket-import, activation, Coming Soon, robots or infrastructure
mutation path. `/nl/` and `/de/` remain reserved and unpublished.

All FarmTree lifecycle hooks were removed, so load, command registration,
construction, dry-run, activation and deactivation add no persistent write.
CPT rewrite persistence is one disclosed FarmTree-only 34-rule merge reachable
only after the fully gated APPLY reconciliation. It preserves the raw stored
unrelated rule map and ordering, rejects ambiguous anchors and route shadowing,
never performs a global rewrite flush, and cannot write `.htaccess` or
`web.config`. Dry-run planning is enclosed by a scoped final-query SQL firewall
that allows reads and blocks any modifying SQL before database execution.

Local WordPress 7.1 / PHP 8.1 evidence proves the corrected dry run was
write-free and reported 90 creates, one disclosed rewrite update, two unchanged
reserved-locale checks and one skipped option. Full table/option/filesystem
snapshots prove the five non-apply phases have zero FarmTree-authored writes;
actual lifecycle changes were limited to core `active_plugins` bookkeeping.
The earlier local-only apply kept all 40 English entities private and converged
to 92 unchanged managed operations on its next dry run. The new focused
rewrite regression separately persisted the exact reviewed merge in the
disposable runtime, preserved option ID/autoload plus all unrelated rules and
order, and converged to `unchanged`; no production APPLY occurred.
Foreign ownership and manual drift each stopped as a single conflict. Full
design and evidence are in `docs/FT-NATIVE-RELEASE-PREPARATION.md`.

The 0.4.3 Homepage postcondition fix separates token-safe planning from the raw
write path: WordPress canonicalizes syntactically valid expanded values exactly
once, then the verifier restores stable tokens and checks every managed field
plus exact ownership/audit metadata. The regression reproduces the former
double-save-filter Homepage failure against `49976f0`, commits the corrected
full disposable APPLY, converges to 93 unchanged/one skipped, and proves wrong
content, identity and release metadata still fail.

The 0.4.4 production-charset correction mirrors WordPress 7.1's core
`wp_encode_emoji()` step when the posts table uses `utf8`/`utf8mb3`. A
rollback-protected production persistence trace proved that seven Homepage
`↗` characters become `&#x2197;` between `content_save_pre` and
`wp_insert_post_data`, exactly reproducing the historical `+35` bytes and
`0aed9f…` SHA-256. The trace rolled back with identical database, filesystem,
option and protection fingerprints. The focused PHP 8.3 regression proves the
exact production representation, the unchanged `utf8mb4` representation and
full APPLY idempotence.

The 0.4.5 release correction handles WordPress admin's automatic
`update_home_siteurl()` callback on `page_on_front`. A rollback-protected
production APPLY trace proved that core performed a global 147-rule flush
between the managed front-page write and the exact rewrite finalizer. The
reconciler now removes only that callback for its single managed option write,
restores it at the same priority in `finally`, and then persists the already
reviewed 128-rule target. A WordPress 7.1 regression proves the automatic
global flush is suppressed, the prior rule map stays exact and the callback is
restored.

The source-sealed static write-API audit pins every persistence API to the apply
graph. The fail-closed volatile-state comparator passes 66 fixtures without
ignoring any table and rejects incomplete snapshots: cron, expired transient,
theme-pattern TTL, plugin-update timestamp and old empty auto-draft changes
require exact semantic proof, while all release-critical configuration and
FarmTree content remain strict.

### Final English Master Delivery

The final English experience now includes five-second Hero autoplay with calm
staggered copy/media transitions, true viewport-edge desktop/tablet controls,
a new illustrative field-planning Hero, a documentary Impact Reporting slide
and a unified mobile pointer-swipe handler; the approved Platform GIF in a
direct, rounded 16:9 core-Image frame; connector-free Technology cards; equal
responsive glass metrics; a lazy, two-axis draggable realistic Earth using a
self-hosted NASA
Blue Marble texture with a Natural Earth fallback; seamless partner and
five-card social testimonial marquees with an eight-second initial offset;
responsive 4-up/2-up/1-up Proof Stories with four new theme-specific
documentary illustrations; a three-item editorial Last News feature before
FAQ; and a branded real-404 recovery page. It also retains interaction pause;
the exact user-supplied 14.5-second Platform GIF with a reduced-motion poster;
ten distinct image-backed customer-segment pages; 16 English support pages; a
ten-person Team page with a 60% overlaid illustrative field header, the
user-supplied Maximilian Michael Möller portrait/role card ordered between
Arnoud and Frank, and the user-supplied Germaine van Teeffelen portrait with
the verified Interim Project Manager role at the start of the second desktop
row; a featured-story Blog with all nine
source-attributed articles; a premium Vacancies empty state; and the existing
privacy-safe Contact/quotation fallbacks.

For anonymous loopback QA only, the native Homepage, English pages, custom
entries and News posts are locally published. Nothing was published or
activated in production. The canonical sample post is non-public. English owns
`/`; `/nl/` and `/de/` remain unpublished 404s without hreflang. Coming Soon,
noindex/nofollow, production `farmtree` theme ownership and the rollback path
remain unchanged.

### Runtime Dependency

The approved native-rebuild baseline is pushed through `210ce51`, including
the final Homepage/Team refinement. GitHub native validation and secret-scan
runs `33525868829` and `33525869476` passed that exact baseline. PR #3 merged
the workflow-only reconciliation to `main` at `3df2ae2`: GitHub registers
`.github/workflows/deploy-wordpress-native.yml` as active and manual-only, the
superseded separate-staging workflow is absent, and the native workflow has
never run. The audited release-preparation change remains a separate
feature-branch release candidate until its own validation and approval.

The matching recoverable files/database backups are verified locally, and the
public Coming Soon response has an explicit `X-Robots-Tag: noindex, nofollow`.
Production runtime validation is temporarily blocked by GitHub Actions run
`32985108587`, which remains in an orphaned `queued`/null state with zero jobs.
It no longer blocks local WordPress validation: the repository now runs an
isolated WordPress 7.1 / PHP 8.2 Playground instance with SQLite at loopback
only. Independent GitHub Environment Required Reviewer protection is a deferred
governance enhancement for this private repository. The compensating release
boundary keeps all WordPress production workflows manual-only and requires
explicit user approval before dispatch.

### Implemented Homepage

1. Hero / positioning
2. Platform / planning value
3. Technology / how FarmTree works
4. Track Record metrics
5. Global landscape-context globe
6. Trust / references / testimonials
7. Proof Stories / Themes
8. Last News
9. FAQ
10. Final CTA

The large audience section and Homepage Use Cases are omitted. News is lower,
trust appears before proof stories, and the page is materially shorter than the
legacy concept.

The dedicated visual-parity correction restores the approved production
theme's fixed green Header, asset-backed brand-logo pill, five-card Bento menu,
cinematic centered Hero, manual image navigation, green/cream/gold palette,
typography, wide section rhythm, media-first Platform composition, light Trust
cards, 2x2 Proof Stories, centered FAQ cards, rounded News cards, dark Final CTA
and four-column Footer. These are visual corrections inside the approved
content architecture, not a return to the legacy SPA implementation.

The Hero uses four editor-owned core Image slides, not a Cover block. One
persistent, editable primary H1 and its supporting copy remain in the rendered
Hero; three alternate editor-visible core-block message sources supply the
other manually selected states without introducing additional H1 elements.

The Platform module now uses the exact supplied GIF byte-for-byte in one media
composition. The source is preserved under `assets/media/source/platform/` and
the theme copy has the same SHA-256 digest. A static extracted poster replaces
the animated GIF when reduced motion is requested.

The current selector is intentionally English-only: English owns `/`, while
Nederlands `/nl/` and Deutsch `/de/` are reserved but unpublished, unlinked and
visibly disabled. The side-effect-free locale contract creates no rewrites,
pages, alternates or sitemap entries before approved translations exist. The
quotation dialog now states up front that online delivery is unavailable,
collects no personal data and offers only the approved
`info@farmtree.earth` email fallback. It contains no fake success path,
placeholder endpoint or client-side logging.

The publication-readiness enhancement evidence, private customer-segment and
Proof Story models, English page architecture, nine-draft editorial foundation,
optimized Platform delivery, discovery metadata and nine-width rendered QA are recorded in
`docs/FT-NATIVE-003-ENHANCEMENT-READINESS.md`.

### WordPress Ownership

- Editors can change headings, body copy, media, testimonials, proof stories,
  FAQs and CTA content through core blocks in the Homepage page content.
- The Query block keeps News & Insights dynamic from WordPress posts.
- Theme patterns lock movement/removal at the content-only level while allowing
  editorial fields to remain editable.
- Theme templates and `theme.json` own hierarchy, layout, typography, spacing,
  color tokens and responsive behavior.

### Available Validation

- Repository checks cover required native files, exact approved design tokens,
  valid block markup (including self-closing blocks), Homepage hierarchy,
  approved Hero/content constraints, Header/Footer contracts, the supplied GIF
  and responsive image serialization, semantic landmark ownership, Hero
  controls/swipe contracts, responsive layout rules, focus treatment, workflow
  policy, JavaScript and CSS.
- A deterministic visual-baseline gate compares the native theme with the
  production `farmtree` source, including shared layout contracts and SHA-256
  equality for 17 approved brand, Hero, Platform, proof and partner assets. It
  found and corrected a two-pixel logo-height and Header-width drift.
- The isolated real WordPress runtime recognizes and locally activates
  `farmtree-native` as a Block Theme and activates `farmtree-content`. A private
  bootstrapped Homepage persists its registered pattern content and revision history,
  renders exactly one H1 and a Query Loop, loads 19 referenced theme assets,
  and returns HTTP 200 from the Site Editor, Page Editor and frontend without
  rendered PHP warnings or fatals. WordPress registers all seven required
  templates, three template parts and four native patterns.
- A read-only local preview renderer composes the native header, Homepage block
  markup, dynamic-post placeholder and footer from the real native sources and
  `theme.json` tokens without WordPress or PHP. It includes explicit local
  `noindex,nofollow`, an `X-Robots-Tag: noindex, nofollow` response header and
  serves the manual interaction script.
- `npm test` now composes and validates that preview without opening a network
  listener. The gate checks current Frank-approved copy, one H1, exact native
  section order, resolved PHP/block markup, referenced assets, manual controls,
  the quotation fail-safe and both noindex signals.
- The preview at `http://127.0.0.1:4173/` returns HTTP 200 and source-level
  assertions confirm the approved Hero, one H1, real Header/Footer, exact core
  palette, final section order, five-second autoplay and the explicit
  reduced-motion behavior.
- The real local WordPress frontend was rendered and captured at 320, 375, 390,
  430, 768, 1024, 1280, 1440 and 1920 pixels. Every width reported
  `scrollWidth === innerWidth`; the only off-screen children belong to the
  intentionally contained horizontal partner-logo rail. Final screenshots are
  in `qa/screenshots/final-english-experience/`.
- The Homepage-finalization rerun corrected a 41px trust-rail overflow and the
  constrained Hero-control geometry found by rendered QA. All nine required
  widths now have zero horizontal overflow, full-viewport trust rails and
  far-edge arrows at 768px and above. Final evidence is in
  `qa/screenshots/homepage-finalization/`, including the menu, globe and 404.
- The controlled refinement rerun covers all nine target widths and verifies a
  self-hosted NASA Blue Marble Earth with a Natural Earth fallback at 0.00135
  radians per frame, two-axis pointer drag and four-arrow keyboard rotation;
  equal metric
  typography including `+1,000,000`; five publishable testimonial cards in a
  dynamically duplicated continuous rail; four-up desktop Proof Stories;
  three Last News cards; FAQ below News; and balanced Footer quotation copy.
  Representative Homepage, Team and scrolled-menu captures are in
  `qa/screenshots/refinement-pass/`. Menu geometry, fixed-body scroll lock,
  inert background, Escape/close behavior and exact scroll/focus restoration
  passed at desktop and mobile sizes.
- The final Homepage/Team refinement was rendered again at 320, 375, 390, 430,
  768, 1024, 1280, 1440 and 1920 pixels. Every width has one H1, four Proof
  cards, five original testimonial cards, three News cards, eight FAQs, no
  horizontal document overflow, no broken images, no duplicate IDs, no missing
  image alt attributes and no unnamed buttons. The Platform media remains a
  clipped 16:9 surface at every width. Hero controls/live status, two-axis Globe
  drag plus arrow keys, the eight-second testimonial offset, gap-free moving
  rails, FAQ disclosure, focus treatment, restrained Proof hover and News-chip
  contrast passed with an empty browser warning/error log. Evidence is in
  `qa/screenshots/final-refinement/`.
- The final fast patch removes the decorative Platform device shell, keeps the
  approved GIF and reduced-motion poster in an editor-visible 16:9 frame,
  guarantees three accessibility-neutral testimonial sequences with more than
  twice the viewport coverage, and removes only the repeated shared-Footer CTA.
  The Homepage final CTA remains. Footer legal/social content now follows the
  information grid without a separator at a measured 24–25px gap. Evidence is
  in `qa/screenshots/final-fast-patch/`.
- The final pre-publish refinement applies the three requested Technology copy
  changes, the shortened Global copy, 22 named Globe locations with lightweight
  routes, the “FarmTree Client” Trust heading, a third-card testimonial start,
  centered Proof heading, renamed Proof Story routes with 301 legacy mappings,
  the ten-card Team order and the tightly cropped approved Platform GIF. The
  requested 320, 390, 768, 1440 and 1920 browser widths have zero horizontal
  overflow, broken images and duplicate IDs. Evidence is in
  `qa/screenshots/final-pre-publish-refinement/`.
- Browser error/warning logs were empty after the interaction walkthrough.
  Rendered semantic audits at 390 and 1440 found one H1, complete
  Header/Main/Footer landmarks, no heading-level jumps, duplicate IDs, missing
  image alt text, unnamed controls, positive tabindex values, insecure external
  targets or broken ARIA ID references. Opaque-surface contrast checks covered
  94 mobile and 96 desktop text nodes with no failures.
- Native Chrome key events completed sequential forward-Tab walkthroughs at
  390 and 1440 pixels. The sequence reached every enabled header, carousel,
  FAQ, CTA and footer control, skipped disabled locale choices, showed focus,
  and wrapped without trapping. Dialog forward/reverse Tab containment, Escape
  and trigger-focus return also passed. A Chrome accessibility-tree screen-reader
  smoke test found named landmarks, headings, controls, status and dialog
  content with no unnamed interactive elements. Reduced-motion emulation kept
  motion paused until explicit input.
- The local bootstrap drafts only the exact canonical WordPress sample post
  fingerprint (`Hello world!` / `hello-world` / canonical sample body), never
  deletes it, and leaves every unrelated post untouched. Verification rejects a
  published canonical sample and confirms `/nl/` and `/de/` remain 404.
- The local launcher now treats an already-running loopback Playground as a
  valid restart state instead of failing on port 8888 and skipping bootstrap.
  The bootstrap waits for auto-login readiness and explicitly restores the
  mounted `farmtree-content` and safe-disabled AI plugins before activating the
  native theme, so an ephemeral database reset reconstructs the complete QA
  state. A second `npm run wp:start` against the occupied port completed with
  unchanged fixture counts.
- The final anonymous route audit checked 40 intended English URLs with HTTP
  200, one H1 and noindex, plus 103 internal links with zero broken results.
  The loopback runtime locally publishes its QA fixtures only; production
  content remains unchanged.
- Current browser evidence is in
  `qa/screenshots/final-english-experience/`: nine full-page widths plus Blog,
  Team, Vacancies, segment, News-detail and focus-state captures. The local
  evidence README records the current route, interaction, semantic and
  reduced-motion checks.
- A fresh preview process returned HTTP 200 with the expected
  `X-Robots-Tag: noindex, nofollow` header.
- GitHub native validation and secret-scan runs `33525868829` and
  `33525869476` validated pushed baseline `210ce51` successfully.
- PR #3 merged the manual-only native workflow to `main` at `3df2ae2`; GitHub
  registers it as active with zero runs, and the staging workflow is retired.

### Production Boundary

- Do not deploy or trigger the private-runtime workflow.
- Do not activate `farmtree-native` or change plugin activation.
- Do not remove Coming Soon, publish content or modify the production database.
- Do not push or merge without explicit approval.
- Keep the current `farmtree` theme unchanged as the public rollback theme.

### Acceptance Status

- Local Homepage implementation, visual parity correction and automated
  repository/preview validation: complete to the available environment.
- Frank-approved structure and content direction: implemented.
- Core-block editability and locked design contract: verified from source.
- Real local WordPress editor/frontend recognition, save/reload, revisions,
  locking, Query Loop, asset and PHP-rendering checks: complete.
- Rendered browser screenshots, browser console, component keyboard/focus, responsive
  overflow, semantic accessibility, contrast, interaction and reduced-motion
  contract validation across all nine target widths: complete locally.
- English `/` ownership plus reserved, unpublished `/nl/` and `/de/` locale
  contracts: complete; translated pages and public locale routing remain later
  work.
- Quotation privacy/failure behavior: complete for the email-only fallback; an
  online submission backend remains intentionally unconfigured.
- Copy and claims are recorded in
  `docs/FT-NATIVE-002-PUBLICATION-EVIDENCE.md`; final human permission/relationship
  sign-off remains required for testimonial attribution, logos and working
  proof labels.

### Pre-release Status

Local publication-readiness implementation and available-environment validation
are complete. Stop at pre-release until the evidence/permission review and a
real assistive-technology listening pass receive human sign-off, and the user
explicitly approves a release step.

The generated Homepage Hero, Impact Reporting slide, four Proof Story images,
five fictional testimonial portrait placeholders and Team header are documented
as illustrative and are not represented as evidence or photographs of named
people. Testimonial cards disclose the illustrative portraits visibly. Human
visual/publication approval is required before those assets may be used
publicly. Maximilian Michael Möller's supplied portrait, LinkedIn URL and
user-confirmed Chief Growth Officer role are integrated with a conservative
one-sentence bio; public portrait permission and exact role wording remain a
human sign-off item. Germaine van Teeffelen's supplied portrait, LinkedIn URL
and screenshot-confirmed Interim Project Manager role are likewise integrated
with a conservative one-sentence bio; public portrait permission and exact
role wording remain a human sign-off item.

The consolidated decision-only review package is
`PRE_RELEASE_HUMAN_SIGNOFF.md`.

### Production Approval Boundary

Do not dispatch another native workflow while run `32985108587` remains
non-terminal. Before any later explicitly approved dispatch, verify through the
GitHub APIs that the stale run is terminal or absent and that no jobs,
deployments or pending environment approvals exist. Keep Coming Soon and public
noindex active, and keep `farmtree-native` inactive.
