# Experience and engineering: independent assessments

Date: 2026-09-19. Read-only live target: https://farmtree.eu/. Source baseline:
`6b01611b1d87edd8190b54f405beefddf33ebf27`. These ten perspectives were assessed
separately before the findings below were consolidated. This is technical review,
not ISO certification, user research or a blanket WCAG conformance declaration.

## Evidence scope

- `qa/live-360/experience/audit.cjs` and `report.json`: six representative routes,
  eleven widths (320,360,375,390,414,768,1024,1280,1440,1920,2560); axe WCAG-tagged
  automated checks at 320/1440; rendered geometry, images, errors, IDs, headings.
- `qa/live-360/experience/interactions.cjs` and `interactions.json`: live open-menu
  axe, pointer hit testing, actual Investors navigation, Escape/focus restoration
  at 320/390/1440/2560. All four passed. Investors height 38 CSS px, widths 226,
  296,347.328,347.328. One active overlay and zero document horizontal overflow.
- Browser scripts intentionally do not submit forms or change WordPress data.
- Chrome desktop engine emulation is not physical-device or assistive-technology
  testing. Automated axe results do not establish full accessibility compliance.
- A first screenshot pass did not trigger below-fold reveals because programmatic
  scrolling inherited smooth behavior. The harness now explicitly scrolls instantly
  before screenshots. Missing content in superseded captures is not a UI finding.

## 1. Senior UI Designer — independent assessment

The sampled templates share the green/ivory palette, typography and header system.
All 66 sampled viewport geometries have no document horizontal overflow. The
Platform 320px screenshot shows sensible title wrapping and intact image crop.
The non-underlined body links are visually insufficiently distinct (EXP-A11Y-01).
Premium composition and all full-page reveal states need final visual review;
geometry alone cannot earn full UI marks. No speculative redesign is proposed.

## 2. Senior UX Designer — independent assessment

The shared menu retains separate Customer Segments Investors and advisor links,
while the removed For Investors/For Advisors labels remain absent. Investors
navigation succeeded by real pointer at all four sampled widths, with closed menu
on destination. The Platform route gives a concise product description but its
next-step sentence links to the same Platform page. This is a low-priority
information-scent issue, not a broken link; business intent should guide whether
to remove only that self-link. Contact and Proof Stories paths are also present.
No actual task-completion study or user comprehension timing was conducted.

## 3. Human-Centred Design Specialist — independent assessment

Investor content connects scenarios and transparent assumptions to the audience's
decision needs. Ten named audience links are available. This supports a structural
journey assessment, not evidence that real investors/NGOs/researchers understand
the site within five seconds. The programme must distinguish expert heuristic
review from representative-user research; no invented satisfaction score.

## 4. Accessibility Specialist — independent assessment

Confirmed serious axe `link-in-text-block` violations on Platform, Solutions and
Investors, at both tested widths. Nine distinct sampled anchors total; repeated
per viewport. Color contrast between link #00613f and prose #163126 is 1.85:1,
below the 3:1 color-only differentiation threshold. Links are not underlined.
Open-menu automated checks have zero violations at four widths. Escape restores
focus and pointer targets are reachable. No duplicate IDs in sampled pages.
Color-contrast incomplete results remain; image/background text needs manual
review. Screen-reader, 200/400% zoom, complete tab sequence, Globe keyboard and
no-JS behavior are not newly proven by this assessment. Small inline links and
clipped skip-link boxes are not automatically failures: inline/spacing exceptions
and focused visibility must be considered.

## 5. Senior Front-End Engineer — independent assessment

The main interaction bundle is 1,442 lines and combines motion, menus, globe,
testimonials, language and modal behaviors. It uses IntersectionObserver,
ResizeObserver, reduced-motion handling and menu background isolation. No live
console/page errors or duplicate IDs were observed in this six-route sample.
The source uses deliberate `!important` rules for WordPress overrides; existence
alone is not a defect. Splitting the bundle without measured benefit is not
recommended. The global link decoration rule is the actionable source issue.

## 6. Senior Full-Stack Engineer — independent assessment

Rendered WordPress routes return 200, theme-supplied documentary assets load and
navigation routes are coherent in this sample. This does not verify database
ownership, transactions, reconciliation idempotence, PHP logs or editor behavior;
those require the separate backend/runtime assessment. A presentation-only link
distinction fix can remain theme-owned without database or content changes.

## 7. Senior QA Engineer — independent assessment

The sample covers Homepage, Platform, Solutions, Proof detail, Investor detail
and News archive, not every public route. Zero observed JS errors/overflow is
qualified by this matrix. Pointer navigation and focus restoration were actually
executed, not inferred from HTTP 200. Confirmed accessibility failure prevents
an all-PASS signoff. Existing historical tests provide useful regressions but
must be rerun on the release SHA and real production before closure.

## 8. Test Automation Engineer — independent assessment

