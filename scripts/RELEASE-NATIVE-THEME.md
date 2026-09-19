# Public Native theme-only release

This runner does not grant approval. Use only for the exact user-approved release.
It never pushes Git, applies managed content, changes plugins, or writes WordPress
options/posts. `--execute` replaces the **active** theme after a rollback backup.

1. Validate locally, commit the coherent change, push only the approved feature
   branch, and build/audit the artifact from that clean exact HEAD.
2. Obtain the separately reviewed current deployed Native **and Content**
   `SHA256SUMS` baseline from the last verified release evidence. Do not generate a
   replacement baseline from unexplained live drift just to pass the guard.
3. Prepare (no production connection):

   ```sh
   node scripts/release-native-theme.mjs --sha FULL_APPROVED_SHA --baseline /absolute/reviewed/SHA256SUMS
   ```

4. After approval, execute with existing independently verified known_hosts and
   SSH identity files (never paste their contents into reports):

   ```sh
   node scripts/release-native-theme.mjs --sha FULL_APPROVED_SHA --baseline /absolute/reviewed/SHA256SUMS --execute --known-hosts /absolute/verified/known_hosts --identity /absolute/private/key
   ```

The runner requires HEAD and origin feature branch to equal the exact SHA, a
clean worktree, a passing artifact audit and unchanged Content plugin hashes.
Only theme files are archived. The remote runner uses a shared nonblocking flock
under the existing off-webroot recovery directory, validates paths/types/hashes,
refuses baseline drift, verifies public-state read-only SQL gates, and creates a
readable checksummed backup before the same-filesystem directory swap. It retains
the prior theme and all evidence outside the webroot. Legacy rollback theme and
Content plugin are checked unchanged. Database state is hashed before/after;
option values used for gates are streamed to PHP and never written to evidence.

Any failure after removing the old active directory restores it and verifies
baseline checksums. An external simultaneous database/content edit aborts the
release and restores the theme; it is **not** overwritten in the database.
A process SIGKILL or host failure cannot run a shell trap: recovery then requires
moving the retained `pre-theme` directory back under the documented active path.
No automated deletion of backups is performed. Two directory moves entail a
brief possible missing-theme window; do not claim transactional zero downtime.

Success proves checksums/public HTTP smoke/protected-state equality, **not** full
visual QA. Run the release-specific live browser/route/accessibility regression
matrix before declaring completion. If the new theme fails semantic QA, use the
retained rollback theme with an approved/manual recovery procedure and verify
checksums/state/public availability again.

Test: `node scripts/validate-theme-release.mjs`. Disposable filesystem tests use
real archive validation and moves; PHP, WordPress, HTTP, device and flock command
responses are mocked. These tests do not establish a real host restore drill.

Workflow SSH trust now requires `VIMEXX_KNOWN_HOSTS` containing a previously
verified host key. No live `ssh-keyscan` output is trusted. The legacy deployment
workflow fails closed; the superseded private-native workflow now also fails in
its first step, before credentials or writes. Historical private gates remain
intact below that refusal and must not be repurposed for public production.
Only the reviewed public runner is executable; it owns the shared host lock for
the complete validation/backup/swap/verification session.
