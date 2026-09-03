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

The 0.4.3 postcondition correction keeps stable manifest tokens in plans but
runs WordPress save canonicalization against syntactically valid theme URLs and
deterministic media stand-ins. APPLY passes unsanitized manifest fields to
`wp_insert_post()` / `wp_update_post()`, so WordPress applies its save filters
exactly once. The immediate postcondition independently canonicalizes the exact
expanded write state once, restores stable tokens, and compares every managed
field. A mismatch identifies the first field and reports bounded
length/SHA-256 evidence for long values. Ownership, manifest, source,
last-applied, release-commit and backup-evidence metadata are then verified as
exact single values before the operation can continue.

The two public-capable CPTs require persisted pretty-permalink rules, so
dry-run also discloses one `rewrite-rules` option operation. It reads the raw
option row directly, preserves its option ID, autoload state and ordered rule
fingerprint, and derives exactly 17 canonical rules per CPT by comparing an
isolated generator with and without only the two reviewed permastructs. Global
runtime generation is used only to locate unambiguous neighboring anchors. The
persisted target begins with the raw stored rule map, removes/reinserts only
FarmTree identities at those anchors and preserves every unrelated key, query
and relative position exactly. Runtime-only SeedProd, `sp-login` or other
plugin rules are reported but never adopted into FarmTree's target. Missing
anchors, reversed anchors, namespace collision, changed FarmTree query or a
route-shadowing unrelated rule is a conflict; absent or empty stored rule state
also fails closed.

After every gate and managed write succeeds, APPLY alone persists the exact
reviewed merged array with `update_option()`, then verifies the raw ordered
fingerprint, row ID/autoload preservation, canonical route precedence and
idempotence before commit. The deployable plugin contains no
`flush_rewrite_rules()` call and cannot write `.htaccess` or `web.config`.

The CLI's default dry-run branch additionally installs a scoped final-query
firewall only around `build_plan()`. It allows `SELECT`, `SHOW`, `DESCRIBE` and
`EXPLAIN`; every other SQL operation is rejected from the `query` filter before
wpdb reaches its driver. The failure report includes a redacted fingerprint,
SHA-256, safe table/entity context and classified stack origin without query
values. The filter is always removed in `finally` and does not affect normal
WordPress runtime or APPLY.

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
`8205ecc8188c7842ee7ad33aa5e1a08b19fad655e0b5b01d544e29c03085fc66`.
The creates are six terms, 34 media objects, 40 private content entities and ten
embedded Team identities. The two unchanged operations prove the absent
reserved `/nl/` and `/de/` identities; the skipped operation is the
unrequested front-page option; the update is the disclosed exact FarmTree-only
merge containing 17 generated rules per CPT and both canonical single routes.
Snapshots of all 12 database tables/options, targeted filesystem
metadata/content and non-SELECT queries were identical across plugin load/CLI
registration, model registration, construction, `build_plan()` and the CLI dry
run. Actual activation/deactivation added and removed only the exact FarmTree
plugin identity through WordPress core `active_plugins` bookkeeping;
`rewrite_rules`, content and files remained identical.

The scoped SQL-firewall regression allowed `SELECT` and blocked raw `INSERT`,
`UPDATE`, `DELETE` and `REPLACE` plus `update_option()`, `wp_insert_post()` and
`update_post_meta()` before execution. Each case emitted only redacted query,
table and stack evidence; complete before/after snapshots proved zero database
or filesystem change.

In a disposable local-only apply/idempotence probe, the same manifest created
90 managed operations and skipped the front-page option. All managed content
remained `private` (attachments remained `inherit`). The next dry run reported
`create: 0`, `update: 0`, `unchanged: 92`, `conflict: 0`, `skipped: 1`.
That historical full APPLY probe predates the rewrite operation. A focused
local-only regression now invokes the private rewrite finalizer against a
populated disposable option: it persists exactly 34 FarmTree identities,
preserves every unrelated key/query/order plus option ID/autoload, excludes 18
runtime-only SeedProd/`sp-login` rules, and replans as `unchanged`. Ambiguous
anchors, route shadowing and a changed canonical identity each conflict. The
future complete apply is still expected to converge to 93 unchanged and one
skipped operation.
Changing the managed Contact ownership key to a foreign key produced exactly
one `candidate_owned_by_other_key` conflict. Restoring ownership and changing
its title manually produced exactly one
`owned_item_changed_since_apply` conflict; neither case was updated.

The Homepage postcondition regression recreates the production failure mode
with a non-idempotent WordPress content-save canonicalizer. Against baseline
`49976f0`, normalized desired Homepage content contained one canonical marker
(`45785` bytes, SHA-256 `6befe339…`) while persisted normalized content
contained two (`45818` bytes, SHA-256 `092088a1…`), and APPLY rolled back at
`page.en.home`. The corrected one-pass path commits all 90 managed operations,
matches normalized Homepage content exactly, and replans as `0 create / 0
update / 93 unchanged / 0 conflict / 1 skipped`. Homepage, Team, a normal Page,
Proof Story, Customer Segment and News representative all converge. Deliberate
wrong type/title/slug/status/content and all six ownership/audit metadata
values still fail exact field verification.

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
`07f118d592e3e1f768dbea8d9b56d71caec4f589412c2302201f4eb23c3a4a80`.
Any runtime source byte change requires an explicit re-audit. The validator
fails on a changed persistence-call inventory, lifecycle hook, dynamic
execution, native filesystem write or direct modifying SQL; dynamic lock SQL
is one private, caller-pinned, comment-free `SELECT` helper. Global rewrite
flushing is forbidden and the exact merged-option writer remains private and
rooted only at `apply_plan()`. Every other writer is pinned to the apply graph:
transaction control, managed term/post/
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
