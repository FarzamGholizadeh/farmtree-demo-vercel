# FT-NATIVE-003 Enhancement Readiness

Status: locally implemented and validated; stopped at pre-release.

## Visual and media contract

The approved `farmtree` production theme and approved frontend remain the
visual source of truth. The native shell was not redesigned. Density was tuned
through component widths, type and spacing only; there is no page-level zoom or
transform.

The approved Platform GIF remains preserved at
`assets/media/source/power-project-staff-landscape-original.gif` (23,898,190
bytes; SHA-256 `b93af0bed7a5d5c7faa6c501c3b2863a6b3ef11eae337e423fb8e7a834caec02`).
The Homepage delivers its equivalent 1280×720 MP4 (1,419,354 bytes) with a
68,546-byte poster and a fixed 16:9 frame. The rendered performance smoke
confirmed that the GIF is not delivered, the MP4 is delivered, and cumulative
layout shift was 0.0052.

## Motion contract

Progressive CSS and IntersectionObserver behavior provides calm reveal,
connector, card, partner and testimonial motion. Content remains visible when
JavaScript is unavailable. Moving rails pause on hover/focus, controls remain
manual, and `prefers-reduced-motion: reduce` disables non-essential movement
and leaves the Platform on its poster until Play is requested.

## Content ownership and publication state

- The Homepage remains an editor-owned, content-only locked core-block pattern.
- `customer_segment` is REST-enabled and uses the controlled native single
  template. All ten source-ordered segment entries are private.
- Three source-grounded insight foundations are ordinary WordPress post drafts.
- The exact canonical WordPress sample post is drafted only; unrelated posts
  are not deleted or changed.
- English remains active at `/`. Dutch `/nl/` and German `/de/` remain reserved
  404 routes with no hreflang, sitemap or canonical alternate output.
- Quotation delivery remains explicitly unavailable and email-only. It has no
  form, endpoint, simulated success, PII collection, storage or logging.
- The AI Assistant remains inactive until a real provider is configured; its
  provider and capability gates remain server-side.

The customer-segment source file was used for order and messaging direction.
Named prospect lists, sales-only assertions, regulatory shorthand, implied
relationships and unsupported performance metrics were deliberately excluded.

## Discovery foundation

The English Homepage now emits a concise description plus source-backed
Organization, WebSite and visible-FAQ schema. Segment descriptions come from
their editable excerpts. WordPress core retains canonical ownership. No
alternate-locale metadata is emitted before approved translations exist.

## Validation evidence

Rendered screenshots and machine-readable results are in
`qa/native-enhancement/2026-08-27/` (ignored release evidence, not production
source). Captures cover 320, 375, 390, 430, 768, 1024, 1280, 1440 and 1920
pixels.

All widths passed: zero horizontal overflow, one H1, no missing main-image alt,
no unnamed main control, zero axe WCAG 2.0/2.1/2.2 A/AA violations, no console
or page errors, and usable reduced-motion output. Sequential Tab validation
covered 34 stops in the authenticated local runtime; all had visible focus.
The accessibility-tree smoke found one banner, one main, one contentinfo and no
ignored focusable nodes. Menu, language selector, Hero, FAQ, quotation dialog,
moving rail and Platform controls passed their interaction checks.

Repository validation, local WordPress bootstrap/verify and the AI Assistant
96-check static suite must remain green at handoff.

## Approval boundary

The native theme and its private/draft content remain local only. Coming Soon,
theme-enforced `noindex, nofollow`, the production `farmtree` theme and the
rollback path remain unchanged.
Push, deployment, activation, publication, translations, evidence-label signoff
and Coming Soon removal each require explicit human approval.
