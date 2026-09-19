# Security verification matrix — bounded technical assessment

Date: 2026-09-19. Framework reference: OWASP ASVS **5.0.0**. OWASP describes ASVS
as a basis for verifying application security controls; this document maps
FarmTree observations to relevant control areas, **not** a complete requirement
attestation or an ASVS assurance-level certification. Requirement IDs are not
invented where individual normative requirements have not been reviewed.
[Official OWASP ASVS project and release reference](https://owasp.org/projects/asvs).

Statuses: VERIFIED = bounded observed check; PARTIAL = source/sample evidence
only; OPEN = evidenced gap; UNKNOWN = not verified; N/A = explicitly absent
feature, not a blanket exclusion of related administrative functionality.

## First-release update

Theme release `a23441ba6f72d120f8bd2aac5ada0adcf3bb8546` passed real checksum,
fresh-backup, unchanged plugin/legacy and protected-state equality checks.
Live header checks pass6responses; JSON-LD/metadata checks pass19responses.
Live syntax checks pass5PHPfiles. Browser suite reports no console errors.
Current PHP fatal logs remain unavailable. Missing original lint evidence is
recorded separately as OPS-003; fresh lint is not substituted for historical
server-log evidence. See RELEASE-01.md for exact scope and backup provenance.

Primary WordPress.org version/changelog review found installed SeedProd6.20.9,
Temporary Login1.9.9 and OpenAI Provider1.1.0 match official listings. The
Temporary Login release includes documented revocation/permission fixes; actual
historical credential revocation was not tested. No applicable unpatched match
was established in this bounded review, not proof of vulnerability absence.
Host Site Assistant1.0.0 is a differently packaged standalone integration and
cannot be mapped to the directory Extendify3.2.1 release. Its maintenance
provenance remains unknown. Insights opt-out does not establish that every
administrative host hook is disabled. Primary references and limitations are in
`qa/live-360/security/plugin-advisories.md`.

The matrix below retains baseline-to-first-release applicability and remaining
assurance gaps; the update above supersedes its first-release-pending labels,
not its untested authentication, logging, update-policy or full-audit boundaries.

| Control area | Applicability | Evidence / result | Status and remaining boundary |
|---|---|---|---|
| Output encoding / XSS | Dynamic titles, excerpts, metadata, editor content | Inspected metadata uses URL/attribute escaping. Raw JSON-LD script context hardened locally with JSON_HEX flags; actual PHP-WASM malicious-terminator/Unicode round-trip test passes | PARTIAL; live verification of new source required, no exhaustive theme/plugin XSS review |
| SQL injection | Native CLI and WordPress data access | Content reconciler scoped source review; release audit uses fixed SELECT SQL and validated prefix | PARTIAL; not every third-party query reviewed |
| Command injection | Deployment runner and CLI | Local arguments passed as arrays; exact SHA/digest/paths validated; pinned-host SSH and bounded remote commands | PARTIAL; local tests pass, first real runner deployment/host verification pending |
| Authentication | WordPress administration | Public registration disabled; three aggregate accounts; no identities/tokens collected | PARTIAL; MFA/password policy/host control-panel authentication UNKNOWN |
| Temporary access | Temporary Login plugin active | One grant has positive elapsed numeric expiry; source expiration comparison inspected | PARTIAL; no token use, session revocation or authenticated login test performed |
| Session security | WordPress and temporary administrative sessions | Two `session_tokens` metadata records (not active session count); ordinary public routes set no cookies | UNKNOWN for authenticated flags, timeout, rotation and revocation |
| Authorization | Admin, REST editor operations, uploads | AI admin source checks capability plus nonce; native CPTs use WordPress editor interfaces | PARTIAL; role-by-role authorization and all REST/upload permissions not exercised |
| CSRF | Admin operations; optional AI route | Source nonce checks present on inspected AI handlers; native reconciler is CLI-only | PARTIAL; no exploit or authenticated cross-origin testing |
| Public contact forms | Public Native website | Sampled contact route has no form; mailto-only design | N/A for contact submission backend; administrative forms still applicable |
| Public account registration | farmtree.eu | `users_can_register=0` | VERIFIED configuration, not authentication assurance |
| AI provider data flow | Installed optional feature | Exact read-only gate verifies assistant disabled; sampled routes have no external resources | VERIFIED disabled feature state; future enablement needs separate abuse/privacy/security review |
| Upload/file validation | WordPress media administration | Release artifacts enforce regular files and exact allowlist; malicious package symlink/traversal tests fail closed | PARTIAL; WordPress upload authorization and media parser attack surface UNKNOWN |
| Path traversal / archive extraction | Theme release | Exact member set, safe path grammar, no traversal/links/special members before extraction; disposable tests pass | VERIFIED local bounded tests; production runner validation pending |
| Data protection / secrets | Config, backups, deployment keys | `wp-config.php` 600, off-webroot backup directory 700; gate option values streamed in memory and not recorded | PARTIAL; backup encryption, retention, full secret scan and external access policy UNKNOWN |
| Transport security | Public website and SSH | HTTP redirects to HTTPS; pinned-known-hosts runner source; workflow live keyscan removed locally | PARTIAL; comprehensive TLS/cipher testing absent; new runner/workflows not yet released |
| Browser response headers | Public HTML | Baseline lacks nosniff/referrer policy/HSTS/CSP/frame protection; conservative first two added locally | OPEN pending live validation; CSP/frame/HSTS feasibility still requires embedding/subdomain policy review |
| Error handling | Public pages / server | `WP_DEBUG=false`; five sampled routes no JS pageerrors; limited public error checks | PARTIAL; complete PHP logs and server error disclosure testing UNKNOWN |
| Logging / observability | Host/runtime | Installatron MU integration observed; no alert delivery or ongoing uptime/error monitoring proved | UNKNOWN; monitoring ownership and evidence needed |
| Dependency/plugin security | Seven installed active plugins | Header/version inventory recorded in assessment appendix | PARTIAL inventory only; advisories/support status not exhaustively matched, no “vulnerability-free” claim |
| Update governance | WordPress / host | Installatron disables native automatic updater and its Site Health test, relying on external host management | UNKNOWN actual update schedule/success; Site Health silence is not update proof |
| Deployment integrity | Native theme | Clean exact SHA, runtime allowlist, artifact hashes, separately approved deployed baseline, unchanged plugin/legacy checks in new runner | PARTIAL local tests; production deployment verification pending |
| Concurrency | Production writes | New runner uses shared host flock; both historical deployment workflows now fail closed locally | PARTIAL; real competing-process lock test not performed locally (mocked refusal tested) |
| Rollback / availability | Active-theme swap | Real disposable filesystem rollback passes; production backup permissions observed | PARTIAL; no complete real-host restore drill/RPO/RTO proof; two moves allow brief missing-theme window |
| Managed-content write integrity | Production reconciliation | CLI-only; digest binding, ownership checks, InnoDB23, SERIALIZABLE locking, re-plan/postconditions/revisions/rollback in source | PARTIAL; fresh programme dry-run/idempotence and full race tests required |
| Comment data minimisation | Public News/content | All 40 public entities comments closed, zero comments stored | VERIFIED current data; OPEN future default remains `open` |
| Cookies/external requests | Ordinary anonymous pages | Fresh browser on five routes: no cookies/localStorage/forms/iframes/third-party origins; functional WP emoji session storage | VERIFIED sample only; not blanket proof for every route/authenticated context |
| Business-specific transaction controls | Checkout/payments | No public checkout/payment feature identified in sampled website or scoped native code | N/A to this informational website; external Platform not audited |

## Evidence locations

- `assessments/security-architecture.md`: independent ten-role assessment,
  sanitized plugin inventory and read-only aggregate runtime observations.
- `qa/live-360/security/browser.json`: anonymous five-route browser evidence.
- `qa/live-360/security/state-gate-fixtures.json`: nine real server-PHP synthetic
  gate cases, no WordPress boot or remote file/database mutation.
- `scripts/validate-jsonld-serialization.mjs`: real local PHP-WASM output-context
  regression, not a production exploit test.
- `scripts/validate-theme-release.mjs`: scoped source/archive/swap/rollback tests;
  PHP/WP/HTTP/flock mocked in the disposable filesystem integration.
- `scripts/RELEASE-NATIVE-THEME.md`: execution gates and recovery limitations.

No destructive tests, brute-force attempts, account/session changes, or
production remediation were performed by this security assessment. No P0/P1
was established within the reviewed scope; **absence of an observed issue is
not proof that all application-security requirements pass**. Full security
marks are not supported by this matrix while applicable gaps remain.
