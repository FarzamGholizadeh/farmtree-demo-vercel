# FarmTree WordPress Release Checklist

_Last updated: 2026-08-26_

## Release Context

- Production domain: `https://farmtree.eu/`
- Primary branch: `wordpress-integration`
- WordPress theme: `wordpress/wp-content/themes/farmtree`
- Core plugin: `wordpress/wp-content/plugins/farmtree-core`
- AI plugin: `wordpress/wp-content/plugins/farmtree-ai-assistant`
- Vercel/static SPA: legacy/reference only, not the production source.

## Approval Gates

- [ ] Gate 1 - Spec approval is recorded.
- [ ] Gate 2 - Implementation approval is recorded.
- [ ] Gate 3 - Push approval is recorded before any push.
- [ ] Gate 4 - Merge/release-candidate approval is recorded before release candidate handling.
- [ ] Gate 5 - Deployment approval is granted through the GitHub `production` environment before SSH/rsync deployment.
- [ ] Gate 6 - WordPress publication/activation/database approval is recorded before content publication, theme/plugin activation changes, or database changes.

## Preflight

- [ ] Confirm the branch matches the operation: `feat/wordpress-native-rebuild`
      for native pre-release work and `wordpress-integration` for approved
      production integration; use `codex/enable-native-private-runtime` only for
      the workflow-only pull request targeting `main`.
- [ ] Confirm working-tree status is understood.
- [ ] Confirm release diff contains only approved files.
- [ ] Confirm no secrets or environment files are included.
- [ ] Confirm no forbidden production data or WordPress runtime state is changed.

## Local Validation

- [ ] Run `git status --short`.
- [ ] Run `git diff --stat`.
- [ ] Run `git diff --check`.
- [ ] Run available read-only syntax checks or tests that do not install dependencies, write output, or trigger remote actions.
- [ ] Review GitHub Actions YAML indentation and trigger logic.

## Deployment Review

- [ ] Confirm `.github/workflows/deploy-wordpress.yml` uses only `workflow_dispatch`.
- [ ] Confirm `.github/workflows/deploy-wordpress.yml` uses the `production` environment.
- [ ] Confirm the `production` environment in GitHub requires reviewer approval.
- [ ] Confirm `.github/workflows/test-vimexx-ssh.yml` is manual-only.
- [ ] Confirm deployment uses repository code only and does not publish WordPress content.

## Native Private-Runtime Review

- [ ] Confirm `.github/workflows/deploy-wordpress-native.yml` has reached the
      GitHub default `main` branch through an approved release path.
- [ ] Record the full approved commit SHA from `feat/wordpress-native-rebuild`;
      use that immutable SHA as `source_commit` rather than deploying `main` or
      an unpinned branch tip.
- [ ] Reconcile the default-branch workflow additions and retire the superseded
      `.github/workflows/deploy-wordpress-staging.yml` path.
- [ ] Confirm the GitHub `Production` environment has required-reviewer
      protection before the workflow runs. For this private repository, first
      confirm Enterprise-capable ownership and an eligible reviewer with read
      access; add a second reviewer if self-review prevention is enabled.
- [ ] Select one recent matching Vimexx restore point for both the FarmTree
      website files and WordPress database.
- [ ] Download both backup ZIPs to off-host storage, verify that they open and
      contain the expected site files and SQL data, and record a non-secret
      evidence reference for the workflow input. Retain the original reference
      so its SHA-256 can be reconciled with the workflow job summary.
- [ ] Confirm Coming Soon remains active and the public response exposes an
      explicit robots meta or `X-Robots-Tag` noindex signal. Do not treat
      `robots.txt` alone as sufficient evidence.
- [ ] Confirm the workflow deploys only inactive `farmtree-native` and
      `farmtree-content` files and performs no activation or database change.

## Post-Deployment Verification

These checks require an approved deployment and permitted browser/runtime verification:

- [ ] Visit `https://farmtree.eu/`.
- [ ] Confirm homepage renders without browser console errors.
- [ ] Confirm primary navigation, footer navigation, and key CTAs work.
- [ ] Confirm theme assets load correctly.
- [ ] Confirm canonical, metadata, robots, sitemap, and structured data behavior on production.
- [ ] Confirm responsive behavior on mobile, tablet, and desktop.
- [ ] Confirm accessibility smoke checks on key flows.

## WordPress Runtime Actions

The following are not part of code deployment and require Gate 6:

- [ ] Publishing, editing, or deleting WordPress content.
- [ ] Activating or deactivating themes.
- [ ] Activating or deactivating plugins.
- [ ] Changing WordPress settings.
- [ ] Running database migrations or direct database edits.
