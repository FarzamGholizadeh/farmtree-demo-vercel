# Accessibility follow-up — local candidate

Production baseline remains `66134c6c7f60cca1e12abca6658f71591fb04ea1`.
This is the local validation checkpoint; runtime release is not yet performed.
Reviewed baseline checksum-set SHA256:
`be0a54dd4fdd79960e44e90809f994ba2a6e7ea023eb3750e75f973ed5c2165a`
(`qa/live-360/baseline-66134c6.sha256`).

## Confirmed findings and scoped changes

- EXP-A11Y-03: authored globe drag adjusts rotation/pitch, but only keyboard
  arrows offered an alternative. Keyboard is not the single-pointer non-drag
  equivalent required by [WCAG2.5.7](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html).
  Four native direction buttons now reuse the existing arrow-key arithmetic,
  pitch clamp and draw function. They preserve user pause/reduced preference,
  do not restart autoplay, and appear only after canvas activation succeeds.
  The adjacent group reserves space; no content/manifest/template body changes.
- EXP-A11Y-04: production text-spacing screenshot visibly cuts the last digit
  of +1,000,000 at1440px. The final metric rule forced nowrap inside a clipped
  card. Metric-only normal wrapping/overflow-wrap allows expanded text to fit;
  normal typography, values and card geometry remain unchanged in four sampled
  widths compared with the former nowrap rule in the same DOM.

The first text-spacing harness incorrectly included closed DETAILS bodies:
Chromium exposed their text rectangles/stale computed values. Explicit closed
disclosure exclusion corrects that classification, with finite computed-value
assertions retained. Expanded disclosures are still a separate coverage gap.
Initial failed harness report preserved with SHA256
`a07b13ee4afeb8ba1015895de054380cd6f4701011a84fa7602228b75306999e`.

## Evidence and boundaries

Production spacing probe:24views across six routes at320/390/768/1440,
no root overflow/missing text/console errors, but clipping diagnostics need
review and the metric defect was visually confirmed. SHA256
`7b1e1b70930fec87e9b483a1cab9cee57ca5956c877ef8982300769bc0f2782b`.

Initial local metric candidate:24views, all required spacing values applied;
metric text contained at four Homepage widths. Independent review found the
legacy comparison selector could lose to the last-card rule: the default
geometry assertion is superseded until the corrected important/computed-style
probe reruns, not credited from the initial report.
Other intentional/truncated/screen-reader-only clipping remains review, not an
automatic whole-criterion PASS. Report SHA256
`19155bea7ddc93db4782cdcbabe9edb48253079418ffff2044fe22d8b962f2b7`.

Corrected comparison rerun PASS: the test explicitly verifies computed nowrap/
text-wrap/overflow-wrap before comparing normal geometry. All24views pass
spacing/overflow/text checks; all four normal metric layouts match and expanded
metric text is contained. The1440px metric screenshot was visually reviewed:
every digit is visible, wrapping only under the injected spacing. Final local
spacing report SHA256:
`403090090b9b655432b9d363b8e5585ec2b94a0b8af809b0192852fe63cb36ac`.
Other clipping diagnostics and expanded disclosures remain manual review.

Initial globe candidate:four motion widths and reduced/no-JS cases PASS,
32 direction checks across paused/reduced states, real canvas-change/inverse
assertions, no automatic restart, no errors. A visual follow-up found narrow
button-label wrapping at320; smaller padding/non-shrinking labels and group
wrapping are under final retest. Do not call the initial report final evidence
for that subsequent style correction.

Remaining release gates are exact committed artifact audit, authorized scoped
release with fresh recovery backup
and real production retest. No reconciler APPLY belongs to this theme batch.
Managed content, legacy theme, public indexing and Coming Soon OFF stay intact.

Final local motion rerun PASS: four widths and initial reduced/no-JS cases,
32direction checks, one-line labels and minimum44px targets, no errors. The320px
screenshot was visually reviewed: four readable controls in one compact row.
SHA256 `e622502cd6c0b0f288ca4a71d64972aa8bd5f450805e64b5e51bf4bf3278d89e`.
Full local aggregate also passes33menu views/200pointer activations/162CTA
views/42image views/10prose views/19metadata/6headers. npm test and WordPress/
anonymous verification pass (40routes,104internal links,0broken; local noindex
is intentional and is not the production indexing state).
Final spacing rerun after the compact control-row style also passes24views;
SHA256 `d9698934dbb22494c98515cf691c015a0db3e6919c8aee24cb460b98aa1ff339`.
