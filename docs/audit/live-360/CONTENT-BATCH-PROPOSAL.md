# Proposed bounded content correction batch

Status: DESIGN ONLY. No source/content/reconciler modification or production
authorization is implied by this document. First release remains theme-only.

## Exact intended scope

Fourteen already-published, FarmTree-owned entities; `post_content` only:

- `page.en.platform`
- `page.en.case_studies`
- `page.en.solutions`
- `page.en.user_videos`
- `page.en.cocoa_focus`
- `post.en.farmtree_water_erosion_microclimate_model_update_2026`
- `post.en.eu_carbon_farming_methodologies_agroforestry_2026`
- `post.en.eudr_2026_agroforestry_data_readiness`
- `post.en.verra_vm0042_v22_agricultural_land_management`
- `post.en.verra_vm0042_v30_consultation_lessons`
- `post.en.smallholder_agroforestry_wood_production_lessons_2025`
- `post.en.carbon_pricing_2026_nature_project_quality`
- `post.en.agroforestry_species_data_switchboard_2025`
- `post.en.nature_restoration_plans_report_once_agroforestry_2025`

Expected candidate migration:14 updates,0 creates,0 conflicts, all other managed
entities unchanged. This is an expectation, not a claimed real production plan.
No media, excerpt, title, date, status, slug, category, ordering or featured-image
changes. No Homepage, Team, Customer Segment, Proof Story, legal or navigation
content changes. Keep all existing documentary image blocks byte-identical.

## Source-backed page edits

Use normal core paragraph/heading/list/button blocks and existing spacing/design.
Do not introduce new runtime widgets, styling, embeds or external browser fetches.

### Platform

Source: approved current Homepage content in
`wordpress/wp-content/themes/farmtree-native/patterns/homepage-foundation.php`,
also verified in baseline production crawl `/`.

Retain current lead and documentary field-layout figure. Insert the already
approved workflow as an ordered list under `How FarmTree works`:

1. **Site information** — Define the location, inventory and management baseline.
2. **Climate, soil and terrain** — Connect local conditions, opportunities and risks.
3. **Species database** — Add growth, yield, interaction and price data.
4. **Plan, monitor and report** — Compare business and impact projections over time.

Replace only the generic next-step paragraph's self-link with:
`Explore Platform tutorials, review Proof Stories, or contact FarmTree with a
specific planning question.` Destinations `/user-videos/`, `/proof-stories/`,
`/contact/`. This reuses existing capabilities, not a new product promise.

### User Videos

Sources: rollback-reference `farmtree/template-parts/main-home.php` already uses
`https://www.farmtree.earth/user-videos` for21 tutorial cards; that destination
was independently opened2026-09-19 and contains Platform, Multiplot, comparison,
scenarios and other tutorials. Existing source ownership does not imply approval
to copy the entire external page or embed its players.

Retain current lead and contact guidance. Add a paragraph/link:
`Watch FarmTree Platform tutorials on farmtree.earth. The video library covers
Platform navigation, scenario comparison and modelling workflows.`
Link the first sentence to the existing external destination with
`rel="noopener noreferrer"` if opened in a new tab. Use no iframe, remote
thumbnail, tracking or automatically loaded third-party resource. Keep the
existing approved mailto-only contact experience.

### Case Studies

Sources: `data/proof-stories.json` and current published four Proof Stories.
Retain the honest existing lead: project-specific case material is discussed
with the team. Add `Explore the planning themes` followed by links to the four
existing Proof Story routes using their approved titles/excerpts. Preserve
`Farm Valuation` and its unchanged `/proof-stories/farm-value-projection/` URL.
Do not call generic themes measured case studies, invent clients/results, or
suggest documentary photos depict those projects.

### Cocoa Focus

Source: current `/proof-stories/cocoa-scenario-planning/`, already-approved
generator/data. Retain lead. Add `Explore cocoa scenario planning` linking to
that story and reuse its existing bounded workflow:
`Capture the baseline, co-design a focused set of systems, review short- and
long-term trade-offs, select indicators and update scenarios as field information
improves.` Preserve the existing statement that local evidence/field review are
essential. Do not relabel existing images as cocoa photography.

