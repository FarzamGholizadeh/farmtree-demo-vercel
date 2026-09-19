# Final security matrix — IN_PROGRESS

Evidence cut: 2026-09-19, deployed theme SHA `66134c6c7f60cca1e12abca6658f71591fb04ea1`.
“Final” names the report deliverable, not completion or certification. Apply the
fixed [acceptance contract](ACCEPTANCE.md): UNKNOWN and MANUAL-VERIFY receive no
verified credit. This is neither ISO certification nor full OWASP ASVS 5.0
conformance, and does not support 100/100. [Earlier matrix](SECURITY-MATRIX.md)
and [independent assessments](assessments/security-architecture.md) retain
historical observations; stale first-release-pending labels are superseded only
by the specific evidence below.

| Control area | Current bounded evidence | Status / limitation |
|---|---|---|
| Runtime provenance | Independent read-only comparison found exactly 250 Native+Content artifact files, all hashes matching `.release/SHA256SUMS`, no extra files and zero symlinks | VERIFIED for this release snapshot |
| Backup integrity | Fresh off-webroot archive readable, non-zero, valid tar; complete checksum set passes including retained PHP lint evidence | VERIFIED integrity, not restore readiness |
| PHP syntax evidence | Exactly five successful lint lines retained and checksummed | VERIFIED syntax only; does not prove absence of runtime PHP errors |
| Protected state | Recorded before/after protected options, all posts and postmeta snapshots equal | VERIFIED recorded release comparison; not every database table or concurrent event |
| Plugin / rollback preservation | Content and legacy before/after manifests equal; current files also match their saved hashes | VERIFIED scoped preservation; no plugin upgrade or general plugin-security improvement claimed |
| Source injection controls | Existing scoped escaping, JSON-LD terminator regression, exact artifact path/type checks and local command argument validation reviewed | PARTIAL; not exhaustive XSS/SQL/SSRF/upload/authorization testing |
| Deployment failure handling | Disposable tests exercise real filesystem swap/rollback, PHP-file traversal, lint failure before swap, malicious archive refusal and mocked lock refusal | PARTIAL; PHP/WP/HTTP/flock mocked; complete host restore drill and real contention test not performed |
| Public headers / discovery | Previous deployed header/metadata evidence remains documented; newest theme release is presentation/resource-loading work | PARTIAL; do not infer every header/security configuration passed anew from artifact checks |
| Managed-content idempotence | Fresh post-launch reconciler run requested but approval reviewer rejected execution before process creation because WordPress bootstrap precedes scoped SQL firewall | UNKNOWN / APPROVAL BLOCKED; no fresh plan, digest, conflict count or zero-write result may be claimed |
| Authentication / sessions | Earlier aggregate registration/session/temporary-access observations only | UNKNOWN admin/host MFA, password policy, session rotation and historical application-password revocation |
| Third-party plugins | Bounded official listing/changelog review matches installed SeedProd 6.20.9, Temporary Login 1.9.9 and OpenAI Provider 1.1.0 | PARTIAL; no unpatched applicable match established, not absence of vulnerabilities; Site Assistant maintenance provenance unknown |
| Host updates / operations | Installatron integration delegates automatic updating outside WordPress | MANUAL-VERIFY actual host update success, responsibility and schedule |
| Logging / alerts | Current authoritative PHP fatal/error log and alert-delivery evidence unavailable | UNKNOWN; syntax and browser console checks are not server-log substitutes |
| Privacy / retention | Earlier sampled anonymous network/storage evidence and opt-out states documented | PARTIAL; human evidence needed for access logs, mail, backups, processors, deletion and retention; no periods invented |
| Disaster recovery | Backup bytes/checksums verified; legacy runtime retained | MANUAL-VERIFY complete restore drill, recovery access, encryption, retention, RPO/RTO |

## Exact latest backup evidence

- Reference: `live360-66134c6c7f60cca1e12abca6658f71591fb04ea1-1789848785091`.
- Archive: **52,164,450 bytes**.
- Archive SHA-256: `84ea9111f869c3677b480662eb73d01c7299d34111fe1c8ee7f12891c89dea81`.
- `backup.sha256` SHA-256: `777a9a3b178ca54be2105e837ecb401c1780cedac402ec7c94c8c36bdfbc45ff`.
- All recorded hashes pass; `php-lint.txt` contains **5/5** successful lines.

The earlier `/dev/fd` deployment attempt stopped before swap. The successful
release uses a regular NUL-delimited PHP source list and retains lint evidence;
this does not retroactively resolve missing historical first-release evidence.

No production mutation was performed by the independent verification. No new
plugin hardening, authenticated audit, exploit scan or security certification is
implied. Open assurance gaps remain visible and keep this report IN_PROGRESS.
