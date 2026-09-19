# Live 360 independent search and content assessment

Date: 2026-09-19. Read-only production assessment; no runtime/source remediation performed by this reviewer. Ten perspectives below were considered separately before consolidation. Evidence: `qa/live-360/search/crawl.json`, `links.json`; reproducible read-only scripts alongside them. HTML was fetched sequentially and parsed with an inert DOMParser: this verifies server-rendered content, NOT browser console, layout, accessibility or actual indexing in search engines.

## Verified baseline

- 55 route variants fetched: 40 manifest-derived routes, nine canonical short News URLs discovered from sitemap, six category archives. All final responses HTTP 200. Nine dated News URLs redirect to canonical short URLs.
- Sitemap index contains five child sitemaps, with 46 URLs: 9 posts, 17 pages, 10 Customer Segments, 4 Proof Stories, 6 categories. No reserved locale appears.
- Every route has exactly one H1, a title and syntactically parseable JSON-LD. All images have an alt attribute (empty alt still requires contextual decorative-image assessment).
- All 55 are crawl-permitted by observed robots directives: `max-image-preview:large`, no noindex header observed. This is indexability evidence, not proof Google has indexed them.
- robots.txt permits public pages and advertises the correct sitemap. HTTP and www redirect 301 to HTTPS/non-www. Missing trailing slash redirects 301.
- `/nl/`, `/de/` and the deliberately nonexistent test route return 404. Both documented legacy Proof Story paths redirect to their intended live destinations.
- 44 unique same-origin anchor destinations were HEAD-checked, plus three canonicalization probes: zero errors/HTTP >=400. This does not check all assets or external destination availability.
- Farm Valuation remains the visible approved label at its unchanged farm-value-projection slug; FarmTree Clients remains on Homepage.

## Independent perspectives

### Technical SEO specialist

SC-01 (P2): six public, sitemap-listed `/category/*/` archives have no canonical, description or Open Graph metadata. Source: `farmtree_native_meta_description()` only handles singular/front page; `farmtree_native_render_social_metadata()` explicitly returns for archives (`functions.php` around390/527). Fix contextual archive metadata without changing indexability; test paginated canonical behavior and reject empty/fabricated descriptions.

SC-02 (P2): all 55 crawled responses lack `og:image`, including posts with featured images. Add approved existing featured image/fallback metadata with valid dimensions/alt where known, no extra preload or tracking. This is social-preview completeness, not a demonstrated ranking penalty.

SC-03 (P2): `/blog/` and `/news-insights/` both self-canonical, sitemap-listed and show the same nine-article feed; blog adds a documentary photograph. Consolidate canonical intent without deleting routes or content, using existing primary-navigation destination `/blog/` as evidence. Verify sitemap/canonical consistency. User/owner confirmation needed if a different canonical identity is desired.

SC-04 (P3): Homepage title is only `Farmtree`; suffix across all titles is `Farmtree`, inconsistent with approved `FarmTree`. Correct title output in source without changing site identity options blindly. A concise descriptive Homepage title can reuse the approved agroforestry positioning. Do not enforce arbitrary title-character thresholds.

### GEO specialist

SC-05 (P2): one stable Organization `@id` is assigned each page's description, e.g. on Contact it describes discussing a question; on category archives it is empty. Use a stable verified company description; preserve page-specific description on WebPage. `functions.php` around424 assigns `$description` to Organization directly. The site does define its modelling purpose in server HTML; no llms.txt or AI-ranking claims are needed.

### AEO specialist

Homepage's eight-question FAQ has direct, bounded answers and JSON-LD consistent in meaning (some answers are abbreviated). Segment FAQs clearly answer practical questions without implying certification or financial advice. Four Proof Stories explicitly separate projections and measured outcomes. SC-06 (P2): Platform landing page provides only a brief definition and generic next-step block, less explanatory detail than Homepage's four-stage workflow. Improve with existing approved workflow/input/output facts, not fabricated capabilities; keep claims bounded. No requirement to create FAQ markup on every page.

