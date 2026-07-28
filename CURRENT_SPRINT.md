# Current FarmTree Sprint

## FT-NATIVE-001 - WordPress Native Foundation

Status: Review

### Objective

Create an isolated WordPress Block Theme and canonical content-plugin foundation
that can replace the current static-style production architecture without
changing the active FarmTree website.

### Business Value

- FarmTree staff will eventually manage public content through WordPress rather
  than PHP or JavaScript.
- The rebuild can be developed and reviewed without destabilising production.
- Future page, content-model, URL and translation work will have one documented
  ownership model.

### Scope

- Audit the production theme, FarmTree Core and FarmTree AI Assistant.
- Add `wordpress/wp-content/themes/farmtree-native/`.
- Add `wordpress/wp-content/plugins/farmtree-content/` as an inactive canonical
  content-layer scaffold.
- Define design tokens in `theme.json`.
- Add Block Theme templates, template parts and core-block patterns.
- Add initial locked header and footer foundations.
- Document content models, editor locking, migration, rollback and staging.
- Add a static internal foundation preview.

### Allowed Files

- `wordpress/wp-content/themes/farmtree-native/**`
- `wordpress/wp-content/plugins/farmtree-content/**`
- `docs/FT-NATIVE-ARCHITECTURE.md`
- `scripts/validate-native-foundation.mjs`
- `docs/FT-NATIVE-PREVIEW.html`
- `PROJECT_CONTEXT.md`
- `DECISIONS.md`
- `ARCHITECTURE.md`
- `TASKS.md`
- `ROADMAP.md`
- `CURRENT_SPRINT.md`
- `SPRINT_REPORT.md`
- `SPRINT_HISTORY.md`

### Forbidden Files

- `wordpress/wp-content/themes/farmtree/**`
- `wordpress/wp-content/plugins/farmtree-core/**`
- `wordpress/wp-content/plugins/farmtree-ai-assistant/**`
- `.github/workflows/**`
- Production data, uploads, configuration and secrets

### Design And Editing Rules

- Preserve the approved premium climate-tech identity.
- Use WordPress core blocks before custom blocks.
- Lock template structure while allowing content editing.
- Keep global header/footer structures controlled.
- Do not build the complete homepage in this sprint.
- Do not add public content or placeholder claims.

### SEO, Accessibility And Responsive Baseline

- Use semantic template landmarks and one page-title hierarchy.
- Keep rendered content server-side.
- Use responsive core blocks and explicit content/wide widths.
- Preserve visible focus, keyboard navigation and reduced-motion support.
- Validate the foundation at 320, 375, 390, 430, 768, 1024, 1280, 1440 and
  1920 CSS pixels during implementation sprints.

### Acceptance Criteria

- The isolated branch and Block Theme structure exist.
- `theme.json` and style variation JSON are valid.
- Header, footer, page, post, archive and 404 foundations exist.
- Approved starter patterns use core blocks and have clear descriptions.
- The content plugin does not duplicate or activate FarmTree Core models.
- Content ownership, editor locking, staging and migration are documented.
- No current production theme/plugin or workflow file changes.
- Available validation passes.
- One local atomic commit is created.

### Rollback

Delete or revert the isolated foundation commit. Because the new theme and
plugin are not activated and create no data, rollback has no production runtime
or database effect.
