# Live 360 risk register — in progress

Thirty independent role perspectives are complete (three separate AI reviewers).
No issue is closed from source review alone when its acceptance concerns production.

| ID | Discipline | Severity | Evidence / affected surface | Root cause | Remediation / acceptance | Status |
|---|---|---|---|---|---|---|
| EXP-A11Y-01 | Accessibility | P1 | Platform/Solutions/Investors prose links, axe link-in-text-block; colour distinction1.85:1 | Global link decoration none | Scoped permanent inner-page prose underline; local440views no violations | Production release pending |
| EXP-A11Y-02 | Accessibility | P1 | Live14.5s looping Platform GIF and7s rotating footer text have no visitor pause control | Default-motion loops lack persistent user override | Discoverable keyboard/touch pause controls; preserve approved default visuals/reduced motion; live retest | Open; next source batch |
| EXP-PERF-06 | Performance | P1 | Blog390: CLS0.13097; live delayed-image probe moves copy253.5px | Featured figure initially0×0 until intrinsic image dimensions arrive | Narrow width100%/min-width0 reserves existing4:3 geometry; deterministic cold-image regression | Local fix under validation; production open |
| OPS-001 | DevOps / architecture | P2 | AGENTS/architecture/current sprint describe private state despite public Native | Historical instructions not updated | Current map corrected, history preserved; agent tests pass | Local fixed; commit pending |
| OPS-002 | Release engineering | P2 | Legacy unsafe workflow; ignored hardcoded release scripts | Parallel paths/no shared host lock | Tracked exact-SHA theme-only runner, drift/backup/rollback gates; retired workflows fail closed | Local swap/refusal/rollback tests pass; real release pending |
| SEC-001 | Security | P2 | Public responses lack defence headers | No current header policy | Local nosniff/referrer defaults verified; HSTS/CSP require separate host/compatibility scope | Production pending; no exploit asserted |
| SEC-002 | Security | P2 | Dynamic JSON-LD serialized with unescaped HTML delimiters | Raw-text script context not hex-escaped | JSON_HEX flags; real PHP adversarial round-trip regression | Local fixed; production pending |
| SEC-003 | Development dependencies | P2 | npm advisory audit:5high/5moderate dependency nodes, none shipped | Old browser/extraction and parser packages | Patched browser and compatible transitive versions; narrow Express qs override | npm audit zero known advisories; regressions underway |
| SC-01/02/04/05/07 | Search metadata | P2/P3 | Category metadata absent; OG image absent; variable Organization; casing/article fields | Incomplete theme metadata | Scoped metadata fix and real local19route checks | Production pending |
| SC-03 | SEO | P2 | Duplicate Blog/News feed,121links toBlog/0toNews | Two generated collection Pages | Owned/public duplicate canonical/schema/OG toBlog, sitemap single-ID exclusion | Disposable exact-set/ownership tests pass; live pending |
| EXP-QA-02 | QA | P2 | Browser regressions lack reproducible aggregate | Ignored dependencies/manual commands | Pinned root devdeps, parameterized browser suite | Local validation underway |
| SC-06/08/09/10, EXP-UX-04 | Content/UX | P2/P3 | Thin/misleading resource destinations, source date labels, self-link | Legacy generic page bodies/date presentation | Evidence-backed proposal in search-content assessment; owned-body release needed | Open |
| SC-11 | Company evidence | P2 | Track-record figures/testimonial claims lack supplied provenance | Organisational evidence unavailable | Owner definitions/as-of/provenance/permission; never invent | Human evidence required |
| PERF-FIELD | Performance | Unknown | Public PSI API quota exceeded | External service quota | Repeatable lab tests separately; no field PASS inferred | Field unknown |
| A11Y-MANUAL | Accessibility | Manual-verify | No actual screen-reader listening/browser-zoom session | Tool evidence does not equal AT/user research | Retain per-criterion unknowns; equivalent reflow and keyboard checked | Manual verification required |

Each expanded finding must include affected URL/files, reproduction/evidence,
root cause, risk, source fix, regression, release/backup IDs, production result
and status. Unknowns remain unknown; absence of a discovered vulnerability is
not evidence of a complete security assessment.
