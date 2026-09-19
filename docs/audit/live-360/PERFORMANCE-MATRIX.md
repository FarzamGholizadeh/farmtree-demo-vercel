# Performance evidence — remediation in progress

Production baseline `a23441ba6f72d120f8bd2aac5ada0adcf3bb8546`.
36 cold-cache runs: six routes,390/1440,three repeats. Mobile CPU4x,
150ms latency,1.6Mbps down/750Kbps up; desktop unthrottled. Observation8seconds
after DOMContentLoaded, then trusted menu activation/Escape. No concurrent
browser/fixture load. These are laboratory observations, not field CWV/INP.

| Route |390 median LCP(ms) / CLS |1440 median LCP(ms) / CLS | Status |
|---|---|---|---|
| Homepage |1952 /0.00824 |5632 /0.00745 | FAIL: mobile0/3 complete loads; desktop late heading LCP |
| Platform |2464 /0.02472 |564 /0.00198 | PASS sampled gates; mobile close to threshold |
| Investors |1192 /0.00024 |520 /0.00050 | PASS sampled gates |
| Farm Valuation |2148 /0.00024 |548 /0.00050 | PASS sampled gates |
| Blog |3284 /0.00079 |612 /0.01129 | FAIL mobile LCP |
| First News detail |1156 /0.03495 |556 /0.00136 | PASS sampled gates |

Observed menu event-duration maxima16–48ms, no pageerror events recorded.
This does not prove field INP or all console/network errors absent. All sampled
CLS values are below0.1; no repeatable all-page performance PASS is claimed.
Homepage mobile provisional LCP remains incomplete-load evidence, not credit
for a passed performance gate.

Homepage GIF delivery diagnosis and candidate source fix: RELEASE-02.md.
Desktop timeline confirms the late H1 candidate follows the existing5s autoplay:
initial heading635ms, DOMContentLoaded719ms, slide text update5715ms and new H1
LCP5752ms. This is not a5.7second initial-network wait; it still fails the
recorded no-input lab LCP criterion. Preserve approved motion rather than changing
timing simply to manipulate a metric. Any default-autoplay redesign requires
an explicit product decision, not an undisclosed performance-score workaround.
An optional product choice has been requested: retain the current approved
autoplay and record the metric limitation, or explicitly approve deferring
autoplay until first user interaction. No response is assumed; current timing
remains unchanged.
Blog mobile selects the valid1200px4:3 AVIF because342CSSpx at DPR2 requires684px
and the other4:3 candidate is480px. Never substitute the800px square crop or
understate `sizes`. Lead priority and competing lazy-card requests require
rendered evidence before a narrowly scoped scheduling experiment. That evidence
now confirms lead `fetchpriority=high`, loading attribute absent; other sampled
images are lazy without explicit priority. Do not redundantly override the lead.

Timeline/attribute evidence `qa/live-360/experience/hero-lcp-timeline.json`:
`f248b49a7253f8168dfc2f3e182267a4f28e42b8c126e7996f2e382b87c6b46d`.

Evidence: `qa/live-360/performance-production-a23441b.json`
SHA256 `4f0f10a8410f960f40403c79df5a98b761f5385a5c26b64e173211686f9819a4`.
Reproduce with `npm run audit:performance -- https://farmtree.eu/`.
Field PSI quota was unavailable; field status stays UNKNOWN.

## Local candidate, same lab profile

All36 local loads completed; all three mobile Homepage samples made no GIF
request before scrolling. All session-window CLS values remained below0.1 and
no pageerror was recorded. This verifies the targeted lifecycle improvement
locally, not a production performance PASS.

Absolute local mobile LCP gates fail (medians3216–4524ms). The development
responses are not transport-equivalent to production: the first Homepage sample
transferred120056bytes of theme CSS and104709bytes of WordPress interactivity
`index.js`, versus20393bytes and15505bytes of `index.min.js` in production.
This is directly observed resource evidence, not proof of the particular host
compression configuration. Do not label cross-environment differences a source
regression or claim local mobile performance passes. The approved autoplay
likewise retains the desktop late-H1 result (local median5516ms).

