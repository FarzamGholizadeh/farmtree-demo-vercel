# FT-NATIVE-002 Sprint Report

Status: Local implementation complete; runtime validation pending

## Homepage Structure

The native Homepage now follows Hero, Platform, Technology, Trust, Proof
Stories, FAQ, News & Insights and Final CTA. It is implemented in
`farmtree-native` as core block markup and a content-only locked pattern.

## Frank Feedback Implemented

- Reframed Platform copy around project staff creating investment plans,
  comparing options and understanding future scenarios.
- Reframed Technology around planning, monitoring and reporting with climate,
  soil and species data connected into a science-based, multi-KPI business plan.
- Moved Trust above proof content and integrated testimonial/reference material.
- Replaced Homepage Use Cases with prominent working proof themes: Carbon, Farm
  Value Modelling, Cocoa Scenario Planning and Monitoring, and Water and
  Landscape Resilience Monitoring.
- Removed the large audience section, moved News lower, retained FAQ and CTA,
  and shortened the overall page.

## Editorial And Design Ownership

Editors can manage normal headings, copy, media, testimonials, proof content,
FAQs and CTA fields. WordPress posts supply News through a Query block. Pattern
content locking prevents structural movement/removal, while the theme owns
section order, layout, typography, spacing, brand tokens and responsive rules.

## Local Evidence

- Native foundation validation checks required files, JSON, valid block
  structure, Homepage order, prohibited legacy sections, editable content and
  the content-only pattern lock.
- Final source review aligned the Hero Cover attributes with Gutenberg save
  markup, removed duplicate header/footer landmark wrappers and added a
  two-tone focus indicator that remains visible on light and dark sections.
- Regression validation now guards Cover dim/alt serialization, semantic
  template-part ownership and the focus treatment.
- Workflow validation confirms that private deployment remains manual,
  inactive-code-only and guarded by backup, Coming Soon, noindex,
  `blog_public=0` and active-theme checks.
- `npm test` passes the agent system, native foundation, workflow safeguards,
  JavaScript syntax and native-theme CSS lint checks.
- `npm run preview:native` provides a read-only composed local Homepage preview.
- The served preview returned HTTP 200 with the approved section order, final
  CTA and dynamic-News placeholder resolved and no raw PHP/pattern markers.
- The repository-local `$farmtree-autonomous-delivery` skill passes both the
  project validator and the Codex skill schema validator.
- Read-only checks on 2026-08-26 reconfirmed Coming Soon without an explicit
  public `noindex` signal and no protection rules on GitHub `Production`.
- The six approved commits were pushed to the native-rebuild branch through
  `897a991`; GitHub native validation run `32956292922` passed.
- PR #3 merged the workflow-only reconciliation to `main` at `3df2ae2`.
  GitHub registers `deploy-wordpress-native.yml` as active and manual-only with
  zero runs, and `deploy-wordpress-staging.yml` is absent from `main`.
- GitHub API verification found that the repository is private, only the owner
  has access, and `Production` has no rules. Required reviewers for a private
  repository require Enterprise-capable ownership plus an eligible reviewer.
- Live checks verified that Coming Soon remains active but neither the Homepage
  nor intercepted `/robots.txt` exposes a robots meta tag or `X-Robots-Tag`
  noindex signal.
- Backup existence remains externally unverified. The deployment workflow now
  requires a non-secret evidence reference in addition to typed confirmation.
- Merging PR #3 caused `vercel[bot]` to create GitHub deployment record
  `6101732202`; its successful status points to the legacy/reference static
  project at a Vercel-authenticated `vercel.app` URL. It did not run the native
  Actions workflow or deploy to the WordPress runtime at `farmtree.eu`.
- Homepage implementation source commit: `c27da77`.

## Preview And Screenshots

The local preview renderer is available without changing WordPress state.
Automated in-app browser capture was unavailable in the current environment, so
no new composed screenshots are claimed. Static preview composition and content
order are tested; visual browser and responsive inspection remain pending.

## Runtime Safety

No native workflow run, WordPress deployment, activation, content publication,
Coming Soon change or database change was made. FT-NATIVE-001B remains blocked
until the private repository can enforce an eligible `Production` reviewer, a
matching recoverable files/database backup is verified and the public response
exposes explicit noindex.

## Runtime Validation Still Required

- PHP syntax in the approved CI or server environment.
- Theme/plugin recognition while both remain inactive.
- Site Editor, Page Editor and Template Editor behavior.
- Frontend block rendering, Query Loop output and responsive visual review.
- Keyboard, focus, reduced-motion and screen-reader checks in rendered
  WordPress.
- Final approved imagery, proof labels, testimonials and partner evidence before
  publication.

## Next Action

Configure an eligible required reviewer on GitHub `Production`, which requires
Enterprise-capable ownership for this private repository. Then verify matching
backup evidence and explicit public noindex before seeking separate workflow
dispatch approval. Keep `farmtree-native` inactive and Coming Soon in place.
