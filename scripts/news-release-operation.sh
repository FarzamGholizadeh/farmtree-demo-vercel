#!/usr/bin/env bash
# Guarded News12 content operation. Must live outside the public webroot.
set -Eeuo pipefail
umask 077
root=/home/u80341p492940/domains/farmtree.eu/public_html
recovery=/home/u80341p492940/farmtree-recovery-backups
sha=${1:?}; release=${2:?}; mode=${3:?}; helpers_hash=${4:?}; target_hash=${5:?}; backup_hash=${6:?}; digest=${7:-}
[[ "$sha" =~ ^[a-f0-9]{40}$ && "$release" =~ ^news12-${sha}-[0-9]+$ ]]
[[ "$mode" = preflight || "$mode" = dry-run || "$mode" = apply || "$mode" = final-dry-run ]]
for hash in "$helpers_hash" "$target_hash" "$backup_hash"; do [[ "$hash" =~ ^[a-f0-9]{64}$ ]]; done
if test "$mode" = apply; then [[ "$digest" =~ ^[a-f0-9]{64}$ ]]; else test -z "$digest"; fi
for path in "$root" "$recovery"; do test -d "$path"; test ! -L "$path"; test "$(realpath "$path")" = "$path"; done
exec 9>"$recovery/.farmtree-production.lock"
flock -n 9 || { echo RELEASE_LOCK_BUSY >&2; exit 1; }
base="$recovery/$release"
test -d "$base"; test ! -L "$base"; test "$(realpath "$base")" = "$base"
cd "$base"
for path in helpers.sha256 target.sha256 backup.sha256; do test -f "$path"; test ! -L "$path"; done
printf '%s  helpers.sha256\n%s  target.sha256\n%s  backup.sha256\n' "$helpers_hash" "$target_hash" "$backup_hash" | sha256sum -c --quiet -
# Hash lists are independently pinned above; accept only safe relative names.
for manifest in helpers.sha256 target.sha256 backup.sha256; do
  if grep -Ev '^[a-f0-9]{64}  [A-Za-z0-9_./-]+$' "$manifest" || grep -E '  /|(^|/)\.\.?(/|$)|//' "$manifest"; then exit 1; fi
done
sha256sum -c --quiet helpers.sha256
sha256sum -c --quiet backup.sha256
test -d stage; test ! -L stage; test "$(find stage -type l | wc -l)" -eq 0
(cd stage && sha256sum -c --quiet "$base/target.sha256")
find stage -type f | sed 's#^stage/##' | LC_ALL=C sort > "$base/operation-stage-paths.txt"
sed 's/^[a-f0-9]\{64\}  //' target.sha256 | LC_ALL=C sort > "$base/operation-target-paths.txt"
cmp "$base/operation-stage-paths.txt" "$base/operation-target-paths.txt"
for helper in news-release-command.php news-release-evidence.php cron-diagnostics-bootstrap.php cron-diagnostics-snapshot.php cron-diagnostics.php state-gates.php; do
  test -f "$helper"; test ! -L "$helper"; grep -Eq "^[a-f0-9]{64}  ${helper//./\.}$" helpers.sha256
done
# Exclusive directory preserves failed attempts and forbids silent retries.
operation="$base/op-$mode"
mkdir "$operation"
cd "$root"
prefix=$(wp db prefix)
[[ "$prefix" =~ ^[A-Za-z0-9_]+$ ]]
plan_args=()
if test "$mode" = apply; then
  test -f "$base/op-dry-run/verified.json"
  php "$base/news-release-evidence.php" receipt "$base/op-dry-run/command.json" dry-run "$sha" > "$operation/reviewed-scope.json"
  php -r '$p=json_decode(file_get_contents($argv[1]),true,512,JSON_THROW_ON_ERROR); if (($p["plan_digest"]??null)!==$argv[2]) exit(1);' "$base/op-dry-run/command.json" "$digest"
  plan_args=("$base/op-dry-run/command.json")
