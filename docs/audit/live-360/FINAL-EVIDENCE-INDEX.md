# Evidence handoff index

## Current continuation — 20 September 2026

Production baseline is `5104687`; the older checkpoint below is historical.
News candidate `5068cf9` is locally validated, not yet published. Prospective
guarded-operation tests now cover semantic cron diagnostics and sanitized caller
attribution, exact News12 creates, transaction rollback, private evidence,
all-table/upload comparisons and paired runtime replacement rollback.

- `npm run news:release:test`: disposable WordPress integration; no production.
- `npm run news:release:guards`: isolated PHP comparisons and filesystem/shell
  fixtures; mocked services are explicitly identified in each test output.
- `node scripts/validate-cron-diagnostics.mjs`: isolated PHP observer/redaction
  tests, including validated off-webroot FarmTree source attribution.
- `qa/live-360/news-editorial/report.json`: current local browser rerun, ten
  widths, twelve article routes, sixty internal destinations, zero broken links,
  console errors or tested axe violations. This is not production acceptance.
- `qa/live-360/news12-read-only-capture.json`: production SELECT/file-hash reader
  integration, 23 database tables and 231 upload files; no WordPress bootstrap,
  reconciler or remote file write. Fingerprints contain no raw row values.

The historical cron event is **DEFERRED / EVIDENCE UNRECOVERABLE**, not PASS.
New production plan/APPLY/runtime and QA receipts remain pending.

## Historical checkpoint

Programme: **IN_PROGRESS**. Live66134c6; release-specific aggregate QA completed,
with cold performance and expanded accessibility coverage still in progress.
Follow-up:40-route/11-width browser matrix is now complete; manual accessibility
and valid full cold-performance coverage remain incomplete. Candidate5104687 is
not deployed; follow-up sourceSHA identifies its harness only.
Only completed, scoped reports are pinned below. A passing sample is not a
whole-programme pass. No hash for a still-growing aggregate report is declared final.

| Completed evidence | SHA256 | Scope / interpretation |
|---|---|---|
| `qa/live-360/routes-production-66134c6-followup/report.json` | `6e1ceaba5a57b3721d777577d1c5409051c23f3e9c8eb5ce1d97d7eba021a117` |46routes/46internal destinations,0broken; public crawl |
| `qa/live-360/browser-production-66134c6-followup/report.json` | `d0148bb28d0951af618e2ab44ea9c0f7c864c4ec57d7c33ca4de7c8f506ddc36` |440views,0automated failures/errors;175pending-image observations, not complete-load proof |
| `qa/live-360/pending-image-diagnosis.json` | `32d09182ddaf7065e35dcc7e20c3f1ece435dcc2dbae741f9f30bf24405f6450` |14public URLs HTTP200/decoded; independent fetch, not original lazy timing |
| `qa/live-360/pending-image-diagnosis-with-rail-dwell.json` | `4046415dd795f291b8f7c962b56a925e0deb3e0e000a30b806def6496573ce98` |320/1440 natural rail dwell; transient logo pending observations preserved |
| `qa/live-360/logo-entry-320.json` | `49fef24f80c4d2de427566cbd699a6ee4ef73b6b2e5ccf672ee5351d92422792` |60samples/15.438s; no mostly-visible missing logo after first18ms sample; bounded, not full network matrix |
| `qa/screenshots/cta-layout/production/report.json` | `89f09983d99b0096f14a95e75e760281b6eaa771567eea3c0fa1d669e7a56ecc` |162views,135 existing-CTA cases; PASS |
| `qa/screenshots/menu-links/production/report.json` | `358041f66fb4179fe6d7e01795de68bd6902af5de5e8b3c65f7efa81fc86417e` |33views,11widths; PASS |
| `qa/screenshots/menu-links/production/pointer-report.json` | `7430b4ff1195c30fbf17549ae9b8315e6e65bc26dbeef290f20ea731d3fe6cec` |200trusted activations at320/360/390/414 plus keyboard; PASS |
| `qa/image-release/lcp-production.json` | `f7a65eb9c8f36c1a3f924ce6cf39d9ddb15c87802d514a814f3c12dbd5738dde` |42image views; priority/geometry checks PASS, not field CWV |
| `qa/live-360/motion/testimonial-final-production/testimonial-marquee-results.json` | `32dbdd2a9ee84297dfb9df187e6936c7fd2492cbcbd28e887d0d8742a8d381af` |Six widths and reduced-motion regression; PASS |
| `qa/live-360/motion/production.json` | `1916f7aeb0e7b5729c5b446c4c46dcbc56e359f87a85bb0532efe3afda43f76e` | Current-release four widths, reduced/no-JS, exact-GIF and persistent pause cases; PASS in recorded scope |
| `qa/live-360/documentary-medium-production.json` | `4493cbdd87445818edb3c63ed07e8df8373d4d776731764c49ca8bd24d50aa4e` | Current-release six medium-selection contexts, preserved Proof behavior/geometry |
| `qa/live-360/documentary-medium-local.json` | `9ff08d0faf15860f078bee0ab9098eef40dd3cbdb3250380c6e7ec56a189bb7f` | Local medium-candidate scoped regression, not production evidence |
| `qa/live-360/performance-production-a23441b.json` | `4f0f10a8410f960f40403c79df5a98b761f5385a5c26b64e173211686f9819a4` | Frozen earlier-release performance; contains unresolved gates and limited error collection, not latest performance |
| `qa/live-360/performance-local.json` | `e54f4f084daaa489d1243cc0c0d24196f178e813a1d269c364bc802a6c3d88fc` | Local36-run lifecycle/profile evidence; absolute mobile LCP gates fail, transport differs |

Recovery evidence recorded by independent read-only verification in RELEASE-02.md:

- Artifact SHA256SUMS digest: `be0a54dd4fdd79960e44e90809f994ba2a6e7ea023eb3750e75f973ed5c2165a`.
- Recovery archive:52,164,450 bytes; SHA256 `84ea9111f869c3677b480662eb73d01c7299d34111fe1c8ee7f12891c89dea81`.
- Backup checksum-set digest: `777a9a3b178ca54be2105e837ecb401c1780cedac402ec7c94c8c36bdfbc45ff`.
- Recovery reference: `live360-66134c6c7f60cca1e12abca6658f71591fb04ea1-1789848785091`.
- Recorded readable/nonzero/tar-valid verification, all250 active records match,
  no extra/symlink files; five PHP lint lines and protected snapshots verified.
  These are release-document facts, not a fresh host inspection by this index.

Further provenance: ROUTE-INVENTORY.json pins immutable baseline crawl/browser/
link evidence; VALIDATION.md, RELEASE-01.md, RELEASE-02.md and relevant matrices
describe command/coverage boundaries. Failed QUIC and browser-only diagnostics
are preserved under qa/live-360/experience and must not be presented as passes.
The prepared synthetic medium A/B is not a real-production performance result.

Portability: much QA evidence is ignored and may be absent from a clean clone.
A hash proves integrity only when the corresponding bytes are available; it
does not make evidence retrievable. Retain/access-control the QA archive and
off-webroot recovery artifacts separately. Never publish credentials, cookies,
tokens or personal logs merely to improve evidence portability. Final aggregate
hashes and results must be appended only after execution completes.