### AI/machine-readability specialist

SC-07 (P2): nine BlogPosting entities omit publication date, modification date, headline/image and attribution despite visible dates and featured images. Add actual WP dates, visible headline/image; only add author when visible/approved, never expose administrator identities. Current markup is syntactically valid but incomplete for robust attribution. Breadcrumbs are Home → current page only; relevant collection hierarchy can be added from actual route relationships, not invented taxonomy. Server-rendered article text is useful without JavaScript. No claim of guaranteed AI citation.

### Information architect

All ten Customer Segment routes and four Proof Stories are discoverable; Investors remains distinct from removed For Investors navigation. SC-08 (P2): User Videos title/nav promises videos but its entire body asks visitors to contact the team; Case Studies title promises case material but only refers to Proof Stories. These are evidenced information-scent gaps, not broken links. Find approved video/project assets in existing FarmTree sources; do not invent clients, project results or replace stakeholder terms. Solutions/Cocoa Focus/Acknowledgements/Licenses are similarly brief, but concision alone is not an SEO defect. Blog duplicate is SC-03.

### Senior English copywriter

Every unique crawled main body was reviewed (40 core variants include nine article redirects; the same nine short-route article bodies and six category excerpts were also inspected). No clear spelling/grammar defect warranting an immediate semantic change was established. Sentence fragments in headings/cards are intentional. SC-09 (P3): ten segment pages repeat the exact opening excerpt under `Who this is for`; this is redundant and often describes a task rather than the audience. Improve only using the already stated audience; preserve meaning and approved labels. Carbon planning/cocoa titles use sentence case while Landscape Hydrology/Farm Valuation use approved capitalization; do not normalize these indiscriminately. DOMParser text collapses boundaries between paragraphs/list items, so merged text in evidence is not proof of missing visual spaces.

### Scientific communications editor

News consistently separates external factual context, interpretation and FarmTree capability; all nine link a primary source. Proof Stories expressly disclaim guaranteed/verified outcomes and documentary photos are identified as contextual. No scientific outcome claim should be expanded.

SC-10 (P2, source-evidence review): all News source citations say `published YYYY-MM-DD`; several dates reflect version/consultation/event dates, not demonstrably the publication date of the linked living webpage. Verra's revision source explicitly describes 31 March2026 as consultation end. Use accurate source-event terminology or distinguish article publication date from source event, with evidence before changes. FarmTree release note July10,2026 directly supports its article. EU source supports July2026 carbon farming scope, EUDR source supports 30Dec2026 large/medium timing, Verra source supports v2.2 active since21Oct2025, World Bank supports wider coverage/differentiated credit pricing. The external sources were opened live; this is a targeted consistency check, not legal advice or a comprehensive verification of every scientific claim.

SC-11 (P2, organisational evidence needed): Homepage +100 users/+30 projects/+40 regions/+1,000,000 farmers has no visible as-of date, definition or methodology; testimonial includes a broad first-and-only claim. Preserve approved wording pending provenance, consent/approval and owner evidence. Do not manufacture substantiation or silently rewrite a quotation. This blocks full evidence-backed brand/science marks, not the technical ability to serve pages.

### CMO / brand strategist

Positioning connects planning, reporting and investment; investor and NGO narratives are differentiated without promising outcomes. FarmTree Clients and Farm Valuation preserved. Weaknesses: thin Platform/Case Studies explanations (SC-06/08) and unqualified track-record provenance (SC-11). A claim that institutional users trust the site cannot be established by technical inspection; stakeholder/user research remains organisational evidence. No justified redesign identified by this read-only content review.

### Conversion optimisation specialist

Mailto-only contact is clearly disclosed at Contact; commercial CTAs offer demo/quotation paths without fake form submission. No conversion analytics or user study evidence provided, so conversion rate/5-second comprehension cannot be scored PASS. SC-08 creates a real mismatch for users expecting videos; route users to approved material or make availability explicit with owner-backed content. Do not add a form backend or analytics under the guise of optimisation.

