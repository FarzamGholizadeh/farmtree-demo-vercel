# Current FarmTree Sprint

## FT-NATIVE-002 - Native Homepage

Status: Homepage finalization implemented and locally validated; stopped at
pre-release for visual and publication approval

### Objective

Build the Frank-approved Homepage locally in the inactive `farmtree-native`
Block Theme using WordPress core blocks and locked patterns. Keep normal content
editable while preserving FarmTree's approved visual identity and structural
design controls.

### Final English Master Delivery

The final English experience now includes six-second Hero autoplay with true
viewport-edge desktop/tablet controls and a mobile swipe handler; centered
technology connectors; equal responsive glass metrics; a lazy, draggable
landscape-context globe; full-width opposing trust rails; premium 2x2 Proof
Stories; a three-item editorial News feature; and a branded real-404 recovery
page. It also retains interaction pause; the exact user-supplied 14.5-second
Platform GIF with a reduced-motion poster; ten distinct image-backed
customer-segment pages; 16 English support pages; a factual 13-person Team page;
a featured-story Blog with all nine source-attributed articles; a premium
Vacancies empty state; and the existing privacy-safe Contact/quotation
fallbacks.

For anonymous loopback QA only, the native Homepage, English pages, custom
entries and News posts are locally published. Nothing was published or
activated in production. The canonical sample post is non-public. English owns
`/`; `/nl/` and `/de/` remain unpublished 404s without hreflang. Coming Soon,
noindex/nofollow, production `farmtree` theme ownership and the rollback path
remain unchanged.

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
4. Track Record metrics
5. Global landscape-context globe
6. Trust / references / testimonials
7. Proof Stories / Themes
8. FAQ
9. News & Insights
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
  palette, section order, absence of timer-based slide autoplay and the explicit
  Platform video Play/Pause control.
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

The consolidated decision-only review package is
`PRE_RELEASE_HUMAN_SIGNOFF.md`.

### Production Approval Boundary

Do not dispatch another native workflow while run `32985108587` remains
non-terminal. Before any later explicitly approved dispatch, verify through the
GitHub APIs that the stale run is terminal or absent and that no jobs,
deployments or pending environment approvals exist. Keep Coming Soon and public
noindex active, and keep `farmtree-native` inactive.
