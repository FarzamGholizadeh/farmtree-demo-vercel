# FarmTree — Official Logo Rollout Report

Branch: `production-hardening` · Commits: `c9bd6b7` (assets), `f1002ae` (placement)
Nothing deployed. Nothing merged. Demo remains `noindex, nofollow`.

## 1. Logo locations found (complete audit)

| # | Surface | Location | Previous asset |
|---|---|---|---|
| 1 | Desktop/tablet/mobile header (linked → home) | `.logo-wrap img`, line ~3994 | embedded_010.webp 520×145 |
| 2 | Mobile navigation panel (linked → home) | line ~4018 | embedded_011.webp 520×145 |
| 3 | Footer (white pill, JS click → home) | `.footer-logo`, line ~4721 | embedded_046.webp (runtime-replaced by embedded_070.png) |
| 4 | Footer runtime setter | `fixFooterLogo()` in `farzam-final-corrections-v2-js` | injected embedded_070.png |
| 5 | Site loader | `.ft-loader-logo img` | farmtree-icon.png 120×120 (symbol) |
| 6 | Chat assistant avatar | `.ft-chat-avatar img` | farmtree-icon.png |
| 7 | Chat JS config | `ASSETS.logoIcon` | farmtree-icon.png |
| 8 | Favicons | icon-32/192/512 + apple-touch-icon-180 | derived from embedded_010 |
| 9 | Organization JSON-LD `logo` | head | icons/icon-512.png |
| 10 | `og:image` / `twitter:image` | head | case-giz photo — **not a logo**, untouched |

## 2. Locations updated

1, 2, 3 → responsive `<picture>` with official derivatives (WebP srcset 320/640/1024w + PNG fallback + srcset on fallback).
4 → neutralized (no longer overwrites the official markup; keeps its `data-page` behavior).
9 → `https://farmtree.earth/assets/brand/farmtree-logo-primary-1024.png`.
5, 6 → attributes only (intrinsic dims, decorative `alt=""` + `aria-hidden`, loader now `eager` — it is the first paint).

## 3. Intentionally NOT updated + reason

- **Favicons / Apple touch icon (8)** — a symbol-only crop from the official master is **computationally impossible**: the top leaf spans x 20–1504 while the wordmark begins at x 716 directly beneath it; every rectangle containing the whole symbol contains ~50k wordmark pixels. Per instruction, current favicons retained. **Brand-asset requirement: official standalone symbol file.**
- **Loader/chat symbol (5–7 asset itself)** — `farmtree-icon.png` is a pre-existing symbol asset that cannot be re-derived from the official master (same crop impossibility). Retained; same standalone-symbol requirement applies.
- **`og:image`/`twitter:image` (10)** — a case-study photo, not a brand-logo placement.
- **`LOGOS.FarmTree` map entry** — now unused; left in place to keep the diff minimal.
- No decorative logos added anywhere; Hero untouched (no approved logo position exists there).

## 4. Asset dimensions & sizes

- **Master** `assets/brand/farmtree-logo-original.png`: 3840×1580, opaque white-bg RGB PNG, 1,423,644 B, sha256 `292c79f8…` — **byte-identical to the supplied file, never modified**.
  - ⚠ Deviation from task premise: the supplied master is **not transparent**. User-approved decision: proceed white-bg (all site placements use existing approved white pill containers, so it is visually seamless). White-keying was rejected (would alter anti-aliased edges).
- **Trim** (only near-white margins removed; threshold 245 — 11 stray upscale-noise pixels at RGB 245–251 in the margins, artwork untouched; +2 px safety): 3840×1580 → **3674×1348**, aspect **2.7255**.
- **Derivatives** (LANCZOS from trimmed; WebP lossless, pixel-identical to PNG verified):

| Asset | Dimensions | PNG | WebP (lossless) |
|---|---|---|---|
| farmtree-logo-primary-320 | 320×117 | 21 KB | 16 KB |
| farmtree-logo-primary-640 | 640×235 | 75 KB | 54 KB |
| farmtree-logo-primary-1024 | 1024×376 | 227 KB | 164 KB |

Old logo files (embedded_010/011/046.webp, 17 KB each) are no longer referenced but remain on disk (not deleted). The 2048/3840 master is never served to normal page rendering — only ≤1024 derivatives.

## 5. Responsive behavior (existing approved geometry preserved)

| Viewport | Pill/img height (pre-existing CSS) | Rendered logo (aspect 2.7255) |
|---|---|---|
| ≤360px | img 30px | 82×30 |
| 390–430px | img 34px | 93×34 |
| ≥768px | img 36–40px | 98–109×36–40 |
| Mobile nav panel | img 34px | 93×34 |
| Footer | pill 52–58px | ≈129×52 box (content ratio 2.78 ✓) |

