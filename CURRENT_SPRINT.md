# Current FarmTree Sprint

## Live360 current handoff — 2026-09-19

Runtime candidate5104687 is locally validated but NOT pushed or deployed.
Execution review rejected the combined push/release before execution; explicit
approval is pending. Production remains66134c6. Read-only follow-up passes
46-route crawl and440 browser views; separate14-image decode and bounded rail
diagnosis found no persistent defect. Final-named report documents are provisional,
not programme completion. See state.json and FINAL-AUDIT-REPORT.md. This handoff
update changes documentation only; it does not supersede the runtime candidate.

## Live 360 programme — 2026-09-19

Verified live baseline: `6b01611b1d87edd8190b54f405beefddf33ebf27`.
Navigation cleanup is deployed. Native/Content are active; English site public,
indexing enabled, Coming Soon OFF and FT Bot OFF. Older entries retain their
historical checkpoint context. Thirty independent AI role perspectives are in
`docs/audit/live-360/assessments/`, not human research or certification.
The confirmed production P1 prose-link distinction issue is resolved in the
first guarded release. Motion/accessibility and animation delivery are under
local remediation. Progress and fixed acceptance are in
`docs/audit/live-360/state.json` and `docs/audit/live-360/ACCEPTANCE.md`.

First Live360 theme batch `a23441ba6f72d120f8bd2aac5ada0adcf3bb8546` is now
deployed with fresh verified rollback backup. Production release-specific
navigation/CTA/LCP/prose/metadata/header suite passes; indexing/public-state and
plugin/legacy hashes preserved. Prose distinction and News image reservation
findings are closed within their tested scope. Motion controls are the next
local batch; remaining content, performance and manual/organisational evidence
are not declared complete.

Resume checkpoint: local motion and exact-asset GIF viewport deferral pass core
tests, isolated WordPress scope checks and anonymous40route/104link validation.
Final browser rerun passes, including66representative views and six-width
testimonial regression. Blog-only medium responsive candidates pass six cold
selection/geometry contexts; full core/WP/anonymous checks pass again.
Fresh public crawl passes46routes/46internal
destinations. Cold production lab baseline exposes three failed route/viewport
groups (Homepage mobile incomplete load, Homepage desktop late LCP, Blog mobile
LCP); remediation evidence is in PERFORMANCE-MATRIX.md and RELEASE-02.md.
Remediation commit `ce4cdcc` is pushed and artifact-audited. Its first deployment
stopped before active replacement because host Bash process substitution could
not open `/dev/fd/62`. Active217-file baseline is unchanged. Runner-only
regular-file lint correction is tested and committed as `66134c6`. Its exact
artifact is now deployed with fresh verified backup,250-file parity and public
state preserved. Production motion/media and release-specific aggregate browser
checks pass, including six-width testimonial regression. Cold performance and
expanded all-route/text-spacing QA continue. See RELEASE-02.md.

## Live360 accessibility follow-up — local, 2026-09-19

Latest local Live360 follow-up: globe single-pointer direction controls and
metric text-spacing containment are validated candidates; production remains
66134c6. Release03 evidence records independent test review and corrected
comparison methodology. Two findings remain open until production retest.

## Mobile pointer verification — local, 2026-09-19

The earlier 320px timeout was a Puppeteer lifecycle-wait false negative, not a
blocked link. Destination URL/document/menu-state assertions replace that wait.
No theme, navigation content, styling or production changes are needed.

## Shared menu link cleanup — local, 2026-09-19

Explicitly approved removal of only For Investors / For Advisors from the
FARMTREE menu card, including mobile. All Customer Segments links and other
header bytes preserved. Footer, routing, content and public state untouched.

## Shared full-width pre-footer CTA — local, 2026-09-19

The shared Call To Action pattern now declares core `align: full` with matching
saved `alignfull` markup. This removes inner-template content-width boxing while
preserving the existing constrained inner content and Homepage appearance.
No per-page patches, copy, links, routing, SEO or production changes.

## Focused LCP loading correction — 2026-09-19

Approved baseline `48373210b7a337c396c93869c628dc9b56271647` is live.
Preserve WordPress loading/fetch priority for 16:9 primary featured images on
News and Proof templates; all other documentary loading behavior stays intact.
No content, asset, layout or public-state changes. See
`docs/FT-LCP-PRIORITY-FIX.md` for validation and the theme-only release gate.

## Authorized editorial post-launch release — 2026-09-19