Existing dedicated tests cover menu pointer, menu labels, CTA, LCP, documentary
assets and reconciler safety. `npm test` and workflow text do not reference the
menu-pointer/menu-links/CTA/LCP browser scripts: they are manual commands rather
than a single discoverable browser regression gate. P2 automation discoverability
gap. Preserve the corrected URL/document/menu assertions instead of restoring
fragile navigation-lifecycle waits. Add reproducible command aggregation, with
explicit local/production target and read-only mode; do not weaken assertions.

## 9. Performance Engineer — independent assessment

The browser observer recorded initial desktop LCP candidates under 2.5s in the
first unthrottled sample: Home 1692ms, Platform476ms, Solutions508ms,
Proof464ms, Investors464ms, News872ms. These are observations on a warm browsing
session, not mobile lab medians or field Core Web Vitals. Later viewport/scroll
entries are not suitable baseline CLS. INP field evidence was not obtained.
AVIF documentary resources were selected in sampled desktop image candidates.
No performance full score is defensible from this run; controlled repeated cold
mobile lab and field-data availability checks remain required.

## 10. Repository / Developer Experience Engineer — independent assessment

870 tracked files include native runtime, static legacy references, qa evidence,
deployment scripts and extensive historical reports. AGENTS identifies ownership,
but still describes native as inactive/Coming Soon active despite current user-
approved public operation. Current sprint/report entries also say local/no deploy
for now-live releases. This is a P2 operational-documentation drift hazard, not
authority to change production. Update current-state summaries while preserving
historical records; do not delete uncertain legacy files merely to reduce count.

## Consolidated actionable findings

### EXP-A11Y-01 — P1: prose links rely on insufficient color distinction

Observed URLs: `/platform/`, `/solutions/`, `/customer-segments/investors/`.
Evidence: report.json axe nodes and production screenshots. Source root cause:
`wordpress/wp-content/themes/farmtree-native/theme.json` around lines278–282
sets default links to textDecoration none, underline only on hover.
Minimal recommendation: permanently underline prose links within post content
paragraphs/lists, with a modest text-underline-offset. Exclude button-style links,
navigation, cards and standalone heading links. Candidate scoped selector:
`.wp-block-post-content :where(p, li) a:not(.wp-block-button__link)`.
Validate actual computed result, hover/focus and footer/nav unchanged; run axe
on all prose-bearing routes at320/1440. No content mutation is needed.
Status: OPEN; no remediation performed by this assessment.

Exact sampled selectors include `a[href$="platform/"]`,
`a[href$="proof-stories/"]`, `.wp-block-paragraph:nth-child(3) > a[href$="contact/"]`
on Platform/Solutions; Investors also
`.wp-block-paragraph:nth-child(16) > a[href$="blog/"]` and contact link.
Selectors above identify evidence nodes; do not encode brittle nth-child selectors
in the fix.

### EXP-QA-02 — P2: critical browser regressions lack a unified command

Source: package.json and .github/workflows search. Several required historical
browser scripts are absent from npm test. Add a documented aggregate browser
gate, explicit target URL and artifacts, without introducing automatic deployment.
Status: OPEN; no source changes made here.

### EXP-DX-03 — P2: current operational docs contradict public production intent

Source: AGENTS.md Approval Boundary and CURRENT_SPRINT/SPRINT_REPORT current
release headings. Update current facts; retain historical evidence and explicit
approval protections. Status: OPEN.

### EXP-UX-04 — P3: Platform next-step self-link

Production paragraph says “Explore the Platform” linking to `/platform/` from
that same route. Link works but adds no progression. Source/content fix only if
existing editorial intent permits; not a launch-critical broken interaction.
Status: OPEN heuristic finding, not a measured conversion defect.

## Acceptance boundaries

No new P0 was observed. One confirmed P1 is open. This assessment cannot award
10/10 to all ten disciplines. No source runtime edits, production writes,
deployment or commit were performed. Reports/scripts/evidence only.

## Subsequent delegated remediation phase (separate from assessment)

After the independent assessment above was completed, the coordinator explicitly
assigned EXP-A11Y-01 remediation. A narrow rule was added to theme `style.css`:
inner-page `.ft-native-page-main .wp-block-post-content` paragraph/core-list links
are underlined with 0.16em offset, excluding button classes. The first test caught
an overly broad selector reaching Homepage Proof card links; scope was narrowed
to inner-page template main containers instead of changing the card system.

`scripts/validate-prose-links.cjs [http://localhost:8888/|https://farmtree.eu/]`
is a tracked parameterized read-only test. It checks computed prose underlines,
axe link-in-text-block, no selector overlap with navigation/button/card/title
controls, no overflow, HTTP200, and console/page errors at320/1440 on five routes.
No source content, footer, menu, route or database is modified. Deployment and
production closure belong to the coordinator; the baseline production P1 remains
OPEN until that release is independently verified live.

