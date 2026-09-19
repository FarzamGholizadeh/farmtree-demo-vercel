# Primary documentary image loading

The responsive picture filter previously forced every non-Homepage image lazy
and removed native fetchpriority. Preserve core-generated attributes for 16:9
featured blocks on the News index, single News and single Proof Story templates.
Do not add eager/high attributes or preload links. Cards (4:3), other templates,
ordinary content images and Homepage slides retain their prior behavior.
No media, dimensions, sources, sizes, crop, alt text or saved blocks change.

`node scripts/validate-lcp-priority.cjs [http://localhost:8888/|https://farmtree.eu/]`
checks 14 affected routes at 390/1440/1920 without forcing image loads. It records
actual LCP/CLS and checks primary non-lazy, below-fold lazy, at most one high
priority image, responsive attributes/formats, no preloads/overflow/console
errors. Local desktop measurements identify the featured images as LCP; mobile
single News pages may instead have their heading as LCP. Core retains control.

The full anonymous regression now explicitly expects a non-lazy News lead.
Runtime change is theme functions only: no plugin or manifest deployment needed.
Build/audit the clean focused commit, push only the approved feature branch,
create fresh off-webroot DB/runtime backups, and require a zero-change/conflict
production editorial dry-run. Verify staged checksums and swap Native only with
error rollback. Verify all 217 installed runtime files against the artifact,
preserving the existing plugin and rollback theme. Re-run public QA and the
zero-change dry-run; do not APPLY content or change options/activation state.

Current production baseline: indexing enabled, Coming Soon OFF, Native/Content
active, Homepage 439 public, NL/DE absent, Bot OFF. Final deployment evidence is
recorded after the gated operation; this source document does not claim it done.
