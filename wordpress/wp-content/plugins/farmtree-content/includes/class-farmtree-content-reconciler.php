<?php
/**
 * Deterministic, non-destructive managed-content reconciliation.
 *
 * @package FarmTree_Content
 */

if (!defined('ABSPATH')) {
    exit;
}

final class FarmTree_Content_Apply_Exception extends RuntimeException
{
    /** @var array<string,mixed> */
    private array $apply_context;

    /** @param array<string,mixed> $apply_context */
    public function __construct(string $message, array $apply_context, ?Throwable $previous = null)
    {
        parent::__construct($message, 0, $previous);
        $this->apply_context = $apply_context;
    }

    /** @return array<string,mixed> */
    public function apply_context(): array
    {
        return $this->apply_context;
    }
}

final class FarmTree_Content_Reconciler
{
    private const META_KEY = '_farmtree_content_managed_key';
    private const META_MANIFEST = '_farmtree_content_manifest_version';
    private const META_SOURCE_HASH = '_farmtree_content_source_hash';
    private const META_APPLIED_HASH = '_farmtree_content_applied_hash';
    private const META_RELEASE_COMMIT = '_farmtree_content_release_commit';
    private const META_ASSET_SHA = '_farmtree_content_asset_sha256';
    private const META_BACKUP_EVIDENCE = '_farmtree_content_backup_evidence_sha256';

    /** @var array<string,mixed> */
    private array $manifest;
    private string $theme_root = '';
    private string $theme_uri = '';
    /** @var array<string,string> */
    private array $asset_paths = [];
    /** @var array<int,string> */
    private array $created_files = [];
    /** @var array<int,int> */
    private array $touched_post_ids = [];
    /** @var array<int,int> */
    private array $touched_term_ids = [];
    private string $backup_evidence_digest = '';

    public function __construct()
    {
        $file = FARMTREE_CONTENT_DIR . 'includes/managed-content-manifest.php';
        if (!is_readable($file)) {
            throw new RuntimeException('The managed content manifest is not readable.');
        }
        $manifest = require $file;
        if (!is_array($manifest)) {
            throw new RuntimeException('The managed content manifest did not return an array.');
        }
        $this->manifest = $manifest;
    }

    /**
     * Build a deterministic plan. This method performs no writes.
     *
     * @param array<string,mixed> $options
     * @return array<string,mixed>
     */
    public function build_plan(array $options = []): array
    {
        $options = wp_parse_args($options, [
            'set_front_page' => false,
            'expected_site' => '',
            'expected_theme' => '',
            'source_commit' => '',
        ]);
        $site_url = trailingslashit(home_url('/'));
        $theme = get_stylesheet();
        $ops = ['checks' => [], 'terms' => [], 'media' => [], 'posts' => [], 'embedded' => [], 'options' => []];

        $ops['checks'] = $this->validate_manifest_stage();
        if ('' !== (string) $options['expected_site'] && trailingslashit((string) $options['expected_site']) !== $site_url) {
            $ops['checks'][] = $this->op('runtime', 'expected-site', 'conflict', 'expected_site_mismatch');
        }
        if ('' !== (string) $options['expected_theme'] && (string) $options['expected_theme'] !== $theme) {
            $ops['checks'][] = $this->op('runtime', 'expected-theme', 'conflict', 'expected_theme_mismatch');
        }
        if ('' !== (string) $options['source_commit'] && !preg_match('/^[0-9a-f]{40}$/', (string) $options['source_commit'])) {
            $ops['checks'][] = $this->op('runtime', 'source-commit', 'conflict', 'invalid_source_commit');
        }
        $ops['checks'] = array_merge($ops['checks'], $this->reserved_locale_safety_operations());

        $term_ids = [];
        $term_id_keys = [];
        foreach ($this->items('terms') as $term) {
            $operation = $this->plan_term($term);
            $operation = $this->with_managed_metadata_disclosure(
                $operation,
                'term',
                $term,
                (string) $options['source_commit']
            );
            $ops['terms'][] = $operation;
            if (!empty($operation['id'])) {
                $term_ids[(string) $term['key']] = (int) $operation['id'];
                $term_id_keys[(int) $operation['id']] = (string) $term['key'];
            }
        }

        $asset_ids = [];
        $asset_id_keys = [];
        foreach ($this->items('assets') as $asset) {
            $operation = $this->plan_asset($asset);
            $operation = $this->with_managed_metadata_disclosure(
                $operation,
                'media',
                $asset,
                (string) $options['source_commit']
            );
            $ops['media'][] = $operation;
            if (!empty($operation['id'])) {
                $asset_ids[(string) $asset['key']] = (int) $operation['id'];
                $asset_id_keys[(int) $operation['id']] = (string) $asset['key'];
            }
        }

        $entity_ids = [];
        foreach ($this->items('entities') as $entity) {
            $operation = $this->plan_entity($entity, $asset_ids, $asset_id_keys, $term_id_keys);
            $operation = $this->with_managed_metadata_disclosure(
                $operation,
                'post',
                $entity,
                (string) $options['source_commit']
            );
            $ops['posts'][] = $operation;
            if (!empty($operation['id'])) {
                $entity_ids[(string) $entity['key']] = (int) $operation['id'];
            }
        }
        $ops['embedded'] = $this->plan_embedded_members($ops['posts']);
        $ops['options'][] = $this->plan_front_page((bool) $options['set_front_page'], $entity_ids, $ops['posts']);
        $ops['options'][] = $this->plan_rewrite_rules();

        $summary = ['create' => 0, 'update' => 0, 'unchanged' => 0, 'conflict' => 0, 'skipped' => 0];
        $conflicts = [];
        foreach ($ops as $group) {
            foreach ($group as $operation) {
                $action = (string) $operation['action'];
                ++$summary[$action];
                if ('conflict' === $action) {
                    $conflicts[] = [
                        'kind' => $operation['kind'],
                        'key' => $operation['key'],
                        'reason' => $operation['reason'],
                    ];
                }
            }
        }

        $plan = [
            'mode' => 'dry-run',
            'profile' => isset($this->manifest['profile']) ? (string) $this->manifest['profile'] : '',
            'manifest_version' => isset($this->manifest['manifest_version']) ? (string) $this->manifest['manifest_version'] : '',
            'site_url' => $site_url,
            'active_theme' => $theme,
            'source_commit' => (string) $options['source_commit'],
            'set_front_page' => (bool) $options['set_front_page'],
            'operations' => $ops,
            'summary' => $summary,
            'conflicts' => $conflicts,
        ];
        $plan['plan_digest'] = $this->hash($plan);
        return $plan;
    }

    /**
     * Check identity and production protection state without writes.
     *
     * Loopback sites bypass only the two protection-plugin gates.
     *
     * @return array<int,array<string,string>>
     */
    public function runtime_gate_errors(string $expected_site, string $expected_theme): array
    {
        $errors = [];
        if (trailingslashit($expected_site) !== trailingslashit(home_url('/'))) {
            $errors[] = ['gate' => 'expected_site', 'reason' => 'site_identity_mismatch'];
        }
        if ($expected_theme !== get_stylesheet()) {
            $errors[] = ['gate' => 'expected_theme', 'reason' => 'active_theme_mismatch'];
        }
        if ($this->is_loopback()) {
            return $errors;
        }

        global $wpdb;
        $blog_public = $wpdb->get_var($wpdb->prepare(
            "SELECT option_value FROM {$wpdb->options} WHERE option_name = %s LIMIT 1",
            'blog_public'
        ));
        if ('0' !== (string) $blog_public) {
            $errors[] = ['gate' => 'blog_public', 'reason' => 'search_engine_visibility_not_disabled'];
        }
        $plugins = (array) get_option('active_plugins', []);
        if (is_multisite()) {
            $plugins = array_merge($plugins, array_keys((array) get_site_option('active_sitewide_plugins', [])));
        }
        $coming_soon = false;
        foreach ($plugins as $plugin) {
            if ('coming-soon' === dirname((string) $plugin) || str_starts_with((string) $plugin, 'coming-soon/')) {
                $coming_soon = true;
                break;
            }
        }
        if (!$coming_soon) {
            $errors[] = ['gate' => 'coming_soon', 'reason' => 'coming_soon_plugin_not_active'];
            return $errors;
        }

        $probe_url = add_query_arg('_farmtree_protection_probe', wp_generate_uuid4(), home_url('/'));
        $response = wp_safe_remote_get($probe_url, [
            'timeout' => 12,
            'redirection' => 0,
            'headers' => [
                'Cache-Control' => 'no-cache, no-store',
                'Pragma' => 'no-cache',
            ],
            'user-agent' => 'FarmTree-Private-Review-Protection-Probe/1.0',
        ]);
        if (is_wp_error($response)) {
            $errors[] = ['gate' => 'coming_soon', 'reason' => 'anonymous_protection_probe_failed'];
            return $errors;
        }
        $status = (int) wp_remote_retrieve_response_code($response);
        if (!in_array($status, [200, 503], true)) {
            $errors[] = ['gate' => 'coming_soon', 'reason' => 'anonymous_protection_probe_ambiguous'];
            return $errors;
        }
        $body = (string) wp_remote_retrieve_body($response);
        $robots_header = strtolower((string) wp_remote_retrieve_header($response, 'x-robots-tag'));
        $has_sentinel = false !== stripos($body, 'Coming Soon');
        $has_markup_noindex = 1 === preg_match(
            '/<meta\b(?=[^>]*\bname=["\']robots["\'])(?=[^>]*\bcontent=["\'][^"\']*noindex[^"\']*["\'])[^>]*>/i',
            $body
        );
        if (!$has_sentinel || (!str_contains($robots_header, 'noindex') && !$has_markup_noindex)) {
            $errors[] = ['gate' => 'coming_soon', 'reason' => 'anonymous_response_not_protected'];
        }
        return $errors;
    }

    /**
     * Apply a freshly recomputed, conflict-free plan.
     *
     * @param array<string,mixed> $plan
     * @return array<string,mixed>
     */
    public function apply_plan(array $plan, string $source_commit, string $backup_digest): array
    {
        if (!preg_match('/^[0-9a-f]{40}$/', $source_commit)) {
            throw new RuntimeException('A 40-character source commit is required.');
        }
        $backup_digest = strtolower($backup_digest);
        if (!preg_match('/^[0-9a-f]{64}$/', $backup_digest)) {
            throw new RuntimeException('A 64-character backup evidence digest is required.');
        }
        if (!isset($plan['source_commit']) || !hash_equals($source_commit, (string) $plan['source_commit'])) {
            throw new RuntimeException('The source commit does not match the reviewed plan.');
        }
        if (empty($plan['plan_digest']) || !empty($plan['summary']['conflict'])) {
            throw new RuntimeException('A conflicted or undigested plan cannot be applied.');
        }
        $this->assert_plan_shape_and_actions($plan);
        $gate_errors = $this->runtime_gate_errors((string) $plan['site_url'], (string) $plan['active_theme']);
        if ($gate_errors) {
            throw new RuntimeException('Runtime gates changed before apply: ' . wp_json_encode($gate_errors, JSON_UNESCAPED_SLASHES));
        }
        $this->assert_transactional_tables();

        global $wpdb;
        if (!$this->is_loopback()
            && false === $wpdb->query('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE')) {
            throw new RuntimeException('Could not require serializable isolation for the apply transaction.');
        }
        $transaction_started = false !== $wpdb->query('BEGIN');
        if (!$transaction_started) {
            throw new RuntimeException('Could not start the required database transaction.');
        }
        $this->backup_evidence_digest = $backup_digest;
        $this->created_files = [];
        $this->touched_post_ids = [];
        $this->touched_term_ids = [];
        foreach (array_merge(
            (array) $plan['operations']['media'],
            (array) $plan['operations']['posts']
        ) as $operation) {
            $this->remember_touched_post_id((int) ($operation['id'] ?? 0));
        }
        foreach ((array) $plan['operations']['terms'] as $operation) {
            $this->remember_touched_term_id((int) ($operation['id'] ?? 0));
        }
        $results = [];
        $stage = 'preflight';
        $stage_key = '';
        try {
            $stage = 'locked-preflight';
            $this->lock_and_refresh_reconciliation_state();
            $fresh = $this->build_plan([
                'set_front_page' => (bool) $plan['set_front_page'],
                'expected_site' => (string) $plan['site_url'],
                'expected_theme' => (string) $plan['active_theme'],
                'source_commit' => $source_commit,
            ]);
            if (!hash_equals((string) $plan['plan_digest'], (string) $fresh['plan_digest'])) {
                throw new RuntimeException('The reconciliation plan changed inside the locked apply transaction.');
            }
            $this->assert_revision_preconditions($fresh['operations']['posts']);

            $term_ids = [];
            $stage = 'terms';
            foreach ($this->items('terms') as $i => $term) {
                $stage_key = (string) $term['key'];
                $result = $this->apply_term($term, $plan['operations']['terms'][$i], $source_commit);
                $results[] = $result;
                if (!empty($result['id'])) {
                    $term_ids[(string) $term['key']] = (int) $result['id'];
                }
            }
            $asset_ids = [];
            $stage = 'media';
            foreach ($this->items('assets') as $i => $asset) {
                $stage_key = (string) $asset['key'];
                $result = $this->apply_asset($asset, $plan['operations']['media'][$i], $source_commit);
                $results[] = $result;
                if (!empty($result['id'])) {
                    $asset_ids[(string) $asset['key']] = (int) $result['id'];
                }
            }
            $entity_ids = [];
            $stage = 'posts';
            foreach ($this->items('entities') as $i => $entity) {
                $stage_key = (string) $entity['key'];
                $result = $this->apply_entity($entity, $plan['operations']['posts'][$i], $asset_ids, $term_ids, $source_commit);
                $results[] = $result;
                if (!empty($result['id'])) {
                    $entity_ids[(string) $entity['key']] = (int) $result['id'];
                }
            }
            $stage = 'embedded';
            foreach ($plan['operations']['embedded'] as $operation) {
                $stage_key = (string) $operation['key'];
                $results[] = $this->apply_embedded_member($operation, $entity_ids);
            }
            $stage = 'options';
            $stage_key = 'front-page';
            $results[] = $this->apply_front_page($plan['operations']['options'][0], $entity_ids);

            $stage = 'rewrite-finalization';
            $stage_key = 'rewrite-rules';
            $results[] = $this->finalize_rewrite_rules($plan['operations']['options'][1]);

            $stage = 'postcondition';
            $stage_key = '';
            $final_plan = $this->build_plan([
                'set_front_page' => (bool) $plan['set_front_page'],
                'expected_site' => (string) $plan['site_url'],
                'expected_theme' => (string) $plan['active_theme'],
                'source_commit' => $source_commit,
            ]);
            $this->assert_final_plan($final_plan);
            if (false === $wpdb->query('COMMIT')) {
                throw new RuntimeException('The database transaction could not be committed.');
            }
        } catch (Throwable $error) {
            $rollback_succeeded = false !== $wpdb->query('ROLLBACK');
            $cache_cleanup = $this->invalidate_caches_after_rollback();
            $cleanup = $this->cleanup_created_files();
            throw new FarmTree_Content_Apply_Exception(
                'Apply failed during ' . $stage . ($stage_key ? ' for ' . $stage_key : '') . ': ' . $error->getMessage(),
                [
                    'failed_stage' => $stage,
                    'failed_key' => $stage_key,
                    'completed_operations_before_failure' => $results,
                    'database_rollback_attempted' => true,
                    'database_rollback_reported_success' => $rollback_succeeded,
                    'cache_cleanup_after_rollback' => $cache_cleanup,
                    'created_media_file_cleanup' => $cleanup,
                    'possible_non_database_hook_side_effects' => true,
                    'backup_evidence' => [
                        'type' => 'user_supplied_sha256_reference',
                        'digest' => $backup_digest,
                    ],
                ],
                $error
            );
        }

        $summary = ['created' => 0, 'updated' => 0, 'adopted' => 0, 'unchanged' => 0, 'skipped' => 0];
        foreach ($results as $result) {
            ++$summary[$result['status']];
        }
        return [
            'mode' => 'apply',
            'ok' => true,
            'plan_digest' => $plan['plan_digest'],
            'manifest_version' => $plan['manifest_version'],
            'source_commit' => $source_commit,
            'backup_evidence' => [
                'type' => 'user_supplied_sha256_reference',
                'digest' => $backup_digest,
            ],
            'transaction' => 'committed',
            'postcondition' => 'verified_by_final_dry_run',
            'summary' => $summary,
            'results' => $results,
        ];
    }

    /** @param array<int,array<string,mixed>> $post_operations */
    private function assert_revision_preconditions(array $post_operations): void
    {
        foreach ($post_operations as $operation) {
            if ('update' !== (string) ($operation['action'] ?? '') || 'owned_update' !== (string) ($operation['reason'] ?? '')) {
                continue;
            }
            $post = get_post((int) ($operation['id'] ?? 0));
            if (!$post) {
                throw new RuntimeException('Revision preflight could not load ' . (string) ($operation['key'] ?? 'managed post') . '.');
            }
            if (wp_revisions_enabled($post) && !function_exists('wp_save_post_revision')) {
                throw new RuntimeException('Revision capture is unavailable for ' . (string) $operation['key'] . '.');
            }
        }
    }

    /** @return array{id:int,status:string} */
    private function capture_pre_update_revision(int $post_id, string $key): array
    {
        $post = get_post($post_id);
        if (!$post) {
            throw new RuntimeException('Could not load the pre-update post for ' . $key . '.');
        }
        if (!wp_revisions_enabled($post)) {
            return ['id' => 0, 'status' => 'revisions_disabled'];
        }
        $revision = wp_save_post_revision($post_id);
        if (is_wp_error($revision)) {
            throw new RuntimeException('Could not capture the pre-update revision for ' . $key . ': ' . $revision->get_error_message());
        }
        if ((int) $revision > 0) {
            $this->remember_touched_post_id((int) $revision);
            $revision_post = wp_get_post_revision((int) $revision);
            if (!$revision_post || !$this->revision_matches_post($revision_post, $post)) {
                throw new RuntimeException('The new pre-update revision could not be verified for ' . $key . '.');
            }
            return ['id' => (int) $revision, 'status' => 'created_and_verified'];
        }

        $revisions = wp_get_post_revisions($post_id, [
            'posts_per_page' => 1,
            'order' => 'DESC',
            'orderby' => 'date ID',
            'check_enabled' => false,
        ]);
        $latest = $revisions ? reset($revisions) : null;
        if (!$latest || !$this->revision_matches_post($latest, $post)) {
            throw new RuntimeException('No verified pre-update revision is available for ' . $key . '.');
        }
        return ['id' => (int) $latest->ID, 'status' => 'latest_verified_and_reused'];
    }

    private function revision_matches_post(WP_Post $revision, WP_Post $post): bool
    {
        foreach (array_keys(_wp_post_revision_fields((array) $post)) as $field) {
            if ((string) $revision->{$field} !== (string) $post->{$field}) {
                return false;
            }
        }
        return true;
    }

    private function assert_transactional_tables(): void
    {
        if ($this->is_loopback()) {
            return;
        }
        global $wpdb;
        $tables = [
            $wpdb->posts,
            $wpdb->postmeta,
            $wpdb->terms,
            $wpdb->term_taxonomy,
            $wpdb->term_relationships,
            $wpdb->termmeta,
            $wpdb->options,
        ];
        foreach (array_values(array_unique($tables, SORT_STRING)) as $table) {
            $row = $wpdb->get_row($wpdb->prepare('SHOW TABLE STATUS WHERE Name = %s', $table), ARRAY_A);
            if ('' !== (string) $wpdb->last_error || !is_array($row)) {
                throw new RuntimeException('Could not verify transactional storage for all affected tables.');
            }
            if ('INNODB' !== strtoupper((string) ($row['Engine'] ?? ''))) {
                throw new RuntimeException('All affected database tables must use InnoDB before apply.');
            }
        }
    }

