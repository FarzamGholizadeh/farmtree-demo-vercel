#!/usr/bin/env bash
# Exact-artifact runtime swap AFTER read-only preflight, BEFORE News publication.
# No database writes, content reconciliation, activation or visibility changes.
set -Eeuo pipefail
umask 077
root=/home/u80341p492940/domains/farmtree.eu/public_html
recovery=/home/u80341p492940/farmtree-recovery-backups
sha=${1:?}; release=${2:?}; package_hash=${3:?}; target_hash=${4:?}; baseline_hash=${5:?}; receipt_hash=${6:?}; helpers_hash=${7:?}; gates_hash=${8:?}
[[ "$sha" =~ ^[a-f0-9]{40}$ && "$release" =~ ^news12-${sha}-[0-9]+$ ]]
for digest in "$package_hash" "$target_hash" "$baseline_hash" "$receipt_hash" "$helpers_hash" "$gates_hash"; do [[ "$digest" =~ ^[a-f0-9]{64}$ ]]; done
for directory in "$root" "$recovery"; do test -d "$directory"; test ! -L "$directory"; test "$(realpath "$directory")" = "$directory"; done
exec 9>"$recovery/.farmtree-production.lock"
flock -n 9 || { echo 'RELEASE_LOCK_BUSY' >&2; exit 1; }
base="$recovery/$release"
test -d "$base"; test ! -L "$base"; test "$(realpath "$base")" = "$base"
cd "$base"
test -d op-preflight; test ! -L op-preflight
test "$(realpath op-preflight)" = "$base/op-preflight"
for file in runtime.tar.gz target.sha256 baseline.sha256 op-preflight/command.json swap-helpers.sha256 preflight-gates.sha256; do test -f "$file"; test ! -L "$file"; done
printf '%s  runtime.tar.gz\n%s  target.sha256\n%s  baseline.sha256\n%s  op-preflight/command.json\n%s  swap-helpers.sha256\n%s  preflight-gates.sha256\n' "$package_hash" "$target_hash" "$baseline_hash" "$receipt_hash" "$helpers_hash" "$gates_hash" | sha256sum -c --quiet -
sed -En 's#^[a-f0-9]{64}  (op-preflight/[A-Za-z0-9_.-]+)$#\1#p' preflight-gates.sha256 | LC_ALL=C sort > preflight-gate.paths
printf '%s\n' op-preflight/command.exit op-preflight/command.json op-preflight/database-verification.json op-preflight/diagnostics-verification.json op-preflight/verified.json > preflight-gate.expected
cmp preflight-gate.paths preflight-gate.expected
test "$(wc -l < preflight-gates.sha256)" -eq 5
while IFS= read -r file; do test -f "$file"; test ! -L "$file"; done < preflight-gate.paths
sha256sum -c --quiet preflight-gates.sha256
# Helpers are pinned independently; reject path substitution before invoking PHP.
sed -n 's/^[a-f0-9]\{64\}  \(.*\)$/\1/p' swap-helpers.sha256 | LC_ALL=C sort > helper.paths
printf '%s\n' cron-diagnostics-snapshot.php cron-diagnostics.php news-release-evidence.php state-gates.php > helper.expected
cmp helper.paths helper.expected
test "$(wc -l < swap-helpers.sha256)" -eq 4
while IFS= read -r helper; do test -f "$helper"; test ! -L "$helper"; done < helper.paths
sha256sum -c --quiet swap-helpers.sha256
# Verify independently pinned successful read-only preflight before touching code.
# PHP reads JSON only; no WordPress bootstrap or publication occurs here.
php -r '$read=static fn($n)=>json_decode(file_get_contents($argv[1]."/op-preflight/".$n),true,512,JSON_THROW_ON_ERROR); $r=$read("command.json"); $v=$read("verified.json"); $d=$read("database-verification.json"); $c=$read("diagnostics-verification.json"); $s=["create"=>29,"update"=>0,"unchanged"=>102,"conflict"=>0,"skipped"=>1]; if (($r["source_commit"]??null)!==$argv[2] || ($r["mode"]??null)!=="dry-run" || ($r["post_launch_news12"]??null)!==true || ($r["summary"]??null)!==$s || !preg_match("/^[a-f0-9]{64}$/D",$r["plan_digest"]??"") || ($v["ok"]??null)!==true || ($v["source_commit"]??null)!==$argv[2] || ($v["phase"]??null)!=="preflight" || ($v["summary"]??null)!==$s || ($d["ok"]??null)!==true || ($d["database"]??null)!=="unchanged" || ($c["ok"]??null)!==true || ($c["cron_activity"]??null)!=="none" || trim(file_get_contents($argv[1]."/op-preflight/command.exit"))!=="0") exit(1);' "$base" "$sha"
for path in stage-swap pre-theme pre-plugin failed-theme failed-plugin runtime-swap-before.tar.gz backup-check; do test ! -e "$path"; test ! -L "$path"; done
tar -tzf runtime.tar.gz > archive.paths
LC_ALL=C sort archive.paths > archive.sorted
sed -En 's#^[a-f0-9]{64}  (wp-content/(themes/farmtree-native|plugins/farmtree-content)/.*)$#\1#p' target.sha256 | LC_ALL=C sort > expected.paths
test -s expected.paths
test "$(wc -l < target.sha256)" = "$(wc -l < expected.paths)"
test "$(wc -l < archive.sorted)" = "$(LC_ALL=C sort -u archive.sorted | wc -l)"
cmp archive.sorted expected.paths
if grep -Ev '^wp-content/(themes/farmtree-native|plugins/farmtree-content)/[A-Za-z0-9_./-]+$' archive.paths || grep -E '(^|/)\.\.?(/|$)|//' archive.paths; then exit 1; fi
grep -qx 'wp-content/themes/farmtree-native/functions.php' archive.paths
grep -qx 'wp-content/plugins/farmtree-content/farmtree-content.php' archive.paths
tar -tvzf runtime.tar.gz > archive.types
if grep -v '^-' archive.types; then echo 'NON_REGULAR_ARCHIVE_MEMBER' >&2; exit 1; fi
mkdir stage-swap
tar -xzf runtime.tar.gz --no-same-owner --no-same-permissions -C stage-swap
test "$(find stage-swap -type l | wc -l)" -eq 0
(cd stage-swap && sha256sum -c --quiet "$base/target.sha256")
find stage-swap -name '*.php' -type f -print0 > "$base/php-sources.list"
test -s "$base/php-sources.list"
while IFS= read -r -d '' source; do php -l "$source"; done < "$base/php-sources.list" > "$base/swap-php-lint.txt"
test -s "$base/swap-php-lint.txt"
find stage-swap -type d -exec chmod 755 {} +
find stage-swap -type f -exec chmod 644 {} +
cd "$root"
for path in wp-content wp-content/themes wp-content/plugins wp-content/themes/farmtree-native wp-content/themes/farmtree wp-content/plugins/farmtree-content; do test -d "$path"; test ! -L "$path"; done
test "$(find wp-content/themes/farmtree-native wp-content/plugins/farmtree-content wp-content/themes/farmtree -type l | wc -l)" -eq 0
runtime_snapshot() { find wp-content/themes/farmtree-native wp-content/plugins/farmtree-content -type f -exec sha256sum {} \; | LC_ALL=C sort; }
runtime_snapshot > "$base/current.sha256"
LC_ALL=C sort "$base/baseline.sha256" > "$base/baseline.sorted"
cmp "$base/current.sha256" "$base/baseline.sorted"
find wp-content/themes/farmtree -type f -exec sha256sum {} \; | LC_ALL=C sort > "$base/swap-legacy.sha256"
prefix=$(wp db prefix)
[[ "$prefix" =~ ^[A-Za-z0-9_]+$ ]]
snapshot() {
  wp db query --batch --skip-column-names "SELECT option_name,SHA2(option_value,256) FROM ${prefix}options WHERE option_name <> 'cron' ORDER BY option_name;
SELECT ID,SHA2(CONCAT_WS('|',post_author,post_date,post_date_gmt,post_content,post_title,post_excerpt,post_status,comment_status,ping_status,post_password,post_name,to_ping,pinged,post_modified,post_modified_gmt,post_content_filtered,post_parent,guid,menu_order,post_type,post_mime_type,comment_count),256) FROM ${prefix}posts ORDER BY ID;
SELECT meta_id,SHA2(CONCAT_WS('|',post_id,meta_key,meta_value),256) FROM ${prefix}postmeta ORDER BY meta_id;
SELECT term_id,SHA2(CONCAT_WS('|',name,slug,term_group),256) FROM ${prefix}terms ORDER BY term_id;
SELECT meta_id,SHA2(CONCAT_WS('|',term_id,meta_key,meta_value),256) FROM ${prefix}termmeta ORDER BY meta_id;
SELECT term_taxonomy_id,SHA2(CONCAT_WS('|',term_id,taxonomy,description,parent,count),256) FROM ${prefix}term_taxonomy ORDER BY term_taxonomy_id;
SELECT object_id,term_taxonomy_id,term_order FROM ${prefix}term_relationships ORDER BY object_id,term_taxonomy_id;"
}
cron_snapshot() { wp db query --batch --skip-column-names "SELECT HEX(option_value) FROM ${prefix}options WHERE option_name='cron';" | php "$base/cron-diagnostics-snapshot.php"; }
public_gate() {
  wp db query --batch --skip-column-names "SELECT option_name,HEX(option_value) FROM ${prefix}options WHERE option_name IN ('stylesheet','template','active_plugins','blog_public','show_on_front','page_on_front','seedprod_settings','ft_ai_settings');" | php "$base/state-gates.php"
  test "$(wp db query --batch --skip-column-names "SELECT COUNT(*) FROM ${prefix}posts WHERE post_name IN ('nl','de') AND post_status='publish';")" = 0
  test "$(wp db query --batch --skip-column-names "SELECT COUNT(*) FROM ${prefix}posts WHERE ID=(SELECT option_value FROM ${prefix}options WHERE option_name='page_on_front') AND post_type='page' AND post_status='publish' AND post_password='';")" = 1
}
snapshot > "$base/state-before.txt"
php "$base/news-release-evidence.php" capture "$prefix" > "$base/swap-database-before.json"
cron_snapshot > "$base/cron-before.json"
public_gate
tar -czf "$base/runtime-swap-before.tar.gz" wp-content/themes/farmtree-native wp-content/plugins/farmtree-content
test -s "$base/runtime-swap-before.tar.gz"
mkdir "$base/backup-check"
tar -xzf "$base/runtime-swap-before.tar.gz" --no-same-owner --no-same-permissions -C "$base/backup-check"
(cd "$base/backup-check" && sha256sum -c --quiet "$base/current.sha256")
(cd "$base" && sha256sum runtime-swap-before.tar.gz current.sha256 swap-legacy.sha256 state-before.txt swap-database-before.json cron-before.json swap-php-lint.txt op-preflight/command.json preflight-gates.sha256 > swap-backup.sha256 && sha256sum -c --quiet swap-backup.sha256)
for directory in wp-content/themes wp-content/plugins; do test "$(stat -c %d "$base/stage-swap")" = "$(stat -c %d "$directory")"; done
# Close the backup/preflight drift window immediately before replacement.
runtime_snapshot > "$base/pre-swap.sha256"
cmp "$base/current.sha256" "$base/pre-swap.sha256"
rollback() {
  code=$?
  trap - EXIT HUP INT TERM
  for kind in theme plugin; do
    if test "$kind" = theme; then live="$root/wp-content/themes/farmtree-native"; else live="$root/wp-content/plugins/farmtree-content"; fi
    if test -d "$base/pre-$kind"; then
      if test -d "$live"; then mv "$live" "$base/failed-$kind" || exit 2; fi
      mv "$base/pre-$kind" "$live" || exit 2
    fi
  done
  runtime_snapshot > "$base/rollback.sha256"
  cmp "$base/current.sha256" "$base/rollback.sha256" || { echo 'ROLLBACK_VERIFICATION_FAILED' >&2; exit 2; }
  echo 'RUNTIMES_ROLLED_BACK_DATABASE_NOT_RESTORED' >&2
  exit "${code:-1}"
}
trap rollback EXIT
trap 'exit 130' HUP INT TERM
mv wp-content/themes/farmtree-native "$base/pre-theme"
mv "$base/stage-swap/wp-content/themes/farmtree-native" wp-content/themes/farmtree-native
mv wp-content/plugins/farmtree-content "$base/pre-plugin"
mv "$base/stage-swap/wp-content/plugins/farmtree-content" wp-content/plugins/farmtree-content
runtime_snapshot > "$base/deployed.sha256"
LC_ALL=C sort "$base/target.sha256" > "$base/target.sorted"
cmp "$base/deployed.sha256" "$base/target.sorted"
find wp-content/themes/farmtree -type f -exec sha256sum {} \; | LC_ALL=C sort > "$base/swap-legacy-after.sha256"
cmp "$base/swap-legacy.sha256" "$base/swap-legacy-after.sha256"
status=$(curl -sS --max-time 30 -D "$base/http.headers" -o "$base/http.html" -w '%{http_code}' "https://farmtree.eu/?ft_news12_release=$sha")
test "$status" = 200
grep -q 'ft-native-home' "$base/http.html"
if grep -Eqi 'Coming Soon|PHP (Warning|Fatal error)|<meta[^>]+name=.robots.[^>]+content=.[^>]*(noindex|nofollow)' "$base/http.html" || grep -Eqi '^x-robots-tag:.*(noindex|nofollow)' "$base/http.headers"; then exit 1; fi
public_gate
snapshot > "$base/state-after.txt"
php "$base/news-release-evidence.php" capture "$prefix" > "$base/swap-database-after.json"
cron_snapshot > "$base/cron-after.json"
cmp "$base/state-before.txt" "$base/state-after.txt"
cmp "$base/cron-before.json" "$base/cron-after.json"
php "$base/news-release-evidence.php" compare "$base/swap-database-before.json" "$base/swap-database-after.json" dry-run > "$base/swap-database-verification.json"
(cd "$base" && sha256sum -c --quiet swap-backup.sha256)
trap - EXIT HUP INT TERM
echo "NEWS12_RUNTIMES_VERIFIED $sha"
echo "BACKUP_REFERENCE $release"
echo 'DATABASE_WRITES_NONE_BY_RUNNER; BROWSER_QA_REQUIRED'
