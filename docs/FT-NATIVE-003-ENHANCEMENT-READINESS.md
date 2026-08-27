# FT-NATIVE-003 Enhancement Readiness

Status: locally implemented and validated; stopped at pre-release.

## Visual and media contract

The approved `farmtree` production theme and approved frontend remain the
visual source of truth. The native shell was not redesigned. Density was tuned
through component widths, type and spacing only; there is no page-level zoom or
transform.

The user-supplied Platform GIF remains preserved byte-for-byte at
`assets/media/source/final-tools-review-original.gif` (87,123,145 bytes;
SHA-256 `b7942033999dbc189d0bd8b1e83567b801d1ae1e02d78f88cbdbb4d82ba148de`).
The Homepage delivers the same 57-second, 960×540 sequence as a 7,680,666-byte
MP4 with a 33,302-byte poster and fixed 16:9 frame. A 2,420,203-byte WebM is
retained as an alternate-ready derivative. Rendered checks confirm that the GIF
is not delivered, the MP4 is used, and the frame has no letterboxing.

## Motion contract

Progressive CSS and IntersectionObserver behavior provides calm reveal,
connector, card, partner and testimonial motion. Content remains visible when
JavaScript is unavailable. Moving rails pause on hover/focus, controls remain
manual, and `prefers-reduced-motion: reduce` disables non-essential movement
and leaves the Platform on its poster until Play is requested.

## Content ownership and publication state

- The Homepage remains an editor-owned, content-only locked core-block pattern.
- `customer_segment` and `proof_story` are REST-enabled and use controlled
  native single templates. All ten source-ordered segments and all four proof
  stories are private.
- Fifteen supporting English pages are private and nine source-grounded insight
  articles are ordinary WordPress post drafts.
- The exact canonical WordPress sample post is drafted only; unrelated posts
  are not deleted or changed.
- English remains active at `/`. Dutch `/nl/` and German `/de/` remain reserved
  404 routes with no hreflang, sitemap or canonical alternate output.
- Quotation delivery remains explicitly unavailable and email-only. It has no
  form, endpoint, simulated success, PII collection, storage or logging.
- FT Bot remains invisible until a real provider is configured. The plugin has
  server-side OpenAI, OpenAI-compatible and Anthropic adapters, source-first
  retrieval, configurable model/history/output/rate/daily limits and opt-in
  logging that defaults off.

The customer-segment source file was used for order and messaging direction.
Named prospect lists, sales-only assertions, regulatory shorthand, implied
relationships and unsupported performance metrics were deliberately excluded.

## Discovery foundation

The English Homepage emits a concise description plus source-backed
Organization, WebSite and visible-FAQ schema. Pages, posts, proof stories and
segments emit bounded descriptions, canonical/Open Graph metadata and valid
WebPage, BlogPosting or Breadcrumb schema as appropriate. WordPress core
retains canonical ownership. No alternate-locale metadata is emitted before
approved translations exist.

## Validation evidence

Rendered screenshots and machine-readable results are in
`qa/final-english-master/2026-08-27/` (ignored release evidence, not production
source). Full Homepage captures cover 320, 375, 390, 430, 768, 1024, 1280,
1440 and 1920 pixels; section-level mobile/desktop and contact captures add 24
focused screenshots.

All widths passed: zero horizontal overflow, one H1, no missing main-image alt,
no unnamed main control, zero axe WCAG 2.0/2.1/2.2 A/AA violations, no console
or page errors, and usable reduced-motion output. Sequential Tab validation
covered 34 unique stops in the authenticated local runtime; every stop exposed
`:focus-visible` and a visible indicator. The accessibility-tree smoke found
one banner, one main, one contentinfo, four navigation regions, 26 headings and
no ignored focusable nodes. Menu, language selector, six-second Hero autoplay
and interaction pause, FAQ, quotation fallback, opposing moving rails,
visibility-aware Platform video, technology flow and exact final counters all
passed.

The final 1440 performance sample recorded 1,186,225 transferred bytes across
21 resources, FCP 1,092 ms, LCP 1,160 ms, CLS 0.00284 and no long task. The
browser requested only MP4 metadata in that sample, so the committed media file
sizes above remain the authoritative full-payload comparison.

Repository validation, local WordPress bootstrap/verify and the AI Assistant
100-check static suite must remain green at handoff.

## Approval boundary

The native theme and its private/draft content remain local only. Coming Soon,
theme-enforced `noindex, nofollow`, the production `farmtree` theme and the
rollback path remain unchanged.
Push, deployment, activation, publication, translations, evidence-label signoff
and Coming Soon removal each require explicit human approval.
