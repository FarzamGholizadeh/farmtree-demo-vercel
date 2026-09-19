# Exact editorial/documentary post-launch scope

User authorization: 2026-09-19, source
`09ddf53098213e7e5a8cb51de57723f1fba0bc8e`, feature branch only. This supersedes
historical private-launch defaults for this specific release. Keep public
indexing enabled, Coming Soon OFF, Native/Content active, Homepage public,
NL/DE unpublished and FT Bot OFF. No activation or publication changes.

## Independent, fail-closed scope

`--post-launch-editorial` is separate from the unchanged six-page
`--post-launch-images` contract. The modes are mutually exclusive. It pins the
entire approved manifest, the 23 exact baseline source hashes from `47313843`,
each entity's exact changed-field list, and nine new media identities/metadata/
binary hashes. Existing ownership and last-applied/current canonical hashes
must match. No adoption, arbitrary content, legal, Team, options, rewrite,
publication, slug, front-page or old-media replacement is permitted.

Inventory: seven Page bodies (Home, Proof Stories, Case Studies, Vacancies,
Acknowledgements, Licenses, Platform Videos); three Customer Segment bodies
(Development Banks, NGOs, Industry Associations); four Proof Story bodies and
featured images; nine News bodies/featured images, with the approved species-data
excerpt correction only. The nine creates are distinct shared attachments for
existing approved documentary content JPEGs: field system, community field visit,
dryland tree landscape, green field climate context, integrated agroforestry,
mixed agricultural landscape, onion harvest, plant observation, structured plots.
Existing 34 attachments remain unchanged. See `FT-EDITORIAL-IMAGE-AUDIT.md`.

Source fingerprints are intentionally distinct from environment-dependent saved
HTML hashes. WordPress save filters differ between local and production (image
tag spacing, ampersands and allowed ARIA attributes). Exact baseline source pins
match all 23 production entities; ordinary current/applied hashes independently
reject manual drift. No content normalization or ownership relaxation was added.

The plan digest binds the selected mode and critical public option hashes.
Fresh locked planning and the final idempotence/public-state checks execute
inside the existing transaction. A changed plan is never silently accepted.
SQL-firewalled dry-run remains write-free. Failure rolls back DB work and newly
created files; auto-increments, cache and external hook effects retain the
previously documented residual risks. Fresh verified backups are mandatory.

## Audited release sequence

1. Push approved source; validate safety changes and create/push one focused
   safety commit. Build/audit a clean artifact from that exact final SHA.
2. Create fresh off-webroot database/runtime backups; verify non-zero readable
   files and checksums. Preserve earlier backups and the `farmtree` theme.
3. Stage the audited artifact outside the webroot. Verify every checksum and
   exact file inventory. Copy `scripts/run-staged-editorial.php` from the same
   final SHA outside the webroot; verify its checksum independently.
4. Run `wp --url=https://farmtree.eu --skip-plugins=farmtree-content eval-file`
   with the staged runner, staged plugin root, final SHA and `dry-run`. Skipping
   the installed plugin is per CLI process only: active_plugins is unchanged,
   and public requests continue using the installed runtime. The runner loads
   only the candidate plugin and registers its two existing CPT definitions;
   it performs no activation, flush or settings update.
5. Capture complete before/after DB evidence. Review every create/update,
   ownership, ID, slug, reason and changed field. Require zero conflicts and
   only the approved inventory; stop on any unexplained difference.
6. Use the same runner with `apply`, the exact reviewed plan digest and verified
   backup-evidence digest. The runner supplies the dedicated confirmation
   `APPLY APPROVED EDITORIAL DOCUMENTARY UPDATES` and existing public-state /
   publication-preservation confirmations. Re-run dry-run: zero changes/conflicts.
7. Swap only Native/Content runtime directories with rollback protection, then
   verify all runtime checksums. No unrelated runtime or configuration changes.
8. Real production route, copy, image, five-width responsive, motion, indexing
   and performance QA; stop/restore on critical regressions. Keep recovery data.

## Local evidence

The disposable migration enforces exact approved-manifest parity and covers
9 creates / 23 updates / 0 conflicts, then 102 unchanged. It verifies all 40
content identities and 34 prior attachments, protected options, editorial
fingerprint/field/manifest/media rejections, manual drift, mutually exclusive
modes and rollback of a hook-induced indexing change. The six-page regression
continues independently. Run the full test, WordPress, anonymous, lifecycle,
postcondition, browser and artifact suites before production mutation.

Production release results are pending; this document does not claim deployment.
