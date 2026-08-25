---
name: farmtree-autonomous-delivery
description: Deliver FarmTree WordPress-native, Block Theme, Gutenberg, plugin, page, content, frontend, UI, motion, responsive, accessibility, SEO, GEO, AEO, performance, bug-fix, test, and release-preparation work end-to-end through a local atomic commit and pre-release review. Use automatically for implementation tasks in the farmtree-demo-vercel repository, while preserving approval gates for push, deploy, publication, activation, database, public, or destructive runtime actions.
---

# FarmTree Autonomous Delivery

Take ordinary FarmTree engineering work from the actual repository state to a
validated local pre-release result without waiting for routine confirmations.

## Load Project Context

1. Read the root `AGENTS.md` map.
2. Read `CURRENT_SPRINT.md`, `SPRINT_REPORT.md` and only the product,
   architecture or release documents relevant to the task.
3. Inspect the branch, working tree and existing implementation before editing.
4. Preserve completed work and user changes. Resolve documentation conflicts in
   favor of the newest explicit instruction, then record the durable decision in
   the appropriate project source.

Keep project-specific facts in repository documentation. Keep this skill
focused on the reusable delivery loop.

## Run The Delivery Loop

1. Translate the approved brief into concrete acceptance checks.
2. Implement locally using existing architecture and ownership boundaries.
3. Validate the changed behavior with the strongest available relevant matrix:
   static checks, syntax/lint, unit or integration tests, responsive browser
   checks, accessibility, content/SEO structure, performance-sensitive assets,
   WordPress block validity and runtime checks when an approved runtime exists.
4. When a check fails, capture the evidence, isolate the smallest cause, repair
   it and rerun the affected checks plus the main suite.
5. Review the final diff independently for regressions, unsupported claims,
   editability, design-lock boundaries, production risk and missing tests.
6. Update current sprint, report, task and history documents when state or
   evidence changed. Do not rewrite historical facts.
7. Create one focused local commit after all available checks pass.
8. Stop at pre-release and report tested, inferred and runtime-pending items
   separately.

## Exercise Local Autonomy

Proceed without approval for repository reads, local edits, local test and
preview servers, screenshots, generated local artifacts covered by `.gitignore`,
and focused local commits requested by the task. Prefer read-only inspection of
external or production state.

Backup, noindex, Coming Soon and production-access blockers prevent deployment
or runtime mutation. They do not prevent local development or local validation.

## Preserve The Production Boundary

Require explicit user approval before:

- pushing or merging commits;
- triggering deployment or remote workflows;
- activating or deactivating WordPress themes or plugins;
- removing Coming Soon or publishing unfinished work;
- changing production content, users, permissions, DNS, host configuration or
  database state;
- deleting or replacing production files, backups or other recoverable state.

Never request, reveal or commit secrets. Never weaken a safeguard merely to
make validation pass.

## Stop And Report

Stop early only when progress requires a real approval-bound action, required
source material is unavailable and cannot be inferred safely, or local evidence
shows an unresolved release risk.

The pre-release report must cover implementation, approved feedback, editable
content, locked design, validation evidence, preview/screenshots, local commit,
runtime work still required, blockers and the next approval-bound action. End
with:

`Implementation is complete and validated to the available environment. Ready for the release step?`
