# News & Insights local release candidate

## Isolated News12 authorization and implementation — 20 September 2026

The latest explicit request authorizes a gated News-only production release,
superseding the local-only brief below. The implementation is based exactly on
50677539690c52130b5a489b8b8f36a8c2a418c3 in a separate clone. No original
worktree files or Git refs are changed. Its unrelated Hero file SHA256 is
940e757ac896613738a05cae4435405625e889bb319578ba7882c95fb3a7bc81;
the complete binary diff SHA256 is
bf0e746177b8b419378311c3c5e0c0e87bda896df47fead969d28f5a46551f7c.

`news12-content-manifest.php` is now standalone with profile `news12`, pinned
canonical SHA256 94a5ae70330affae4361fe5167be7234b0b6aa482de1821a1d392282f8316050.
It has exactly twelve article keys, twelve media keys and five category keys.
There is no global manifest include, wildcard or all-content fallback. Exact
ordered group membership is enforced even for unchanged operations. No Pages,
Team, Proof Stories, Customer Segments, embedded entries or options are targets.
IDs439/463/464/465/470/475 are excluded; their drift is not reconciled.
Public-state observations remain separate safety gates, not managed operations.

The approved articles also reference the **existing** Policy & Standards
category. This is a read-only relationship dependency, not a thirtieth target:
its existing unique owned identity and exact definition must resolve or the
operation fails. Its ID is digest-bound. No adoption, definition or metadata
write is allowed; only the exact count increment caused by the new article
relationships is permitted by whole-database evidence. Five new categories
remain the complete category-create scope.

The existing `page-blog.html` uses the dynamic editorial-hub block, not a
post-content block. Theme deployment therefore renders the hub without any
Page470 body or metadata update. Posts remain WordPress editable. No new theme,
copy, source article or image changes were needed in this isolation commit.

Local evidence: disposable WP7.1/PHP8.3 with intentional drift on all six Pages
reports create29/update0/unchanged0/conflict0/skipped0, then
create0/update0/unchanged29/conflict0/skipped0. Full existing row comparisons
preserve their bodies/metadata and all unrelated content. SQL-firewalled dry-run
has an identical database snapshot. Collision/stale digest/unknown unchanged
target tests reject; injected indexing and unrelated post/option/custom-table
writes roll back. No new cron/ping work is created. Core category cache churn is
limited to its already-audited option_id-only replacement; value/autoload stay
exact, and no such exception exists for dry-run.

Local WordPress and anonymous checks pass (40 original routes,122 internal
destinations,zero broken links). Existing local frontend theme is identical to
this candidate except for the separately excluded Hero script; the changed
plugin is additionally exercised directly in the isolated disposable fixture.
Editorial browser checks pass320/360/390/414/768/1024/1280/1440/1920/2560,
all12 article routes at390/1440,60 destinations,21 unique cards/images/decks,
five groups,keyboard,axe,loading priority/formats/metadata,zero overflow/console
errors. These are local laboratory checks, not production or human certification.
Release guard tests pass15 mutation fixtures,33 filesystem cases and20 exact
preflight gate fixtures. Source write-API audit retains the same apply-only API
counts and zero lifecycle/scheduling hooks.

Production sequence remains: exact clean commit artifact/audit and feature-only
push; fresh verified off-webroot database/Native/Content backups; prospective
scoped preflight; rollback-protected runtime-first swap; old-nine hub QA; fresh
scoped dry-run; exact reviewed-digest APPLY; final29-unchanged plan; production
QA and original Hero hash comparison. Every operation retains full database,
uploads/runtime, public-state and prospective cron diagnostics. No global
reconciler, historical dry-run replay or blanket cron exception is permitted.
Production completion is pending and must be evidenced separately.

## Current brief — local redesign only, 20 September 2026

The latest request explicitly prohibits automatic deployment. This refinement
keeps the existing twelve source-led drafts and changes the shared editorial
presentation, not any article body, slug, publication state or managed hash.
The earlier production attempt stopped on six existing Page integrity conflicts;
historical cron attribution is deferred, not the current deployment blocker.
No production operation is included in this local redesign.

HubSpot's blog (https://blog.hubspot.com/, inspected 20 September 2026) is used
only for the lead/companion, topic-section and discovery structure. FarmTree's
cream/green palette, typography, card geometry and shared header/footer remain.
The five groups are Agroforestry Planning, Carbon & Finance, Policy & Standards,
Landscape & Hydrology, and FarmTree Platform / Product Insights. Existing WP
categories map to these presentation groups without taxonomy/database changes.
Sections retain up to two stories before allocating Featured/Latest; each story
appears once. Descriptive topic cards link to real section anchors rather than
invented archive routes. Single-story topics remain visible.

The lower-page stay-connected panel is intentionally **not a working newsletter
subscription**: it opens the approved info@farmtree.earth mailbox and explicitly
discloses that no automatic subscription occurs. A provider/list and approved
subscription/privacy workflow are needed before adding email collection. No form,
fake success state, third-party script or new visitor-data storage is introduced.

Article drafts: `content/news/` (12 existing sources, 933–1072 body words), unique
titles/decks/images, editable core blocks, source sections and internal links.
Source provenance and evidence limitations remain in `news-source-register.md`.
No new scientific, product, financial or regulatory claims were introduced here.

