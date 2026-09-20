# News & Insights — Live360 editorial workstream

Status: LOCAL IMPLEMENTATION / VALIDATION. Not deployed; no production acceptance claimed.
Brief: user attachment `ce2001e9-3ff9-495e-95e4-854318d2563e`, received 2026-09-20.

## Production baseline

Read-only Chrome inspection on 2026-09-20 confirms `/blog/` has one H1, nine
existing stories, one large feature and eight grid items. Existing card URLs,
headlines and excerpts were inspected. Screenshot: ignored
`qa/live-360/news-before-1440.png`. Two off-screen image `currentSrc` values were
empty at capture; this is not evidence of broken image URLs.

No existing article will be deleted to make space. Several requested subjects
overlap existing short explainers: CRCF, EUDR, VM0042 and restoration. The new
long-form articles must add operational depth, not reproduce those summaries.

## Design and ownership

- Retain News & Insights title, current typography, cream/green/gold palette.
- Asymmetric lead + two supporting features; three latest stories; disjoint
  topic sections; Explore topics; existing approved CTA pattern.
- No carousel, newsletter, third-party script or new frontend library.
- Native posts remain editable in WordPress: title, body, excerpt, date,
  category, featured image. Theme controls layout; no article bodies in PHP.
- One allocation pass per response prevents a post appearing in multiple
  sections. Image identity must be unique, not merely a changed crop/format.
- Seven compact topics, mapping existing category labels without deleting them.
- New content source and claim register live outside the public webroot.

## Required release gates

Exactly twelve additional posts; 800–1,300 words normally; primary-source-led
analysis, visible references, truthful dates and attribution. No unsupported
recognition, certification, return or outcome claims. Explicitly distinguish
facts, interpretation and recommendations.

Validate 320/360/390/414/768/1024/1280/1440/1920/2560; keyboard/focus, overflow,
contrast, headings, responsive pictures, true LCP priority, no duplicate cards,
titles, decks or image identities; crawl all article/internal routes; metadata,
canonical and truthful Article schema; test/build/audit; reviewed production
content scope with ownership checks, fresh backup and protected-state comparison.
Do not use the old theme-only runner for a plugin/content release.

## Other Live360 work preserved

The uncommitted `native-interactions.js` Hero interaction gate predates this
workstream. Preserve it separately; do not silently bundle it into this release.
The single approved reconciler dry-run has been consumed: 0 create, 0 update,
102 unchanged, 0 conflict, 1 skipped. Protected content and runtime hashes match;
`cron` option changed and attribution remains unresolved. Never repeat that
authorization or infer that the wider audit passed. No APPLY occurred.

## Current queue

Twelve articles, unique image allocation and loopback integration are implemented.
Local repository and WordPress checks pass; browser evidence covers ten widths,
twelve routes and mobile/desktop keyboard/axe checks. See
`docs/editorial/LOCAL-EDITORIAL-RELEASE.md`. Exact-commit artifact audit follows
the focused local commit. Production remains blocked by UNRESOLVED cron evidence;
the independently gated production content adapter/plan is not enabled.
