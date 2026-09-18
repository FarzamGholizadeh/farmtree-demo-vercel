# FT-NATIVE-002 Sprint Report

Homepage publication approval (2026-09-18): ID 439 publication is intentional.
Source now expects publish for page.en.home without altering its approved content.
Production reconciliation and final public-launch gates remain to be verified.

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

Status: controlled Homepage and Team refinement implemented and locally
validated; stopped at pre-release for visual and publication approval

## Audited Release Preparation

The feature branch now produces a clean, checksummed native artifact from an
exhaustive allowlist instead of exposing the raw theme/plugin source trees.
Current classification is 85 runtime files and 114 exclusions, including all
raw content JSON, documentation, local QA/bootstrap data and unused media
derivatives. The manual-only workflow validates and transfers only that staged
artifact; it remains undispatched.

The protected runtime manifest and WP-CLI-only reconciler cover 40 English
private entities, six categories, 34 verified media assets and ten embedded
Team identities. Dry-run is the default;
apply is digest-, backup-, site-, theme-, protection- and confirmation-gated.
Stable ownership plus last-applied fingerprints preserve matching IDs and stop
on duplicates, foreign ownership, unowned near-matches, manual drift or changed
media. Non-loopback apply uses a locked `SERIALIZABLE` transaction and requires
a matching fresh plan plus a final idempotence postcondition. The command never
deletes unrelated content and never imports a local database. Earlier
disposable PHP 8.1 runtime tests proved a write-free `90/0/2/0/1` dry run,
private-only apply,
`92` unchanged managed operations after apply, and blocking foreign-owner and
manual-drift probes. A new focused disposable-runtime regression persisted and
replanned the exact 34-rule merge, proving unrelated rule/value/order and
option identity/autoload preservation without a global flush. See
`docs/FT-NATIVE-RELEASE-PREPARATION.md`.

The 0.4.2 release-safety correction removes all FarmTree
activation/deactivation hooks, encloses dry-run planning in a scoped SQL
read-only firewall, and replaces global CPT rewrite regeneration with an exact
APPLY-only FarmTree 34-rule merge. Existing unrelated rules, values and order
remain exact; runtime-only SeedProd and `sp-login` additions are neither owned
nor persisted by FarmTree. Ambiguous anchors, namespace collisions and route
shadowing stop. Disposable WordPress 7.1 / PHP 8.1 snapshots prove load/CLI
registration, model registration, construction, `build_plan`, dry-run,
activation and deactivation add no FarmTree-authored DB or filesystem write.
The corrected dry-run is `90/1/2/0/1`.

The 0.4.3 correction removes the Homepage postcondition's double application of
WordPress save filters. Planning canonicalizes valid URL/ID stand-ins and
restores stable tokens; APPLY sends raw expanded manifest fields through core
exactly once and independently verifies the resulting canonical state and all
six audit metadata values. The baseline failure is reproduced at
`page.en.home`; the corrected full disposable APPLY commits and its next plan
is `0/0/93/0/1`. Representative Homepage, Team, normal Page, Proof Story,
Customer Segment and News entities converge, while deliberate wrong state and
metadata still stop on their exact first field.

The 0.4.4 correction closes the remaining production-only postcondition gap.
A fresh-backup, rollback-protected `wp_insert_post()` trace on WordPress 7.1 /
PHP 8.3.31 / MariaDB `utf8mb3` reproduced the historical Homepage value exactly:
core `wp_encode_emoji()` converted seven `↗` characters to `&#x2197;` before
`wp_insert_post_data`, changing `46786 / 772277…` to `46821 / 0aed9f…`.
No plugin or theme callback caused the change. The reconciler now mirrors that
core charset step in its expected canonical database state; a focused
disposable regression proves the exact `+35` production representation, the
unchanged `utf8mb4` representation and a fully idempotent APPLY.

The 0.4.5 correction closes the subsequent production rewrite-finalization
gate. WordPress admin registers `update_home_siteurl()` on
`update_option_page_on_front`; production tracing proved that callback globally
replaced the reviewed 94-rule baseline with 147 generated rules inside the
transaction. APPLY now suppresses only that core callback for the one managed
front-page write, restores it in `finally`, and leaves the reconciler's exact
128-rule FarmTree-only target as the sole rewrite persistence path. The focused
WordPress 7.1 regression proves zero intermediate rewrite update, unchanged
rules and exact callback restoration.

