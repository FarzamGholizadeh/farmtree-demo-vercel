<?php
// Disposable local Playground only. Never deploy this test.
require_once '/wordpress/wp-load.php';
function ft_news_assert($ok, $message) { if (!$ok) throw new RuntimeException($message); }
function ft_news_reject($callable, $message) {
    try { $callable(); } catch (Throwable $e) { return; }
    throw new RuntimeException('Expected rejection: ' . $message);
}
try {
    switch_theme('farmtree-native');
    update_option('permalink_structure', '/%postname%/');
    define('WP_CLI', true);
    class WP_CLI { public static function add_command($name, $class) {} }
    require_once WP_CONTENT_DIR . '/plugins/farmtree-content/farmtree-content.php';
    farmtree_content_register_customer_segments();
    farmtree_content_register_proof_stories();
    flush_rewrite_rules(false);
    // Remove only Playground's canned sample post, absent from production.
    $sample = get_page_by_path('hello-world', OBJECT, 'post');
    if ($sample) wp_delete_post($sample->ID, true);
    $sha = str_repeat('a', 40); $backup = str_repeat('b', 64);
    $options = ['expected_site' => home_url('/'), 'expected_theme' => 'farmtree-native', 'source_commit' => $sha];
    $old = new FarmTree_Content_Reconciler();
    $old->apply_plan($old->build_plan($options), $sha, $backup);
    foreach ($old->build_plan($options)['operations']['posts'] as $op) if ($op['key'] === 'page.en.home') $home = $op['id'];
    update_option('show_on_front', 'page'); update_option('page_on_front', $home);
    update_option('blog_public', '1');
    update_option('seedprod_settings', wp_json_encode(['enable_coming_soon_mode' => false, 'enable_maintenance_mode' => false]));
    update_option('ft_ai_settings', ['enabled' => 0]);
    update_option('active_plugins', ['farmtree-content/farmtree-content.php']);
    // Runtime-first deployment must render safely before the twelve new posts exist.
    require_once get_theme_file_path('inc/editorial-hub.php');
    $oldNews = get_posts(['post_type'=>'post', 'post_status'=>'publish', 'numberposts'=>-1, 'meta_key'=>'_farmtree_content_managed_key']);
    ft_news_assert(count($oldNews) === 9, 'Expected nine existing News articles');
    $hubBefore = farmtree_native_render_editorial_hub();
    preg_match_all('/data-ft-story="(\d+)"/', $hubBefore, $hubIds);
    ft_news_assert(count($hubIds[1]) === 9 && count(array_unique($hubIds[1])) === 9, 'Candidate hub must render nine unique cards before content apply');
    ft_news_assert(str_contains($hubBefore, 'id="insights-featured"') && str_contains($hubBefore, 'id="insights-latest"') && str_contains($hubBefore, 'ft-editorial-explore'), 'Candidate old-content sections missing');
    global $wp_query;
    $savedQuery = $wp_query;
    $wp_query = new WP_Query(['page_id'=>$home]);
    $queryBlock = new WP_Block(['blockName'=>'core/post-template','attrs'=>[], 'innerBlocks'=>[], 'innerHTML'=>'','innerContent'=>[]], ['queryId'=>2]);
    $homeQuery = apply_filters('query_loop_block_query_vars', ['post_type'=>'post','post_status'=>'publish','posts_per_page'=>3], $queryBlock);
    $homeSlugs = array_map(static fn($post) => $post->post_name, get_posts($homeQuery)); sort($homeSlugs);
    $expectedHomeSlugs = ['farmtree-water-erosion-microclimate-model-update-2026','eu-carbon-farming-methodologies-agroforestry-2026','carbon-pricing-2026-nature-project-quality']; sort($expectedHomeSlugs);
    ft_news_assert($homeSlugs === $expectedHomeSlugs, 'Candidate Homepage must preserve its approved old three cards');
    $wp_query = $savedQuery;
    $excluded = ['page.en.home','page.en.platform','page.en.proof_stories','page.en.customer_segments','page.en.blog','page.en.solutions'];
    foreach ($old->build_plan($options)['operations']['posts'] as $op) {
        if (in_array($op['key'], $excluded, true)) wp_update_post(['ID'=>$op['id'], 'post_content'=>get_post($op['id'])->post_content . "\n<!-- intentional unrelated production edit -->"]);
    }
    $template = file_get_contents(get_theme_file_path('templates/page-blog.html'));
    ft_news_assert(str_contains($template, 'farmtree/editorial-hub') && !str_contains($template, 'wp:post-content'), 'Blog presentation must not consume or reconcile Page body');
    add_filter('pre_http_request', static fn () => ['response' => ['code' => 200], 'headers' => [], 'body' => '<main class="ft-native-home">FarmTree</main>', 'cookies' => []]);
    $r = new FarmTree_Content_Reconciler(true); $options['post_launch_news12'] = true;
    $cli = new FarmTree_Content_CLI_Command(); $dry = new ReflectionMethod($cli, 'build_dry_run_plan');
    global $wpdb;
    $manualId = wp_insert_post(['post_type'=>'page','post_status'=>'draft','post_title'=>'Independent fixture','post_name'=>'news12-independent-fixture','post_content'=>'preserve manual fixture']);
    update_option('news12_fixture_option', 'preserve');
    $wpdb->query("CREATE TABLE {$wpdb->prefix}news12_fixture (id INTEGER PRIMARY KEY, payload TEXT)");
    $wpdb->query("INSERT INTO {$wpdb->prefix}news12_fixture (id,payload) VALUES (1,'preserve')");
    $r->set_news12_commit_guard(static function () use ($wpdb, $manualId): void {
        ft_news_assert($wpdb->get_var($wpdb->prepare("SELECT post_content FROM {$wpdb->posts} WHERE ID=%d", $manualId)) === 'preserve manual fixture', 'Precommit unrelated post changed');
        ft_news_assert($wpdb->get_var("SELECT option_value FROM {$wpdb->options} WHERE option_name='news12_fixture_option'") === 'preserve', 'Precommit unrelated option changed');
        ft_news_assert($wpdb->get_var("SELECT payload FROM {$wpdb->prefix}news12_fixture WHERE id=1") === 'preserve', 'Precommit custom row changed');
    });
    $snapshot = static function () use ($wpdb) {
        $state = [];
        foreach ([$wpdb->posts, $wpdb->postmeta, $wpdb->options, $wpdb->terms, $wpdb->termmeta, $wpdb->term_taxonomy, $wpdb->term_relationships] as $table) $state[$table] = $wpdb->get_results("SELECT * FROM {$table}", ARRAY_A);
        return hash('sha256', serialize($state));
    };
    $before = $snapshot(); $plan = $dry->invoke($cli, $r, $options);
    ft_news_assert($before === $snapshot(), 'Dry-run changed database');
    ft_news_assert($plan['summary']['conflict'] === 0 && $plan['summary']['update'] === 0, 'Unexpected plan: ' . wp_json_encode($plan['conflicts']));
    ft_news_assert($plan['summary'] === ['create'=>29,'update'=>0,'unchanged'=>0,'conflict'=>0,'skipped'=>0], 'News-only initial totals');
    $manifest = require FARMTREE_CONTENT_DIR . 'includes/news12-content-manifest.php';
    foreach (['terms'=>'terms','media'=>'assets','posts'=>'entities'] as $group=>$collection) ft_news_assert(array_column($plan['operations'][$group], 'key') === $manifest['news12_keys'][$collection], 'Exact News12 allowlist');
    ft_news_assert(!$plan['operations']['checks'] && !$plan['operations']['options'] && !$plan['operations']['embedded'], 'No unrelated operations');
    foreach ($excluded as $key) ft_news_assert(!str_contains(wp_json_encode($plan), $key), 'Excluded Page in plan');
    $scopeCheck = new ReflectionMethod($r, 'news12_scope_errors');
    $foreign = $plan['operations']; $foreign['posts'][] = ['key'=>'page.en.home','action'=>'unchanged','reason'=>'exact','id'=>$home];
    ft_news_assert((bool) $scopeCheck->invoke($r, $foreign, false), 'Unknown unchanged target bypassed scope');
    ft_news_assert(count(array_filter($plan['operations']['posts'], fn ($op) => $op['action'] === 'create')) === 12, 'Expected twelve post creates');
    ft_news_assert(count(array_filter($plan['operations']['media'], fn ($op) => $op['action'] === 'create')) === 12, 'Expected twelve image creates');
    $tampered = $plan; $tampered['plan_digest'] = str_repeat('0', 64);
    ft_news_reject(fn () => $r->apply_plan($tampered, $sha, $backup), 'tampered digest');
    ft_news_reject(fn () => $r->build_plan(array_diff_key($options, ['post_launch_news12' => 1])), 'mode downgrade');
    ft_news_assert($before === $snapshot(), 'Rejected plan mutated database');
    $newPost = array_values(array_filter($plan['operations']['posts'], fn ($op) => $op['action'] === 'create'))[0];
    $collision = wp_insert_post(['post_type' => 'post', 'post_status' => 'draft', 'post_title' => 'Unrelated manual content', 'post_name' => $newPost['desired']['post_name']]);
    $conflicted = $dry->invoke($cli, $r, $options);
    ft_news_assert($conflicted['summary']['conflict'] > 0, 'Unowned slug collision was not blocked');
    ft_news_reject(fn () => $r->apply_plan($plan, $sha, $backup), 'stale preflight after concurrent content');
    ft_news_assert(get_post($collision)->post_title === 'Unrelated manual content', 'Manual record overwritten');
    wp_delete_post($collision, true); // Disposable fixture cleanup, never production.
    $plan = $dry->invoke($cli, $r, $options);
    $protected = $plan['public_state_sha256'];
    $uploadsSnapshot = static function () {
        $directory = wp_upload_dir()['basedir']; $files = [];
        if (is_dir($directory)) foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($directory, FilesystemIterator::SKIP_DOTS)) as $file) {
            if ($file->isFile()) $files[substr($file->getPathname(), strlen($directory))] = hash_file('sha256', $file->getPathname());
        }
        ksort($files); return $files;
    };
    $uploadsBefore = $uploadsSnapshot();
    $indexingMutator = static function ($id, $post) use ($newPost) {
        if ($post->post_name === $newPost['desired']['post_name']) update_option('blog_public', '0');
    };
    add_action('wp_insert_post', $indexingMutator, 10, 2);
    ft_news_reject(fn () => $r->apply_plan($plan, $sha, $backup), 'hook-induced indexing mutation');
    remove_action('wp_insert_post', $indexingMutator, 10);
    ft_news_assert((string) get_option('blog_public') === '1', 'Indexing mutation not rolled back');
    ft_news_assert($uploadsBefore === $uploadsSnapshot(), 'Failed apply left media files behind');
    $plan = $dry->invoke($cli, $r, $options);
    ft_news_assert($plan['summary']['create'] === 29 && $plan['summary']['conflict'] === 0, 'Failed apply left content/media behind');
    foreach (['post','option','custom'] as $injection) {
        $mutator = static function ($id, $post) use ($wpdb, $newPost, $manualId, $injection) {
            if ($post->post_name !== $newPost['desired']['post_name']) return;
            if ($injection === 'post') $wpdb->update($wpdb->posts, ['post_content'=>'unapproved'], ['ID'=>$manualId]);
            elseif ($injection === 'option') $wpdb->update($wpdb->options, ['option_value'=>'unapproved'], ['option_name'=>'news12_fixture_option']);
            else $wpdb->query("UPDATE {$wpdb->prefix}news12_fixture SET payload='unapproved' WHERE id=1");
        };
        add_action('wp_insert_post', $mutator, 10, 2);
        ft_news_reject(fn () => $r->apply_plan($plan, $sha, $backup), 'precommit unrelated ' . $injection . ' mutation');
        remove_action('wp_insert_post', $mutator, 10);
        ft_news_assert($wpdb->get_var($wpdb->prepare("SELECT post_content FROM {$wpdb->posts} WHERE ID=%d", $manualId)) === 'preserve manual fixture', 'Unrelated post rollback failed');
        ft_news_assert($wpdb->get_var("SELECT option_value FROM {$wpdb->options} WHERE option_name='news12_fixture_option'") === 'preserve', 'Unrelated option rollback failed');
        ft_news_assert($wpdb->get_var("SELECT payload FROM {$wpdb->prefix}news12_fixture WHERE id=1") === 'preserve', 'Custom row rollback failed');
        ft_news_assert($uploadsBefore === $uploadsSnapshot(), 'Precommit failure left uploaded files');
        $plan = $dry->invoke($cli, $r, $options);
    }
    $optionFingerprints = static function () use ($wpdb) {
        $out = []; foreach ($wpdb->get_results("SELECT * FROM {$wpdb->options}", ARRAY_A) as $row) $out[$row['option_name']] = hash('sha256', serialize($row)); ksort($out); return $out;
    };
    $optionsBeforeApply = $optionFingerprints();
    $maxPostIdBefore = (int) $wpdb->get_var("SELECT MAX(ID) FROM {$wpdb->posts}");
    // Remove only the disposable fixture's earlier seeded ping event, without
    // executing cron. Production never runs this test or this cleanup.
    wp_clear_scheduled_hook('do_pings');
    $optionsBeforeApply = $optionFingerprints();
    $cronBeforeApply = get_option('cron');
    $categoryCacheBefore = $wpdb->get_row("SELECT * FROM {$wpdb->options} WHERE option_name='category_children'", ARRAY_A);
    $corePingPriority = has_action('publish_post', '_publish_post_hook');
    ft_news_assert(false !== $corePingPriority, 'Expected real core publish callback');
    ft_news_assert(!defined('WP_IMPORTING'), 'WP_IMPORTING must be undefined to test real core behavior');
    ft_news_assert(false === wp_next_scheduled('do_pings'), 'Fixture still has pending ping event');
    $existingRows = [];
    $primary = ['posts'=>['ID'],'postmeta'=>['meta_id'],'terms'=>['term_id'],'termmeta'=>['meta_id'],'term_taxonomy'=>['term_taxonomy_id'],'term_relationships'=>['object_id','term_taxonomy_id']];
    $rowKey = static fn ($row, $columns) => implode(':', array_map(static fn ($column) => $row[$column], $columns));
    foreach ($primary as $table => $columns) foreach ($wpdb->get_results('SELECT * FROM ' . $wpdb->$table, ARRAY_A) as $row) $existingRows[$table][$rowKey($row, $columns)] = $row;
    $result = $r->apply_plan($plan, $sha, $backup);
    $createdKinds = array_count_values(array_column(array_filter($result['results'], static fn ($op) => $op['status'] === 'created'), 'kind'));
    ft_news_assert(($createdKinds['post'] ?? 0) === 12 && ($createdKinds['media'] ?? 0) === 12 && ($createdKinds['term'] ?? 0) === 5 && count($createdKinds) === 3, 'Actual receipt kinds differ from evidence gate');
    $optionsAfterApply = $optionFingerprints();
    $optionChanges = array_keys(array_diff_assoc($optionsAfterApply, $optionsBeforeApply) + array_diff_assoc($optionsBeforeApply, $optionsAfterApply));
    $categoryCacheAfter = $wpdb->get_row("SELECT * FROM {$wpdb->options} WHERE option_name='category_children'", ARRAY_A);
    $cacheChangedFields = array_keys(array_diff_assoc($categoryCacheBefore ?? [], $categoryCacheAfter ?? []) + array_diff_assoc($categoryCacheAfter ?? [], $categoryCacheBefore ?? []));
    ft_news_assert(!$optionChanges || ($optionChanges === ['category_children'] && $cacheChangedFields === ['option_id']), 'Full option rows changed beyond exact category cache row ID: ' . wp_json_encode($optionChanges));
    foreach ($primary as $table => $columns) {
        $afterRows = []; foreach ($wpdb->get_results('SELECT * FROM ' . $wpdb->$table, ARRAY_A) as $row) $afterRows[$rowKey($row, $columns)] = $row;
        foreach ($existingRows[$table] ?? [] as $key => $beforeRow) {
            ft_news_assert(isset($afterRows[$key]), 'Existing row deleted: ' . $table);
            $afterRow = $afterRows[$key];
            if ($table === 'term_taxonomy') {
                $added = (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$wpdb->term_relationships} WHERE term_taxonomy_id=%d AND object_id>%d", $beforeRow['term_taxonomy_id'], $maxPostIdBefore));
                ft_news_assert((int)$afterRow['count'] === (int)$beforeRow['count'] + $added, 'Unrelated taxonomy count change');
                unset($beforeRow['count'], $afterRow['count']);
            }
            ft_news_assert($beforeRow === $afterRow, 'Existing row changed: ' . $table);
        }
    }
    $createdPostTypes = $wpdb->get_results($wpdb->prepare("SELECT post_type,COUNT(*) AS records FROM {$wpdb->posts} WHERE ID > %d GROUP BY post_type", $maxPostIdBefore), ARRAY_A);
    ft_news_assert($corePingPriority === has_action('publish_post', '_publish_post_hook'), 'Core callback priority not restored');
    ft_news_assert($cronBeforeApply === get_option('cron') && false === wp_next_scheduled('do_pings'), 'News12 queued cron work');
    ft_news_assert((int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$wpdb->postmeta} WHERE post_id > %d AND meta_key IN ('_encloseme','_pingme','_trackbackme')", $maxPostIdBefore)) === 0, 'New articles queued ping metadata');
    $final = $dry->invoke($cli, $r, $options);
    ft_news_assert($final['summary']['conflict'] === 0 && $final['summary']['create'] === 0 && $final['summary']['update'] === 0, 'Not idempotent');
    ft_news_assert($protected === $final['public_state_sha256'], 'Protected state changed');
    $oldFinal = $old->build_plan(array_diff_key($options, ['post_launch_news12' => 1]));
    ft_news_assert($oldFinal['summary']['conflict'] === 6 && $oldFinal['summary']['create'] === 0 && $oldFinal['summary']['update'] === 0, 'Excluded six Page edits were not preserved');
    ft_news_assert($final['summary'] === ['create'=>0,'update'=>0,'unchanged'=>29,'conflict'=>0,'skipped'=>0], 'Exact News-only idempotence totals');
    $new = array_values(array_filter($final['operations']['posts'], fn ($op) => in_array($op['key'], array_column(array_filter($plan['operations']['posts'], fn ($op) => $op['action'] === 'create'), 'key'), true)));
    foreach ($new as $newOperation) {
        $post = get_post($newOperation['id']);
        ft_news_assert($post->post_date !== '0000-00-00 00:00:00' && $post->post_status === 'publish', 'Actual publication date/status missing');
        ft_news_assert($post->comment_status === 'closed' && $post->ping_status === 'closed', 'Comments or pings open');
    }
    wp_update_post(['ID' => $post->ID, 'post_content' => $post->post_content . '\nManual edit']);
    ft_news_assert($dry->invoke($cli, $r, $options)['summary']['conflict'] > 0, 'Manual edit not blocked');
    file_put_contents('/farmtree-test/result.json', wp_json_encode(['ok' => true, 'initial' => $plan['summary'], 'final' => $final['summary'], 'manualConflict' => true, 'staleDigestRejected' => true, 'unownedCollisionRejected' => true, 'hookIndexingMutationRolledBack' => true, 'precommitUnrelatedMutationRollback' => ['post','option','custom_table'], 'protectedStateUnchanged' => true, 'optionChangesDuringApply' => $optionChanges, 'categoryCacheChangedColumns' => $cacheChangedFields, 'createdPostTypes' => $createdPostTypes, 'wpImportingDefined' => defined('WP_IMPORTING'), 'corePingPriorityRestored' => $corePingPriority, 'noCronOrPingMetadataCreated' => true]));
} catch (Throwable $e) {
    file_put_contents('/farmtree-test/result.json', wp_json_encode(['ok' => false, 'error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]));
    throw $e;
}
