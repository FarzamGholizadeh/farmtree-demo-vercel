# Repository inventory — capture before first Live360 commit

Machine-readable inventory: [REPOSITORY-INVENTORY.json](REPOSITORY-INVENTORY.json).
Captured from `git ls-files -z` at source HEAD
`6b01611b1d87edd8190b54f405beefddf33ebf27`: **870 tracked files**, each assigned
a category, owner, lifecycle, byte size and Native artifact inclusion flag.
Pending untracked additions are listed separately. This is a working-tree
inventory, not a clean release checksum manifest. Regenerate after the audit
commit when new files become tracked.

| Classification | Files |
|---|---:|
| Runtime | 216 |
| Generated runtime manifest | 1 |
| Source assets excluded from runtime | 104 |
| Source data excluded from runtime | 6 |
| Separate installed plugin source | 33 |
| Legacy rollback runtime reference | 159 |
| Legacy static assets | 183 |
| Legacy static source | 5 |
| Repository configuration | 15 |
| Generated configuration | 1 |
| Documentation | 40 |
| Tracked historical evidence | 72 |
| Tests | 24 |
| Other source tooling | 11 |
| **Total** | **870** |

## Ownership and deployability

- Native frontend: `wordpress/wp-content/themes/farmtree-native`; exact release
  allowlist determines production runtime, not directory membership.
- Content/back-end: `wordpress/wp-content/plugins/farmtree-content`; private
  raw data is excluded, guarded compiled manifest is runtime.
- Optional AI and compatibility: separate FarmTree AI/Core plugins. Installed
  plugin presence is verified; source-to-live file parity was not re-proven.
- Rollback/legacy: `wordpress/wp-content/themes/farmtree` is retained. Root
  `index.html`, static assets and older HTML variants are historical references,
  not the current Native deployable website.
- Engineering/release: `scripts`, `config`, workflows and package/config files.
- QA: tracked `qa` files are mostly historical evidence and seven old browser
  scripts. Current ignored evidence and local deployment scripts are outside
  the tracked inventory; reusable release tooling is being brought into source.
- Project/architecture: root Markdown and `docs`; agent behavior belongs under
  `.agents`, project facts in project documents.

The Native artifact has **217 exact allowed files**. Every other tracked file
is excluded from that artifact. There are zero paths without a category, but
this is **not** zero unknown maintenance debt: non-allowlisted usage and
classification are path-based inferences. Whether each legacy asset/script is
still needed has not been proven individually.

## Preservation and remaining checks

No file was deleted or declared safe to delete. “Historical” does not mean
dead. A safe future cleanup requires reference/dependency analysis, comparison
with rollback requirements, editor/media consumers and restoration evidence.
Tracked `index.html.bak` is an example of historical source still retained even
though ignore rules now cover similarly named backups.

The generated inventory intentionally omits ignored `node_modules`, `.release`
and current QA evidence; those are development/generated/evidence surfaces, not
missing tracked files. This snapshot classifies all tracked paths, but does not
claim every byte has undergone content/security review or that all duplicate
media and obsolete references have been proven.