Approved source `09ddf53098213e7e5a8cb51de57723f1fba0bc8e` pushed to the feature
branch. A separate exact-manifest editorial scope preserves the existing six-page
guard. Local scoped migration: 9 media creates / 23 owned updates / 0 conflicts,
then 102 unchanged; public-state rollback and ownership guards pass. Production
baseline read-only: 93 unchanged / 0 conflicts, indexing ON, Coming Soon OFF.
See `docs/FT-EDITORIAL-POST-LAUNCH-RELEASE.md`. Production APPLY/deployment and final
QA remain gated by fresh verified backups and the real scoped dry-run.

## Editorial/documentary refinement — local pre-release, 2026-09-18

Whole-site language review and approved photo placement implemented locally.
Homepage Clients heading/copy, four Proof cards/detail heroes, nine News images,
editorial headings and stale pre-release copy improved. Existing 132 image exports
reused; nine new managed attachment identities preserve 34 old media records.
Local migration: 9 creates/23 updates/0 conflicts, then 102 unchanged. No production
mutation or push. Public six-page APPLY guard deliberately remains unchanged and
rejects this broader release. See `docs/FT-EDITORIAL-IMAGE-AUDIT.md` for the exact
placement/copy audit and validation; broader audited release scope is required
before deployment, with public indexing and Coming Soon OFF preserved.

## Documentary release deployed — 2026-09-18

Explicitly approved SHA `47313843c47ef0e43dbdb80f0ec76dfd2dc2cff1` pushed and
deployed; all 217 runtime checksums match. Real post-launch dry-run: 6 updates,
87 unchanged, 0 conflicts, 1 skipped; zero database mutation across 23 tables.
APPLY committed exactly six Page bodies; final plan 93 unchanged, 0 updates,
0 conflicts, 1 skipped. Public indexing/Coming Soon OFF/active Native and Content
remain intact. Production QA passes 18 photo views and 72 asset URLs, plus 40
routes/55 internal destinations and testimonial regression. Performance remained
within good observed ranges but a strict no-regression claim is not established;
see the report. This evidence-only follow-up does not change deployed runtime.

## Post-launch image update path — 2026-09-18

Explicit chat approval pushed photo commit `51ba0f5e4d28b7ed43cd1f2fe692185438006624`
to the feature branch (previous remote `34771e782f3b3d2118567ecd42f4bbf54aa93121`).
Local Content 0.4.8 preparation adds an opt-in six-published-page body-only
profile preserving blog_public=1 and Coming Soon OFF. Default private gates
remain intact. See `docs/FT-POST-LAUNCH-CONTENT-UPDATES.md` for scope, evidence
and the approval-bound release sequence. This new runtime is not deployed;
production has not been accessed during this preparation task.

## Documentary photo integration — local pre-release, 2026-09-18

The supplied 20-photo set is mapped in `config/farmtree-documentary-images.json`
and `docs/FT-DOCUMENTARY-IMAGE-PLAN.md`. Exact upload numbering is retained;
the brief's mismatched descriptions after image 06 are corrected from the photos.
Eleven selected originals produce 132 metadata-stripped AVIF/WebP/JPEG variants.
Four existing Homepage slides and five contextual index/page placements use them.
All changes are local: this task grants no new push/deployment authorization.
Core Image content remains editable; typography, layout, hero motion, individual
stories, legal copy, team portraits and Platform demonstration are preserved.
Source release classification: 217 runtime files, 114 exclusions. Existing
production launch acceptance below is historical and unchanged by this task.

## Public launch accepted — 2026-09-18

Runtime release `7185c9b58b1d0f5f50f774b6cd2d97e042051e6f` is deployed:
85/85 runtime file checksums match, feature branch pushed. Homepage 439 remains
published/front-page with approved content SHA256
`943e84923f6699085fe06d4c24448fa0b0e60fe27a54be35f9085df5a9707962`.
All 40 intended English entities are public; Coming Soon is off, blog_public=1,
release noindex header removed, NL/DE absent, FT Bot off, News comments closed.
Final production dry-run: create=0, update=0, unchanged=93, conflict=0, skipped=1.
Anonymous acceptance: 40 routes, 55 internal destinations, 36 responsive page
checks, zero failures. Homepage accessibility/interaction QA passes nine widths;
globe keyboard/drag pass. Left-to-right testimonial coverage/boundary tests pass
320/390/768/1024/1440/1920. Robots and sitemap are public and correct.
External Platform/company LinkedIn/YouTube/map destinations respond; individual
LinkedIn profile automation is blocked by provider HTTP 999 (not verified).
Evidence: ignored qa/screenshots/public-launch*, final backups remain off-webroot.
The historical preparation entries below are superseded by this accepted state.