    /**
     * Acquire current-read locks for every managed identity/candidate and then
     * evict only their object-cache entries. Production runs use SERIALIZABLE;
     * the loopback SQLite harness uses the surrounding BEGIN transaction.
     */
    private function lock_and_refresh_reconciliation_state(): void
    {
        global $wpdb;
        $lock = $this->is_loopback() ? '' : ' FOR UPDATE';
        $managed_keys = [];
        $post_slugs = [];
        $term_slugs = [];
        $term_names = [];
        foreach (['terms', 'assets', 'entities'] as $collection) {
            foreach ($this->items($collection) as $item) {
                $managed_keys[] = (string) ($item['key'] ?? '');
            }
        }
        $managed_keys = array_merge($managed_keys, array_map('strval', (array) ($this->manifest['team_member_keys'] ?? [])));
        foreach ($this->items('assets') as $asset) {
            $post_slugs[] = sanitize_title((string) ($asset['slug'] ?? ''));
        }
        foreach ($this->items('entities') as $entity) {
            $post_slugs[] = sanitize_title((string) ($entity['slug'] ?? ''));
            foreach ((array) ($entity['legacy_slugs'] ?? []) as $slug) {
                $post_slugs[] = sanitize_title((string) $slug);
            }
        }
        foreach ($this->items('terms') as $term) {
            $desired = $this->desired_term($term);
            $term_slugs[] = (string) $desired['slug'];
            $term_names[] = (string) $desired['name'];
        }
        $managed_keys = array_values(array_unique(array_filter($managed_keys), SORT_STRING));
        $post_slugs = array_values(array_unique(array_filter($post_slugs), SORT_STRING));
        $term_slugs = array_values(array_unique(array_filter($term_slugs), SORT_STRING));
        $term_names = array_values(array_unique(array_filter($term_names), SORT_STRING));

        $post_ids = $this->touched_post_ids;
        if ($post_slugs) {
            $post_ids = array_merge($post_ids, $this->locked_query_ids(
                "SELECT ID FROM {$wpdb->posts} WHERE post_name IN ("
                    . implode(',', array_fill(0, count($post_slugs), '%s')) . ") ORDER BY ID ASC{$lock}",
                $post_slugs,
                'post slug identity'
            ));
        }
        if ($managed_keys) {
            $post_ids = array_merge($post_ids, $this->locked_query_ids(
                "SELECT DISTINCT post_id FROM {$wpdb->postmeta} WHERE meta_key = %s AND meta_value IN ("
                    . implode(',', array_fill(0, count($managed_keys), '%s')) . ") ORDER BY post_id ASC{$lock}",
                array_merge([self::META_KEY], $managed_keys),
                'managed post key'
            ));
        }
        $post_ids = array_values(array_unique(array_map('intval', $post_ids), SORT_NUMERIC));
        sort($post_ids, SORT_NUMERIC);
        if ($post_ids) {
            $placeholders = implode(',', array_fill(0, count($post_ids), '%d'));
            $this->locked_query_ids(
                "SELECT ID FROM {$wpdb->posts} WHERE ID IN ({$placeholders}) ORDER BY ID ASC{$lock}",
                $post_ids,
                'managed post row'
            );
            $this->locked_query_ids(
                "SELECT meta_id FROM {$wpdb->postmeta} WHERE post_id IN ({$placeholders}) AND meta_key LIKE %s ORDER BY meta_id ASC{$lock}",
                array_merge($post_ids, [$wpdb->esc_like('_farmtree_content_') . '%']),
                'managed post metadata'
            );
            $consumer_ids = $this->locked_query_ids(
                "SELECT DISTINCT post_id FROM {$wpdb->postmeta} WHERE meta_key = %s AND meta_value IN ({$placeholders}) ORDER BY post_id ASC{$lock}",
                array_merge(['_thumbnail_id'], array_map('strval', $post_ids)),
                'featured media relationship'
            );
            $post_ids = array_values(array_unique(array_merge($post_ids, array_map('intval', $consumer_ids)), SORT_NUMERIC));
            sort($post_ids, SORT_NUMERIC);
        }

        $term_ids = $this->touched_term_ids;
        if ($term_slugs || $term_names) {
            $conditions = [];
            $arguments = [];
            if ($term_slugs) {
                $conditions[] = 'slug IN (' . implode(',', array_fill(0, count($term_slugs), '%s')) . ')';
                $arguments = array_merge($arguments, $term_slugs);
            }
            if ($term_names) {
                $conditions[] = 'name IN (' . implode(',', array_fill(0, count($term_names), '%s')) . ')';
                $arguments = array_merge($arguments, $term_names);
            }
            $term_ids = array_merge($term_ids, $this->locked_query_ids(
                "SELECT term_id FROM {$wpdb->terms} WHERE " . implode(' OR ', $conditions) . " ORDER BY term_id ASC{$lock}",
                $arguments,
                'term slug or name identity'
            ));
        }
        if ($managed_keys) {
            $term_ids = array_merge($term_ids, $this->locked_query_ids(
                "SELECT DISTINCT term_id FROM {$wpdb->termmeta} WHERE meta_key = %s AND meta_value IN ("
                    . implode(',', array_fill(0, count($managed_keys), '%s')) . ") ORDER BY term_id ASC{$lock}",
                array_merge([self::META_KEY], $managed_keys),
                'managed term key'
            ));
        }
        $term_ids = array_values(array_unique(array_map('intval', $term_ids), SORT_NUMERIC));
        sort($term_ids, SORT_NUMERIC);
        if ($term_ids) {
            $placeholders = implode(',', array_fill(0, count($term_ids), '%d'));
            $this->locked_query_ids(
                "SELECT term_id FROM {$wpdb->terms} WHERE term_id IN ({$placeholders}) ORDER BY term_id ASC{$lock}",
                $term_ids,
                'managed term row'
            );
            $taxonomy_ids = $this->locked_query_ids(
                "SELECT term_taxonomy_id FROM {$wpdb->term_taxonomy} WHERE term_id IN ({$placeholders}) ORDER BY term_taxonomy_id ASC{$lock}",
                $term_ids,
                'managed term taxonomy row'
            );
            $this->locked_query_ids(
                "SELECT meta_id FROM {$wpdb->termmeta} WHERE term_id IN ({$placeholders}) AND meta_key LIKE %s ORDER BY meta_id ASC{$lock}",
                array_merge($term_ids, [$wpdb->esc_like('_farmtree_content_') . '%']),
                'managed term metadata'
            );
            if ($taxonomy_ids) {
                $taxonomy_placeholders = implode(',', array_fill(0, count($taxonomy_ids), '%d'));
                $this->locked_query_ids(
                    "SELECT object_id FROM {$wpdb->term_relationships} WHERE term_taxonomy_id IN ({$taxonomy_placeholders}) ORDER BY object_id ASC{$lock}",
                    $taxonomy_ids,
                    'managed term relationship'
                );
            }
        }

        foreach (['show_on_front', 'page_on_front', 'rewrite_rules'] as $option_name) {
            $this->locked_query_ids(
                "SELECT option_id FROM {$wpdb->options} WHERE option_name = %s ORDER BY option_id ASC{$lock}",
                [$option_name],
                'release-critical option ' . $option_name
            );
        }

        foreach ($post_ids as $post_id) {
            clean_post_cache($post_id);
        }
        if ($term_ids) {
            clean_term_cache($term_ids);
        }
        $this->invalidate_term_query_generation();
        foreach (['show_on_front', 'page_on_front', 'blog_public', 'active_plugins', 'rewrite_rules', 'alloptions'] as $option) {
            wp_cache_delete($option, 'options');
        }
        if (is_multisite()) {
            wp_cache_delete('active_sitewide_plugins', 'site-options');
        }
    }

    /** @param array<int,mixed> $arguments @return array<int,int> */
    private function locked_query_ids(string $sql, array $arguments, string $label): array
    {
        global $wpdb;
        $trimmed = ltrim($sql);
        if (1 !== preg_match('/\ASELECT\b/i', $trimmed)
            || str_contains($trimmed, ';')
            || preg_match('/(?:--|#|\/\*)/', $trimmed)) {
            throw new RuntimeException('Only one comment-free SELECT is permitted for a current-read lock.');
        }
        $prepared = $arguments ? $wpdb->prepare($sql, $arguments) : $sql;
        if (!is_string($prepared)) {
            throw new RuntimeException('Could not prepare the ' . $label . ' current-read lock.');
        }
        $ids = $wpdb->get_col($prepared);
        if ('' !== (string) $wpdb->last_error || !is_array($ids)) {
            throw new RuntimeException('Could not acquire the ' . $label . ' current-read lock.');
        }
        return array_map('intval', $ids);
    }

    private function invalidate_term_query_generation(): void
    {
        if (function_exists('wp_cache_set_terms_last_changed')) {
            wp_cache_set_terms_last_changed();
            return;
        }
        wp_cache_set('last_changed', microtime(), 'terms');
    }

    private function remember_touched_post_id(int $id): void
    {
        if ($id > 0) {
            $this->touched_post_ids[] = $id;
        }
    }

    private function remember_touched_term_id(int $id): void
    {
        if ($id > 0) {
            $this->touched_term_ids[] = $id;
        }
    }

    /** @return array<string,mixed> */
    private function invalidate_caches_after_rollback(): array
    {
        $post_ids = array_values(array_unique(array_map('intval', $this->touched_post_ids), SORT_NUMERIC));
        $term_ids = array_values(array_unique(array_map('intval', $this->touched_term_ids), SORT_NUMERIC));
        sort($post_ids, SORT_NUMERIC);
        sort($term_ids, SORT_NUMERIC);
        $outcome = [
            'post_ids_invalidated' => [],
            'term_ids_invalidated' => [],
            'options_invalidated' => [],
            'targeted_failures' => [],
            'global_cache_flush' => [
                'attempted' => false,
                'persistent_object_cache' => function_exists('wp_using_ext_object_cache') && wp_using_ext_object_cache(),
                'reported_success' => false,
            ],
        ];
        foreach ($post_ids as $post_id) {
            try {
                clean_post_cache($post_id);
                wp_cache_delete($post_id, 'posts');
                wp_cache_delete($post_id, 'post_meta');
                $outcome['post_ids_invalidated'][] = $post_id;
            } catch (Throwable $cache_error) {
                $outcome['targeted_failures'][] = 'post:' . $post_id;
            }
        }
        foreach ($term_ids as $term_id) {
            try {
                clean_term_cache([$term_id]);
                wp_cache_delete($term_id, 'terms');
                wp_cache_delete($term_id, 'term_meta');
                $outcome['term_ids_invalidated'][] = $term_id;
            } catch (Throwable $cache_error) {
                $outcome['targeted_failures'][] = 'term:' . $term_id;
            }
        }
        foreach (['show_on_front', 'page_on_front', 'blog_public', 'active_plugins', 'rewrite_rules', 'alloptions'] as $option) {
            try {
                wp_cache_delete($option, 'options');
                $outcome['options_invalidated'][] = $option;
            } catch (Throwable $cache_error) {
                $outcome['targeted_failures'][] = 'option:' . $option;
            }
        }
        if (is_multisite()) {
            try {
                wp_cache_delete('active_sitewide_plugins', 'site-options');
                $outcome['options_invalidated'][] = 'active_sitewide_plugins';
            } catch (Throwable $cache_error) {
                $outcome['targeted_failures'][] = 'site-option:active_sitewide_plugins';
            }
        }

        // A failed transaction may have triggered third-party cache writes for
        // IDs the reconciler cannot discover, so fail safe with a full flush.
        try {
            $outcome['global_cache_flush']['attempted'] = true;
            $outcome['global_cache_flush']['reported_success'] = false !== wp_cache_flush();
            $this->invalidate_term_query_generation();
        } catch (Throwable $cache_error) {
            $outcome['targeted_failures'][] = 'global-cache-flush';
        }
        return $outcome;
    }

    /** @param array<string,mixed> $final_plan */
    private function assert_final_plan(array $final_plan): void
    {
        if (!empty($final_plan['summary']['conflict'])) {
            throw new RuntimeException('The final no-write reconciliation found conflicts.');
        }
        foreach (['terms', 'media', 'posts', 'embedded'] as $group) {
            foreach ((array) $final_plan['operations'][$group] as $operation) {
                if ('unchanged' !== (string) $operation['action']) {
                    if (isset($operation['desired'], $operation['before'])
                        && is_array($operation['desired']) && is_array($operation['before'])) {
                        $this->assert_desired(
                            $operation['desired'],
                            $operation['before'],
                            (string) $operation['key'] . '.final-plan'
                        );
                    }
                    throw new RuntimeException(
                        'The final no-write reconciliation is not idempotent for ' . (string) $operation['key']
                        . ' (' . (string) ($operation['action'] ?? 'missing-action')
                        . '/' . (string) ($operation['reason'] ?? 'missing-reason')
                        . '; fields=' . implode(',', array_keys((array) ($operation['changes'] ?? []))) . ').'
                    );
                }
            }
        }
        $option = $final_plan['operations']['options'][0] ?? [];
        if (!in_array((string) ($option['action'] ?? ''), ['unchanged', 'skipped'], true)) {
            throw new RuntimeException('The final front-page option state is not idempotent.');
        }
        $rewrite = $final_plan['operations']['options'][1] ?? [];
        if ('unchanged' !== (string) ($rewrite['action'] ?? '')) {
            throw new RuntimeException('The final rewrite-rule option state is not idempotent.');
        }
    }

    /** @return array<string,mixed> */
    private function apply_embedded_member(array $operation, array $entity_ids): array
    {
        $key = (string) $operation['key'];
        $this->assert_operation($operation, [
            'create' => ['embedded_parent_create'],
            'update' => ['embedded_parent_update'],
            'unchanged' => [
                'embedded_parent_exact',
                'embedded_parent_adopt_exact',
                'embedded_card_exact_parent_update',
            ],
        ], $key);
        $parent_id = (int) ($entity_ids['page.en.team'] ?? 0);
        $parent = $parent_id ? get_post($parent_id) : null;
        $team_keys = array_values(array_map('strval', (array) ($this->manifest['team_member_keys'] ?? [])));
        if (!$parent || $this->content_child_keys((string) $parent->post_content) !== $team_keys) {
            throw new RuntimeException('Embedded Team marker state changed for ' . $key . '.');
        }
        $status = ['create' => 'created', 'update' => 'updated', 'unchanged' => 'unchanged'][(string) $operation['action']];
        return $this->result('team-member', $key, $status, $parent_id);
    }

    /** @return array{deleted:array<int,string>,failed:array<int,string>} */
    private function cleanup_created_files(): array
    {
        $outcome = ['deleted' => [], 'failed' => []];
        $uploads = wp_get_upload_dir();
        $base = realpath((string) ($uploads['basedir'] ?? ''));
        foreach (array_values(array_unique($this->created_files, SORT_STRING)) as $file) {
            $real = realpath($file);
            if (false === $real || false === $base || !str_starts_with($real, trailingslashit($base)) || !is_file($real)) {
                $outcome['failed'][] = basename($file);
                continue;
            }
            wp_delete_file($real);
            if (is_file($real)) {
                $outcome['failed'][] = basename($real);
            } else {
                $outcome['deleted'][] = basename($real);
            }
        }
        return $outcome;
    }

    /** @param array<string,mixed> $metadata */
    private function remember_created_media_files(string $file, array $metadata): void
    {
        $this->created_files[] = $file;
        $directory = dirname($file);
        if (!empty($metadata['file'])) {
            $this->created_files[] = $directory . '/' . basename((string) $metadata['file']);
        }
        foreach ((array) ($metadata['sizes'] ?? []) as $size) {
            if (is_array($size) && !empty($size['file'])) {
                $this->created_files[] = $directory . '/' . basename((string) $size['file']);
            }
        }
        if (!empty($metadata['original_image'])) {
            $this->created_files[] = $directory . '/' . basename((string) $metadata['original_image']);
        }
    }

    /** @return array<string,bool> */
    private function directory_file_snapshot(string $directory): array
    {
        $entries = @scandir($directory);
        if (!is_array($entries)) {
            throw new RuntimeException('Could not snapshot the media upload directory.');
        }
        $snapshot = [];
        foreach ($entries as $entry) {
            if ('.' !== $entry && '..' !== $entry && is_file($directory . '/' . $entry)) {
                $snapshot[$entry] = true;
            }
        }
        return $snapshot;
    }

    /** @param array<string,bool> $before */
    private function remember_new_media_variants(string $source_file, array $before): void
    {
        $directory = dirname($source_file);
        $after = $this->directory_file_snapshot($directory);
        $stem = preg_quote((string) pathinfo($source_file, PATHINFO_FILENAME), '/');
        $pattern = '/^' . $stem . '(?:-(?:scaled|rotated))?(?:-\d+x\d+)?\.[a-z0-9]+$/i';
        foreach (array_diff_key($after, $before) as $entry => $_present) {
            if (preg_match($pattern, (string) $entry)) {
                $this->created_files[] = $directory . '/' . $entry;
            }
        }
    }

