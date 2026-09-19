# Final architecture review — IN_PROGRESS

Evidence cut: deployed theme `66134c6c7f60cca1e12abca6658f71591fb04ea1`,
2026-09-19. Report-package title does not imply all programme gates are complete.
See [current architecture](../../FT-NATIVE-ARCHITECTURE.md),
[acceptance](ACCEPTANCE.md), and [security boundaries](FINAL-SECURITY-MATRIX.md).

## Current ownership

| Layer | Owner and boundary |
|---|---|
| Public presentation | Active `farmtree-native` Block Theme: templates, shared header/footer, patterns, visual system, presentation filters and browser interactions |
| Editorial data | WordPress Pages, Posts, attachments and Gutenberg bodies; editor-selected images/alt and approved wording remain content-owned |
| Managed identity | Active `farmtree-content`: Customer Segment/Proof Story CPTs, redirects and guarded CLI reconciliation; no blanket database import |
| Optional capabilities | Separate Core/AI/provider plugins remain outside this theme release; active plugin does not imply enabled public Bot |
| Rollback reference | Existing `farmtree` theme retained and independently hash-checked; not overwritten by Native deployment |
| Delivery | Explicit allowlist, pinned source/host, baseline drift checks, off-webroot backup, host lock, controlled theme swap and protected-state comparisons |
| Reference/development | Root static site, legacy assets, scripts and audit records are not the Native public artifact; inventory classifications do not authorize deletion |

The live approved public state remains the governing release constraint:
Coming Soon OFF, public indexing enabled, public Homepage/English routes,
NL/DE unpublished, FT Bot OFF. Theme delivery does not own authority to change
those settings, content publication, routing or legal text.

## Latest bounded presentation work

- Local motion controls cover existing motion owners. User pause is in browser
  memory, not persisted in WordPress or storage. Reduced-motion preference wins;
  manual globe interaction does not restart paused autoplay.
- The exact approved Platform GIF is rendered initially as its poster and
  activated on viewport entry. Filter scope is core Image, exact class/URL and
  absence of editor srcset/sizes overrides. Nonmatching replacements opt out;
  with JavaScript disabled, the static poster remains. Saved content is not rewritten.
- The additional 800×600 documentary candidate applies only to featured image
  blocks on the Blog page. Existing detail/core-image/hero candidate behavior,
  loading priorities, alt text, crop styles and editorial content are preserved.
- Thirty-three medium exports supplement the existing 132 unchanged exports.
  Source/evidence hashes and exact release allowlist were checked independently.

## Proven deployment boundary

Independent read-only verification found **250** exact active Native+Content
artifact files, all hashes matching the release, no extras and no symlinks.
Content and legacy before/after hashes match; protected recorded state matches.
The release changed the Native runtime, not plugin runtime or managed content.

Fresh backup reference:
`live360-66134c6c7f60cca1e12abca6658f71591fb04ea1-1789848785091`.
Archive size **52,164,450 bytes**, readable and tar-valid. Archive SHA-256:
`84ea9111f869c3677b480662eb73d01c7299d34111fe1c8ee7f12891c89dea81`.
The checksum set verifies, including **five successful PHP lint lines**.
Exact checksum-set provenance is in the security matrix.

## Unclosed architectural assurance

Fresh managed-content idempotence remains **UNKNOWN / APPROVAL BLOCKED**. The
attempt was rejected before execution because normal WordPress bootstrap can
run hooks before the reconciler's SQL firewall. No fresh conflict=0 or
zero-mutation conclusion can be substituted from source review or theme hashes.

Host MFA, log access/alerting, update governance, retention/deletion policy,
processor evidence and complete restore readiness require human/host evidence.
Backups and local rollback fixtures do not establish a successful host restore
drill or recovery time objective. The two-directory swap retains a brief
possible missing-theme window; it is not a zero-downtime architecture claim.

Repository classification is path-based ownership/deployability evidence, not a
full dependency/dead-code audit. No historical source or media is declared safe
to delete. This architecture review does not certify ISO, ASVS or a 100/100
programme score, and remains IN_PROGRESS while applicable gates are unverified.
