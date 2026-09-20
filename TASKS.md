# FarmTree Tasks

## Isolated News12 release — 20 September 2026

- [x] Isolate exact twelve posts/twelve media/five category targets.
- [x] Exclude all six Pages; preserve dedicated Blog template independence.
- [x] Verify zero-write dry-run, exact idempotence and failure rollback locally.
- [x] Verify local WordPress, anonymous routes and ten-width editorial browser QA.
- [ ] Push audited commit; verify fresh production backups and exact News12 plan.
- [ ] Apply reviewed digest only after all gates; verify production and Hero preservation.

## 320px pointer diagnostic — 2026-09-19

- [x] Reproduce timeout and distinguish completed navigation from watcher failure.
- [x] Fix the test only; preserve all runtime/menu content and styling.
- [x] Complete four-width mouse/touch/focus matrix before local commit.

## Shared FARMTREE menu cleanup — 2026-09-19

- [x] Remove only For Investors / For Advisors, including the shared mobile menu.
- [x] Preserve all Customer Segments links and all unrelated navigation.
- [ ] Production release requires separate explicit approval.

## Shared CTA layout — local, 2026-09-19

- [x] Fix the shared outer block alignment without changing inner design/copy.
- [x] Add responsive CTA geometry/style/destination/Homepage regression checks.
- [ ] Push/deploy only with explicit approval; production unchanged in this task.

## Authorized LCP priority fix — 2026-09-19

- [x] Preserve native primary featured-image priorities without eager cards.
- [x] Add local/production rendered-image priority regression.
- [ ] Complete exact-artifact theme-only deployment and production QA.

## Editorial/documentary refinement — 2026-09-18

- [x] Review all 20 supplied photographs and whole-site copy without new claims.
- [x] Improve Clients, Proof Stories and News using editor-managed documentary media.
- [x] Preserve old assets/IDs, publication states, routes, legal copy and testimonials.
- [x] Validate local routes, links, image blocks, runtime side effects and migration.
- [ ] Approve push; prepare/review a broader public-safe production release scope
  and real dry-run before deployment. Do not reuse the six-page APPLY authorization.

## Documentary production release — 2026-09-18

- [x] Push/deploy approved 47313843 with verified off-webroot rollback backups.
- [x] Require six-update/zero-conflict dry-run, apply exact digest, verify idempotence.
- [x] Preserve public settings and verify photos, formats, routes and testimonials.
- [ ] Strict performance non-regression remains unproven by variable synthetic
  samples; preserve recorded measurements rather than claim an unsupported pass.

## Post-launch public-safe image update — 2026-09-18

- [x] Push exactly approved photo SHA 51ba0f5e to feature branch.
- [x] Prepare scoped public-state-preserving reconciler and disposable regressions.
- [x] Document separate public release path without weakening private workflow.
- [ ] Approve new audited code push/deployment and gated production content APPLY.

## Documentary photography — 2026-09-18

- [x] Audit upload-order descriptions and create manifest/placement map first.
- [x] Export 11 selected photos to 132 metadata-stripped responsive assets.
- [x] Integrate existing hero and contextual figures without changing story/legal copy.
- [x] Validate assets, release classification, WordPress delivery/editability,
  anonymous routes, reconciliation and responsive/accessibility behavior locally.
- [ ] Review and explicitly approve a future photo release/push/deployment.
  Prior launch authorization is not reused. Production remains untouched.

Public launch preparation (2026-09-18): explicit launch authorization supersedes
historical private-release gates. Source now uses left-to-right testimonial
travel, an intentional mailto-only Contact CTA and production indexing governed
by blog_public, with permanent loopback noindex. Approved legal source is unchanged.
Local direction/coverage and WordPress checks pass. The user approved Frank's
production edits on Homepage 439 and Proof Story 460 as authoritative:
“Farm Valuation” and the saved block structure are synchronized to source;
the existing farm-value-projection URL remains unchanged. Fingerprint adoption
is limited to these exact approved snapshots. Fresh off-webroot database/runtime
recovery backups are verified; the authorized launch workflow continues after
conflict-free reconciliation and validation.

_Last updated: 2026-09-18_

## Completed Governance Task

### FT-WEB-001 - Production-safe governance baseline

Status: committed and pushed to `origin/wordpress-integration`.

Scope:

- Fix the accidental first-character typo in root `index.html`.
- Create or standardize governance documentation.
- Align repository docs with `https://farmtree.eu/`, `wordpress-integration`, the FarmTree WordPress theme, FarmTree Core plugin, and FarmTree AI Assistant plugin.
- Add the six approval gates to project governance docs.
- Add a GitHub `production` environment boundary to the WordPress deployment workflow.
- Make the Vimexx SSH test workflow manual-only.