    /** @return array<int,array<string,mixed>> */
    private function validate_manifest_stage(): array
    {
        $checks = [];
        $this->asset_paths = [];
        if ('private-review' !== ($this->manifest['profile'] ?? '')) {
            $checks[] = $this->op('manifest', 'profile', 'conflict', 'manifest_profile_is_not_private_review');
        }
        $theme = wp_get_theme('farmtree-native');
        if (!$theme->exists()) {
            return array_merge($checks, [$this->op('manifest', 'farmtree-native', 'conflict', 'staged_theme_not_installed')]);
        }
        $root = realpath(get_theme_root('farmtree-native') . '/farmtree-native');
        if (false === $root || !is_dir($root)) {
            return array_merge($checks, [$this->op('manifest', 'farmtree-native', 'conflict', 'staged_theme_realpath_invalid')]);
        }
        $this->theme_root = $root;
        $this->theme_uri = untrailingslashit(get_theme_root_uri('farmtree-native') . '/farmtree-native');

        $keys = [];
        foreach (['terms', 'assets', 'entities'] as $collection) {
            foreach ($this->items($collection) as $item) {
                $key = isset($item['key']) ? (string) $item['key'] : '';
                if ('' === $key) {
                    $checks[] = $this->op('manifest', $collection, 'conflict', 'missing_managed_key');
                } elseif (isset($keys[$key])) {
                    $checks[] = $this->op('manifest', $key, 'conflict', 'duplicate_managed_key');
                }
                $keys[$key] = true;
            }
        }
        $team_keys = array_values(array_map('strval', (array) ($this->manifest['team_member_keys'] ?? [])));
        if (10 !== count($team_keys) || count($team_keys) !== count(array_unique($team_keys, SORT_STRING))) {
            $checks[] = $this->op('manifest', 'team-members', 'conflict', 'team_member_keys_must_be_exactly_ten_unique_keys');
        }
        foreach ($team_keys as $team_key) {
            if ('' === $team_key || !str_starts_with($team_key, 'team_member.')) {
                $checks[] = $this->op('manifest', $team_key ?: 'team-members', 'conflict', 'invalid_team_member_key');
            } elseif (isset($keys[$team_key])) {
                $checks[] = $this->op('manifest', $team_key, 'conflict', 'duplicate_managed_key');
            }
            $keys[$team_key] = true;
        }

        $asset_keys = [];
        $asset_slugs = [];
        foreach ($this->items('assets') as $asset) {
            $asset_keys[(string) $asset['key']] = true;
            $slug = sanitize_title((string) ($asset['slug'] ?? ''));
            if ('' === $slug || isset($asset_slugs[$slug])) {
                $checks[] = $this->op('manifest', (string) $asset['key'], 'conflict', 'duplicate_or_empty_attachment_slug');
            }
            $asset_slugs[$slug] = true;
        }
        $term_keys = [];
        $term_slugs = [];
        foreach ($this->items('terms') as $term) {
            $term_key = (string) $term['key'];
            $taxonomy = (string) ($term['taxonomy'] ?? '');
            $term_keys[$term_key] = $taxonomy;
            if (!taxonomy_exists($taxonomy)) {
                $checks[] = $this->op('manifest', $term_key, 'conflict', 'manifest_taxonomy_not_registered');
            }
            $slug_identity = $taxonomy . ':' . sanitize_title((string) ($term['slug'] ?? ''));
            if (str_ends_with($slug_identity, ':') || isset($term_slugs[$slug_identity])) {
                $checks[] = $this->op('manifest', $term_key, 'conflict', 'duplicate_or_empty_term_slug');
            }
            $term_slugs[$slug_identity] = true;
        }
        foreach ($this->items('assets') as $asset) {
            $key = (string) $asset['key'];
            $path = $this->theme_path((string) $asset['relative_path']);
            if ('' === $path) {
                $checks[] = $this->op('asset-stage', $key, 'conflict', 'asset_missing_or_outside_staged_theme');
                continue;
            }
            $declared = $this->mime((string) $asset['mime_type']);
            $filetype = wp_check_filetype(basename($path));
            if ($declared !== $this->mime((string) ($filetype['type'] ?? ''))) {
                $checks[] = $this->op('asset-stage', $key, 'conflict', 'asset_extension_mime_mismatch');
                continue;
            }
            if (class_exists('finfo')) {
                $finfo = new finfo(FILEINFO_MIME_TYPE);
                if ($declared !== $this->mime((string) $finfo->file($path))) {
                    $checks[] = $this->op('asset-stage', $key, 'conflict', 'asset_content_mime_mismatch');
                    continue;
                }
            }
            $actual_hash = hash_file('sha256', $path);
            if (!is_string($actual_hash) || !hash_equals(strtolower((string) $asset['sha256']), strtolower($actual_hash))) {
                $checks[] = $this->op('asset-stage', $key, 'conflict', 'asset_sha256_mismatch');
                continue;
            }
            $this->asset_paths[$key] = $path;
        }
        $entity_slug_identities = [];
        foreach ($this->items('entities') as $entity) {
            $entity_key = (string) $entity['key'];
            $post_type = (string) ($entity['post_type'] ?? '');
            if (!post_type_exists($post_type)) {
                $checks[] = $this->op('manifest', $entity_key, 'conflict', 'manifest_post_type_not_registered');
            }
            if ('private' !== (string) ($entity['fields']['post_status'] ?? '')) {
                $checks[] = $this->op('manifest', $entity_key, 'conflict', 'managed_entity_status_must_be_private');
            }
            $entity_slugs = array_values(array_unique(array_filter(array_merge(
                [sanitize_title((string) ($entity['slug'] ?? ''))],
                array_map('sanitize_title', (array) ($entity['legacy_slugs'] ?? []))
            ))));
            if (!$entity_slugs) {
                $checks[] = $this->op('manifest', $entity_key, 'conflict', 'empty_entity_slug');
            }
            foreach ($entity_slugs as $entity_slug) {
                $identity = $post_type . ':' . $entity_slug;
                if (isset($entity_slug_identities[$identity])) {
                    $checks[] = $this->op('manifest', $entity_key, 'conflict', 'duplicate_entity_or_legacy_slug');
                }
                $entity_slug_identities[$identity] = $entity_key;
                if (isset($asset_slugs[$entity_slug])) {
                    $checks[] = $this->op('manifest', $entity_key, 'conflict', 'attachment_entity_slug_namespace_conflict');
                }
            }
            $featured_key = (string) ($entity['featured_asset_key'] ?? '');
            if ('' !== $featured_key && !isset($asset_keys[$featured_key])) {
                $checks[] = $this->op('manifest', $entity_key, 'conflict', 'featured_asset_dependency_missing');
            }
            $category_keys = array_values(array_map('strval', (array) ($entity['category_keys'] ?? [])));
            if (count($category_keys) !== count(array_unique($category_keys, SORT_STRING))) {
                $checks[] = $this->op('manifest', $entity_key, 'conflict', 'duplicate_category_dependency');
            }
            foreach ($category_keys as $category_key) {
                if (!isset($term_keys[$category_key]) || 'category' !== $term_keys[$category_key]) {
                    $checks[] = $this->op('manifest', $entity_key, 'conflict', 'category_dependency_missing_or_invalid', [
                        'dependency_key' => $category_key,
                    ]);
                }
            }

            $child_keys = array_values(array_map('strval', (array) ($entity['child_keys'] ?? [])));
            if ('page.en.team' === $entity_key) {
                if ($child_keys !== $team_keys || count($child_keys) !== count(array_unique($child_keys, SORT_STRING))) {
                    $checks[] = $this->op('manifest', $entity_key, 'conflict', 'team_child_keys_do_not_match_team_member_keys');
                }
            } elseif ($child_keys) {
                $checks[] = $this->op('manifest', $entity_key, 'conflict', 'unexpected_embedded_child_keys');
            }

            $content = (string) ($entity['fields']['post_content'] ?? '');
            if (preg_match_all('/%%FARMTREE_THEME_URI:([^%]+)%%/', $content, $matches)) {
                foreach (array_unique($matches[1]) as $relative) {
                    if ('' === $this->theme_path((string) $relative)) {
                        $checks[] = $this->op('asset-stage', $entity_key, 'conflict', 'theme_uri_token_target_invalid');
                    }
                }
            }
            if (preg_match_all('/%%FARMTREE_MEDIA_(?:ID|URL):([^%]+)%%/', $content, $matches)) {
                foreach (array_unique($matches[1]) as $media_key) {
                    if (!isset($asset_keys[(string) $media_key])) {
                        $checks[] = $this->op('manifest', $entity_key, 'conflict', 'media_token_dependency_missing', [
                            'dependency_key' => (string) $media_key,
                        ]);
                    }
                }
            }
            if (preg_match_all('/%%FARMTREE_([A-Z_]+):([^%]+)%%/', $content, $matches)) {
                foreach (array_unique($matches[1]) as $token_type) {
                    if (!in_array((string) $token_type, ['THEME_URI', 'MEDIA_ID', 'MEDIA_URL'], true)) {
                        $checks[] = $this->op('manifest', $entity_key, 'conflict', 'unsupported_content_token', [
                            'token_type' => (string) $token_type,
                        ]);
                    }
                }
            }
        }
        foreach ($team_keys as $team_key) {
            $asset_key = 'asset.team.' . substr($team_key, strlen('team_member.'));
            if (!isset($asset_keys[$asset_key])) {
                $checks[] = $this->op('manifest', $team_key, 'conflict', 'team_member_asset_dependency_missing');
            }
        }
        return $checks;
    }

    /** @return array<int,array<string,mixed>> */
    private function reserved_locale_safety_operations(): array
    {
        $checks = [];
        global $wpdb;
        foreach ((array) ($this->manifest['reserved_locales'] ?? ['nl', 'de']) as $locale) {
            $locale = sanitize_title((string) $locale);
            $rows = $wpdb->get_results($wpdb->prepare(
                "SELECT ID, post_status FROM {$wpdb->posts}
                 WHERE post_type = %s AND post_name = %s AND post_parent = 0
                 ORDER BY ID ASC",
                'page',
                $locale
            ), ARRAY_A);
            if ('' !== (string) $wpdb->last_error || !is_array($rows)) {
                $checks[] = $this->op('reserved-locale', $locale, 'conflict', 'reserved_locale_lookup_failed');
                continue;
            }
            if (!$rows) {
                $checks[] = $this->op('reserved-locale', $locale, 'unchanged', 'reserved_locale_absent');
                continue;
            }
            $blocking = array_values(array_filter($rows, static function ($row): bool {
                return in_array((string) $row['post_status'], ['publish', 'future', 'private'], true);
            }));
            if ($blocking) {
                $checks[] = $this->op('reserved-locale', $locale, 'conflict', 'reserved_locale_publish_future_or_private', [
                    'matches' => $blocking,
                ]);
                continue;
            }
            $safe_statuses = ['draft', 'pending', 'trash', 'auto-draft'];
            $unknown = array_values(array_filter($rows, static function ($row) use ($safe_statuses): bool {
                return !in_array((string) $row['post_status'], $safe_statuses, true);
            }));
            if ($unknown) {
                $checks[] = $this->op('reserved-locale', $locale, 'conflict', 'reserved_locale_status_unknown', [
                    'matches' => $unknown,
                ]);
                continue;
            }
            $checks[] = $this->op('reserved-locale', $locale, 'skipped', 'reserved_locale_unpublished_untouched', [
                'matches' => $rows,
            ]);
        }
        return $checks;
    }

    private function is_loopback(): bool
    {
        $host = strtolower((string) wp_parse_url(home_url('/'), PHP_URL_HOST));
        return in_array($host, ['localhost', '127.0.0.1', '::1'], true) || str_ends_with($host, '.localhost');
    }

    /** @param array<string,mixed> $term @return array<string,mixed> */
    private function plan_term(array $term): array
    {
        $key = (string) $term['key'];
        $taxonomy = (string) $term['taxonomy'];
        $locations = $this->managed_key_locations($key);
        if (is_wp_error($locations)) {
            return $this->op('term', $key, 'conflict', 'managed_key_lookup_failed', ['error' => $locations->get_error_code()]);
        }
        $key_ids = $this->location_ids($locations, 'term', $taxonomy);
        if ($locations && (1 !== count($locations) || 1 !== count($key_ids))) {
            return $this->op('term', $key, 'conflict', 'global_managed_key_conflict', ['locations' => $locations]);
        }
        $slug_ids = $this->term_ids_by_slug($taxonomy, (string) $term['slug']);
        if (is_wp_error($slug_ids)) {
            return $this->op('term', $key, 'conflict', 'term_slug_lookup_failed', ['error' => $slug_ids->get_error_code()]);
        }
        $desired = $this->desired_term($term);
        $desired_hash = $this->hash($desired);
        $collision = count($key_ids) > 1 || count($slug_ids) > 1
            || (1 === count($key_ids) && array_diff($slug_ids, $key_ids));
        if ($collision) {
            return $this->op('term', $key, 'conflict', 'multiple_key_or_slug_matches', compact('key_ids', 'slug_ids', 'desired_hash'));
        }
        $id = $key_ids ? (int) reset($key_ids) : ($slug_ids ? (int) reset($slug_ids) : 0);
        if (!$id) {
            $name_conflict = $this->term_insert_name_conflict($taxonomy, $desired);
            if (is_wp_error($name_conflict)) {
                return $this->op('term', $key, 'conflict', 'term_name_preflight_failed', [
                    'desired_hash' => $desired_hash,
                    'error' => $name_conflict->get_error_code(),
                ]);
            }
            if ((int) $name_conflict > 0) {
                return $this->op('term', $key, 'conflict', 'term_name_parent_conflict', [
                    'id' => (int) $name_conflict,
                    'desired_hash' => $desired_hash,
                ]);
            }
        }
        $available_slug = wp_unique_term_slug((string) $desired['slug'], (object) [
            'term_id' => $id,
            'name' => (string) $desired['name'],
            'taxonomy' => $taxonomy,
            'description' => (string) $desired['description'],
            'parent' => 0,
            'slug' => (string) $desired['slug'],
            'alias_of' => '',
        ]);
        if (!hash_equals((string) $desired['slug'], (string) $available_slug)) {
            return $this->op('term', $key, 'conflict', 'term_slug_would_change', [
                'id' => $id,
                'desired_hash' => $desired_hash,
                'desired_slug' => (string) $desired['slug'],
                'available_slug' => (string) $available_slug,
            ]);
        }
        if (!$id) {
            return $this->op('term', $key, 'create', 'missing', compact('desired_hash', 'desired'));
        }
        $current = $this->current_term($id, $taxonomy);
        $current_hash = $this->hash($current);
        $managed_keys = $this->term_managed_keys($id);
        if (!$key_ids) {
            if ($managed_keys) {
                return $this->op('term', $key, 'conflict', 'candidate_owned_by_other_key', compact('id', 'current_hash', 'desired_hash', 'managed_keys'));
            }
            $managed_metadata = $this->term_managed_metadata_names($id);
            if ($managed_metadata) {
                return $this->op('term', $key, 'conflict', 'candidate_has_partial_managed_metadata', compact('id', 'current_hash', 'desired_hash', 'managed_metadata'));
            }
            if (!hash_equals($desired_hash, $current_hash)) {
                return $this->op('term', $key, 'conflict', 'unowned_slug_collision', compact('id', 'current_hash', 'desired_hash'));
            }
            $external_consumers = $this->external_term_consumers($id, $key);
            if (is_wp_error($external_consumers)) {
                return $this->op('term', $key, 'conflict', 'term_consumer_lookup_failed', ['id' => $id, 'error' => $external_consumers->get_error_code()]);
            }
            if ($external_consumers) {
                return $this->op('term', $key, 'conflict', 'term_has_external_consumers', compact('id', 'external_consumers'));
            }
            return $this->op('term', $key, 'update', 'adopt_exact', [
                    'id' => $id,
                    'current_hash' => $current_hash,
                    'desired_hash' => $desired_hash,
                    'before' => $current,
                    'desired' => $desired,
                    'changes' => $this->field_changes($current, $desired),
                ]);
        }
        if (1 !== count($managed_keys) || !hash_equals($key, $managed_keys[0])) {
            return $this->op('term', $key, 'conflict', 'multiple_or_mismatched_managed_keys', compact('id', 'current_hash', 'desired_hash', 'managed_keys'));
        }
        $result = $this->owned_plan('term', $key, $id, $current, $desired, (string) get_term_meta($id, self::META_APPLIED_HASH, true));
        if ('update' === $result['action'] && 'owned_update' === $result['reason']) {
            $external_consumers = $this->external_term_consumers($id, $key);
            if (is_wp_error($external_consumers)) {
                return $this->op('term', $key, 'conflict', 'term_consumer_lookup_failed', ['id' => $id, 'error' => $external_consumers->get_error_code()]);
            }
            if ($external_consumers) {
                return $this->op('term', $key, 'conflict', 'term_has_external_consumers', compact('id', 'external_consumers'));
            }
        }
        return $result;
    }

    /** @param array<string,mixed> $asset @return array<string,mixed> */
    private function plan_asset(array $asset): array
    {
        $key = (string) $asset['key'];
        $desired = $this->desired_asset($asset);
        $desired_hash = $this->hash($desired);
        if (empty($this->asset_paths[$key])) {
            return $this->op('media', $key, 'conflict', 'staged_asset_not_validated', compact('desired_hash'));
        }
        $locations = $this->managed_key_locations($key);
        if (is_wp_error($locations)) {
            return $this->op('media', $key, 'conflict', 'managed_key_lookup_failed', ['error' => $locations->get_error_code()]);
        }
        $key_ids = $this->location_ids($locations, 'post', 'attachment');
        if ($locations && (1 !== count($locations) || 1 !== count($key_ids))) {
            return $this->op('media', $key, 'conflict', 'global_managed_key_conflict', ['locations' => $locations]);
        }
        $slug_ids = $this->post_ids_by_slugs('attachment', [(string) $asset['slug']]);
        if (is_wp_error($slug_ids)) {
            return $this->op('media', $key, 'conflict', 'post_slug_lookup_failed', ['error' => $slug_ids->get_error_code()]);
        }
        $collision = count($key_ids) > 1 || count($slug_ids) > 1
            || (1 === count($key_ids) && array_diff($slug_ids, $key_ids));
        if ($collision) {
            return $this->op('media', $key, 'conflict', 'multiple_key_or_slug_matches', compact('key_ids', 'slug_ids', 'desired_hash'));
        }
        $id = $key_ids ? (int) reset($key_ids) : ($slug_ids ? (int) reset($slug_ids) : 0);
        $available_slug = wp_unique_post_slug((string) $desired['slug'], $id, 'inherit', 'attachment', 0);
        if (!hash_equals((string) $desired['slug'], (string) $available_slug)) {
            return $this->op('media', $key, 'conflict', 'attachment_slug_would_change', [
                'id' => $id,
                'desired_hash' => $desired_hash,
                'desired_slug' => (string) $desired['slug'],
                'available_slug' => (string) $available_slug,
            ]);
        }
        if (!$id) {
            return $this->op('media', $key, 'create', 'missing', compact('desired_hash', 'desired'));
        }
        $current = $this->current_asset($id);
        if (is_wp_error($current)) {
            return $this->op('media', $key, 'conflict', $current->get_error_code(), compact('id', 'desired_hash'));
        }
        $current_hash = $this->hash($current);
        $managed_keys = $this->post_managed_keys($id);
        if (!$key_ids) {
            if ($managed_keys) {
                return $this->op('media', $key, 'conflict', 'candidate_owned_by_other_key', compact('id', 'current_hash', 'desired_hash', 'managed_keys'));
            }
            $managed_metadata = $this->post_managed_metadata_names($id);
            if ($managed_metadata) {
                return $this->op('media', $key, 'conflict', 'candidate_has_partial_managed_metadata', compact('id', 'current_hash', 'desired_hash', 'managed_metadata'));
            }
            if (!hash_equals($desired_hash, $current_hash)) {
                return $this->op('media', $key, 'conflict', 'unowned_slug_or_binary_collision', compact('id', 'current_hash', 'desired_hash'));
            }
            $external_consumers = $this->external_media_consumers($id, $key);
            if (is_wp_error($external_consumers)) {
                return $this->op('media', $key, 'conflict', 'media_consumer_lookup_failed', ['id' => $id, 'error' => $external_consumers->get_error_code()]);
            }
            if ($external_consumers) {
                return $this->op('media', $key, 'conflict', 'media_has_external_consumers', compact('id', 'external_consumers'));
            }
            return $this->op('media', $key, 'update', 'adopt_exact', [
                    'id' => $id,
                    'current_hash' => $current_hash,
                    'desired_hash' => $desired_hash,
                    'before' => $current,
                    'desired' => $desired,
                    'changes' => $this->field_changes($current, $desired),
                ]);
        }
        if (1 !== count($managed_keys) || !hash_equals($key, $managed_keys[0])) {
            return $this->op('media', $key, 'conflict', 'multiple_or_mismatched_managed_keys', compact('id', 'current_hash', 'desired_hash', 'managed_keys'));
        }
        $stored_sha = strtolower((string) get_post_meta($id, self::META_ASSET_SHA, true));
        $current_sha = strtolower((string) $current['sha256']);
        $manifest_sha = strtolower((string) $asset['sha256']);
        if ('' === $stored_sha || !hash_equals($stored_sha, $current_sha) || !hash_equals($manifest_sha, $current_sha)) {
            return $this->op('media', $key, 'conflict', 'managed_media_binary_changed', compact('id', 'current_hash', 'desired_hash'));
        }
        $result = $this->owned_plan('media', $key, $id, $current, $desired, (string) get_post_meta($id, self::META_APPLIED_HASH, true));
        if ('update' === $result['action']) {
            $external_consumers = $this->external_media_consumers($id, $key);
            if (is_wp_error($external_consumers)) {
                return $this->op('media', $key, 'conflict', 'media_consumer_lookup_failed', ['id' => $id, 'error' => $external_consumers->get_error_code()]);
            }
            if ($external_consumers) {
                return $this->op('media', $key, 'conflict', 'media_has_external_consumers', compact('id', 'external_consumers'));
            }
            $result['reason'] = 'owned_metadata_update';
        }
        return $result;
    }