Local result: PASS, 10 views at320/1440 across Platform, Solutions, Investors,
Proof detail and Homepage; no link-in-text-block violations, selector overlap,
overflow or console errors. CSS lint, Node syntax and git diff whitespace checks
passed. Evidence: `qa/live-360/prose-links/local.json`.

## Broader reusable verification phase

Coordinator-requested `scripts/validate-live360-browser.cjs` adds a read-only
40-route default inventory from native managed source and all eleven requested
widths. `--inventory=path.json` accepts an audited array of relative route paths;
`--widths=320,1440` and `--output=qa/...` support scoped reruns. Optional target is
`http://localhost:8888/` or `https://farmtree.eu/`. It records automated axe results
including unresolved manual-review items, broken/pending images, overflow, IDs,
errors and screenshots; final DOM probes execute complete menu Tab sequence and
Escape, reduced-motion, enlarged-content and reflow, and no-JS checks. These are
not screen-reader listening or real browser-chrome zoom. Field INP is not implied.
The first local run lost an execution realm during Playground document replacement;
the runner now waits for the current complete document and reinjects axe if needed.
That harness failure is not a product defect or an accessibility pass.

Broader local route result: 40 routes ×11 widths =440 views, zero axe violations,
document overflow, broken completed images, duplicate IDs or console/page errors.
Keyboard full26-control tab wrap and Escape restoration passed320/390/1440.
Reduced-motion showed no running animations. No-JS main content remained visible.
Pending lazy/hidden-carousel images are recorded separately, not assumed broken
or counted as proven loaded. Axe incomplete items remain manual-review evidence.

The initial added `html {zoom:2}` probe produced1025px overflow, but that method
does not emulate browser zoom: it leaves layout media-query viewport unchanged
while scaling content. This is a harness method failure, not a proven browser
zoom defect. The retained original report records it. Corrected probes use640
and320 CSSpx as the layout-space equivalent of200/400% from1280px and label actual
browser zoom/text-resize MANUAL-VERIFY; no visual source was changed to silence
the invalid simulation. Narrow rerun: `qa/live-360/browser-local-interactions/`.
Tracked scripts now resolve exact root-package dependencies, not untracked qa/tools.

## EXP-A11Y-05 — P1: automatic motion lacks persistent pause controls

Subsequent read-only production DOM diagnostic on2026-09-19 confirms the Homepage
Platform GIF figure is displayed, and complete button inventory contains menu,
hero previous/next/dots and quotation-close controls but no pause/stop control.
Matching source asset metadata from Sharp:145frames,14500ms total delay,loop0
(infinite). The source filename describes a source segment, not actual playback
duration. The GIF appears alongside descriptive content and repeats beyond5s.

Production footer quote DOM observed at initial load and8s later changes from
“Plan agroforestry with transparent assumptions.” to “Turn scientific projections
into clear decisions.” T's initialiseFooterQuotes sets an unconditional7000ms
interval, with no hover/focus/user-pause state. Initial reduced-motion preference
avoids starting the interval but is not a persistent on-page pause control for
default users. Hero and rail hover/focus pauses are likewise not equivalent to a
user choice that stays paused after focus/pointer leaves.

Source motion owners requiring one coherent follow-up: hero timeout5000ms,
Platform GIF, partner CSS rail34s, testimonial CSS rail, globe RAF rotation/pulses,
footer quotes7s. Proposed controls are local native buttons using existing visual
tokens, persistent owner pause flags and aria-pressed; no fixed global overlay,
no content mutation, and reduced-motion remains authoritative. Keep rail track
construction/direction unchanged. For GIF use existing static poster with retained
meaningful alternative. Stop/resume timers/RAF explicitly for other owners.
Status: confirmed live FAIL of2.2.2; remediation plan only, awaiting coordinator
batch boundary. `WCAG-MATRIX.md` records this failure and incomplete manual gates.

## EXP-PERF-06 — P1: News lead image does not reserve its initial mobile width

Existing LCP regression reproduced locally on `/blog/` at390px with CLS
0.1309711231 (threshold remains0.1) and no overflow. Added observer diagnostics
record a0.1301638 shift at418.6ms: `.ft-blog-featured-copy` moves fromy415.9375
toy669.4375, a253.5px displacement. The script now saves rows even on failure.

Independent production probe delayed image requests1800ms (browser-only, no
server mutation) on `https://farmtree.eu/blog/` at390px. At DOMContentLoaded the
featured figure/picture/link/image have width0 and height0; computed figure
aspect-ratio is4/3. After image load figure is338×253.5 and the body copy moves
down253.5px. Thus this is a real initial-size reservation defect, not Puppeteer
version or observer false positive. The loaded composition itself is correct.

Cause: featured grid figure has `height:100%` but no explicit width, so the
constrained auto-sized item waits for image intrinsic sizing. Proposed narrow
fix: reserve `width:100%;min-width:0` on `.ft-blog-featured-card > figure`, with
delayed-image before/after geometry regression. Do not alter image/crop/loading
priority/metadata or weaken CLS threshold. Source fix pending coordinator.