Out of scope:

- WordPress theme runtime behavior.
- Core plugin runtime behavior.
- AI Assistant plugin runtime behavior.
- Production WordPress content, database, theme activation, plugin activation, and host configuration changes.
- Pushes, merges, deployments, and GitHub Actions runs.

Acceptance:

- Required governance docs exist and are production-aligned.
- `index.html` typo is fixed with no other content changes.
- Deployment workflow requires production approval before SSH/rsync.
- SSH test workflow is manual-only.
- No forbidden files are changed.
- No secrets are introduced.

## Deferred Implementation Backlog

## Reference Sprint

### FT-WP-001 - Homepage Hero Gutenberg Pilot

Status: retained as architecture reference; no further expansion.

The pilot remains in the production theme until the isolated rebuild is stable.

## Active Sprint

### FT-NATIVE-004A - Audited release preparation

Status: production Homepage and rewrite-finalization root causes proven; the
0.4.6 release correction is locally validated before the authorized production
release loop continues.

The release path now stages an exhaustive allowlisted artifact instead of the
raw theme/plugin trees. A WP-CLI-only, dry-run-first content reconciler manages
40 English entities, six categories and 34 media assets by stable identity and
fingerprint, preserves matching IDs, stops on ambiguous/unowned/manual drift,
and never imports or deletes unrelated content. Raw content JSON, repository
documentation, QA data and unused derivatives are excluded from the artifact.
Architecture, commands, ownership rules and local evidence are recorded in
`docs/FT-NATIVE-RELEASE-PREPARATION.md`.

The 0.4.2 correction removes all plugin lifecycle hooks, encloses dry-run
planning in a scoped read-only SQL firewall, persists only an exact FarmTree
34-rule APPLY target without global rewrite flushing, statically classifies the
complete runtime write surface and retains the fail-closed semantic volatility
model plus disposable activation/deactivation zero-side-effect probe.

The 0.4.3 correction removes double application of WordPress post save filters,
canonicalizes valid token stand-ins during planning, verifies the exact
one-pass persisted representation and reports the first mismatching field. Its
full-manifest Homepage regression covers every managed entity family,
idempotence and deliberate state/ownership/audit-metadata failures.

The 0.4.4 correction mirrors WordPress 7.1's `utf8`/`utf8mb3`
`wp_encode_emoji()` step. A rollback-protected production trace proved seven
Homepage `↗` characters were converted to `&#x2197;`, exactly reproducing the
historical 35-byte mismatch; complete database/filesystem/protection snapshots
were identical after rollback. The regression pins both production `utf8mb3`
and unchanged `utf8mb4` behavior and the full disposable APPLY remains
idempotent.

The 0.4.5 correction suppresses only WordPress admin's
`update_home_siteurl()` callback while APPLY writes the managed
`page_on_front`, restores it at the same priority in `finally`, and retains the
exact audited FarmTree-only rewrite finalizer. Production tracing proved the
callback was the sole source of the unexpected 147-rule global flush. The
focused WordPress 7.1 regression proves the callback is restored and no
intermediate rewrite persistence occurs.

The 0.4.6 correction excludes only the proven runtime-only
`runtime_unrelated_rules_not_adopted` report from the final equality check.
Production tracing proved the raw option identity/hash, exact target, merged
rules, anchors, canonical rules and unrelated persisted rules remained exact
after the managed front-page update. The diagnostic is neither adopted nor
persisted; every release-critical comparison remains fail-closed.

The 0.4.7 legal-review preparation keeps both legal pages private, adds the
fact-audited review copy, closes comments as managed state for exactly nine News
posts and replaces Google Fonts requests with audited local WOFF2/OFL runtime
files. The separately authorised production settings cleanup is complete;
publication, font deployment and public launch remain approval-gated.

The approved baseline `210ce51f7c4b573b51cf96bba1b575918757e9d1` was pushed
only to `origin/feat/wordpress-native-rebuild`. The audited preparation commit
is a separate feature-branch release candidate; production remains untouched.

### FT-NATIVE-002 - Native Homepage

Status: Local implementation, approved visual-parity correction, controlled
Homepage/Team refinement, automated regression, real local WordPress runtime
validation and rendered browser QA complete; stopped at pre-release.

