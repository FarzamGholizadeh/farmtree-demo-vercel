# FarmTree Live360 — executive checkpoint

Checkpoint provenance: the following narrative records the pre-release03 handoff.
Subsequent explicit approval, deployment of5104687 and scoped live QA are recorded
in [RELEASE-03-PRODUCTION.md](RELEASE-03-PRODUCTION.md). Its release-approval blocker
and two specific accessibility defects are now resolved. Wider programme gaps
below remain open; the historical narrative is not current deployment status.

Status: PARTIALLY VERIFIED / IN PROGRESS. This draft is not a release approval,
final acceptance, certification, or a 100/100 claim.

The programme has delivered two scoped Native-theme releases. The recorded live
release is 66134c6c7f60cca1e12abca6658f71591fb04ea1. A separate local candidate,
5104687c27b7b6aa69b100e55d905a8107726ec7, addresses non-drag globe controls and
metric text clipping under expanded spacing. It is not pushed or deployed.

## Verified within recorded scope

- Release-specific navigation, CTA, responsive-image, motion and testimonial
  checks passed on the deployed release; see committed evidence index.
- Fresh public crawl: 46 routes, 46 internal destinations, no broken links.
- Fresh browser matrix: 40 managed routes, 11 widths, 440 views; no automated
  failures, console/page errors or tested interaction failures.
- Fourteen pending-image URLs returned HTTP 200 and decoded. A bounded logo-rail
  follow-up did not demonstrate persistent missing visible images.
- All fifteen evidence files pinned in this index exist and match their
  SHA256 digests at this checkpoint.

## Not yet accepted

Two production accessibility findings remain open until the candidate is
authorized, deployed and retested. Performance retesting is incomplete and
desktop Homepage late LCP remains a documented autoplay trade-off. Content
remediation is a proposal, not an applied change. Full manual accessibility,
legal/organisational evidence and field performance are not verified.

## Decisions and external evidence

Explicit authorization is still needed for exact-candidate push/deployment;
the prior rejected command was not executed or bypassed. The separate production
reconciler bootstrap-risk approval is also unresolved. Changing approved hero
autoplay requires a product decision. Claims, contracts, retention practices,
human research and actual assistive-technology testing need genuine evidence.

Production mutation was not performed during these follow-up audits. Recorded
public-state safeguards must be freshly verified before any future release.
The last verified rollback evidence belongs to the deployed release; any new
replacement requires a fresh off-webroot backup and checksum/state gates.
