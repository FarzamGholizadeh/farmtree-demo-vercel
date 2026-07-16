# FarmTree — Release Checklist

_Last updated: 2026-07-15 (approved feature pass: socials, About proof, segment pages)_

## A. Resolved
- Official transparent logo master installed + verified (sha256 `9aac825a…`); responsive derivatives live
- MRV counter crash fixed (+ regression test)
- Platform/Cocoa route synchronization fixed (+ regression test)
- CTA decision implemented: Demo → Register, Platform-entry (incl. "Explore the platform") → Login, quotation → modal; all native anchors (+ suite)
- All 39 VS Code/webhint diagnostics fixed or narrowly excepted (`.hintrc`, documented)
- Routing consolidated to the single authoritative early router
- Footer LinkedIn + YouTube native anchors (exact URLs, new-tab, labelled)
- About proof row (+100 / +30 / +40 / +1,000,000) + Science-based microscope+leaf icon
- Customer Segments homepage section removed; ten dedicated segment pages + menu navigation (axe-clean, suites green)
- a11y 100 (Lighthouse), zero console errors, honest form error states, staging noindex

## B. Requires Farzam decision
- Services-page muted-text contrast (4.22:1 vs 4.5 AA) — needs approved color tweak
- Heading-order retag on cocoa/pricing cards (visual-identical retag proposal pending)
- Site-loader hold time & hero first-paint choreography (largest mobile-LCP lever)
- Lossy recompression of hero/photo assets (visible-quality trade-off)
- Remaining paused hardening phases (counters/observers consolidation, CSS/JS extraction, performance targets 80/90, security headers, claims register, QA npm scripts)

## C. Requires external credential/configuration
- **Formspree form ID** (release blocker for contact/quotation modal + request-page forms — demo requests no longer depend on it)
- Recipient delivery verification after ID is set (FORMS.md checklist)
- Official standalone FarmTree symbol asset (favicons/loader/chat marks) — brand follow-up, not a blocker while current favicon stands

## D. Requires production deployment
- farmtree.earth asset URLs currently 404 by design (og:image, JSON-LD logo, brand assets) — resolve on deploy
- Switch `<meta name="robots">` staging noindex → `index, follow` (RELEASE TOGGLE comment in head)
- Brotli/caching verification on production host

## E. Post-deployment verification
- HTTP 200: OG image, JSON-LD logo, favicons, sitemap.xml, robots.txt, canonical URL, /assets/brand/*
- One real submission per form (3 forms) + inbox delivery confirmed
- Lighthouse mobile+desktop on production URL (3-run median)
- LinkedIn/YouTube links resolve to the correct company pages (no redirects)
- Spot-check segment routes on production

## F. Deferred technical debt
- CSS/JS modular extraction of the monolithic index.html (highest-value maintainability item)
- Orphaned CSS selectors for removed sections (inert, documented)
- Dual hero-controller cleanup; counter implementation unification
- Hash-route SEO limitation (single indexable document) — clean-URL architecture proposal documented in ARCHITECTURE.md
