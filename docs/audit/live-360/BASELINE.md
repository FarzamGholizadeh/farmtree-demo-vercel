# FarmTree Live 360 baseline

Observed 2026-09-19; programme in progress, not a certification or final sign-off.

| Item | Fresh evidence |
|---|---|
| Production | https://farmtree.eu/ |
| Branch | feat/wordpress-native-rebuild |
| Local and remote SHA | 6b01611b1d87edd8190b54f405beefddf33ebf27 |
| Worktree at programme entry | Clean |
| Deployed runtime | All 217 hashes match the approved navigation release manifest |
| WordPress | 7.1.1 (`wp core version`, no plugin bootstrap) |
| PHP CLI / public response | 8.3.31 |
| MariaDB | 10.6.20-MariaDB-cll-lve (`SELECT VERSION()`) |
| Theme/template | farmtree-native |
| Homepage | ID439, home, publish; front page 439, show_on_front=page |
| blog_public | 1 |
| Coming Soon | false in seedprod_settings |
| /nl/ and /de/ | No matching Page records in fresh query; HTTP checks pending this programme |
| Permalinks | /%postname%/ |
| Homepage HTTP | HTTPS HTTP/2 200 |
| Public response | Apache; PHP version exposed; no X-Robots-Tag observed |
| Security headers | HSTS, CSP, frame protection, nosniff, referrer policy not observed in HEAD |

Read-only SSH queries use the actual configured `o9ta_` prefix. No production
write, activation, cache flush or content reconciliation was performed for this
baseline. Raw credentials/configuration are never copied into audit reports.

Production artifact verification used the off-webroot navigation-release
`target.sha256`; previous backup is preserved. Subsequent releases require fresh
backup/checksum evidence. A historical backup is not a standing release gate.

Current plugin versions/activation, Bot state, robots/sitemap/canonical, complete
route census, console/visual checks and ownership/idempotence are independently
being assessed. Previous release checks are context, not a replacement for the
requested current programme. See state.json and the independent assessments.

## Assessment boundaries

Thirty requested perspectives are independent AI role assessments, grouped across
three parallel reviewers before consolidation. They are not thirty human experts.
Human comprehension studies, assistive-technology user testing, legal approval,
organisation-wide management systems and field CWV cannot be invented from code
inspection. Unknown evidence is not PASS and is not silently excluded from score.

## Primary standards references checked

- [ISO/IEC/IEEE 12207:2026](https://www.iso.org/standard/90219.html): lifecycle framework.
- [ISO 9241-210:2019](https://www.iso.org/standard/77520.html): human-centred design.
- [ISO/IEC 27701:2025](https://www.iso.org/standard/27701): privacy management.
- [WCAG 2.2 / ISO 40500:2025 announcement](https://www.w3.org/news/2025/web-content-accessibility-guidelines-wcag-2-2-approved-as-iso-iec-international-standard/).
- [OWASP ASVS stable 5.0.0](https://owasp.org/projects/asvs).
- [ISO/IEC/IEEE 29119-1:2022](https://www.iso.org/obp/ui?_escaped_fragment_=iso%3Astd%3Aiso-iec-ieee%3A29119%3A-1%3Aed-2%3Av1%3Aen).

These establish reference identity, not full normative access or compliance.
Remaining requested editions and applicable technical mappings are pending.