### Technical project manager

Prioritise safe metadata batch SC-01/02/04/05/07, followed by duplicate canonical SC-03 after checking route intent; every fix needs source tests and live re-crawl. Content changes SC-06/08/09/10 must use ownership-safe reconciliation, not blind production writes. SC-11 requires company evidence. Preserve existing audit counts and do not turn unknowns into PASS. This report establishes no P0/P1 in its limited observed search/content checks; it does not certify absence of risks across other disciplines.

## Page-level editorial coverage

| Routes | Review outcome |
|---|---|
| Homepage | Clear purpose/FAQ/workflow; provenance caveat SC-11; title SC-04 |
| Platform | Accurate bounded definition; insufficient detail for primary product destination SC-06 |
| Proof Stories collection + Carbon/Farm Valuation/Cocoa/Hydrology | Four differentiated planning questions, bounded claims, useful workflows; no unsupported outcomes added |
| Customer Segments collection + all10 detail pages | Audience-specific challenges/FAQs; repeated excerpt SC-09; investor advice boundary clear |
| Case Studies | No actual case study content; SC-08 |
| Team | Roles and biographies readable; identity/employment facts require company confirmation, not inferred verification |
| Vacancies | Explicit no-open-vacancies state and working next steps; hiring state owner-managed |
| Contact | Mailto-only and public address clear; no invented form promise |
| Blog + News & Insights | Nine coherent dated stories; duplicate identity SC-03 |
| Acknowledgements / Licenses | Bounded but brief; no fabricated partners or binding offers |
| Privacy / Terms | Reviewed for editorial consistency only; no legal sufficiency or retention certification; runtime privacy audit owned separately |
| Solutions / Cocoa Focus | Accurate brief descriptions; scope explicitly agreed case-by-case |
| User Videos | No videos or video links in main body; SC-08 |
| Water/erosion/microclimate News | Source release matches main changes; cautious version-control advice |
| EU carbon-farming News | Main scope supported; source publication date precision SC-10 |
| EUDR News | Dates supported in official source; careful planning-versus-compliance distinction |
| VM0042v2.2 News | Active status supported; independent validation clearly separated |
| VM0042v3.0 News | Consultation versus approved method correctly distinguished; source-date label SC-10 |
| Smallholder wood News | Seven questions in lead; no guaranteed outcome; report-level underlying claims not independently exhaustively validated |
| Carbon pricing News | Broad coverage/quality price differential supported; no forecast guarantee |
| Species-data News | Provenance/calibration cautions clear; source publication date needs exact citation check |
| Restoration plans News | Governance/data-reuse advice bounded; no claim software assures restoration |
| Six category archives | Excerpts clear and single H1; metadata gap SC-01 |

## Primary reference checks

- Google titles: https://developers.google.com/search/docs/appearance/title-link
- Supported metadata: https://developers.google.com/search/docs/crawling-indexing/special-tags
- Vocabulary: https://schema.org/Organization and https://schema.org/Article
- FarmTree release source: https://www.farmtree.earth/release-blog
- EU carbon-farming: https://climate.ec.europa.eu/areas-action/carbon-removals-and-carbon-farming/certification-methodologies_en
- EUDR: https://environment.ec.europa.eu/topics/forests/deforestation/regulation-deforestation-free-products_en
- Verra v2.2: https://verra.org/methodologies/vm0042-improved-agricultural-land-management-v2-2/
- Verra revision: https://verra.org/methodologies/revision-to-vm0042-methodology-for-improved-agricultural-land-management/
- World Bank: https://www.worldbank.org/en/publication/state-and-trends-of-carbon-pricing
- Species database: https://switchboard.cifor-icraf.org/index.php/about

No numeric score awarded. Full SEO, content/brand and GEO/AEO marks are not supported until documented gaps are closed and unknown organisational evidence is resolved. Browser console/overflow/responsive checks are explicitly delegated to the independent frontend assessment, not inferred from fetched HTML.