Local preview: http://localhost:8888/blog/. Browser evidence is regenerated in
`qa/live-360/news-editorial/`; tests assert all five populated groups, topic-card
anchors, lead/companions, honest email CTA, no form, responsive images, keyboard
access, axe, console, overflow, internal destinations and twelve article routes.
Separate pre-existing Hero JavaScript work is excluded from this change.

### Current validation result

Local WordPress verification and anonymous checks passed: 40 original routes,
122 internal destinations, zero broken links; reserved /nl/ and /de/ remain404.
The News browser matrix passed at320/360/390/414/768/1024/1280/1440/1920/2560:
21 unique cards/images/decks, five populated groups and working topic anchors,
twelve article routes at390/1440, sixty destinations, zero console errors,
overflow or axe violations. Maximum observed initial CLS was0.03901 in this
loopback run, not a production performance score. One primary high-priority
image, below-fold lazy loading, no duplicate image preload, dimensions and
AVIF/WebP/JPEG srcset/sizes passed. Desktop/mobile captures were inspected.
Static/native block and managed-content checks remain part of `npm test`.

## Earlier implementation record

## Ownership and reproducibility

The twelve reviewed Markdown sources live in `content/news/`, outside the public
webroot. `scripts/news-editorial-content.mjs` compiles a deliberately small,
escaped Markdown subset into editable core Heading, Paragraph and List blocks.
`content/news-release-source-plan.json` records stable entity slugs, content and
image SHA256 values. It is explicitly **non-executable**, not a production plan,
ownership determination or authorization. Publication dates remain null there.
The existing production managed manifest is unchanged; it cannot silently import
these new sources. A separately reviewed production adapter/plan remains gated.

`npm run wp:bootstrap` creates the preview on loopback only. New local posts use
their actual preview creation date, never an institution's source date. The
local ownership ledger in ignored `qa/live-360/news-preview-ownership.json`
protects subsequent explicit `--refresh-preview` body refreshes. Missing or
changed ownership evidence stops rather than overwrites. Verify performs no
WordPress writes; it may record local verification evidence. No admin cookie is
logged, and authenticated API/admin requests reject redirects.

Titles, excerpts, bodies, featured images and categories remain WordPress-owned.
Existing native SEO derives descriptions from the editable excerpt/deck; the
Markdown `metaDescription` is an editorial alternative, not a hidden override.
Native BlogPosting metadata uses actual WordPress publication/modification dates
and organisation publisher, with no invented human author.

The original theme implementation owned the CSS-only asymmetric layout, topic allocation and seven topic
groups. Each post is allocated once. At least one story remains in each available
topic; the six newest eligible stories fill Featured and Latest. Explore topics
uses section anchors, not incomplete first-alias category archives. The approved
Homepage query retains its existing three News cards, without changing its body.

## Images

Old nine News photographs retain their source bytes. New article → photo number:
01→13, 02→original abstract evidence-chain diagram, 03→17, 04→6, 05→9,
06→7, 07→18, 08→4, 09→1, 10→16, 11→3, 12→5.
All twenty photographs have distinct source identities. Descriptions do not
invent locations, people, results or species. Captions distinguish contextual
photographs from evidence. The diagram is original vector artwork rasterised
with Sharp, not a simulated field photograph. AVIF/WebP/JPEG responsive exports
strip private metadata. Existing exports were checksum-verified and not rebuilt.

## Local checks

- `npm test`: includes editorial/source-plan checks and existing repository suite.
- `npm run wp:verify`: original runtime plus twelve editorial preview records.
- `npm run wp:verify:anonymous`: original routes and 21-card hub, formats/loading.
- `npm run news:verify:browser`: ten widths, twelve article routes at two widths,
  unique cards/decks/images, local links, console, dimensions/formats, canonical,
  BlogPosting/OG, initial CLS, mobile/desktop axe, trusted Tab/Enter navigation.
- Screenshots and machine evidence: ignored `qa/live-360/news-editorial/`.

Final local matrix receipt SHA256:
`68737335de25ea35b9d675b3f22221f194cd605d08080d84bcae9935d6f138ce`.
Ten widths passed; twelve new routes passed at 390/1440; 60 unique browser-crawled
URLs returned 200; console/overflow/axe findings were zero. Every image LCP was
the eager lead. Initial observed LCP was 468–524ms and maximum CLS 0.03236 in
this loopback run. Trusted Tab reached all 21 cards at 390/1440 and Enter followed
the focused link. Existing anonymous suite separately checked 122 internal URLs
with zero broken links and retained the approved Homepage cards. `npm test`,
`wp:verify`, `news:verify` and `wp:verify:anonymous` passed.

The measured font-swap chip reflow was fixed with explicit breakpoint-based grid
rows, without delaying font/image rendering or relaxing CLS assertions. Tablet
Featured stacks its lead above supporting cards so a lazy supporting image is
not the primary LCP. Both fixes are scoped to the editorial stylesheet.

Local timings are laboratory observations, not production LCP or field-data
regression proof. Automated axe does not establish screen-reader or human signoff.
The full FAO governance PDF was inaccessible; article05 attributes only facts
verified through FAO's announcement and the preparing organisation, with original
recommendations distinguished. Existing source-date provenance findings are
recorded separately; old publication history and production content are untouched.

The pre-existing Hero interaction change is outside this commit. Build/audit the
editorial commit in a clean detached worktree so that change cannot leak into
the candidate artifact. Production QA and publication are not claimed.
