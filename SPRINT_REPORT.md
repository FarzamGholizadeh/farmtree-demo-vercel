# FT-NATIVE-001 Sprint Report

Status: Review

## Architecture Created

- Isolated WordPress Block Theme: `farmtree-native`.
- Canonical content-layer scaffold: `farmtree-content`.
- Core-block-first templates, parts and patterns.
- Content-only locked global header/footer foundations.
- Documented content ownership, roles, models, staging, migration and rollback.

## Production Isolation

- Existing `farmtree` theme unchanged.
- Existing `farmtree-core` and `farmtree-ai-assistant` plugins unchanged.
- Existing deployment and SSH workflows unchanged.
- No activation, content publication, database change, push or deployment.

## Validation

- `node scripts/validate-native-foundation.mjs`: passed.
- Theme and style-variation JSON parsing: passed.
- WordPress block-comment attribute JSON parsing: passed.
- JavaScript syntax check: passed.
- CSS brace balance: passed.
- `git diff --check`: passed.
- Forbidden production path diff check: passed.
- Secret-pattern scan: passed; the staging policy mentions password protection
  but contains no credential.

## Preview

Internal static artifact:
`docs/FT-NATIVE-PREVIEW.html`

The in-app browser does not permit local `file:` URLs, so no browser screenshot
is claimed. The preview remains directly reviewable from the shared workspace.

## Limitations

- PHP CLI is not installed locally, so PHP lint must run in CI or a WordPress
  development environment before release.
- No local WordPress runtime or staging host is configured.
- GitHub has `Preview` and `Production` environments with no protection rules.
- No workflow targets a separate WordPress staging installation.
- The current production deployment workflow intentionally does not deploy
  `farmtree-native` or `farmtree-content`.
- Global URL settings and content models are architecture-only until
  FT-NATIVE-003; no database-backed settings or post types are registered.
- The complete homepage is intentionally deferred to FT-NATIVE-002.

## Recommended Next Sprint

FT-NATIVE-002 - Rebuild the approved homepage with core blocks, locked patterns,
native media and editor-tested responsive behavior inside the isolated theme.
