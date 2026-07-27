# FarmTree Decisions

_Last updated: 2026-07-27_

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

## DEC-006: Production Deployments Require Environment Approval

The WordPress deployment workflow must use the GitHub `production` environment so a reviewer approval boundary is reached before SSH setup or `rsync` deployment begins.

## DEC-007: SSH Test Workflow Is Manual-Only

The Vimexx SSH test workflow must run only through `workflow_dispatch`. It must not run automatically on every push to `wordpress-integration`.

## DEC-008: Secrets Stay Outside The Repository

Secrets belong only in approved secret stores such as GitHub Actions secrets or host environment configuration. They must not be requested, displayed, stored in docs, or committed.

## DEC-009: WordPress Runtime Changes Need Separate Approval

Publishing WordPress content, activating or deactivating themes/plugins, and database changes require Gate 6 approval. Repository evidence alone cannot confirm those runtime states.
