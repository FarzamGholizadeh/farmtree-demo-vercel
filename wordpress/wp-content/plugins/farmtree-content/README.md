# FarmTree Content

Canonical content-model, taxonomy, global-settings and editorial-capability
layer for the isolated FarmTree native rebuild.

## FT-NATIVE-001 Status

The plugin is a foundation scaffold only. It registers no post types,
taxonomies, options, REST routes or database tables and is not approved for
production activation.

The architecture manifest reserves the locale contract without publishing
translations: English owns `/`; Dutch reserves `/nl/`; German reserves `/de/`.
Reserved locales create no rewrites, pages, navigation links, hreflang,
canonical alternates or sitemap entries until approved translations are
complete. The manifest also records quotation delivery as unconfigured. The
inactive frontend therefore collects, stores, transmits and logs no personal
information and exposes only the approved email fallback.

`farmtree-core` currently registers no models. It remains a temporary
compatibility/documentation layer until all consumers are audited. Future
registrations move into this plugin one model at a time in FT-NATIVE-003, with:

- Block Editor and REST support;
- capabilities and role review;
- templates and archive behavior;
- migration and rollback;
- SEO and translation behavior;
- approved non-empty content.

Do not implement the same model in both plugins.
