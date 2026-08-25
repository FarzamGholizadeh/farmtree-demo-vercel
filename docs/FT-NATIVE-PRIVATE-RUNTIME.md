# FarmTree Native Private Runtime Runbook

## Verified Public Runtime State

Repository and unauthenticated HTTPS checks on 2026-08-25 confirmed:

- `https://farmtree.eu/` returns a SeedProd Coming Soon page.
- `https://farmtree.eu/wp-admin/` redirects to the WordPress login screen.
- WordPress is running PHP 8.3.31 on Apache.
- Public cache headers are private/no-store.
- Direct native theme and content-plugin URLs are intercepted by Coming Soon,
  so public HTTP checks cannot prove whether those directories already exist.

## Safety Gaps

Runtime validation cannot proceed until these are verified or corrected:

- A recent recoverable backup must exist for both WordPress files and the
  WordPress database.
- The public Coming Soon response must include an explicit `noindex` signal,
  either as an `X-Robots-Tag` header or robots meta tag.
- WordPress search visibility must be set to discourage indexing
  (`blog_public=0`).
- The active public theme must remain `farmtree`.
- Coming Soon must remain active until final launch approval.

## Private Runtime Deployment Boundary

`.github/workflows/deploy-wordpress-native.yml` is manual-only and deploys
exactly:

- `wordpress/wp-content/themes/farmtree-native/`
- `wordpress/wp-content/plugins/farmtree-content/`

The workflow uses the existing protected production environment and existing
`VIMEXX_*` server credentials. It requires typed confirmation that a recoverable
file and database backup has been verified before any SSH or rsync step runs.

The workflow does not:

- activate `farmtree-native`;
- activate `farmtree-content`;
- modify the current `farmtree` theme;
- deploy `farmtree-core` or `farmtree-ai-assistant`;
- run database-changing WP-CLI commands;
- remove unrelated server files.

Before rsync, the workflow validates local source files, PHP syntax, public
Coming Soon/noindex signals, WordPress installation state, WP-CLI availability,
current active theme, WordPress search visibility and Coming Soon activation.

After rsync, the workflow verifies that WordPress recognizes the inactive native
theme and content plugin, and that `farmtree-native` is a valid Block Theme.

## Runtime Validation Checklist

After an approved native private-runtime deployment, validate through WordPress
preview/editor mechanisms while the public theme remains `farmtree`:

- WordPress recognizes `farmtree-native` as a valid Block Theme.
- `theme.json` loads correctly.
- Site Editor recognizes templates, template parts, header and footer.
- Patterns are registered.
- Style settings appear correctly.
- WordPress recognizes `farmtree-content`.
- Plugin activation is reviewed before any activation request.
- Site Editor, Page Editor, Template Editor, block inserter, media selection,
  draft/save/revisions and responsive preview work without console errors.
- front-page, page, post, archive, index and 404 templates are detected.
- No rebuild page is publicly exposed while Coming Soon remains active.

## Rollback

Because this workflow only deploys inactive native code, rollback is file-only:
remove or replace the isolated `farmtree-native` and `farmtree-content`
directories. The production `farmtree` theme remains the public rollback option,
and no database rollback should be required from this deployment alone.
