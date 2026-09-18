# Editorial and image-fit audit — 2026-09-18

## Boundary and baseline

Local implementation only. Production baseline at deployed `47313843` was read
with the SQL-firewalled reconciler: 93 unchanged, zero updates/conflicts.
Keep all existing post IDs, slugs, publication states, routing, legal obligations,
Farm Valuation terminology and testimonial quotations/motion. No push/deployment.
The six-Page documentary APPLY profile must not be broadened implicitly: this
editorial release also changes featured-image relationships and article copy.
A separately reviewed production update scope is required before deployment.

## Approved library review and placement plan

All 20 supplied photographs were reviewed against their original upload numbers.
Reuse the existing metadata-stripped responsive exports, with no AI generation,
retouching, exposure changes or invented identities, locations or outcomes.

| Surface | Photo | Rationale / boundary |
| --- | --- | --- |
| Client section | Existing logos retained | Field photos do not prove client identities; improve heading/supporting copy only. |
| Carbon Proof Story and Homepage card | 19, trees and low crops | Tree-based landscape context, not a carbon measurement. |
| Farm Valuation Story/card | 08, harvested onions beneath trees | Visible produce and farm-value context, not a financial outcome. |
| Cocoa planning Story/card | 15, crops between trees | Shade/tree-crop context; explicitly not a cocoa-project photograph. |
| Hydrology Story/card | 20, crop beds and paths | Field layout context, not hydrological evidence or a model output. |
| Water/erosion/microclimate News | 20 | Physical field layout, not evidence of the software release. |
| EU carbon-farming News | 11 | Trees and ground vegetation; no certification implication. |
| EUDR data-readiness News | 15 | Mixed land-use context; no compliance/location claim. |
| VM0042 v2.2 News | 12 | Ground and trees; no invented soil-sampling activity. |
| VM0042 revision News | 02 | Field-visit context, not a Verra meeting or named staff. |
| Smallholder wood-production News | 19 | Tree/crop landscape, not evidence of wood yield. |
| Carbon-pricing News | 08 | Produce as broad farm-economics context, not a carbon-market event. |
| Species-data News | 10 | Visible plant inspection, no unsupported species identification. |
| Restoration planning News | 14 | Field/tree landscape, not a restoration outcome. |

Retain the four approved hero slides and existing contextual page figures.
Keep team portraits and the labelled team illustration: field participants are
not identified as FarmTree staff. Keep Platform demonstration, logos, maps and
other informational graphics. No supplied photograph proves a specific cocoa
site, institution, project outcome or geographic location. Reserve 03/04/05/06/
07/09/13/16/18: weaker fit, duplicates, narrower stories or identifiable children
without a task-specific reason to foreground them. No need to use every photo.

New featured selections use distinct managed documentary media keys, not binary
replacement of existing attachments. Preserve old media and ownership records;
never delete or overwrite editor uploads. Reuse a photo's media record across
articles rather than creating duplicates. Featured images remain WordPress
editor selections; replacing them with other media must opt out of the theme's
documentary format enhancement.

## Whole-site copy review

Reviewed Homepage, 16 English pages plus the News alias, all 10 customer segments,
four Proof Stories, nine News articles, ten team biographies, header/footer,
quotation dialog and template/CTA/404 text. Scope is language quality, not a new
legal, scientific or regulatory fact certification.

Priorities: plural client heading; grammatical model description and time-based
comparison; natural CTAs; remove public pre-release/editorial-placeholder copy;
replace robotic News section labels; use accurate image context. Preserve legal
pages, approved professional names/roles, figures, source dates/URLs, claim
boundaries and verbatim attributed testimonials. Do not “correct” a person's
name from an inferred spelling. Unchanged pages remain part of the audit.

## Implemented copy corrections

- Homepage: `FarmTree Client` → `FarmTree Clients`; supporting line now ends
  `working in agroforestry and climate action.`
- `Connect … assumptions into` → `Combine … assumptions to create`;
  `Move from project idea to investment plan` gains the missing articles.
- Corrected `a science-based, multi-KPI business plans` to `science-based business
  plans with multiple performance indicators`; corrected `projections time - based`
  to `projections over time`; added the article before `location`.
- Platform media caption drops the internal word `approved`; `Last News` becomes
  `News & insights`.
- Proof Stories index uses the approved `Farm Valuation` terminology. Its detail
  page's approved block content is preserved exactly, preceded only by a photo
  context paragraph. All four stories receive a context note; cocoa explicitly
  does not present the selected tree/crop photograph as cocoa photography.
- Case Studies, Acknowledgements and Platform Videos replace public-facing
  private/pre-release/editorial instructions with useful visitor-facing guidance.
  Vacancies uses a natural empty-state message without inventing any openings.
  Licenses says `current terms`, retaining the non-binding-offer qualification.
  Dormant Team/News source summaries are aligned with their existing public pages.
- Three segment bodies: `Agree the`/`Agree a` → `Agree on the`/`Agree on a`;
  `farmer realities` → `farmers’ circumstances`; `reviewable assumptions trail`
  → `clear record of assumptions`.
- Nine articles: `Answer first` → `What this means`; EUDR heading becomes
  `Keep compliance and planning evidence separate`; carbon-pricing heading becomes
  `Test key assumptions`; species-data excerpt uses `clear source information`.
  All source dates, URLs and substantive scientific/regulatory claims are retained.
- Reviewed and retained: legal documents; ten actual biographies/portraits;
  contact/mailto destination; seven unchanged segment bodies; other Proof Story
  substance; Platform/Solutions/Cocoa Focus; footer/navigation/quotation/404 copy;
  attributed testimonial quotations, their order and motion. No legal fact audit
  or new regulatory certification is claimed by this language-only review.

