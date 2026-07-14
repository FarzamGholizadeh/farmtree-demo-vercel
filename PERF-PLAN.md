# FarmTree — Performance: Findings & Vercel Preview Test Plan

## Measured contributors (local Lighthouse 12, emulated mobile, slow-4G/4x CPU)

| Contributor | Evidence | Status |
|---|---|---|
| 680 KB uncompressed HTML on the critical path | `uses-text-compression`: 514 KiB savings | Served compressed by Vercel (brotli). **Must be verified on Preview, not assumed** — see plan below. |
| Site loader overlay holds first render | `#ftSiteLoader` hides at `load+650ms`, hard cap 2600 ms | **Design behavior — needs approval to shorten.** Options: hide on DOMContentLoaded+250 ms, or drop the hard floor. Until then FCP/LCP carry up to ~2.6 s of intentional delay. |
| Hero entry choreography | `ftHeroGo(0)` fades out→swaps→fades in (~800 ms) on first paint | Design behavior — needs approval to short-circuit the first render. |
| Render-blocking Google Fonts CSS | 791 ms | **Fixed** — stylesheet now non-blocking (`media=print` swap + noscript), fonts already `display=swap`. |
| Heavy PNGs | ecosystem 1164 KB, project-teams 2177 KB | **Fixed** — lossless WebP (826 KB / 1558 KB), pixel-identity verified. Further savings (~80%) possible with lossy WebP — **changes pixels, needs approval**. |
| Hero LCP image 549 KB (`case-giz_opt.webp`) | LCP request | **Mitigated** — preload + `fetchpriority=high`. Resizing/recompressing would change pixels — needs approval. |
| Main-thread | TBT 0 ms, bootup 0.1 s | No action needed. |
| Layout stability | CLS 0 | No action needed. |
| DOM size | 2,737 elements, depth 15 | Fine for this architecture; revisit at module split. |
| Unminified/unused CSS+JS (~75 KiB) | 60 style + 43 script blocks | Deferred to the module-split change (out of scope by instruction). |
| Animation/marquee cost | Style & Layout 703 ms total trace | Testimonial marquee + counters are cheap (TBT 0); no action. |

## Applied this pass (all verified 0.0000% pixel diff)

1. Non-blocking font CSS (+ noscript fallback)
2. Lossless-WebP conversion of the two heaviest PNGs + reference updates
3. `<link rel="preload" as="image" fetchpriority="high">` for the hero image
4. (Earlier commit) `loading="lazy" decoding="async"` on 53 below-fold images — page weight 12.4 MB → 4.7 MB

## Not applied — requires explicit approval (visible/behavioral)

- Shorten or remove the site-loader minimum display time (biggest LCP lever)
- Skip the hero fade-in on the very first paint
- Lossy recompression / responsive sizes for hero + photo assets
- Lossy WebP for the remaining palette PNGs (failed strict pixel-identity)

## Vercel Preview performance-testing plan (DO NOT DEPLOY until approved)

1. **Create a Preview deployment** from branch `production-hardening`
   (`vercel` CLI without `--prod`, or via a draft PR). Previews are
   noindex by default at Vercel *and* this build carries
   `<meta name="robots" content="noindex, nofollow">` — safe either way.
2. Verify compression: `curl -H "Accept-Encoding: br" -sI <preview-url>` →
   expect `content-encoding: br` and transferred HTML ≈ 90–120 KB (vs 680 KB).
3. Run Lighthouse 3× against the Preview URL (mobile + desktop presets),
   take the median; record FCP/LCP/TBT/CLS and the LCP element.
4. Confirm the LCP element is the hero image (not a fallback candidate) and
   that the loader → hero sequence accounts for the remaining LCP gap.
5. WebPageTest (or Lighthouse throttled) from an EU location (audience-aligned,
   Vercel edge) — record start-render and visually-complete.
6. Decision gate: if mobile performance is still < 85 after compression,
   present the approval-gated items above (loader timing, hero image weight)
   with measured impact estimates.
7. Delete the Preview or leave it (noindex) — production promotion only
   after explicit release approval.
