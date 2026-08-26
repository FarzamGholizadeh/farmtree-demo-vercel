# Current FarmTree Sprint

## FT-NATIVE-002 - Native Homepage

Status: Local implementation complete; pre-release review

### Objective

Build the Frank-approved Homepage locally in the inactive `farmtree-native`
Block Theme using WordPress core blocks and locked patterns. Keep normal content
editable while preserving FarmTree's approved visual identity and structural
design controls.

### Runtime Dependency

The five approved native-rebuild commits reached origin at `8c22624`, and the
resulting GitHub native validation run passed. FT-NATIVE-001B remains blocked on
approved default-branch exposure of `.github/workflows/deploy-wordpress-native.yml`,
retirement of the superseded separate-staging workflow, required-reviewer
protection for GitHub `Production`, a verified matching recoverable
files/database backup and an explicit public `noindex` signal.

A minimal workflow-only reconciliation branch is prepared locally. The private
repository's current GitHub plan cannot enforce required reviewers; that gate
requires Enterprise-capable ownership and an eligible reviewer. These
safeguards block deployment and real WordPress runtime validation, not local
native development.

### Implemented Homepage

1. Hero / positioning
2. Platform / planning value
3. Technology / how FarmTree works
4. Trust / references / testimonials
5. Proof Stories / Themes
6. FAQ
7. News & Insights
8. Final CTA

The large audience section and Homepage Use Cases are omitted. News is lower,
trust appears before proof stories, and the page is materially shorter than the
legacy concept.

### WordPress Ownership

- Editors can change headings, body copy, media, testimonials, proof stories,
  FAQs and CTA content through core blocks in the Homepage page content.
- The Query block keeps News & Insights dynamic from WordPress posts.
- Theme patterns lock movement/removal at the content-only level while allowing
  editorial fields to remain editable.
- Theme templates and `theme.json` own hierarchy, layout, typography, spacing,
  color tokens and responsive behavior.

### Available Validation

- Repository checks cover required native files, JSON, block markup, homepage
  hierarchy, approved copy constraints, Cover serialization, semantic landmark
  ownership, focus treatment, workflow policy, JavaScript and CSS.
- A read-only local preview renderer composes the native header, Homepage block
  markup, dynamic-post placeholder and footer without WordPress or PHP.
- PHP syntax, Site Editor, Page Editor, Query rendering and frontend behavior in
  real WordPress remain runtime checks.
- GitHub run `32954130310` validated pushed commit `8c22624` successfully.

### Production Boundary

- Do not deploy or trigger the private-runtime workflow.
- Do not activate `farmtree-native` or change plugin activation.
- Do not remove Coming Soon, publish content or modify the production database.
- Do not push or merge without explicit approval.
- Keep the current `farmtree` theme unchanged as the public rollback theme.

### Acceptance Status

- Local Homepage implementation and repository validation: complete.
- Frank-approved structure and content direction: implemented.
- Core-block editability and locked design contract: verified from source.
- Real WordPress editor/frontend and PHP runtime validation: pending.
- Partner evidence links, final theme labels, approved production media and
  final testimonials: pending later content validation before publication.

### Next Approval-Bound Action

Request approval to push the new pre-release evidence commit on the native
branch, push `codex/enable-native-private-runtime`, and open its workflow-only
pull request to `main`. Do not merge or dispatch it yet. Before a private-runtime
run, move or upgrade the private repository to an Enterprise-capable owner, add
an eligible required reviewer to `Production`, verify a matching recoverable
files/database restore point, and expose explicit public `noindex`. Do not
activate the theme during validation.
