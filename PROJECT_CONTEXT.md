# FarmTree Project Context

_Last updated: 2026-07-27_

## Production Source

- Repository: `farmtree-demo-vercel`
- Primary branch: `wordpress-integration`
- Production domain: `https://farmtree.eu/`
- WordPress theme: `wordpress/wp-content/themes/farmtree`
- Core plugin: `wordpress/wp-content/plugins/farmtree-core`
- AI plugin: `wordpress/wp-content/plugins/farmtree-ai-assistant`

The production website source is the WordPress implementation in this repository. The root `index.html` and any Vercel/static SPA artifacts are retained as legacy/reference material and are not the production source.

## Safety Baseline

- Do not push, deploy, publish content, activate/deactivate WordPress themes or plugins, or change production data without explicit approval.
- Do not request, display, store, or commit secrets.
- Keep governance-only work separate from theme/plugin runtime behavior changes.
- Treat production WordPress content, database state, host configuration, and plugin/theme activation state as runtime items that cannot be confirmed from the repository alone.

## Approval Gates

- Gate 1 - Spec approval: scope, acceptance criteria, allowed files, and risks are approved.
- Gate 2 - Implementation approval: local edits are reviewed and accepted.
- Gate 3 - Push approval: a human explicitly approves pushing commits.
- Gate 4 - Merge/release-candidate approval: a human explicitly approves the release candidate.
- Gate 5 - Deployment approval: the GitHub `production` environment approval is granted before SSH/rsync deployment.
- Gate 6 - WordPress publication/activation/database approval: content publication, theme/plugin activation changes, and database changes require separate explicit approval.

## Deployment Boundary

`.github/workflows/deploy-wordpress.yml` is the code deployment path for the WordPress theme and plugins. It must be protected by the GitHub `production` environment before SSH credentials are configured or `rsync` runs. `.github/workflows/test-vimexx-ssh.yml` is manual-only and is not a push-time workflow.
