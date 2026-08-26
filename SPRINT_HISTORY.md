# FarmTree Sprint History

| Sprint | Status | Branch | Result |
|---|---|---|---|
| FT-WP-001 | Reference pilot | `wordpress-integration` | Gutenberg hero experiment retained in the production theme for reference only |
| FT-NATIVE-001 | Review | `feat/wordpress-native-rebuild` | Isolated WordPress-native foundation implemented locally |
| FT-NATIVE-001A | Superseded | `feat/wordpress-native-rebuild` | Separate staging path replaced by private production runtime validation |
| FT-NATIVE-001B | Blocked | `feat/wordpress-native-rebuild` | Native source pushed and CI passed; PR #3 exposed the manual-only native workflow on `main` and retired staging; runtime remains blocked on Enterprise-capable reviewer protection, matching backup evidence and public noindex |
| FT-NATIVE-002 | Pre-release | `feat/wordpress-native-rebuild` | Native Homepage implemented and validated locally; real WordPress runtime review remains gated by FT-NATIVE-001B |
