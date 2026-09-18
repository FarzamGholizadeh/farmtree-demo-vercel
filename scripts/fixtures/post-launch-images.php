<?php
// Disposable local fixture only. Never deploy or execute this file on production.
require_once '/wordpress/wp-load.php';
function ft_assert($condition, $message) { if (!$condition) throw new RuntimeException($message); }
function ft_reject($callable, $message) {
    try { $callable(); } catch (Throwable $e) { return $e->getMessage(); }
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
    $sha = str_repeat('a', 40);
    $backup = str_repeat('b', 64);
    $options = ['expected_site' => home_url('/'), 'expected_theme' => 'farmtree-native', 'source_commit' => $sha];
    $r = new FarmTree_Content_Reconciler();
    $property = new ReflectionProperty($r, 'manifest');
    $desired = require '/farmtree-test/approved.php';
    $property->setValue($r, require '/farmtree-test/baseline.php');
    $initial = $r->build_plan($options);
    $r->apply_plan($initial, $sha, $backup);
    $ids = [];
    foreach ($r->build_plan($options)['operations']['posts'] as $op) $ids[$op['key']] = $op['id'];
    update_option('show_on_front', 'page');
    update_option('page_on_front', $ids['page.en.home']);
    update_option('blog_public', '1');
    update_option('seedprod_settings', wp_json_encode(['enable_coming_soon_mode' => false, 'enable_maintenance_mode' => false]));
    update_option('ft_ai_settings', ['enabled' => 0]);
    update_option('active_plugins', ['farmtree-content/farmtree-content.php']);
    $property->setValue($r, $desired);
    $options['post_launch_images'] = true;
    $probe = ['response' => ['code' => 200], 'headers' => [], 'body' => '<main class="ft-native-home">FarmTree</main>', 'cookies' => []];
    add_filter('pre_http_request', static function () use (&$probe) { return $probe; });
    $cli = new FarmTree_Content_CLI_Command();
    $dry = new ReflectionMethod($cli, 'build_dry_run_plan');
    global $wpdb;
    $snapshot = static function ($exclude_taxonomy_cache = false) use ($wpdb) {
        $state = [];
        foreach ([$wpdb->posts, $wpdb->postmeta, $wpdb->options, $wpdb->terms, $wpdb->termmeta, $wpdb->term_taxonomy, $wpdb->term_relationships] as $table) {
            $state[$table] = $wpdb->get_results("SELECT * FROM {$table}", ARRAY_A);
            if ($exclude_taxonomy_cache && $table === $wpdb->options) {
                $state[$table] = array_values(array_filter($state[$table], static fn ($row) => $row['option_name'] !== 'category_children'));
            }
        }
        return hash('sha256', serialize($state));
    };
    $before = $snapshot();
    $plan = $dry->invoke($cli, $r, $options);
    ft_assert($snapshot() === $before, 'Dry-run mutated tables');
    ft_assert($plan['summary']['update'] === 6 && $plan['summary']['conflict'] === 0 && $plan['summary']['create'] === 0, 'Expected exactly six updates: ' . wp_json_encode($plan['conflicts']));
    ft_assert(!$r->runtime_gate_errors(home_url('/'), 'farmtree-native', true), 'Public runtime gates failed');
    $rejections = [];
    foreach (['post_title' => 'Unapproved', 'post_status' => 'private', 'post_name' => 'new-url', 'post_excerpt' => 'Unapproved', 'menu_order' => 9] as $field => $value) {
        $bad = $desired;
        $bad['entities'][0]['fields'][$field] = $value;
        $property->setValue($r, $bad);
        ft_assert($r->build_plan($options)['summary']['conflict'] > 0, 'Field escaped scope: ' . $field);
        $rejections[] = $field;
    }
    $property->setValue($r, $desired);
    ft_assert($r->build_plan($options + ['set_front_page' => true])['summary']['conflict'] > 0, 'Front-page update allowed');
    $rejections[] = 'front_page';
    foreach (['page.en.home', 'page.en.team'] as $key) {
        $original = get_post_field('post_content', $ids[$key]);
        wp_update_post(wp_slash(['ID' => $ids[$key], 'post_content' => $original . '<p>Manual edit</p>']));
        ft_assert($r->build_plan($options)['summary']['conflict'] > 0, 'Manual edit escaped conflict');
        wp_update_post(wp_slash(['ID' => $ids[$key], 'post_content' => $original]));
        $rejections[] = 'manual:' . $key;
    }
    $meta = get_post_meta($ids['page.en.platform'], '_farmtree_content_managed_key', true);
    delete_post_meta($ids['page.en.platform'], '_farmtree_content_managed_key');
    ft_assert($r->build_plan($options)['summary']['conflict'] > 0, 'Ownership removal accepted');
    update_post_meta($ids['page.en.platform'], '_farmtree_content_managed_key', $meta);
    $rejections[] = 'ownership';
    $probe['headers'] = ['x-robots-tag' => 'noindex, nofollow'];
    ft_assert($r->runtime_gate_errors(home_url('/'), 'farmtree-native', true), 'Noindex response accepted');
    $probe['headers'] = [];
    $probe['response']['code'] = 503;
    ft_assert($r->runtime_gate_errors(home_url('/'), 'farmtree-native', true), '503 response accepted');
    $probe['response']['code'] = 200;
    $rejections[] = 'public_probe_noindex_and_503';
    foreach (['blog_public' => '0', 'seedprod_settings' => wp_json_encode(['enable_coming_soon_mode' => true]), 'ft_ai_settings' => ['enabled' => 1], 'page_on_front' => $ids['page.en.team']] as $key => $bad) {
        $original = get_option($key);
        update_option($key, $bad);
        $stable = $snapshot();
        ft_reject(static fn () => $r->apply_plan($plan, $sha, $backup), $key);
        ft_assert($stable === $snapshot(), 'Rejected gate performed writes');
        update_option($key, $original);
        $rejections[] = $key;
    }
    $plan = $dry->invoke($cli, $r, $options);
    $args = ['post-launch-images' => true, 'plan-digest' => $plan['plan_digest'], 'source-commit' => $sha,
        'expected-site' => home_url('/'), 'expected-theme' => 'farmtree-native', 'backup-digest' => $backup,
        'confirmation' => 'APPLY SIX PAGE DOCUMENTARY CONTENT UPDATES',
        'publication-confirmation' => 'PRESERVE EXISTING PUBLICATION AND ROUTING',
        'protection-confirmation' => 'PUBLIC INDEXING ON AND COMING SOON OFF VERIFIED'];
    $validate = new ReflectionMethod($cli, 'validate_apply_gates');
    $validate->invoke($cli, $args, $r);
    $bad = $args; $bad['confirmation'] = 'APPLY FARMTREE PRIVATE REVIEW CONTENT';
    ft_reject(static fn () => $validate->invoke($cli, $bad, $r), 'Wrong mode confirmation');
    $rejections[] = 'mode_confirmation';
    $stable = $snapshot(true);
    $mutate = static function ($id) use ($ids) { if ($id === $ids['page.en.home']) update_option('blog_public', '0'); };
    add_action('save_post', $mutate);
    ft_reject(static fn () => $r->apply_plan($plan, $sha, $backup), 'Hook changed public indexing');
    remove_action('save_post', $mutate);
    ft_assert($snapshot(true) === $stable, 'Critical-state failure did not roll back database changes');
    wp_cache_flush();
    $plan = $dry->invoke($cli, $r, $options);
    ft_assert($plan['summary']['conflict'] === 0, 'Rollback did not restore public state');
    $rejections[] = 'hook_indexing_mutation_rolled_back';
    $before_options = $wpdb->get_results("SELECT * FROM {$wpdb->options}", ARRAY_A);
    $unchanged_posts = [];
    $target_ids = array_column(array_filter($plan['operations']['posts'], static fn ($op) => $op['action'] === 'update'), 'id');
    foreach ($ids as $id) if (!in_array($id, $target_ids, true)) $unchanged_posts[$id] = get_post($id, ARRAY_A);
    $applied = $r->apply_plan($plan, $sha, $backup);
    ft_assert($applied['summary']['updated'] === 6 && $applied['summary']['created'] === 0 && $applied['summary']['adopted'] === 0, 'Unexpected writes');
    $after_options = $wpdb->get_results("SELECT * FROM {$wpdb->options}", ARRAY_A);
    $changed_options = [];
    foreach ($after_options as $row) if (!in_array($row, $before_options, true)) $changed_options[] = $row['option_name'];
    // WordPress may rebuild this derived taxonomy cache while saving a post.
    $without_cache = static fn ($rows) => array_values(array_filter($rows, static fn ($row) => $row['option_name'] !== 'category_children'));
    ft_assert($without_cache($before_options) === $without_cache($after_options), 'An option changed: ' . implode(',', $changed_options));
    foreach ($unchanged_posts as $id => $post) ft_assert($post === get_post($id, ARRAY_A), 'Unrelated managed post changed');
    $final = $dry->invoke($cli, $r, $options);
    ft_assert($final['summary']['update'] === 0 && $final['summary']['conflict'] === 0, 'Not idempotent');
    ft_assert($final['public_state_sha256'] === $plan['public_state_sha256'], 'Public state changed');
    file_put_contents('/farmtree-test/result.json', wp_json_encode(['ok' => true, 'dry_run_zero_mutation' => true,
        'initial_summary' => $plan['summary'], 'apply' => $applied['summary'], 'final_summary' => $final['summary'],
        'options_unchanged_except_core_taxonomy_cache' => true, 'changed_option_names' => $changed_options,
        'unrelated_managed_posts_unchanged' => count($unchanged_posts), 'rejections' => $rejections]));
} catch (Throwable $e) {
    file_put_contents('/farmtree-test/result.json', wp_json_encode(['ok' => false, 'error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]));
}
