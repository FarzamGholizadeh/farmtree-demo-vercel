# Existing cron mutation evidence — 20 September 2026

## Classification

**UNRESOLVED**

This is not PASS and does not establish a FarmTree side effect or benign
volatility. No broad cron exception is permitted. Local News implementation is
unblocked; a production release requiring the affected reconciler/bootstrap path
remains blocked pending attribution. The one authorised production dry-run has
already been consumed and was not repeated during this investigation.

## Evidence inspected

The single-use receipt records `2026-09-20T08:16:57.048Z`, approved runtime
`5104687c27b7b6aa69b100e55d905a8107726ec7`. Existing files under
`qa/live-360/security/approved-dryrun-510` have these SHA-256 digests:

| Evidence | SHA-256 |
| --- | --- |
| `.before.json` | `f64863b852a75f8fefd805bfe552a8a1ebfd3b5c9304f4bdcff0ab6501670ee0` |
| `.after.json` | `16f4d76288eb84c4efea88ee9fe982934beb9255d1b051bfa2ac9d943883c974` |
| `.command.json` | `83e186d08552cc28ecc42d081c1700299fbb8b4e14b81c8155994bf45cdf9ad3` |
| `.report.json` | `9c71ddc5e02f3ba677205879da113d5785dd5730d2ad03492624005ccff189a1` |
| `.attempt.json` | `8d56a01458e53838d560cbf28c746ba601351f322f0f2186965a1b125fe5940e` |

The capture script selected `option_name,SHA2(option_value,256)`, not raw
`option_value`. Consequently, neither snapshot retains the serialized cron
array, event timestamps, hooks, schedules, intervals or argument identities.

| Cron value fingerprint | SHA-256 |
| --- | --- |
| Before | `4390a34355548be343b4dbc79fd3c0375372197265b418f31cc6d9f9a731823d` |
| After | `8af5988501f1ac007c1fc57faf97f9eec4dd4519f4185d3df69899f03da7b838` |
| Existing 19 September database backup | `e80d42f096ba2963ba3cd18d920b6428a036fa9a0106a077ad2af5027908778e` |

The backup cron value was extracted read-only from the existing off-webroot SQL
dump using standalone PHP, without loading WordPress. Its serialized value is
2,750 bytes and matches neither captured fingerprint. It is not an exact pre-run
or post-run substitute. A Python reader was unavailable on the host; that failed
attempt did not execute WordPress or change data.

The existing report records command exit 0, create 0, update 0, unchanged 102,
conflict 0, skipped 1 and digest
`0c74bd24ae9073ba84c7f3ea4eeb90d4433d814c1e50eaa954fc03182b63a64e`.
Protected-state and runtime-file comparisons were equal; `cron` was the only
changed option fingerprint. Equality does not prove an absence of writes that
were later reverted. The firewall covers plan building, not prior bootstrap.

## Answers supported by the available evidence

1. **Exact semantic difference:** unavailable. Different serialized-value hashes
   establish different bytes, not whether events changed, ordering changed or
   a different serialization detail changed.
2. **Added/removed/rescheduled/timestamp-shifted hooks:** unavailable; no hook can
   be named as changed from these hashes.
3. **Changed-hook owner:** unknown. Assigning core, FarmTree or a third-party
   plugin without identifying the actual changed hook would be speculation.
4. **Schedule, interval and argument hashes:** unavailable for the changed event.
   The inspected core uses `md5(serialize($args))` as the event argument key;
   this explains the representation but does not recover the missing values.
5. **Recurring-event advancement match:** cannot be tested without before/after
   event timestamps, schedule/interval and execution timing.
6. **FarmTree source paths:** recursive PHP source inspection of the deployed
   `farmtree-native` and `farmtree-content`, and repository source searches, found
   no references to `cron`, `wp_schedule_event`, `wp_schedule_single_event`,
   `wp_reschedule_event`, `wp_unschedule_event`, `wp_clear_scheduled_hook` or
   `_set_cron_array`. No explicit direct cron-option mutation was found. The JS
   carousel's `scheduleAutoAdvance` is unrelated browser timing. This negative
   static search is not proof that indirect core/plugin hooks cannot run during
   WordPress bootstrap, nor proof of zero FarmTree-authored writes overall.
7. **Ordinary activity as a possibility:** yes, but not established for this
   mutation. Read-only production core inspection shows `wp-cron.php:129`
   reschedules recurring events, line 156 unschedules old events and line 191
   invokes callbacks. `wp-includes/update.php:1090–1099` schedules missing core
   version/plugin/theme checks with `twicedaily`. `wp-includes/cron.php:461–466`
   advances a due recurring event to
   `now + (interval - ((now - oldTimestamp) % interval))`; for a future timestamp
   it uses `now + interval`. `_set_cron_array` writes the cron option at line
   1304. These are inspected source capabilities, not an observed execution trace.
8. **Sufficient attribution evidence:** no. Neither benign volatility nor a
   FarmTree side effect can be concluded.

## Missing evidence required to resolve attribution

- The exact serialized pre-run and post-run cron option values, or lossless
  event inventories reconstructed from existing historical snapshots/logs, whose
  serialized values match the two recorded SHA-256 fingerprints above. A new
  current-state read or a new dry-run cannot recreate the missing historic pair.
- For each differing event: old/new timestamp, hook, recurrence, interval and
  argument identity/hash. These allow comparison against normal advancement and
  distinguish additions, removal, rescheduling and serialization-only changes.
- Existing timestamped execution/audit evidence for that capture window, together
  with the identified hook's registered callback and owning source/version, to
  attribute the change to ordinary core/plugin activity or FarmTree. Historical
  database logs or contemporaneous host snapshots may supply this evidence;
  their availability has not been established and no logging configuration was
  changed.

## Safety outcome

Investigation operations were existing local evidence/source reads and SSH reads
of production PHP source and the existing backup. No WordPress bootstrap,
reconciler, APPLY, manual cron, option/transient mutation, content mutation,
diagnostic production write or deployment was performed. No permitted semantic
volatility pattern is declared because the event delta remains unknown.
