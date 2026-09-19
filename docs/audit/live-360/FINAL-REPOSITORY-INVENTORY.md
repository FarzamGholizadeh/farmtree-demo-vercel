# Repository inventory handoff

Programme: **IN_PROGRESS**. HEAD/deployed66134c6; pending handoff additions are
not part of that release. This is not a clean-worktree or zero-untracked claim.

REPOSITORY-INVENTORY.json was refreshed after staging the accessibility follow-up
and handoff additions:957 indexed files,250 runtime allowlist entries,0 unmatched
classifications and0 pending untracked paths at capture. Its sourceHead records
66134c6 because classification precedes the candidate commit. This is not an
immutable66134c6 content manifest or a clean-worktree claim. The earlier ce4cdcc
preparation snapshot contained943 paths and recorded sourceHead a23441b.

The audited ce4cdcc/66134c6 artifact contains250 runtime files and114 deliberately
excluded source paths,55,905,369 bytes. The runner-only correction leaves Native
runtime bytes identical. These release classifications differ from whole-repo
categories; excluded114 is not the count of all non-runtime repository files.

| Ownership class | Boundary |
|---|---|
| Native theme and Content plugin | Explicit release allowlist, no broad webroot copy |
| Generated assets/runtime | Deterministic source/evidence and release checks required |
| Other FarmTree plugins | Separately owned source, not implicitly deployed by Native release |
| Legacy theme/root static site | Historical/rollback references; not permission to delete |
| Scripts/tests/config/docs/source data | Non-runtime engineering material excluded from public artifact |
| Ignored QA/dependencies/release output | Outside indexed inventory; evidence availability and retention handled separately |

Later additions require a fresh index snapshot. The inventory's pendingUntracked0
describes only its capture, not a general promise about future repository state.
Regenerate intentionally with `node scripts/build-repository-inventory.mjs`;
No deletion or production mutation results from inventory generation.

See FINAL-EVIDENCE-INDEX.md for artifact/recovery checksums and evidence
portability limitations. A path classification is not a dependency audit,
unused-code proof, security certificate or production parity check.