## Scoped local remediation (not yet production-verified)

`functions.php` now supplies category metadata, local featured-image/approved-logo social imagery, stable Organization description, exact FarmTree brand casing and supported BlogPosting headline/publication-date/image fields. No author or editorial modification date is invented. Core remains the sole singular canonical owner (the local test exposed pre-existing duplicate identical core/theme canonicals); category pagination retains its own page URL. SEO-plugin ownership guard now also covers social output. Routes, visible content, managed data and publication/indexing state are unchanged. SC-03 canonical consolidation, SC-06/08/09 content, SC-10 source-date semantics and SC-11 substantiation remain unresolved.

Local `node scripts/validate-discovery-metadata.cjs` passes17 responses (Homepage, Platform, all6 categories and9 News), checking one canonical, description/image ownership, local imagery, Org consistency, article date matching rendered time, no inferred author/modified date and no PHP errors. `npm run validate:native`, `npm run validate:wordpress-state-safety`, node syntax and diff whitespace checks pass. This local result does not close the production findings until deployed and recrawled.

## Bounded next-content proposal — design only

### SC-03 canonical intent evidence

Both shared header and footer explicitly use `/blog/`. Across55 responses,121 anchor occurrences point to `/blog/`, zero to `/news-insights/`. `englishPageBaseContent()` returns the same `newsHubContent()` for `page.body === 'news'` and `slug === 'blog'`; `/news-insights/` is an extra generator record rather than a differentiated content brief. `FT-NATIVE-ARCHITECTURE.md` names `/blog/{slug}/` as the historical article route convention (current actual post routes differ, so do not use that old convention to change post URLs).

Proposal: retain both HTTP200 routes and content, make `/news-insights/` canonical/og:url identify `/blog/`, use the same identity in WebPage schema, omit only the duplicate478 from the sitemap through a narrow filter after resolving published Page identities. Do not redirect/delete/unpublish either Page. This is a well-evidenced engineering choice rather than an arbitrary brand decision. A different editorial purpose for News & Insights would require a human choice, but none is present in sources inspected. No change implemented in this proposal.

### Existing approved material for thin destinations

- User Videos: rollback-reference `farmtree/template-parts/main-home.php` already points21 tutorial cards to `https://www.farmtree.earth/user-videos`. The live destination was independently read on2026-09-19 and contains Platform, Multiplot, comparison, scenarios, survey, polygons, accounts, team, soil, uncertainty and other tutorials. Minimal body addition: `Watch FarmTree Platform tutorials on farmtree.earth. The video library covers Platform navigation, scenario comparison and modelling workflows.` Link only; no iframe, thumbnails fetched externally or automatic third-party requests. Retain existing contact paragraph. This reuses an approved destination and resolves the missingvideo journey without inventing videos.
- Platform: reuse Homepage's four approved headings and substantive text: Site information; Climate, soil and terrain; Species database; Plan, monitor and report. Add short ordered workflow using the same text, retain the existing projection/field-review caveat and documentary photo. Replace generic self-link to Platform with link to User Videos and existing Proof Stories/Contact. No new performance/scientific capability claims needed.
- Case Studies: retain the existing honest statement that available material is discussed with the team; add direct links to four approved Proof Stories with their existing excerpts. Label them `Explore the planning themes` rather than claim actual named measured case studies. A genuine named project/outcome case study still needs company-approved evidence/permission; that cannot be fabricated from generic themes.
- Cocoa Focus: add a direct internal link to the existing cocoa Proof Story and reuse its bounded planning question/workflow, rather than generic destination paragraph only. No cocoa identity assigned to documentary photographs.
- Solutions: reuse existing approved five service areas and link to the relevant Platform/Customer Segments/Proof Stories; remove none. Whether to expand into priced service packages needs business authority, not required for minimal link usefulness.
- Ten segment excerpts: optional clarity-only replacement of `Who this is for` repeated task sentence with already named audience (e.g. `Investors reviewing agroforestry opportunities.`). Lower priority and adds ten DB changes; exclude from the first minimal batch unless the quality programme explicitly chooses this polish.

