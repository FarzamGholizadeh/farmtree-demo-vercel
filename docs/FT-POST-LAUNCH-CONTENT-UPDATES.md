# Post-launch documentary content update

Prepared 2026-09-18. Local preparation only; this document is not deployment
authorization. The explicit chat approval covered pushing photo commit
`51ba0f5e4d28b7ed43cd1f2fe692185438006624` and preparing this path.
That commit was pushed to `origin/feat/wordpress-native-rebuild`. New runtime
code requires separate push/deployment/APPLY approval. No production access was
performed during preparation.

## Scope and public-state contract

FarmTree Content 0.4.8 adds an explicit `--post-launch-images` profile. The
default private-review mode and its protection gates remain unchanged. This
profile permits only owned `post_content` updates on these existing published
Pages: `page.en.home`, `page.en.platform`, `page.en.solutions`,
`page.en.proof_stories`, `page.en.customer_segments`, `page.en.blog`.
It is a narrow page-body profile, not a semantic image-only diff validator:
the approved source artifact and reviewed full body diff remain mandatory.

Creates, adoptions, title/status/slug/excerpt/order changes, media, relationships,
term changes, front-page changes and rewrite updates are rejected. Unrelated
manual content still conflicts. Existing managed keys and last-applied hashes
must match. Four exact previous Homepage theme-image URLs retain their original
token identities so replacing those images does not manufacture fingerprint
drift; this does not accept changes to their surrounding content.

Raw database checks require blog_public=1, SeedProd Coming Soon/maintenance OFF,
Native active, Content active, Bot OFF and the published managed front page.
Production identity must be https://farmtree.eu/ with front Page 439. NL/DE
reserved-locale guards remain in force. An anonymous HTTP gate requires a 200
Native Homepage response without Coming Soon or noindex/nofollow.

The plan binds a SHA-256 of critical options, including plugin/theme state,
front-page settings, indexing, SeedProd, Bot and rewrite rules. Locked fresh
planning rejects intervening drift; final checks roll back changed critical
settings. The command never switches public indexing or Coming Soon settings.
Content revisions, modification timestamps and managed audit metadata are
expected writes. Core taxonomy cache rebuilding is a disclosed incidental
write. Database rollback cannot reverse auto-increments, external hook effects
or all cache effects. Fresh backups and production side-effect checks remain
required. A backup digest is evidence binding, not automatic backup validation.

## Future approved release sequence

1. Obtain explicit approval for the final code SHA, push and scoped deployment.
   Inspect current production state and unrelated/manual drift first.
2. Back up the current Native theme, Content plugin and database outside the
   public webroot; verify hashes, readability and the restore procedure. Preserve
   the `farmtree` rollback theme and all unrelated files/settings.
3. Build/audit the exact approved commit locally. Deploy only its allowlisted
   Native and Content runtime, using the separately approved active-runtime
   replacement procedure. Verify every runtime checksum. The old private-review
   workflow is not suitable: do not enable Coming Soon or disable indexing to
   satisfy it. Do not dispatch or weaken that workflow.
4. Run the scoped real production dry-run with current approved SHA:

   ```sh
   wp farmtree content reconcile --dry-run --post-launch-images \
     --expected-site=https://farmtree.eu/ --expected-theme=farmtree-native \
     --source-commit=APPROVED_40_CHARACTER_SHA --format=json
   ```

   The command defaults to dry-run. Its SQL read firewall must report no blocked
   write, and complete before/after state evidence must prove zero mutation.
   Review all six body diffs and exact IDs. Expected original photo transition:
   create=0, update=6, unchanged=87, conflict=0, skipped=1. An already-applied
   subset may reduce updates; investigate any discrepancy before APPLY. No
   adoptions or rewrite updates are acceptable. Any new manual conflict stops.
5. Only with explicit APPLY approval, verified backups, valid anonymous public
   response and the exact freshly reviewed plan digest, use the same command
   with `--apply` instead of `--dry-run`, supplying:

   ```text
   --plan-digest=<reviewed SHA-256>
   --backup-digest=<verified backup evidence SHA-256>
   --confirmation='APPLY SIX PAGE DOCUMENTARY CONTENT UPDATES'
   --publication-confirmation='PRESERVE EXISTING PUBLICATION AND ROUTING'
   --protection-confirmation='PUBLIC INDEXING ON AND COMING SOON OFF VERIFIED'
   ```

6. Require a final idempotent dry-run (93 unchanged, zero updates/conflicts),
   compare complete production state, and run anonymous route, responsive image,
   Homepage motion/accessibility, robots and sitemap QA. Verify public indexing
   and Coming Soon OFF independently after APPLY. Keep Bot OFF and NL/DE absent.
   Report all actual side effects; do not silently ignore changed options.
7. On failure stop. Transactional failures roll back database work; any broader
   restoration needs the approved rollback procedure and verified backups.
   Restore the prior Native/Content artifact and corresponding six bodies/audit
   metadata together, without overwriting unrelated content or public settings.

## Local validation

`npm run wp:verify:post-launch` creates a disposable WordPress instance from the
previous approved manifest at `34771e782f3b3d2118567ecd42f4bbf54aa93121`.
It tests zero-write dry-run, six updates, convergence, untouched unrelated posts,
ownership/manual drift, forbidden fields, public-state gates, wrong-mode typed
confirmation and rollback when a save hook attempts to disable indexing.
HTTP responses are fixture-controlled, not evidence about live production.
Run alongside `npm test`, `wp:verify`, `wp:verify:anonymous`,
`wp:verify:postconditions`, `wp:verify:side-effects`, and exact artifact build/audit.
Test fixtures and this runbook remain outside deployable theme/plugin paths.