The 0.4.6 correction addresses the final diagnostic-only mismatch proven by a
second rollback-protected production trace. With the global flush suppressed,
the raw 94-rule option, disclosed 128-rule target, merged rules, anchors and
every canonical/unrelated-rule field remained exact; only the non-persisted
`runtime_unrelated_rules_not_adopted` report changed because core generates a
different root-comment query after `page_on_front` changes. Finalization now
excludes only that diagnostic from equality and retains every write-safety
comparison. The focused regression proves the diagnostic drift, the sole
intended rewrite update and final exact convergence.

Automated static classification source-seals the complete four-file deployable
plugin runtime and pins every persistence API to the APPLY graph. A separate
66-fixture, no-whole-table-ignore comparator rejects incomplete captures,
accepts only proven cron/transient/theme-cache/update-check/expired-auto-draft
volatility and fails closed for release-critical options, content, ownership
metadata, taxonomies, media, users, roles and schema.

## Homepage Structure

The native Homepage now follows Hero, Platform, Technology, Track Record,
Global Perspective, Trust, Proof Stories, Last News, FAQ and Final CTA. It is implemented in
`farmtree-native` as core block markup and a content-only locked pattern.

## Homepage Finalization

The testimonial rail now starts from a geometry-derived middle composition
with Card 3 centred rather than exposing a zero-origin first frame and relying
on a negative time delay. A real production reload reproduced the previously
missed failure: the original sequence moved partly offscreen while decorative
clones and source cards outside the observer threshold retained
`ft-motion-target` at zero opacity, leaving most of the right side blank. The
fix removes reveal-state classes from all moving testimonial cards, explicitly
keeps clones visible, waits for font geometry and uses a content-sized,
non-shrinking track. It renders one semantic five-card sequence plus two inert,
`aria-hidden` visual copies on each side, travels exactly one measured sequence
over 46 seconds with linear timing, and preserves an uncloned scrollable
reduced-motion fallback. Focused Chrome QA at 320, 390, 768, 1024, 1440 and
1920 passed first-visible-frame and eight-phase visual-coverage checks, boundary
equivalence, clone visibility/accessibility, overflow and runtime-error checks.
Evidence is in `qa/screenshots/testimonial-marquee/`.

The finalization pass moves Hero controls to the true viewport-safe edge on
desktop/tablet while using a five-second loop and unified mobile swipe contract;
centres the four Technology connectors; makes all metrics equal-height and
overflow-safe; adds a lazy canvas globe framed explicitly as landscape context;
expands both trust rails to the full rendered viewport with seamless opposing
tracks; upgrades Proof Stories to linked image-overlay cards; renders the three
newest WordPress posts as one primary and two secondary editorial features; and
adds the premium real-404 recovery shell. Menu alignment, footer social optical
centering and the Wageningen OpenStreetMap destination are also verified.

Rendered QA at 320, 375, 390, 430, 768, 1024, 1280, 1440 and 1920 found and
corrected the trust-rail overflow and constrained Hero-control container. The
final matrix has no horizontal overflow or visible broken images. Browser logs
remain empty; the globe lazy-load, keyboard focus and pointer drag, FAQ, Hero,
trust-rail hover pause, footer rotation, menu and 404 recovery interactions
passed. Evidence is in `qa/screenshots/homepage-finalization/`.

The V2 polish adds staggered Hero copy/media motion, a bidirectional
scroll-driven Technology connector signal, a recognizable dotted-continent
Earth rendered by an isolated native canvas, a mid-stream logo rail, an
editor-owned six-item testimonial/portrait reel, four-up desktop Proof cards
with a restrained pointer spotlight, Last News before FAQ, liquid-glass article
buttons and paired Footer quote marks. The Globe uses 2,370 deterministic
landmask points and neutral landscape-context connections at a 0.0009
radians-per-frame default; COBE and external geography imagery are not used.

