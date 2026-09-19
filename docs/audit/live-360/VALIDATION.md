# Reproducing the audit gates

Use Node≥22.12 and `npm ci`. Browser libraries are exact locked development-only
dependencies; no ignored `qa/tools/node_modules` installation is required by the
tracked Live360 or menu/CTA/LCP regressions. Install a compatible Chrome locally;
set `CHROME_PATH` on platforms other than the documented macOS default. Chrome
is not downloaded or deployed by the audit. Start the existing LocalWP runtime
before local browser tests; it must remain loopback-only and noindex.

```sh
npm test
npm run wp:verify
npm run wp:verify:anonymous
npm run validate:jsonld
npm run validate:sitemap
npm run validate:browser
npm run audit:browser
npm run audit:performance
npm audit
```

Browser/performance commands default to local. Explicit production read-only mode:

```sh
npm run validate:browser -- https://farmtree.eu/
npm run audit:browser -- https://farmtree.eu/
npm run audit:performance -- https://farmtree.eu/
```

The full route matrix supports `--inventory=FILE` to include discovered category
and canonical routes; default is forty managed routes. `--interactions-only`
does not imply route coverage. Machine results retain unknown axe/manual items,
pending lazy images and measurement limitations. Screenshots and bulky evidence
remain ignored under qa/live-360; durable reports reference hashes/paths.

Run performance measurements without concurrent browser load. Mobile lab network
and CPU throttles, repeats and measurement window are recorded by the script.
They are not field INP/CWV or a guarantee for all real visitors.

After a clean source commit (the builder rejects dirty runtime inputs):

```sh
npm run release:build
npm run release:audit
```

Only after all release-specific gates and current user authority permit it,
follow `scripts/RELEASE-NATIVE-THEME.md`. No command in the validation block
deploys, activates a plugin/theme or changes production WordPress content.
Disposable WordPress fixtures are isolated from both local authoring and production.
