# Current FarmTree Sprint

## FT-NATIVE-002 - Native Homepage

Status: Visual-first implementation and real local WordPress validation
complete; browser-rendered evidence pending

### Objective

Build the Frank-approved Homepage locally in the inactive `farmtree-native`
Block Theme using WordPress core blocks and locked patterns. Keep normal content
editable while preserving FarmTree's approved visual identity and structural
design controls.

### Runtime Dependency

The native-rebuild branch is synchronized through `2f810ef`, including the
workflow-root correction and completed visual-parity source. GitHub native
validation run `32956292922` passed the earlier `897a991` source. Local commit
`416500a` then reconciled the runtime release-readiness evidence. PR #3 merged
the workflow-only reconciliation to `main` at `3df2ae2`: GitHub registers
`.github/workflows/deploy-wordpress-native.yml` as active and manual-only, the
superseded separate-staging workflow is absent, and the native workflow has
never run. The current visual-parity correction remains local pending a future
push approval.

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
4. Trust / references / testimonials
5. Proof Stories / Themes
6. FAQ
7. News & Insights
8. Final CTA

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

The Platform module uses the byte-identical approved MP4 and poster plus the
approved plot-definition screenshot in an editor-visible two-slide media
carousel. Arrow, dot and keyboard controls select the slides manually, and a
visible Play/Pause control lets the visitor stop or restart the footage. The
muted video pauses whenever its slide or document is not visible. With reduced
motion requested, it stays on the approved poster unless the visitor explicitly
presses Play.

The current selector is intentionally English-only: English is active and the
Nederlands and Deutsch options are visibly disabled. Locale-aware routing is
deferred to FT-NATIVE-003. The quotation dialog is present for visual parity,
but submit is intentionally unavailable and sends no network request until a
production endpoint, consent/privacy copy, delivery verification and the
publication gate are approved under FT-WEB-004.

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
  approved Hero/content constraints, Header/Footer contracts, core Image and
  Video serialization, semantic landmark ownership, manual-only Hero and
  Platform controls, responsive layout rules, focus treatment, workflow policy,
  JavaScript and CSS.
- A deterministic visual-baseline gate compares the native theme with the
  production `farmtree` source, including shared layout contracts and SHA-256
  equality for 17 approved brand, Hero, Platform, proof and partner assets. It
  found and corrected a two-pixel logo-height and Header-width drift.
- The isolated real WordPress runtime recognizes and locally activates
  `farmtree-native` as a Block Theme and activates `farmtree-content`. A private
  bootstrapped Homepage persists its registered pattern content and revision,
  renders exactly one H1 and a Query Loop, loads 18 referenced theme assets,
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
  palette, section order, absence of timer-based slide autoplay and the explicit
  Platform video Play/Pause control.
- The responsive CSS contract covers the requested 320, 375, 390, 430, 768,
  1024, 1280, 1440 and 1920 widths without page-level zoom, root transforms or
  overflow masking. Rendered scroll-width and screenshot evidence remains a
  browser-environment check because no connected in-app browser was available.
- Browser console, keyboard, axe, overflow and screenshot validation across all
  nine target widths remain pending because no supported in-app browser session
  is connected.
- A fresh preview process returned HTTP 200 with the expected
  `X-Robots-Tag: noindex, nofollow` header.
- GitHub run `32956292922` validated pushed commit `897a991` successfully.
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
- Rendered browser screenshots, browser-console, axe, keyboard and scroll-width
  validation: pending a supported in-app browser session.
- Locale-aware NL/DE routing and production quotation submission/privacy:
  deferred and intentionally unavailable in the current build.
- Partner evidence links, final theme labels, approved production media and
  final testimonials: pending later content validation before publication.

### Next Local Validation Action

Connect a supported in-app browser session, then run the rendered native
WordPress Homepage through 320, 375, 390, 430, 768, 1024, 1280, 1440 and 1920
pixel screenshots plus keyboard, axe, console and overflow checks.

### Production Approval Boundary

Do not dispatch another native workflow while run `32985108587` remains
non-terminal. Before any later explicitly approved dispatch, verify through the
GitHub APIs that the stale run is terminal or absent and that no jobs,
deployments or pending environment approvals exist. Keep Coming Soon and public
noindex active, and keep `farmtree-native` inactive.
