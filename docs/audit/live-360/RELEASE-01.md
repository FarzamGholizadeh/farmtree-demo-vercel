# First remediation batch — theme-only, pre-deployment record

Baseline: `6b01611b1d87edd8190b54f405beefddf33ebf27`, source/remote/live manifest
verified. Explicit Live360 programme authority covers this scoped release; it is
not standing permission for later unrelated tasks.

## Runtime scope

Only Native `style.css` and `functions.php` change. Permanent inner-page prose
underlines remedy colour-only link distinction, excluding navigation/buttons/cards.
Metadata gains actual approved local imagery, category context, stable Organization
identity, brand casing and actual article headline/date. Core owns singular
canonicals. Only the owned/public duplicate News hub canonical/schema/OG points
to Blog, and its exact Page ID leaves the sitemap; the URL remains available.
JSON-LD encodes HTML delimiters safely. Public responses default to nosniff and
strict-origin-when-cross-origin without overriding existing policy or indexing.
The existing News featured figure now reserves its full grid width before image
bytes arrive. A real mobile CLS failure (0.13097; copy moved253.5px) was reproduced
with delayed images on production. Width100%/min-width0 preserves the final crop
and layout; the regression now explicitly tests pre-load geometry.

No body, title, slug, publication, database, plugin, routing, Coming Soon or Bot
mutation. No new scripts, fonts, assets, tracking or external requests in runtime.

## Engineering scope

- Thirty independent role perspectives and fixed acceptance/scoring contract.
- Reusable Live360 skill extension; current public-state instructions corrected
  without rewriting historical records or loosening explicit approval boundaries.
- Root-pinned browser dependencies and discoverable parameterized regression suite.
- Development advisory remediation: Puppeteer25.11.0 and compatible transitive
  patches; Express's local-only qs pinned6.16.0 until upstream range admits it.
  `npm audit` reports zero known advisories; this is not a vulnerability guarantee.
- Retired legacy/private deployment workflows fail closed. Pinned SSH trust replaces
  live keyscan trust. Tracked theme-only release runner uses exact SHA, reviewed
  deployed manifest, host lock, verified off-webroot backup, guarded swap/rollback,
  and protected-state equality. No workflow was dispatched.

## Validation before committing

- npm test, wp:verify and wp:verify:anonymous pass after the final sizing fix
  (40routes,104internal links, documentary formats, editor checks). A concurrent
  release-fixture run hit its30s process timeout; the full serial rerun passed.
- Browser components pass: menu33views/22real navigations, pointer200trusted
  activations at320/360/390/414, CTA162views/135CTAviews, LCP42views/errors0,
  prose10views, metadata19responses and headers6responses. The first aggregate
  stopped at the real News CLS defect; remaining components and corrected LCP
  were rerun separately. One LCP retry hit a lifecycle timeout; unchanged final
  run passed all42views. This reliability limitation remains disclosed.
- Deterministic held-image check:390px featured figure338×253.5 and copytop
  669.4375 before/after image bytes; zero geometry displacement.
- Local40routes×11widths:440 views, zero automated violations/overflow/completed
  broken images/duplicateIDs/console errors. Pending lazy images remain disclosed.
- Menu keyboard cycle/Escape320/390/1440, reduced motion and no-JS content pass.
  Invalid CSS-zoom simulation is retained as superseded harness evidence;
  reflow-equivalent640/320 passes. Actual zoom/AT listening remains manual.
- Prose10views and metadata19responses pass. Disposable WP proves exact sitemap
  remaining IDs, prior exclusions, public status and unowned fail-closed behavior.
- Real isolated PHP verifies script-terminator escaping with exact JSON round trip.
- Release tests exercise real disposable swap/rollback plus source/path/drift
  refusal. Mocked platform boundaries are explicitly identified. Exact state helper
  also passed live read-only SELECT and nine real-server-PHP synthetic fixtures.
- Release build correctly refuses dirty runtime sources. Build/audit must run
  again from the clean committed SHA before push/execution; never bypass this gate.

## Required release evidence

Record source SHA, origin SHA, audited artifact digest, fresh backup reference,
deployed checksums, protected state equality and live semantic/browser retests.
Until then all production findings remain OPEN. Remaining content, motion,
performance, manual accessibility and organisational evidence are separate work,
not hidden by this batch or a premature perfect score.
