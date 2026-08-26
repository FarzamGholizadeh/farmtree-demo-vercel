# FarmTree Sprint History

| Sprint | Status | Branch | Result |
|---|---|---|---|
| FT-WP-001 | Reference pilot | `wordpress-integration` | Gutenberg hero experiment retained in the production theme for reference only |
| FT-NATIVE-001 | Review | `feat/wordpress-native-rebuild` | Isolated WordPress-native foundation implemented locally |
| FT-NATIVE-001A | Superseded | `feat/wordpress-native-rebuild` | Separate staging path replaced by private production runtime validation |
| FT-NATIVE-001B | Blocked | `feat/wordpress-native-rebuild` | Native private-runtime workflow prepared locally; runtime validation blocked on default-branch workflow reconciliation (including retirement of the superseded staging path), environment reviewer protection, backup and public noindex verification |
| FT-NATIVE-002 | Pre-release | `feat/wordpress-native-rebuild` | Native Homepage implemented and validated locally; real WordPress runtime review remains gated by FT-NATIVE-001B |
