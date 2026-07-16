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
