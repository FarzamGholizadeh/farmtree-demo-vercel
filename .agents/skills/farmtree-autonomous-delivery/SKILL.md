---
name: farmtree-autonomous-delivery
description: Deliver FarmTree WordPress-native, Block Theme, Gutenberg, plugin, page, content, frontend, UI, motion, responsive, accessibility, SEO, GEO, AEO, performance, bug-fix, test, and release-preparation work end-to-end through a local atomic commit and pre-release review. Use automatically for implementation tasks in the farmtree-demo-vercel repository, while preserving approval gates for push, deploy, publication, activation, database, public, or destructive runtime actions.
---

# FarmTree Autonomous Delivery

For an explicitly requested live, multidisciplinary audit/remediation programme,
use [FARMTREE LIVE 360 LOOP](references/live-360-loop.md). Do not run the broad
programme for ordinary bounded fixes. The reference adds evidence/score and
re-audit requirements; it does not grant standing production authorization.

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

## VISUAL DESIGN LOCK

The currently approved FarmTree frontend is the mandatory visual source of
truth for the WordPress-native rebuild. Architecture may be replaced
completely, but approved UI/UX must not be materially redesigned unless the
user explicitly requests redesign. Frank/Max/user-approved content and IA
changes must be implemented inside the existing approved visual language.

Apply this lock to every current and future FarmTree page. Use the approved
frontend at `https://farmtree.eu/#home` and the documented approved theme
baseline for visual composition, layout, typography, color, spacing, components,
responsive behavior and motion. Do not reinterpret, modernize or replace that
approved visual language without an explicit redesign request. Use the relevant
approved brief for content and information architecture, and keep technical
ownership in the WordPress-native Block Theme, Gutenberg patterns/templates
and `farmtree-content`. Visual parity must not be achieved by returning to the
legacy static SPA architecture.

For migration work, establish and verify the approved visual baseline before
progressively replacing hard-coded content with WordPress-managed content.
Preserve rendered markup and behavior section-by-section, keep design controls
in the theme, expose only the editorial fields people need, and revalidate
parity after each conversion. Prefer core blocks, but do not force them when
they materially damage approved UI/UX.

## Run The Delivery Loop

1. Translate the approved brief into concrete acceptance checks.
2. Implement locally using existing architecture and ownership boundaries.
3. Validate the changed behavior with the strongest available relevant matrix:
   static checks, syntax/lint, unit or integration tests, responsive browser
   checks, accessibility, content/SEO structure, performance-sensitive assets,
   WordPress block validity and runtime checks when an approved runtime exists.
4. When a check fails, reproduce it when possible, capture the evidence,
   distinguish a repository cause from an environment or platform cause,
   implement the narrowest maintainable fix and rerun the affected checks plus
   the main suite. Do not make speculative code changes for an external issue.
5. Review the final diff independently for unrelated changes, regressions,
   unsupported claims, unnecessary technical debt, WordPress-native ownership,
   editability, design-lock boundaries, responsive and accessibility risk,
   production impact, rollback preservation and missing tests.
6. Update current sprint, report, task and history documents when state or
   evidence changed. Do not rewrite historical facts.
7. Create one focused local commit after all available checks pass.
8. Stop at pre-release and report tested, inferred and runtime-pending items
   separately.

Choose validation for the changed surface rather than running irrelevant checks.
For responsive interface work, inspect 320, 375, 390, 430, 768, 1024, 1280,
1440 and 1920 pixel widths when browser tooling is available; otherwise record
that visual validation remains pending.

## Exercise Local Autonomy

Proceed without approval for repository reads, local edits, local test and
preview servers, screenshots, generated local artifacts covered by `.gitignore`,
and focused local commits requested by the task. Prefer read-only inspection of
external or production state.

Missing backups, production access or mismatched approved visibility safeguards
prevent deployment or runtime mutation. They do not prevent local development
or local validation. Preserve the current explicitly approved public/private
state; do not restore historical noindex or Coming Soon settings by assumption.

Independent GitHub Environment Required Reviewer protection may remain a
deferred governance enhancement when the private repository's current plan
cannot provide it. Do not recommend making the repository public, moving it,
changing ownership or billing, or purchasing/migrating a GitHub plan as a
routine development prerequisite. Preserve the compensating release boundary:
the repository stays private, production workflows stay `workflow_dispatch`
only, no push automatically deploys WordPress production, the approved visibility
state and documented rollback path stay in place, and the loop stops at
pre-release unless the current user instruction explicitly authorizes that
bounded release. Manual dispatch still requires explicit authorization.
Never weaken existing workflow protections.

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

Complete unaffected work and try safe alternative diagnostics before stopping.
Stop only when progress requires a real approval-bound action or unavailable
credential/system, a material business decision cannot be inferred safely, a
destructive action is required, the same failure persists after multiple
evidence-based attempts without new evidence, or unavailable validation would
make further work speculative.

The concise pre-release report must cover:

1. what changed;
2. what is editable in WordPress and what design remains locked;
3. the visual and functional result;
4. tests passed;
5. tests or runtime validation still pending;
6. screenshots or preview location;
7. the local commit hash;
8. production impact;
9. rollback method;
10. any real limitation or blocker and the next approval-bound action.

End with:

`Implementation is complete and validated to the available environment. Ready for the release step?`