    /**
     * @param array<string,mixed> $entity
     * @param array<string,int> $asset_ids
     * @param array<int,string> $asset_id_keys
     * @param array<int,string> $term_id_keys
     * @return array<string,mixed>
     */
    private function plan_entity(array $entity, array $asset_ids, array $asset_id_keys, array $term_id_keys): array
    {
        $key = (string) $entity['key'];
        $type = (string) $entity['post_type'];
        $slugs = array_values(array_unique(array_filter(array_merge(
            [(string) $entity['slug']],
            (array) ($entity['legacy_slugs'] ?? [])
        ))));
        $locations = $this->managed_key_locations($key);
        if (is_wp_error($locations)) {
            return $this->op('post', $key, 'conflict', 'managed_key_lookup_failed', ['error' => $locations->get_error_code()]);
        }
        $key_ids = $this->location_ids($locations, 'post', $type);
        if ($locations && (1 !== count($locations) || 1 !== count($key_ids))) {
            return $this->op('post', $key, 'conflict', 'global_managed_key_conflict', ['locations' => $locations]);
        }
        $slug_ids = $this->post_ids_by_slugs($type, $slugs);
        if (is_wp_error($slug_ids)) {
            return $this->op('post', $key, 'conflict', 'post_slug_lookup_failed', ['error' => $slug_ids->get_error_code()]);
        }
        $resolved = true;
        $desired = $this->desired_entity($entity, $asset_ids, $resolved);
        $desired_hash = $this->hash($desired);
        $source_hash = $this->hash($entity);
        $collision = count($key_ids) > 1 || count($slug_ids) > 1
            || (1 === count($key_ids) && array_diff($slug_ids, $key_ids));
        if ($collision) {
            return $this->op('post', $key, 'conflict', 'multiple_key_or_slug_matches', compact('key_ids', 'slug_ids', 'desired_hash', 'source_hash'));
        }
        $id = $key_ids ? (int) reset($key_ids) : ($slug_ids ? (int) reset($slug_ids) : 0);
        if ($id > 0) {
            $desired = $this->desired_entity($entity, $asset_ids, $resolved, $id);
            $desired_hash = $this->hash($desired);
        }
        $available_slug = wp_unique_post_slug(
            (string) $desired['post_name'],
            $id,
            (string) $desired['post_status'],
            (string) $desired['post_type'],
            (int) $desired['post_parent']
        );
        if (!hash_equals((string) $desired['post_name'], (string) $available_slug)) {
            return $this->op('post', $key, 'conflict', 'entity_slug_would_change', [
                'id' => $id,
                'desired_hash' => $desired_hash,
                'source_hash' => $source_hash,
                'resolved' => $resolved,
                'desired_slug' => (string) $desired['post_name'],
                'available_slug' => (string) $available_slug,
            ]);
        }
        if (!$resolved) {
            return $this->op('post', $key, 'conflict', 'entity_dependencies_or_tokens_unresolved', compact('id', 'desired_hash', 'source_hash', 'resolved'));
        }
        if (!$id) {
            return $this->op('post', $key, 'create', 'missing', compact('desired_hash', 'source_hash', 'resolved', 'desired'));
        }
        $current = $this->current_entity($id, $entity, $asset_id_keys, $term_id_keys);
        $current_hash = $this->hash($current);
        $managed_keys = $this->post_managed_keys($id);
        if (!$key_ids) {
            if ($managed_keys) {
                return $this->op('post', $key, 'conflict', 'candidate_owned_by_other_key', compact('id', 'current_hash', 'desired_hash', 'source_hash', 'resolved', 'managed_keys'));
            }
            $managed_metadata = $this->post_managed_metadata_names($id);
            if ($managed_metadata) {
                return $this->op('post', $key, 'conflict', 'candidate_has_partial_managed_metadata', compact('id', 'current_hash', 'desired_hash', 'source_hash', 'resolved', 'managed_metadata'));
            }
            return $resolved && hash_equals($desired_hash, $current_hash)
                ? $this->op('post', $key, 'update', 'adopt_exact', [
                    'id' => $id,
                    'current_hash' => $current_hash,
                    'desired_hash' => $desired_hash,
                    'source_hash' => $source_hash,
                    'resolved' => $resolved,
                    'before' => $current,
                    'desired' => $desired,
                    'changes' => $this->field_changes($current, $desired),
                ])
                : $this->op('post', $key, 'conflict', 'unowned_slug_collision', compact('id', 'current_hash', 'desired_hash', 'source_hash', 'resolved'));
        }
        if (1 !== count($managed_keys) || !hash_equals($key, $managed_keys[0])) {
            return $this->op('post', $key, 'conflict', 'multiple_or_mismatched_managed_keys', compact('id', 'current_hash', 'desired_hash', 'source_hash', 'resolved', 'managed_keys'));
        }
        if (!$resolved) {
            return $this->op('post', $key, 'conflict', 'owned_entity_has_unresolved_media_dependency', compact('id', 'current_hash', 'desired_hash', 'source_hash', 'resolved'));
        }
        $result = $this->owned_plan('post', $key, $id, $current, $desired, (string) get_post_meta($id, self::META_APPLIED_HASH, true));
        $result['source_hash'] = $source_hash;
        if ('update' === $result['action'] && 'owned_update' === $result['reason']) {
            $post = get_post($id);
            $enabled = $post ? wp_revisions_enabled($post) : false;
            $result['revision_policy'] = $enabled
                ? 'verified_new_or_matching_latest_required'
                : 'revisions_disabled_update_remains_transactional';
        }
        return $result;
    }

    /** @return array<string,mixed> */
    private function owned_plan(string $kind, string $key, int $id, array $current, array $desired, string $applied_hash): array
    {
        $current_hash = $this->hash($current);
        $desired_hash = $this->hash($desired);
        if ('' === $applied_hash) {
            return $this->op($kind, $key, 'conflict', 'owned_item_missing_applied_hash', compact('id', 'current_hash', 'desired_hash'));
        }
        if (!hash_equals($applied_hash, $current_hash)) {
            return $this->op($kind, $key, 'conflict', 'owned_item_changed_since_apply', compact('id', 'current_hash', 'desired_hash', 'applied_hash'));
        }
        if (hash_equals($desired_hash, $current_hash)) {
            return $this->op($kind, $key, 'unchanged', 'exact', compact('id', 'current_hash', 'desired_hash'));
        }
        return $this->op($kind, $key, 'update', 'owned_update', [
            'id' => $id,
            'current_hash' => $current_hash,
            'desired_hash' => $desired_hash,
            'applied_hash' => $applied_hash,
            'before' => $current,
            'desired' => $desired,
            'changes' => $this->field_changes($current, $desired),
        ]);
    }

    /** @param array<int,array<string,mixed>> $post_ops @return array<int,array<string,mixed>> */
    private function plan_embedded_members(array $post_ops): array
    {
        $team_keys = array_values(array_map('strval', (array) ($this->manifest['team_member_keys'] ?? [])));
        $parent = null;
        foreach ($post_ops as $operation) {
            if ('page.en.team' === (string) ($operation['key'] ?? '')) {
                $parent = $operation;
                break;
            }
        }
        $entity = $this->item_by_key('entities', 'page.en.team');
        $resolved = true;
        $desired_state = $entity
            ? $this->desired_entity($entity, [], $resolved, (int) ($parent['id'] ?? 0))
            : [];
        $payloads = $resolved ? $this->embedded_member_payloads((string) ($desired_state['post_content'] ?? ''), $team_keys) : [];
        $valid = 10 === count($team_keys)
            && count($team_keys) === count(array_unique($team_keys, SORT_STRING))
            && $payloads
            && count($payloads) === count($team_keys)
            && $parent;

        $operations = [];
        foreach ($team_keys as $position => $team_key) {
            $desired = $payloads[$team_key] ?? [
                'managed_key' => $team_key,
                'parent_key' => 'page.en.team',
                'position' => $position,
            ];
            $desired_hash = $this->hash($desired);
            $locations = $this->managed_key_locations($team_key);
            if (is_wp_error($locations)) {
                $operations[] = $this->op('team-member', $team_key, 'conflict', 'managed_key_lookup_failed', [
                    'desired' => $desired,
                    'desired_hash' => $desired_hash,
                    'error' => $locations->get_error_code(),
                ]);
                continue;
            }
            if ($locations) {
                $operations[] = $this->op('team-member', $team_key, 'conflict', 'embedded_key_assigned_to_database_object', [
                    'desired' => $desired,
                    'desired_hash' => $desired_hash,
                    'locations' => $locations,
                ]);
                continue;
            }
            $marker_locations = $this->embedded_marker_locations($team_key);
            if (is_wp_error($marker_locations)) {
                $operations[] = $this->op('team-member', $team_key, 'conflict', 'embedded_marker_lookup_failed', [
                    'desired' => $desired,
                    'desired_hash' => $desired_hash,
                    'error' => $marker_locations->get_error_code(),
                ]);
                continue;
            }
            $parent_id = (int) ($parent['id'] ?? 0);
            if (($parent_id && $marker_locations !== [$parent_id]) || (!$parent_id && $marker_locations)) {
                $operations[] = $this->op('team-member', $team_key, 'conflict', 'embedded_marker_used_outside_managed_parent', [
                    'desired' => $desired,
                    'desired_hash' => $desired_hash,
                    'post_ids' => $marker_locations,
                ]);
                continue;
            }
            if (!$valid || 'conflict' === (string) ($parent['action'] ?? 'conflict')) {
                $operations[] = $this->op('team-member', $team_key, 'conflict', 'embedded_parent_or_marker_conflict', compact('desired', 'desired_hash'));
                continue;
            }
            if ('create' === $parent['action']) {
                $operations[] = $this->op('team-member', $team_key, 'create', 'embedded_parent_create', compact('desired', 'desired_hash'));
                continue;
            }
            if ('update' === $parent['action'] && 'owned_update' === $parent['reason']) {
                $before_payloads = $this->embedded_member_payloads((string) ($parent['before']['post_content'] ?? ''), $team_keys);
                $before = $before_payloads[$team_key] ?? null;
                if (is_array($before) && hash_equals($this->hash($before), $desired_hash)) {
                    $operations[] = $this->op(
                        'team-member',
                        $team_key,
                        'unchanged',
                        'embedded_card_exact_parent_update',
                        compact('desired_hash')
                    );
                } else {
                    $operations[] = $this->op('team-member', $team_key, 'update', 'embedded_parent_update', [
                        'before' => $before,
                        'desired' => $desired,
                        'desired_hash' => $desired_hash,
                        'changes' => is_array($before) ? $this->field_changes($before, $desired) : ['embedded_card' => ['before' => null, 'desired' => $desired]],
                    ]);
                }
                continue;
            }
            if ('unchanged' === $parent['action'] || ('update' === $parent['action'] && 'adopt_exact' === $parent['reason'])) {
                $reason = 'unchanged' === $parent['action'] ? 'embedded_parent_exact' : 'embedded_parent_adopt_exact';
                $operations[] = $this->op('team-member', $team_key, 'unchanged', $reason, compact('desired_hash'));
                continue;
            }
            $operations[] = $this->op('team-member', $team_key, 'conflict', 'embedded_parent_action_invalid', compact('desired', 'desired_hash'));
        }
        return $operations;
    }

    /** @param array<int,string> $team_keys @return array<string,array<string,mixed>> */
    private function embedded_member_payloads(string $content, array $team_keys): array
    {
        $payloads = [];
        if (!preg_match_all(
            '/<article\b[^>]*\bdata-farmtree-managed-key=(["\'])(team_member\.[^"\']+)\1[^>]*>.*?<\/article>/s',
            $content,
            $matches,
            PREG_SET_ORDER
        )) {
            return [];
        }
        foreach ($matches as $position => $match) {
            $key = (string) $match[2];
            if (!isset($team_keys[$position]) || $team_keys[$position] !== $key || isset($payloads[$key])) {
                return [];
            }
            $payloads[$key] = [
                'managed_key' => $key,
                'parent_key' => 'page.en.team',
                'position' => $position,
                'asset_key' => 'asset.team.' . substr($key, strlen('team_member.')),
                'card_hash' => hash('sha256', (string) $match[0]),
            ];
        }
        return count($payloads) === count($team_keys) ? $payloads : [];
    }

    /** @param array<string,int> $entity_ids @param array<int,array<string,mixed>> $post_ops @return array<string,mixed> */
    private function plan_front_page(bool $enabled, array $entity_ids, array $post_ops): array
    {
        if (!$enabled) {
            return $this->op('option', 'front-page', 'skipped', 'set_front_page_not_requested');
        }
        $home = null;
        foreach ($post_ops as $operation) {
            if ('page.en.home' === $operation['key']) {
                $home = $operation;
                break;
            }
        }
        if (null === $home || 'conflict' === $home['action']) {
            return $this->op('option', 'front-page', 'conflict', 'homepage_entity_not_safe');
        }
        $before = ['show_on_front' => (string) get_option('show_on_front'), 'page_on_front' => (int) get_option('page_on_front')];
        $id = (int) ($entity_ids['page.en.home'] ?? 0);
        $desired = ['show_on_front' => 'page', 'page_on_front' => $id ?: 'managed:page.en.home'];
        if ($id && 'page' === $before['show_on_front'] && $id === $before['page_on_front']) {
            return $this->op('option', 'front-page', 'unchanged', 'exact', compact('before', 'desired'));
        }
        return $this->op('option', 'front-page', 'update', 'explicit_set_front_page', [
            'before' => $before,
            'desired' => $desired,
            'changes' => $this->field_changes($before, $desired),
        ]);
    }

    /** @param array<string,mixed> $term @return array<string,mixed> */
    private function desired_term(array $term): array
    {
        $taxonomy = (string) $term['taxonomy'];
        return [
            'taxonomy' => $taxonomy,
            'slug' => sanitize_title((string) $term['slug']),
            // Terms are entity-encoded by WordPress's DB-context filters.
            'name' => (string) wp_unslash(sanitize_term_field('name', wp_slash((string) $term['name']), 0, $taxonomy, 'db')),
            'description' => (string) wp_unslash(sanitize_term_field('description', wp_slash((string) $term['description']), 0, $taxonomy, 'db')),
            'parent' => 0,
        ];
    }

    /** @return array<string,mixed> */
    private function current_term(int $id, string $taxonomy): array
    {
        $term = get_term($id, $taxonomy);
        if (!$term || is_wp_error($term)) {
            return ['missing' => true];
        }
        return [
            'taxonomy' => (string) $term->taxonomy,
            'slug' => (string) $term->slug,
            'name' => (string) $term->name,
            'description' => (string) $term->description,
            'parent' => (int) $term->parent,
        ];
    }

    /**
     * Mirror wp_insert_term()'s same-name/same-parent rejection without writes.
     * A different explicitly supplied slug is intentionally allowed by core.
     *
     * @param array<string,mixed> $desired
     * @return int|WP_Error
     */
    private function term_insert_name_conflict(string $taxonomy, array $desired)
    {
        $name = (string) $desired['name'];
        $slug = (string) $desired['slug'];
        $parent = (int) $desired['parent'];
        $slug_provided = '' !== $slug;
        $name_matches = get_terms([
            'taxonomy' => $taxonomy,
            'name' => $name,
            'hide_empty' => false,
            'parent' => $parent,
            'update_term_meta_cache' => false,
        ]);
        if (is_wp_error($name_matches)) {
            return $name_matches;
        }

        $name_match = null;
        foreach ($name_matches as $match) {
            if (strtolower($name) === strtolower((string) $match->name)) {
                $name_match = $match;
                break;
            }
        }
        if (!$name_match) {
            return 0;
        }

        $slug_match = get_term_by('slug', $slug, $taxonomy);
        if ($slug_provided && (string) $name_match->slug !== $slug && !$slug_match) {
            return 0;
        }
        if (!is_taxonomy_hierarchical($taxonomy)) {
            return (int) $name_match->term_id;
        }

        $siblings = get_terms([
            'taxonomy' => $taxonomy,
            'get' => 'all',
            'parent' => $parent,
            'update_term_meta_cache' => false,
        ]);
        if (is_wp_error($siblings)) {
            return $siblings;
        }
        $sibling_names = wp_list_pluck($siblings, 'name');
        $sibling_slugs = wp_list_pluck($siblings, 'slug');
        if ((!$slug_provided || (string) $name_match->slug === $slug) && in_array($name, $sibling_names, true)) {
            return (int) $name_match->term_id;
        }
        if ($slug_match && in_array($slug, $sibling_slugs, true)) {
            return (int) $slug_match->term_id;
        }
        return 0;
    }

    /** @param array<string,mixed> $asset @return array<string,string> */
    private function desired_asset(array $asset): array
    {
        return [
            'slug' => sanitize_title($this->post_db_value('post_name', (string) $asset['slug'])),
            'title' => $this->post_db_value('post_title', (string) $asset['title']),
            'alt' => sanitize_text_field((string) $asset['alt']),
            'mime_type' => $this->mime(sanitize_mime_type($this->post_db_value('post_mime_type', (string) $asset['mime_type']))),
            'sha256' => strtolower((string) $asset['sha256']),
        ];
    }

    /** @return array<string,string>|WP_Error */
    private function current_asset(int $id)
    {
        $post = get_post($id);
        if (!$post || 'attachment' !== $post->post_type) {
            return new WP_Error('attachment_missing', 'Attachment is missing.');
        }
        $file = get_attached_file($id, true);
        if (!is_string($file) || !is_file($file)) {
            return new WP_Error('attachment_file_missing', 'Attachment file is missing.');
        }
        $sha = hash_file('sha256', $file);
        if (!is_string($sha)) {
            return new WP_Error('attachment_hash_failed', 'Attachment could not be hashed.');
        }
        return [
            'slug' => (string) $post->post_name,
            'title' => (string) $post->post_title,
            'alt' => (string) get_post_meta($id, '_wp_attachment_image_alt', true),
            'mime_type' => $this->mime((string) $post->post_mime_type),
            'sha256' => strtolower($sha),
        ];
    }

    /**
     * @param array<string,mixed> $entity
     * @param array<string,int> $asset_ids
     * @return array<string,mixed>
     */
    private function desired_entity(array $entity, array $asset_ids, bool &$resolved, int $post_id = 0): array
    {
        $state = $this->manifest_entity_state($entity, $resolved);
        $state['post_title'] = $this->post_db_value('post_title', (string) $state['post_title'], $post_id);
        $state['post_name'] = sanitize_title($this->post_db_value('post_name', (string) $state['post_name'], $post_id));
        $state['post_excerpt'] = $this->post_db_value('post_excerpt', (string) $state['post_excerpt'], $post_id);
        $state['post_content'] = $this->canonical_token_content(
            (string) $state['post_content'],
            $asset_ids,
            $post_id,
            $resolved
        );
        return $state;
    }

    /**
     * Run save filters against syntactically valid URLs/IDs, never against the
     * private release tokens. Stable placeholders cover media not created yet;
     * all expansions are restored to stable tokens after canonicalization.
     *
     * @param array<string,int> $asset_ids
     */
    private function canonical_token_content(
        string $content,
        array $asset_ids,
        int $post_id,
        bool &$resolved
    ): string {
        $placeholder_tokens = [];
        $content = preg_replace_callback('/%%FARMTREE_THEME_URI:([^%]+)%%/', function ($matches) use (&$resolved) {
            $relative = ltrim((string) $matches[1], '/\\');
            if ('' === $this->theme_path($relative)) {
                $resolved = false;
                return $matches[0];
            }
            $encoded = implode('/', array_map('rawurlencode', explode('/', $relative)));
            return trailingslashit($this->theme_uri) . $encoded;
        }, $content);
        $asset_index = 0;
        $content = preg_replace_callback(
            '/%%FARMTREE_MEDIA_(ID|URL):([^%]+)%%/',
            function ($matches) use ($asset_ids, &$resolved, &$placeholder_tokens, &$asset_index) {
                $type = (string) $matches[1];
                $key = (string) $matches[2];
                if (!$this->item_by_key('assets', $key) || empty($this->asset_paths[$key])) {
                    $resolved = false;
                    return $matches[0];
                }
                if (!empty($asset_ids[$key])) {
                    if ('ID' === $type) {
                        return (string) (int) $asset_ids[$key];
                    }
                    $url = wp_get_attachment_url((int) $asset_ids[$key]);
                    if (!is_string($url) || '' === $url) {
                        $resolved = false;
                        return $matches[0];
                    }
                    return esc_url_raw($url);
                }
                $placeholder = 'ID' === $type
                    ? (string) (2147000000 + $asset_index)
                    : 'https://farmtree.invalid/__managed_media__/' . rawurlencode($key);
                $placeholder_tokens[$placeholder] = (string) $matches[0];
                ++$asset_index;
                return $placeholder;
            },
            $content
        );
        if (str_contains((string) $content, '%%FARMTREE_')) {
            $resolved = false;
            return (string) $content;
        }
        $content = $this->post_db_value('post_content', (string) $content, $post_id);
        $content = $this->normalize_content_to_tokens((string) $content, array_flip($asset_ids));
        if ($placeholder_tokens) {
            $content = str_replace(array_keys($placeholder_tokens), array_values($placeholder_tokens), $content);
        }
        if (str_contains((string) $content, 'farmtree.invalid/__managed_media__')) {
            $resolved = false;
        }
        return (string) $content;
    }

    /**
     * Return unsanitized manifest semantics. WordPress must receive this state
     * exactly once so its save filters are not applied once here and a second
     * time inside wp_insert_post() / wp_update_post().
     *
     * @param array<string,mixed> $entity
     * @return array<string,mixed>
     */
    private function manifest_entity_state(array $entity, bool &$resolved): array
    {
        $fields = (array) $entity['fields'];
        $content = (string) ($fields['post_content'] ?? '');
        $resolved = true;
        $content = preg_replace_callback('/%%FARMTREE_THEME_URI:([^%]+)%%/', function ($matches) use (&$resolved) {
            $relative = ltrim((string) $matches[1], '/\\');
            if ('' === $this->theme_path($relative)) {
                $resolved = false;
            }
            return $matches[0];
        }, $content);
        $content = preg_replace_callback('/%%FARMTREE_MEDIA_(ID|URL):([^%]+)%%/', function ($matches) use (&$resolved) {
            $key = (string) $matches[2];
            $asset = $this->item_by_key('assets', $key);
            if (!$asset || empty($this->asset_paths[$key])) {
                $resolved = false;
            }
            return $matches[0];
        }, $content);
        $child_keys = array_values((array) ($entity['child_keys'] ?? []));
        $content = $this->inject_child_markers((string) $content, $child_keys, $resolved);
        $state = [
            'post_type' => (string) $entity['post_type'],
            'post_title' => (string) ($fields['post_title'] ?? ''),
            'post_name' => (string) ($fields['post_name'] ?? $entity['slug']),
            'post_status' => (string) ($fields['post_status'] ?? ''),
            'post_parent' => 0,
            'post_excerpt' => (string) ($fields['post_excerpt'] ?? ''),
            'post_content' => (string) $content,
            'menu_order' => (int) ($fields['menu_order'] ?? 0),
            'featured_asset_key' => (string) ($entity['featured_asset_key'] ?? ''),
            'category_keys' => array_values((array) ($entity['category_keys'] ?? [])),
            'child_keys' => $child_keys,
        ];
        sort($state['category_keys'], SORT_STRING);
        if (!empty($fields['post_date'])) {
            $state['post_date'] = (string) $fields['post_date'];
        }
        return $state;
    }

