# Independent security, privacy and architecture assessments

Date: 2026-09-19. Read-only assessment; no production files, settings or database rows changed. Each role below examined its own controls before consolidation. Findings are technical observations, not certification, a penetration-test assurance, or legal advice.

## Evidence and boundaries

- Production HTTPS HEAD: 200; HTTP redirects 301 to HTTPS. HTTPS response exposes PHP/8.3.31 and Apache; no HSTS, X-Content-Type-Options, Referrer-Policy, CSP, Permissions-Policy or X-Frame-Options observed.
- Independent SSH SELECT: 23 tables use InnoDB; public content counts are 17 Pages, nine Posts, ten Customer Segments, four Proof Stories. All have comments closed; seven draft Pages also closed. Comment table count is zero. `users_can_register=0`; `default_comment_status=open`; `extendify_insights_stop=1`; `seedprod_allow_usage_tracking` empty.
- `wp-config.php` mode 600; off-webroot recovery directory mode 700. These are permission observations, not a successful restore test.
- Anonymous fresh-browser evidence and reproducible probe: `qa/live-360/security/probe.cjs`, `qa/live-360/security/browser.json`. Five ordinary routes, no form submission or authentication. Only cookie names/attributes are recorded, never values.
- Initial guessed `/privacy-policy/` returned proper 404; actual repository/legal route is `/privacy/`. This is not an unintended-route finding.
- Reviewed native plugin bootstrap, CLI command, transactional reconciler, artifact builder, workflow YAML and existing local deployment scripts. This is not exhaustive line-by-line review of every third-party plugin.

## 1. WordPress Architect

**Verified source:** Content plugin owns two public CPTs and compatibility redirects; theme owns Block templates, parts, patterns and presentation. CPTs support revisions and REST editor operations. Reconciler is included only under WP-CLI. No Content activation/deactivation hook persists data.

**Finding ARCH-01, P2:** `AGENTS.md` and `docs/FT-NATIVE-ARCHITECTURE.md` describe a private/inactive Native runtime and legacy active theme. Those statements conflict with current post-launch task intent and may steer a maintainer toward unsafe release assumptions. Add a clearly dated current-state section and label old migration gates historical; preserve genuine approval boundaries.

**Pending:** editor round-trip review and current production reconciliation idempotence. Source safety design alone is not proof of fresh runtime idempotence.

## 2. Back-End Engineer

**Verified source:** HTTP callers cannot load the Content CLI/reconciler through normal plugin bootstrap. CLI defaults to dry-run; explicit apply binds plan/source/backup digests and public/private scope confirmations. Existing legacy proof redirects use fixed targets and `wp_safe_redirect`. AI REST handler checks assistant availability before provider processing; administrator actions check capability and nonce.

**Assessment:** no proven critical/high FarmTree-owned backend flaw identified in inspected paths. No adversarial requests were made. Anonymous WP nonces are not user authentication: optional AI public abuse controls need re-audit before any enablement. FT Bot remains out of scope for activation.

**Pending:** full third-party REST inventory, all upload permissions, runtime PHP error log review and third-party vulnerability matching.

## 3. Database Engineer

**Verified production:** all 23 tables InnoDB; zero comments; published entities have closed comments. **Verified source:** reconciler requires transactional tables, SERIALIZABLE production isolation, current-read locks/cache refresh, exact re-plan digest, revisions, idempotence postcondition, public-state hash preservation, and rollback plus file/cache cleanup. Stable managed metadata supports ownership rather than title-only matching.

**Finding DATA-01, P2:** `default_comment_status=open` means newly authored News posts may unintentionally reopen a personal-data workflow even though all nine current posts are closed. Recommend source-controlled closed default for new FarmTree public Posts with an explicit migration gate if modifying an option; do not overwrite unrelated existing content.

**Pending:** duplicate managed-key queries, orphan analysis, table sizes/autoload overhead, charset/index review, fresh dry-run. These are not marked PASS.

## 4. Web Security Engineer

**Finding SEC-01, P2:** defense-in-depth response headers absent on production homepage. No demonstrated exploit. Minimal candidate: scoped `nosniff`, conservative referrer policy and same-origin frame protection; inventory embeds/admin needs before CSP. HSTS needs domain/subdomain readiness evidence, not blind `includeSubDomains`/preload. Version exposure is informational, not proof of vulnerability.

