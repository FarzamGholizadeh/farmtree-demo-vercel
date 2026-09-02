# FarmTree Native Audited Release Preparation

Status: local release-preparation implementation; production untouched and all
runtime actions remain approval-gated.

## Release Artifact Boundary

`config/farmtree-native-release-files.json` is the exhaustive source-of-truth
for the two deployable roots. Every regular file below `farmtree-native` and
`farmtree-content` must be classified exactly once as `runtime` or `excluded`.
Unknown, missing, duplicate, case-colliding, non-regular and symlinked paths
fail the audit.

Run the write-free source-classification check with:

```sh
npm run release:check
```

Build the artifact from a clean, committed tree with:

```sh
npm run release:build
npm run release:audit
```

The builder stages only allowlisted runtime files under `.release/wordpress`,
records the exact source commit and manifest digest, and creates
`.release/SHA256SUMS`. The artifact audit requires that build to exist and
proves its exact file and directory allowlists, source-file equivalence,
checksums, byte count, source commit, manifest digest and release summary. Both
commands refuse dirty release inputs, unsafe artifact paths and symlinks. The
manual-only deployment workflow builds and audits this artifact, lints its PHP,
rsyncs only the staged theme/plugin directories with checksum comparison, and
verifies the same checksums remotely. It does not activate code or change
WordPress data.

The classification currently contains 81 intended runtime files and 114
excluded files. The excluded set includes all five raw content JSON sources,
theme/plugin README and provenance documents, obsolete responsive image
derivatives, unused portraits and superseded media. The only shipped JSON files
are the three intentional runtime resources: `theme.json`,
`styles/scientific.json` and `assets/data/world-land-110m.json`. The five
testimonial placeholder JPEGs are current, visibly disclosed Homepage assets,
not QA data. The exact path sets are reviewable in the classification file;
changing either deployable root without updating that exhaustive file fails.

## Protected Managed-Content Manifest

`scripts/generate-managed-content-manifest.mjs` compiles the repository-only
content sources into
`farmtree-content/includes/managed-content-manifest.php`. Raw JSON is never
copied into the release artifact. The generated PHP file has an `ABSPATH`
direct-access guard, contains no secrets or local paths, and is checked for
byte-for-byte freshness by `npm test`.

The private-review manifest contains:

- 40 managed `private` content entities: 17 Pages, 10 Customer Segments, four
  Proof Stories and nine News posts; no managed entity is `publish`;
- six managed News categories;
- 34 exact managed media assets with SHA-256, MIME, slug and stable key;
- ten stable embedded Team member keys owned together by the managed Team page;
- reserved, unpublished locale identities for `/nl/` and `/de/`.

## Reconciler Architecture

The reconciler is WP-CLI-only and is never loaded for HTTP or wp-admin
requests. Its command is:

```sh
wp farmtree content reconcile --source-commit=<40-char-sha> \
  --expected-site=<exact-home-url> --expected-theme=<active-stylesheet> \
  --format=json
```

Omitting `--apply` is always a write-free dry run. It emits every check, term,
media, post and optional front-page operation together with one of `create`,
`update`, `unchanged`, `conflict` or `skipped`, then emits a deterministic plan
digest. The default skips front-page options; `--set-front-page` must be
explicit.

The apply path recomputes the plan and requires all of the following before a
write:

- the exact dry-run plan digest;
- a 40-character reviewed source commit;
- exact site and active-theme identity;
- a 64-character external backup-evidence digest;
- the three exact typed apply/publication/protection confirmations;
- `blog_public=0` and an active Coming Soon plugin outside loopback;
- zero conflicts and a structurally complete allowlisted plan.

Plugin load, command registration, reconciler construction, dry-run, plugin
activation and plugin deactivation have no FarmTree-authored persistent write
path. The plugin deliberately registers no activation or deactivation hook.
WordPress core still updates `active_plugins` when a human explicitly changes
plugin state, but FarmTree adds no lifecycle option, content, transient, cron,
rewrite or filesystem mutation.

Apply requires transactional storage outside loopback, starts a
`SERIALIZABLE` transaction, locks and cache-refreshes the complete managed
key/slug/candidate/relationship surface, and requires the locked fresh plan to
retain the reviewed digest before writing. Each operation is revalidated at
mutation time and a final no-write plan must be fully idempotent before commit.
Managed post updates require a verified WordPress revision. Failure rolls the
database transaction back and reports completed operations, rollback status,
best-effort cleanup of created media variants and the inherent possibility of
non-database third-party hook effects. The command has no delete, trash,
database-import, theme/plugin activation, Coming Soon, robots, DNS, SSL or
private-access mutation path.

The two public-capable CPTs require persisted pretty-permalink rules, so
dry-run also discloses one `rewrite-rules` option operation. It reads the raw
option row directly, preserves its option ID, autoload state and ordered rule
fingerprint, then generates the canonical stored `$matches[N]` form on an
isolated rewrite object. The exact FarmTree-owned addition set is derived by
comparing generation with and without the two reviewed permastructs. A populated
option must remain an order-preserving exact subset: existing-rule removal or
query change, shared-rule reorder, namespace collision, shadowing rule or any
non-FarmTree addition is a conflict. The exact canonical CPT rule must be the
first generated rule that matches each clean probe route. An absent/empty
option may initialize the disclosed
complete generated set because there is no persisted rule to overwrite.

After every gate and managed write succeeds, APPLY alone may run one
`flush_rewrite_rules(false)` soft refresh inside the transaction. It restores
the WP-CLI process's in-memory rewrite state, verifies the raw ordered option
fingerprint, row ID/autoload preservation and exact canonical single-route
mappings, then runs the final
idempotence check before commit. Exact rules skip the refresh, and literal soft
mode never writes `.htaccess` or `web.config`.

