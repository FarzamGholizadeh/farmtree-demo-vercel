# FarmTree WordPress Deployment Checklist

_Last updated: 2026-07-27_

## Deployment Context

- Production domain: `https://farmtree.eu/`
- Primary branch: `wordpress-integration`
- WordPress theme: `wordpress/wp-content/themes/farmtree`
- Core plugin: `wordpress/wp-content/plugins/farmtree-core`
- AI plugin: `wordpress/wp-content/plugins/farmtree-ai-assistant`
- Vercel/static SPA: legacy/reference only, not the production source.
- Canonical release checklist: `RELEASE-CHECKLIST.md`

## Approval Gates

- [ ] Gate 1 - Spec approval is complete.
- [ ] Gate 2 - Implementation approval is complete.
- [ ] Gate 3 - Push approval is complete.
- [ ] Gate 4 - Merge/release-candidate approval is complete.
- [ ] Gate 5 - Deployment approval is granted through the GitHub `production` environment.
- [ ] Gate 6 - WordPress publication/activation/database approval is complete, if runtime WordPress changes are needed.

## Pre-Deployment Checks

- [ ] Confirm the release branch is `wordpress-integration`.
- [ ] Confirm the diff contains only approved files.
- [ ] Confirm no forbidden theme/plugin/content/database changes are bundled accidentally.
- [ ] Confirm no `.env*`, `.vercel/**`, `wp-config.php`, credentials, or secret values are present.
- [ ] Run `git status --short`.
- [ ] Run `git diff --stat`.
- [ ] Run `git diff --check`.
- [ ] Run approved read-only syntax checks or tests that do not install dependencies or trigger remote workflows.

## GitHub Actions Boundary

- [ ] Confirm `.github/workflows/deploy-wordpress.yml` declares `environment: production` on the deployment job.
- [ ] Confirm the GitHub `production` environment requires reviewer approval in repository settings.
- [ ] Confirm approval is granted before SSH setup, remote directory creation, or `rsync`.
- [ ] Confirm `.github/workflows/test-vimexx-ssh.yml` can run only by `workflow_dispatch`.

## Code Deployment

The WordPress deployment workflow syncs repository code only:

- `wordpress/wp-content/themes/farmtree`
- `wordpress/wp-content/plugins/farmtree-core`
- `wordpress/wp-content/plugins/farmtree-ai-assistant`

It must not publish WordPress content, change database records, or activate/deactivate themes or plugins.

## Post-Deployment Verification

These checks require an approved deployment and permitted browser/runtime verification:

- [ ] Visit `https://farmtree.eu/`.
- [ ] Confirm the homepage renders correctly.
- [ ] Confirm primary navigation and footer navigation work.
- [ ] Confirm key CTAs work.
- [ ] Confirm assets load without 404s.
- [ ] Confirm canonical, metadata, robots, sitemap, structured data, and hreflang behavior.
- [ ] Confirm mobile, tablet, and desktop layouts.
- [ ] Confirm accessibility smoke checks on key flows.

## Runtime WordPress Changes

Do not perform these actions without Gate 6 approval:

- [ ] Publish, edit, or delete WordPress content.
- [ ] Activate or deactivate themes.
- [ ] Activate or deactivate plugins.
- [ ] Change WordPress settings.
- [ ] Run database migrations or direct database updates.