**Verified:** HTTPS redirect, restrictive config/backup permissions. No exposed secret observed. **Unknown:** authenticated session flags, MFA/admin policy, Temporary Login grant expiry, plugin patch/support state, debug/log exposure, full ASVS coverage. Installed `temporary-login-without-password` alone is not a vulnerability; do not remove accounts or grants without inventory and authority.

## 5. Privacy Engineer

**Verified production subset:** no cookies, localStorage, iframes, forms or third-party request origins on sampled fresh anonymous routes; WordPress stores `wpEmojiSettingsSupports` sessionStorage. No JS errors. Settings independently confirm Extendify opt-out and empty SeedProd tracking consent. Public registration disabled; nine News comments closed and zero stored comments.

**Source policy comparison:** policy describes mailto-only contact, disabled AI, self-hosted resources, administrative authentication, technical hosting logs and session presentation storage. Observed subset supports those runtime claims. WordPress emoji session storage is functional feature-detection and fits presentation storage; optional clarification is not a material mismatch. Actual retention periods, email provider practices, hosting log deletion and backup lifecycle remain organisational evidence requirements. Do not invent periods or claim legal completeness.

**Finding DATA-01 applies** to future comments. Browser subset does not establish absence of tracking on every route or every signed-in context.

## 6. DevOps Engineer

**Finding OPS-01, P2:** active post-launch deployment scripts (`qa/tools/nav-deploy.sh`, backup scripts and other recent release helpers) are ignored/untracked. `git ls-files qa/tools` returns only seven older browser scripts. A fresh checkout cannot reproduce the mechanism used for the latest runtime deployment. Hard-coded SHA, checksum, backup path and counts increase copy/paste error risk.

**Finding OPS-02, P2:** `.github/workflows/deploy-wordpress.yml` remains manually dispatchable and can replace rollback `farmtree` and legacy plugins using `rsync --delete`, without backup/checksum gates. Both legacy/native workflows trust live `ssh-keyscan` output rather than a pinned independently verified key. Native workflow is private-runtime-only and safely refuses current public state, but its concurrency group differs from legacy; local release scripts have no shared lock.

**Minimal remedy:** disable/archive obsolete legacy deployment; retain rollback theme. Track one parameterised public theme release tool with exact clean SHA/artifact allowlist, expected-current checksums, shared remote lock, off-webroot backup verification, rollback trap and post-swap checks. Pin host identity. Do not relax private-only gates to silently target public state.

## 7. Site Reliability Engineer

**Verified source:** latest local nav deployment uses same-filesystem directory moves, pre-theme rollback directory, trap on failure/signals, full checksum validation and unchanged rollback/plugin checks. Production backup directory permissions limit access.

**Finding OPS-03, P2 / evidence gap:** no fresh restore drill or continuing uptime/error-alert evidence in this assessment. Backup readability/checksum cannot demonstrate full disaster recovery. Directory swap is two moves, with a brief missing-theme interval; monitoring, recovery timing and safe lock ownership should be explicit. Do not claim zero downtime or proven RPO/RTO.

## 8. Solution Architect

**Assessment:** WordPress-native editorial ownership and bounded CLI migration fit this site; replacement platform is not justified. Build uses a runtime allowlist, excludes source JSON and requires release inputs to match HEAD, including hash-object checks. This is stronger than copying plugin directories wholesale.

**Finding OPS-01/ARCH-01:** release operation and documentation are less reproducible than the artifact. Prioritise one checked-in public release path and current ownership map over broad refactoring. Site-wide globals and bespoke reconciler need careful regression coverage as content grows.

## 9. CTO

**Assessment:** strongest controls are exact release artifacts and conservative content ownership/transaction gates. Main fragility is operational knowledge in ignored, one-off deployment scripts and historical instructions presented as current truth. Four-thousand-line reconciler complexity is a review cost, not independently a defect; avoid risky cosmetic decomposition during audit.

**Acceptance:** no 10/10 security/privacy/operations rating yet. Unknown third-party/admin controls, disaster recovery and production idempotence remain explicit. External legal/security governance evidence cannot be replaced by engineering claims.

