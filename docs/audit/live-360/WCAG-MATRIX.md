# WCAG 2.2 A/AA evidence matrix

Assessment date: 2026-09-19. Scope: public English FarmTree marketing website,
not the separately operated Platform, third-party destinations or authenticated
WordPress administration. This is not a conformance claim or certification.

The 55 active A/AA criteria below were checked against the primary
[W3C WCAG 2.2 Recommendation](https://www.w3.org/TR/WCAG22/) and
[W3C criterion index](https://www.w3.org/WAI/WCAG22/Understanding/).
Names below are concise identification labels, not replacement normative text.
4.1.1 is obsolete/removed in WCAG2.2 and is recorded separately, not counted.
AAA criteria are outside this AA matrix. Automated success does not establish
conformance: full pages, complete processes and supported interactions require
combined technical and human evaluation. See [W3C conformance guidance](https://www.w3.org/WAI/WCAG22/Understanding/conformance).

## Status and evidence rules

- **PASS**: stated check has affirmative evidence within this declared scope.
- **FAIL**: confirmed live defect. A local fix does not close production failure.
- **UNKNOWN**: evidence/applicability not established; not a pass.
- **MANUAL-VERIFY**: automated/source support exists but semantic/interaction or
  visual verification remains insufficient for the full criterion.
- **N/A**: no applicable functionality in the declared public-site scope, with
  the stated evidence/rationale. Reassess if features or scope change.

Evidence keys:

- **P**: `qa/live-360/experience/report.json`: six live routes ×11 widths,
  axe at320/1440, images/DOM/errors; production baseline before remediation.
- **M**: `qa/live-360/experience/interactions.json`: live menu at320/390/1440/2560,
  actual Investors pointer navigation, hit targets, Escape/restored focus, axe.
- **L**: `qa/live-360/browser-local/report.json`: 40 local routes ×11 widths,
  440 axe/geometry/image/ID/error checks, plus keyboard probes. No automated
  route-view failures. Retains a failed *invalid CSS-zoom simulation*; see Z.
- **Z**: `qa/live-360/browser-local-interactions/report.json`: corrected640/320
  CSS-pixel reflow-equivalent checks, full menu tab cycle and Escape, reduced
  motion/no-JS DOM probes. Actual browser zoom/text resize remains untested.
- **S**: `qa/live-360/search/crawl.json`: 55 live route entries, titles/headings/
  links/content metadata. Public-route inventory includes aliases.
- **R**: `qa/live-360/security/browser.json` and
  `assessments/security-architecture.md`: fresh anonymous route subset; no forms
  or iframe embeds observed, public registration disabled, comments closed.
- **T**: theme `parts/header.html`, `parts/footer.html`, `parts/quotation-modal.html`,
  `patterns/homepage-foundation.php`, `style.css`, `assets/js/native-interactions.js`.
- **F**: `qa/live-360/prose-links/local.json`: local underlined-prose fix, ten
  views, zero link-distinction violations or control selector overlap.
- **A**: `assessments/experience-engineering.md`, including motion diagnostic.

No screen-reader listening session was performed. Physical-device accessibility,
forced colors, browser-chrome zoom, all interaction states and media alternatives
are not implied by L's automated pass. An axe incomplete item remains unresolved
until separately checked, including contrast against imagery.

## 1. Perceivable —20 criteria

| SC | Level | Identification | Status | Evidence and remaining action |
|---|---|---|---|---|
|1.1.1|A|Non-text alternatives|MANUAL-VERIFY|P/L find image alternatives structurally; individual photo, diagram and animated-workflow equivalence and decorative treatment need semantic review.|
|1.2.1|A|Prerecorded audio/video-only|MANUAL-VERIFY|T includes animated Platform workflow GIF; determine whether its text alternative conveys the full meaningful sequence, not merely a label.|
|1.2.2|A|Prerecorded captions|N/A|Inspected public runtime has no synchronized audio/video player; GIF has no audio. R reports no iframe embeds. Reassess any future tutorial embedding.|
|1.2.3|A|Media description/alternative|N/A|No synchronized audio/video media evidenced in the scoped site; silent GIF assessed under1.2.1. External video destinations excluded, not declared compliant.|
|1.2.4|AA|Live captions|N/A|No live audiovisual stream in inspected public templates/runtime.|
|1.2.5|AA|Prerecorded audio description|N/A|No synchronized audiovisual presentation in inspected public templates/runtime.|
|1.3.1|A|Information relationships|MANUAL-VERIFY|L: no automated semantic violations; source uses core headings/lists/landmarks. Read order and complete accessible relationships need manual review.|
|1.3.2|A|Meaningful sequence|MANUAL-VERIFY|DOM is server-rendered; local menu tab order verified. Whole-page reading order with visual columns/clone content not fully assessed.|
|1.3.3|A|Sensory instructions|MANUAL-VERIFY|No confirmed sensory-only instruction found; all public copy and interaction instructions need explicit semantic review.|
|1.3.4|AA|Orientation|MANUAL-VERIFY|Width matrix and source show responsive composition, but portrait/landscape device behavior and rotation were not directly tested.|
|1.3.5|AA|Input purpose|N/A|Mailto-only public contact, no personal-data input fields in R/T; no public account/checkout/subscription flow.|
|1.4.1|A|Color use|FAIL|P confirms nine sampled prose anchors across Platform/Solutions/Investors rely on color,1.85:1 against surrounding text. F fixes locally; production closure pending.|
|1.4.2|A|Audio control|N/A|No automatically playing audio in inspected public runtime; silent GIF is not audio.|
|1.4.3|AA|Text contrast|MANUAL-VERIFY|L zero automated violations; P/L contain axe incomplete contrast cases. Image-overlay and dynamic/focus states require measured visual checks.|
|1.4.4|AA|Text resizing|MANUAL-VERIFY|Z is CSS-viewport reflow equivalence only. Real200% browser zoom and text-only enlargement have not been verified. Invalid CSSzoom result is not a product failure.|
|1.4.5|AA|Text as images|MANUAL-VERIFY|Brand logos have an exception; source contains model/workflow imagery with possible meaningful labels. Necessity and available text equivalent need review.|
|1.4.10|AA|Reflow|MANUAL-VERIFY|L: zero horizontal overflow at320..2560; Z640/320 models zoom layout space. Actual zoom, all dialogs and vertically scrolling content loss not fully checked.|
|1.4.11|AA|Non-text contrast|MANUAL-VERIFY|No complete component-boundary/icon/focus-state contrast inventory. Text-only axe pass is insufficient.|
|1.4.12|AA|Text spacing|UNKNOWN|Required spacing overrides have not been applied and checked for clipping/overlap/content loss.|
|1.4.13|AA|Hover/focus content|MANUAL-VERIFY|Menu is explicitly opened and Escape dismisses it; all hover/focus-triggered language/menu/content behavior still needs complete persistence/dismissal/hoverability review.|

The live color finding and its distinction requirement are supported by
[W3C Use of Color guidance](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html).

## 2. Operable —20 criteria

| SC | Level | Identification | Status | Evidence and remaining action |
|---|---|---|---|---|
|2.1.1|A|Keyboard operation|MANUAL-VERIFY|L/Z complete menu26-control cycle passes320/390/1440; M Escape works live. Globe, hero, FAQ and quotation keyboard journeys still require full execution.|
|2.1.2|A|No keyboard trapping|MANUAL-VERIFY|Menu traps intentionally while open and Escape restores trigger; no trap observed. All other dialogs/widgets not completely tested.|
|2.1.4|A|Character shortcuts|MANUAL-VERIFY|T handlers chiefly use arrows/Escape/Enter; full registration/active-focus audit needed before excluding global single-character shortcuts.|
|2.2.1|A|Adjustable timing|N/A|No public session/time-limited completion flow observed; auto-updating presentation is assessed separately under2.2.2.|
|2.2.2|A|Pause/stop/hide|FAIL|Live GIF displayed without pause control; matching source asset145frames/14.5s/infinite loop. Live footer changes quote after8s; source7s recurring timer, no default-user pause. A records diagnostic.|
|2.3.1|A|Flash thresholds|MANUAL-VERIFY|No obvious flashing in screenshots, but GIF/video-frame luminance analysis was not performed. Static screenshots cannot prove a flash-frequency limit.|
|2.4.1|A|Bypass repeated blocks|MANUAL-VERIFY|Skip-link presence recorded Z and target main exists; actual keyboard skip activation/visible focus and target-focus outcome need explicit test.|
|2.4.2|A|Page titles|PASS|S: all55 crawled entries have titles; observed titles identify the page subject, Home uses Farmtree brand. Does not assert metadata marketing quality.|
|2.4.3|A|Focus sequence|MANUAL-VERIFY|L/Z menu sequence and wrap pass; whole-page sequence and all overlay entry/exit paths not exhaustively verified.|
|2.4.4|A|Link purpose/context|MANUAL-VERIFY|M preserved Investors destination works. S inventories links; repeated generic card labels/context and all accessible link names need semantic review.|
|2.4.5|AA|Multiple discovery paths|MANUAL-VERIFY|Header/footer/hub links and sitemap observed; confirm each non-process public page has sufficient user-facing discovery methods rather than assuming XMLsitemap alone.|
|2.4.6|AA|Headings/labels|MANUAL-VERIFY|S/L heading presence/structure recorded; complete subject/purpose quality review remains.|
|2.4.7|AA|Visible focus|MANUAL-VERIFY|T contains focus styles, M/L focus movement passes; contrast and visibility of every focused component not visually verified.|
|2.4.11|AA|Focus not obscured|MANUAL-VERIFY|Menu targets hit-test correctly; fixed header, scrolled-page links and dialog focus visibility need complete viewport-state checks.|
|2.5.1|A|Pointer gesture alternatives|MANUAL-VERIFY|Menu uses single click. Globe drag/hero swipe alternatives require actual interaction comparison, not source inference alone.|
|2.5.2|A|Pointer cancellation|MANUAL-VERIFY|M trusted clicks navigate; down-then-away/cancel gesture behavior for every custom control is untested.|
|2.5.3|A|Visible label in name|MANUAL-VERIFY|L automated checks pass; all custom icon/text combinations and dynamic control names require manual comparison.|
|2.5.4|A|Motion actuation|N/A|Inspected interaction source uses pointer/keyboard, not device-motion actuation; no shake/tilt input feature in scoped marketing site.|
|2.5.7|AA|Dragging alternatives|MANUAL-VERIFY|Globe supports pointer dragging in T; prove equivalent single-pointer non-drag operation or whether the interaction is nonessential before concluding applicability/pass.|
|2.5.8|AA|Minimum targets|MANUAL-VERIFY|M Investors38px-high target passes sampled geometry. Whole-site controls, spacing and inline exceptions require review; sub24px inline link boxes alone are not automatic failures.|

## 3. Understandable —13 criteria

| SC | Level | Identification | Status | Evidence and remaining action |
|---|---|---|---|---|
|3.1.1|A|Page language|MANUAL-VERIFY|L automated language checks pass; production all-route language attribute confirmation and assistive output not independently completed.|
|3.1.2|AA|Language changes|MANUAL-VERIFY|English site with Dutch/German unavailable labels and proper nouns; any passages needing language markup need content review.|
|3.2.1|A|Focus behavior|MANUAL-VERIFY|Menu tab traversal does not navigate; full page/widget focus events not exhaustively tested.|
|3.2.2|A|Input behavior|MANUAL-VERIFY|No public data forms; state-changing menu/hero controls exist and need complete change-of-context review.|
|3.2.3|AA|Navigation consistency|PASS|Shared T header/footer and M live menu use stable labels/order across reviewed templates; intentional responsive presentation does not alter link identity. Scope excludes admin/third-party sites.|
|3.2.4|AA|Control identification|MANUAL-VERIFY|Shared components support consistency; dynamic labels and all repeated functions not exhaustively compared.|
|3.2.6|A|Help consistency|PASS|Shared footer/contact destination and header contact remain in consistent structural positions in P/M/T. No separate page-specific help widget evidenced.|
|3.3.1|A|Error identification|N/A|No scoped public data-entry/submission form or comment/account workflow (R/T). Email-client errors belong to an external application.|
|3.3.2|A|Input labels|N/A|No public data-entry fields in scoped marketing runtime; navigation controls assessed under name/role criteria.|
|3.3.3|AA|Error suggestions|N/A|No public form validation workflow in R/T. Reassess if a backend form is introduced.|
|3.3.4|AA|Prevent consequential errors|N/A|No public legal/financial transaction or stored user-data modification flow; website links out to Platform.|
|3.3.7|A|Redundant entry|N/A|No multi-step public data-entry process in scoped website.|
|3.3.8|AA|Accessible authentication|N/A|No public marketing-site authentication process; WordPress administrative authentication explicitly outside this scope, not declared conformant.|

## 4. Robust —2 active criteria

| SC | Level | Identification | Status | Evidence and remaining action |
|---|---|---|---|---|
|4.1.2|A|Name/role/value|MANUAL-VERIFY|L axe passes and M checks menu state/focus; screen-reader interaction, live expanded/pressed states and full widget semantics not completely verified.|
|4.1.3|AA|Status announcements|MANUAL-VERIFY|T hero has polite status region and footer rotation aria-live off; actual announcement timing/content and clone silence need assistive-technology review.|

4.1.1 Parsing: **N/A to WCAG2.2 (removed criterion)**. Duplicate-ID checks remain
useful engineering evidence, but cannot be presented as an active2.2 SC pass.

## Closure gates

1. Deploy and verify prose distinction fix live; retain baseline FAIL evidence.
2. Resolve live automatic-motion pause controls; test user choice, keyboard,
   reduced-motion and persistent stopped state on each controlled animation.
3. Complete contrast/spacing/zoom/focus/gesture/widget/manual semantic checks.
4. Conduct supported screen-reader/browser journeys; record actual software,
   route, task, observed result and evidence, not assumed assistive behavior.
5. Confirm applicability against final route/runtime inventory after releases.

Until these gates close, the result is **PARTIALLY VERIFIED, known live failures**,
not WCAG2.2 AA conformant and not10/10 accessibility.
