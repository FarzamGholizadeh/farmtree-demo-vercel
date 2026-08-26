# FarmTree Tasks

_Last updated: 2026-08-26_

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

Status: Local implementation and approved visual-parity correction complete;
runtime/browser validation pending.

The Frank-approved Homepage has been built in `farmtree-native` with core
blocks, content-only locked patterns and a read-only local preview sourced from
the real native Header/Footer and `theme.json`. The production visual language
is restored without changing the `farmtree` rollback theme. The current source
includes a one-H1/four-image Hero, approved Platform MP4/poster and screenshot
with explicit playback control, asset-backed brand-logo pattern, five-card Bento
menu, English-only disabled locale options and fail-closed quotation submit.
Scope, evidence and remaining browser/runtime checks are defined in
`CURRENT_SPRINT.md` and `SPRINT_REPORT.md`.

## Parallel Runtime Gate

### FT-NATIVE-001B - Private Production Runtime Validation

Status: Pushed source validated; runtime safeguards pending. PR #3 completed
the default-branch reconciliation at `3df2ae2`: the native workflow is active
and manual-only, and the superseded staging workflow is retired. Matching
recoverable files/database backup evidence and explicit public `noindex` remain
release gates. Independent Required Reviewer protection is a deferred
governance enhancement under the private/manual compensating release policy;
it does not block development or a later explicitly approved dispatch.

## Deferred Implementation Backlog

- FT-NATIVE-003 - Register content models, build the admin experience and add
  locale-aware routing; the current native shell is English-only with NL/DE
  disabled.
- FT-NATIVE-004 - Build real pages, navigation and clean WordPress routes.
- FT-NATIVE-005 - Migrate content, validate runtime and prepare cutover.
- FT-SEO-001 - Define SEO metadata, canonical, hreflang, sitemap, and robots ownership across WordPress core, theme, and SEO plugin.
- FT-WEB-004 - Define the production quotation endpoint, consent/privacy copy,
  spam controls, delivery verification and publication gate; the current modal
  intentionally sends no network request.
- FT-WP-005 - Add browser-based production verification checklist after an approved deployment.