### Solutions

Source: existing five service areas already stated in the Page lead, plus
approved Homepage workflow and audience collection. Keep the lead/images.
Replace only generic next-step paragraph with useful direct destinations:
`Explore the Platform for scenario planning, find your organisation's planning
needs in Customer Segments, or review Proof Stories before contacting FarmTree
to discuss scope.` Link Platform, Customer Segments, Proof Stories and Contact
to their unchanged internal routes. No pricing/packages, service guarantees or
new integrations are introduced. Additional body expansion is not necessary
merely to achieve a word count.

## Nine citation corrections

Root cause: `editorialContent()` currently interpolates `sourceDate` into
`published DATE`, while `addEntity()` also uses the same value as WP `post_date`.
These are different concepts. Preserve every existing `sourceDate` value and
generated post_date. Add a separate factual citation-note property, escaping it
as plain text, or equivalent explicitly scoped map. Do not reuse publication
date to manufacture source provenance. Keep all source URLs/titles and analysis.

After the existing linked source title, use exactly:

| Article | Proposed suffix | Primary evidence |
|---|---|---|
| Water/erosion/microclimate | `; release notes dated 10 July 2026.` | FarmTree release blog explicitly names this release date |
| EU carbon farming | `; European Commission guidance on certification methodologies.` | Linked living page supports July2026 adoption, not exact publication1July |
| EUDR | `; European Commission overview of the regulation and its application dates.` | Linked living overview has application dates; no verified4May publicationdate |
| VM0042v2.2 | `; methodology active since 21 October 2025.` | Verra active-since record |
| VM0042v3.0 | `; public consultation ran from 11 February to 31 March 2026.` | Verra consultation period; March31 is not demonstrated publicationdate |
| Smallholder wood | `; FAO news item dated 3 November 2025.` | Explicit date on linkedFAO newsitem |
| Carbon pricing | `; World Bank report released on 19 May 2026.` | Official linked pressrelease says report releasedthatday; not May21 |
| Species Switchboard | `; CIFOR-ICRAF information about the Agroforestry Species Switchboard.` | Linked aboutpage has no verifiedJuly2publication; relatedpaper is a differentdocument datedJuly5 |
| Nature restoration | `; European Commission news announcement dated 20 May 2025.` | Explicit linked announcementdate |

Preserve the following attribution sentence. Do not change article publication
dates, routes or conclusions. Re-open primary sources when implementing in case
they have changed; never infer an exact day from a month or a source event.

Evidence links:

- https://www.farmtree.earth/release-blog
- https://climate.ec.europa.eu/areas-action/carbon-removals-and-carbon-farming/certification-methodologies_en
- https://environment.ec.europa.eu/topics/forests/deforestation/regulation-deforestation-free-products_en
- https://verra.org/methodologies/vm0042-improved-agricultural-land-management-v2-2/
- https://verra.org/methodologies/revision-to-vm0042-methodology-for-improved-agricultural-land-management/
- FAO: exact `sourceUrl` in `data/editorial-drafts.json`, dated03/11/2025
- https://www.worldbank.org/en/news/press-release/2026/05/19/direct-carbon-pricing-covers-nearly-one-third-of-global-emissions
- https://switchboard.cifor-icraf.org/index.php/about
- https://www.nature.com/articles/s41597-025-05492-w (publication5July2025; not substituted for the current linked aboutpage)
- https://environment.ec.europa.eu/news/commission-adopts-user-friendly-planning-tool-support-member-states-implementing-nature-restoration-2025-05-20_en

## New isolated release scope

Proposed flag: `--post-launch-content-quality`, mutually exclusive with every
existing post-launch scope. Preserve the historical image/editorial modes and
their exact pins unchanged. Do not reuse them as general write authorization.

Pin independently:

1. Entire candidate manifest canonical SHA256.
2. The fourteen exact stable managed keys, post types, existing IDs resolved by
   ownership, baseline source SHA256, candidate source SHA256 and sole allowed
   changed-field list `['post_content']`.
