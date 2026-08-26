# FT-NATIVE-002 Homepage Direction

Status: Implemented and validated locally; pre-release

## Dependency And Source

FT-NATIVE-002 local development can proceed while FT-NATIVE-001B is blocked.
Backup and noindex safeguards gate deployment and production WordPress runtime
validation, not repository implementation or the completed isolated local
WordPress validation. FT-NATIVE-002 must not expand or alter the
runtime-validation responsibilities of FT-NATIVE-001B.

The Frank-approved requirements derived from the 25 August 2026 website review
transcript are a product and content source of truth for this sprint. Interpret
obvious speech-to-text mistakes from context, but do not invent business claims,
partner evidence or unsupported content. Cross-check exact public-facing theme
titles against existing approved FarmTree content before publication.

## Permanent Visual Design Lock

The currently approved FarmTree frontend and current production `farmtree`
theme are the mandatory visual source of truth. FT-NATIVE-002 replaces the
architecture with a WordPress Block Theme; it does not redesign the approved
website. Header, Hero, section composition, typography, palette, spacing, card
language, media treatment, controls, CTA hierarchy, FAQ, Footer, responsive
behavior and approved motion must remain materially recognizable as the same
FarmTree design. Frank-approved content and information-architecture changes
must be implemented inside that visual language.

## Homepage Outcome

Build a shorter, clearer and more trust-oriented Homepage in `farmtree-native`,
with proof stories carrying more weight than audience or news content. Do not
patch this direction into the legacy static/SPA architecture or continue the
Homepage Hero pilot architecture.

Use concise editorial headings. Remove unnecessary full stops after large
display headlines where punctuation is not narratively required.

## Local Implementation Snapshot

- The Hero uses four editable core Image slides, not a Cover block. One
  persistent editable primary H1 and its supporting copy are rendered; three
  alternate editor-visible core-block message sources feed the same H1 when a
  visitor manually selects another state.
- The Platform module uses the approved MP4/poster and plot-definition
  screenshot. Arrow, dot and keyboard controls navigate the two media slides,
  and a visible Play/Pause control lets the visitor stop or restart the footage.
  The muted video pauses whenever its slide or document is not visible. With
  reduced motion requested, it stays on the approved poster unless the visitor
  explicitly presses Play.
- The Header uses the shared asset-backed `farmtree-native/brand-logo` pattern,
  rather than depending on configured Site Logo or Site Title blocks, and the
  Navigation block exposes the approved five-card Bento submenu.
- The current native shell is English-only. Nederlands and Deutsch are shown as
  disabled options; locale-aware routing belongs to FT-NATIVE-003.
- The quotation dialog is present for approved visual parity, but submit is
  intentionally unavailable and sends no network request. Endpoint selection,
  consent/privacy copy, spam protection, delivery verification and publication
  approval remain gated under FT-WEB-004.

## Section Priorities

Use this hierarchy as the default:

1. Hero / positioning
2. Platform / planning value
3. Technology / how FarmTree works
4. Trust / references / testimonials
5. Proof Stories / Themes
6. Supporting audience segmentation, only if it remains useful
7. FAQ
8. News & Insights
9. Final CTA

Professional UX judgement may refine the exact order when an approved existing
design creates a stronger flow, while preserving these decisions:

- move trust higher;
- make proof stories and themes stronger;
- remove Use Cases from the Homepage;
- move News & Insights lower;
- keep the Homepage shorter;
- retain the FAQ and final CTA.

## Platform / Planning Value

Remove the current emphasis on "local teams." The immediate audience is
primarily project staff. Explain how FarmTree helps project teams:

- create agroforestry investment plans;
- compare farm and project options;
- understand future scenarios.

Where appropriate, use a fast-moving excerpt from real FarmTree Platform
footage instead of a generic illustration. Any footage must be approved,
accessible and performance-appropriate.

## Technology / How FarmTree Works

Frame the core message around:

