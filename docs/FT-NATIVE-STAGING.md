# FarmTree Native Staging Runbook

## Verified State

Repository and GitHub inspection on 2026-07-28 found no usable isolated
WordPress staging runtime:

- GitHub has an empty, unprotected `Preview` environment.
- No Preview environment secrets or variables are configured.
- No staging deployment workflow or remote staging branch existed.
- `staging.farmtree.eu`, `preview.farmtree.eu`, `dev.farmtree.eu` and
  `test.farmtree.eu` had no DNS A records.
- Existing `VIMEXX_*` secrets and workflows target the production deployment
  boundary and are not reused by the native staging workflow.

## Smallest Safe Runtime

Create a Vimexx staging subdomain backed by a separate WordPress installation,
database and uploads directory. The staging site must:

1. use production-like WordPress and PHP versions;
2. have HTTPS, password protection and `noindex`;
3. have WP-CLI available to the deployment SSH user;
4. contain an empty `.farmtree-staging` marker in its WordPress root;
5. never share production database writes;
6. remain non-public and disposable.

## GitHub Preview Configuration

Configure these values directly in the GitHub `Preview` environment. Do not
send credentials through chat or commit them:

Secrets:

- `STAGING_SSH_KEY`
- `STAGING_KNOWN_HOSTS`
- `STAGING_HOST`
- `STAGING_PORT`
- `STAGING_USER`
- `STAGING_WORDPRESS_PATH`

Variable:

- `STAGING_URL`

Add required-reviewer protection to `Preview`. The manual staging workflow
refuses to deploy unless the confirmation is `STAGING ONLY`, all values exist,
the URL uses HTTPS, WordPress is installed, WP-CLI is available and the staging
marker exists.

## Deployment Boundary

`.github/workflows/deploy-wordpress-staging.yml` is manual-only and deploys
exactly:

- `farmtree-native`
- `farmtree-content`

It does not deploy, activate or modify the production theme/plugins, and it
does not activate the native theme or plugin on staging. Runtime activation and
editor/browser validation require a separate explicit approval after this code
is pushed and the staging runtime is ready.

## Runtime Validation Checklist

After an approved staging deployment and activation:

- WordPress recognizes the Block Theme and plugin.
- Site Editor loads without warnings or console errors.
- templates and template parts appear.
- starter patterns appear.
- content-only and locking behavior match the role policy.
- page, post, archive, index, front-page and 404 templates render.
- desktop, tablet and mobile layouts are captured.
- production `https://farmtree.eu/` is compared before and after and remains
  unchanged.

## Rollback

Deactivate the staging-only native plugin and reactivate the prior staging
theme. Remove only the two isolated staging directories if needed. No production
path or database is part of this rollback.