⚠ **Recommended-width deviation:** the requested 150–190 px header width is geometrically impossible at the official 2.7255 aspect without exceeding the 52 px height cap / changing header height (150 px ⇒ 55 px, 190 px ⇒ 70 px tall). Hard constraints (exact aspect, no header-height change) were honored; rendered widths are 82–109 px. Raising pill heights is a design decision needing approval.

## 6. CLS & performance

- Intrinsic `width="320" height="117"` on every `<picture>` img; CSS height drives rendering with `width:auto` + `object-fit:contain` (a `width:auto` guard was required for the footer, whose CSS constrains only height — without it the intrinsic width attribute stretched the image; caught and fixed in QC).
- **CLS measured: 0.00000** (buffered layout-shift observer) and Lighthouse CLS **0**.
- Header logo `loading="eager" decoding="async"` (no fetchpriority — not Lighthouse-confirmed beneficial); footer `lazy`; loader `eager` (was incorrectly lazy inside the first-paint loader).
- The `sizes` attributes (110px/115px) make browsers fetch the 320w file at 1×/2× (16 KB WebP).

## 7. Screenshots & pixel QC (`qa/logo-qc/`)

Before/after captured at 320/375/390/430/768/1024/1280/1440/1920 (headers), 320/390/768/1440 (footers, mobile nav), loader and chat, all at DPR 2 (Retina).

- Headers: diffs confined to the logo pill area (columns x≈180–290 CSS); nav/pills/heights pixel-identical. Visually confirmed crisp at DPR 2, no stretching/clipping/collision.
- Footer: official logo in pill; footer grid and "About Us" column x-positions identical. Pill is narrower (content-driven) — grid alignment unchanged.
- Mobile nav: logo clear of the close button.
- Loader/chat: unchanged asset; loader diff is animation-phase timing only.

## 8. Accessibility verification

- Linked logos: accessible name = img `alt="FarmTree homepage"` (button inherits; no duplicate `aria-label`). Footer: `alt="FarmTree"`. Loader/chat symbols: `alt="" aria-hidden="true"` (decorative).
- Previous-pass verification (workflow, all recorded in `qa/release/`): axe 8 routes — 0 serious/critical; keyboard nav 15-tab traversal with visible focus, modal focus + Escape verified; honeypot unreachable by keyboard.

## 9. Lighthouse before / after (local, emulated mobile; SEO 69 = intentional staging noindex)

| | Before logo pass | After logo pass |
|---|---|---|
| Performance | 64 | **65** |
| Accessibility | 100 | **100** |
| Best practices | 100 | **100** |
| SEO | 69 (noindex by design) | 69 (unchanged by design) |
| FCP / LCP | 4.2 s / 14.0 s | 4.2 s / 17.1 s* |
| TBT / CLS | 90 ms / 0.0002 | **0 ms / 0** |
| Page weight | 4,324 KiB | 4,307 KiB |

\* LCP oscillates 14–17 s across runs under throttling; it is gated by the site-loader hold (≤2.6 s design behavior) + 680 KB uncompressed HTML on the simulated network — both pre-existing, documented in PERF-PLAN.md with approval-gated fixes. The LCP element is now the official header logo.

## 10. Dark-background contrast findings

Header (dark green) and footer (dark green): the logo renders inside **pre-existing approved white pill containers** — no contrast issue, no new container introduced, no white/reversed logo variant created. No placement required a reversed variant; none was stopped.

## 11. Remaining blockers / requirements

1. **Formspree form ID** — release blocker (unchanged; no simulated success).
2. **Official standalone symbol asset** (transparent) — required for proper favicons and loader/chat marks.
3. **Official transparent full-logo master** — current master is opaque white-bg (works in pill containers; a transparent original remains preferable for future surfaces).
4. `https://farmtree.earth/...` og:image + JSON-LD logo URLs will 404 until the site (with `assets/brand/`) deploys to that domain — expected pre-release state, verified by link checker.
5. Pre-existing (not introduced, left unfixed for commit atomicity): MRV counter `undefined.replace` console error; `#platform` route renders cocoa content (found by axe agent); services-page muted-text contrast 4.22:1; loader hold time — all pending decisions.
6. **Lead-CTA routing conflict (found by forms verification agent):** hero/final-CTA buttons whose text matches "Request a demo" hard-redirect to the external registration page (`tool.farmtree.earth/...Register`) because a legacy text-matched click listener fires before the `data-ftmodal` handler — while a later script (`rewriteRequestButtons`) intends them to open the contact modal. Two scripts encode opposite intents for the primary lead CTA. Works today (external form), but needs a product decision: external registration vs on-site modal. "Ask for a quotation" is unaffected and opens the modal.

## 12. Confirmations

- Original logo artwork **not modified** (byte-identical master; derivatives are trim+downscale only)
- **No unofficial variant** created (no recolor, no white version, no redraw, no AI regeneration)
- No approved content changed; Hero card copy retained exactly as approved
- No unrelated visual change (pixel-verified outside logo areas)
- **Nothing deployed; nothing merged**; module split still deferred
