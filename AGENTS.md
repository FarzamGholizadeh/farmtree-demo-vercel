# FarmTree Agent Map

This repository uses `$farmtree-autonomous-delivery` automatically for normal
FarmTree implementation, testing, bug-fix and release-preparation work.

## Source Map

- Current work and blockers: `CURRENT_SPRINT.md`, `SPRINT_REPORT.md`, `TASKS.md`
- Product and architecture: `PROJECT_CONTEXT.md`, `DECISIONS.md`, `ROADMAP.md`
- Native WordPress ownership: `docs/FT-NATIVE-ARCHITECTURE.md`
- Current homepage brief: `docs/FT-NATIVE-002-HOMEPAGE.md`
- Production safeguards: `RELEASE-CHECKLIST.md`,
  `docs/FT-NATIVE-PRIVATE-RUNTIME.md`
- Historical record: `SPRINT_HISTORY.md`

Read only the sources relevant to the task, starting with the current sprint.
Project facts belong in those documents; reusable delivery behavior belongs in
the skill.

## Working Rules

- Build the WordPress-native system in `farmtree-native` and
  `farmtree-content`. Treat the root static site and the current `farmtree`
  theme as legacy or production references unless the task explicitly says
  otherwise.
- Work autonomously through local implementation, validation, documentation and
  an atomic local commit. Repair failed checks before stopping.
- Prefer WordPress core blocks, locked patterns and existing repository
  conventions. Keep ordinary content editor-managed and structural design
  controlled by the theme.
- Distinguish tested facts, repository inferences and runtime checks still
  pending.

## Approval Boundary

Explicit approval is required before pushes, merges, deployments, workflow
runs, theme or plugin activation changes, Coming Soon removal, content
publication, production database changes, or other public/destructive runtime
actions. Backup and noindex blockers gate runtime actions; they do not block
local native development.