fi
if test "$mode" = final-dry-run; then test -f "$base/op-apply/verified.json"; fi
runtime_snapshot() {
  test "$(find wp-content/themes wp-content/plugins -type l | wc -l)" -eq 0 || return 1
  find wp-content/themes wp-content/plugins -type f -exec sha256sum {} \; | LC_ALL=C sort
}
cron_snapshot() { wp db query --batch --skip-column-names "SELECT HEX(option_value) FROM ${prefix}options WHERE option_name='cron';" | php "$base/cron-diagnostics-snapshot.php"; }
public_gate() {
  wp db query --batch --skip-column-names "SELECT option_name,HEX(option_value) FROM ${prefix}options WHERE option_name IN ('stylesheet','template','active_plugins','blog_public','show_on_front','page_on_front','seedprod_settings','ft_ai_settings');" | php "$base/state-gates.php"
  test "$(wp db query --batch --skip-column-names "SELECT COUNT(*) FROM ${prefix}posts WHERE post_name IN ('nl','de') AND post_status='publish';")" = 0
  test "$(wp db query --batch --skip-column-names "SELECT COUNT(*) FROM ${prefix}posts WHERE ID=(SELECT option_value FROM ${prefix}options WHERE option_name='page_on_front') AND post_type='page' AND post_status='publish' AND post_password='';")" = 1
}
public_gate > "$operation/public-before.txt"
php "$base/news-release-evidence.php" capture "$prefix" ${plan_args[@]+"${plan_args[@]}"} > "$operation/database-before.json"
runtime_snapshot > "$operation/runtime-before.sha256"
cron_snapshot > "$operation/cron-before.json"
command_mode=dry-run; command_args=()
if test "$mode" = apply; then command_mode=apply; command_args=("$digest" "$backup_hash"); fi
set +e
FT_CRON_DIAGNOSTICS_ROOT="$root" FT_CRON_DIAGNOSTICS_STAGE="$base/stage" FT_CRON_DIAGNOSTICS_FILE="$operation/cron-window.jsonl" \
  wp --require="$base/cron-diagnostics-bootstrap.php" --skip-plugins=farmtree-content eval-file "$base/news-release-command.php" "$base/stage" "$sha" "$command_mode" ${command_args[@]+"${command_args[@]}"} > "$operation/command.json" 2> "$operation/command.stderr"
command_status=$?
# Capture post-evidence even when CLI reports failure. Never claim rollback here.
php "$base/news-release-evidence.php" capture "$prefix" ${plan_args[@]+"${plan_args[@]}"} > "$operation/database-after.json"; database_status=$?
runtime_snapshot > "$operation/runtime-after.sha256"; runtime_status=$?
cron_snapshot > "$operation/cron-after.json"; cron_status=$?
public_gate > "$operation/public-after.txt"; public_status=$?
set -e
printf '%s\n' "$command_status" > "$operation/command.exit"
test "$database_status" = 0; test "$runtime_status" = 0; test "$cron_status" = 0; test "$public_status" = 0
cmp "$operation/runtime-before.sha256" "$operation/runtime-after.sha256"
cmp "$operation/cron-before.json" "$operation/cron-after.json"
php "$base/news-release-evidence.php" diagnostics "$operation/cron-window.jsonl" > "$operation/diagnostics-verification.json"
php "$base/news-release-evidence.php" compare "$operation/database-before.json" "$operation/database-after.json" "$mode" > "$operation/database-verification.json"
test "$command_status" = 0
php "$base/news-release-evidence.php" receipt "$operation/command.json" "$mode" "$sha" > "$operation/verified.json"
if test "$mode" = preflight; then
  (cd "$base" && sha256sum op-preflight/command.json op-preflight/verified.json op-preflight/database-verification.json op-preflight/diagnostics-verification.json op-preflight/command.exit) > "$base/preflight-gates.sha256"
  printf '%s\n' "$base/preflight-gates.sha256"
fi
printf '%s\n' "$operation/verified.json" "$operation/database-verification.json" "$operation/diagnostics-verification.json"
