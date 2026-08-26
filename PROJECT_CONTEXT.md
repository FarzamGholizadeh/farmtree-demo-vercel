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
- Gate 5 - Deployment approval: the GitHub `production` environment approval is granted before SSH/rsync deployment.
- Gate 6 - WordPress publication/activation/database approval: content publication, theme/plugin activation changes, and database changes require separate explicit approval.

## Deployment Boundary

`.github/workflows/deploy-wordpress.yml` remains the full production code
deployment path. `.github/workflows/deploy-wordpress-native.yml` is a manual,
inactive-native-code-only path for private runtime validation. Both use the
GitHub `production` environment before SSH credentials or `rsync`; neither may
activate themes/plugins or change the database. `.github/workflows/test-vimexx-ssh.yml`
is manual-only and is not a push-time workflow.

Read-only GitHub API verification on 2026-08-26 confirmed that the `Preview`
and `Production` environments still have no protection rules or deployment
branch policy. It also confirmed `main` is the default branch; the native
private-runtime workflow at `.github/workflows/deploy-wordpress-native.yml` is
not present there and therefore is not remotely dispatchable yet. `main` does
contain the earlier `.github/workflows/deploy-wordpress-staging.yml`, which
targets a separate `STAGING_URL` and is not the current private-runtime path.
The approved default-branch integration must reconcile the branches, retire
that superseded staging workflow, expose the private-runtime workflow, add
required-reviewer protection, and verify a recent recoverable backup plus
explicit public noindex before any native workflow run.