Evidence `qa/live-360/performance-local.json`:
`e54f4f084daaa489d1243cc0c0d24196f178e813a1d269c364bc802a6c3d88fc`.
Production retest remains required after any audited theme release.

## Rejected Blog priority experiment

Browser-only paired cold-cache experiment (three runs per arm) explicitly set
only the eight lazy Blog card images to Low. No server/source changes. Lead
remained High and CDP already classified requested cards Low in both arms.
Baseline LCP3444/3368/3388ms; treatment3368/3352/3372ms. Median delta20ms
(~0.6%) is not a robust improvement; do not add the redundant override.

All six runs had two card requests fail with `ERR_QUIC_PROTOCOL_ERROR` under
network emulation (also reported as console errors). These are not clean
performance passes. The initial36run audit captured pageerror only, not console/
request failures, so absence of pageerror did not establish network integrity.
The tracked runner now explicitly captures both, excluding intentional context
shutdown aborts. A separate no-interception HTTP/2 diagnostic completed three
cold runs with native load complete and zero console/page/request errors:
LCP3496/3324/3308ms (median3324ms). Browser-only `--disable-quic` selected h2;
the host was unchanged. This distinguishes the observed QUIC/emulation path
from intrinsically broken image URLs, but does not establish an upstream cause.
Mobile Blog LCP still fails, independently of that diagnostic transport choice.

Evidence `qa/live-360/experience/blog-priority-ab.json`:
`dcc5c57a0698cb5926e91e5d8a3ea18518095caa38578bbd7db38f5797976858`.

HTTP/2 evidence `qa/live-360/experience/blog-http2-baseline.json`:
`094664fa67ef39081fd6a89cccedc72260a077c83b4d94caa2888e6293bd7001`.

## Responsive candidate in preparation

Add an800x600 candidate between480x360 and1200x900 only on Blog featured
blocks (lead/cards), keeping the original4:3 crop, existing sizes and native
priority. Eleven original photographs were
hash-matched before compilation; all132 existing exports and evidence records
remain unchanged. The33 added AVIF/WebP/JPEG files total2,992,056bytes; the Blog
lead AVIF becomes eligible at62,983bytes instead of150,806bytes on the tested
390px/DPR2 viewport. Browser selection confirms800px atDPR2 and480px atDPR1,
with stable338x253.5 lead geometry. Production performance remains to be verified;
asset size alone is not an LCP PASS.

The initial broad candidate was narrowed before release: measured Proof hero
390x620 uses cover cropping, so a smaller source could reduce effective
resolution despite unchanged box geometry. Proof/News detail and other core
images retain their prior candidate sets. Their existing `sizes` are not newly
certified as optimal; no blanket medium substitution is made. Blog desktop lead
also has a tall cover box (380x809 in the sample), so its existing1200px slot
is retained rather than replacing it with the visible box width blindly.

## 66134c6 production retest — interrupted, not PASS

The unchanged lab profile completed22/36samples before Chrome/CDP disconnected
at1440px Platform run2. The precise browser-exit cause is unverified. Keep this
report separate rather than discarding failed evidence or calling the matrix
complete. All18mobile samples reached native load completion; Blog mobile
LCP1660/1712/1676ms (median1676) selected the deployed smaller candidate.
The earlier median3284ms is a separate-run comparison, not a controlled causal
effect size. Homepage desktop still measured5672/5628/5644ms due to the retained
autoplay behavior.

The three mobile Homepage samples each logged five testimonial-image
ERR_QUIC_PROTOCOL_ERROR failures (15requests and15console entries). Thus native
load completion does not mean successful delivery and Homepage is not a clean
PASS. Other completed samples had no recorded errors. Earlier HTTP/2 diagnostic
evidence suggests a transport/emulation interaction, but these new errors and
the browser disconnection must remain explicit; no host setting was changed.

Frozen interrupted evidence:
`qa/live-360/performance-production-66134c6-interrupted.json`, SHA256
`5254158489a17fced9bc543ea0d7d9c777df849ce59ac5e01011ad12a20bd71f`.
