# FarmTree Tasks

_Last updated: 2026-07-27_

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

## Active Sprint

### FT-WP-001 - WordPress Native Foundation Architecture

Status: in local implementation.

Scope:

- Audit hard-coded homepage/global components.
- Define the WordPress-native content model across Pages, FarmTree blocks, patterns, future CPTs, taxonomies, global settings, and editor locking.
- Add minimum Gutenberg infrastructure to the FarmTree theme.
- Add the first editable pilot block: `farmtree/homepage-hero`.
- Add a FarmTree Native Homepage Pilot page template with locked block scope.
- Preserve the approved frontend hero DOM, design classes, IDs, CTA behavior, and responsive hooks.
- Keep current production unchanged until release approval.

Acceptance:

- Homepage hero can be represented by a custom block.
- Hero text, supporting text, background image/alt text, primary CTA label/URL, secondary CTA label, and future-card content are editable.
- If a configured static front page contains the pilot block, the theme reads its attributes.
- If no static page/block exists, the approved default hero renders unchanged.
- No Elementor or unrestricted page-builder behavior is introduced.
- No push, deployment, WordPress publication, activation, or database change is performed.

## Deferred Implementation Backlog

- FT-WP-002 - Convert homepage section headings and repeated cards into locked FarmTree blocks/patterns.
- FT-WP-003 - Register and migrate first functional CPT set for Case Studies and Testimonials.
- FT-WP-004 - Define clean WordPress route strategy for replacing hash routes.
- FT-SEO-001 - Define SEO metadata, canonical, hreflang, sitemap, and robots ownership across WordPress core, theme, and SEO plugin.
- FT-WEB-004 - Define production form handling and delivery verification.
- FT-WP-005 - Add browser-based production verification checklist after an approved deployment.