    /**
     * @param array<string,mixed> $entity
     * @param array<int,string> $asset_id_keys
     * @param array<int,string> $term_id_keys
     * @return array<string,mixed>
     */
    private function current_entity(int $id, array $entity, array $asset_id_keys, array $term_id_keys): array
    {
        $post = get_post($id);
        if (!$post) {
            return ['missing' => true];
        }
        $thumbnail = (int) get_post_thumbnail_id($id);
        $featured_key = '';
        if ($thumbnail) {
            $featured_key = (string) ($asset_id_keys[$thumbnail] ?? get_post_meta($thumbnail, self::META_KEY, true));
            if ('' === $featured_key) {
                $featured_key = 'unmanaged:' . $thumbnail;
            }
        }
        $category_keys = [];
        if ('post' === (string) $entity['post_type']) {
            $category_ids = wp_get_post_categories($id);
            if (is_wp_error($category_ids)) {
                throw new RuntimeException('Category relationship lookup failed for ' . (string) $entity['key'] . '.');
            }
            foreach ($category_ids as $term_id) {
                $key = (string) ($term_id_keys[(int) $term_id] ?? get_term_meta((int) $term_id, self::META_KEY, true));
                $category_keys[] = '' !== $key ? $key : 'unmanaged:' . (int) $term_id;
            }
            sort($category_keys, SORT_STRING);
        }
        $state = [
            'post_type' => (string) $post->post_type,
            'post_title' => (string) $post->post_title,
            'post_name' => (string) $post->post_name,
            'post_status' => (string) $post->post_status,
            'post_parent' => (int) $post->post_parent,
            'post_excerpt' => (string) $post->post_excerpt,
            'post_content' => $this->normalize_content_to_tokens((string) $post->post_content, $asset_id_keys),
            'menu_order' => (int) $post->menu_order,
            'featured_asset_key' => $featured_key,
            'category_keys' => $category_keys,
            'child_keys' => $this->content_child_keys((string) $post->post_content),
        ];
        if (!empty($entity['fields']['post_date'])) {
            $state['post_date'] = (string) $post->post_date;
        }
        return $state;
    }

    /**
     * Resolve stable canonical tokens only for the DB write. The plan and
     * fingerprints retain tokens so attachment IDs and URLs are deterministic.
     *
     * @param array<string,mixed> $entity
     * @param array<string,int> $asset_ids
     * @return array<string,mixed>
     */
    private function write_entity_state(array $entity, array $asset_ids, bool &$resolved): array
    {
        $state = $this->manifest_entity_state($entity, $resolved);
        $content = (string) $state['post_content'];
        $content = preg_replace_callback('/%%FARMTREE_THEME_URI:([^%]+)%%/', function ($matches) use (&$resolved) {
            $relative = ltrim((string) $matches[1], '/\\');
            if ('' === $this->theme_path($relative)) {
                $resolved = false;
                return $matches[0];
            }
            $encoded = implode('/', array_map('rawurlencode', explode('/', $relative)));
            return trailingslashit($this->theme_uri) . $encoded;
        }, $content);
        $content = preg_replace_callback('/%%FARMTREE_MEDIA_(ID|URL):([^%]+)%%/', function ($matches) use ($asset_ids, &$resolved) {
            $key = (string) $matches[2];
            if (empty($asset_ids[$key])) {
                $resolved = false;
                return $matches[0];
            }
            if ('ID' === $matches[1]) {
                return (string) (int) $asset_ids[$key];
            }
            $url = wp_get_attachment_url((int) $asset_ids[$key]);
            if (!is_string($url) || '' === $url) {
                $resolved = false;
                return $matches[0];
            }
            return esc_url_raw($url);
        }, $content);
        if (str_contains((string) $content, '%%FARMTREE_')) {
            $resolved = false;
        }
        $state['post_content'] = (string) $content;
        return $state;
    }

    /**
     * Canonicalize the exact unsanitized write state once, then restore stable
     * content tokens before comparing it with the persisted managed state.
     *
     * @param array<string,mixed> $write_state
     * @param array<string,int> $asset_ids
     * @return array<string,mixed>
     */
    private function expected_entity_after_write(array $write_state, array $asset_ids, int $post_id): array
    {
        $state = $write_state;
        $state['post_title'] = $this->post_db_value('post_title', (string) $state['post_title'], $post_id);
        $state['post_name'] = sanitize_title($this->post_db_value('post_name', (string) $state['post_name'], $post_id));
        $state['post_excerpt'] = $this->post_db_value('post_excerpt', (string) $state['post_excerpt'], $post_id);
        $content = $this->post_db_value('post_content', (string) $state['post_content'], $post_id);
        $state['post_content'] = $this->normalize_content_to_tokens($content, array_flip($asset_ids));
        return $state;
    }

    /** @param array<int,string> $asset_id_keys */
    private function normalize_content_to_tokens(string $content, array $asset_id_keys): string
    {
        foreach ($this->items('assets') as $asset) {
            $key = (string) $asset['key'];
            $id = (int) array_search($key, $asset_id_keys, true);
            if ($id > 0) {
                $url = wp_get_attachment_url($id);
                if (is_string($url) && '' !== $url) {
                    $content = str_replace(esc_url_raw($url), '%%FARMTREE_MEDIA_URL:' . $key . '%%', $content);
                }
                $content = str_replace('"id":' . $id, '"id":%%FARMTREE_MEDIA_ID:' . $key . '%%', $content);
                $content = str_replace('wp-image-' . $id, 'wp-image-%%FARMTREE_MEDIA_ID:' . $key . '%%', $content);
            }
        }
        foreach ($this->items('entities') as $entity) {
            $source = (string) ($entity['fields']['post_content'] ?? '');
            if (!preg_match_all('/%%FARMTREE_THEME_URI:([^%]+)%%/', $source, $matches)) {
                continue;
            }
            foreach (array_unique($matches[1]) as $relative) {
                $relative = ltrim((string) $relative, '/\\');
                $encoded = implode('/', array_map('rawurlencode', explode('/', $relative)));
                $content = str_replace(
                    trailingslashit($this->theme_uri) . $encoded,
                    '%%FARMTREE_THEME_URI:' . $relative . '%%',
                    $content
                );
            }
        }
        return $content;
    }

    /** @param array<int,string> $child_keys */
    private function inject_child_markers(string $content, array $child_keys, bool &$resolved): string
    {
        $existing = $this->content_child_keys($content);
        if ($existing) {
            if ($existing !== $child_keys || count($existing) !== count(array_unique($existing, SORT_STRING))) {
                $resolved = false;
            }
            return $content;
        }
        if (!$child_keys) {
            return $content;
        }

        $needle = '<article class="wp-block-group ft-team-card">';
        if (count($child_keys) !== substr_count($content, $needle)) {
            $resolved = false;
            return $content;
        }
        foreach ($child_keys as $child_key) {
            $position = strpos($content, $needle);
            if (false === $position) {
                $resolved = false;
                return $content;
            }
            $replacement = '<article data-farmtree-managed-key="' . esc_attr((string) $child_key) . '" class="wp-block-group ft-team-card">';
            $content = substr_replace($content, $replacement, $position, strlen($needle));
        }
        return $content;
    }

    /** @return array<int,string> */
    private function content_child_keys(string $content): array
    {
        $keys = [];
        foreach ($this->content_managed_marker_values($content) as $value) {
            if (str_starts_with($value, 'team_member.')) {
                $keys[] = $value;
            }
        }
        return $keys;
    }

