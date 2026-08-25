# FT-NATIVE-001B Sprint Report

Status: Blocked

## Runtime Safety

- `https://farmtree.eu/` serves a SeedProd Coming Soon page to unauthenticated
  users.
- `https://farmtree.eu/wp-admin/` redirects to the WordPress login screen.
- Direct public checks for native theme/plugin files are intercepted by Coming
  Soon, so server presence cannot be confirmed without authenticated runtime or
  deployment access.
- A recent recoverable backup for WordPress files and database was not
  verifiable from local repository or unauthenticated runtime access.
- The fetched public Coming Soon response did not include a visible `noindex`
  header or robots meta tag.

## Repository Preparation

- The separate staging workflow was retired.
- A manual private-runtime workflow was added for inactive native code only.
- The workflow uses the protected production environment and existing
  `VIMEXX_*` credentials.
- The workflow deploys only:
  - `wordpress/wp-content/themes/farmtree-native/`
  - `wordpress/wp-content/plugins/farmtree-content/`
- The workflow does not activate a theme or plugin and does not run
  database-changing WP-CLI commands.
- The workflow verifies local source, PHP syntax, Coming Soon/noindex, current
  active `farmtree` theme, `blog_public=0`, WP-CLI, WordPress installation,
  native theme installation, content plugin installation and Block Theme status.

## Production Isolation

- Existing `farmtree` theme remains unchanged.
- Existing `farmtree-core` and `farmtree-ai-assistant` plugins remain unchanged.
- Existing full production deployment and SSH-test workflows remain unchanged.
- No deployment, activation, content publication or database change was made.

## Validation

- Repository-side validation is expected to cover required native files, JSON,
  block markup, workflow policy, JavaScript syntax and CSS validation.
- CI adds PHP 8.1 syntax validation and Gitleaks secret scanning.
- Real WordPress editor and frontend checks remain blocked until runtime safety
  is corrected and an approved private-runtime deployment has run.

## Required User Action

Verify a recent recoverable backup for WordPress files and database, then ensure
the public Coming Soon response sends an explicit `noindex` signal before
approving the private-runtime deployment.

## Next Sprint

FT-NATIVE-002 can begin only after FT-NATIVE-001B runtime validation passes.