## 10. Release Engineer

**Verified source:** builder tests tracked HEAD bytes for classified runtime/exclusions, builds staged artifact, supplies checksums. Recent deployment script verifies backup/archive/checksums and only swaps Native theme, preserving plugin/legacy rollback hashes.

**Finding OPS-01/OPS-02:** reproducible artifact does not equal reproducible deployment; release mechanism must be tracked and locked. A reusable release runner should refuse dirty source, wrong branch/SHA, unrelated artifact delta, symlinks, unverified prior release, missing backup and database writes for theme-only releases. Run checksum and public-state read-only comparisons after deployment. Keep semantic browser QA separate from successful file transfer.

## Consolidated recommended order

1. Track and test public release/rollback mechanism; disable obsolete legacy path and pin SSH identity (OPS-01/02).
2. Correct current-state documentation without weakening approval gates (ARCH-01).
3. Add conservative tested response-header hardening after resource/embedding review (SEC-01).
4. Close future comment workflow safely with source evidence and relevant approval (DATA-01).
5. Fill runtime/organisational unknowns: restore exercise, monitoring/alerts, admin/session controls, third-party vulnerability status, data retention. Do not score unknown as PASS.

No P0 or P1 established by this bounded independent assessment. This does not certify that none exists. No remediation or production mutation performed by this reviewer.

## Follow-up: first theme batch independent review and plugin inventory

The preceding assessment is a pre-remediation snapshot. Subsequent delegated local work added tracked guarded theme deployment tooling and retired legacy/private write workflows; tests exercise disposable filesystem swaps and rollback. Actual server PHP passed the exact read-only public-state gate and nine synthetic gate cases without remote file writes. See `scripts/RELEASE-NATIVE-THEME.md` for remaining deployment/restore caveats.

First theme-batch review: metadata attributes use `esc_attr`/`esc_url`; headers add only nosniff/referrer-policy, preserve existing case-insensitive header names and do not mutate robots or database state. The pre-existing JSON-LD raw-script serialization lacked hexadecimal HTML delimiter escaping. Local follow-up adds JSON_HEX_TAG/AMP/APOS/QUOT; `scripts/validate-jsonld-serialization.mjs` executes actual PHP-WASM serialization and verifies hostile script-terminator text remains data with exact Unicode round-trip. This is output-context hardening; no lower-privilege production exploit was established.

Installed and active production plugin headers, read without WordPress boot (2026-09-19):

| Plugin | Version | Observed activation |
|---|---|---|
| AI Provider for OpenAI | 1.1.0 | Active |
| SeedProd Coming Soon / Website Builder | 6.20.9 | Active; Coming Soon setting OFF |
| FarmTree AI Assistant | 0.1.0 | Active plugin; assistant feature disabled |
| FarmTree Content | 0.4.8 | Active |
| FarmTree Core | 0.1.0 | Active |
| Temporary Login Without Password | 1.9.9 | Active |
| Site Assistant (`wp_kickstarter`) | 1.0.0 | Active |
| WordPress automation by Installatron | No Version header | MU-plugin |

Installatron source explicitly disables WordPress's native automatic updater and removes its automatic-update Site Health check because updates/backups are externally managed. The actual host schedule, recent success and restore guarantees remain UNKNOWN; absence of a Site Health warning cannot establish update health.

Additional aggregate-only authentication checks: three registered accounts; two usermeta records named `session_tokens` (not a count of active sessions); one Temporary Login record with a positive numeric expiry already elapsed and no zero/empty expiry. Plugin source uses numeric expiration comparisons. No tokens, names, emails or user-level records were output. `WP_DEBUG` explicitly resolves to JSON `false` via configuration parsing. No accounts/grants/sessions were changed.

Remaining security-matrix limits: installed version does not establish current vulnerability status; third-party advisories/support status are not comprehensively matched. MFA/password policy and host control-panel authentication are unverified; no authenticated cookie capture, brute-force/CSRF exploit testing, full upload/path traversal review, full dependency audit, complete PHP error-log review or restoration drill was performed. The elapsed temporary grant is evidence of expiry configuration, not a complete session revocation proof. Do not label these controls PASS or award blanket security certification.