Launch QA continuation: protected APPLY completed and was idempotent (93
unchanged, zero conflicts). All 40 approved English entities were published
without body/title/slug changes. Source now preserves all 40 published statuses.
Anonymous QA found the host uses post-name News permalinks; narrowly scoped dated
managed-News redirects preserve existing approved links without rewriting content.
Reduced-motion testimonials now support keyboard scrolling; the Platform GIF
uses its existing still poster for reduced motion. Final production QA pending.

Homepage publication approval (2026-09-18): production ID 439 intentionally
remains public/published. The manifest and reconciler now require publish for
page.en.home only; all other protected-review entity expectations remain private.
The exact approved Homepage block content and existing front-page identity are preserved.

Public launch preparation (2026-09-18): explicit launch authorization supersedes
historical private-release gates. Source now uses left-to-right testimonial
travel, an intentional mailto-only Contact CTA and production indexing governed
by blog_public, with permanent loopback noindex. Approved legal source is unchanged.
Local direction/coverage and WordPress checks pass. The user approved Frank's
production edits on Homepage 439 and Proof Story 460 as authoritative:
“Farm Valuation” and the saved block structure are synchronized to source;
the existing farm-value-projection URL remains unchanged. Fingerprint adoption
is limited to these exact approved snapshots. Fresh off-webroot database/runtime
recovery backups are verified; the authorized launch workflow continues after
conflict-free reconciliation and validation.

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
artifact: 85 intended runtime files are staged and 114 repository-only,
development or obsolete files are excluded. Raw content JSON is compiled into
an `ABSPATH`-guarded PHP manifest and never shipped as public data.

The `farmtree-content` 0.4.7 plugin exposes a WP-CLI-only reconciler that defaults to
JSON dry-run. It manages 40 English content entities, six categories and 34
media assets by stable key, type/taxonomy, slug and canonical fingerprints.
Exact unowned matches may be adopted in place; ambiguity, foreign ownership,
duplicate identity, manual drift and media-binary drift are conflicts. It has
no delete, blanket-import, activation, Coming Soon, robots or infrastructure
mutation path. `/nl/` and `/de/` remain reserved and unpublished.

The 0.4.7 legal-review preparation adds fact-audited, still-private Privacy
Policy and Terms & Conditions source; makes closed comments part of the stable
managed state for exactly the nine News posts; and self-hosts the Inter and
Manrope Latin variable fonts with their OFL license texts. The theme and local
preview contain no Google Fonts request. Production settings cleanup was
preceded by a fresh off-webroot database backup: Extendify Insights scheduling
is stopped, SeedProd usage telemetry is disabled, all nine owned private News
posts have closed comments, and Coming Soon plus `blog_public=0` and the
`noindex,nofollow` response remain unchanged. No legal page was published and
the self-hosted-font artifact was not deployed.

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

The 0.4.6 correction narrows finalization equality for the one value production
proved is runtime-only: `page_on_front` changes core's generated root-comment
diagnostic even when the raw option, 128-rule target, anchors, canonical rules
and all unrelated persisted rules remain byte-identical. Only
`runtime_unrelated_rules_not_adopted` is excluded from the comparison; it is
never persisted or adopted. Every release-critical field remains exact.

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
five-card social testimonial marquee with a measured Card 3-centred initial
composition, symmetric inert clone sequences and an exact one-sequence loop;
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

Real production reload evidence reproduced the testimonial gap: the old
negative-delay animation positioned the sole semantic sequence partly
offscreen while appended clones and initially offscreen source cards inherited
an unfulfilled intersection-reveal state at `opacity: 0`. The corrected rail
removes that entrance-state ownership from every moving testimonial card,
uses an intrinsic non-shrinking five-sequence track and computes its initial
transform from the actual clipped viewport after fonts are ready. One original
five-card sequence remains semantic; two cloned sequences on each side are
`aria-hidden` and inert, and reduced-motion keeps the uncloned five-card
horizontal fallback. Browser checks at 320, 390, 768, 1024, 1440 and 1920 prove
continuous visual coverage at 0, 10, 25, 50, 75, 90, 99.9 and 99.9999 percent,
including a non-zero first visible transform and equivalent loop boundary,
with no duplicate IDs, focusable clones, console errors or body overflow.

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
