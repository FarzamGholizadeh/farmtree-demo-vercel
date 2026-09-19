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
- Current post-launch audit/release state: `docs/audit/live-360/state.json`,
  `docs/audit/live-360/BASELINE.md`
- Historical record: `SPRINT_HISTORY.md`

Read only the sources relevant to the task, starting with the current sprint.
Project facts belong in those documents; reusable delivery behavior belongs in
the skill.

## Working Rules

- Build the WordPress-native system in `farmtree-native` and
  `farmtree-content`. The root static site is legacy/reference only.
  `farmtree-native` is the approved public theme; `farmtree` is the retained
  legacy rollback theme and remains untouched without explicit approval.
- Work autonomously through local implementation, validation, documentation and
  an atomic local commit. Repair failed checks before stopping.
- Prefer WordPress core blocks, locked patterns and existing repository
  conventions. Keep ordinary content editor-managed and structural design
  controlled by the theme.
- Distinguish tested facts, repository inferences and runtime checks still
  pending.

## VISUAL DESIGN LOCK

The currently approved FarmTree frontend is the mandatory visual source of
truth for the WordPress-native rebuild. Architecture may be replaced
completely, but approved UI/UX must not be materially redesigned unless the
user explicitly requests redesign. Frank/Max/user-approved content and IA
changes must be implemented inside the existing approved visual language.

This rule applies to every current and future FarmTree page. Use
`https://farmtree.eu/#home` as the current approved visual reference, with the
legacy `farmtree` theme retained as historical reference. Preserve the architecture in
`farmtree-native` and `farmtree-content`.

Migration order is visual baseline first, then progressive WordPress
editability, content models, clean URLs, multilingual behavior and finally
SEO/GEO/AEO. Prefer WordPress core blocks, but do not force them when they
materially damage the approved UI/UX.

## Approval Boundary

`https://farmtree.eu/` is production. The approved post-launch state is
`farmtree-native` and `farmtree-content` active, English content public,
Coming Soon OFF and `blog_public=1` (indexing enabled). `/nl/` and `/de/`
remain unpublished and FT Bot remains OFF. Verify actual runtime before each
release; never restore historical private-review settings by assumption.

Explicit approval is required before pushes, merges, deployments, workflow
runs, theme or plugin activation changes, Coming Soon removal, content
publication, production database changes, or other public/destructive runtime
actions. Fresh verified backups and preservation of the explicitly approved
visibility state gate runtime actions; they do not block local development.
An explicit bounded release/programme approval applies only within its scope,
not as standing authorization for future tasks.

Independent GitHub Environment Required Reviewer protection is a deferred
governance enhancement for this private repository, not a local-development
blocker. Do not make the repository public, change ownership or billing, or
purchase/migrate a GitHub plan to obtain it. Until that enhancement becomes
available, production workflows remain manual-only, the repository remains
private, no push automatically deploys WordPress production, the approved public
state and rollback path remain intact, and the delivery loop stops at pre-release
unless the current user instruction explicitly authorizes the release step.
Manual workflow dispatch still requires explicit authorization.
