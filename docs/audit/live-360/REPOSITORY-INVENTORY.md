# Repository inventory

Regenerate with `node scripts/build-repository-inventory.mjs`.

Source HEAD: `a23441ba6f72d120f8bd2aac5ada0adcf3bb8546`. Exact indexed path snapshot: **943 tracked files**, **250 Native runtime allowlist entries**, **0 unmatched classifications**. Pending untracked paths: **0**, listed separately in [machine-readable inventory](REPOSITORY-INVENTORY.json).

| Classification | Files |
|---|---:|
| CONFIG | 16 |
| DOCUMENTATION | 53 |
| EVIDENCE | 72 |
| GENERATED_CONFIG | 1 |
| GENERATED_RUNTIME | 1 |
| LEGACY_ASSET | 183 |
| LEGACY_RUNTIME_REFERENCE | 159 |
| LEGACY_SOURCE | 7 |
| RUNTIME | 249 |
| SEPARATE_PLUGIN_SOURCE | 35 |
| SOURCE_ASSET | 108 |
| SOURCE_DATA | 6 |
| SOURCE_TOOLING | 16 |
| TEST | 37 |
| **Total** | **943** |

## Scope and ownership

Native frontend and Content runtime are included only by the explicit release allowlist. Other FarmTree plugins are separately owned source, not part of this artifact. The legacy theme and root static assets remain historical/rollback references. Engineering scripts, tests, configuration, documentation and QA evidence remain outside the deployable Native artifact. Unknown paths are reported, never silently declared runtime.

- Historical does not mean unused or safe to delete. No files are deleted.
- Ownership and lifecycle are path-based inferences, not a full dependency or content/security audit.
- Ignored dependencies, generated artifacts and current QA evidence are excluded intentionally.
- Pending untracked paths are separate and unclassified until tracked. Regenerate after git add/commit as needed.
- Byte sizes omitted to avoid self-referential generated inventory churn; use release checksums for artifact integrity.

This is an index-path inventory with working-tree allowlist classification, not a clean release snapshot. Zero unmatched categories does not establish zero technical debt. No deletions, production changes or live file-parity claims result from this inventory.
