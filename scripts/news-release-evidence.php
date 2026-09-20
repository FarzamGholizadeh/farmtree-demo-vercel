<?php
/** Off-webroot database-only evidence. Never bootstraps WordPress. */
function news_db(string $sql): array {
    if (isset($GLOBALS['farmtree_news_evidence_reader'])) {
        if (!$GLOBALS['farmtree_news_evidence_reader'] instanceof Closure || !preg_match('/^(SELECT|SHOW)\b/i', ltrim($sql))) throw new RuntimeException('Invalid same-connection evidence reader');
        return ($GLOBALS['farmtree_news_evidence_reader'])($sql);
    }
    $pipes = [];
    $p = proc_open(['wp', 'db', 'query', '--batch', '--skip-column-names', $sql], [0 => ['pipe', 'r'], 1 => ['pipe', 'w'], 2 => ['pipe', 'w']], $pipes);
    if (!is_resource($p)) throw new RuntimeException('Database reader unavailable');
    fclose($pipes[0]); $out = stream_get_contents($pipes[1]); $err = stream_get_contents($pipes[2]); fclose($pipes[1]); fclose($pipes[2]);
    if (proc_close($p) !== 0) throw new RuntimeException('Database evidence query failed');
    return array_values(array_filter(explode("\n", rtrim($out, "\r\n")), static fn ($v) => $v !== ''));
}
function news_id(string $name): string {
    if (!preg_match('/^[a-zA-Z0-9_]+$/D', $name)) throw new RuntimeException('Unsafe database identifier');
    return '`' . $name . '`';
}
function news_list(array $ids): string { return $ids ? implode(',', array_map(static fn ($id) => (int) $id, $ids)) : '0'; }
function news_keys(array $keys): string { return implode(',', array_map(static fn ($key) => "UNHEX('" . bin2hex($key) . "')", $keys)); }
function news_read_json(string $path): array { return json_decode(file_get_contents($path), true, 512, JSON_THROW_ON_ERROR); }
function news_uploads(string $prefix, array $postIds): array {
    $root = realpath(getcwd()); $directory = $root . '/wp-content/uploads';
    if (!is_dir($directory) || is_link($directory) || realpath($directory) !== $directory) throw new RuntimeException('Unsupported uploads directory');
    $configured = news_db('SELECT HEX(option_value) FROM ' . news_id($prefix . 'options') . " WHERE option_name='upload_path'");
    if ($configured && !in_array(hex2bin($configured[0]), ['', 'wp-content/uploads'], true)) throw new RuntimeException('Custom upload path requires audited support');
    $allowed = [];
    $add = static function ($relative) use (&$allowed) {
        if (!is_string($relative) || !preg_match('~^[A-Za-z0-9_./-]+$~D', $relative) || str_starts_with($relative, '/') || preg_match('~(^|/)\.\.?(/|$)|//~', $relative)) throw new RuntimeException('Unsafe attachment path');
        $allowed[hash('sha256', $relative)] = true;
    };
    foreach (news_db('SELECT meta_key,HEX(meta_value) FROM ' . news_id($prefix . 'postmeta') . ' WHERE post_id IN (' . news_list($postIds) . ") AND meta_key IN ('_wp_attached_file','_wp_attachment_metadata')") as $row) {
        [$key, $hex] = explode("\t", $row); $value = hex2bin($hex);
        if ($key === '_wp_attached_file') { $add($value); continue; }
        $metadata = unserialize($value, ['allowed_classes' => false]);
        if (!is_array($metadata) || !isset($metadata['file'])) throw new RuntimeException('Invalid attachment metadata');
        $add($metadata['file']); $folder = dirname($metadata['file']);
        foreach ($metadata['sizes'] ?? [] as $size) {
            if (!is_array($size) || !isset($size['file']) || basename($size['file']) !== $size['file']) throw new RuntimeException('Invalid generated image path');
            $add(($folder === '.' ? '' : $folder . '/') . $size['file']);
        }
        if (isset($metadata['original_image'])) {
            if (basename($metadata['original_image']) !== $metadata['original_image']) throw new RuntimeException('Invalid original image path');
            $add(($folder === '.' ? '' : $folder . '/') . $metadata['original_image']);
        }
    }
    $files = []; $scoped = [];
    foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($directory, FilesystemIterator::SKIP_DOTS)) as $file) {
        if ($file->isLink()) throw new RuntimeException('Uploads symlink is unsupported');
        if (!$file->isFile()) continue;
        $key = hash('sha256', substr($file->getPathname(), strlen($directory) + 1));
        $files[$key] = hash_file('sha256', $file->getPathname());
        if (isset($allowed[$key])) $scoped[$key] = $files[$key];
    }
    foreach ($allowed as $key => $_) if (!isset($files[$key])) throw new RuntimeException('Declared attachment file is missing');
    ksort($files); ksort($scoped); return ['files' => $files, 'scopedFiles' => $scoped];
}
function news_capture(string $prefix, ?array $plan): array {
    news_id($prefix . 'posts');
    $scope = ['postIds' => [], 'termIds' => [], 'allowedTermIds' => []];
    if ($plan) {
        $newTerms = array_values(array_filter($plan['operations']['terms'] ?? [], static fn ($op) => $op['action'] === 'create'));
        if (count($newTerms) !== 5 || array_filter($newTerms, static fn ($op) => ($op['desired']['taxonomy'] ?? '') !== 'category' || (int) ($op['desired']['parent'] ?? -1) !== 0)) throw new RuntimeException('Evidence scope requires exactly five approved root categories');
        foreach (['posts' => 'postIds', 'media' => 'postIds', 'terms' => 'termIds'] as $group => $destination) {
            $keys = array_column(array_filter($plan['operations'][$group], static fn ($op) => $op['action'] === 'create'), 'key');
            if (!$keys) continue;
            $table = $destination === 'termIds' ? 'termmeta' : 'postmeta'; $id = $destination === 'termIds' ? 'term_id' : 'post_id';
            $ids = news_db('SELECT ' . $id . ' FROM ' . news_id($prefix . $table) . " WHERE meta_key='_farmtree_content_managed_key' AND meta_value IN (" . news_keys($keys) . ') ORDER BY ' . $id);
            if (count($ids) !== count(array_unique($ids))) throw new RuntimeException('Duplicate managed key evidence');
            $scope[$destination] = array_merge($scope[$destination], array_map('intval', $ids));
        }
        $references = $plan['reference_term_ids'] ?? [];
        if (array_keys($references) !== ['category.en.policy-standards'] || !is_int($references['category.en.policy-standards']) || $references['category.en.policy-standards'] < 1) throw new RuntimeException('Unexpected existing category reference');
        $scope['allowedTermIds'] = array_values(array_unique(array_merge($scope['termIds'], array_values($references))));
    }
    $postIds = news_list($scope['postIds']); $termIds = news_list($scope['termIds']);
    $metaKeys = ['_farmtree_content_managed_key', '_farmtree_content_manifest_version', '_farmtree_content_source_hash', '_farmtree_content_applied_hash', '_farmtree_content_release_commit', '_farmtree_content_asset_sha256', '_farmtree_content_backup_evidence_sha256', '_thumbnail_id', '_wp_attached_file', '_wp_attachment_metadata', '_wp_attachment_image_alt'];
    $allowed = [
        'posts' => "ID IN ($postIds)",
        'postmeta' => "post_id IN ($postIds) AND meta_key IN (" . news_keys($metaKeys) . ')',
        'terms' => "term_id IN ($termIds)",
        'termmeta' => "term_id IN ($termIds) AND meta_key IN (" . news_keys(array_slice($metaKeys, 0, 7)) . ')',
        'term_taxonomy' => "term_id IN ($termIds) AND taxonomy='category'",
        'term_relationships' => "object_id IN ($postIds) AND term_taxonomy_id IN (SELECT term_taxonomy_id FROM " . news_id($prefix . 'term_taxonomy') . ' WHERE taxonomy=\'category\' AND term_id IN (' . news_list($scope['allowedTermIds']) . '))',
    ];
    $result = ['schemaVersion' => 1, 'tables' => [], 'scope' => $scope, 'categoryCounts' => [], 'newCategoryRelations' => [], 'categoryCache' => null, 'optionHashes' => news_db('SELECT option_name,SHA2(option_value,256) FROM ' . news_id($prefix . 'options') . ' ORDER BY option_name')];
    foreach (news_db('SHOW TABLES') as $table) {
        $columns = news_db('SHOW COLUMNS FROM ' . news_id($table));
        $fields = array_map(static fn ($row) => explode("\t", $row)[0], $columns);
        $suffix = str_starts_with($table, $prefix) ? substr($table, strlen($prefix)) : '';
        if ($suffix === 'term_taxonomy') $fields = array_values(array_diff($fields, ['count']));
        // Hex encodes individual values before JSON hashing: NULL remains distinct
        // from empty strings and delimiters cannot produce ambiguous fingerprints.
        $expression = 'SHA2(JSON_ARRAY(' . implode(',', array_map(static fn ($field) => 'HEX(' . news_id($field) . ')', $fields)) . '),256)';
        $rows = news_db('SELECT ' . $expression . ' FROM ' . news_id($table) . ' ORDER BY 1');
        $newRows = isset($allowed[$suffix]) ? news_db('SELECT ' . $expression . ' FROM ' . news_id($table) . ' WHERE ' . $allowed[$suffix] . ' ORDER BY 1') : [];
        // Hash schema inside SQL too, so mysql batch escaping/NULL formatting
        // cannot differ from the same-connection wpdb reader at precommit.
        $schema = news_db("SELECT SHA2(JSON_ARRAY(HEX(COLUMN_NAME),HEX(COLUMN_TYPE),HEX(IS_NULLABLE),HEX(COLUMN_DEFAULT),HEX(EXTRA),HEX(COLLATION_NAME)),256) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=UNHEX('" . bin2hex($table) . "') ORDER BY ORDINAL_POSITION");
        if (count($schema) !== count($columns)) throw new RuntimeException('Incomplete schema evidence');
        $result['tables'][$table] = ['schemaHash' => hash('sha256', json_encode($schema)), 'rows' => $rows, 'scopedRows' => $newRows];
        if ($suffix === 'options') {
            $withoutId = array_values(array_diff($fields, ['option_id']));
            $semantic = 'SHA2(JSON_ARRAY(' . implode(',', array_map(static fn ($field) => 'HEX(' . news_id($field) . ')', $withoutId)) . '),256)';
            $cache = news_db('SELECT ' . $expression . ',' . $semantic . ' FROM ' . news_id($table) . " WHERE option_name='category_children'");
            if (count($cache) > 1) throw new RuntimeException('Ambiguous category cache');
            if ($cache) { [$full, $meaning] = explode("\t", $cache[0]); $result['categoryCache'] = ['table' => $table, 'fullHash' => $full, 'semanticHash' => $meaning]; }
        }
    }
    foreach (news_db('SELECT term_taxonomy_id,count FROM ' . news_id($prefix . 'term_taxonomy') . ' ORDER BY term_taxonomy_id') as $row) { [$id, $count] = explode("\t", $row); $result['categoryCounts'][$id] = (int) $count; }
    foreach (news_db('SELECT term_taxonomy_id,COUNT(*) FROM ' . news_id($prefix . 'term_relationships') . " WHERE object_id IN ($postIds) GROUP BY term_taxonomy_id") as $row) { [$id, $count] = explode("\t", $row); $result['newCategoryRelations'][$id] = (int) $count; }
    ksort($result['tables']);
    $result['uploads'] = news_uploads($prefix, $scope['postIds']);
    return $result;
}
function news_subtract(array $all, array $subset): array {
    foreach ($subset as $row) { $index = array_search($row, $all, true); if ($index === false) throw new RuntimeException('Invalid row subset'); unset($all[$index]); }
    return array_values($all);
}
function news_compare(array $before, array $after, bool $apply): array {
    if ($before['optionHashes'] !== $after['optionHashes']) throw new RuntimeException('Option value changed; no volatility exception applies');
    if (!isset($before['uploads'], $after['uploads'])) throw new RuntimeException('Missing uploads evidence');
    $afterFiles = $after['uploads']['files'];
    if ($apply) {
        if ($before['uploads']['scopedFiles']) throw new RuntimeException('Initial create scope files already existed');
        foreach ($after['uploads']['scopedFiles'] as $key => $hash) {
            if (($afterFiles[$key] ?? null) !== $hash) throw new RuntimeException('Invalid scoped file fingerprint');
            unset($afterFiles[$key]);
        }
    }
    if ($before['uploads']['files'] !== $afterFiles) throw new RuntimeException('Unrelated uploaded files changed');
    if (array_keys($before['tables']) !== array_keys($after['tables'])) throw new RuntimeException('Database table set changed');
    $categoryCacheRowIdentityChurn = false;
    foreach ($before['tables'] as $name => $table) {
        $next = $after['tables'][$name];
        if ($table['schemaHash'] !== $next['schemaHash']) throw new RuntimeException('Database schema changed');
        if ($apply) {
            if ($table['scopedRows']) throw new RuntimeException('Initial create scope already existed');
            $next['rows'] = news_subtract($next['rows'], $next['scopedRows']);
            $oldCache = $before['categoryCache'] ?? null; $newCache = $after['categoryCache'] ?? null;
            if ($oldCache && $newCache && $oldCache['table'] === $name && $newCache['table'] === $name && $oldCache['fullHash'] !== $newCache['fullHash']) {
                // Exactly five approved root categories leave the hierarchy map
                // unchanged; core deletes/reinserts its cache row with a new ID.
                // Every other column (including autoload/value) must stay exact.
                if (count(array_unique($after['scope']['termIds'])) !== 5 || $oldCache['semanticHash'] !== $newCache['semanticHash']) throw new RuntimeException('Category cache changed beyond permitted row identity');
                $next['rows'] = news_subtract($next['rows'], [$newCache['fullHash']]);
                $next['rows'][] = $oldCache['fullHash']; sort($next['rows'], SORT_STRING);
                $categoryCacheRowIdentityChurn = true;
            }
        }
        if ($table['rows'] !== $next['rows']) throw new RuntimeException('Unrelated database rows changed: ' . $name);
    }
    foreach ($before['categoryCounts'] as $id => $count) {
        $increase = $apply ? ($after['newCategoryRelations'][$id] ?? 0) : 0;
        if (($after['categoryCounts'][$id] ?? null) !== $count + $increase) throw new RuntimeException('Unexplained existing taxonomy count delta');
    }
    if ($apply) foreach ($after['categoryCounts'] as $id => $count) {
        if (!array_key_exists($id, $before['categoryCounts']) && $count !== ($after['newCategoryRelations'][$id] ?? 0)) throw new RuntimeException('Unexplained new taxonomy count');
    }
    if (!$apply && $before !== $after) throw new RuntimeException('Dry-run database mutation');
    if ($apply && (count(array_unique($after['scope']['postIds'])) !== 24 || count(array_unique($after['scope']['termIds'])) !== 5)) throw new RuntimeException('Expected exact 24 distinct post/media IDs and five distinct terms');
    return ['ok' => true, 'database' => $apply ? 'exact_scoped_creates_only' : 'unchanged', 'categoryCacheRowIdentityChurn' => $categoryCacheRowIdentityChurn];
}
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    try {
        $mode = $argv[1] ?? '';
        if ($mode === 'capture') $result = news_capture($argv[2], isset($argv[3]) ? news_read_json($argv[3]) : null);
        elseif ($mode === 'compare') $result = news_compare(news_read_json($argv[2]), news_read_json($argv[3]), ($argv[4] ?? '') === 'apply');
        elseif ($mode === 'receipt') {
            $receipt = news_read_json($argv[2]); $phase = $argv[3]; $sha = $argv[4];
            if (($receipt['source_commit'] ?? null) !== $sha) throw new RuntimeException('Receipt source mismatch');
            $summary = $receipt['summary'] ?? [];
            if ($phase === 'apply') {
                if (($receipt['ok'] ?? false) !== true || ($receipt['transaction'] ?? '') !== 'committed' || ($receipt['postcondition'] ?? '') !== 'verified_by_final_dry_run' || ($summary['created'] ?? -1) !== 29 || ($summary['updated'] ?? -1) !== 0 || ($summary['adopted'] ?? -1) !== 0) throw new RuntimeException('Unexpected APPLY receipt');
                $created = array_filter($receipt['results'] ?? [], static fn ($op) => ($op['status'] ?? '') === 'created');
                $counts = array_count_values(array_column($created, 'kind'));
                if (($counts['post'] ?? 0) !== 12 || ($counts['media'] ?? 0) !== 12 || ($counts['term'] ?? 0) !== 5) throw new RuntimeException('Wrong APPLY create kinds');
            } else {
                $initial = in_array($phase, ['preflight', 'dry-run'], true);
                if (($summary['conflict'] ?? -1) !== 0 || ($summary['update'] ?? -1) !== 0 || ($summary['create'] ?? -1) !== ($initial ? 29 : 0) || ($summary['unchanged'] ?? -1) !== ($initial ? 0 : 29) || ($summary['skipped'] ?? -1) !== 0 || empty($receipt['post_launch_news12']) || ($receipt['profile'] ?? '') !== 'news12') throw new RuntimeException('Unexpected dry-run scope');
            }
            $result = ['ok' => true, 'source_commit' => $sha, 'phase' => $phase, 'summary' => $summary];
        }
        elseif ($mode === 'diagnostics') {
            $events = array_map(static fn ($line) => json_decode($line, true, 512, JSON_THROW_ON_ERROR), file($argv[2], FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES));
            if (($events[0]['type'] ?? '') !== 'window_start' || ($events[count($events)-1]['type'] ?? '') !== 'process_end') throw new RuntimeException('Incomplete diagnostic window');
            foreach ($events as $event) if (in_array($event['type'] ?? '', ['cron_update_proposed', 'cron_update_committed', 'diagnostic_saturation'], true) || !empty($event['unconfirmed_proposals']) || !empty($event['last_error_type'])) throw new RuntimeException('New cron activity or diagnostic failure; stop for attribution');
            $result = ['ok' => true, 'cron_activity' => 'none'];
        }
        else throw new RuntimeException('Unknown evidence mode');
        echo json_encode($result, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR) . "\n";
    } catch (Throwable $e) { fwrite(STDERR, $e->getMessage() . "\n"); exit(1); }
}
