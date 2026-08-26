# FarmTree Project Context

_Last updated: 2026-08-26_

## Production Source

- Repository: `farmtree-demo-vercel`
- Primary branch: `wordpress-integration`
- GitHub default branch: `main` (verified 2026-08-26)
- Production domain: `https://farmtree.eu/`
- WordPress theme: `wordpress/wp-content/themes/farmtree`
- Core plugin: `wordpress/wp-content/plugins/farmtree-core`
- AI plugin: `wordpress/wp-content/plugins/farmtree-ai-assistant`

The production website source is the WordPress implementation in this repository. The root `index.html` and any Vercel/static SPA artifacts are retained as legacy/reference material and are not the production source.

## Isolated Native Rebuild

- Working branch: `feat/wordpress-native-rebuild`
- New Block Theme: `wordpress/wp-content/themes/farmtree-native`
- Canonical content layer: `wordpress/wp-content/plugins/farmtree-content`

The rebuild is isolated and inactive. The current `farmtree` theme remains the
production and rollback theme until an explicitly approved cutover.

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
- Gate 5 - Deployment approval: a human explicitly approves the manual workflow
  dispatch before SSH/rsync deployment; the workflow remains bound to the
  GitHub `production` environment.
- Gate 6 - WordPress publication/activation/database approval: content publication, theme/plugin activation changes, and database changes require separate explicit approval.

## Deployment Boundary

`.github/workflows/deploy-wordpress.yml` remains the full production code
deployment path. `.github/workflows/deploy-wordpress-native.yml` is a manual,
inactive-native-code-only path for private runtime validation. Both use the
GitHub `production` environment before SSH credentials or `rsync`; neither may
activate themes/plugins or change the database. `.github/workflows/test-vimexx-ssh.yml`
is manual-only and is not a push-time workflow.

The legacy Vercel Git integration currently creates an external static-project
deployment when `main` is merged. Treat every future `main` merge as
deployment-producing: obtain explicit Vercel deployment approval or suspend the
integration before merging. This integration does not deploy the WordPress
runtime at `farmtree.eu`.

Read-only GitHub API verification on 2026-08-26 confirmed that the private,
personal-account repository uses `main` as its default branch. `Preview` and
`Production` have no protection rules or deployment branch policy, and only the
owner currently has repository access. Independent Required Reviewer protection
is therefore recorded as a deferred governance enhancement, not a current
development or release-preparation blocker. Keep the repository private and do
not change its owner, billing or plan to obtain that enhancement.

PR #3 merged the private-runtime workflow reconciliation to `main` at
`3df2ae2`. GitHub registers `.github/workflows/deploy-wordpress-native.yml` as
active and manual-only with zero runs, and the superseded
`.github/workflows/deploy-wordpress-staging.yml` is absent. Required-reviewer
protection is deferred; matching recoverable file/database backup evidence,
explicit public noindex and separate user dispatch approval remain prerequisites
for any run. The compensating boundary is the private repository, manual-only
workflow, no automatic WordPress production deployment, autonomous pre-release
stop, explicit approval, Coming Soon, the unchanged `farmtree` rollback theme
and the documented rollback path.
