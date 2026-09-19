# Release03 — exact approved theme deployment

Deployed SHA: 5104687c27b7b6aa69b100e55d905a8107726ec7.
Explicit user approval covered this SHA, feature-branch push and rollback-protected
active Native-theme replacement only. No reconciler, content/database mutation,
publication, indexing, Coming Soon or permalink change was authorized or run.

The main checkout retained its later documentation commit. An isolated clean
feature-branch checkout at the exact approved SHA ran npm test, release:build
and release:audit successfully. Only that SHA was pushed. Remote was66134c6
before push and5104687 after push and final QA. Later documentation was not pushed.

Artifact:250 runtime files,114 excluded; SHA256SUMS digest
e28c00eb025dcfb09066aa4765ba981d414c2bf3d8ffb04ee24c7276bb5148ca.
Theme-only change: native-interactions.js and style.css. Content runtime unchanged.

## Recovery and state checks

Recovery reference: live360-5104687c27b7b6aa69b100e55d905a8107726ec7-1789853896798.
Fresh off-webroot archive:55,165,686 bytes; readable/tar-valid; SHA256
d232cab257768509b5fcd354aa5bcd857373f349f4ecbc84a419e87d27b2288b.
Backup checksum-list SHA256:
f1aebd3c1ebeaa8894279f7e80d5ba1490f01b2bfd507c54e95d1e695e97ab89.
Independent post-release checks verified the backup,246 theme file hashes,
five successful retained PHP lint results, unchanged plugin/legacy hashes and
identical monitored options/posts/postmeta snapshots. Runner public-state gates
passed; Homepage200, public indexing enabled, Coming SoonOFF, NL/DE unpublished,
Native/Content active and BotOFF. No database writes by runner; no reconciler run.
Rollback was not required. This is not a complete server error-log audit.

## Production QA

- Motion/globe:320,390,1440,1920 plus reduced/no-JS cases PASS;32 direction
  checks, minimum44px controls, preserved pause state. Screenshot visually checked.
- Text spacing:24 cases across six routes/four widths PASS; all metric digits
  remain visible under expanded spacing, default metric geometry preserved.
  Other clipping diagnostics/manual WCAG coverage are not globally certified.
- Navigation:33views,22 Investors navigations; pointer suite200 activations
  at320/360/390/414 plus keyboard PASS.
- CTA:162views,135 existing-CTA cases across nine widths PASS.
- Images:42priority/geometry views PASS; prose10, metadata19, headers6 PASS.
- Public crawl:46routes,45sitemapURLs,46internal destinations,0broken/0failures.
- Testimonial loop:320,390,768,1024,1440,1920 and reduced motion PASS.
- No console/page errors reported by these suites. No unexpected404s found.

## Pinned release evidence

Root: qa/live-360/release-5104687/. Earlier-release evidence remains preserved.

| Report relative to evidence root | SHA256 |
|---|---|
| runtime-qa/live-360/motion/production.json | a2fe2e4d4b32842543ab41b9a2b01b5dae1d918f549588666c6391f1b56e52b4 |
| runtime-qa/live-360/text-spacing-production/report.json | ee05c2f52a7fa3dc39170ff4dc23e7fccafdcba7adbf6cdf1564216aa0a0e5d8 |
| runtime-qa/live-360/routes-production-5104687/report.json | 12b7483ab4850261b599185d4b0c85e095a225f1a350736c3a9ec02fa4336114 |
| testimonial/testimonial-marquee-results.json | 32dbdd2a9ee84297dfb9df187e6936c7fd2492cbcbd28e887d0d8742a8d381af |

The scoped deployment and QA are complete. The wider Live360 programme remains
incomplete: content/reconciler approval, full performance, acceptance adjudication
and human/organisational evidence are separate unresolved work.
