# Motion and responsive media delivery — release02

Status: DEPLOYED; browser QA in progress. Remediation commit `ce4cdcc64ba90f8938488c4bdf38da612e4fa7c0`
was followed by runner-only portability correction
`66134c6c7f60cca1e12abca6658f71591fb04ea1`. The latter is now live after a
successful guarded Native-only release; exact runtime bytes are identical to
the first candidate. Production performance and full QA are not yet closed.

## Scope and reason

EXP-A11Y-02: persistent, independently operated pause controls for hero slides
and breathing, Platform animation, partner logos, testimonials, globe animation
and footer quotes. Preserve approved content, animation direction, keyboard/
pointer manual operation and reduced-motion preference. Controls use in-memory
state only, stable pressed semantics, visible Playing/Paused feedback and44px
minimum target dimensions. No database/content/route/indexing changes.

PERF-GIF: the existing exact14.5-second Platform animation is18,451,150bytes.
At390px native lazy proximity loading begins below the viewport. Under a4xCPU,
150ms/1.6Mbps lab profile, native load remains incomplete while the GIF transfers.
Browser-only substitution of its existing poster resolves load at2086ms without
changing rendered dimensions. This is causal evidence for delivery cost under
the tested conditions, not a universal Chromium root-cause explanation.
Five later testimonial requests had QUIC errors in that control, after load;
that diagnostic must not be described as an error-free acceptance run.

The existing MP4/WebM assets are57seconds and must not replace the approved
14.5-second GIF. Candidate delivery optimisation defers only that exact GIF until
viewport intersection while showing its existing poster. Normal editor-managed
image replacements remain unaffected. Implementation now requires exact core
Image/class/asset identity and opts out for custom responsive attributes.
An isolated real-WordPress fixture passes14scope/attribute/priority checks.
The full core/WordPress/anonymous suite passes again after the render-filter
change. Final four-width motion/GIF browser rerun passes (axe/console0,
maximum initial shift sum0.002278), including network deferral, offscreen resume,
reduced motion and no-JS. Local36-run performance confirms complete loads,
but does not pass absolute mobile LCP targets; transport differs from production.
See PERFORMANCE-MATRIX.md for failed gates and the approved autoplay limitation.

PERF-BLOG: same-crop800x600 responsive candidate added in all three existing
formats for11 approved photographs (33files,2,992,056bytes). Original inputs
match prior source hashes;132 prior exports and evidence records are unchanged.
Only Blog featured lead/cards opt in; full-height Proof/News heroes and other
core Images retain their prior candidate sets to avoid cover-resolution loss.
No image selection, saved content, media identity or crop changes. Incremental
compiler checks prior hashes before writes; full compilation retains bootstrap
support. Narrowed-scope six-context browser validation passes; core/WP/anonymous
checks pass afterward. Independent source review finds no concrete defect.
Actual production performance remains gated. A synthetic-asset A/B script was
prepared but not used to claim speed: intercepted local bytes are not equivalent
to real CDN transfer. Measure the real released assets after audited deployment.

## Evidence before GIF change

- Local motion320/390/1440/1920: keyboard/touch, persistent pause, manual globe,
  reduced-motion transitions, axe/overflow/console checks pass.
- Existing interaction/no-JS and six-width testimonial tests pass in their
  recorded scopes; final post-optimisation rerun remains required.
- `npm test`, `wp:verify`, `wp:verify:anonymous`: PASS;40routes/104internal links,
  zero broken links. These results precede the pending render-filter change.
- Independent final motion/runner source review: no concrete critical defect.
- Independent medium-asset review: all132existing hashes/records preserved,
  all33new hashes/dimensions/allowlist entries pass. Full-compiler bootstrap
  regression identified and fixed by limiting preservation guards to incremental
  mode; no assets regenerated in that correction.
- Fresh production route audit:46routes,45sitemap URLs,46internal destinations,
  zero audit failures; does not validate the still-local motion changes.

Lifecycle evidence SHA256:

- `qa/live-360/experience/gif-lifecycle.json`:
  `56a7327ad872671196a1f5b52add68445d677d3475bfacd93fcda5deca0995ad`
