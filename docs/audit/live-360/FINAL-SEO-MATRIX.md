# Technical SEO handoff matrix

Programme: **IN_PROGRESS**. This requested FINAL-named handoff is not a completion
certificate or a score. Snapshot: live theme-only release
`66134c6c7f60cca1e12abca6658f71591fb04ea1`; final production browser QA pending.
Apply `ACCEPTANCE.md` statuses without extrapolating samples to all routes.

| Acceptance area | Evidence and exact coverage | Current disposition |
|---|---|---|
| Route/status discovery | Immutable `ROUTE-INVENTORY.json`:55 baseline routes,46 sitemap URLs; redirects and per-route fields retained with evidence hashes | Historical baseline, not latest-release crawl |
| Fresh discovery | `RELEASE-02.md` records pre-release audit46 routes,45 sitemap URLs,46 internal destinations,0 audit failures | PASS within recorded crawl; latest-release retest pending |
| Metadata | `RELEASE-01.md`:19 production responses pass after a23441b; category descriptions/canonical, stable Organization description, FarmTree title casing, social image and truthful article fields | Verified first release; latest-release regression pending |
| Duplicate feed | `/news-insights/` remains200; owned/public duplicate canonical/schema/OG points to `/blog/`; narrow sitemap exclusion preserves other IDs | Production first-release PASS; no redirect or content deletion |
| Robots/indexability | Successful66134c6 guarded swap reports public-state snapshots preserved, Coming Soon OFF and public indexing configuration unchanged | Configuration evidence; search-engine inclusion UNKNOWN |
| Headings/images | Baseline55 routes each one H1; images contain alt attributes; JSON-LD syntactically valid | Structural baseline only; attribute presence does not establish semantic quality |
| Internal links | Immutable baseline44 unique anchor destinations plus3 canonicalisation probes without failures; fresh audit above has different coverage | Do not combine counts or infer unchecked external destinations pass |
| Source dates | Nine generated citations misuse article sourceDate as source publication date | FAIL/open; exact proposed corrections in CONTENT-BATCH-PROPOSAL.md, not implemented |
| Image delivery/CWV | Medium Blog candidates and motion delivery released theme-only | See main-owned PERFORMANCE-MATRIX.md; no performance pass inferred here |

No content reconciliation APPLY occurred in these theme releases. Fourteen-body
proposal remains unimplemented; fresh owned-content SQL-firewalled dry-run is
separately gated on exact bootstrap-risk approval, followed by reviewed scope,
digest and backups. No guessed author, source-publication date or legal fact
was added to schema. Article publication dates remain unchanged.

Remaining: latest-release full route/metadata/browser evidence; actual indexing
and field CWV evidence; bounded content correction; manual claim substantiation.
See RISK-REGISTER.md SC-01 through SC-10 and the independent search assessment.