The full-screen Bento menu now captures scroll at the open intent, applies a
fixed-body lock, isolates the background with `inert`, traps focus, restores
the exact coordinate and trigger focus, and uses one shared top row for the
101px-wide logo artwork and close control. The 45-case matrix (five widths by
nine page positions) passed, including an exact isolated retest of the sole
smooth-scroll timing sample. Final evidence is in
`qa/screenshots/homepage-v2/`.

## Controlled Refinement Pass

The menu logo is now 86px wide, the overlay remains pinned to the viewport when
opened mid-page, and desktop/mobile checks reconfirmed inert background,
fixed-body scroll lock and exact scroll/focus restoration. Button hover states
retain color and shadow feedback without translating position. Technology card
connectors and their scripted signal were removed.

The globe now uses a self-hosted resized NASA Earth Observatory Blue Marble
texture, with the bundled ISC-licensed Natural Earth-derived 1:110m topology as
its no-network fallback. It keeps the lower shadow, 0.00135-radian rotation
rate, two-axis pointer/touch drag, four-arrow keyboard control, off-screen pause
and reduced-motion path while adding restrained animated orange routes. Partner
logos and five approved-source testimonials are dynamically duplicated to
cover the viewport with no empty loop gap; testimonials begin at an explicit
eight-second loop offset and use social-style cards with visibly disclosed
fictional portrait placeholders. The unapproved sixth placeholder is not
rendered.

The primary Hero retains its explicitly illustrative agroforestry-planning
image and the Impact Reporting slide now uses a new documentary field-
measurement illustration aligned to its message. The Platform GIF is precisely
clipped into a direct responsive 16:9 media frame. All four Proof Story cards
and detail entries use new theme-specific documentary illustrations, and the
distracting pointer spotlight/image movement was removed while the restrained
card-level interaction remains. News categories now use dark translucent chips
for reliable contrast over bright imagery; titles still change color without
underlining. Footer quotations remain balanced without hyphenation or visible
em dash characters.

The Team page now has an illustrative wide field-collaboration header with a
60% dark overlay, a 3/2/1-column responsive grid, nine requested entries and a
refined bottom LinkedIn action. The five named removals are absent. Maximilian
Michael Möller uses the supplied portrait and LinkedIn URL, the user-supported
Chief Growth Officer role and a conservative one-sentence FarmTree B.V. bio;
his card is ordered between Arnoud Braun and Frank van Schoubroeck.

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

## Legal Review Preparation

The final Privacy Policy and Terms & Conditions candidate copy is now compiled
from repository-only structured source into the private managed-content
manifest. Runtime claims were aligned to the 3 September 2026 production fact
audit; no registration number, VAT number, DPO, fixed retention period,
governing law or jurisdiction was added. The legal pages remain private and
were not written to production.

The Native release artifact now includes locally hosted Inter and Manrope Latin
variable WOFF2 files plus both OFL texts, and both the runtime and local preview
have no Google Fonts request. Exactly nine managed News entries declare
`comment_status=closed` as reconciled state. On production, a fresh database
backup was created outside the public webroot before the same nine owned,
private News rows were closed. Extendify Insights was stopped and unscheduled;
SeedProd's primary and UI usage-tracking flags were disabled. SeedProd Coming
Soon stayed active, `blog_public` stayed `0`, `noindex,nofollow` stayed active,
and no launch or legal publication occurred. The font artifact remains local
until a separate deployment approval.

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
- The local startup chain is restart-safe: it reuses a reachable loopback
  runtime instead of aborting on `EADDRINUSE`, always runs the fixture bootstrap,
  waits for the Playground session, and explicitly restores mounted plugin
  activation before the native theme and content fixtures. The reconstructed
  fresh database and a second occupied-port run both passed `wp:verify`; the
  anonymous audit again found 40 HTTP-200 English routes and 103 valid internal
  links.
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
- The approved baseline was pushed to the native-rebuild branch through
  `210ce51`; GitHub native validation and secret-scan runs `33525868829` and
  `33525869476` passed that exact source.
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
theme source. The sixth unapproved testimonial placeholder is excluded from
the rendered Homepage and remains documented only as a human sign-off item.
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

