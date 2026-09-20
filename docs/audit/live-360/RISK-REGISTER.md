# Live 360 risk register — in progress

Thirty independent role perspectives are complete (three separate AI reviewers).
No issue is closed from source review alone when its acceptance concerns production.

Latest gate: approved47cafe8 is staged off-webroot with verified backups, not
deployed. News12 preflight reports six existing Page conflicts
(439,463,464,465,470,475; `owned_item_changed_since_apply`) plus six mirrored
scope conflicts. Attribution of record differences is not established.
No overwrite, runtime swap or APPLY occurred. Database/uploads, runtime and cron
comparisons passed unchanged; protected public state passed. Future diagnostics
executed successfully with no observed scheduling activity. This new content
integrity gate is unrelated to the deferred historical cron event. Existing Pages
remain untouched; the failed plan must not be applied.

Fast-track checkpoint (20 September 2026): the News hub and **all twelve**
articles are already locally validated and committed as `5068cf92b9d9875a032e25988d7d9a594f6298e9`;
exact-source build/audit passed. The brief's eight-draft count is superseded.
Do not repeat that work. Production has not received this commit. The cron
review is closed by the owner's subsequent decision as **UNRESOLVED HISTORICAL
VOLATILITY — DEFERRED / EVIDENCE UNRECOVERABLE**. No further reconstruction of
unavailable historical values is permitted. This is not a BENIGN PASS.
There was no observed FarmTree content mutation, protected configuration mutation
or FarmTree runtime file mutation; no APPLY was performed, and there is no evidence
that the historical cron delta affected release-critical state. This bounded
operational uncertainty remains disclosed, not converted into proof of absence.
**FUTURE DETECTION COVERAGE = IMPLEMENTED** (local isolated-PHP tests passed;
production execution remains pending). Existing write firewalls, ownership/digest/state comparisons,
backup and rollback controls remain mandatory. New unexplained or release-critical
mutations still stop the affected operation. This historical event alone no longer
blocks Live360, and the consumed historical dry-run is not repeated.
This decision supersedes older blocked checkpoint wording in sprint/state files;
the five concise Live360 handoff documents carry the current continuation status.

