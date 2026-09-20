# Release5104687 cold-lab follow-up — not a passing audit

The existing unchanged audit ran against live5104687: six routes,390/1440px,
three cold-cache contexts each, mobile CPU4x/150ms/1.6Mbps. After29 observations,
Chrome's CDP connection closed; that run terminated with exit1. The seven missing
observations were collected separately with the same harness/profile and no
replacement of completed observations. The combined36 observations are not a
successful uninterrupted run. The original exception and all30 error events
remain preserved. No production, content, settings or autoplay changes occurred.
The30 events are15 failed portrait-image requests with ERR_QUIC_PROTOCOL_ERROR
and their15 console counterparts; they are not30 distinct failed requests.

| Route | Mobile390 median LCP ms | Desktop1440 median LCP ms |
|---|---:|---:|
| Homepage |2088 (network errors: FAIL)|5660 (late LCP: FAIL)|
| Platform |2460|564|
| Investors |1152|632|
| Farm Valuation |2256|564|
| Blog |1692|628|
| Lead News |1236|544|

All recorded native load events completed; all median CLS values were below0.1.
The ten non-Homepage groups pass the narrow load/LCP/CLS/error gate in this
descriptive aggregation. This does not establish whole-programme performance,
field CWV or representative INP. No continuous-run success or causal before/after
claim is made. The Homepage and harness failures must not be hidden by medians.

Evidence:
- qa/live-360/performance-production-5104687-interrupted.json;29observations;
  SHA256 db29c67c79c61d503f5f0b6a6e95e63dd007352b0773c2f5b658e7c0da617244.
- qa/live-360/performance-production-5104687-missing-runs.json;7disjoint observations.
- qa/live-360/performance-production-5104687-combined.json; contains both source
  digests; SHA256 7e73382ee4d3d4fa92a4c09d49105432bbc5e2f40c57d5ba1b50a6d904409eb9.

Next: diagnose recurring default-profile Homepage transport errors and browser
disconnect without assuming a source cause. Preserve approved hero autoplay
until an explicit product decision. Do not retry any rejected reconciler path.

## Browser-local transport isolation — 2026-09-20

Four fresh Chrome153.0.8010.52 processes; Homepage390x900/DPR2, cache disabled,
CPU4x in every case,12s observation after DOMContentLoaded. Only browser-local
network emulation and QUIC availability varied. One observation per combination:

| Network emulation | QUIC disabled in browser | Protocols observed | Failed requests |
|---|---|---|---:|
|150ms/1.6Mbps|No|h2,h3|5|
|150ms/1.6Mbps|Yes|h2|0|
|None|No|h2,h3|0|
|None|Yes|h2|0|

The five failures are the same testimonial portrait URLs and report
ERR_QUIC_PROTOCOL_ERROR; five corresponding console errors. All four documents
reached complete. This reproduces an interaction between the default transport
path and emulation in this browser setup; it does not establish which underlying
component is faulty or prove all real networks are unaffected. No hosting,
production HTTP/3, application code, assets or performance thresholds changed.
Disabling QUIC for diagnosis is not a production fix or replacement passing score.
The original failed default-profile audit remains failed; browser disconnect is
a separate unresolved diagnostic, not explained by this four-case observation.

Evidence:qa/live-360/quic-matrix-5104687.json; SHA256
72ac55ab15b51c2e84db107fad85908e6788f5eeeeb789404a55166759dfdd1c.
The reproducible diagnostic is qa/live-360/diagnose-quic-matrix.cjs. Both are
ignored local QA artifacts; maintain controlled retention, not public webroot.