## Rendering and ownership

Nine unique documentary content JPEGs become new shared managed attachments;
the 34 existing managed media entries remain unchanged. The exact materializer
source allowlist is now 43 paths; the overall runtime/exclusion lists remain
217/114. No new binary derivatives were needed: existing 132 AVIF/WebP/JPEG
exports for 11 photographs remain byte-identical. No AI, retouching, colour
correction or scene alteration was performed.

The theme adds responsive picture sources to core featured images only when the
selected attachment basename and SHA256 bytes match an existing approved theme
JPEG. Other editor-selected media use normal WordPress output. Alt text and links
remain editor-controlled. Four Homepage image blocks are valid core Image markup,
with responsive presentation added at render time, not stored inside the blocks.
Existing card overlays remain; Farm Valuation gets a left-biased crop to retain
both people. The lead News card retains its design but uses balanced image/text
columns, reduced padding and a proportionate heading to avoid mid-word wrapping.

The reconciler change is only four exact retired Proof image URL/token aliases,
needed to compare old ownership fingerprints after the Homepage image replacement.
No ownership test, production gate, write method or release-mode scope is relaxed.
The four-file runtime safety seal and 43-image path seal were reviewed and renewed.

## Validation and release boundary

- `npm test`: passed, including exact runtime safety/source seal, 66 WordPress
  state-safety cases, generated manifest parity, release classification and CSS/JS.
- `wp:verify`: passed on local WordPress 7.1.1 / PHP 8.2; all content remains public
  in the intentionally noindexed local preview. Production indexing was not changed.
- `wp:verify:anonymous`: 40 English routes HTTP 200, 104 checked internal links,
  zero broken links/unintended 404s; NL/DE and deliberate missing URL remain 404.
  Six hub routes render 28 responsive documentary pictures.
- Gutenberg parse: all 16 saved documentary Image blocks valid. Featured-image
  blocks remain core dynamic blocks.
- Disposable migration from deployed 47313843: 9 creates, 23 updates, 70 unchanged,
  0 conflicts, 1 skipped; APPLY then 102 unchanged, 0 creates/updates/conflicts.
  All 40 content identities and all 34 prior media IDs preserved; manual edit
  rejection tested. Persisted front-page, indexing, Coming Soon, Bot, permalinks,
  theme and active-plugin options remain byte-identical. Editor-selected media,
  alt and links are respected; unrelated media bypasses documentary enhancement.
  This is a local fixture, not a production candidate dry-run.
- Existing public six-page release regression still passes its original 6-update
  contract. The new broader manifest is deliberately rejected by that profile.
- Exact save/emoji/postcondition test passes on PHP 8.3; side-effect fixture passes
  on PHP 8.1: zero FarmTree SQL/filesystem/rewrite writes outside APPLY, with write
  firewall and lifecycle/rewrite/rollback checks intact.
- Testimonial regression: no failures at 320/390/768/1024/1440/1920.
- Browser evidence: `qa/screenshots/editorial-audit/`; local preview
  `http://localhost:8888/`. Final `wp:verify:editorial:browser` passed 171 views
  across 19 routes and 320/375/390/430/768/1024/1280/1440/1920 widths, with zero
  console errors, horizontal overflow or card text overflow. Mobile and desktop
  screenshots reviewed for crop/readability and lead News image/text balance.
- Immutable artifact build/audit is run after the focused local commit, since the
  release builder correctly refuses dirty sources. No bypass of that guard.

No push, deployment, production content write, publication change, indexing change,
Coming Soon change, theme/plugin switch or rollback occurred. Production was read
only for the baseline reconciliation. Ready for local review and push approval;
**not directly deployable through the existing six-page APPLY profile**. A broader,
separately audited public-state-preserving release plan and real production dry-run
are required before any approved deployment/APPLY. Rollback remains the existing
off-webroot production backups/runtime directories; no restoration was needed.

## Exact files added/changed

```text
CURRENT_SPRINT.md
SPRINT_HISTORY.md
SPRINT_REPORT.md
TASKS.md
config/farmtree-native-release-files.json
docs/FT-EDITORIAL-IMAGE-AUDIT.md
package.json
scripts/bootstrap-local-wordpress.mjs
scripts/build-native-release.mjs
scripts/editorial-photographs.mjs
scripts/fixtures/editorial-migration.php
scripts/fixtures/post-launch-images.php
scripts/generate-managed-content-manifest.mjs
scripts/preview-native-homepage.mjs
scripts/validate-documentary-runtime.mjs
scripts/validate-editorial-browser.cjs
scripts/validate-farmtree-content-safety.mjs
scripts/validate-farmtree-postconditions.mjs
scripts/validate-farmtree-runtime-side-effects.mjs
scripts/validate-native-foundation.mjs
scripts/validate-post-launch-images.mjs
scripts/validate-visual-baseline.mjs
wordpress/wp-content/plugins/farmtree-content/data/customer-segments.json
wordpress/wp-content/plugins/farmtree-content/data/editorial-drafts.json
wordpress/wp-content/plugins/farmtree-content/data/english-pages.json
wordpress/wp-content/plugins/farmtree-content/includes/class-farmtree-content-reconciler.php
wordpress/wp-content/plugins/farmtree-content/includes/managed-content-manifest.php
wordpress/wp-content/themes/farmtree-native/functions.php
wordpress/wp-content/themes/farmtree-native/patterns/homepage-foundation.php
wordpress/wp-content/themes/farmtree-native/style.css
```

Ignored local QA screenshots/reports are not deployable files or part of the commit.
