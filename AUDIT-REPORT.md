# FarmTree — Production Hardening Audit Report

Branch: `production-hardening` · Baseline commit: `5facbd1` · 8 atomic fix commits
Backup: `index.html.backup-pre-production-audit` (also `index.html.safe-before-redesign`)
Baselines: `qa/baseline/` (desktop 1440, mobile 390, track page — captured before any change)

---

## 1. Files changed

| File | Change |
|---|---|
| `index.html` | All fixes (details below), 8 atomic commits |
| `BROWSERS.md` | New — supported-browser policy |
| `.browserslistrc` | New — policy as config (no build consumes it yet) |
| `FORMS.md` | New — Formspree setup + release checklist |
| `robots.txt`, `sitemap.xml` | New |
| `assets/icons/icon-{32,180,192,512}.png` | New — favicons from existing logo |
| `.gitignore` | New — excludes qa/, backups, .env.local, .vercel |
| `qa/` (untracked) | Baselines, diff shots, axe/Lighthouse results, smoke tests |

## 2. Edge diagnostics: reproduction & classification

The Microsoft Edge Tools count (97) comes from the VS Code extension (axe + webhint)
and cannot be reproduced headlessly. Equivalent scanners (axe-core 4, html-validate 8,
webhint-rule greps) reproduced the same finding classes:

| Class | Category | Found | Fixed | Retained |
|---|---|---|---|---|
| Images missing alt | accessibility | 10 | 10 | 0 |
| Button type not set | semantic HTML | 83+ | 83 | 0 |
| Duplicate viewport meta | semantic HTML | 1 | 1 | 0 |
| backdrop-filter unprefixed | compatibility | 17 | 17 | 0 |
| mask-image / user-select unprefixed | compatibility | 3 | 3 | 0 |
| text-wrap support warnings | compatibility | 8 | 0 | 8 (progressive enhancement; Chrome ≥114 in policy) |
| min-height:auto warnings | compatibility | 10 | 0 | 10 (media-query resets; `auto` = initial value; `0` would alter flex sizing) |
| Inline styles | maintainability | 79 | 45 → `ft-u-*` classes | 34 (JS-toggled display states, transition-delay stagger, SVG font attrs, singletons) |
| Invalid `</br>` end tag | semantic HTML | 1 | 1 | 0 |
| aria-label misuse (div) | accessibility | 2 | 2 (role=status / role=group) | 0 |
| Implicit input type | semantic HTML | 3 | 3 | 0 |
| Forms submit nowhere | **functional defect** | 3 | 3 | 0 |
| Dead header Contact button | **functional defect** | 1 | 1 | 0 |
| Missing SEO surface (canonical/OG/favicon/robots/sitemap/JSON-LD) | SEO | 6 areas | 6 | 0 |

## 3. Intentionally retained & why

- **1,726 `!important` declarations** — load-bearing in the 60-block override-stack CSS;
  reduction requires the deferred module refactor (below).
- **`<style>`/`<script>` blocks in `<body>` (24 html-validate errors)** — the module
  split (task 10) was deferred by decision: extraction of 60 style + 43 script blocks
  is the highest-regression-risk change and should be its own reviewed change.
  Plan: extract in file order into `styles.css` + `app.js`, verify with the matched-budget
  screenshot harness in `qa/tools/`.
- **XHTML-style self-closing tags (85 void-style errors)** — valid HTML5, cosmetic.
- **Exact-duplicate CSS rules (~10)** — context-dependent (different media queries /
  keyframes); dedupe risk outweighs ~0.5 KB.
- **axe color-contrast (2–7 nodes/page, gold `#d3b06b` on green `#00613f`, 3.66:1)** —
  fixing requires changing brand colors → needs your approval. A darker gold or lighter
  text at ≥4.5:1 would resolve it.
- **axe heading-order (1, cocoa page)** — h3 cards after h1 subhero; retagging is a
  structural change → retained pending approval.
- **Hero "Future service" card** — you chose *keep card, fix wording*; **awaiting your
  replacement text** ("Reserved homepage position…" line still present).

## 4. Accessibility results (axe-core 4)

6 pages scanned (`home, services, track, team, contact, cocoa`):
**0 critical, 0 serious except color-contrast (brand palette, above), 1 moderate
heading-order (cocoa)**. Fixed this audit: alt text (10), labels/aria-labels (8 controls),
modal focus management, `:focus-visible` outlines site-wide, loader/language-switcher roles.
Lighthouse accessibility: **96**.

## 5. Browser/functional test results (headless Chrome, puppeteer)

- Forms: placeholder endpoint → **error state, no fake success, button re-enables** ✓;
  stubbed 200 → success state ✓ (request page, modal success + error paths, chat) ✓
- Contact pill → `page-contact` ✓ (was a dead button)
- Navigation smoke (menu → Team etc.) ✓ · **0 JS errors** across home/track/team/contact ✓
- External links: all 200 ✓ · Internal asset refs: all resolve ✓
- Playwright proper was not installable (no browser download); puppeteer-core + system
  Chrome used instead — scripts kept in `qa/tools/` for reuse.

## 6. Lighthouse (local, uncompressed static server)

| Category | Before | After |
|---|---|---|
| Performance | 60 | **63** (page weight 12.4 MB → **4.7 MB**, LCP 19.4 s → **14.0 s** local) |
| Accessibility | 96 | **96** |
| Best practices | 100 | **100** |
| SEO | ~83 | **100** |

Production will score better (Vercel brotli + CDN). Remaining perf levers (not done —
would touch imagery/architecture): resize/compress the hero webp (LCP), module split,
converting the 680 KB HTML.

## 7. Remaining risks / open items

1. **`FT_FORM_ENDPOINT` placeholder** — forms error until a Formspree ID is set (FORMS.md). **Release blocker.**
2. **Canonical/OG/sitemap URLs** point to `https://farmtree-demo-vercel.vercel.app/` —
   swap when the final domain is decided (one search-replace; STOP-rule item).
3. **Hero card wording** — awaiting your text (STOP-rule item).
4. Color-contrast + heading-order — awaiting approval (brand/structure).
5. Router layers: navigation works via the legacy `setPage` path; the newest router's
   click handler appears inert. Works today; flagged for the module-split refactor.
6. `#request` deliberately aliases to `#contact`; the request-page form remains
   functional but is only reachable programmatically ("Send another request" flow).

## 8. Content & design integrity confirmation

No approved copy, section order, colors, typography, imagery, or interactions were
changed, except these **logged, functionally-required** items:
- Chat "Prototype mode: leads saved locally…" note **removed** (task 12; false in production)
- 2 chatbot canned replies + modal success line updated to drop prototype phrasing
  ("…ready to be shared" → "…has been sent") — flag if you want different wording
- Header Contact button `data-page` request→contact (dead-button fix; label unchanged)

Visual regression: every commit verified against pre-change baselines with a
matched-render-budget pixel diff — **0.0000% strong-pixel change** on desktop home
at every step; mobile/track within animation-jitter band (≤0.18%, counters/marquee).
