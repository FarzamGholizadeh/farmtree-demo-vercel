# FarmTree Tasks

_Last updated: 2026-08-27_

## Completed Governance Task

### FT-WEB-001 - Production-safe governance baseline

Status: committed and pushed to `origin/wordpress-integration`.

Scope:

- Fix the accidental first-character typo in root `index.html`.
- Create or standardize governance documentation.
- Align repository docs with `https://farmtree.eu/`, `wordpress-integration`, the FarmTree WordPress theme, FarmTree Core plugin, and FarmTree AI Assistant plugin.
- Add the six approval gates to project governance docs.
- Add a GitHub `production` environment boundary to the WordPress deployment workflow.
- Make the Vimexx SSH test workflow manual-only.

Out of scope:

- WordPress theme runtime behavior.
- Core plugin runtime behavior.
- AI Assistant plugin runtime behavior.
- Production WordPress content, database, theme activation, plugin activation, and host configuration changes.
- Pushes, merges, deployments, and GitHub Actions runs.

Acceptance:

- Required governance docs exist and are production-aligned.
- `index.html` typo is fixed with no other content changes.
- Deployment workflow requires production approval before SSH/rsync.
- SSH test workflow is manual-only.
- No forbidden files are changed.
- No secrets are introduced.

## Deferred Implementation Backlog

## Reference Sprint

### FT-WP-001 - Homepage Hero Gutenberg Pilot

Status: retained as architecture reference; no further expansion.

The pilot remains in the production theme until the isolated rebuild is stable.

## Active Sprint

### FT-NATIVE-002 - Native Homepage

Status: Local implementation, approved visual-parity correction, automated
regression, real local WordPress runtime validation and rendered browser QA
complete; stopped at pre-release.

The Frank-approved Homepage has been built in `farmtree-native` with core
blocks, content-only locked patterns and a read-only local preview sourced from
the real native Header/Footer and `theme.json`. The production visual language
is restored without changing the `farmtree` rollback theme. The current source
includes a one-H1/four-image Hero, approved GIF-equivalent Platform MP4/poster
with explicit playback control, asset-backed brand-logo pattern, five-card Bento
menu, English `/` plus reserved unpublished `/nl/` and `/de/` locale contracts,
and a no-PII email-only quotation unavailable state.
Scope, evidence and remaining production/publication gates are defined in
`CURRENT_SPRINT.md` and `SPRINT_REPORT.md`.

The isolated loopback-only WordPress Playground runtime recognizes the Block
Theme and plugin, persists the private Homepage and revision history, registers the
required templates/parts/patterns and renders its Query Loop and assets. The
local gate is complete: screenshots, console, sequential keyboard/focus,
Chrome accessibility-tree smoke testing, semantic accessibility, contrast,
interactions and overflow were reviewed at all nine
target widths. Release, production and final-content work remains explicitly
approval-gated or deferred as recorded in the sprint evidence.

### FT-NATIVE-003 - Publication-readiness enhancement

Status: Local private-first implementation and validation complete; stopped at
pre-release.

The controlled `customer_segment` and `proof_story` models, ten source-ordered
private segment entries, four private Proof Stories, 15 private English support
pages, nine editorial drafts, native templates, restrained motion, discovery
metadata, English-primary locale contract and enforced noindex gate are
complete locally. Evidence is recorded in
`docs/FT-NATIVE-003-ENHANCEMENT-READINESS.md`.

## Parallel Runtime Gate

### FT-NATIVE-001B - Private Production Runtime Validation

Status: Pushed source validated; runtime temporarily blocked by orphaned GitHub
Actions run `32985108587`. PR #3 completed
the default-branch reconciliation at `3df2ae2`: the native workflow is active
and manual-only, and the superseded staging workflow is retired. Matching
recoverable files/database backup evidence and explicit public `noindex` remain
release gates and are now verified. Independent Required Reviewer protection is
a deferred governance enhancement under the private/manual compensating
release policy; it does not block development or a later explicitly approved
dispatch.

## Deferred Implementation Backlog

- FT-NATIVE-003B - Expand the admin experience and publish locale-aware routing
  only after translated content is approved; `/` is English and `/nl/` plus
  `/de/` are currently reserved and unpublished.
- FT-NATIVE-004 - Human-review and publish the completed private English pages,
  navigation and clean routes only after the publication gates pass.
- FT-NATIVE-005 - Prepare an explicitly approved cutover after content,
  permission, legal, assistive-technology and runtime gates pass.
- FT-SEO-001 - Reconfirm production SEO-plugin ownership and sitemap behavior
  before activation; native descriptions, canonicals, Open Graph, schema and
  noindex controls are complete locally.
- FT-WEB-004 - Add and verify a privacy-reviewed production delivery backend
  only if online quotation submission is required. The current modal safely
  collects no data and offers the approved email fallback.
- FT-WP-005 - Add browser-based production verification checklist after an approved deployment.