The Homepage V2 rendered rerun again covers 320, 375, 390, 430, 768, 1024,
1280, 1440 and 1920 without horizontal overflow, broken images or duplicate
IDs. It found one H1, eight FAQs, three Homepage News cards and one visible
testimonial quote at every width. Ordered keyboard-target checks covered 60
mobile and 64 desktop stops: every target was named, visible, outside hidden or
inert content and had the approved focus treatment. Hero autoplay/pause/manual
controls and mobile swipe, connector direction, Globe drag/keyboard/off-screen
pause, testimonial autoplay/pause/synchronization, Proof spotlight, FAQ toggle,
menu trap/Escape/scroll restoration and Footer quote structure passed.

The final coordinated Homepage/Team refinement rerun covered the same nine
widths with no horizontal overflow, broken images or duplicate IDs. At every
width it found one H1, four Proof cards, five original testimonial cards, three
News cards and eight FAQs; the Platform media remained clipped inside a direct
16:9 media frame. Browser warning/error logs were empty. Homepage and Team
semantic smoke checks found complete landmarks and named controls, no missing
image alt attributes, no positive tabindex values and no broken ARIA ID
references. Interaction checks confirmed Hero controls/live status, two-axis
Globe drag and arrow-key control, moving and hover-paused testimonial/logo
rails with at most the intended 16px item gap, a non-moving Proof image with
the spotlight removed, FAQ disclosure, visible focus treatment and dark
high-contrast News chips. Team rendered all nine real portraits with Max second
and no fallback portrait. Evidence and its index are in
`qa/screenshots/final-refinement/`.

The final fast patch preserves the exact approved Platform media while removing
the decorative device-shell markup and CSS. The testimonial rail now maintains
three sequences, more than twice the viewport coverage, inert/aria-hidden
clones and the existing eight-second offset; a 47.5-second rendered observation
crossed a complete loop with five visible cards and only the intended 16px gap.
The shared Footer CTA and its dead styles are removed on every template while
the Homepage final CTA remains; the unruled legal/social row now shares the
information-grid edges at a 24–25px rendered gap. Evidence is in
`qa/screenshots/final-fast-patch/`.

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
- Human visual/publication approval remains required for the generated Hero,
  Proof Story and testimonial placeholder imagery and the generated Team
  header. Maximilian Michael Möller's supplied portrait permission and exact
  Chief Growth Officer wording also require final public sign-off.

## Next Action

Complete the decision-only checklist in `PRE_RELEASE_HUMAN_SIGNOFF.md` and wait
for explicit user approval before any release or production action. A read-only
27 August recheck found GitHub run `32985108587` still `queued`, with zero jobs
and zero pending deployment approvals. Do not dispatch a replacement while it
remains non-terminal; before any future approved dispatch, recheck that it is
terminal or absent and has no jobs, deployments or pending approvals. Keep
Coming Soon and public noindex active and `farmtree-native` inactive in
production.

## Final Pre-publish Refinement

The current local source now contains the exact requested Technology copy,
shortened Global Perspective copy, 22 normalized globe locations with curated
animated routes, the “FarmTree Client” Trust heading, a seamless third-card
testimonial start, centered Proof Story heading and renamed Farm Value
Projection/Landscape Hydrology pages. The two former Proof Story paths redirect
permanently to their replacements. Germaine van Teeffelen is the tenth Team
member using the supplied 800 by 800 portrait, verified Interim Project Manager
role and conservative bio; the second desktop row is Germaine, Irene and
Betelehem. The approved GIF remains direct media and is clipped from the top
without distortion or a bottom empty strip.

Repository validation, the WordPress bootstrap verification and the 40-route
anonymous/noindex/internal-link audit pass. Browser checks at 320, 390, 768,
1440 and 1920 report zero horizontal overflow, broken images and duplicate IDs.
The globe loads all 22 locations and responds to ArrowRight with the approved
focus ring; the testimonial rail starts at card three, moves continuously,
keeps three sequences and gives inert clones zero tab stops. The only proven
runtime defect found during the pass was an eight-pixel Team-page full-bleed
overflow; its gutter calculation was corrected and retested to zero at 320,
390 and 1440. Evidence is in
`qa/screenshots/final-pre-publish-refinement/`.

Production remains untouched: no push, deployment, publication, activation,
Coming Soon change or noindex removal occurred. Human publication approval is
still required for claims/relationships, illustrative assets and both supplied
Team portraits/role wording.
