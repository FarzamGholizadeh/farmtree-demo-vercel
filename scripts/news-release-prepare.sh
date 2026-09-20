#!/usr/bin/env bash
# Off-webroot staging and fresh backups only; no WordPress bootstrap or APPLY.
set -Eeuo pipefail
umask 077
root=/home/u80341p492940/domains/farmtree.eu/public_html
recovery=/home/u80341p492940/farmtree-recovery-backups
sha=${1:?}; release=${2:?}; archive=${3:?}; target=${4:?}; baseline=${5:?}; helpers=${6:?}
[[ "$sha" =~ ^[a-f0-9]{40}$ && "$release" =~ ^news12-[a-f0-9]{40}-[0-9]+$ && "$release" = news12-"$sha"-* ]]
for h in "$archive" "$target" "$baseline" "$helpers"; do [[ "$h" =~ ^[a-f0-9]{64}$ ]]; done
test "$(realpath "$root")" = "$root"; test "$(realpath "$recovery")" = "$recovery"
exec 9>"$recovery/.farmtree-production.lock"; flock -n 9
base="$recovery/$release"; test ! -L "$base"; cd "$base"
for file in runtime.tar.gz target.sha256 baseline.sha256 helpers.sha256; do test -f "$file"; test ! -L "$file"; done
printf '%s  runtime.tar.gz\n%s  target.sha256\n%s  baseline.sha256\n%s  helpers.sha256\n' "$archive" "$target" "$baseline" "$helpers" | sha256sum -c --quiet -
sed -En 's/^[a-f0-9]{64}  ([A-Za-z0-9_.-]+)$/\1/p' helpers.sha256 > helper-prepare.paths
test -s helper-prepare.paths
test "$(wc -l < helper-prepare.paths)" -eq "$(wc -l < helpers.sha256)"
while IFS= read -r file; do test -f "$file"; test ! -L "$file"; done < helper-prepare.paths
sha256sum -c --quiet helpers.sha256
for path in stage database.sql runtime-before.tar.gz backup-check-prepare; do test ! -e "$path"; test ! -L "$path"; done
tar -tzf runtime.tar.gz > archive.paths
tar -tvzf runtime.tar.gz > archive.types
if grep -v '^-' archive.types; then exit 1; fi
if grep -Ev '^wp-content/(themes/farmtree-native|plugins/farmtree-content)/[A-Za-z0-9_./-]+$' archive.paths || grep -E '(^|/)\.\.?(/|$)|//' archive.paths; then exit 1; fi
LC_ALL=C sort archive.paths > archive.sorted
sed 's/^[a-f0-9]\{64\}  //' target.sha256 | LC_ALL=C sort > target.paths
cmp archive.sorted target.paths
test "$(wc -l < archive.sorted)" = "$(LC_ALL=C sort -u archive.sorted | wc -l)"
mkdir stage; tar -xzf runtime.tar.gz --no-same-owner --no-same-permissions -C stage
test "$(find stage -type l | wc -l)" -eq 0
(cd stage && sha256sum -c --quiet "$base/target.sha256")
find stage -name '*.php' -type f -print0 > php.list
while IFS= read -r -d '' f; do php -l "$f"; done < php.list > php-lint.txt
test -s php-lint.txt
cd "$root"
for p in wp-content wp-content/themes wp-content/plugins wp-content/themes/farmtree-native wp-content/themes/farmtree wp-content/plugins/farmtree-content; do test -d "$p"; test ! -L "$p"; done
test "$(find wp-content/themes/farmtree-native wp-content/plugins/farmtree-content wp-content/themes/farmtree -type l | wc -l)" -eq 0
find wp-content/themes/farmtree-native wp-content/plugins/farmtree-content -type f -exec sha256sum {} \; | LC_ALL=C sort > "$base/runtime-before.sha256"
LC_ALL=C sort "$base/baseline.sha256" > "$base/baseline.sorted"
cmp "$base/runtime-before.sha256" "$base/baseline.sorted"
prefix=$(wp db prefix); [[ "$prefix" =~ ^[A-Za-z0-9_]+$ ]]
wp db query --batch --skip-column-names "SELECT option_name,HEX(option_value) FROM ${prefix}options WHERE option_name IN ('stylesheet','template','active_plugins','blog_public','show_on_front','page_on_front','seedprod_settings','ft_ai_settings');" | php "$base/state-gates.php"
wp db export "$base/database.sql" --single-transaction --skip-lock-tables --quiet
test -s "$base/database.sql"; grep -q 'CREATE TABLE' "$base/database.sql"; grep -q 'INSERT INTO' "$base/database.sql"
tar -czf "$base/runtime-before.tar.gz" wp-content/themes/farmtree-native wp-content/plugins/farmtree-content
test -s "$base/runtime-before.tar.gz"; tar -tzf "$base/runtime-before.tar.gz" >/dev/null
mkdir "$base/backup-check-prepare"
tar -xzf "$base/runtime-before.tar.gz" --no-same-owner --no-same-permissions -C "$base/backup-check-prepare"
(cd "$base/backup-check-prepare" && sha256sum -c --quiet "$base/runtime-before.sha256")
find wp-content/themes/farmtree -type f -exec sha256sum {} \; | LC_ALL=C sort > "$base/legacy.sha256"
cd "$base"
sha256sum database.sql runtime-before.tar.gz runtime-before.sha256 legacy.sha256 php-lint.txt > backup.sha256
sha256sum -c --quiet backup.sha256
echo 'NEWS12_STAGE_AND_BACKUPS_VERIFIED; NO_BOOTSTRAP_APPLY_OR_LIVE_FILE_REPLACEMENT'
