# Current FarmTree Sprint

## FT-NATIVE-001A - WordPress Native Staging Validation

Status: Review

### Objective

Create a guarded CI and staging-validation path for the isolated Block Theme and
content plugin without changing the active FarmTree website.

### Business Value

- Invalid native theme or plugin changes fail before staging.
- Staging deployment cannot silently target the production WordPress path.
- Runtime validation becomes possible before the homepage rebuild begins.

### Scope

- Verify whether an isolated WordPress staging runtime exists.
- Add native PHP, JSON, block-markup, JavaScript, CSS and secret validation.
- Add a manual Preview-environment deployment for only `farmtree-native` and
  `farmtree-content`.
- Require a separate staging marker, credentials and WordPress installation.
- Document the external staging setup and runtime validation checklist.

### Allowed Files

- `.github/workflows/validate-wordpress-native.yml`
- `.github/workflows/deploy-wordpress-staging.yml`
- `.gitignore`
- `scripts/validate-native-foundation.mjs`
- `scripts/validate-native-workflows.mjs`
- `docs/FT-NATIVE-STAGING.md`
- `package.json`
- `package-lock.json`
- `stylelint.config.mjs`
- `wordpress/wp-content/themes/farmtree-native/style.css`
- `TASKS.md`
- `CURRENT_SPRINT.md`
- `SPRINT_REPORT.md`
- `SPRINT_HISTORY.md`

### Forbidden Files

- `wordpress/wp-content/themes/farmtree/**`
- `wordpress/wp-content/plugins/farmtree-core/**`
- `wordpress/wp-content/plugins/farmtree-ai-assistant/**`
- `.github/workflows/deploy-wordpress.yml`
- `.github/workflows/test-vimexx-ssh.yml`
- Production data, uploads, configuration and secrets

### Design And Editing Rules

- Do not change the theme design or build the homepage.
- Do not reuse production secret names in staging.
- Keep staging deployment manual and Preview-environment scoped.
- Deploy code inactive; activation requires separate approval.

### SEO, Accessibility And Responsive Baseline

- Preserve the existing FT-NATIVE-001 accessibility and responsive baseline.
- Runtime viewport validation is blocked until isolated staging exists.

### Acceptance Criteria

- CI checks PHP, JSON, required files, block markup, JavaScript, CSS and secrets.
- Manual staging deployment is `workflow_dispatch`-only.
- Staging workflow uses only `STAGING_*` secrets and the `Preview` environment.
- A remote marker and valid WordPress runtime are required before rsync.
- Only the native theme and content plugin are deployment targets.
- Existing production workflow, theme, plugins and data remain unchanged.
- One local atomic commit is created.

### Rollback

Revert the FT-NATIVE-001A commit. Nothing is deployed or activated by the local
implementation, so rollback has no runtime or database effect.
