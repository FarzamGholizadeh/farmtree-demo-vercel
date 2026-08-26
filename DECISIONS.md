# FarmTree Decisions

_Last updated: 2026-08-26_

## DEC-001: WordPress Is The Production Source

The production website source is the WordPress implementation on the `wordpress-integration` branch. The root `index.html` and Vercel/static SPA artifacts are legacy/reference material and are not the production source.

Evidence: `wordpress/wp-content/themes/farmtree`, `wordpress/wp-content/plugins/farmtree-core`, `wordpress/wp-content/plugins/farmtree-ai-assistant`.

## DEC-002: Production Domain

The production domain is `https://farmtree.eu/`. Documentation, release checks, and deployment review should use this domain unless a future approved decision changes it.

## DEC-003: Primary Branch

The primary working branch for the WordPress website is `wordpress-integration`.

## DEC-004: Approval Gates

FarmTree website work follows six approval gates:

- Gate 1 - Spec approval.
- Gate 2 - Implementation approval.
- Gate 3 - Push approval.
- Gate 4 - Merge/release-candidate approval.
- Gate 5 - Deployment approval.
- Gate 6 - WordPress publication/activation/database approval.

## DEC-005: Governance Baseline Is Runtime-Neutral

Governance baseline changes must not alter the runtime behavior of the WordPress theme, the FarmTree Core plugin, or the FarmTree AI Assistant plugin.

## DEC-006: Production Deployments Use The Production Environment Boundary

WordPress deployment workflows must remain bound to the GitHub `Production`
environment and must remain manual-only. A workflow environment binding does
not by itself prove that an independent reviewer rule is configured. Every
production or private-runtime dispatch still requires separate explicit user
approval before SSH setup or `rsync` begins.

## DEC-007: SSH Test Workflow Is Manual-Only

The Vimexx SSH test workflow must run only through `workflow_dispatch`. It must not run automatically on every push to `wordpress-integration`.

## DEC-008: Secrets Stay Outside The Repository

Secrets belong only in approved secret stores such as GitHub Actions secrets or host environment configuration. They must not be requested, displayed, stored in docs, or committed.

## DEC-009: WordPress Runtime Changes Need Separate Approval

Publishing WordPress content, activating or deactivating themes/plugins, and database changes require Gate 6 approval. Repository evidence alone cannot confirm those runtime states.

## DEC-010: Native Rebuild Is Isolated

The WordPress-native rebuild is developed on
`feat/wordpress-native-rebuild` in `farmtree-native` and
`farmtree-content`. The production `farmtree` theme remains read-only except for
explicit emergency hotfixes.

## DEC-011: Core Blocks First

Standard editorial layouts use WordPress core blocks and locked patterns.
Custom blocks require FarmTree-specific functionality that core blocks cannot
provide safely.

## DEC-012: Content Ownership Moves To FarmTree Content

`farmtree-content` is the future canonical owner of content types, taxonomies,
global content settings and editorial capabilities. `farmtree-core` remains a
temporary compatibility layer and must not duplicate active registrations.

## DEC-013: Private Production Runtime Before Cutover

The existing WordPress installation may be used for private runtime validation
while Coming Soon remains active. Before native files are deployed, a recent
recoverable files/database backup and explicit public noindex protection must be
verified. The native theme stays inactive, the current `farmtree` theme remains
the rollback theme, and activation still requires separate approval.

## DEC-014: Autonomous Local Delivery Stops At Pre-release

Normal FarmTree implementation work proceeds autonomously through local edits,
validation, self-review, documentation and a focused local commit. Pushes,
merges, workflow runs, deployments, publication, activation and production data
or configuration changes retain their explicit approval gates.

## DEC-015: Approved FarmTree Visual Design Is Locked

The currently approved FarmTree frontend and existing production `farmtree`
theme are the mandatory visual source of truth for every current and future
WordPress-native page. The architecture may be rebuilt completely in
WordPress, but approved UI/UX must not be materially redesigned unless the user
explicitly requests a redesign. Frank-, Max- and user-approved content and
information-architecture changes must fit the existing approved visual
language.

## DEC-016: Required Reviewer Protection Is A Deferred Governance Enhancement

Independent GitHub Environment Required Reviewer protection is desirable but
is not a development or release-preparation blocker for the current private
repository. Do not make the repository public, change ownership or billing, or
purchase/migrate a GitHub plan to enable it.

Until that enhancement is available, the compensating release boundary is:

- the repository remains private;
- WordPress production deployment workflows remain `workflow_dispatch` only
  and no push automatically deploys WordPress production;
- autonomous work completes local implementation and validation, then stops at
  the pre-release touchpoint;
- a user explicitly approves each manual production or private-runtime
  workflow dispatch;
- Coming Soon remains active during the rebuild; and
- the current `farmtree` theme remains the rollback-safe public theme and the
  documented rollback procedure remains available.

Existing workflow protections must not be weakened. Backup and explicit public
noindex requirements remain separate runtime gates.
