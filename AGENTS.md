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
  `farmtree-content`. The root static site is legacy/reference only. The current
  `farmtree` theme is the production and rollback reference and remains
  unchanged unless an explicit emergency hotfix is approved.
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
`https://farmtree.eu/#home` and the existing production `farmtree` theme as the
visual reference while preserving the WordPress-native architecture in
`farmtree-native` and `farmtree-content`.

Migration order is visual baseline first, then progressive WordPress
editability, content models, clean URLs, multilingual behavior and finally
SEO/GEO/AEO. Prefer WordPress core blocks, but do not force them when they
materially damage the approved UI/UX.

## Approval Boundary

`https://farmtree.eu/` is production. `farmtree` is the current public and
rollback-safe theme. `farmtree-native` remains inactive and must not become
public without explicit approval.

Explicit approval is required before pushes, merges, deployments, workflow
runs, theme or plugin activation changes, Coming Soon removal, content
publication, production database changes, or other public/destructive runtime
actions. Backup and noindex blockers gate runtime actions; they do not block
local native development.

Independent GitHub Environment Required Reviewer protection is a deferred
governance enhancement for this private repository, not a local-development
blocker. Do not make the repository public, change ownership or billing, or
purchase/migrate a GitHub plan to obtain it. Until that enhancement becomes
available, production workflows remain manual-only, the repository remains
private, no push automatically deploys WordPress production, Coming Soon
remains active, the rollback theme and documented rollback path remain in
place, and the delivery loop stops at pre-release for explicit user approval
before any manual workflow dispatch.
