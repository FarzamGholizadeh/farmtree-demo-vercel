<?php
// Disposable loopback fixture only. Not a production release mode.
require_once '/wordpress/wp-load.php';
function ft_assert($condition, $message) { if (!$condition) throw new RuntimeException($message); }
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
    // Compare persisted values, not get_option's int-in-cache/string-from-DB types.
    global $wpdb;
    $option_value = static fn ($key) => $wpdb->get_var($wpdb->prepare("SELECT option_value FROM {$wpdb->options} WHERE option_name = %s", $key));
    $protected = [];
    foreach (['show_on_front', 'page_on_front', 'blog_public', 'seedprod_settings', 'ft_ai_settings', 'permalink_structure', 'stylesheet', 'template', 'active_plugins'] as $key) $protected[$key] = $option_value($key);
    $property->setValue($r, $desired);
    $cli = new FarmTree_Content_CLI_Command();
    $dry = new ReflectionMethod($cli, 'build_dry_run_plan');
    $plan = $dry->invoke($cli, $r, $options);
    ft_assert($plan['summary']['conflict'] === 0, 'Migration conflict: ' . wp_json_encode($plan['conflicts']));
    ft_assert($plan['summary']['create'] === 9, 'Expected nine new shared documentary attachments');
    ft_assert($plan['summary']['update'] === 23, 'Expected exactly 23 editorial updates');
    foreach ($plan['operations']['media'] as $op) if (isset($media[$op['key']])) ft_assert($op['action'] === 'unchanged', 'Old media changed');
    foreach ($plan['operations']['posts'] as $op) ft_assert($op['id'] === $ids[$op['key']], 'ID changed');
    // Do not silently extend the approved public six-page-only release profile.
    ft_assert($r->build_plan($options + ['post_launch_images' => true])['summary']['conflict'] > 0, 'Public scope guard was bypassed');
    $home = get_post_field('post_content', $ids['page.en.home']);
    wp_update_post(wp_slash(['ID' => $ids['page.en.home'], 'post_content' => $home . '<p>Unrelated manual edit</p>']));
    ft_assert($r->build_plan($options)['summary']['conflict'] > 0, 'Manual edit not protected');
    wp_update_post(wp_slash(['ID' => $ids['page.en.home'], 'post_content' => $home]));
    $plan = $dry->invoke($cli, $r, $options);
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
    file_put_contents('/farmtree-test/result.json', wp_json_encode(['ok' => true, 'plan' => $plan['summary'], 'apply' => $apply['summary'], 'final' => $final['summary'], 'preservedEntities' => count($identity), 'preservedMedia' => count($media), 'protectedOptionsPreserved' => array_keys($protected), 'editorMediaChoicePreserved' => true, 'manualConflictRejected' => true, 'publicSixPageGuardPreserved' => true]));
} catch (Throwable $e) {
    file_put_contents('/farmtree-test/result.json', wp_json_encode(['ok' => false, 'error' => $e->getMessage()]));
}
