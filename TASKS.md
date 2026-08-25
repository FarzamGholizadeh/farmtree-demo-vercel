# FarmTree Tasks

_Last updated: 2026-08-25_

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

Status: Local implementation complete; runtime validation pending.

The Frank-approved Homepage has been built in `farmtree-native` with core
blocks, content-only locked patterns and a read-only local preview. Scope,
evidence and remaining runtime checks are defined in `CURRENT_SPRINT.md` and
`SPRINT_REPORT.md`.

## Parallel Runtime Gate

### FT-NATIVE-001B - Private Production Runtime Validation

Status: Blocked on recoverable files/database backup verification and explicit
public `noindex` evidence. This gate blocks runtime/deployment actions, not local
native development.

## Deferred Implementation Backlog

- FT-NATIVE-003 - Register content models and build the admin experience.
- FT-NATIVE-004 - Build real pages, navigation and clean WordPress routes.
- FT-NATIVE-005 - Migrate content, validate runtime and prepare cutover.
- FT-SEO-001 - Define SEO metadata, canonical, hreflang, sitemap, and robots ownership across WordPress core, theme, and SEO plugin.
- FT-WEB-004 - Define production form handling and delivery verification.
- FT-WP-005 - Add browser-based production verification checklist after an approved deployment.