### All nine News source-date checks

The current generator uses `article.sourceDate` twice: actual WP `post_date` and the blanket words `published DATE` in the Primary source paragraph. Do NOT change `sourceDate` to fix citation dates; that would change article dates and local dated-route expectations. Add an explicit per-article citation note (or remove unsupported source-date precision) while preserving post_date, sourceUrl, title and all article analysis.

| Article | Primary-source date evidence | Exact proposed citation suffix after linked title |
|---|---|---|
| FarmTree model update | FarmTree release blog explicitly `Released on July10,2026` | `; release notes dated 10 July 2026.` |
| EU carbon farming | EC living methodology page says adopted in July2026, not a page publication day of July1 | `; European Commission guidance on certification methodologies.` |
| EUDR | EC linked living overview has application dates, not publication date May4; a separate May4 review exists but is not the linked source | `; European Commission overview of the regulation and its application dates.` |
| VM0042v2.2 | Verra explicitly active since21October2025 | `; methodology active since 21 October 2025.` |
| VM0042v3.0 consultation | Verra says consultation11February–31March2026, not publicationMarch31 | `; public consultation ran from 11 February to 31 March 2026.` |
| Smallholder wood | Linked FAO news page explicitly03/11/2025 | `; FAO news item dated 3 November 2025.` |
| Carbon pricing | Current WorldBank report landingpage links official pressrelease with first-appeared-in2026-05-19 and text report released thatday; May21unsupported | `; World Bank report released on 19 May 2026.` |
| Species Switchboard | Linked aboutpage itself has no verifiedJuly2publicationdate; linkedScientific Data paper shows05July2025 (differentdocument) | `; CIFOR-ICRAF information about the Agroforestry Species Switchboard.` |
| Nature restoration | Linked EC newsannouncement explicitly20May2025 | `; European Commission news announcement dated 20 May 2025.` |

Keep the existing final attribution sentence. These neutral/date-specific corrections need no invented scientific facts or legal advice. Additional primary evidence: `https://www.worldbank.org/en/news/press-release/2026/05/19/direct-carbon-pricing-covers-nearly-one-third-of-global-emissions`, `https://www.nature.com/articles/s41597-025-05492-w`, the exactFAO/ECsourceURLs already held in editorial-drafts.json. Publication-versus-release semantics were independently checked; actual historical FarmTree editorial publication dates remain preserved, not independently proven by this source audit.

### Exact source identities and reconciliation constraints

Current repository manifest is byte-identical to release48373210 (`git diff48373210 -- managed-content-manifest.php` empty). The following source hashes come from its post-release production plan `qa/image-release/editorial-after-apply-plan.json`; they therefore remain the current repository desired-source fingerprints. Production IDs/current saved-content hashes are HISTORICAL evidence and MUST be freshly re-read before mutation. Do not treat them as fresh runtime authorization.

| Managed key (prefix page.en.) | Historical production ID | Current source SHA256 |
|---|---:|---|
| platform |463|7b25ee8d7a3605a80e1b51af41bb43959469b9888d719d7f9038d436ae73f79a|
| case_studies |466|85846bb6d0e2d1078c5176bf6f7a461b9e9bed94baddf1374641db6cf3b75307|
| blog |470|b0577622b62122407f9304d2d9a99ee1bc891ffb0edd2f50078c4bf47ad55055|
| solutions |475|704b0c8b9ab9aa8a6deacc0d73e9ed0aab1ff2bd04267d9b37f4987d90ed72ef|
| user_videos |476|517daeab1c917fc40db1b399adbb0a8fa4ac699e604f54da97c9e10b38426734|
| cocoa_focus |477|058e3b87eb16aeaadaeb13ac13235c0b5fc274194f67b2f3406609d3653e3551|
| news_insights |478|153c2ef9d102748efc0e0ce1f5357090bea088476ec146188eb79908133f4b37|

