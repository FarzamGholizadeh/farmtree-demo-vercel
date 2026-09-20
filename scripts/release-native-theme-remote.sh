#!/usr/bin/env bash
# Invoked only by release-native-theme.mjs; never performs WP writes.
set -Eeuo pipefail
umask 077
root=/home/u80341p492940/domains/farmtree.eu/public_html
recovery=/home/u80341p492940/farmtree-recovery-backups
sha=${1:?}; release=${2:?}; package_hash=${3:?}; target_hash=${4:?}; baseline_hash=${5:?}
[[ "$sha" =~ ^[a-f0-9]{40}$ && "$release" =~ ^live360-[a-f0-9]{40}-[0-9]+$ ]]
for digest in "$package_hash" "$target_hash" "$baseline_hash"; do [[ "$digest" =~ ^[a-f0-9]{64}$ ]]; done
test -d "$recovery"; test ! -L "$recovery"; test ! -L "$root"
test "$(realpath "$recovery")" = "$recovery"
test "$(realpath "$root")" = "$root"
command -v flock >/dev/null
exec 9>"$recovery/.farmtree-production.lock"
flock -n 9 || { echo 'RELEASE_LOCK_BUSY' >&2; exit 1; }
base="$recovery/$release"
test -d "$base"; test ! -L "$base"
cd "$base"
printf '%s  theme.tar.gz\n%s  target.sha256\n%s  baseline.sha256\n' "$package_hash" "$target_hash" "$baseline_hash" | sha256sum -c --quiet -
test ! -e stage; test ! -e pre-theme; test ! -e theme-before.tar.gz
# File-only archive, exact allowlisted names; reject directories, links, special
# nodes, traversal, duplicate paths and any additional member before extraction.
tar -tzf theme.tar.gz > archive.paths
LC_ALL=C sort archive.paths > archive.sorted
sed -n 's/^[a-f0-9]\{64\}  \(wp-content\/themes\/farmtree-native\/.*\)$/\1/p' target.sha256 | LC_ALL=C sort > expected.paths
test -s expected.paths
test "$(wc -l < archive.sorted)" = "$(LC_ALL=C sort -u archive.sorted | wc -l)"
cmp archive.sorted expected.paths
if grep -Ev '^wp-content/themes/farmtree-native/[A-Za-z0-9_./-]+$' archive.paths || grep -E '(^|/)\.\.?(/|$)' archive.paths; then exit 1; fi
tar -tvzf theme.tar.gz > archive.types
if grep -v '^-' archive.types; then echo 'NON_REGULAR_ARCHIVE_MEMBER' >&2; exit 1; fi
mkdir stage
tar -xzf theme.tar.gz --no-same-owner --no-same-permissions -C stage
test "$(find stage -type l | wc -l)" -eq 0
(cd stage && sha256sum -c --quiet "$base/target.sha256")
# Restricted hosts may lack usable /dev/fd process-substitution descriptors.
# A checked regular NUL list also makes discovery failure independently fatal.
find stage -name '*.php' -type f -print0 > "$base/php-sources.list"
test -s "$base/php-sources.list"
while IFS= read -r -d '' source; do php -l "$source"; done < "$base/php-sources.list" > "$base/php-lint.txt"
test -s "$base/php-lint.txt"
find stage -type d -exec chmod 755 {} +
find stage -type f -exec chmod 644 {} +
cd "$root"
for path in wp-content wp-content/themes wp-content/themes/farmtree-native wp-content/themes/farmtree wp-content/plugins wp-content/plugins/farmtree-content; do test ! -L "$path"; test -d "$path"; done
test "$(find wp-content/themes/farmtree-native wp-content/themes/farmtree wp-content/plugins/farmtree-content -type l | wc -l)" -eq 0
# Baseline is a separately reviewed exact current Native+Content checksum set.
find wp-content/themes/farmtree-native wp-content/plugins/farmtree-content -type f -exec sha256sum {} \; | LC_ALL=C sort > "$base/current.sha256"
LC_ALL=C sort "$base/baseline.sha256" > "$base/baseline.sorted"
cmp "$base/current.sha256" "$base/baseline.sorted"
find wp-content/themes/farmtree -type f -exec sha256sum {} \; | LC_ALL=C sort > "$base/legacy.sha256"
find wp-content/plugins/farmtree-content -type f -exec sha256sum {} \; | LC_ALL=C sort > "$base/plugin.sha256"
prefix=$(wp db prefix)
[[ "$prefix" =~ ^[A-Za-z0-9_]+$ ]]
snapshot() {
  wp db query --batch --skip-column-names "SELECT option_name,SHA2(option_value,256) FROM ${prefix}options WHERE option_name IN ('stylesheet','template','active_plugins','blog_public','page_on_front','show_on_front','permalink_structure','rewrite_rules','seedprod_settings','seedprod_allow_usage_tracking','extendify_insights_stop','ft_ai_settings','wp_page_for_privacy_policy','users_can_register','default_comment_status') ORDER BY option_name;
SELECT ID,SHA2(CONCAT_WS('|',post_author,post_date,post_date_gmt,post_content,post_title,post_excerpt,post_status,comment_status,ping_status,post_password,post_name,to_ping,pinged,post_modified,post_modified_gmt,post_content_filtered,post_parent,guid,menu_order,post_type,post_mime_type,comment_count),256) FROM ${prefix}posts ORDER BY ID;
SELECT meta_id,SHA2(CONCAT_WS('|',post_id,meta_key,meta_value),256) FROM ${prefix}postmeta ORDER BY meta_id;"
}
snapshot > "$base/state-before.txt"
# Database-only command: retain semantic cron evidence without bootstrapping
# WordPress or persisting serialized arguments. pipefail protects both readers.
cron_snapshot() {
  wp db query --batch --skip-column-names "SELECT HEX(option_value) FROM ${prefix}options WHERE option_name='cron';" | php "$base/cron-diagnostics-snapshot.php"
}
cron_snapshot > "$base/cron-before.json"
wp db query --batch --skip-column-names "SELECT option_name,HEX(option_value) FROM ${prefix}options WHERE option_name IN ('stylesheet','template','active_plugins','blog_public','show_on_front','page_on_front','seedprod_settings','ft_ai_settings');" | php "$base/state-gates.php"
test "$(wp db query --batch --skip-column-names "SELECT COUNT(*) FROM ${prefix}posts WHERE post_name IN ('nl','de') AND post_status='publish';")" = 0
test "$(wp db query --batch --skip-column-names "SELECT COUNT(*) FROM ${prefix}posts WHERE ID=(SELECT option_value FROM ${prefix}options WHERE option_name='page_on_front') AND post_type='page' AND post_status='publish' AND post_password='';")" = 1
tar -czf "$base/theme-before.tar.gz" wp-content/themes/farmtree-native
test -s "$base/theme-before.tar.gz"; tar -tzf "$base/theme-before.tar.gz" >/dev/null
(cd "$base" && sha256sum theme-before.tar.gz current.sha256 legacy.sha256 plugin.sha256 state-before.txt cron-before.json php-lint.txt > backup.sha256 && sha256sum -c --quiet backup.sha256)
test "$(stat -c %d "$base/stage")" = "$(stat -c %d wp-content/themes)"
rollback() {
  code=$?
  trap - EXIT HUP INT TERM
  if test -d "$base/pre-theme"; then
    if test -d "$root/wp-content/themes/farmtree-native"; then mv "$root/wp-content/themes/farmtree-native" "$base/failed-theme"; fi
    mv "$base/pre-theme" "$root/wp-content/themes/farmtree-native"
    (cd "$root" && sha256sum -c --quiet "$base/current.sha256") || { echo 'ROLLBACK_VERIFICATION_FAILED' >&2; exit 2; }
    echo 'THEME_ROLLED_BACK_DATABASE_NOT_MODIFIED' >&2
  fi
  exit "${code:-1}"
}
trap rollback EXIT
trap 'exit 130' HUP INT TERM
mv wp-content/themes/farmtree-native "$base/pre-theme"
mv "$base/stage/wp-content/themes/farmtree-native" wp-content/themes/farmtree-native
sha256sum -c --quiet "$base/target.sha256"
find wp-content/plugins/farmtree-content -type f -exec sha256sum {} \; | LC_ALL=C sort > "$base/plugin-after.sha256"
find wp-content/themes/farmtree -type f -exec sha256sum {} \; | LC_ALL=C sort > "$base/legacy-after.sha256"
cmp "$base/plugin.sha256" "$base/plugin-after.sha256"
cmp "$base/legacy.sha256" "$base/legacy-after.sha256"
status=$(curl -sS --max-time 30 -D "$base/http.headers" -o "$base/http.html" -w '%{http_code}' "https://farmtree.eu/?ft_release=$sha")
test "$status" = 200
if grep -Eqi 'Coming Soon|<meta[^>]+name=.robots.[^>]+content=.[^>]*noindex' "$base/http.html" || grep -Eqi '^x-robots-tag:.*noindex' "$base/http.headers"; then exit 1; fi
snapshot > "$base/state-after.txt"
cron_snapshot > "$base/cron-after.json"
cmp "$base/state-before.txt" "$base/state-after.txt"
# No blanket volatility allowance: a new semantic delta stops this release and
# retains both inventories for attribution, even if a concurrent request caused it.
cmp "$base/cron-before.json" "$base/cron-after.json"
(cd "$base" && sha256sum -c --quiet backup.sha256)
trap - EXIT HUP INT TERM
echo "THEME_RELEASE_VERIFIED $sha"
echo "BACKUP_REFERENCE $release"
echo 'DATABASE_WRITES_NONE_BY_RUNNER; BROWSER_QA_REQUIRED'
