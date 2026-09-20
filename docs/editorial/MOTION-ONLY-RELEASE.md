# Motion-only release

Based on deployed `94e68d1160e4d7193a8551723fb23ef74d3889ef`, in a separate
workspace preserving the IDE and prior isolated checkouts. Only Native
`assets/js/native-interactions.js` and `style.css` change at runtime.
Collection navigation, Content plugin, all manifests, routes and content remain
byte-identical to that baseline.

Carries the approved first-input Hero gate, compact Hero/Platform controls and
per-document count-up from `8a6b28d`. Ambient pause and globe direction controls
are contextual (hover/focus), not permanently visible. Keyboard users can reach
the controls; focused controls become visible. Underlying animation callbacks,
persistent user pause within the document and reduced-motion support remain.
Counters use no storage persistence, run once on viewport entry per document,
and show final values immediately for reduced motion.

Local candidate verification uses browser-only JS/CSS overrides, not a stored
WordPress edit. `scripts/validate-motion-cleanup.cjs` covers six widths, three
loads each, counter re-entry, compact/contextual controls, keyboard, Hero dots,
Platform GIF/poster, globe, rails, field quotes, reduced motion and overflow.
Local WP/anonymous checks passed (40 routes, 122 internal links, zero broken;
39 responsive pictures). Release runner regression and artifact classification
passed. CLI browser tool unavailable; existing Puppeteer harness used.

Production gates: exact audited SHA, identical Content checksums, matching
deployed baseline, fresh verified off-webroot backup, SQL-only state snapshots,
rollback-protected theme swap, then live 390/1440/1920 QA. No reconciler APPLY.
Evidence is retained under ignored `qa/motion-cleanup/` and the release backup.
Do not treat local evidence as production QA until the production report passes.
