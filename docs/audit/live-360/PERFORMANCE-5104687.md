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