## Ownership And Conflict Rules

Every managed term, attachment and content entity receives a stable managed
key, manifest version, source fingerprint, last-applied state fingerprint and
release commit. Attachments also retain their source binary SHA-256.

Resolution is deterministic:

1. Look up the stable managed key and all current/legacy slugs within the exact
   taxonomy or post type.
2. More than one match, or key and slug resolving to different IDs, is a
   conflict.
3. No match is `create`.
4. An unowned slug match may be adopted only when its complete canonical state
   exactly equals the manifest; otherwise it is a conflict.
5. A managed match may update only when its current canonical state still
   equals its stored last-applied fingerprint. Manual drift is a conflict.
6. Exact managed state is `unchanged`. Existing matching IDs are never
   replaced.
7. Managed media binary drift is always a conflict; a changed binary requires
   a new reviewed/versioned asset identity.

The reconciler never searches across unrelated types, overwrites an unowned
near-match, deletes content, or interprets ambiguity. Published `nl` or `de`
root pages are conflicts; unpublished locale content is untouched, and the
manifest never creates those routes.

## Local Runtime Evidence

The corrected real WP-CLI command was executed in a disposable WordPress 7.1 /
PHP 8.1 Playground with the local theme and plugin mounted. With a populated
core rule set missing only FarmTree rules, its write-free dry run reported
`create: 90`, `update: 1`, `unchanged: 2`, `conflict: 0`, `skipped: 1` with
run-specific plan digest
`a028de0c27ead9dfb485f26ee623053efc24804231d738e452c35b1dc0580456`.
The creates are six terms, 34 media objects, 40 private content entities and ten
embedded Team identities. The two unchanged operations prove the absent
reserved `/nl/` and `/de/` identities; the skipped operation is the
unrequested front-page option; the update is the disclosed soft rewrite
finalization containing 17 exact generated rules per CPT and both canonical
single routes. Snapshots of all 12 database tables/options, targeted filesystem
metadata/content and non-SELECT queries were identical across plugin load/CLI
registration, model registration, construction, `build_plan()` and the CLI dry
run. Actual activation/deactivation added and removed only the exact FarmTree
plugin identity through WordPress core `active_plugins` bookkeeping;
`rewrite_rules`, content and files remained identical.

In a disposable local-only apply/idempotence probe, the same manifest created
90 managed operations and skipped the front-page option. All managed content
remained `private` (attachments remained `inherit`). The next dry run reported
`create: 0`, `update: 0`, `unchanged: 92`, `conflict: 0`, `skipped: 1`.
That historical APPLY probe predates the rewrite operation. The current
finalizer is source-sealed and its plan is exercised in the write-free runtime
probe, but it was not executed because this correction explicitly prohibits
APPLY; after a future approved apply, the expected converged summary is 93
unchanged and one skipped operation.
Changing the managed Contact ownership key to a foreign key produced exactly
one `candidate_owned_by_other_key` conflict. Restoring ownership and changing
its title manually produced exactly one
`owned_item_changed_since_apply` conflict; neither case was updated.

A separate ownership probe pre-created an exact unowned Contact page. The plan
reported `update / adopt_exact`, disclosed the precise ownership-metadata
write, and apply preserved its existing ID. An unrelated manual draft remained
byte-for-byte unchanged. Adding a second holder of the Contact managed key
stopped as `global_managed_key_conflict`; publishing `/nl/` stopped as
`reserved_locale_publish_future_or_private`.

An intentional mid-media failure probe restored the exact pre-apply database
and option snapshot, reported successful transaction rollback, invalidated all
touched post/term/option caches, removed the original upload plus five generated
variants with zero cleanup failures, and reproduced the original plan digest.

These local writes existed only inside the disposable Playground. They are not
authorization to run the command against production. Production content,
activation, Coming Soon, indexing, private access, DNS and SSL were untouched.

## Write-Surface And Volatile-State Audit

`npm run validate:content-safety` tokenizes and source-seals the exact four
deployable plugin runtime files at
`b2682381bac6fda4710692a730444ed233fc9601a998f7cc4e9824faa0b669d9`.
Any runtime source byte change requires an explicit re-audit. The validator
fails on a changed persistence-call inventory, lifecycle hook, dynamic
execution, native filesystem write or direct modifying SQL; dynamic lock SQL
is one private, caller-pinned, comment-free `SELECT` helper. The sole soft flush
must stay private, literal-false and rooted only at `apply_plan()`. Every other
writer is pinned to the apply graph: transaction control, managed term/post/
media and metadata writes, revisions, relationships, optional front-page
settings, cache invalidation and rollback cleanup.

`npm run validate:wordpress-state-safety` rejects an incomplete capture and
uses no whole-table ignore. It accepts only same-version/same-instance cron
timestamp progression, deletion of an exact noncritical transient pair proven
expired at baseline, same-payload theme-pattern cache TTL rotation, a
field-preserving `update_plugins` timestamp inside the observation window, and
deletion of an old identity-empty, unreferenced, unowned core auto-draft. All 66
positive/negative fixtures prove that changed hooks/arguments/schedules/
instance keys, critical transients, changed cache/update payloads, autoload
changes, unknown options, incomplete/schema captures and content/meta/taxonomy/
user mutations fail closed. Site/home/search/front-page, plugin/theme/rewrite/
roles, SeedProd/private access, FarmTree ownership/content and `ft_ai_*` state
are always release-critical.

## Approval Boundary

Code deployment, plugin/theme activation and content materialization are
separate operations. This release-preparation change dispatches none of them.
Any future production dry run is read-only but still requires an explicitly
approved runtime session. Any future `--apply`, activation or publication also
requires the repository's backup and Gate 6 approvals. `/nl/` and `/de/` remain
unpublished until approved translations exist.
