# FarmTree Native

Inactive WordPress Block Theme for the FarmTree website rebuild.

## Status

- Development only.
- Not approved for production activation.
- Does not replace or modify the current `farmtree` theme.
- Does not depend on Elementor or a JavaScript router.

## Foundation

- `theme.json` controls the palette, typography, spacing, widths and editor
  capabilities.
- `templates/` provides native page, post, archive and error foundations.
- `parts/` provides content-only locked global header and footer structures.
- `patterns/` provides approved core-block page sections with content-only
  locking.
- `farmtree-content` owns the private-first customer-segment model and future
  global settings.

## Homepage

FT-NATIVE-002 provides the complete native Homepage as the **FarmTree
Homepage** block pattern. Create or edit the WordPress page assigned as the
static front page, insert the pattern once, and manage its content in the normal
Page Editor. The `front-page.html` template renders that page content while the
pattern locks layout and design structure.

Editors can update copy, links, media, partner references, testimonials, proof
themes, FAQs and CTA content. Posts shown in News & Insights are managed as
normal WordPress posts. Administrators retain ownership of templates, pattern
structure and `theme.json` design controls.

Customer segments use controlled clean URLs and the dedicated native single
template. Their source-backed bootstrap entries remain private; editorial
insights remain drafts until human review.
