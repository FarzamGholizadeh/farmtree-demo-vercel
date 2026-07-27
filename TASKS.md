# FarmTree Tasks

_Last updated: 2026-07-27_

## Active Governance Task

### FT-WEB-001 - Production-safe governance baseline

Status: implemented locally, awaiting review.

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

- FT-WEB-002 - Define clean WordPress route strategy for replacing hash routes.
- FT-WEB-003 - Define SEO metadata, canonical, hreflang, sitemap, and robots ownership across WordPress core, theme, and SEO plugin.
- FT-WEB-004 - Define production form handling and delivery verification.
- FT-WEB-005 - Define editable content models for approved WordPress content types.
- FT-WEB-006 - Add browser-based production verification checklist after an approved deployment.
