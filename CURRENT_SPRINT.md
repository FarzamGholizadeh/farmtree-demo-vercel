# Current FarmTree Sprint

## FT-NATIVE-001B - Private Production Runtime Validation

Status: Blocked

### Objective

Use the existing `https://farmtree.eu/` WordPress installation, currently hidden
behind Coming Soon, as the private runtime-validation environment for the
inactive native Block Theme and content plugin.

### Business Value

- Native runtime validation can happen against the real WordPress installation.
- The public Coming Soon experience remains active during the rebuild.
- The existing `farmtree` theme remains the rollback-safe public theme.
- Deployment boundaries stay narrow before the homepage rebuild begins.

### Verified Runtime State

- `https://farmtree.eu/` serves the SeedProd Coming Soon page to unauthenticated
  users.
- `https://farmtree.eu/wp-admin/` redirects to the WordPress login screen.
- Public direct URLs for `farmtree-native` and `farmtree-content` are intercepted
  by Coming Soon, so public HTTP checks cannot prove whether those directories
  already exist on the server.
- No recent recoverable file/database backup was verifiable from repository or
  unauthenticated runtime access.
- The public Coming Soon response did not expose a verifiable `noindex` signal
  in headers or page markup from the unauthenticated check.

### Scope

- Retire the separate staging deployment path.
- Add a manual private-runtime deployment for only `farmtree-native` and
  `farmtree-content`.
- Use the existing protected production/server credential boundary.
- Keep `farmtree-native` inactive.
- Require recoverable file/database backup confirmation before deployment.
- Require Coming Soon and search-indexing protections before deployment.
- Document the private runtime setup and validation checklist.

### Allowed Files

- `.github/workflows/deploy-wordpress-native.yml`
- `.github/workflows/validate-wordpress-native.yml`
- `scripts/validate-native-workflows.mjs`
- `docs/FT-NATIVE-PRIVATE-RUNTIME.md`
- `docs/FT-NATIVE-ARCHITECTURE.md`
- `package.json`
- `TASKS.md`
- `CURRENT_SPRINT.md`
- `SPRINT_REPORT.md`
- `SPRINT_HISTORY.md`

### Forbidden Runtime Actions

- Activating `farmtree-native` as the public theme.
- Disabling or deleting the current `farmtree` theme.
- Removing Coming Soon.
- Publishing unfinished rebuild pages publicly.
- Running database migrations or irreversible content changes.
- Deploying `farmtree-core` or `farmtree-ai-assistant`.
- Requesting, exposing or committing credentials.

### Design And Editing Rules

- Do not continue the old Homepage Hero pilot architecture.
- Do not build the homepage until FT-NATIVE-001B runtime safety and native
  validation pass.
- Fix native-theme/plugin defects only when runtime evidence identifies them.
- Keep public launch behind explicit approval.

### Acceptance Criteria

- CI checks PHP, JSON, block markup, workflow policy, JavaScript, CSS and
  secrets.
- Private-runtime deployment is `workflow_dispatch`-only.
- Deployment uses the protected `production` environment and existing `VIMEXX_*`
  server credentials.
- Workflow deploys only the inactive native theme and content plugin.
- Workflow does not activate themes/plugins or change the database.
- Workflow requires backup confirmation before SSH/rsync.
- Workflow requires Coming Soon, `noindex`, `blog_public=0`, WP-CLI, WordPress
  installation and current active `farmtree` theme before rsync.
- WordPress recognizes `farmtree-native` as a valid inactive Block Theme.
- WordPress recognizes `farmtree-content`.
- Site Editor, Page Editor, Template Editor and template detection pass runtime
  validation.
- Existing public theme, legacy plugins, production content and Coming Soon
  remain unchanged.
- One local atomic commit is created.

### Current Blocker

Before any release/deployment request, verify a recent recoverable WordPress
files backup and database backup, and add an explicit public `noindex` signal to
the active Coming Soon response.

### Rollback

Because the private-runtime workflow deploys only inactive native code, rollback
is file-only: remove or replace `farmtree-native` and `farmtree-content`. The
current `farmtree` theme remains active and available as the public rollback
option.