3. No creates/adoptions/deletes/media/terms/options/rewrite operations; unrelated
   entities must be unchanged. Permit only documented nonmutating skipped
   front-page and reserved-locale checks.
4. Candidate runtime and runner commit identity, expected site/theme, verified
   fresh backup-evidence SHA256 and explicit scope-specific write confirmation.

Existing portable baseline source hashes are listed in
`assessments/search-content.md`. They were checked against the current
repository manifest (byte-identical to48373210). Historical production IDs and
savedHTML hashes are NOT fresh evidence. Before pinning migration acceptance,
obtain a new real production SQL-firewalled dry-run/current ownership snapshot.
Require exactly one expected managed key per object, no ambiguous slug/key match,
no duplicate ownership and current canonical state equal to last-applied hash.
Any genuine unrelated manual drift is a conflict, not an adoption opportunity.

## Digest, public-state and rollback boundaries

Reviewed digest must bind candidate manifest, operations, changed fields,
selected scope, target IDs, source/current/applied/desired hashes, source commit
and current critical public-state hashes. At APPLY re-plan under the existing
lock and transaction, and reject a different digest. Never permit force/bypass.

Preserve exactly: active Native/Content, Homepage439 published and front-page
routing, all English publication states, blog_public1, Coming SoonOFF,
FTBotOFF, NL/DE unpublished, permalinks/rewrite rules, URLs, SEO/indexing and
unrelated content. Do not flush rewrites or activate/deactivate runtime merely
to update Page bodies.

Fresh readable nonzero off-webroot DB and affected-runtime backups with checksums
are mandatory. Use the established scoped staged-plugin runner without changing
active_plugins. Dry-run must be proven write-free; APPLY permits only the exact
content writes plus existing strictly necessary managed ownership/version/hash
bookkeeping for those same fourteen entities. Preserve IDs, no delete/recreate.
After transaction, re-plan must show0updates/0conflicts and unchanged public
state. On failure use existing rollback and report unavoidable auto-increment,
cache/hook residuals honestly; never restore an entire DB over unrelatednewdata
without checking concurrency and the documented recovery scope.

## Required regression tests

- Candidate generator deterministic; all unchanged fields/sourceentities stable.
- Fourteen expected bodies differ and onlythose; images markup unchanged.
- Nine article dates/title/slug/excerpt/featured media unchanged; exact citation
  notes match evidence; generic `published ${sourceDate}` no longer emitted.
- Source/manifest/commit/digest tampering rejected; wrongscope rejected; scope
  flags mutually exclusive; create/adoption/delete/media/options rejected.
- Foreign/missing/duplicate ownership, sourcehash drift and manualcurrent-state
  drift rejected. No relaxation of existing ownership guards.
- Changes to post_status/password/post_date/post_name/title/excerpt rejected.
- First disposable migration14updates/0conflicts; repeat0updates/0conflicts.
- Hook-induced protectedoption/content mutation triggers failure/rollback;
  unchanged unrelatedpost/media/term/option snapshots remain identical.
- Public-state baseline unchanged, including noindex absent publicly; local
  loopback noindex remains required.
- Valid Gutenberg markup/editor roundtrip, npmtest/wpverify/anonymous/artifact
  buildaudit; live dry-run/verifiedbackup/revieweddigest before actualwrites.
- Production14affectedroutes HTTP200, zero brokenlinks/assets/consoleerrors,
  content matches exact candidate, existing images/crops/alt/LCP unchanged,
  mobile/desktop spacing/reflow unaffected and no new external-resource loading.
- Confirm Farm Valuation, FarmTree Clients, testimonials/navigation/footer and
  legal pages untouched.

## Deliberately outside this batch

No track-record number changes, invented metric definitions/as-ofdates,
testimonial rewriting, permissions assumptions, new case outcomes or company
credentials. Those need actual company evidence. No redesign, public formbackend,
analytics, newsletter, new integrations or API promises. Segment redundancy is
not included. Blog canonical consolidation belongs to the separate theme-only
release, not these fourteen bodies. A substantive named case study or different
News editorial purpose would require a genuine business decision; these bounded
link/citation corrections do not.
