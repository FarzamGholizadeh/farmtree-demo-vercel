# FarmTree — Final Hardening Report

## Consolidated hardening pass (2026-07-14, phases 1-4 of 13; remainder paused)

- **P1 baseline (d8cd74f):** 39-diagnostic machine inventory, Lighthouse mobile 60 / desktop 83 (a11y 100, BP 100, SEO 69 = staging noindex), 126-shot route x viewport matrix, all suites green. Pre-existing finding: horizontal overflow services@320.
- **P2 diagnostics (41b8ed7):** 17 inline styles -> semantic classes (computed-style-identical, two cascade-overridden cases preserved); 10 min-height:auto -> 0 (context-reviewed); backdrop-filter order fixed; duplicate hero download removed (144KB/load); narrow .hintrc exceptions for text-wrap(8)/theme-color(1)/fetchpriority(2) — standards-based PE, complete fallbacks, documented; 0 unexplained diagnostics remain.
- **P3 CTA anchors (6457a4d):** all external Platform/Demo controls are native anchors with exact approved URLs; quotation remains the single scripted (modal) action; last visible-text routing removed; 7 control classes verified computed-style- and box-identical.
- **P4 router consolidation (0fac982):** single authoritative early router; legacy setPage/go()/wrappers/reconcile timers removed (inventory in commit message); suites + deep-link alias + language layer verified.

**Paused phases (per 2026-07-15 instruction):** counter/observer consolidation, CSS/JS extraction, performance targets (mobile >=80/desktop >=90), remaining a11y retags, form/config centralisation, security headers, SEO clean-URL work, claims register, npm QA gates.

## Approved feature pass (2026-07-15) — commits a27fd21, 7a08274, 8a84bb4, c8b1dd2, af2503f, +tests

1. **Footer socials (a27fd21):** LinkedIn `https://www.linkedin.com/company/farmtree-b-v` and YouTube `https://www.youtube.com/@farmtree8168` as native anchors (new-tab, noopener noreferrer, aria-label+title, official play-button SVG via currentColor); circle system pixel-matched (43x43 boxes); email icon untouched.
2. **About proof row + icon (7a08274):** compact secondary row with exact values `+100 / +30 / +40 / +1,000,000` and approved labels; three capability cards + wording preserved; ♧ replaced by inline microscope+leaf SVG in the unchanged ring system.
3. **Customer Segments removal (8a84bb4):** homepage section + ft-seg carousel script fully removed (0 ftSeg refs); card content archived (qa/final-hardening/results/segment-cards-archive.json); testimonials -> partner perspectives flow clean.
4. **Ten segment pages (c8b1dd2):** one data-driven template, synchronous injection, routes `#segment-{advisors,development-banks-donors,ngos-conservation,nbs-carbon,mrv-esg,government-parastatals,industry-associations,large-agri-corporates,social-enterprise,implementation-organisations}`; approved A-J content direction, no invented claims; per-route document titles; Register-anchor demo CTA + modal Talk-to-FarmTree.
5. **Hamburger menu (af2503f):** gold CUSTOMER SEGMENTS subhead + 10 short-label links in the FarmTree box (2-col desktop, 1-col <=560px); menu scrolls; click closes menu and routes.
6. **Verification:** segments-regression suite (30 checks) + all three existing suites PASS; axe on all 10 routes: 0 critical / 0 serious / 0 moderate; no overflow at 320-1920 on touched surfaces; before/after shots in qa/final-hardening/results/.

Diagnostics note: the archived original segment-card texts contained two claims not carried onto the new pages ("aligned with Verra and Gold Standard", "investor-grade") — the new pages use only the approved A-J directions; flag retained in archive for the claims register.

## Approved UX/visual pass (2026-07-15, evening) — commits 163ced4, 953e11b, f885c88, a63890a, f6804fd, +tests

1. **Bento menu + close control (163ced4):** 5-card Bento (MAIN/FARMTREE/COMPANY 4-4-4, CUSTOMER SEGMENTS 8 + FORMS & LEGAL 4), dedicated segments card (2-col links), SVG close button geometrically centred (52px CSS, >=47px rendered), Escape-to-close + focus return + Tab trap added.
2. **About final design (953e11b):** slogan + three capability cards + compact proof row removed; four primary Track Record cards (+100/+30/+40/+1,000,000) in the premium .metric system with topical ring icons (users/folder/map/farmer); counter opt-out keeps values exact; 4/2x2/1 responsive.
3. **Section backgrounds (f885c88):** tokens --section-base-technology-bg #FAF8F1, --section-references-bg #EBF2EA, --section-use-cases-bg #F6EFDF; AA contrast verified (ink 12.2-13.2:1, muted 4.6-5.0:1).
4. **Case Studies (a63890a):** homepage section moved verbatim to dedicated #case-studies page (hero + 4 preserved cards + CTA pair); menu link added; title set.
5. **FAQ heading (f6804fd):** one line at >=1024px via width-cap removal + fit clamp (34-38px), zero overflow; natural wrap below.
6. **a11y (in tests commit):** About eyebrow -> real h2 (identical visuals), sr-only h2 on the case-studies card grid — home + case-studies axe-clean (0 crit/serious/moderate); segment route, platform clean; cocoa's 1 moderate heading-order pre-existing/documented.

All suites green (segments incl. 30+ new checks, console, platform-route, CTA). Before/after pack: qa/final-hardening/results/pass3/.

## Approved UX/brand pass (2026-07-15, evening 2) — commits 68d1215, 41dd826, 674b427, c6b72b9, ce06a9f, +tests

1. **Remove How FarmTree Works (68d1215):** section #workflow (eyebrow/heading/4 cards) removed; orphaned dict keys cleaned; References -> News -> Use Cases flow. F&Q: eyebrow FAQ->F&Q, heading 'Questions about agroforestry modelling?'->'Questions about FarmTree modelling?' (markup + EN dict); one line >=1024.
2. **Base Technology connectors (41dd826):** responsive SVG overlay, 4 diagram->card paths (pixel-exact via ResizeObserver, maxDelta 0 at all 9 widths), calm staggered gold pulse (animateMotion), reduced-motion drops pulses, IntersectionObserver pauses SMIL offscreen; decorative aria-hidden; no canvas; progressive enhancement.
3. **Title system + desktop density (674b427):** .ft-hsec reusable class + forced >=1024 rule (plain wrap, max-width min(820px,92vw)) -> homepage headings <=2 lines / 0 truncation at 768-1920; documented 320/390 3-line exceptions. Density via tokens (NO zoom/scale/viewport/root-font): --fx-section-y -18%, headings -11%, card padding -12%, wider wraps; desktop-only, mobile untouched.
4. **Favicon + loader + assistant (c6b72b9):** favicon set from master (full logo, white square, favicon.ico+16/32/192/512+180); loader full logo in white pill ~140/125px (breathe pulse kept, circular ring dropped as unsuited to wordmark); assistant header full logo ~76px in white container, title/subtitle/close preserved. Shared 320 webp -> single fetch.
5. **Diagram logo (ce06a9f):** rendered raster (home-ecosystem-v10.ll.webp) originals preserved; new derivative home-ecosystem-current-brand.webp — scripted composite replacing the old tree+wordmark with the approved logo (bbox (538,298)-(852,485)), 'model' preserved; all 5 diagram refs repointed; natural dims unchanged (no shift), sharp DPR1/2.
6. **Verification (tests commit):** pass4-regression suite (37 checks) + all existing suites green; axe home/platform/case-studies/segment clean (cocoa's 1 moderate heading-order pre-existing); Lighthouse before/after recorded. Master hash 9aac825a... unchanged throughout.
