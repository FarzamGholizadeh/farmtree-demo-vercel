# FT-NATIVE-001A Sprint Report

Status: Review

## Staging And Runtime Approach

- No existing isolated WordPress staging runtime was found.
- CI validates the native theme/plugin and workflow boundaries.
- Manual staging deployment is isolated behind the GitHub `Preview` environment.
- A separate WordPress root, database, HTTPS URL, WP-CLI and
  `.farmtree-staging` marker are mandatory.

## Production Isolation

- Existing `farmtree` theme and production plugins remain unchanged.
- Existing production deployment and SSH workflows remain unchanged.
- No staging deployment, activation, content publication or database change.

## Validation

- `npm test` covers required files, JSON, block markup, workflow policy,
  JavaScript syntax and standards-based CSS validation.
- CI adds PHP 8.1 syntax validation and Gitleaks secret scanning.
- Real WordPress editor and frontend checks remain blocked on staging setup.

## Limitations

- PHP CLI is not installed locally; PHP lint will execute in GitHub Actions.
- The `Preview` environment needs staging-only configuration and protection.
- Runtime screenshots cannot exist until the isolated WordPress runtime exists.

## Recommended Next Sprint

Complete real WordPress staging validation, then begin FT-NATIVE-002.