The Frank-approved Homepage has been built in `farmtree-native` with core
blocks, content-only locked patterns and a read-only local preview sourced from
the real native Header/Footer and `theme.json`. The production visual language
is restored without changing the `farmtree` rollback theme. The current source
includes a one-H1/four-image Hero, the exact supplied Platform GIF with a
reduced-motion poster, asset-backed brand-logo pattern, five-card Bento
menu, English `/` plus reserved unpublished `/nl/` and `/de/` locale contracts,
and a no-PII email-only quotation unavailable state.
Scope, evidence and remaining production/publication gates are defined in
`CURRENT_SPRINT.md` and `SPRINT_REPORT.md`.

The isolated loopback-only WordPress Playground runtime recognizes the Block
Theme and plugin, persists the locally published QA Homepage and revision history, registers the
required templates/parts/patterns and renders its Query Loop and assets. The
restart path now reuses an already-running Playground and always reconstructs
the repository fixtures, including after an ephemeral database reset. The
local gate is complete: screenshots, console, sequential keyboard/focus,
Chrome accessibility-tree smoke testing, semantic accessibility, contrast,
interactions and overflow were reviewed at all nine
target widths. Release, production and final-content work remains explicitly
approval-gated or deferred as recorded in the sprint evidence.

The current refinement adds a generated illustrative field-planning Hero,
Natural Earth-derived two-axis Globe, a measured Card 3-centred and
boundary-equivalent five-testimonial marquee with `aria-hidden`, inert visual
clones and production-evidence-driven full-width coverage at eight sampled phases,
connector-free Technology cards, non-moving button hover, editorial News
labels, balanced Footer copy and a ten-person 3/2/1-column Team page with a
generated illustrative header. Human asset, claim and permission review remains
the publication gate.

### FT-NATIVE-003 - Publication-readiness enhancement

Status: Local private-first implementation and validation complete; stopped at
pre-release.

The controlled `customer_segment` and `proof_story` models, ten source-ordered
private segment entries, four private Proof Stories, 15 private English support
pages, nine editorial drafts, native templates, restrained motion, discovery
metadata, English-primary locale contract and enforced noindex gate are
complete locally. Evidence is recorded in
`docs/FT-NATIVE-003-ENHANCEMENT-READINESS.md`.

## Parallel Runtime Gate

### FT-NATIVE-001B - Private Production Runtime Validation

Status: Pushed source validated; runtime temporarily blocked by orphaned GitHub
Actions run `32985108587`. PR #3 completed
the default-branch reconciliation at `3df2ae2`: the native workflow is active
and manual-only, and the superseded staging workflow is retired. Matching
recoverable files/database backup evidence and explicit public `noindex` remain
release gates and are now verified. Independent Required Reviewer protection is
a deferred governance enhancement under the private/manual compensating
release policy; it does not block development or a later explicitly approved
dispatch.

## Deferred Implementation Backlog

- FT-NATIVE-003B - Expand the admin experience and publish locale-aware routing
  only after translated content is approved; `/` is English and `/nl/` plus
  `/de/` are currently reserved and unpublished.
- FT-NATIVE-004 - Human-review and publish the completed private English pages,
  navigation and clean routes only after the publication gates pass.
- FT-NATIVE-005 - Prepare an explicitly approved cutover after content,
  permission, legal, assistive-technology and runtime gates pass.
- FT-SEO-001 - Reconfirm production SEO-plugin ownership and sitemap behavior
  before activation; native descriptions, canonicals, Open Graph, schema and
  noindex controls are complete locally.
- FT-WEB-004 - Add and verify a privacy-reviewed production delivery backend
  only if online quotation submission is required. The current modal safely
  collects no data and offers the approved email fallback.
- FT-WP-005 - Add browser-based production verification checklist after an approved deployment.
# Public launch acceptance — 2026-09-18

- [x] Preserve Frank-approved Farm Valuation content and public Homepage 439.
- [x] Publish only 40 approved managed English entities; synchronize fingerprints.
- [x] Require conflict-free/idempotent production reconciliation (93 unchanged).
- [x] Deploy checksum-verified runtime 7185c9b with off-webroot recovery backups.
- [x] Complete anonymous route/link, responsive, interaction and testimonial QA.
- [x] Remove Coming Soon/release noindex; enable public indexing; keep NL/DE and FT Bot off.
- [ ] Optional human check: staff LinkedIn profiles block automated requests (HTTP 999).
# Editorial release safety — 2026-09-19

- [x] Push explicitly approved 09ddf530 source.
- [x] Add an independent exact editorial/media scope; preserve six-page guard.
- [x] Validate local scoped migration, ownership rejection and public-state rollback.
- [ ] Finish audited safety commit/artifact, then real production dry-run/APPLY,
  checksum-verified deployment and public production QA under the explicit approval.