    /** @return array<int,string> */
    private function content_managed_marker_values(string $content): array
    {
        if (!preg_match_all(
            '/\bdata-farmtree-managed-key\s*=\s*(?:"([^"]*)"|\'([^\']*)\'|([^\s>]+))/i',
            $content,
            $matches,
            PREG_SET_ORDER
        )) {
            return [];
        }
        $values = [];
        foreach ($matches as $match) {
            $value = '' !== (string) ($match[1] ?? '')
                ? (string) $match[1]
                : ('' !== (string) ($match[2] ?? '') ? (string) $match[2] : (string) ($match[3] ?? ''));
            $values[] = html_entity_decode($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        }
        return $values;
    }

    /** @return array<string,mixed>|null */
    private function item_by_key(string $collection, string $key): ?array
    {
        foreach ($this->items($collection) as $item) {
            if ($key === (string) ($item['key'] ?? '')) {
                return $item;
            }
        }
        return null;
    }

    /** @return array<int,array{kind:string,type:string,id:int}>|WP_Error */
    private function managed_key_locations(string $key)
    {
        global $wpdb;
        $post_rows = $wpdb->get_results($wpdb->prepare(
            "SELECT DISTINCT p.ID AS id, p.post_type AS type
             FROM {$wpdb->posts} p
             INNER JOIN {$wpdb->postmeta} pm ON pm.post_id = p.ID
             WHERE pm.meta_key = %s AND pm.meta_value = %s",
            self::META_KEY,
            $key
        ), ARRAY_A);
        if ('' !== (string) $wpdb->last_error || !is_array($post_rows)) {
            return new WP_Error('post_managed_key_query_failed', 'Managed post-key lookup failed.');
        }
        $term_rows = $wpdb->get_results($wpdb->prepare(
            "SELECT DISTINCT t.term_id AS id, tt.taxonomy AS type
             FROM {$wpdb->terms} t
             INNER JOIN {$wpdb->term_taxonomy} tt ON tt.term_id = t.term_id
             INNER JOIN {$wpdb->termmeta} tm ON tm.term_id = t.term_id
             WHERE tm.meta_key = %s AND tm.meta_value = %s",
            self::META_KEY,
            $key
        ), ARRAY_A);
        if ('' !== (string) $wpdb->last_error || !is_array($term_rows)) {
            return new WP_Error('term_managed_key_query_failed', 'Managed term-key lookup failed.');
        }
        $locations = [];
        foreach ($post_rows as $row) {
            $locations[] = ['kind' => 'post', 'type' => (string) $row['type'], 'id' => (int) $row['id']];
        }
        foreach ($term_rows as $row) {
            $locations[] = ['kind' => 'term', 'type' => (string) $row['type'], 'id' => (int) $row['id']];
        }
        usort($locations, static function ($left, $right): int {
            return [$left['kind'], $left['type'], $left['id']] <=> [$right['kind'], $right['type'], $right['id']];
        });
        return $locations;
    }

    /** @return array<int,int>|WP_Error */
    private function embedded_marker_locations(string $key)
    {
        global $wpdb;
        $rows = $wpdb->get_results($wpdb->prepare(
            "SELECT ID, post_content FROM {$wpdb->posts}
             WHERE post_type != %s AND post_content LIKE %s
             ORDER BY ID ASC",
            'revision',
            '%' . $wpdb->esc_like('data-farmtree-managed-key') . '%'
        ), ARRAY_A);
        if ('' !== (string) $wpdb->last_error || !is_array($rows)) {
            return new WP_Error('embedded_marker_query_failed', 'Embedded marker lookup failed.');
        }
        $ids = [];
        foreach ($rows as $row) {
            if (in_array($key, $this->content_managed_marker_values((string) $row['post_content']), true)) {
                $ids[] = (int) $row['ID'];
            }
        }
        $ids = array_values(array_unique($ids, SORT_NUMERIC));
        sort($ids, SORT_NUMERIC);
        return $ids;
    }

    /** @param array<int,array{kind:string,type:string,id:int}> $locations @return array<int,int> */
    private function location_ids(array $locations, string $kind, string $type): array
    {
        $ids = [];
        foreach ($locations as $location) {
            if ($kind === $location['kind'] && $type === $location['type']) {
                $ids[] = (int) $location['id'];
            }
        }
        $ids = array_values(array_unique($ids, SORT_NUMERIC));
        sort($ids, SORT_NUMERIC);
        return $ids;
    }

    /** @return array<int,array<string,mixed>>|WP_Error */
    private function external_term_consumers(int $term_id, string $term_key)
    {
        $term = get_term($term_id);
        if (!$term || is_wp_error($term)) {
            return new WP_Error('term_consumer_lookup_failed', 'Term consumer lookup failed.');
        }
        global $wpdb;
        $ids = $wpdb->get_col($wpdb->prepare(
            "SELECT DISTINCT object_id FROM {$wpdb->term_relationships}
             WHERE term_taxonomy_id = %d ORDER BY object_id ASC",
            (int) $term->term_taxonomy_id
        ));
        if ('' !== (string) $wpdb->last_error || !is_array($ids)) {
            return new WP_Error('term_consumer_query_failed', 'Term relationship lookup failed.');
        }
        $external = [];
        foreach (array_map('intval', $ids) as $post_id) {
            if (!$this->post_matches_dependency($post_id, 'category', $term_key)) {
                $external[] = ['kind' => 'term_relationship', 'post_id' => $post_id];
            }
        }
        return $external;
    }

    /** @return array<int,array<string,mixed>>|WP_Error */
    private function external_media_consumers(int $attachment_id, string $asset_key)
    {
        $attachment = get_post($attachment_id);
        if (!$attachment || 'attachment' !== $attachment->post_type) {
            return new WP_Error('media_consumer_lookup_failed', 'Attachment consumer lookup failed.');
        }
        global $wpdb;
        $consumer_kinds = [];
        if ((int) $attachment->post_parent > 0) {
            $consumer_kinds[(int) $attachment->post_parent]['attachment_parent'] = true;
        }
        $thumbnail_ids = $wpdb->get_col($wpdb->prepare(
            "SELECT DISTINCT post_id FROM {$wpdb->postmeta}
             WHERE meta_key = %s AND meta_value = %s ORDER BY post_id ASC",
            '_thumbnail_id',
            (string) $attachment_id
        ));
        if ('' !== (string) $wpdb->last_error || !is_array($thumbnail_ids)) {
            return new WP_Error('media_thumbnail_consumer_query_failed', 'Featured-image consumer lookup failed.');
        }
        foreach (array_map('intval', $thumbnail_ids) as $post_id) {
            $consumer_kinds[$post_id]['featured_image'] = true;
        }
        $url = wp_get_attachment_url($attachment_id);
        if (!is_string($url) || '' === $url) {
            return new WP_Error('media_url_consumer_lookup_failed', 'Attachment URL lookup failed.');
        }
        $content_ids = $wpdb->get_col($wpdb->prepare(
            "SELECT DISTINCT ID FROM {$wpdb->posts}
             WHERE ID != %d AND (
                 post_content LIKE %s OR post_content LIKE %s OR post_content LIKE %s
             ) ORDER BY ID ASC",
            $attachment_id,
            '%' . $wpdb->esc_like($url) . '%',
            '%' . $wpdb->esc_like('wp-image-' . $attachment_id) . '%',
            '%' . $wpdb->esc_like('"id":' . $attachment_id) . '%'
        ));
        if ('' !== (string) $wpdb->last_error || !is_array($content_ids)) {
            return new WP_Error('media_content_consumer_query_failed', 'Content consumer lookup failed.');
        }
        foreach (array_map('intval', $content_ids) as $post_id) {
            $consumer_kinds[$post_id]['content_reference'] = true;
        }

        $external = [];
        ksort($consumer_kinds, SORT_NUMERIC);
        foreach ($consumer_kinds as $post_id => $kinds) {
            if (!$this->post_matches_dependency((int) $post_id, 'media', $asset_key)) {
                $external[] = [
                    'kind' => implode(',', array_keys($kinds)),
                    'post_id' => (int) $post_id,
                ];
            }
        }
        return $external;
    }

    private function post_matches_dependency(int $post_id, string $dependency_kind, string $dependency_key): bool
    {
        $post = get_post($post_id);
        if (!$post) {
            return false;
        }
        $managed_keys = $this->post_managed_keys($post_id);
        if (!$managed_keys && $this->post_managed_metadata_names($post_id)) {
            return false;
        }
        foreach ($this->items('entities') as $entity) {
            $uses_dependency = false;
            if ('category' === $dependency_kind) {
                $uses_dependency = in_array($dependency_key, (array) ($entity['category_keys'] ?? []), true);
            } elseif ('media' === $dependency_kind) {
                $uses_dependency = $dependency_key === (string) ($entity['featured_asset_key'] ?? '')
                    || str_contains((string) ($entity['fields']['post_content'] ?? ''), ':' . $dependency_key . '%%');
            }
            if (!$uses_dependency || (string) $entity['post_type'] !== (string) $post->post_type) {
                continue;
            }
            $entity_key = (string) $entity['key'];
            if ($managed_keys) {
                return 1 === count($managed_keys) && hash_equals($entity_key, $managed_keys[0]);
            }
            $slugs = array_values(array_unique(array_filter(array_merge(
                [(string) $entity['slug']],
                (array) ($entity['legacy_slugs'] ?? [])
            ))));
            if (in_array((string) $post->post_name, $slugs, true)) {
                return true;
            }
        }
        return false;
    }

    /** @return array<int,int>|WP_Error */
    private function term_ids_by_key(string $taxonomy, string $key)
    {
        $ids = get_terms([
            'taxonomy' => $taxonomy,
            'hide_empty' => false,
            'fields' => 'ids',
            'meta_query' => [['key' => self::META_KEY, 'value' => $key]],
        ]);
        if (is_wp_error($ids)) {
            return $ids;
        }
        $ids = array_map('intval', $ids);
        sort($ids, SORT_NUMERIC);
        return $ids;
    }

    /** @return array<int,int>|WP_Error */
    private function term_ids_by_slug(string $taxonomy, string $slug)
    {
        $ids = get_terms(['taxonomy' => $taxonomy, 'hide_empty' => false, 'fields' => 'ids', 'slug' => $slug]);
        if (is_wp_error($ids)) {
            return $ids;
        }
        $ids = array_map('intval', $ids);
        sort($ids, SORT_NUMERIC);
        return $ids;
    }

    /** @return array<int,string> */
    private function term_managed_keys(int $id): array
    {
        return $this->unique_managed_keys(get_term_meta($id, self::META_KEY, false));
    }

    /** @return array<int,string> */
    private function post_managed_keys(int $id): array
    {
        return $this->unique_managed_keys(get_post_meta($id, self::META_KEY, false));
    }

    /** @return array<int,string> */
    private function term_managed_metadata_names(int $id): array
    {
        return $this->managed_metadata_names(get_term_meta($id));
    }

    /** @return array<int,string> */
    private function post_managed_metadata_names(int $id): array
    {
        return $this->managed_metadata_names(get_post_meta($id));
    }

    /** @param mixed $metadata @return array<int,string> */
    private function managed_metadata_names($metadata): array
    {
        $names = [];
        foreach (array_keys((array) $metadata) as $name) {
            $name = (string) $name;
            if (str_starts_with($name, '_farmtree_content_')) {
                $names[] = $name;
            }
        }
        $names = array_values(array_unique($names, SORT_STRING));
        sort($names, SORT_STRING);
        return $names;
    }

    private function assert_term_ownership(int $id, string $key, string $reason): void
    {
        $managed_keys = $this->term_managed_keys($id);
        if ('adopt_exact' === $reason) {
            if ($managed_keys || $this->term_managed_metadata_names($id)) {
                throw new RuntimeException('Term ownership changed after planning for ' . $key . '.');
            }
            return;
        }
        if (1 !== count($managed_keys) || !hash_equals($key, $managed_keys[0])) {
            throw new RuntimeException('Term ownership changed after planning for ' . $key . '.');
        }
    }

    private function assert_post_ownership(int $id, string $key, string $reason): void
    {
        $managed_keys = $this->post_managed_keys($id);
        if ('adopt_exact' === $reason) {
            if ($managed_keys || $this->post_managed_metadata_names($id)) {
                throw new RuntimeException('Post ownership changed after planning for ' . $key . '.');
            }
            return;
        }
        if (1 !== count($managed_keys) || !hash_equals($key, $managed_keys[0])) {
            throw new RuntimeException('Post ownership changed after planning for ' . $key . '.');
        }
    }

    /** @param mixed $values @return array<int,string> */
    private function unique_managed_keys($values): array
    {
        $keys = [];
        foreach ((array) $values as $value) {
            if (!is_scalar($value)) {
                $keys[] = '__invalid_non_scalar_managed_key__';
                continue;
            }
            $value = trim((string) $value);
            if ('' !== $value) {
                $keys[] = $value;
            }
        }
        $keys = array_values(array_unique($keys, SORT_STRING));
        sort($keys, SORT_STRING);
        return $keys;
    }

    /** @return array<int,int>|WP_Error */
    private function post_ids_by_key(string $type, string $key)
    {
        global $wpdb;
        $ids = $wpdb->get_col($wpdb->prepare(
            "SELECT DISTINCT p.ID
             FROM {$wpdb->posts} p
             INNER JOIN {$wpdb->postmeta} pm ON pm.post_id = p.ID
             WHERE p.post_type = %s AND pm.meta_key = %s AND pm.meta_value = %s
             ORDER BY p.ID ASC",
            $type,
            self::META_KEY,
            $key
        ));
        if ('' !== (string) $wpdb->last_error || !is_array($ids)) {
            return new WP_Error('post_managed_key_query_failed', 'Managed post-key lookup failed.');
        }
        return array_map('intval', $ids);
    }

    /** @param array<int,string> $slugs @param array<int,string> $statuses @return array<int,int>|WP_Error */
    private function post_ids_by_slugs(string $type, array $slugs, array $statuses = [])
    {
        global $wpdb;
        $slugs = array_values(array_unique(array_filter(array_map('strval', $slugs))));
        if (!$slugs) {
            return [];
        }
        $args = array_merge([$type], $slugs);
        $sql = "SELECT ID FROM {$wpdb->posts} WHERE post_type = %s AND post_name IN ("
            . implode(',', array_fill(0, count($slugs), '%s')) . ')';
        if ($statuses) {
            $sql .= ' AND post_status IN (' . implode(',', array_fill(0, count($statuses), '%s')) . ')';
            $args = array_merge($args, $statuses);
        }
        $sql .= ' ORDER BY ID ASC';
        $ids = $wpdb->get_col($wpdb->prepare($sql, $args));
        if ('' !== (string) $wpdb->last_error || !is_array($ids)) {
            return new WP_Error('post_slug_query_failed', 'Post slug lookup failed.');
        }
        return array_map('intval', $ids);
    }

    /** @param array<string,mixed> $term @param array<string,mixed> $operation @return array<string,mixed> */
    private function apply_term(array $term, array $operation, string $commit): array
    {
        $key = (string) $term['key'];
        $desired = $this->desired_term($term);
        $this->assert_operation($operation, [
            'create' => ['missing'],
            'update' => ['adopt_exact', 'owned_update'],
            'unchanged' => ['exact'],
        ], $key);
        if ('unchanged' === $operation['action']) {
            $this->assert_term_ownership((int) $operation['id'], $key, (string) $operation['reason']);
            $this->assert_current($operation, $this->current_term((int) $operation['id'], (string) $term['taxonomy']), $key);
            $this->assert_term_slug_available($desired, (int) $operation['id'], $key);
            return $this->result('term', $key, 'unchanged', (int) $operation['id']);
        }
        if ('create' === $operation['action']) {
            $fresh = $this->plan_term($term);
            if ('create' !== $fresh['action']) {
                throw new RuntimeException('Term identity changed after planning for ' . $key . '.');
            }
            $this->assert_term_slug_available($desired, 0, $key);
            $created = wp_insert_term((string) $term['name'], (string) $term['taxonomy'], [
                'slug' => (string) $term['slug'],
                'description' => (string) $term['description'],
                'parent' => 0,
            ]);
            if (is_wp_error($created)) {
                throw new RuntimeException('Term create failed for ' . $key . ': ' . $created->get_error_message());
            }
            $id = (int) $created['term_id'];
            $this->remember_touched_term_id($id);
            $status = 'created';
        } else {
            $id = (int) $operation['id'];
            $this->assert_term_ownership($id, $key, (string) $operation['reason']);
            $this->assert_current($operation, $this->current_term($id, (string) $term['taxonomy']), $key);
            $this->assert_term_slug_available($desired, $id, $key);
            $external_consumers = $this->external_term_consumers($id, $key);
            if (is_wp_error($external_consumers) || $external_consumers) {
                throw new RuntimeException('Term consumers changed after planning for ' . $key . '.');
            }
            if ('owned_update' === $operation['reason']) {
                $updated = wp_update_term($id, (string) $term['taxonomy'], [
                    'name' => (string) $term['name'],
                    'slug' => (string) $term['slug'],
                    'description' => (string) $term['description'],
                    'parent' => 0,
                ]);
                if (is_wp_error($updated)) {
                    throw new RuntimeException('Term update failed for ' . $key . ': ' . $updated->get_error_message());
                }
                $status = 'updated';
            } else {
                $status = 'adopted';
            }
        }
        $state = $this->current_term($id, (string) $term['taxonomy']);
        $this->assert_desired($desired, $state, $key);
        $this->write_term_meta($id, $key, $this->hash($term), $this->hash($state), $commit);
        return $this->result('term', $key, $status, $id);
    }

    /** @param array<string,mixed> $asset @param array<string,mixed> $operation @return array<string,mixed> */
    private function apply_asset(array $asset, array $operation, string $commit): array
    {
        $key = (string) $asset['key'];
        $desired = $this->desired_asset($asset);
        $this->assert_operation($operation, [
            'create' => ['missing'],
            'update' => ['adopt_exact', 'owned_metadata_update'],
            'unchanged' => ['exact'],
        ], $key);
        if ('unchanged' === $operation['action']) {
            $this->assert_post_ownership((int) $operation['id'], $key, (string) $operation['reason']);
            $current = $this->current_asset((int) $operation['id']);
            if (is_wp_error($current)) {
                throw new RuntimeException('Attachment state changed for ' . $key . '.');
            }
            $this->assert_current($operation, $current, $key);
            $this->assert_post_slug_available((string) $desired['slug'], (int) $operation['id'], 'inherit', 'attachment', 0, $key);
            return $this->result('media', $key, 'unchanged', (int) $operation['id']);
        }
        if ('create' === $operation['action']) {
            $fresh = $this->plan_asset($asset);
            if ('create' !== $fresh['action']) {
                throw new RuntimeException('Media identity changed after planning for ' . $key . '.');
            }
            $this->assert_post_slug_available((string) $desired['slug'], 0, 'inherit', 'attachment', 0, $key);
            $bytes = file_get_contents($this->asset_paths[$key]);
            if (false === $bytes) {
                throw new RuntimeException('Could not read staged asset for ' . $key . '.');
            }
            if (!hash_equals(strtolower((string) $asset['sha256']), hash('sha256', $bytes))) {
                throw new RuntimeException('Staged asset changed after planning for ' . $key . '.');
            }
            if (class_exists('finfo')) {
                $finfo = new finfo(FILEINFO_MIME_TYPE);
                if ($this->mime((string) $asset['mime_type']) !== $this->mime((string) $finfo->buffer($bytes))) {
                    throw new RuntimeException('Staged asset MIME changed after planning for ' . $key . '.');
                }
            }
            $upload = wp_upload_bits(basename($this->asset_paths[$key]), null, $bytes);
            if (!empty($upload['error'])) {
                throw new RuntimeException('Media upload failed for ' . $key . ': ' . $upload['error']);
            }
            $this->created_files[] = (string) $upload['file'];
            $id = wp_insert_attachment(wp_slash([
                'post_title' => (string) $asset['title'],
                'post_name' => (string) $asset['slug'],
                'post_status' => 'inherit',
                'post_mime_type' => (string) $asset['mime_type'],
            ]), $upload['file'], 0, true);
            if (is_wp_error($id)) {
                throw new RuntimeException('Attachment create failed for ' . $key . ': ' . $id->get_error_message());
            }
            $id = (int) $id;
            $this->remember_touched_post_id($id);
            require_once ABSPATH . 'wp-admin/includes/image.php';
            $directory_snapshot = $this->directory_file_snapshot(dirname((string) $upload['file']));
            try {
                $metadata = wp_generate_attachment_metadata($id, $upload['file']);
            } finally {
                // Capture core-generated variants even if a metadata hook throws.
                $this->remember_new_media_variants((string) $upload['file'], $directory_snapshot);
            }
            if (!is_array($metadata) || empty($metadata['file'])) {
                throw new RuntimeException('Attachment metadata generation failed for ' . $key . '.');
            }
            $this->remember_created_media_files((string) $upload['file'], $metadata);
            wp_update_attachment_metadata($id, $metadata);
            $stored_metadata = get_post_meta($id, '_wp_attachment_metadata', true);
            if (!is_array($stored_metadata) || !hash_equals($this->hash($metadata), $this->hash($stored_metadata))) {
                throw new RuntimeException('Attachment metadata persistence could not be verified for ' . $key . '.');
            }
            update_post_meta($id, '_wp_attachment_image_alt', (string) $asset['alt']);
            $status = 'created';
        } else {
            $id = (int) $operation['id'];
            $this->assert_post_ownership($id, $key, (string) $operation['reason']);
            $current = $this->current_asset($id);
            if (is_wp_error($current)) {
                throw new RuntimeException('Attachment state changed for ' . $key . '.');
            }
            $this->assert_current($operation, $current, $key);
            $this->assert_post_slug_available((string) $desired['slug'], $id, 'inherit', 'attachment', 0, $key);
            $external_consumers = $this->external_media_consumers($id, $key);
            if (is_wp_error($external_consumers) || $external_consumers) {
                throw new RuntimeException('Media consumers changed after planning for ' . $key . '.');
            }
            if ('owned_metadata_update' === $operation['reason']) {
                if (!hash_equals(strtolower((string) $asset['sha256']), strtolower((string) $current['sha256']))) {
                    throw new RuntimeException('Refusing to replace changed media binary for ' . $key . '.');
                }
                $updated = wp_update_post(wp_slash([
                    'ID' => $id,
                    'post_title' => (string) $asset['title'],
                    'post_name' => (string) $asset['slug'],
                ]), true);
                if (is_wp_error($updated)) {
                    throw new RuntimeException('Attachment metadata update failed for ' . $key . ': ' . $updated->get_error_message());
                }
                update_post_meta($id, '_wp_attachment_image_alt', (string) $asset['alt']);
                $status = 'updated';
            } else {
                $status = 'adopted';
            }
        }
        $state = $this->current_asset($id);
        if (is_wp_error($state)) {
            throw new RuntimeException('Could not verify applied media for ' . $key . '.');
        }
        $this->assert_desired($desired, $state, $key);
        $this->write_post_meta($id, $key, $this->hash($asset), $this->hash($state), $commit);
        $asset_sha = strtolower((string) $asset['sha256']);
        update_post_meta($id, self::META_ASSET_SHA, $asset_sha);
        if (!hash_equals($asset_sha, strtolower((string) get_post_meta($id, self::META_ASSET_SHA, true)))) {
            throw new RuntimeException('Could not verify the managed asset SHA metadata for ' . $key . '.');
        }
        return $this->result('media', $key, $status, $id);
    }

    /**
     * @param array<string,mixed> $entity
     * @param array<string,mixed> $operation
     * @param array<string,int> $asset_ids
     * @param array<string,int> $term_ids
     * @return array<string,mixed>
     */
    private function apply_entity(array $entity, array $operation, array $asset_ids, array $term_ids, string $commit): array
    {
        $key = (string) $entity['key'];
        $resolved = true;
        $desired = $this->desired_entity(
            $entity,
            $asset_ids,
            $resolved,
            (int) ($operation['id'] ?? 0)
        );
        if (!$resolved) {
            throw new RuntimeException('Media tokens remain unresolved for ' . $key . '.');
        }
        $this->assert_operation($operation, [
            'create' => ['missing'],
            'update' => ['adopt_exact', 'owned_update'],
            'unchanged' => ['exact'],
        ], $key);
        if ('unchanged' === $operation['action']) {
            $this->assert_post_ownership((int) $operation['id'], $key, (string) $operation['reason']);
            $this->assert_current(
                $operation,
                $this->current_entity((int) $operation['id'], $entity, array_flip($asset_ids), array_flip($term_ids)),
                $key
            );
            $this->assert_post_slug_available(
                (string) $desired['post_name'],
                (int) $operation['id'],
                (string) $desired['post_status'],
                (string) $desired['post_type'],
                (int) $desired['post_parent'],
                $key
            );
            return $this->result('post', $key, 'unchanged', (int) $operation['id']);
        }
        $write_resolved = true;
        $write_desired = $this->write_entity_state($entity, $asset_ids, $write_resolved);
        if (!$write_resolved) {
            throw new RuntimeException('Media tokens could not be resolved for the DB write for ' . $key . '.');
        }
        $postarr = [
            'post_type' => (string) $entity['post_type'],
            'post_title' => (string) $write_desired['post_title'],
            'post_name' => (string) $write_desired['post_name'],
            'post_status' => (string) $write_desired['post_status'],
            'post_parent' => (int) $write_desired['post_parent'],
            'post_excerpt' => (string) $write_desired['post_excerpt'],
            'post_content' => (string) $write_desired['post_content'],
            'menu_order' => (int) $write_desired['menu_order'],
        ];
        if (isset($write_desired['post_date'])) {
            $postarr['post_date'] = (string) $write_desired['post_date'];
        }
        $revision_id = 0;
        $revision_status = 'not_applicable';
        if ('create' === $operation['action']) {
            $fresh = $this->plan_entity($entity, $asset_ids, array_flip($asset_ids), array_flip($term_ids));
            if ('create' !== $fresh['action']) {
                throw new RuntimeException('Post identity changed after planning for ' . $key . '.');
            }
            $this->assert_post_slug_available(
                (string) $desired['post_name'],
                0,
                (string) $desired['post_status'],
                (string) $desired['post_type'],
                (int) $desired['post_parent'],
                $key
            );
            $id = wp_insert_post(wp_slash($postarr), true);
            if (is_wp_error($id)) {
                throw new RuntimeException('Post create failed for ' . $key . ': ' . $id->get_error_message());
            }
            $id = (int) $id;
            $this->remember_touched_post_id($id);
            $status = 'created';
        } else {
            $id = (int) $operation['id'];
            $this->assert_post_ownership($id, $key, (string) $operation['reason']);
            $this->assert_current($operation, $this->current_entity($id, $entity, array_flip($asset_ids), array_flip($term_ids)), $key);
            $this->assert_post_slug_available(
                (string) $desired['post_name'],
                $id,
                (string) $desired['post_status'],
                (string) $desired['post_type'],
                (int) $desired['post_parent'],
                $key
            );
            if ('owned_update' === $operation['reason']) {
                $revision_capture = $this->capture_pre_update_revision($id, $key);
                $revision_id = (int) $revision_capture['id'];
                $revision_status = (string) $revision_capture['status'];
                $postarr['ID'] = $id;
                $updated = wp_update_post(wp_slash($postarr), true);
                if (is_wp_error($updated)) {
                    throw new RuntimeException('Post update failed for ' . $key . ': ' . $updated->get_error_message());
                }
                $status = 'updated';
            } else {
                $status = 'adopted';
            }
        }
        if ('adopted' !== $status) {
            $this->apply_relationships($id, $entity, $asset_ids, $term_ids);
        }
        $state = $this->current_entity($id, $entity, array_flip($asset_ids), array_flip($term_ids));
        $expected = 'adopted' === $status
            ? $desired
            : $this->expected_entity_after_write($write_desired, $asset_ids, $id);
        $this->assert_desired($expected, $state, $key);
        $this->write_post_meta($id, $key, $this->hash($entity), $this->hash($state), $commit);
        $result = $this->result('post', $key, $status, $id);
        if ($revision_id) {
            $result['revision_id'] = $revision_id;
        }
        if ('not_applicable' !== $revision_status) {
            $result['revision_status'] = $revision_status;
        }
        return $result;
    }

    /** @param array<string,mixed> $entity @param array<string,int> $asset_ids @param array<string,int> $term_ids */
    private function apply_relationships(int $id, array $entity, array $asset_ids, array $term_ids): void
    {
        $asset_key = (string) ($entity['featured_asset_key'] ?? '');
        if ('' !== $asset_key) {
            if (empty($asset_ids[$asset_key])) {
                throw new RuntimeException('Featured media ID missing for ' . $entity['key'] . '.');
            }
            $thumbnail_id = (int) $asset_ids[$asset_key];
            if ($thumbnail_id !== (int) get_post_thumbnail_id($id) && !set_post_thumbnail($id, $thumbnail_id)) {
                throw new RuntimeException('Could not set featured image for ' . $entity['key'] . '.');
            }
        } elseif (get_post_thumbnail_id($id)) {
            // This removes only the relationship; it never deletes media.
            delete_post_thumbnail($id);
        }
        if ('post' === (string) $entity['post_type']) {
            $category_ids = [];
            foreach ((array) ($entity['category_keys'] ?? []) as $term_key) {
                if (empty($term_ids[$term_key])) {
                    throw new RuntimeException('Category ID missing for ' . $entity['key'] . '.');
                }
                $category_ids[] = (int) $term_ids[$term_key];
            }
            $result = wp_set_post_categories($id, $category_ids, false);
            if (is_wp_error($result)) {
                throw new RuntimeException('Could not set categories for ' . $entity['key'] . ': ' . $result->get_error_message());
            }
        }
    }

    /** @param array<string,mixed> $operation @param array<string,int> $entity_ids @return array<string,mixed> */
    private function apply_front_page(array $operation, array $entity_ids): array
    {
        $this->assert_operation($operation, [
            'skipped' => ['set_front_page_not_requested'],
            'unchanged' => ['exact'],
            'update' => ['explicit_set_front_page'],
        ], 'front-page');
        if ('skipped' === $operation['action']) {
            return $this->result('option', 'front-page', 'skipped');
        }
        if ('unchanged' === $operation['action']) {
            $id = (int) ($entity_ids['page.en.home'] ?? 0);
            $current = ['show_on_front' => (string) get_option('show_on_front'), 'page_on_front' => (int) get_option('page_on_front')];
            if (!$id || $current !== $operation['before'] || 'page' !== $current['show_on_front'] || $id !== $current['page_on_front']) {
                throw new RuntimeException('Front-page options changed after planning.');
            }
            return $this->result('option', 'front-page', 'unchanged', $id);
        }
        $before = ['show_on_front' => (string) get_option('show_on_front'), 'page_on_front' => (int) get_option('page_on_front')];
        if ($before !== $operation['before']) {
            throw new RuntimeException('Front-page options changed after planning.');
        }
        $id = (int) ($entity_ids['page.en.home'] ?? 0);
        if (!$id) {
            throw new RuntimeException('The managed homepage ID is unavailable.');
        }
        update_option('show_on_front', 'page');
        if ('page' !== (string) get_option('show_on_front')) {
            throw new RuntimeException('Could not update show_on_front.');
        }
        // WordPress admin attaches update_home_siteurl() here and globally
        // flushes every rewrite rule before this reconciler can persist its
        // disclosed FarmTree-only merge. Suppress only that core callback for
        // this managed option write, then restore it at the same priority.
        // finalize_rewrite_rules() immediately performs the exact audited
        // soft rewrite update without touching .htaccess or unrelated rules.
        $core_flush_priority = has_action('update_option_page_on_front', 'update_home_siteurl');
        if (false !== $core_flush_priority) {
            remove_action('update_option_page_on_front', 'update_home_siteurl', (int) $core_flush_priority);
        }
        try {
            update_option('page_on_front', $id);
        } finally {
            if (false !== $core_flush_priority) {
                add_action('update_option_page_on_front', 'update_home_siteurl', (int) $core_flush_priority, 2);
            }
        }
        if ($id !== (int) get_option('page_on_front')) {
            throw new RuntimeException('Could not update page_on_front.');
        }
        $after = ['show_on_front' => (string) get_option('show_on_front'), 'page_on_front' => (int) get_option('page_on_front')];
        if ('page' !== $after['show_on_front'] || $id !== $after['page_on_front']) {
            throw new RuntimeException('Front-page option postconditions could not be verified.');
        }
        return $this->result('option', 'front-page', 'updated', $id);
    }

    /**
     * Plan the exact FarmTree-only merge required by the two public CPTs.
     *
     * Global generation is used only to derive the 34 reviewed FarmTree rule
     * identities and their placement anchors. The persisted target starts from
     * the raw stored rules and never adopts unrelated runtime-generated state.
     *
     * @return array<string,mixed>
     */
    private function plan_rewrite_rules(): array
    {
        if (did_action('wp_loaded') < 1) {
            return $this->op('option', 'rewrite-rules', 'conflict', 'wordpress_not_fully_loaded');
        }
        if (!post_type_exists('customer_segment') || !post_type_exists('proof_story')) {
            return $this->op('option', 'rewrite-rules', 'conflict', 'farmtree_post_types_not_registered');
        }

        global $wp_rewrite;
        if (!is_object($wp_rewrite) || !is_callable([$wp_rewrite, 'rewrite_rules'])) {
            return $this->op('option', 'rewrite-rules', 'conflict', 'rewrite_generator_unavailable');
        }
        if (!$wp_rewrite->using_permalinks()) {
            return $this->op('option', 'rewrite-rules', 'conflict', 'pretty_permalinks_unavailable');
        }
        if ('' !== (string) $wp_rewrite->root) {
            return $this->op('option', 'rewrite-rules', 'conflict', 'unsupported_rewrite_root', [
                'root_sha256' => hash('sha256', (string) $wp_rewrite->root),
            ]);
        }
        $base_rules = $this->generate_rewrite_rules_read_only(['customer_segment', 'proof_story']);
        $generated_rules = $this->generate_rewrite_rules_read_only([]);
        if (!is_array($base_rules) || !$base_rules || !is_array($generated_rules) || !$generated_rules) {
            return $this->op('option', 'rewrite-rules', 'conflict', 'generated_rewrite_rules_invalid');
        }

        $required = ['customer_segment' => [], 'proof_story' => []];
        foreach ($this->rewrite_rule_changes($base_rules, $generated_rules) as $regex => $change) {
            $desired_query = (string) ($change['desired'] ?? '');
            if ('global_rule_order' === (string) ($change['scope'] ?? '')
                || !empty($change['before_exists'])
                || empty($change['desired_exists'])) {
                return $this->op('option', 'rewrite-rules', 'conflict', 'generated_farmtree_rule_delta_invalid', [
                    'rule' => (string) $regex,
                    'change' => $change,
                ]);
            }
            if (str_starts_with((string) $regex, 'customer-segments/')) {
                $required['customer_segment'][(string) $regex] = $desired_query;
                continue;
            }
            if (str_starts_with((string) $regex, 'proof-stories/')) {
                $required['proof_story'][(string) $regex] = $desired_query;
                continue;
            }
            return $this->op('option', 'rewrite-rules', 'conflict', 'generated_farmtree_rule_delta_invalid', [
                'rule' => (string) $regex,
                'change' => $change,
            ]);
        }
        $canonical = [
            'customer_segment' => [
                'customer-segments/([^/]+)(?:/([0-9]+))?/?$'
                    => 'index.php?customer_segment=$matches[1]&page=$matches[2]',
            ],
            'proof_story' => [
                'proof-stories/([^/]+)(?:/([0-9]+))?/?$'
                    => 'index.php?proof_story=$matches[1]&page=$matches[2]',
            ],
        ];
        foreach ($canonical as $post_type => $rules) {
            foreach ($rules as $regex => $query) {
                if (($required[$post_type][$regex] ?? null) !== $query) {
                    return $this->op('option', 'rewrite-rules', 'conflict', 'generated_canonical_farmtree_rules_ambiguous', [
                        'post_type' => $post_type,
                        'expected_regex' => $regex,
                        'expected_query_sha256' => hash('sha256', $query),
                    ]);
                }
                $slug = 'customer_segment' === $post_type ? 'customer-segments' : 'proof-stories';
                $first = $this->first_matching_rewrite_rule($generated_rules, $slug . '/farmtree-route-probe/');
                if (empty($first['valid']) || ($first['regex'] ?? null) !== $regex
                    || ($first['query'] ?? null) !== $query) {
                    return $this->op('option', 'rewrite-rules', 'conflict', 'canonical_farmtree_rule_shadowed', [
                        'post_type' => $post_type,
                        'first_matching_regex' => $first['regex'] ?? null,
                        'first_matching_query_sha256' => isset($first['query'])
                            ? hash('sha256', (string) $first['query'])
                            : null,
                    ]);
                }
            }
        }
        if (empty($required['customer_segment']) || empty($required['proof_story'])) {
            return $this->op('option', 'rewrite-rules', 'conflict', 'generated_canonical_farmtree_rules_ambiguous', [
                'required_rule_counts' => [
                    'customer_segment' => count($canonical['customer_segment']),
                    'proof_story' => count($canonical['proof_story']),
                ],
            ]);
        }

        global $wpdb;
        $stored = $wpdb->get_row($wpdb->prepare(
            "SELECT option_id, option_value, autoload FROM {$wpdb->options} WHERE option_name = %s LIMIT 1",
            'rewrite_rules'
        ), ARRAY_A);
        if ('' !== (string) $wpdb->last_error) {
            return $this->op('option', 'rewrite-rules', 'conflict', 'stored_rewrite_rules_unreadable');
        }
        $option_exists = is_array($stored);
        $current = $option_exists ? maybe_unserialize((string) $stored['option_value']) : null;
        if (!in_array($current, [null, false, ''], true) && !is_array($current)) {
            return $this->op('option', 'rewrite-rules', 'conflict', 'stored_rewrite_rules_invalid', [
                'before_type' => gettype($current),
            ]);
        }
        $current_rules = is_array($current) ? $current : [];
        $current_has_rules = (bool) $current_rules;
        $managed_rules = array_merge($required['customer_segment'], $required['proof_story']);
        $state = [
            'option_name' => 'rewrite_rules',
            'option_exists' => $option_exists,
            'option_id' => $option_exists ? (int) $stored['option_id'] : null,
            'autoload' => $option_exists ? (string) $stored['autoload'] : null,
            'rule_count' => count($current_rules),
            'sha256' => $this->rewrite_rules_hash($current_rules),
        ];
        if (!$option_exists || !$current_has_rules) {
            return $this->op('option', 'rewrite-rules', 'conflict', 'farmtree_rewrite_anchor_state_unavailable', [
                'before' => $state,
                'required_farmtree_rule_counts' => array_map('count', $required),
            ]);
        }

        foreach ($current_rules as $regex => $query) {
            $is_namespace = str_contains((string) $regex, 'customer-segments')
                || str_contains((string) $regex, 'proof-stories');
            if ($is_namespace && ($managed_rules[(string) $regex] ?? null) !== (string) $query) {
                return $this->op('option', 'rewrite-rules', 'conflict', 'preexisting_farmtree_namespace_collision', [
                    'before' => $state,
                    'rule' => (string) $regex,
                    'query_sha256' => hash('sha256', (string) $query),
                ]);
            }
        }

        $merge = $this->merge_farmtree_rewrite_rules($current_rules, $generated_rules, $managed_rules);
        if (isset($merge['conflict'])) {
            return $this->op('option', 'rewrite-rules', 'conflict', (string) $merge['conflict'], [
                'before' => $state,
                'anchor_context' => $merge['anchor_context'] ?? [],
            ]);
        }
        $merged_rules = (array) ($merge['rules'] ?? []);
        $current_unrelated = array_diff_key($current_rules, $managed_rules);
        $merged_unrelated = array_diff_key($merged_rules, $managed_rules);
        if ($current_unrelated !== $merged_unrelated) {
            return $this->op('option', 'rewrite-rules', 'conflict', 'unrelated_rewrite_preservation_failed', [
                'before' => $state,
            ]);
        }
        foreach ($canonical as $post_type => $rules) {
            $slug = 'customer_segment' === $post_type ? 'customer-segments' : 'proof-stories';
            foreach ($rules as $regex => $query) {
                $first = $this->first_matching_rewrite_rule($merged_rules, $slug . '/farmtree-route-probe/');
                if (empty($first['valid']) || ($first['regex'] ?? null) !== $regex
                    || ($first['query'] ?? null) !== $query) {
                    return $this->op('option', 'rewrite-rules', 'conflict', 'canonical_farmtree_rule_shadowed', [
                        'before' => $state,
                        'post_type' => $post_type,
                        'first_matching_regex' => $first['regex'] ?? null,
                        'first_matching_query_sha256' => isset($first['query'])
                            ? hash('sha256', (string) $first['query'])
                            : null,
                    ]);
                }
            }
        }

        $runtime_unrelated = array_diff_key($generated_rules, $managed_rules, $current_rules);
        $target = [
            'option_name' => 'rewrite_rules',
            'rule_count' => count($merged_rules),
            'sha256' => $this->rewrite_rules_hash($merged_rules),
            'required_farmtree_rules' => $required,
            'required_canonical_rules' => $canonical,
            'managed_rule_count' => count($managed_rules),
            'preserved_unrelated_rule_count' => count($current_unrelated),
            'runtime_unrelated_rules_not_adopted' => array_map(
                static fn ($query) => hash('sha256', (string) $query),
                $runtime_unrelated
            ),
            'anchors' => $merge['anchors'] ?? [],
            'merged_rules' => $merged_rules,
        ];
        if ($current_rules === $merged_rules) {
            return $this->op('option', 'rewrite-rules', 'unchanged', 'exact', [
                'before' => $state,
                'desired' => $target,
            ]);
        }
        $changes = $this->rewrite_rule_changes($current_rules, $merged_rules);
        if ($this->rewrite_changes_touch_unrelated_rules($changes, $managed_rules)) {
            return $this->op('option', 'rewrite-rules', 'conflict', 'unrelated_rewrite_preservation_failed', [
                'before' => $state,
                'changes' => $changes,
            ]);
        }

        return $this->op('option', 'rewrite-rules', 'update', 'farmtree_rules_missing', [
            'before' => $state,
            'desired' => $target,
            'changes' => $changes,
        ]);
    }

    /**
     * Merge only FarmTree-owned rules into the stored ordered rule map.
     *
     * @param array<string,string> $current_rules
     * @param array<string,string> $generated_rules
     * @param array<string,string> $managed_rules
     * @return array<string,mixed>
     */
    private function merge_farmtree_rewrite_rules(
        array $current_rules,
        array $generated_rules,
        array $managed_rules
    ): array {
        $current_unrelated = array_diff_key($current_rules, $managed_rules);
        $current_keys = array_keys($current_unrelated);
        $generated_keys = array_keys($generated_rules);
        $blocks = [];
        for ($index = 0, $total = count($generated_keys); $index < $total;) {
            $regex = (string) $generated_keys[$index];
            if (!array_key_exists($regex, $managed_rules)) {
                $index++;
                continue;
            }
            $start = $index;
            $rules = [];
            while ($index < $total && array_key_exists((string) $generated_keys[$index], $managed_rules)) {
                $managed_regex = (string) $generated_keys[$index];
                if ((string) $generated_rules[$managed_regex] !== (string) $managed_rules[$managed_regex]) {
                    return ['conflict' => 'generated_farmtree_rule_delta_invalid'];
                }
                $rules[$managed_regex] = (string) $managed_rules[$managed_regex];
                $index++;
            }
            $previous = null;
            for ($candidate = $start - 1; $candidate >= 0; $candidate--) {
                $key = (string) $generated_keys[$candidate];
                if (array_key_exists($key, $current_unrelated)
                    && (string) $current_unrelated[$key] === (string) $generated_rules[$key]) {
                    $previous = $key;
                    break;
                }
            }
            $next = null;
            for ($candidate = $index; $candidate < $total; $candidate++) {
                $key = (string) $generated_keys[$candidate];
                if (array_key_exists($key, $current_unrelated)
                    && (string) $current_unrelated[$key] === (string) $generated_rules[$key]) {
                    $next = $key;
                    break;
                }
            }
            $previous_position = false === $previous ? false : array_search($previous, $current_keys, true);
            $next_position = false === $next ? false : array_search($next, $current_keys, true);
            if (null === $previous || null === $next || false === $previous_position
                || false === $next_position || $previous_position >= $next_position) {
                return [
                    'conflict' => 'farmtree_rewrite_anchors_ambiguous',
                    'anchor_context' => [
                        'previous' => $previous,
                        'next' => $next,
                        'managed_rules' => array_keys($rules),
                    ],
                ];
            }
            $blocks[] = ['previous' => $previous, 'next' => $next, 'rules' => $rules];
        }

        if (!$blocks || count(array_merge(...array_map(
            static fn ($block) => $block['rules'],
            $blocks
        ))) !== count($managed_rules)) {
            return ['conflict' => 'generated_farmtree_rule_delta_invalid'];
        }

        $target = [];
        $anchors = [];
        foreach ($current_unrelated as $regex => $query) {
            $target[(string) $regex] = (string) $query;
            foreach ($blocks as $block) {
                if ((string) $block['previous'] !== (string) $regex) {
                    continue;
                }
                foreach ($block['rules'] as $managed_regex => $managed_query) {
                    $target[(string) $managed_regex] = (string) $managed_query;
                }
                $anchors[] = [
                    'previous' => (string) $block['previous'],
                    'next' => (string) $block['next'],
                    'managed_rule_count' => count($block['rules']),
                ];
            }
        }
        if (count(array_intersect_key($target, $managed_rules)) !== count($managed_rules)) {
            return ['conflict' => 'farmtree_rewrite_anchors_ambiguous'];
        }
        return ['rules' => $target, 'anchors' => $anchors];
    }

    /**
     * Generate the canonical stored form without mutating the live rewrite
     * object. Core soft refreshes use the named `$matches[N]` query form.
     *
     * @param array<int,string> $excluded_permastructs
     * @return array<string,string>
     */
    private function generate_rewrite_rules_read_only(array $excluded_permastructs): array
    {
        global $wp_rewrite;
        $generator = clone $wp_rewrite;
        $generator->matches = 'matches';
        $generator->rules = null;
        $registered_top_rules = $generator->extra_rules_top;
        foreach (array_keys($generator->extra_permastructs) as $name) {
            foreach ($this->generate_permastruct_rules_read_only($generator, (string) $name) as $regex => $query) {
                if (array_key_exists($regex, $registered_top_rules)
                    && (string) $registered_top_rules[$regex] === (string) $query) {
                    unset($registered_top_rules[$regex]);
                }
            }
        }
        $generator->extra_rules_top = $registered_top_rules;
        foreach ($excluded_permastructs as $name) {
            unset($generator->extra_permastructs[$name]);
        }
        $rules = $generator->rewrite_rules();
        return is_array($rules) ? $rules : [];
    }

    /** @param array<string,string> $rules @return array<string,mixed> */
    private function first_matching_rewrite_rule(array $rules, string $path): array
    {
        foreach ($rules as $regex => $query) {
            $pattern = '~^' . str_replace('~', '\\~', (string) $regex) . '~';
            $matches = @preg_match($pattern, $path);
            if (false === $matches) {
                return ['valid' => false, 'regex' => (string) $regex];
            }
            if (1 === $matches) {
                return [
                    'valid' => true,
                    'regex' => (string) $regex,
                    'query' => (string) $query,
                ];
            }
        }
        return ['valid' => true, 'regex' => null, 'query' => null];
    }

    /** @return array<string,string> */
    private function generate_permastruct_rules_read_only(object $generator, string $name): array
    {
        $struct = $generator->extra_permastructs[$name] ?? null;
        if (null === $struct) {
            return [];
        }
        if (!is_array($struct)) {
            $rules = $generator->generate_rewrite_rules($struct);
        } elseif (2 === count($struct)) {
            $rules = $generator->generate_rewrite_rules($struct[0], $struct[1]);
        } else {
            $rules = $generator->generate_rewrite_rules(
                $struct['struct'],
                $struct['ep_mask'],
                $struct['paged'],
                $struct['feed'],
                $struct['forcomments'],
                $struct['walk_dirs'],
                $struct['endpoints']
            );
        }
        $rules = apply_filters($name . '_rewrite_rules', $rules);
        return is_array($rules) ? $rules : [];
    }

    /**
     * Persist the exact reviewed FarmTree-only merge after every APPLY gate.
     *
     * @param array<string,mixed> $operation
     * @return array<string,mixed>
     */
    private function finalize_rewrite_rules(array $operation): array
    {
        $this->assert_operation($operation, [
            'update' => ['farmtree_rules_missing'],
            'unchanged' => ['exact'],
        ], 'rewrite-rules');

        $fresh = $this->plan_rewrite_rules();
        // page_on_front legitimately changes core's runtime-only generated
        // root-comment query diagnostics. That diagnostic is never persisted
        // or adopted by FarmTree, so exclude only it from equality while all
        // raw option identity, target, canonical rules, anchors and preserved
        // unrelated rules remain exact.
        $planned_comparable = $operation;
        $fresh_comparable = $fresh;
        unset(
            $planned_comparable['desired']['runtime_unrelated_rules_not_adopted'],
            $fresh_comparable['desired']['runtime_unrelated_rules_not_adopted']
        );
        foreach (['kind', 'key', 'action', 'reason', 'before', 'desired'] as $field) {
            if (($fresh_comparable[$field] ?? null) !== ($planned_comparable[$field] ?? null)) {
                throw new RuntimeException('Rewrite rules changed after planning.');
            }
        }
        if ('unchanged' === (string) $operation['action']) {
            return $this->result('option', 'rewrite-rules', 'unchanged');
        }

        $target_rules = $operation['desired']['merged_rules'] ?? null;
        if (!is_array($target_rules)
            || count($target_rules) !== (int) ($operation['desired']['rule_count'] ?? -1)
            || $this->rewrite_rules_hash($target_rules) !== (string) ($operation['desired']['sha256'] ?? '')) {
            throw new RuntimeException('The disclosed FarmTree-only rewrite target is invalid.');
        }
        if (!update_option('rewrite_rules', $target_rules)) {
            throw new RuntimeException('Could not persist the disclosed FarmTree-only rewrite target.');
        }
        $after = $this->plan_rewrite_rules();
        if ('unchanged' !== (string) ($after['action'] ?? '')
            || ($after['desired']['sha256'] ?? '') !== ($operation['desired']['sha256'] ?? '')) {
            throw new RuntimeException('FarmTree-only rewrite finalization did not reach the disclosed state.');
        }
        $after_state = $after['before'] ?? [];
        if (empty($after_state['option_exists']) || (int) ($after_state['option_id'] ?? 0) < 1
            || ($after_state['sha256'] ?? '') !== ($operation['desired']['sha256'] ?? '')
            || (int) ($after_state['rule_count'] ?? -1) !== (int) ($operation['desired']['rule_count'] ?? -2)) {
            throw new RuntimeException('FarmTree-only rewrite finalization did not persist the disclosed raw option state.');
        }
        if (!empty($operation['before']['option_exists'])
            && ((int) ($after_state['option_id'] ?? 0) !== (int) ($operation['before']['option_id'] ?? 0)
                || (string) ($after_state['autoload'] ?? '') !== (string) ($operation['before']['autoload'] ?? ''))) {
            throw new RuntimeException('FarmTree-only rewrite finalization did not preserve the option identity/autoload.');
        }
        return $this->result('option', 'rewrite-rules', 'updated');
    }

    /** @param array<string,string> $before @param array<string,string> $desired @return array<string,array<string,mixed>> */
    private function rewrite_rule_changes(array $before, array $desired): array
    {
        $changes = [];
        $keys = array_values(array_unique(array_merge(array_keys($before), array_keys($desired)), SORT_STRING));
        sort($keys, SORT_STRING);
        foreach ($keys as $regex) {
            $before_exists = array_key_exists($regex, $before);
            $desired_exists = array_key_exists($regex, $desired);
            $before_query = $before_exists ? (string) $before[$regex] : '';
            $desired_query = $desired_exists ? (string) $desired[$regex] : '';
            if ($before_exists === $desired_exists && $before_query === $desired_query) {
                continue;
            }
            $changes[(string) $regex] = [
                'before_exists' => $before_exists,
                'before' => $before_query,
                'desired_exists' => $desired_exists,
                'desired' => $desired_query,
            ];
        }
        $shared = array_values(array_intersect(array_keys($before), array_keys($desired)));
        $desired_shared = array_values(array_intersect(array_keys($desired), array_keys($before)));
        if ($shared !== $desired_shared) {
            $changes['__shared_rule_order__'] = [
                'before_exists' => true,
                'before' => hash('sha256', implode("\n", $shared)),
                'desired_exists' => true,
                'desired' => hash('sha256', implode("\n", $desired_shared)),
                'scope' => 'global_rule_order',
            ];
        }
        return $changes;
    }

    /** @param array<string,array<string,mixed>> $changes @param array<string,string> $allowed_additions */
    private function rewrite_changes_touch_unrelated_rules(array $changes, array $allowed_additions): bool
    {
        foreach ($changes as $regex => $change) {
            if ('global_rule_order' === (string) ($change['scope'] ?? '')) {
                continue;
            }
            if (!empty($change['before_exists'])) {
                return true;
            }
            $desired = (string) ($change['desired'] ?? '');
            if (empty($change['desired_exists'])) {
                return true;
            }
            if (($allowed_additions[(string) $regex] ?? null) !== $desired) {
                return true;
            }
        }
        return false;
    }

    /** @param array<string,string> $rules */
    private function rewrite_rules_hash(array $rules): string
    {
        $json = wp_json_encode($rules, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        if (false === $json) {
            throw new RuntimeException('Could not encode rewrite rules.');
        }
        return hash('sha256', $json);
    }

    /**
     * Reject malformed, stale or unexpected operations before the first write.
     *
     * @param array<string,mixed> $plan
     */
    private function assert_plan_shape_and_actions(array $plan): void
    {
        $digest = (string) ($plan['plan_digest'] ?? '');
        $basis = $plan;
        unset($basis['plan_digest']);
        if (!preg_match('/^[0-9a-f]{64}$/', $digest) || !hash_equals($digest, $this->hash($basis))) {
            throw new RuntimeException('The supplied plan is not canonically digested.');
        }
        if ((string) ($plan['manifest_version'] ?? '') !== (string) ($this->manifest['manifest_version'] ?? '')) {
            throw new RuntimeException('The supplied plan manifest version is stale.');
        }
        if ((string) ($plan['site_url'] ?? '') !== trailingslashit(home_url('/')) || (string) ($plan['active_theme'] ?? '') !== get_stylesheet()) {
            throw new RuntimeException('The supplied plan runtime identity is stale.');
        }
        if (!isset($plan['operations']) || !is_array($plan['operations'])
            || array_keys($plan['operations']) !== ['checks', 'terms', 'media', 'posts', 'embedded', 'options']) {
            throw new RuntimeException('The supplied plan operation groups are invalid.');
        }
        foreach ($plan['operations']['checks'] as $check) {
            if ('reserved-locale' !== (string) ($check['kind'] ?? '')) {
                throw new RuntimeException('The supplied plan contains an unexpected safety operation.');
            }
            $this->assert_operation($check, [
                'unchanged' => ['reserved_locale_absent'],
                'skipped' => ['reserved_locale_unpublished_untouched'],
            ], (string) ($check['key'] ?? 'reserved-locale'));
        }
        if (count($plan['operations']['terms']) !== count($this->items('terms'))
            || count($plan['operations']['media']) !== count($this->items('assets'))
            || count($plan['operations']['posts']) !== count($this->items('entities'))
            || count($plan['operations']['embedded']) !== count((array) ($this->manifest['team_member_keys'] ?? []))
            || 2 !== count($plan['operations']['options'])) {
            throw new RuntimeException('The supplied plan operation coverage is incomplete.');
        }

        foreach ($this->items('terms') as $i => $term) {
            $operation = $plan['operations']['terms'][$i];
            if ('term' !== ($operation['kind'] ?? '') || (string) $term['key'] !== ($operation['key'] ?? '')) {
                throw new RuntimeException('The supplied term operation order is invalid.');
            }
            $this->assert_operation($operation, [
                'create' => ['missing'],
                'update' => ['adopt_exact', 'owned_update'],
                'unchanged' => ['exact'],
            ], (string) $term['key']);
            $this->assert_operation_disclosure($operation, (string) $term['key']);
        }
        foreach ($this->items('assets') as $i => $asset) {
            $operation = $plan['operations']['media'][$i];
            if ('media' !== ($operation['kind'] ?? '') || (string) $asset['key'] !== ($operation['key'] ?? '')) {
                throw new RuntimeException('The supplied media operation order is invalid.');
            }
            $this->assert_operation($operation, [
                'create' => ['missing'],
                'update' => ['adopt_exact', 'owned_metadata_update'],
                'unchanged' => ['exact'],
            ], (string) $asset['key']);
            $this->assert_operation_disclosure($operation, (string) $asset['key']);
        }
        foreach ($this->items('entities') as $i => $entity) {
            $operation = $plan['operations']['posts'][$i];
            if ('post' !== ($operation['kind'] ?? '') || (string) $entity['key'] !== ($operation['key'] ?? '')) {
                throw new RuntimeException('The supplied post operation order is invalid.');
            }
            $this->assert_operation($operation, [
                'create' => ['missing'],
                'update' => ['adopt_exact', 'owned_update'],
                'unchanged' => ['exact'],
            ], (string) $entity['key']);
            $this->assert_operation_disclosure($operation, (string) $entity['key']);
        }
        foreach (array_values((array) $this->manifest['team_member_keys']) as $i => $team_key) {
            $operation = $plan['operations']['embedded'][$i];
            if ('team-member' !== ($operation['kind'] ?? '') || (string) $team_key !== ($operation['key'] ?? '')) {
                throw new RuntimeException('The supplied embedded Team operation order is invalid.');
            }
            $this->assert_operation($operation, [
                'create' => ['embedded_parent_create'],
                'update' => ['embedded_parent_update'],
                'unchanged' => [
                    'embedded_parent_exact',
                    'embedded_parent_adopt_exact',
                    'embedded_card_exact_parent_update',
                ],
            ], (string) $team_key);
            $this->assert_operation_disclosure($operation, (string) $team_key);
        }
        $option = $plan['operations']['options'][0];
        if ('option' !== ($option['kind'] ?? '') || 'front-page' !== ($option['key'] ?? '')) {
            throw new RuntimeException('The supplied option operation is invalid.');
        }
        $this->assert_operation($option, [
            'skipped' => ['set_front_page_not_requested'],
            'unchanged' => ['exact'],
            'update' => ['explicit_set_front_page'],
        ], 'front-page');
        $this->assert_operation_disclosure($option, 'front-page');
        if ((bool) ($plan['set_front_page'] ?? false) !== ('skipped' !== $option['action'])) {
            throw new RuntimeException('The supplied front-page intent is inconsistent.');
        }
        $rewrite = $plan['operations']['options'][1];
        if ('option' !== ($rewrite['kind'] ?? '') || 'rewrite-rules' !== ($rewrite['key'] ?? '')) {
            throw new RuntimeException('The supplied rewrite-rule operation is invalid.');
        }
        $this->assert_operation($rewrite, [
            'conflict' => [
                'canonical_farmtree_rule_shadowed',
                'farmtree_rewrite_anchor_state_unavailable',
                'farmtree_rewrite_anchors_ambiguous',
                'farmtree_post_types_not_registered',
                'generated_canonical_farmtree_rules_ambiguous',
                'generated_farmtree_rule_delta_invalid',
                'generated_rewrite_rules_invalid',
                'preexisting_farmtree_namespace_collision',
                'pretty_permalinks_unavailable',
                'rewrite_generator_unavailable',
                'stored_rewrite_rules_invalid',
                'stored_rewrite_rules_unreadable',
                'unrelated_rewrite_preservation_failed',
                'unsupported_rewrite_root',
                'wordpress_not_fully_loaded',
            ],
            'update' => ['farmtree_rules_missing'],
            'unchanged' => ['exact'],
        ], 'rewrite-rules');
        $this->assert_operation_disclosure($rewrite, 'rewrite-rules');
    }

    /**
     * @param array<string,mixed> $operation
     * @param array<string,array<int,string>> $allowed
     */
    private function assert_operation(array $operation, array $allowed, string $key): void
    {
        $action = isset($operation['action']) ? (string) $operation['action'] : '';
        $reason = isset($operation['reason']) ? (string) $operation['reason'] : '';
        if (!isset($allowed[$action]) || !in_array($reason, $allowed[$action], true)) {
            throw new RuntimeException('Unexpected operation action or reason for ' . $key . '.');
        }
    }

    /** @param array<string,mixed> $operation */
    private function assert_operation_disclosure(array $operation, string $key): void
    {
        if ('create' === (string) ($operation['action'] ?? '') && !isset($operation['desired'])) {
            throw new RuntimeException('Create operation lacks exact desired state for ' . $key . '.');
        }
        if ('update' === (string) ($operation['action'] ?? '')
            && (!array_key_exists('before', $operation) || !isset($operation['desired']) || !isset($operation['changes']))) {
            throw new RuntimeException('Update operation lacks exact before/desired state for ' . $key . '.');
        }
        if (in_array((string) ($operation['kind'] ?? ''), ['term', 'media', 'post'], true)
            && in_array((string) ($operation['action'] ?? ''), ['create', 'update'], true)
            && empty($operation['managed_metadata_write'])) {
            throw new RuntimeException('Write operation lacks managed metadata disclosure for ' . $key . '.');
        }
    }

    /** @param array<string,mixed> $operation @param array<string,mixed> $current */
    private function assert_current(array $operation, array $current, string $key): void
    {
        $hash = $this->hash($current);
        if (empty($operation['current_hash']) || !hash_equals((string) $operation['current_hash'], $hash)) {
            throw new RuntimeException('Managed state changed after planning for ' . $key . '.');
        }
    }

    /** @param array<string,mixed> $desired @param array<string,mixed> $current */
    private function assert_desired(array $desired, array $current, string $key): void
    {
        if (hash_equals($this->hash($desired), $this->hash($current))) {
            return;
        }
        $fields = array_values(array_unique(array_merge(array_keys($desired), array_keys($current)), SORT_STRING));
        sort($fields, SORT_STRING);
        foreach ($fields as $field) {
            $desired_exists = array_key_exists($field, $desired);
            $current_exists = array_key_exists($field, $current);
            if ($desired_exists === $current_exists
                && (!$desired_exists || $this->canonical($desired[$field]) === $this->canonical($current[$field]))) {
                continue;
            }
            throw new RuntimeException(
                'Applied state does not match the manifest for ' . $key . ' at ' . $field
                . ' (desired ' . $this->postcondition_value_summary($desired_exists ? $desired[$field] : null)
                . '; persisted ' . $this->postcondition_value_summary($current_exists ? $current[$field] : null) . ').'
            );
        }
        throw new RuntimeException('Applied state does not match the manifest for ' . $key . ' at unknown-field.');
    }

    /** @param mixed $value */
    private function postcondition_value_summary($value): string
    {
        if (is_string($value)) {
            if (strlen($value) > 120) {
                return 'string:length=' . strlen($value) . ',sha256=' . hash('sha256', $value);
            }
            $encoded = wp_json_encode($value, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
            return false === $encoded ? 'string:encoding-error' : $encoded;
        }
        if (is_scalar($value) || null === $value) {
            $encoded = wp_json_encode($value, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
            return false === $encoded ? gettype($value) . ':encoding-error' : $encoded;
        }
        $encoded = wp_json_encode($this->canonical($value), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        return gettype($value) . ':sha256=' . hash('sha256', false === $encoded ? serialize($value) : $encoded);
    }

    private function write_term_meta(int $id, string $key, string $source_hash, string $applied_hash, string $commit): void
    {
        $values = [
            self::META_KEY => $key,
            self::META_MANIFEST => (string) $this->manifest['manifest_version'],
            self::META_SOURCE_HASH => $source_hash,
            self::META_APPLIED_HASH => $applied_hash,
            self::META_RELEASE_COMMIT => $commit,
            self::META_BACKUP_EVIDENCE => $this->backup_evidence_digest,
        ];
        foreach ($values as $meta_key => $value) {
            $result = update_term_meta($id, $meta_key, $value);
            if (is_wp_error($result) || (string) get_term_meta($id, $meta_key, true) !== $value) {
                throw new RuntimeException('Could not persist ownership metadata for term ' . $key . '.');
            }
        }
    }

    private function write_post_meta(int $id, string $key, string $source_hash, string $applied_hash, string $commit): void
    {
        $values = [
            self::META_KEY => $key,
            self::META_MANIFEST => (string) $this->manifest['manifest_version'],
            self::META_SOURCE_HASH => $source_hash,
            self::META_APPLIED_HASH => $applied_hash,
            self::META_RELEASE_COMMIT => $commit,
            self::META_BACKUP_EVIDENCE => $this->backup_evidence_digest,
        ];
        foreach ($values as $meta_key => $value) {
            update_post_meta($id, $meta_key, $value);
            if ((string) get_post_meta($id, $meta_key, true) !== $value) {
                throw new RuntimeException('Could not persist ownership metadata for ' . $key . '.');
            }
        }
        $this->assert_post_metadata($id, $key, $source_hash, $applied_hash, $commit);
    }

    private function assert_post_metadata(
        int $id,
        string $key,
        string $source_hash,
        string $applied_hash,
        string $commit
    ): void {
        $desired = [
            self::META_KEY => [$key],
            self::META_MANIFEST => [(string) $this->manifest['manifest_version']],
            self::META_SOURCE_HASH => [$source_hash],
            self::META_APPLIED_HASH => [$applied_hash],
            self::META_RELEASE_COMMIT => [$commit],
            self::META_BACKUP_EVIDENCE => [$this->backup_evidence_digest],
        ];
        $persisted = [];
        foreach (array_keys($desired) as $meta_key) {
            $persisted[$meta_key] = array_map('strval', (array) get_post_meta($id, $meta_key, false));
        }
        $this->assert_desired($desired, $persisted, $key . '.managed-metadata');
    }

    private function theme_path(string $relative): string
    {
        if ('' === $this->theme_root || '' === $relative || str_contains($relative, "\0")) {
            return '';
        }
        $relative = ltrim(str_replace('\\', '/', $relative), '/');
        $path = realpath($this->theme_root . '/' . $relative);
        $prefix = trailingslashit($this->theme_root);
        if (false === $path || !is_file($path) || !str_starts_with($path, $prefix)) {
            return '';
        }
        return $path;
    }

    private function mime(string $mime): string
    {
        $mime = strtolower(trim($mime));
        return 'image/jpg' === $mime ? 'image/jpeg' : $mime;
    }

    /**
     * Mirror the canonical value produced when a slashed field is saved by
     * wp_insert_post() / wp_update_post(), without writing anything.
     */
    private function post_db_value(string $field, string $value, int $post_id = 0): string
    {
        $value = (string) sanitize_post_field($field, wp_slash($value), $post_id, 'db');
        if (in_array($field, ['post_title', 'post_content', 'post_excerpt'], true)) {
            global $wpdb;
            $charset = $wpdb->get_col_charset($wpdb->posts, $field);
            $value = $this->encode_emoji_for_database_charset(
                $field,
                $value,
                is_string($charset) ? $charset : ''
            );
        }
        return (string) wp_unslash($value);
    }

    /**
     * Mirror the utf8/utf8mb3 emoji conversion in WordPress 7.1's
     * wp_insert_post() before wp_insert_post_data runs.
     */
    private function encode_emoji_for_database_charset(string $field, string $value, string $charset): string
    {
        if (!in_array($field, ['post_title', 'post_content', 'post_excerpt'], true)
            || !in_array(strtolower($charset), ['utf8', 'utf8mb3'], true)) {
            return $value;
        }
        return wp_encode_emoji($value);
    }

    /** @param array<string,mixed> $desired */
    private function assert_term_slug_available(array $desired, int $id, string $key): void
    {
        $available = wp_unique_term_slug((string) $desired['slug'], (object) [
            'term_id' => $id,
            'name' => (string) $desired['name'],
            'taxonomy' => (string) $desired['taxonomy'],
            'description' => (string) $desired['description'],
            'parent' => (int) $desired['parent'],
            'slug' => (string) $desired['slug'],
            'alias_of' => '',
        ]);
        if (!hash_equals((string) $desired['slug'], (string) $available)) {
            throw new RuntimeException('WordPress would change the term slug for ' . $key . '.');
        }
    }

    private function assert_post_slug_available(
        string $slug,
        int $id,
        string $status,
        string $type,
        int $parent,
        string $key
    ): void {
        $available = wp_unique_post_slug($slug, $id, $status, $type, $parent);
        if (!hash_equals($slug, (string) $available)) {
            throw new RuntimeException('WordPress would change the post slug for ' . $key . '.');
        }
    }

    /** @return array<int,array<string,mixed>> */
    private function items(string $key): array
    {
        return isset($this->manifest[$key]) && is_array($this->manifest[$key])
            ? array_values($this->manifest[$key])
            : [];
    }

    /**
     * Disclose every ownership/audit metadata write made after state checks.
     * Backup evidence is supplied only at apply time, so its value source is
     * explicit rather than being represented as verified backup state.
     *
     * @param array<string,mixed> $operation
     * @param array<string,mixed> $source
     * @return array<string,mixed>
     */
    private function with_managed_metadata_disclosure(
        array $operation,
        string $kind,
        array $source,
        string $source_commit
    ): array {
        if (!in_array((string) ($operation['action'] ?? ''), ['create', 'update'], true)) {
            return $operation;
        }
        $id = (int) ($operation['id'] ?? 0);
        $names = [
            self::META_KEY,
            self::META_MANIFEST,
            self::META_SOURCE_HASH,
            self::META_APPLIED_HASH,
            self::META_RELEASE_COMMIT,
            self::META_BACKUP_EVIDENCE,
        ];
        if ('media' === $kind) {
            $names[] = self::META_ASSET_SHA;
        }
        $before = [];
        foreach ($names as $name) {
            if (!$id) {
                $before[$name] = [];
            } elseif ('term' === $kind) {
                $before[$name] = get_term_meta($id, $name, false);
            } else {
                $before[$name] = get_post_meta($id, $name, false);
            }
        }
        $desired = [
            self::META_KEY => (string) $operation['key'],
            self::META_MANIFEST => (string) ($this->manifest['manifest_version'] ?? ''),
            self::META_SOURCE_HASH => $this->hash($source),
            self::META_APPLIED_HASH => (string) ($operation['desired_hash'] ?? ''),
            self::META_RELEASE_COMMIT => preg_match('/^[0-9a-f]{40}$/', $source_commit)
                ? strtolower($source_commit)
                : ['from_required_plan_argument' => 'source-commit'],
            self::META_BACKUP_EVIDENCE => [
                'from_required_apply_argument' => 'backup-digest',
                'evidence_type' => 'user_supplied_sha256_reference',
            ],
        ];
        if ('media' === $kind) {
            $desired[self::META_ASSET_SHA] = strtolower((string) ($source['sha256'] ?? ''));
        }
        $operation['managed_metadata_write'] = [
            'before' => $before,
            'desired' => $desired,
            'timing' => 'after_canonical_state_postcondition',
        ];
        return $operation;
    }

    /** @param array<string,mixed> $extra @return array<string,mixed> */
    private function op(string $kind, string $key, string $action, string $reason, array $extra = []): array
    {
        return array_merge(['kind' => $kind, 'key' => $key, 'action' => $action, 'reason' => $reason], $extra);
    }

    /** @return array<string,mixed> */
    private function result(string $kind, string $key, string $status, int $id = 0): array
    {
        $result = ['kind' => $kind, 'key' => $key, 'status' => $status];
        if ($id > 0) {
            $result['id'] = $id;
        }
        return $result;
    }

    /** @param array<string,mixed> $before @param array<string,mixed> $desired @return array<string,array<string,mixed>> */
    private function field_changes(array $before, array $desired): array
    {
        $changes = [];
        $fields = array_values(array_unique(array_merge(array_keys($before), array_keys($desired)), SORT_STRING));
        sort($fields, SORT_STRING);
        foreach ($fields as $field) {
            $before_exists = array_key_exists($field, $before);
            $desired_exists = array_key_exists($field, $desired);
            $before_value = $before_exists ? $this->canonical($before[$field]) : null;
            $desired_value = $desired_exists ? $this->canonical($desired[$field]) : null;
            if ($before_exists === $desired_exists && $before_value === $desired_value) {
                continue;
            }
            $changes[(string) $field] = [
                'before_exists' => $before_exists,
                'before' => $before_value,
                'desired_exists' => $desired_exists,
                'desired' => $desired_value,
            ];
        }
        return $changes;
    }

    /** @param mixed $value */
    private function hash($value): string
    {
        $json = wp_json_encode($this->canonical($value), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        if (false === $json) {
            throw new RuntimeException('Could not encode canonical reconciliation state.');
        }
        return hash('sha256', $json);
    }

    /** @param mixed $value @return mixed */
    private function canonical($value)
    {
        if (!is_array($value)) {
            return $value;
        }
        if (array_is_list($value)) {
            return array_map([$this, 'canonical'], $value);
        }
        ksort($value, SORT_STRING);
        foreach ($value as $key => $item) {
            $value[$key] = $this->canonical($item);
        }
        return $value;
    }
}
