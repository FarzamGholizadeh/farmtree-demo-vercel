# FarmTree Sprint History

| Sprint | Status | Branch | Result |
|---|---|---|---|
| FT-WP-001 | Reference pilot | `wordpress-integration` | Gutenberg hero experiment retained in the production theme for reference only |
| FT-NATIVE-001 | Review | `feat/wordpress-native-rebuild` | Isolated WordPress-native foundation implemented locally |
| FT-NATIVE-001A | Superseded | `feat/wordpress-native-rebuild` | Separate staging path replaced by private production runtime validation |
| FT-NATIVE-001B | Blocked | `feat/wordpress-native-rebuild` | Native source pushed and CI passed; PR #3 exposed the manual-only native workflow on `main` and retired staging; backups and public noindex are verified, Required Reviewer protection is deferred, and production runtime validation is temporarily blocked by orphaned run `32985108587` |
| FT-NATIVE-002 | Pre-release | `feat/wordpress-native-rebuild` | Native Homepage implementation, real local WordPress validation and rendered parity/accessibility/interaction QA complete; release and publication remain approval-gated |
| FT-NATIVE-004A | Release correction | `feat/wordpress-native-rebuild` | Production rollback trace proved WordPress 7.1 `utf8mb3` emoji encoding caused the exact Homepage +35-byte postcondition mismatch; 0.4.4 mirrors core canonicalization and passes focused APPLY/idempotence regression |
