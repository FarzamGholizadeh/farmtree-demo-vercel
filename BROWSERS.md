# FarmTree — Supported Browser Policy

## Policy

| Browser | Minimum supported |
|---|---|
| Chrome / Edge (Chromium) | last 2 major versions |
| Firefox | last 2 major versions + ESR |
| Safari (macOS) | 15.4+ |
| iOS Safari | 15.4+ |
| Samsung Internet | last 2 major versions |
| Internet Explorer | **not supported** |

Rationale: the site is a static, single-file deployment with no build step.
The floor of Safari/iOS 15.4 guarantees native support for `:focus-visible`,
`backdrop-filter` (prefixed), CSS `clamp()`, CSS custom properties, and
`IntersectionObserver` — all used by the site.

## How compatibility is handled (no build step)

Vendor prefixes are **hand-written in place** next to the standard property
(the standard property always comes last so it wins where supported):

- `-webkit-backdrop-filter` accompanies all 21 `backdrop-filter` uses
  (required by Safari ≤ 17). Where unsupported, glass surfaces fall back to
  their semi-opaque `background-color`, which keeps text readable.
- `-webkit-mask-image` accompanies the one `mask-image` use
  (logo-strip edge fade). Without mask support the strip renders unfaded —
  cosmetic only.
- `-webkit-user-select` accompanies both `user-select: none` uses.
- `text-wrap: balance` / `text-pretty` are progressive enhancements by
  design: browsers without support simply wrap headlines normally. No
  fallback code is required and none was added.
- `min-height: auto` occurrences were reviewed individually (see audit
  report); they are all inside media queries resetting fixed pixel values
  and behave identically in all supported browsers.

## Browserslist

`.browserslistrc` in the repo root encodes the policy for any future
tooling (Autoprefixer, Lighthouse CI, etc.). No build step currently
consumes it — it is documentation-as-config.