- `qa/live-360/experience/gif-lifecycle-poster-control.json`:
  `d8d8da8b89900436d177ea716576dce1072d041b2e4f9ed0733385454d51ceb8`
- Final `qa/live-360/motion/local.json`:
  `05e9b286fda7a7c18f09eb24b56a3eac93363a1dc6eb0f7a36de9ac42422ec70`

## Pre-deployment checkpoint (historical)

Local source/scope/browser checks pass. Remaining: focused commit and exact
artifact audit; approved feature-branch push; fresh
off-webroot recovery backup and checksum; theme-only guarded swap; actual live
motion/performance/navigation/CTA/image/metadata/public-state regression. No
content reconciler APPLY is part of this theme release. Fresh managed-content
dry-run remains separately blocked on exact bootstrap-risk approval.

Runner evidence improvement includes absolute PHP-lint output in the rollback
checksum set and verifies that set after deployment before disabling rollback.
This does not explain the first release's missing original lint evidence.

## Pre-swap host compatibility failure

The first release attempt stopped at PHP lint input redirection: `/dev/fd/62`
was unavailable for Bash process substitution. No active swap, rollback or
state query occurred; only off-webroot package/staging files were created.
Reference: `live360-ce4cdcc64ba90f8938488c4bdf38da612e4fa7c0-1789848437569`.
Do not delete these diagnostic files or call the partial stage a recovery backup.
All217active Native+Content file records match the reviewed a23441b baseline:
canonical sorted aggregate `7665c120596b1b5a45b4c94d357c36d74613a7db565290d5cdcb196854d3aabc`
(standard artifact `wordpress/` prefix removed). `pre-theme` and `state-before.txt`
are absent. The deployment did not reach the database or replacement steps.

Source correction uses an independently checked regular NUL-separated PHP file
list and requires nonempty discovery and lint output. Regression now must lint
an actual PHP fixture and stop before replacement on lint failure. This is
runner-only; the validated Native artifact remains unchanged. A new exact-SHA
commit/build/audit was required before retry, with a fresh recovery directory.

## Successful retry

Deployed SHA `66134c6c7f60cca1e12abca6658f71591fb04ea1`; origin feature branch
matches. Exact artifact250runtime files,114excluded,55,905,369bytes;
SHA256SUMS digest `be0a54dd4fdd79960e44e90809f994ba2a6e7ea023eb3750e75f973ed5c2165a`.
Recovery reference `live360-66134c6c7f60cca1e12abca6658f71591fb04ea1-1789848785091`.
Runner reports PUBLIC_STATE_GATES_PASS and THEME_RELEASE_VERIFIED; database
writes none by runner. Content and legacy hashes plus protected snapshots
match before/after. No rollback required. Independent read-only SSH verification
passes: all250active records exactly match the artifact, no extras/symlinks;
Content/legacy hashes and protected snapshots equal. Backup52,164,450bytes,
readable/nonzero/tar-valid; archiveSHA256
`84ea9111f869c3677b480662eb73d01c7299d34111fe1c8ee7f12891c89dea81`.
Backup checksum-set digest
`777a9a3b178ca54be2105e837ecb401c1780cedac402ec7c94c8c36bdfbc45ff`;
all entries pass, including five successful PHP lint lines. Real production
browser/performance QA continues; do not infer it from swap success.

Current real-browser results: six medium-selection contexts PASS, preserving
Proof candidate behavior and stable geometry; four motion widths plus reduced/
no-JS cases PASS. Exact-GIF initial viewport deferral and persistent pause pass.
The release-specific aggregate suite has now completed:33menu views,
200trusted pointer activations,162CTA views (135existing-CTA cases),42LCP image
views,10prose views,19metadata responses and6security-header responses PASS.
The testimonial regression passes320/390/768/1024/1440/1920 including reduced
motion. No errors were reported by that suite. Cold performance and expanded
all-route accessibility/text-spacing coverage remain pending; this is not a
whole-programme completion or PHP fatal-log assurance.

- `qa/live-360/documentary-medium-production.json`:
  `4493cbdd87445818edb3c63ed07e8df8373d4d776731764c49ca8bd24d50aa4e`
- `qa/live-360/motion/production.json`:
  `1916f7aeb0e7b5729c5b446c4c46dcbc56e359f87a85bb0532efe3afda43f76e`