| Managed key (prefix post.en.) | Historical ID | Current source SHA256 |
|---|---:|---|
| farmtree_water_erosion_microclimate_model_update_2026 |450|947188d4f2a8ca29fed2f3c8f4809301d1b34d0ba465a3158e6d7f64291033a9|
| eu_carbon_farming_methodologies_agroforestry_2026 |451|94ec60636a321a5448d31adcf613c205d74dd65c51ac731e9720bc9de9015e81|
| eudr_2026_agroforestry_data_readiness |452|152559faac0e664f5291a7405ac12ec5d029b26cd743fb1b403358490adcc78d|
| verra_vm0042_v22_agricultural_land_management |453|73f5587c44d3b4b21439ec356e6915e33df9d306f87a74f7925596eca61251f4|
| verra_vm0042_v30_consultation_lessons |454|dac53abf20038682f1a82a019da5f96c5ed28c0506abcf8243c893a2790a273d|
| smallholder_agroforestry_wood_production_lessons_2025 |455|65f127df1c23abeba51cd3102cdf4add2a19cfc76a6479921672a933af023fdb|
| carbon_pricing_2026_nature_project_quality |456|aec1f96a2c5fe681dbe4db3a86be0fa5da853228c8c051ab3adde7b6ca1cba41|
| agroforestry_species_data_switchboard_2025 |457|93e9cbb0ac8447fb65ea43c2957776a1db19cee4963519ffffc82ab6b7e77875|
| nature_restoration_plans_report_once_agroforestry_2025 |458|ff79af6ecb191a50fa4a8967f0257cd81ff50603a8783851734b82baca9b61e5|

Minimal combined proposal is14 bodies: five informationalPages plus nineNews, all post_content-only, no creates/media/options/rewrite/frontpage/status/title/slug/excerpt/date changes. Blog/news canonical improvement is theme-only and must not enter the content plan. Existing `--post-launch-images` allows only six specificPage bodies; existing `--post-launch-editorial` pins a prior wholemanifest and exact prior23fingerprints/fieldchanges. Neither authorizes this14-body scope. Add a NEW distinct exactmanifest+baselinefingerprint+post_content-only release mode; do not broaden existing modes. Require current/applied hashes equal, unique ownership and published status, freshDB/runtime backups, SQL-firewalled dryrun, reviewed digest, transaction/publicstate invariants and idempotence. Tests must reject any title/date/status/slug/option/media/manual-drift deviation. Fresh production read-only plan needed before setting final expected totals.

Genuine human evidence remains: track-record provenance/date/definition, testimonial permissions/substantiation and any named case study/outcome. No routine human choice is needed to link an existing approved tutorial destination, reuse approved workflow text or correct objectively misleading source-date labels. This section is a proposal only; no content/reconciler edits performed.

### SC-03 implementation follow-up — local/disposable validated

The theme-only canonical proposal has now been implemented, still without content/DB/route changes: only when both slug-resolved Pages are public, unprotected and carry their exact single expected managed key does the duplicate identify Blog in core canonical, WebPage/Breadcrumb and Open Graph URLs. Only its Page ID is appended to WordPress page-sitemap exclusions; other exclusions and post types remain intact. Missing/unowned/private identities fail closed to existing behavior.

`node scripts/validate-news-hub-sitemap.mjs` passed a disposableWordPress fixture: exact set of all remainingPage IDs, prior exclusion preserved, nonpage query unchanged, canonical target verified, unowned identity unchanged and bothPages stillpublished. `validate-discovery-metadata.cjs` passes19 local responses. The long-lived localbootstrap lacks reconciler ownership keys, so it correctly retains its own hubcanonicals; the disposablefixture tests managed behavior. Production mode explicitly requires consolidatedcanonical and unchangedindexability. Actual production verification remains pending; no redirect or managedcontent remediation has been performed.
