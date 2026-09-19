# WCAG 2.2 A/AA handoff matrix — IN_PROGRESS

Evidence snapshot: 2026-09-19. Production release under verification:
`5104687c27b7b6aa69b100e55d905a8107726ec7`.

**This is an in-progress evidence handoff, not certification, a conformance
claim, a completed audit, or a 100/100 result.** The filename identifies the
handoff artifact; it does not override this status. Release03 production aggregate QA completed; see RELEASE-03-PRODUCTION.md.
Manual and all-state accessibility coverage remain incomplete.

Scope: public English FarmTree marketing pages. Separate Platform service,
external destinations and authenticated WordPress administration are excluded,
not declared accessible. Applicability must be revisited when scope changes.
The fixed [acceptance contract](ACCEPTANCE.md) remains controlling: unknown and
manual-verification items earn no verified credit and cannot be converted to
passes merely to finish the programme.

## Method and evidence

The complete list of 55 active A/AA criteria is inherited from the previously
verified [WCAG matrix](WCAG-MATRIX.md), checked against the primary
[WCAG 2.2 Recommendation](https://www.w3.org/TR/WCAG22/) and
[W3C Understanding index](https://www.w3.org/WAI/WCAG22/Understanding/).
No new standards/network lookup was performed for this documentation-only
handoff. Concise criterion labels below do not replace normative requirements.
4.1.1 was removed in WCAG 2.2; AAA criteria are outside this AA matrix.

- **PASS** means the explicitly stated scoped checks have affirmative evidence,
  not that every possible state or the complete site conforms.
- **FAIL** means a confirmed defect remains in the stated tested scope.
- **MANUAL-VERIFY** means technical support exists but human/semantic or complete
  interaction evidence is insufficient for the entire criterion.
- **UNKNOWN** means required evidence is absent.
- **N/A** requires the specific scoped functionality rationale shown below.

Evidence keys:

| Key | Actual evidence and limits |
|---|---|
| MP | `qa/live-360/motion/production.json`: four live Homepage viewports (320, 390, 1440, 1920), plus initial reduced-motion transition and no-JS poster checks; six independent motion controls. Assertions cover initial GIF network deferral, viewport activation, offscreen resume, persistent pause, keyboard/automated pointer interaction, paused globe manual rotation, hero image breathing pause, visible state, target geometry, GIF attributes, default/reduced axe and no overflow/errors. This is not physical-device or assistive-technology testing. |
| MI | `qa/live-360/motion/interactions-local/report.json`: local menu keyboard cycle/Escape/restored focus, reduced-motion/no-JS and CSS-viewport reflow equivalents. Local results are not a current all-route production pass. |
| PP | `qa/live-360/prose-links/production.json`: live prose-link underline checks and axe in the sampled Platform/Solutions/Investors/Homepage/Contact views; menu/card/button selector exclusion checked. Does not exhaust every color-dependent communication. |
| DM | `qa/live-360/documentary-medium-production.json`: six cold route/DPR contexts (Blog and Farm Valuation Proof Story, 390 DPR2, 390 DPR1, 1440 DPR1); responsive candidate selection, existing alt/dimensions, primary priority, image delivery and geometry. No errors/failure. A preserved alt string is not proof of its semantic adequacy. Proof candidate preservation is not certification of cover-resolution adequacy. |
| B | Baseline `qa/live-360/experience/report.json`, `interactions.json` and `assessments/experience-engineering.md`: six routes ×11 widths and targeted live navigation evidence before subsequent releases. Preserve as historical evidence; do not relabel as latest-release full coverage. |
| L | `qa/live-360/browser-local/report.json`: historical local 40-route ×11-width matrix (440 views); zero route-view axe/overflow/image/ID failures. Its invalid CSS-zoom probe is superseded by `browser-local-interactions/report.json`, not presented as a UI defect. |
| R | `qa/live-360/security/browser.json`, `assessments/security-architecture.md`: scoped public runtime/source inventory; mailto-only contact, no public input forms/registration/iframe player, comments closed. Scope is not administrative WordPress. |
| S | Earlier search/route inventory in `qa/live-360/search/crawl.json`; shared header/footer/hub structure. The current aggregate browser QA is pending and cannot be inferred from this inventory. |
| T | Current shared theme markup, styles and `assets/js/native-interactions.js`; implementation evidence, not a substitute for rendered or human checks. |
| REL | [Release 02 record](RELEASE-02.md): exact deployed SHA/artifact/protected-state verification; explicitly separates deployment success from pending full browser/performance QA. |

MP has six report rows: four widths plus two preference/no-JS cases, **not six
viewports**. Initial-load CLS is respectively 0, 0, 0.0022777 and 0.0000521;
these are scoped initial-load observations, not field Core Web Vitals. DM has
six cold browser contexts, **not an all-route responsive audit**.

## 1. Perceivable — 20 criteria

| SC | Level | Criterion | Status | Evidence / exact remaining limitation |
|---|---|---|---|---|
|1.1.1|A|Non-text alternatives|MANUAL-VERIFY|DM/MP preserve existing alt; L checks presence. Full photo/diagram/globe/workflow alternative meaning and decorative treatment need human semantic review.|
|1.2.1|A|Prerecorded audio/video-only|MANUAL-VERIFY|Silent Platform GIF has a label/poster and now pause/deferral. Equivalence of a text alternative to the complete meaningful workflow sequence remains unverified.|
|1.2.2|A|Prerecorded captions|N/A|No synchronized audio/video player in scoped inspected runtime; GIF has no audio (R/T). External videos excluded, not declared compliant.|
|1.2.3|A|Media description/alternative|N/A|No synchronized audiovisual presentation evidenced; silent GIF assessed under 1.2.1.|
|1.2.4|AA|Live captions|N/A|No live audiovisual stream in the inspected public templates/runtime.|
|1.2.5|AA|Prerecorded audio description|N/A|No synchronized audiovisual presentation in this scoped runtime.|
|1.3.1|A|Information relationships|MANUAL-VERIFY|L and sampled current axe support structural semantics; complete visual/accessible relationships remain a manual task.|
|1.3.2|A|Meaningful sequence|MANUAL-VERIFY|MI verifies menu tab sequence; whole-page reading sequence across columns and cloned content needs assistive review.|
|1.3.3|A|Sensory instructions|MANUAL-VERIFY|No confirmed sensory-only instruction in inspected content; exhaustive instruction/copy review not completed.|
|1.3.4|AA|Orientation|MANUAL-VERIFY|Responsive widths tested; physical portrait/landscape rotation and orientation-specific behavior not tested.|
|1.3.5|AA|Input purpose|N/A|R/T show mailto-only contact and no public personal-data input/account/checkout/subscription form.|
|1.4.1|A|Color use|MANUAL-VERIFY|Original prose-only-color defect is closed in PP sampled live scope. MP controls add visible Paused/Playing text, not color alone. Complete color-dependent meaning inventory still pending.|
|1.4.2|A|Audio control|N/A|No automatic audio in inspected public runtime; animated GIF is silent.|
|1.4.3|AA|Text contrast|MANUAL-VERIFY|PP/MP sampled axe checks pass. Image-overlay contrast, incomplete axe items and all dynamic/focus states still need measured visual review.|
|1.4.4|AA|Text resizing|MANUAL-VERIFY|Historical CSS-viewport equivalents are not actual browser zoom/text-only resizing; true 200% text/browser checks outstanding.|
|1.4.5|AA|Text as images|MANUAL-VERIFY|Logos and workflow/model imagery exist; meaningful embedded text, necessity exceptions and equivalent content require review.|
|1.4.10|AA|Reflow|MANUAL-VERIFY|L/MI and current sampled geometry show no horizontal overflow. Actual browser 400% zoom and all dialog/content-loss states remain unverified.|
|1.4.11|AA|Non-text contrast|MANUAL-VERIFY|Visible controls/focus tokens exist; comprehensive icon/boundary/focus contrast measurements absent.|
|1.4.12|AA|Text spacing|MANUAL-VERIFY|Metric clipping fixed and visually retested on5104687;24live views pass required spacing, text retention, overflow and default metric geometry. Closed disclosure states and other clipping diagnostics still prevent whole-criterion acceptance. See RELEASE-03-PRODUCTION.md.|
|1.4.13|AA|Hover/focus content|MANUAL-VERIFY|Menu dismissal and focus behavior sampled. Complete hoverability/persistence/dismissibility review for every conditional-content state remains.|

## 2. Operable — 20 criteria

| SC | Level | Criterion | Status | Evidence / exact remaining limitation |
|---|---|---|---|---|
|2.1.1|A|Keyboard operation|MANUAL-VERIFY|MI menu cycle and MP motion toggles/globe arrow rotation pass. Complete skip/FAQ/quotation/hero-control journeys and all page controls are not fully verified.|
|2.1.2|A|No keyboard trapping|MANUAL-VERIFY|Sampled menu Escape restores focus; complete widget/dialog traversal still pending.|
|2.1.4|A|Character shortcuts|MANUAL-VERIFY|T primarily uses arrows/Escape/Enter/Space; exhaustive shortcut registration and focus-scope review not completed.|
|2.2.1|A|Adjustable timing|N/A|No public time-limited completion/session workflow in scope. Automatic presentation is assessed under 2.2.2.|
|2.2.2|A|Pause/stop/hide|PASS|MP verifies persistent independent user pause for Platform animation, hero slides/breathing, partner logos, testimonials, globe and footer quotes at four live widths; reduced preference wins, no-JS is static, user pause survives leaving controls. Pass is limited to these identified motion owners, not an exhaustive future-media guarantee.|
|2.3.1|A|Flash thresholds|MANUAL-VERIFY|No frame-based luminance/flash threshold analysis performed; screenshots and pause controls cannot establish this criterion.|
|2.4.1|A|Bypass repeated blocks|MANUAL-VERIFY|Skip link and main target exist; actual skip activation, visible focus and target-focus outcome need explicit verification.|
|2.4.2|A|Page titles|PASS|S previously crawled entries had identifying titles. Scoped inventory result; current full-release aggregate coverage remains pending.|
|2.4.3|A|Focus sequence|MANUAL-VERIFY|MI verifies menu cycle/wrap; MP tests focusable motion controls. Complete page/dialog sequence has not been manually assessed.|
|2.4.4|A|Link purpose/context|MANUAL-VERIFY|Investors destination previously pointer-tested and links inventoried; every repeated/generic label and accessible context needs semantic review.|
|2.4.5|AA|Multiple discovery paths|MANUAL-VERIFY|Shared header/footer/hubs exist; confirm adequate user-facing alternatives for every non-process page, not XML sitemap alone.|
|2.4.6|AA|Headings/labels|MANUAL-VERIFY|Structural headings and stable control labels tested in samples; full subject/purpose clarity review pending.|
|2.4.7|AA|Visible focus|MANUAL-VERIFY|Styles and focus movement present; visibility/contrast of every focused control not visually certified.|
|2.4.11|AA|Focus not obscured|MANUAL-VERIFY|MP hero-control/dot containment and sampled target geometry pass; fixed-header and every scrolled/dialog focus state still need manual review.|
|2.5.1|A|Pointer gesture alternatives|MANUAL-VERIFY|Menu single-pointer operation and globe keyboard rotation tested; complete pointer-gesture equivalent inventory not established.|
|2.5.2|A|Pointer cancellation|MANUAL-VERIFY|MP automated taps/clicks work; down-then-away/cancel behavior of all custom interactions remains untested.|
|2.5.3|A|Visible label in name|MANUAL-VERIFY|MP controls retain visible Pause label and stable accessible name; visible status span is aria-hidden while aria-pressed exposes state. All other dynamic combinations still need review.|
|2.5.4|A|Motion actuation|N/A|T uses pointer/keyboard, not shake/tilt/device-motion actuation.|
|2.5.7|AA|Dragging alternatives|PASS|Scoped authored globe dragging alternative verified on5104687: four44px click/tap direction controls,32 real direction checks at320/390/1440/1920 across paused/reduced states; canvas changes/inverse restoration and no autoplay restart asserted. No physical-device/AT claim. See RELEASE-03-PRODUCTION.md.|
|2.5.8|AA|Minimum targets|MANUAL-VERIFY|MP motion controls satisfy 44px CSS minimum with 0.01px floating-geometry tolerance. Whole-site 24px criterion, spacing and inline exceptions remain to be assessed.|

## 3. Understandable — 13 criteria

| SC | Level | Criterion | Status | Evidence / exact remaining limitation |
|---|---|---|---|---|
|3.1.1|A|Page language|MANUAL-VERIFY|Automated language checks pass in samples; latest all-route language/assistive-output confirmation incomplete.|
|3.1.2|AA|Language changes|MANUAL-VERIFY|English content includes locale labels/proper nouns; review any passages requiring language changes.|
|3.2.1|A|Focus behavior|MANUAL-VERIFY|Sampled tab/focus does not navigate; all page/widget focus handlers not exhaustively exercised.|
|3.2.2|A|Input behavior|MANUAL-VERIFY|No public data forms; all state-changing controls still require complete unexpected-context-change review.|
|3.2.3|AA|Navigation consistency|PASS|Shared header/footer and previously sampled live menu preserve labels/order across templates. Current full aggregate still pending; excludes admin/external services.|
|3.2.4|AA|Control identification|MANUAL-VERIFY|Shared components and stable motion labels support consistency; all repeated functions not exhaustively compared.|
|3.2.6|A|Help consistency|PASS|Shared contact/help destinations retain consistent structural positions in inspected templates; no separate page-specific help widget evidenced.|
|3.3.1|A|Error identification|N/A|No scoped public data-entry/submission/comment/account workflow; external email-client errors excluded.|
|3.3.2|A|Input labels|N/A|No public data-entry fields; navigation/widget names covered separately.|
|3.3.3|AA|Error suggestions|N/A|No scoped public form-validation workflow (R/T).|
|3.3.4|AA|Prevent consequential errors|N/A|No public transaction or user-data modification flow; links out to separate Platform.|
|3.3.7|A|Redundant entry|N/A|No scoped multi-step public data-entry process.|
|3.3.8|AA|Accessible authentication|N/A|No public marketing-site authentication; administrative WordPress is excluded, not declared conformant.|

## 4. Robust — 2 active criteria

| SC | Level | Criterion | Status | Evidence / exact remaining limitation |
|---|---|---|---|---|
|4.1.2|A|Name/role/value|MANUAL-VERIFY|MP asserts aria-controls targets, pressed/disabled state and sampled axe. Actual screen-reader state announcements and complete widget semantics remain untested.|
|4.1.3|AA|Status announcements|MANUAL-VERIFY|Source live-region choices documented; announcement timing, duplication and silent clones have not been listened to with assistive technology.|

4.1.1 Parsing: removed from WCAG 2.2, not counted among the 55 active criteria.
Duplicate-ID validation remains engineering evidence, not an active 4.1.1 pass.

## Handoff totals and remaining gates

This snapshot contains **5 scoped PASS, 36 MANUAL-VERIFY, 0 FAIL and 14 N/A**
criterion entries. Both specific release03 defects are resolved in their retested
scopes; broader text-spacing acceptance remains MANUAL-VERIFY. Zero FAIL entries
here does not establish full conformance or absence of undiscovered defects.
Historical FAIL evidence is preserved in the
original matrix/assessment. No percentage, 10/10 or conformance score is awarded.

Still required:

1. Complete all-state/manual review beyond the finished scoped production suites,
   including incomplete axe items; do not infer full coverage from aggregate PASS.
2. Conduct real screen-reader listening journeys with named browser/AT versions:
   reading order, landmarks, alternative meaning, controls/states and announcements.
3. Test actual browser 200/400% zoom, text-only resizing, required text spacing,
   orientation/physical-device touch, forced-color/high-contrast states as applicable.
4. Complete visual contrast/focus/obscuration, skip-link, gesture/cancellation,
   all-widget traversal and semantic content/media-alternative reviews.
5. Reconcile applicability with the final route/process inventory; reassess any
   new form, login, video, third-party embed or automatic motion owner.

Automated keyboard/pointer execution is useful evidence, not physical-device
testing or a human usability study. Zero axe violations is not complete WCAG
coverage. Delivery/network/CLS improvements do not establish accessibility
conformance or field performance. **Overall status remains IN_PROGRESS.**
