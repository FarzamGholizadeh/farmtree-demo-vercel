# FarmTree WordPress Release Checklist

_Last updated: 2026-08-27_

## Release Context

- Production domain: `https://farmtree.eu/`
- Default branch: `main`
- Native implementation branch: `feat/wordpress-native-rebuild`
- Legacy production-integration branch: `wordpress-integration`
- WordPress theme: `wordpress/wp-content/themes/farmtree`
- Core plugin: `wordpress/wp-content/plugins/farmtree-core`
- AI plugin: `wordpress/wp-content/plugins/farmtree-ai-assistant`
- Vercel/static SPA: legacy/reference only, not the production source.

## Approval Gates

- [ ] Gate 1 - Spec approval is recorded.
- [ ] Gate 2 - Implementation approval is recorded.
- [ ] Gate 3 - Push approval is recorded before any push.
- [ ] Gate 4 - Merge/release-candidate approval is recorded before release candidate handling.
- [ ] Gate 5 - Explicit user deployment approval is recorded before manually
      dispatching a workflow bound to the GitHub `Production` environment and
      before SSH/rsync deployment.
- [ ] Gate 6 - WordPress publication/activation/database approval is recorded before content publication, theme/plugin activation changes, or database changes.

## Preflight

- [ ] Confirm the branch matches the operation: `feat/wordpress-native-rebuild`
      for native pre-release work and `wordpress-integration` for approved
      production integration.
- [ ] Confirm working-tree status is understood.
- [ ] Confirm release diff contains only approved files.
- [ ] Confirm no secrets or environment files are included.
- [ ] Confirm no forbidden production data or WordPress runtime state is changed.
- [ ] Before any future merge to `main`, obtain explicit approval for the
      resulting legacy Vercel deployment or suspend the Vercel Git integration.
      A `main` merge currently creates an external static-project deployment.

## Local Validation

- [ ] Run `git status --short`.
- [ ] Run `git diff --stat`.
- [ ] Run `git diff --check`.
- [ ] Run available read-only syntax checks or tests that do not install dependencies, write output, or trigger remote actions.
- [ ] Review GitHub Actions YAML indentation and trigger logic.

## Deployment Review

- [ ] Confirm `.github/workflows/deploy-wordpress.yml` uses only `workflow_dispatch`.
- [ ] Confirm `.github/workflows/deploy-wordpress.yml` uses the `production` environment.
- [ ] Confirm the workflow remains bound to the GitHub `Production` environment.
- [ ] Record independent GitHub Environment Required Reviewer protection as a
      deferred governance enhancement. Do not make the private repository
      public, move it, change ownership/billing or purchase/migrate a plan to
      satisfy this non-blocking enhancement.
- [ ] Confirm the compensating control: private repository, manual-only
      dispatch, no automatic WordPress production deployment, pre-release stop,
      explicit user approval, Coming Soon, the `farmtree` rollback theme and a
      reviewed rollback procedure.
- [ ] Confirm `.github/workflows/test-vimexx-ssh.yml` is manual-only.
- [ ] Confirm deployment uses repository code only and does not publish WordPress content.

## Native Private-Runtime Review

- [x] Confirm `.github/workflows/deploy-wordpress-native.yml` has reached the
      GitHub default `main` branch. PR #3 merged at `3df2ae2`; GitHub registers
      the workflow as active and it has zero runs.
- [ ] Record the full approved commit SHA from `feat/wordpress-native-rebuild`;
      use that immutable SHA as `source_commit` rather than deploying `main` or
      an unpinned branch tip. The last pushed/CI-validated baseline is
      `897a991fbdd9f301d0409d1a015282baac8fce61` (run `32956292922`), but it
      predates the local visual-parity correction and must not be used for that
      release. After an explicitly approved push and passing CI, record and
      reconfirm the new parity commit's full SHA before dispatch.
- [x] Reconcile the default-branch workflow additions and retire the superseded
      `.github/workflows/deploy-wordpress-staging.yml` path. Verified absent
      from `main` at `3df2ae2`.
- [ ] Confirm the GitHub `Production` environment binding remains present.
      Independent Required Reviewer protection is a deferred governance
      enhancement for this private repository and is not a dispatch prerequisite
      under the compensating manual-release policy.
- [ ] Select one recent matching Vimexx restore point for both the FarmTree
      website files and WordPress database.
- [ ] Download both backup ZIPs to off-host storage, verify that they open and
      contain the expected site files and SQL data, and record a non-secret
      evidence reference for the workflow input. Retain the original reference
      so its SHA-256 can be reconciled with the workflow job summary.
- [ ] Confirm Coming Soon remains active and the public response exposes an
      explicit robots meta or `X-Robots-Tag` noindex signal. Do not treat
      `robots.txt` alone as sufficient evidence.
- [ ] Confirm the workflow deploys only inactive `farmtree-native` and
      `farmtree-content` files and performs no activation or database change.

## Native Publication Gate

These items do not block a separately approved inactive-code deployment for
private runtime validation, but they block public activation and publication:

- [ ] Approve the current no-PII email-only quotation fallback for publication,
      or configure and verify a privacy-reviewed delivery backend if an online
      form is required. Never restore a placeholder or simulated success path.
- [ ] Approve complete NL/DE translations before publishing their reserved
      `/nl/` and `/de/` routes, navigation, canonicals, hreflang or sitemap
      entries. Keep both options disabled until then.
- [ ] Sign off the proof labels, testimonial attribution/permissions, imagery
      and partner/reference relationships in
      `docs/FT-NATIVE-002-PUBLICATION-EVIDENCE.md`.
- [ ] Complete one logged-out real screen-reader listening walkthrough; the
      automated accessibility-tree smoke test is supporting evidence only.
- [ ] Confirm no unfinished native content is public before Gate 6 approval.

## Post-Deployment Verification

These checks require an approved deployment and permitted browser/runtime verification:

- [ ] Visit `https://farmtree.eu/`.
- [ ] Confirm homepage renders without browser console errors.
- [ ] Confirm primary navigation, footer navigation, and key CTAs work.
- [ ] Confirm theme assets load correctly.
- [ ] Confirm canonical, metadata, robots, sitemap, and structured data behavior on production.
- [ ] Confirm responsive behavior on mobile, tablet, and desktop.
- [ ] Confirm accessibility smoke checks on key flows.

## WordPress Runtime Actions

The following are not part of code deployment and require Gate 6:

- [ ] Publishing, editing, or deleting WordPress content.
- [ ] Activating or deactivating themes.
- [ ] Activating or deactivating plugins.
- [ ] Changing WordPress settings.
- [ ] Running database migrations or direct database edits.
