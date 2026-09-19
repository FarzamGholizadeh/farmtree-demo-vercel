# Reproducing the audit gates

Use Node≥22.12 and `npm ci`. Browser libraries are exact locked development-only
dependencies; no ignored `qa/tools/node_modules` installation is required by the
tracked Live360 or menu/CTA/LCP regressions. Install a compatible Chrome locally;
set `CHROME_PATH` on platforms other than the documented macOS default. Chrome
is not downloaded or deployed by the audit. Start the existing LocalWP runtime
before local browser tests; it must remain loopback-only and noindex.

```sh
npm test
npm run wp:verify
npm run wp:verify:anonymous
npm run validate:jsonld
npm run validate:sitemap
npm run validate:browser
npm run audit:browser
npm run audit:performance
npm audit
```

Browser/performance commands default to local. Explicit production read-only mode:

```sh
npm run validate:browser -- https://farmtree.eu/
npm run audit:browser -- https://farmtree.eu/
npm run audit:performance -- https://farmtree.eu/
```

The full route matrix supports `--inventory=FILE` to include discovered category
and canonical routes; default is forty managed routes. `--interactions-only`
does not imply route coverage. Machine results retain unknown axe/manual items,
pending lazy images and measurement limitations. Screenshots and bulky evidence
remain ignored under qa/live-360; durable reports reference hashes/paths.

Run performance measurements without concurrent browser load. Mobile lab network
and CPU throttles, repeats and measurement window are recorded by the script.
They are not field INP/CWV or a guarantee for all real visitors.
The performance audit uses the maximum CLS session window (less than1s gaps,
maximum5s window), with lifetime shift sum retained separately for diagnostics,
following https://web.dev/articles/cls. Older image/motion regression probes
use an unexpected-shift sum as a conservative stability bound, not a complete
field CLS implementation; their passing sums also bound the session-window
value, but must not be presented as field Core Web Vitals.

After a clean source commit (the builder rejects dirty runtime inputs):

```sh
npm run release:build
npm run release:audit
```

Only after all release-specific gates and current user authority permit it,
follow `scripts/RELEASE-NATIVE-THEME.md`. No command in the validation block
deploys, activates a plugin/theme or changes production WordPress content.
Disposable WordPress fixtures are isolated from both local authoring and production.

## Resume checkpoint — 2026-09-19

Current uncommitted motion-control batch passes `npm test`, `npm run wp:verify`
and `npm run wp:verify:anonymous` (serial run, exit 0). The anonymous local
matrix covers 40 routes and 104 internal links, with zero broken links.
Motion-specific evidence covers 320/390/1440/1920, keyboard/pointer,
reduced-motion transitions, no-JS fallback, and zero axe violations/overflow/
console errors. Independent final source review found no concrete critical
defect. These are local results, not closure of the production motion finding.

The resumed production performance audit failed twice at its 90-second load
deadline on Homepage at throttled mobile390. Diagnostic evidence identifies
the existing Platform GIF as the sole pending request. In the second incomplete
sample, LCP was 2108ms and session-window CLS 0.008241; neither establishes a
complete multi-run performance PASS. Evidence:
`qa/live-360/performance-production-load-timeout.json`. Investigate the media-loading cause
without relaxing the acceptance gate or changing the approved animation.

Fresh read-only public route audit passes 46 routes, 45 sitemap URLs and 46
distinct internal link destinations; zero broken links or audit failures.
Reserved NL/DE and the deliberately nonexistent path return expected404s.
This covers discovered destinations, not every possible URL or authenticated UI.

Evidence SHA256:


- Routes `qa/live-360/routes-production/report.json`:
  `8bb9728f4df1955212442981126d2e74de731c65aa95c8c051b1aa9a9741b378`
- Incomplete performance `qa/live-360/performance-production-load-timeout.json`:
  `5ebe9b3d17d10423872e6c931bddba73e811de556310343cda352244af579c99`
- Local motion `qa/live-360/motion/local.json`:
  `05e9b286fda7a7c18f09eb24b56a3eac93363a1dc6eb0f7a36de9ac42422ec70`
  (latest post-deferral rerun supersedes the earlier motion-only capture).

To continue coverage without concealing this failure, the performance runner now
samples eight seconds after DOMContentLoaded and separately requires all three
native loads complete. An incomplete load still fails the gate even if its
provisional LCP/CLS is low. Native lifecycle diagnostics reproduced the stall
at both390×900 and390×844 under the exact throttle; unthrottled load completed
before GIF delivery, so pending-request correlation alone is not a proven cause.
# Resumed local candidate checkpoint

Full browser aggregate PASS:33menu views,200trusted pointer activations,
162CTA views,42LCP-priority views,10prose views,19metadata and6header responses.
Representative6routes x11widths:66views,0failed/console/interaction failures.
Six-width testimonial loop and reduced-motion regression:0failures.
These motion regressions precede the isolated Blog srcset addition; that addition
then passes six cold-context selection/geometry checks with Proof preservation.

Final narrowed candidate `npm test`, `wp:verify`, `wp:verify:anonymous`: PASS.
Anonymous40routes/104links,0broken;28responsive pictures pass. Release source
classification:250runtime/114excluded. Exact clean-commit build/audit pending.
The local development runtime remains intentionally noindex; this is not a
production visibility change.

Evidence SHA256:
- `qa/live-360/motion/representative-local/report.json`:
  `23ddcdd032d92744efdca98b966f09385a32c8b8411f4e579da8725d8af284be`
- `qa/live-360/motion/testimonial-final-local/testimonial-marquee-results.json`:
  `b0a649604653ce5111f9271ca85c613fd2dea51f496f35db0ec4f01db8c59d69`
- `qa/live-360/documentary-medium-local.json`:
  `9ff08d0faf15860f078bee0ab9098eef40dd3cbdb3250380c6e7ec56a189bb7f`
