# Fixed acceptance and scoring contract

Established before remediation scoring on 2026-09-19. This is an internal
evidence-coverage rubric, not certification. It supplements, never replaces,
the two user briefs. Every listed group requires all constituent checks;
passing a sample does not mean untested routes pass. Detailed matrices retain
individual findings/unknowns. Do not lower thresholds after seeing results.

Status: PASS (appropriate current evidence), FAIL (reproduced defect), UNKNOWN
(not tested/insufficient evidence), MANUAL-VERIFY (human/organisational evidence
needed), N/A (specific reason). UNKNOWN and MANUAL-VERIFY earn zero verified
credit. Category credit = weight × passed applicable groups / applicable groups.
Report coverage alongside score; never interpret unknown as poor observed UX.
N/A requires reviewed rationale and cannot be used merely to reach 100.

| Category / weight | Equally weighted acceptance groups |
|---|---|
| UI 8 | All requested widths and public templates: no clipping/overflow; typography/grid/spacing/card/button consistency; approved imagery/crops; CTA/header/footer consistency; hover/focus/loading states; final visual critique with no unresolved controllable defects |
| UX 8 | All ten persona journeys; navigation/platform/proof/contact journeys; clear actions/no dead ends; accessible mobile interactions; information scent/IA; actual first-time comprehension/user evidence (not simulated human study) |
| Accessibility 10 | Per-criterion WCAG2.2 AA matrix; automated all-route axe; keyboard/focus/skip/menu/globe; names/landmarks/headings/alt/link purpose; contrast/non-colour cues/targets; motion/clones/carousels; 200/400% zoom/reflow; assistive-technology manual semantics checks |
| Front-end 8 | Semantic DOM/no duplicateIDs; maintainable cascade and justified overrides; JS listeners/observers/lifecycle; no layout thrash/leaks in tested journeys; CSS/JS budget and dependencies; no-JS and reduced-motion fallbacks; approved interaction regressions |
| WordPress/back-end 10 | Theme/plugin/CPT/taxonomy ownership; editor-safe blocks/revisions; write-path auth/validation/sanitisation; managed identity/conflict/idempotence; media/rewrites/publication; lifecycle side effects; database/index/autoload/transaction/error review |
| Security 10 | Scoped ASVS applicability/matrix; authentication/session/admin/TemporaryLogin controls; CSRF/XSS/SQL/command/path/SSRF/upload controls; REST/XMLRPC exposure; secure headers/cookies/error disclosure; dependency/plugin/version assessment; private artifacts/secrets/permissions/backup protection; no known in-scope critical/high vulnerabilities |
| Privacy 5 | Actual network/cookie/storage inventory; published policy matches data flows; telemetry/Bot/fonts/external services; account/contact/log/backup processing map; retention/deletion/processor evidence or explicit unresolved human gaps |
| Performance 10 | Multi-run representative lab LCP<=2500ms/CLS<=0.1; interaction latency<=200ms measured where possible; field CWV or explicitly unknown; image sizes/formats/priority/loading; fonts/cache/compression/TTFB; render-blocking/task/DOM/CSS/JS review |
| QA/reliability 8 | Static/unit/integration coverage; all-route/link/404 coverage; real browser/visual/responsive coverage; accessibility/manual evidence; all historical regression classes; false-positive diagnosis and trustworthy assertions; production smoke and rollback rehearsal |
| DevOps/SRE 7 | Checkout-reproducible artifact/deploy; exact-SHA provenance; concurrency/locks/path/SSH safety; verified fresh backups/rollback; observable health/errors; host/cron/disaster recovery responsibility; current docs/repository inventory/ownership and no uncertain deletions |
| Technical SEO 6 | All route statuses/redirects/domainHTTPS; titles/descriptions/H1/headings; canonicals/robots/sitemap/indexability; internal linking/orphans/404; truthful structured data/author/dates; OG/images/social metadata |
| GEO/AEO/AI 5 | Entity/platform definition consistency; direct answers/definitions/semantic relationships; factual proof/methodology/source context; useful FAQ and machine-readable truth; SSR and no unsupported ranking gimmicks |
| Copy/brand/conversion 5 | All public English spelling/grammar/punctuation; natural language/terminology/CTA consistency; scientific claims and figure provenance; persona value/positioning/trust; no unsupported legal/commercial claims; approved vocabulary and final brand critique |

The supplemental 15-category 10/10 brief remains separately traceable: Copy and
Brand are reported separately but share the 5-point weighted category; CTO
Maintainability spans Front-end, WordPress and DevOps. Never count it twice.

## Release gates

Verified production issue -> minimal source fix -> regression -> local validation
-> reviewed focused commit/push -> exact audited artifact -> fresh verified backup
-> controlled scoped release -> real production retest -> update evidence/risk.
Documentation/test-only releases need no runtime swap when artifact bytes match.
Content writes require an owned, reviewed dry-run/digest and approval scope.
Do not turn indexing off, enable Coming Soon, publish locales or enable Bot.

## Completion

All applicable controllable technical checks PASS; P0/P1 and known owned blockers
zero; all brief exit gates verified. Missing human/legal/field evidence remains
visible and prevents an unqualified 100/100 or blanket standards claim. Produce
the requested final report package even when a true external blocker prevents
full assurance, clearly marked incomplete rather than falsifying completion.
