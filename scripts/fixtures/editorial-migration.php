<?php
// Disposable loopback fixture exercising the exact public editorial release mode.
require_once '/wordpress/wp-load.php';
function ft_assert($condition, $message) { if (!$condition) throw new RuntimeException($message); }
try {
    token_get_all(file_get_contents('/farmtree-test/staged-runner.php'), TOKEN_PARSE);
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
    $desired = $property->getValue($r);
    $baseline = require '/farmtree-test/approved.php';
    $property->setValue($r, $baseline);
    $r->apply_plan($r->build_plan($options), $sha, $backup);
    $ids = [];
    $identity = [];
    foreach ($r->build_plan($options)['operations']['posts'] as $op) {
        $ids[$op['key']] = $op['id'];
        $post = get_post($op['id']);
        $identity[$op['key']] = [$post->ID, $post->post_status, $post->post_name, $post->post_type];
    }
    $media = [];
    foreach ($r->build_plan($options)['operations']['media'] as $op) $media[$op['key']] = $op['id'];
    update_option('show_on_front', 'page');
    update_option('page_on_front', $ids['page.en.home']);
    update_option('blog_public', '1');
    update_option('seedprod_settings', wp_json_encode(['enable_coming_soon_mode' => false, 'enable_maintenance_mode' => false]));
    update_option('ft_ai_settings', ['enabled' => 0]);
    update_option('active_plugins', ['farmtree-content/farmtree-content.php']);
    add_filter('pre_http_request', static fn () => ['response' => ['code' => 200], 'headers' => [], 'body' => '<main class="ft-native-home">FarmTree</main>', 'cookies' => []]);
    $options['post_launch_editorial'] = true;
    // Compare persisted values, not get_option's int-in-cache/string-from-DB types.
    global $wpdb;
    $option_value = static fn ($key) => $wpdb->get_var($wpdb->prepare("SELECT option_value FROM {$wpdb->options} WHERE option_name = %s", $key));
    $protected = [];
    foreach (['show_on_front', 'page_on_front', 'blog_public', 'seedprod_settings', 'ft_ai_settings', 'permalink_structure', 'stylesheet', 'template', 'active_plugins'] as $key) $protected[$key] = $option_value($key);
    $property->setValue($r, $desired);
    $cli = new FarmTree_Content_CLI_Command();
    $dry = new ReflectionMethod($cli, 'build_dry_run_plan');
    $snapshot = static function () use ($wpdb) {
        $state = [];
        foreach ([$wpdb->posts, $wpdb->postmeta, $wpdb->options, $wpdb->terms, $wpdb->termmeta, $wpdb->term_taxonomy, $wpdb->term_relationships] as $table) $state[$table] = $wpdb->get_results("SELECT * FROM {$table}", ARRAY_A);
        return hash('sha256', serialize($state));
    };
    $stable = $snapshot();
    $plan = $dry->invoke($cli, $r, $options);
    ft_assert($stable === $snapshot(), 'Editorial dry-run mutated database');
    ft_assert($plan['summary']['conflict'] === 0, 'Migration conflict: ' . wp_json_encode($plan['conflicts']));
    ft_assert($plan['summary']['create'] === 9, 'Expected nine new shared documentary attachments');
    ft_assert($plan['summary']['update'] === 23, 'Expected exactly 23 editorial updates');
    $scope = new ReflectionMethod($r, 'editorial_scope_errors');
    $rejections = [];
    foreach (['post_status', 'post_name', 'post_title', 'post_content', 'post_excerpt', 'featured_asset_key'] as $field) {
        $bad = $plan['operations'];
        $bad['posts'][0]['desired'][$field] = 'Unapproved';
        ft_assert($scope->invoke($r, $bad, false), 'Forged desired field accepted: ' . $field);
        $rejections[] = 'desired:' . $field;
    }
    foreach (['before', 'reason', 'key', 'id'] as $field) {
        $bad = $plan['operations'];
        $bad['posts'][0][$field] = $field === 'before' ? [] : ($field === 'id' ? 0 : 'unapproved');
        ft_assert($scope->invoke($r, $bad, false), 'Forged operation accepted: ' . $field);
        $rejections[] = 'operation:' . $field;
    }
    $bad = $desired; $bad['entities'][0]['fields']['post_content'] .= '<p>Unapproved copy</p>';
    $property->setValue($r, $bad);
    ft_assert($r->build_plan($options)['summary']['conflict'] > 0, 'Manifest pin bypassed');
    $property->setValue($r, $desired);
    foreach ($plan['operations']['media'] as $index => $op) if ($op['action'] === 'create') {
        foreach (['update', 'conflict'] as $action) {
            $bad = $plan['operations']; $bad['media'][$index]['action'] = $action;
            ft_assert($scope->invoke($r, $bad, false), 'Media replacement/adoption allowed');
        }
        $bad = $plan['operations']; $bad['media'][$index]['desired']['alt'] = 'Unapproved alt';
        ft_assert($scope->invoke($r, $bad, false), 'Unapproved media allowed');
    }
    ft_assert($r->build_plan($options + ['set_front_page' => true])['summary']['conflict'] > 0, 'Front-page change allowed');
    $args = ['post-launch-editorial' => true, 'plan-digest' => $plan['plan_digest'], 'source-commit' => $sha,
        'expected-site' => home_url('/'), 'expected-theme' => 'farmtree-native', 'backup-digest' => $backup,
        'confirmation' => 'APPLY APPROVED EDITORIAL DOCUMENTARY UPDATES',
        'publication-confirmation' => 'PRESERVE EXISTING PUBLICATION AND ROUTING',
        'protection-confirmation' => 'PUBLIC INDEXING ON AND COMING SOON OFF VERIFIED'];
    (new ReflectionMethod($cli, 'validate_apply_gates'))->invoke($cli, $args, $r);
    $rejected = false;
    try { (new ReflectionMethod($cli, 'validate_arguments'))->invoke($cli, [], $args + ['post-launch-images' => true]); } catch (Throwable $e) { $rejected = true; }
    ft_assert($rejected, 'Combined CLI profiles accepted');
    foreach (['source', 'media', 'fields'] as $test) {
        $bad = $plan['operations'];
        if ($test === 'source') $bad['posts'][0]['managed_metadata_write']['before']['_farmtree_content_source_hash'] = [str_repeat('0', 64)];
        if ($test === 'media') $bad['media'][0]['action'] = 'update';
        if ($test === 'fields') $bad['posts'][0]['changes']['post_status'] = ['desired' => 'private'];
        ft_assert($scope->invoke($r, $bad, false), 'Scope accepted ' . $test);
        $rejections[] = $test;
    }
    foreach ($plan['operations']['media'] as $op) if (isset($media[$op['key']])) ft_assert($op['action'] === 'unchanged', 'Old media changed');
    foreach ($plan['operations']['posts'] as $op) ft_assert($op['id'] === $ids[$op['key']], 'ID changed');
    // Do not silently extend the approved public six-page-only release profile.
    ft_assert($r->build_plan($options + ['post_launch_images' => true])['summary']['conflict'] > 0, 'Public scope guard was bypassed');
    $home = get_post_field('post_content', $ids['page.en.home']);
    wp_update_post(wp_slash(['ID' => $ids['page.en.home'], 'post_content' => $home . '<p>Unrelated manual edit</p>']));
    ft_assert($r->build_plan($options)['summary']['conflict'] > 0, 'Manual edit not protected');
    wp_update_post(wp_slash(['ID' => $ids['page.en.home'], 'post_content' => $home]));
    $plan = $dry->invoke($cli, $r, $options);
    $mutate = static function ($id) use ($ids) { if ($id === $ids['page.en.home']) update_option('blog_public', '0'); };
    add_action('save_post', $mutate);
    $rejected = false;
    try { $r->apply_plan($plan, $sha, $backup); } catch (FarmTree_Content_Apply_Exception $e) {
        $rejected = true;
        ft_assert($e->apply_context()['database_rollback_attempted'], 'No rollback attempted');
    }
    remove_action('save_post', $mutate);
    ft_assert($rejected, 'Critical-state mutation accepted');
    wp_cache_flush();
    ft_assert($option_value('blog_public') === '1', 'Rollback failed to preserve indexing');
    $rejections[] = 'hook_indexing_mutation_rolled_back';
    $plan = $dry->invoke($cli, $r, $options);
    ft_assert($plan['summary']['create'] === 9 && $plan['summary']['update'] === 23 && $plan['summary']['conflict'] === 0, 'Rollback failed to restore exact plan');
    $apply = $r->apply_plan($plan, $sha, $backup);
    $final = $dry->invoke($cli, $r, $options);
    ft_assert($final['summary']['create'] === 0 && $final['summary']['update'] === 0 && $final['summary']['conflict'] === 0, 'Not idempotent');
    foreach ($identity as $key => $value) {
        $post = get_post($ids[$key]);
        ft_assert([$post->ID, $post->post_status, $post->post_name, $post->post_type] === $value, 'Publication/route identity changed: ' . $key);
    }
    foreach ($final['operations']['media'] as $op) if (isset($media[$op['key']])) ft_assert($media[$op['key']] === $op['id'], 'Existing media ID changed');
    foreach ($protected as $key => $value) ft_assert($option_value($key) === $value, 'Persisted protected option changed: ' . $key);
    // The presentation filter respects the selected attachment, alt and link.
    require_once get_theme_file_path('functions.php');
    $attachment = get_post_thumbnail_id($ids['proof_story.en.farm_value']);
    $source = wp_get_attachment_url($attachment);
    $html = '<figure><a href="/example/"><img src="' . esc_url($source) . '" alt="Editor supplied alt" /></a></figure>';
    $rendered = farmtree_native_documentary_picture($html, ['blockName' => 'core/image', 'attrs' => ['id' => $attachment]]);
    ft_assert(str_contains($rendered, '<picture') && str_contains($rendered, 'alt="Editor supplied alt"') && str_contains($rendered, 'href="/example/"'), 'Presentation lost selected media, alt or link');
    $other = $media['asset.proof.farm-value-projection'];
    ft_assert(farmtree_native_documentary_picture($html, ['blockName' => 'core/image', 'attrs' => ['id' => $other]]) === $html, 'Unrelated editor media transformed');
    file_put_contents('/farmtree-test/result.json', wp_json_encode(['ok' => true, 'plan' => $plan['summary'], 'apply' => $apply['summary'], 'final' => $final['summary'], 'preservedEntities' => count($identity), 'preservedMedia' => count($media), 'protectedOptionsPreserved' => array_keys($protected), 'editorMediaChoicePreserved' => true, 'manualConflictRejected' => true, 'publicSixPageGuardPreserved' => true, 'editorialRejections' => $rejections]));
} catch (Throwable $e) {
    file_put_contents('/farmtree-test/result.json', wp_json_encode(['ok' => false, 'error' => $e->getMessage()]));
}
