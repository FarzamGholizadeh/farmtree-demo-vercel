# FarmTree Content

Canonical content-model, taxonomy, global-settings and editorial-capability
layer for the isolated FarmTree native rebuild.

## Publication-readiness status

The plugin registers the REST-enabled `customer_segment` post type with core
editor, excerpt, featured image, revisions and ordering support. Its clean
single route is `/customer-segments/{slug}/`; no public archive is created.
Bootstrap source entries remain private until individual editorial approval.
Three professional insight foundations are likewise created as drafts only.

The architecture manifest reserves the locale contract without publishing
translations: English owns `/`; Dutch reserves `/nl/`; German reserves `/de/`.
Reserved locales create no rewrites, pages, navigation links, hreflang,
canonical alternates or sitemap entries until approved translations are
complete. The manifest also records quotation delivery as unconfigured. The
inactive frontend therefore collects, stores, transmits and logs no personal
information and exposes only the approved email fallback.

`farmtree-core` currently registers no overlapping models. It remains a
temporary compatibility/documentation layer until all consumers are audited.
Future registrations move into this plugin one model at a time, with:

- Block Editor and REST support;
- capabilities and role review;
- templates and archive behavior;
- migration and rollback;
- SEO and translation behavior;
- approved non-empty content.

Do not implement the same model in both plugins.

The AI Assistant remains owned by `farmtree-ai-assistant`, inactive until a
real provider is configured. Provider credentials and capability checks stay
server-side; Knowledge, Behavior and Skills remain separately governed. No
simulated answer path is allowed.
