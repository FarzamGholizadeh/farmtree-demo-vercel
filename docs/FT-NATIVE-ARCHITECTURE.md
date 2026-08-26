# FarmTree Native WordPress Architecture

## Architecture Decision

FarmTree will move from a classic static-style theme to an isolated Block Theme.
The approved production theme remains active until private runtime validation
and a controlled cutover sprint are complete.

### Ownership

| System | Responsibility | Migration Decision |
|---|---|---|
| `farmtree` theme | Current production rendering and pilot reference | Retain unchanged until cutover |
| `farmtree-core` | Legacy roadmap-only content-model functions | Retain temporarily; deprecate after consumers are audited |
| `farmtree-ai-assistant` | Optional AI administration and chat | Retain as a separate bounded product capability |
| `farmtree-native` | Templates, parts, patterns and design system | New canonical presentation layer |
| `farmtree-content` | Content types, taxonomies, global settings and editorial policy | New canonical content layer |

`farmtree-content` must not register a model that is still actively owned by
`farmtree-core`. The current Core plugin registers no post types or taxonomies,
so the native plugin can introduce models in FT-NATIVE-003 after a migration
review. Core's roadmap functions remain compatibility-only until then.

## Theme Structure

- `theme.json` owns visual tokens and editor capabilities.
- `templates/` owns page-level composition.
- `parts/` owns controlled global header and footer structure.
- `patterns/` provides approved page-starting compositions.
- WordPress core blocks own standard editorial content.
- Custom blocks require a documented FarmTree-specific interaction that core
  blocks and patterns cannot maintain safely.

Header and footer template parts use content-only locking. Editors can update
labels, destinations and global content without changing the grid, spacing or
component hierarchy. Administrators retain the ability to deliberately unlock
templates when governance requires it.

## Global Content

| Content | Canonical WordPress Source |
|---|---|
| Logo and site identity | Site Logo and Site Title blocks |
| Primary and footer navigation | Navigation blocks and reusable Navigation entities |
| Header and footer composition | Template parts |
| Platform, demo and social URLs | Future `farmtree-content` global settings |
| Company and contact details | Future `farmtree-content` global settings |
| SEO organisation identity | Future SEO owner consuming the same global settings |

The initial template-part fallbacks include approved destinations only to make
the inactive theme reviewable. FT-NATIVE-003 will connect repeated destinations
to one settings source before public activation.

## Content Models

| Model | URL / Visibility | Structure | Taxonomies | Editorial Role |
|---|---|---|---|---|
| Pages | Public WordPress page URL | Locked patterns plus core blocks | None initially | Editor |
| Articles | `/blog/{slug}/` | Standard posts, featured image and excerpt | Categories, tags | Editor |
| Case Studies | `/case-studies/{slug}/` | Block editor, summary, evidence, media and related CTA | Region, topic, customer segment | Editor |
| Customer Segments | `/customer-segments/{slug}/` | Block editor with locked segment pattern | Capability, audience | Editor |
| Team Members | Non-public entries, queried on `/team/` | Name, role, biography, photo and approved links | Team group | Editor |
| Vacancies | `/vacancies/{slug}/` | Block editor, location, type, closing date and application URL | Employment type | Editor |
| FAQs | Non-public reusable entries | Question, answer, placement and order | FAQ group | Editor |
| Partners | Non-public reusable entries | Name, logo, URL, relationship and order | Partner type | Editor |
| Testimonials | Non-public, only approved real content | Quote, person, organisation and relationship | None initially | Administrator |

All custom post types introduced later must set `show_in_rest` to `true`, support
revisions, use the Block Editor where appropriate and define capability mapping.
No empty archive becomes public before approved content and templates exist.

## Homepage Rebuild Direction

FT-NATIVE-002 rebuilds the Homepage locally while FT-NATIVE-001B remains
blocked, using the Frank-approved 25 August 2026 review direction. FT-NATIVE-001B
must pass before real WordPress runtime validation or deployment. The canonical
brief is `docs/FT-NATIVE-002-HOMEPAGE.md`.

The native Homepage will prioritise positioning, planning value, technology,
trust and proof stories. Testimonials belong to the Trust architecture, Use
Cases are removed from the Homepage, News & Insights moves lower, and any
remaining audience segmentation is reduced to the three approved groups.

Editors own approved headings, text, media, proof stories, testimonials, theme
cards, calls to action, FAQs and partner/reference content. The theme continues
to own and lock structural composition and visual controls. Future partner
evidence pages, complete audience subpages and final proof-story detail pages
remain separate content work and do not block the Homepage rebuild.

## Editor Policy

- Authors create drafts and edit assigned editorial content.
- Editors create pages from FarmTree patterns, manage public content and
  schedule publication.
- Administrators manage template parts, global settings and model governance.
- Template structure is locked; content areas remain editable.
- Brand palette, typography, widths, radii and spacing are theme-controlled.
- Custom colour, arbitrary font size and arbitrary spacing controls are disabled.

## Private Runtime And Migration

The active `https://farmtree.eu/` WordPress installation is intentionally hidden
behind Coming Soon during the native rebuild. For FT-NATIVE-001B it is the
private runtime-validation environment, while the current `farmtree` theme
remains active and public rollback-safe.

Before any native private-runtime deployment:

1. verify a recent recoverable backup for WordPress files and database;
2. keep Coming Soon active;
3. verify explicit public `noindex` behavior;
4. verify WordPress search visibility is disabled for indexing;
5. verify the active theme remains `farmtree`;
6. deploy only inactive `farmtree-native` and `farmtree-content` code;
7. avoid database migrations, theme activation and public page publication.

Runtime validation should use WordPress preview and editor mechanisms while
Coming Soon remains active. If future content migration requires destructive or
irreversible database changes, create a separate approval gate and backup-backed
migration plan before proceeding.

## Cutover And Rollback

1. Complete native English templates and models.
2. Validate approved content in the private runtime.
3. Validate editor workflows, URLs, accessibility and responsive layouts.
4. Back up production files and database.
5. Deploy inactive native code.
6. Activate only after explicit approval.
7. Verify pages, forms, navigation, SEO and monitoring.

Rollback reactivates the existing `farmtree` theme and restores the pre-cutover
database backup if content-model migration affected production. The existing
theme is not deleted during the stabilisation period.