| ID | Discipline | Severity | Evidence / affected surface | Root cause | Remediation / acceptance | Status |
|---|---|---|---|---|---|---|
| EXP-A11Y-01 | Accessibility | P1 | Platform/Solutions/Investors prose links, axe link-in-text-block; colour distinction1.85:1 | Global link decoration none | Scoped permanent inner-page prose underline; local440views no violations | Resolved in a23441b; live10proseviews PASS |
| EXP-A11Y-02 | Accessibility | P1 | Live14.5s looping Platform GIF and7s rotating footer text had no visitor pause control | Default-motion loops lacked persistent user override | Independent persistent controls for six motion components, reduced-motion/no-JS/keyboard checks | Resolved in66134c6 within four-width live motion test scope; broader AT manual checks remain |
| EXP-A11Y-03 | Accessibility | P1 | Homepage globe supports pointer drag and arrows but no click/tap-only orientation alternative; exact deployed source reviewed | Keyboard equivalence does not satisfy WCAG2.5.7 single-pointer non-drag alternative; pause/autoplay cannot select pitch | Add scoped direction controls reusing existing rotation/clamp logic; verify pointer, keyboard, pause/reduced state and layout | Resolved in5104687; live32direction checks across four widths and paused/reduced states PASS; see RELEASE-03-PRODUCTION |
| EXP-A11Y-04 | Accessibility | P1 | Required text spacing visibly clips the final digit of Homepage +1,000,000 at1440; screenshot text-spacing-production/home-1440-area-3.png | Metric nowrap inside overflow-hidden card | Allow metric-only emergency wrapping without changing default typography; verify baseline geometry and expanded text | Metric defect resolved in5104687; live24view spacing/default-geometry checks PASS; other clipping diagnostics still under review |
| EXP-PERF-06 | Performance | P1 | Blog390: CLS0.13097; live delayed-image probe moves copy253.5px | Featured figure initially0×0 until intrinsic image dimensions arrive | Narrow width100%/min-width0 reserves existing4:3 geometry; deterministic cold-image regression | Resolved in a23441b; live42views maxCLS0.03234, coldgeometry identical |
| OPS-001 | DevOps / architecture | P2 | AGENTS/architecture/current sprint describe private state despite public Native | Historical instructions not updated | Current map corrected, history preserved; agent tests pass | Resolved in a23441b |
| OPS-002 | Release engineering | P2 | Legacy unsafe workflow; ignored hardcoded release scripts | Parallel paths/no shared host lock | Tracked exact-SHA theme-only runner, drift/backup/rollback gates; retired workflows fail closed | a23441b real guarded release passes; OPS-003 evidence gap separate |
| OPS-003 | Release evidence | P2 | First release's expected php-lint.txt absent; second candidate stopped on unavailable /dev/fd input before swap | Original disappearance unknown; new host process-substitution failure directly observed | Regular NUL file list, nonempty lint gate, actual PHP fixture, checksum-bound evidence |66134c6 independent backup verifies five lint results; original historical gap remains disclosed |
| SEC-001 | Security | P2 | Public responses lack defence headers | No current header policy | Local nosniff/referrer defaults verified; HSTS/CSP require separate host/compatibility scope | a23441b six public header responses pass; remaining host policy unknown |
| SEC-002 | Security | P2 | Dynamic JSON-LD serialized with unescaped HTML delimiters | Raw-text script context not hex-escaped | JSON_HEX flags; real PHP adversarial round-trip regression | Deployed a23441b exact source; public metadata regression passes |
| SEC-003 | Development dependencies | P2 | npm advisory audit:5high/5moderate dependency nodes, none shipped | Old browser/extraction and parser packages | Patched browser and compatible transitive versions; narrow Express qs override | npm audit zero known advisories; regressions underway |
| SC-01/02/04/05/07 | Search metadata | P2/P3 | Category metadata absent; OG image absent; variable Organization; casing/article fields | Incomplete theme metadata | Scoped metadata fix and real local19route checks | a23441b production19responses PASS |
| SC-03 | SEO | P2 | Duplicate Blog/News feed,121links toBlog/0toNews | Two generated collection Pages | Owned/public duplicate canonical/schema/OG toBlog, sitemap single-ID exclusion | a23441b production canonical and fresh45URL sitemap PASS |
| EXP-QA-02 | QA | P2 | Browser regressions lacked reproducible aggregate | Ignored dependencies/manual commands | Pinned root devdeps, parameterized browser suite | Local aggregate PASS; second release production aggregate in progress |
| SC-06/08/09/10, EXP-UX-04 | Content/UX | P2/P3 | Thin/misleading resource destinations, source date labels, self-link | Legacy generic page bodies/date presentation | Evidence-backed proposal in search-content assessment; owned-body release needed | Open |
| SC-11 | Company evidence | P2 | Track-record figures/testimonial claims lack supplied provenance | Organisational evidence unavailable | Owner definitions/as-of/provenance/permission; never invent | Human evidence required |
| PERF-FIELD | Performance | Unknown | Public PSI API quota exceeded | External service quota | Repeatable lab tests separately; no field PASS inferred | Field unknown |
| PERF-GIF | Performance | P2 | Public Homepage downloaded an18,451,450-byte Platform GIF near viewport; throttled audit hit90s load timeout | Native proximity fetch exposed18MB animation during initial load | Exact-GIF viewport deferral, preserve approved clip/pause/alt/editability |66134c6 live four-width deferral/control checks PASS; cold performance retest pending |
| PERF-BLOG | Performance | P2 | Blog mobile cold-lab medianLCP3284ms, three runs |1200px valid4:3 lead plus competing near-viewport images; lead already high priority/non-lazy | Rejected redundant priority override; same-crop800px Blog-only candidate |66134c6 live selection/geometry PASS; cold performance retest pending |
| PERF-HERO | Performance / approved UX | P2 | Desktop Homepage no-input medianLCP5632ms; timelineH1LCP5752ms follows slide change5715ms | Existing approved5s autoplay replaces headline after initial page is visible | Preserve approved timing; report actual lateLCP; different default-autoplay behaviour requires product approval | Known design/performance trade-off; not performance PASS |
| A11Y-MANUAL | Accessibility | Manual-verify | No actual screen-reader listening/browser-zoom session | Tool evidence does not equal AT/user research | Retain per-criterion unknowns; equivalent reflow and keyboard checked | Manual verification required |
| WP-IDEMPOTENCE | Back-end verification | Bounded historical evidence limitation | Approved single dry-run: 0 create/update/conflict, 102 unchanged, 1 skipped; only cron fingerprint changed; no APPLY | Exact historical event values/caller evidence were not retained and cannot be recovered | Preserve historical evidence; implement prospective semantic snapshots and scoped sanitized caller diagnostics; no broad cron exception | UNRESOLVED HISTORICAL VOLATILITY; DEFERRED / EVIDENCE UNRECOVERABLE; not PASS; historical event alone no longer blocks programme per owner decision |

Scoring treatment approved by the owner: this historical evidence item receives
no PASS. Do not deduct production-quality points for it when current production
health is verified, future detection is implemented, and subsequent guarded
operations show no release-critical mutation. Those conditions require evidence;
they are not assumed from the historical snapshots.

Future guarded CLI operations load `scripts/cron-diagnostics-bootstrap.php` before
WordPress. The opt-in observer records semantic before/after event inventories,
hook identities, timestamps, recurrence/interval and SHA256 argument hashes,
registered callback source ownership where derivable, argument-free relative-path
caller stacks, proposed/successful option updates and window receipts. Output is
exclusive mode-0600 JSONL outside the webroot; write/capacity failures stop execution.
No raw SQL, argument values, credentials or arbitrary error messages are logged.
The theme-only runner independently captures cron semantics via database-only
SELECTs, without loading WordPress, and rejects new differences. Its regression
fixtures cover unreadable evidence before replacement and rollback on new delta.

Coverage boundary: update-option hooks observe the same guarded PHP process, not
concurrent requests, direct SQL or option creation/deletion. External semantic
snapshots detect persistent differences outside that boundary but cannot invent
caller attribution. Unconfirmed proposals and unknown owners remain explicit.
Instrumentation is diagnostic, not a replacement for the SQL firewall or state
gates, and does not trigger cron. The historical reconciler has not been rerun.

Each expanded finding must include affected URL/files, reproduction/evidence,
root cause, risk, source fix, regression, release/backup IDs, production result
and status. Unknowns remain unknown; absence of a discovered vulnerability is
not evidence of a complete security assessment.
