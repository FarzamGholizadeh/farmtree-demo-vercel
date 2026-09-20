# FarmTree Live360 — technical handoff draft

## Current continuation — 20 September 2026

The owner has deferred the unrecoverable historical cron evidence as
**UNRESOLVED HISTORICAL VOLATILITY**, not a benign PASS. The risk register states
the observed limits and conditional scoring treatment. This historical item no
longer blocks Live360. Future scoped diagnostics are locally implemented/tested;
they preserve—not replace—the existing mutation controls.

News hub and twelve source-led articles were completed in `5068cf9`. The new
explicit News12 release profile reuses the existing public-state, ownership,
SQL-firewall, reviewed-digest and transaction guards. Disposable WordPress tests
produce 29 creates (12 posts, 12 media, five categories), no updates/conflicts,
then 131 unchanged. All existing managed records remain unchanged; manual edits
and stale plans stop. Injected indexing mutation rolls back database and newly
created media. Production News publication and final programme QA remain pending.

The prospective News gate also verifies unrelated database rows and uploads before
COMMIT through the same transaction connection. A narrowly evidenced core cache
effect is accounted for only during the five approved category creations:
`category_children` may receive a new `option_id` after delete/reinsert, while its
name, value, autoload and all other columns must remain identical. No other option
identity change is allowed, and dry-run/runtime-swap comparisons remain exact.
This is not a cron exception or permission to change protected configuration.

Release order is off-webroot preparation/backups → guarded News preflight →
verified runtime replacement → fresh guarded News plan → reviewed-digest APPLY →
idempotence and production QA. Runtime-first is required because the live baseline
Homepage selects the newest posts, while the candidate pins its three approved
cards; publishing first would create an unintended interim Homepage change.
These are prospective News operations, not a replay of the historical dry-run.

The separate uncommitted Hero interaction change is preserved and is not silently
included in the News artifact. No historic dry-run was repeated.

Historical handoff checkpoint: subsequent release5104687 and its scoped production
QA are complete; see [RELEASE-03-PRODUCTION.md](RELEASE-03-PRODUCTION.md). Statements
below describing an unpushed candidate or release authorization refer to the
earlier checkpoint, not current production. Broader acceptance remains incomplete.

IN PROGRESS. Prepared for review, not the final completed report.

## Authority and provenance

Tracked candidate: 5104687c27b7b6aa69b100e55d905a8107726ec7.
Recorded deployed release: 66134c6c7f60cca1e12abca6658f71591fb04ea1.
The fresh browser report's sourceSHA identifies the local harness, not the live
theme. Never use local candidate PASS results to close production findings.

## Evidence map

The docs/audit/live-360/FINAL-EVIDENCE-INDEX.md pins fifteen evidence
files. All fifteen matched their digests in qa/live-360/handoff-integrity.json.
New follow-up evidence is recorded in qa/live-360/RESUME-5104687.md:

- routes-production-66134c6-followup/report.json: 46-route public crawl.
- browser-production-66134c6-followup/report.json: 440 browser views and seven
  interaction/mode cases; zero recorded automated failures.
- pending-image-diagnosis.json: URL availability and browser decode, separate
  from original lazy-loading behaviour.
- pending-image-diagnosis-with-rail-dwell.json and logo-entry-320.json:
  bounded natural-loading geometry/timing; no persistent defect demonstrated.

The browser matrix recorded 175 pending-image observations over 14 URLs.
It is not a complete-load performance test. CSS viewport reflow equivalents
are not actual browser zoom or text-only resizing. Chrome emulation is not
physical-device testing, and keyboard probes are not screen-reader listening.

## Architecture and release boundary

Native theme controls structural design; Content plugin owns managed-content
reconciliation. Approved manual production edits must not be overwritten.
Candidate runtime differs from deployed baseline only in Native CSS and JS;
release-summary and reviewed baseline must be rechecked before release.
No content APPLY, production DB changes or visibility changes occurred in the
follow-up. Rejected push/deploy and reconciler paths remain blocked separately.

## Acceptance assessment still required

The fixed 84 acceptance groups and 100 total weight remain unchanged. Numeric
credit is not adjudicated; the current null total is not a perfect or zero-quality
score. Every group needs constituent-level proof before receiving credit.
Unknown/manual criteria cannot receive verified credit. Thirty AI role reviews
do not substitute for independent human research or accredited certification.

## Completion gaps

Production retest of the two local accessibility fixes; complete valid cold
performance matrix; hero autoplay decision; reviewed content remediation and
authorized idempotence check; genuine human/organisational evidence; scorecard
adjudication; final document promotion and current-state reconciliation.

These documents occupy the requested final paths but remain explicitly provisional
until updated against actual release results. The report can be rendered for an executive
PDF handoff, but no final PDF or complete programme acceptance is asserted.
