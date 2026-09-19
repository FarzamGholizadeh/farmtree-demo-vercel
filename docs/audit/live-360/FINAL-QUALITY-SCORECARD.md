# Provisional evidence-coverage scorecard

Programme: **IN_PROGRESS**. Live5104687; release-specific production browser QA PASS.
This is not certification,100/100, or a UX-quality grade. Fixed ACCEPTANCE.md groups
and weights are preserved verbatim in FINAL-SCORECARD.json. Group adjudication is
pending: no complete programme-wide credit is inferred from sampled releases.

Formula: category weight × passed applicable groups / applicable groups. Every
constituent must have sufficient current evidence. UNKNOWN, MANUAL-VERIFY and FAIL
earn0 after adjudication; N/A needs a reason and none is used. Null numerator/credit
means not yet adjudicated, not zero observed quality. Total score remains **null**.

| Category | Weight | Verified numerator | Applicable denominator | Credit |
|---|---:|---|---:|---|
| UI | 8 | Pending review | 6 | Not assessed |
| UX | 8 | Pending review | 6 | Not assessed |
| Accessibility | 10 | Pending review | 8 | Not assessed |
| Front-end | 8 | Pending review | 7 | Not assessed |
| WordPress/back-end | 10 | Pending review | 7 | Not assessed |
| Security | 10 | Pending review | 8 | Not assessed |
| Privacy | 5 | Pending review | 5 | Not assessed |
| Performance | 10 | Pending review | 6 | Not assessed |
| QA/reliability | 8 | Pending review | 7 | Not assessed |
| DevOps/SRE | 7 | Pending review | 7 | Not assessed |
| Technical SEO | 6 | Pending review | 6 | Not assessed |
| GEO/AEO/AI | 5 | Pending review | 5 | Not assessed |
| Copy/brand/conversion | 5 | Pending review | 6 | Not assessed |

Total weight: 100; applicable groups: 84. No thresholds or denominators changed.

## Explicit unresolved outcomes

- Current production performance retest stopped after22/36 samples with QUIC
  errors; desktop autoplay hero late LCP remains an open gate, not a passing matrix.
- The two specific globe/metric P1 defects are resolved in5104687 with live
  regression evidence. Whole-group/manual accessibility coverage remains incomplete;
  fixing those defects does not automatically award programme-wide group credit.
- Fresh40-route/11-width browser matrix passes440views, with pending-image
  observations separately investigated. Full field/assistive-technology/idempotence
  coverage remains incomplete; browser PASS is narrower evidence.
- The14-body content proposal is unimplemented. Fresh reconciler bootstrap-risk
  approval, reviewed digest and scope remain required before content mutation.
- Human user research, legal sufficiency, retention/contracts and claim evidence
  are unresolved. Merely documenting an unknown does not prove the practice.

## Review protocol

Each exact group in JSON has an explicit provisional status, evidence limitation
and PENDING_GROUP_REVIEW marker. Confirmed defects are FAIL; actual human evidence
gaps are MANUAL-VERIFY; insufficient collective coverage is UNKNOWN. Main reviewer
must map every constituent to frozen current evidence before assigning PASS and
numeric credit. Retain previous partial passes rather than erase them, but do not
convert them into whole-group credit. The supplemental15-category10/10 brief stays
separately traceable under ACCEPTANCE.md; do not double-count shared categories.
