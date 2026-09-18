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

`.github/workflows/deploy-wordpress-native.yml` is manual-only. It first builds
an exhaustive allowlisted artifact and deploys exactly:

- `.release/wordpress/wp-content/themes/farmtree-native/`
- `.release/wordpress/wp-content/plugins/farmtree-content/`

The raw repository theme/plugin trees are not rsynced. The release manifest
classifies every source-root file as runtime or excluded, and the workflow
fails on unknown files, symlinks, dirty release inputs, PHP syntax errors or
checksum mismatch. It verifies the staged SHA-256 list again after transfer.
The current exact classification and its audit command are documented in
`docs/FT-NATIVE-RELEASE-PREPARATION.md`.

Each run requires the full immutable `source_commit` SHA approved from
`feat/wordpress-native-rebuild`. Checkout is pinned to that SHA, and the
workflow fails unless the commit is contained in the remote native-rebuild
branch. This prevents an accidental dispatch on `main`, which intentionally
does not contain the native implementation source.

The last pushed/CI-validated approved baseline is
`210ce51f7c4b573b51cf96bba1b575918757e9d1`; GitHub native validation and
secret-scan runs `33525868829` and `33525869476` passed it. The audited
release-preparation commit remains a separate feature-branch release candidate.
After its explicitly approved push and passing CI, record and reconfirm that
commit's full SHA before any run. Recorded CI evidence is never dispatch
approval.

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

## Managed Content Materialization Boundary

File deployment and WordPress content reconciliation are separate operations.
The deployment workflow does not run the reconciler, activate its plugin,
publish content or change front-page options.

Post-launch update note (2026-09-18): this section describes the historical
private-review path. The separately gated public-site documentary update profile
is documented in `FT-POST-LAUNCH-CONTENT-UPDATES.md`; do not disable indexing or
turn Coming Soon on for that profile. The published manifest supersedes the
historical private-status description below.

The release artifact contains a WP-CLI-only `farmtree content reconcile`
command and a protected generated manifest. The command defaults to a
write-free JSON plan and classifies every operation as create, update,
unchanged, conflict or skipped. Stable managed keys and last-applied
fingerprints preserve matching IDs and prevent an unowned/manual/ambiguous
match from being overwritten. All managed English entities materialize as
`private`; attachments remain `inherit`. Non-loopback apply requires
transactional tables and a locked `SERIALIZABLE` fresh plan, then verifies a
fully idempotent final no-write plan before commit. It has no delete or
database-import path.

Any future production dry run requires explicit runtime approval. Any future
`--apply` is a Gate 6 content/database/publication action and additionally
requires the reviewed plan digest, exact site/theme identity, backup-evidence
digest, Coming Soon, `blog_public=0` and all typed confirmations. A conflict
stops apply. `/nl/` and `/de/` are never materialized and must remain
unpublished.

The corrected plugin has no activation/deactivation hook. Its CPT rewrite
refresh is a disclosed `rewrite-rules` plan operation and one soft,
transactional APPLY-only finalizer after every release gate. Raw stored rules
are compared with canonical generated rules; populated state permits only exact
additive FarmTree-permastruct rules and namespace collisions stop. `.htaccess`
is never written. Release verification requires complete captures, exact
critical-state comparison and narrow predicates for known core volatility—never
a whole-table ignore.

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
