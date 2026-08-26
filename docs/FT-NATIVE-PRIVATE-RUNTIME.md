# FarmTree Native Private Runtime Runbook

## Verified Public Runtime State

Repository and unauthenticated HTTPS checks on 2026-08-25, with the public
Homepage, headers and `robots.txt` rechecked on 2026-08-26, confirmed:

- `https://farmtree.eu/` returns a SeedProd Coming Soon page.
- `https://farmtree.eu/wp-admin/` redirects to the WordPress login screen.
- WordPress is running PHP 8.3.31 on Apache.
- Public cache headers are private/no-store.
- Neither the Coming Soon Homepage nor its intercepted `robots.txt` response
  includes an `X-Robots-Tag` header or robots meta noindex signal.
- Direct native theme and content-plugin URLs are intercepted by Coming Soon,
  so public HTTP checks cannot prove whether those directories already exist.

## Safety Gaps

Runtime validation cannot proceed until these runtime safeguards are verified
or corrected:

- A recent recoverable backup must exist for both WordPress files and the
  WordPress database.
- The public Coming Soon response must include an explicit `noindex` signal,
  either as an `X-Robots-Tag` header or robots meta tag.
- WordPress search visibility must be set to discourage indexing
  (`blog_public=0`).
- The active public theme must remain `farmtree`.
- Coming Soon must remain active until final launch approval.
- The workflow must remain manual-only, bound to GitHub's `Production`
  environment and undispatched until explicit user approval is recorded.

Independent GitHub Environment Required Reviewer protection is recorded as a
deferred governance enhancement for the current private repository, not a
development, release-preparation or dispatch blocker. Do not make the
repository public, move it, change ownership or billing, or purchase/migrate a
GitHub plan to enable that enhancement. GitHub documents the reviewer access
and private-repository plan requirements at
<https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments#required-reviewers>.

The compensating policy keeps the repository private, keeps production-related
workflows `workflow_dispatch` only, permits no automatic WordPress production
deployment, stops autonomous delivery at pre-release, requires explicit user
approval before each manual dispatch, keeps Coming Soon active and preserves
the current `farmtree` theme as the rollback-safe public theme together with
the rollback procedure below. Existing workflow protections must not be
weakened.

## Verified Repository Workflow State

PR #3 merged the workflow-only reconciliation to `main` at `3df2ae2` on
2026-08-26. GitHub registers
`.github/workflows/deploy-wordpress-native.yml` as active, its only trigger is
`workflow_dispatch`, and it has zero runs. The superseded
`.github/workflows/deploy-wordpress-staging.yml` is absent from `main`.

The workflow is therefore available for manual dispatch, but availability is
not deployment approval. Do not dispatch it until matching backup evidence and
explicit public noindex are verified and a human separately approves the run.

## Backup Evidence Requirement

Before entering the workflow confirmation, use Vimexx DirectAdmin's **Restore
Backups** screen to select one recent restore point and download both the
`farmtree.eu` website and its WordPress database from that same point. Wait for
both jobs to report **Finished**, store both ZIP files off-host, verify that the
archives open and contain the expected site files and SQL data, and record the
restore timestamp, custodian and an opaque non-secret evidence reference.

Do not commit backup files, database exports, credentials or private storage
locations. Supply only the non-secret evidence reference through the required
`backup_reference` workflow input. The workflow records its SHA-256 digest in
the job summary without echoing the reference itself. A typed confirmation
without this external evidence does not prove recoverability.

Vimexx documents the download flow at
<https://www.vimexx.eu/help/hoe-download-ik-een-backup> and notes that file and
database recovery must use the same moment at
<https://www.vimexx.eu/help/backup-tot-60-dagen-terug-plaatsen>.

## Public Noindex Requirement

Keep SeedProd Coming Soon active and configure an explicit public noindex in the
rendered response. Prefer an `X-Robots-Tag: noindex, nofollow` response header so
the signal does not depend on the Coming Soon template's `<head>` output; a
verified robots meta noindex is also acceptable. Recheck the public Homepage
after configuration. `robots.txt` alone does not satisfy this gate.

## Private Runtime Deployment Boundary

`.github/workflows/deploy-wordpress-native.yml` is manual-only and deploys
exactly:

- `wordpress/wp-content/themes/farmtree-native/`
- `wordpress/wp-content/plugins/farmtree-content/`

Each run requires the full immutable `source_commit` SHA approved from
`feat/wordpress-native-rebuild`. Checkout is pinned to that SHA, and the
workflow fails unless the commit is contained in the remote native-rebuild
branch. This prevents an accidental dispatch on `main`, which intentionally
does not contain the native implementation source.

The last pushed/CI-validated baseline is
`897a991fbdd9f301d0409d1a015282baac8fce61`; GitHub validation run
`32956292922` passed it. That SHA predates the local visual-parity correction
and must not be selected for the next parity release. After an explicitly
approved push and passing CI, record and reconfirm the new parity commit's full
SHA before any run. Recorded CI evidence is never dispatch approval.

The workflow targets the existing `Production` environment and existing
`VIMEXX_*` server credentials. A read-only GitHub API check on 2026-08-26 found
no protection rules on that environment, so the repository binding must not be
described as reviewer-protected. Required Reviewer protection is a deferred
governance enhancement under the compensating manual-release policy. The
workflow requires typed confirmation and a non-secret evidence reference for a
matching recoverable file/database restore point before any SSH or rsync step
runs.

The workflow does not:

- activate `farmtree-native`;
- activate `farmtree-content`;
- modify the current `farmtree` theme;
- deploy `farmtree-core` or `farmtree-ai-assistant`;
- run database-changing WP-CLI commands;
- remove unrelated server files.

Before rsync, the workflow validates local source files, PHP syntax, public
Coming Soon/noindex signals, WordPress installation state, WP-CLI availability,
current active theme, WordPress search visibility, Coming Soon activation and
that `farmtree-content` is inactive.

After rsync, the workflow verifies that WordPress recognizes the inactive native
theme and content plugin, that both remain inactive, and that `farmtree-native`
is a valid Block Theme.

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