> How agroforestry projects are planned, monitored and reported

Explain that FarmTree technology connects site information such as climate,
soil and species data into a:

> science-based, multi-KPI business plan

Preserve the approved small animations and interactions unless they conflict
with accessibility or performance.

## Trust / References / Testimonials

Treat testimonials and partner quotes as part of the Trust architecture rather
than as a separate decorative section. Prepare partner and reference logos to
support links to relevant FarmTree projects, evidence or collaboration pages in
a later content sprint.

Do not invent partner documents, certificates, project evidence or link
destinations. Partner-proof linking may require Betty's input and does not block
FT-NATIVE-002.

## Proof Stories / Themes

Proof Stories / Themes replace the current Homepage Use Cases section and must
be one of the strongest parts of the page. Transcript-supported working themes
are:

- Carbon
- Farm Value Modelling
- Cocoa Scenario Planning and Monitoring
- Water and Landscape Resilience Monitoring

Treat these as working labels until they are checked against approved FarmTree
content. Use strong, relevant and approved imagery for each published theme.

## Audience Segmentation

Do not prioritise a large "How different organisations use FarmTree" section.
If supporting audience segmentation remains useful, consolidate it to:

1. Investors & Climate Finance Organisations
2. Project Developers, Programme Officers, Field Experts & Scientists
3. MRV Platforms & Data Providers

Remove Farmers & Farmer Organisations from the current Homepage audience
structure. Use distinct, relevant and approved imagery for each visible group.

## WordPress Editorial Ownership

Use the `farmtree-native` presentation layer and the canonical native content
architecture. Normal WordPress Editors must be able to manage, where
appropriate:

- headings and text;
- media and Platform footage;
- proof-story content and theme cards;
- testimonials;
- CTA content;
- FAQs;
- partner and reference content.

Keep layout, section hierarchy, typography, spacing, brand tokens and other
structural design controls locked. Reuse core blocks, locked patterns and the
`farmtree-content` models before considering custom blocks.

## Later Content Sprints

Prepare the architecture, but do not block FT-NATIVE-002 on:

- Rabobank, GIZ or other partner evidence pages;
- partner certificates or downloadable collaboration documents;
- complete audience subpages;
- final proof-story or case-study detail pages;
- locale-aware NL/DE routing and global locale ownership under FT-NATIVE-003;
- production quotation submission, consent/privacy and delivery verification
  under FT-WEB-004.

## Acceptance Direction

- The Homepage is implemented only in the native architecture.
- The page follows Frank's hierarchy and is materially shorter than the current
  concept.
- Platform and technology copy reflects the approved planning message without
  unsupported claims.
- Trust includes testimonials and is positioned above Proof Stories / Themes.
- Proof Stories / Themes are prominent and Use Cases are absent.
- Audience segmentation, when retained, contains only the three approved groups.
- FAQ and final CTA remain, while News & Insights appears lower on the page.
- Required content is editable by normal WordPress Editors and structural design
  remains locked.
- Exact theme labels, imagery, footage, testimonials and partner references are
  validated against approved source material before publication.
- Source and rendered responsive validation covers 320, 375, 390, 430, 768,
  1024, 1280, 1440 and 1920 pixels without page zoom, root transforms, viewport
  tricks or root overflow masking. Exact-width screenshots, zero document
  overflow, clean browser logs and mobile/desktop section evidence are recorded
  in `qa/native-foundation/final-rendered/` and the sprint report.
- Real WordPress editor/frontend and PHP validation plus rendered semantic,
  contrast, keyboard/focus, reduced-motion-contract and interaction checks are
  complete locally. Manual assistive-technology review and production runtime
  validation remain publication/release evidence rather than local blockers.
- A recoverable WordPress files/database backup and explicit public `noindex`
  while Coming Soon remains active gate any runtime deployment. Independent
  Required Reviewer protection remains a deferred governance enhancement under
  the private, manual-only release policy.
