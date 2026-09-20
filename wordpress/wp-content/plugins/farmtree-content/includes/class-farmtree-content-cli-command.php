<?php
/**
 * Guarded WP-CLI entry point for managed FarmTree content.
 *
 * @package FarmTree_Content
 */

if (!defined('ABSPATH')) {
    exit;
}

final class FarmTree_Content_Dry_Run_Write_Exception extends RuntimeException
{
    /** @var array<string,mixed> */
    private array $write_attempt;

    /** @param array<string,mixed> $write_attempt */
    public function __construct(array $write_attempt)
    {
        parent::__construct('FarmTree dry-run blocked a modifying database query before execution.');
        $this->write_attempt = $write_attempt;
    }

    /** @return array<string,mixed> */
    public function write_attempt(): array
    {
        return $this->write_attempt;
    }
}

final class FarmTree_Content_CLI_Command
{
    private const APPLY_CONFIRMATION = 'APPLY FARMTREE PRIVATE REVIEW CONTENT';
    private const NEWS12_CONFIRMATION = 'CREATE TWELVE APPROVED FARMTREE NEWS ARTICLES';
    private const PRIVATE_REVIEW_CONFIRMATION = 'MATERIALIZE ENGLISH CONTENT AS PRIVATE REVIEW';
    private const PROTECTION_CONFIRMATION = 'COMING SOON AND NOINDEX VERIFIED';
    private const POST_LAUNCH_CONFIRMATION = 'APPLY SIX PAGE DOCUMENTARY CONTENT UPDATES';
    private const EDITORIAL_CONFIRMATION = 'APPLY APPROVED EDITORIAL DOCUMENTARY UPDATES';
    private const PUBLICATION_CONFIRMATION = 'PRESERVE EXISTING PUBLICATION AND ROUTING';
    private const PUBLIC_STATE_CONFIRMATION = 'PUBLIC INDEXING ON AND COMING SOON OFF VERIFIED';

    /**
     * Reconcile the protected private-review manifest.
     *
     * Defaults to a write-free JSON dry run. Applying requires the exact digest
     * from a dry run made with the same identity arguments.
     *
     * ## OPTIONS
     *
     * [--apply]
     * : Apply the exact recomputed plan. Omit for dry-run mode.
     *
     * [--dry-run]
     * : Explicitly select write-free dry-run mode.
     *
     * [--post-launch-images]
     * : Opt in to six-page, owned, published content-only updates; preserve public settings.
     *
     * [--post-launch-editorial]
     * : Opt in to the exact approved 09ddf530 editorial/media transition; preserve public settings.
     *
     * [--post-launch-news12]
     * : Create only the exact twelve approved News articles and their dependencies; preserve public state.
     *
     * [--plan-digest=<sha256>]
     * : Exact plan digest. Required with --apply.
     *
     * [--source-commit=<sha1>]
     * : Exact reviewed 40-character Git commit.
     *
     * [--expected-site=<url>]
     * : Expected WordPress home URL.
     *
     * [--expected-theme=<stylesheet>]
     * : Expected active stylesheet.
     *
     * [--backup-digest=<sha256>]
     * : SHA-256 of the separately verified backup evidence.
     *
     * [--confirmation=<text>]
     * : Exact apply confirmation.
     *
     * [--publication-confirmation=<text>]
     * : Exact confirmation that English entities remain authenticated/private.
     *
     * [--protection-confirmation=<text>]
     * : Exact protection confirmation.
     *
     * [--set-front-page]
     * : Also reconcile show_on_front and page_on_front, last.
     *
     * [--format=<format>]
     * : Only json is accepted.
     *
     * @subcommand reconcile
     * @param array<int,string> $args Positional arguments.
     * @param array<string,mixed> $assoc_args Named arguments.
     */
    public function reconcile($args, $assoc_args): void
    {
        try {
            $this->validate_arguments((array) $args, (array) $assoc_args);
            if (isset($assoc_args['post-launch-news12'])
                && !in_array(strtolower((string) wp_parse_url(home_url('/'), PHP_URL_HOST)), ['localhost', '127.0.0.1', '::1', '[::1]'], true)
                && true !== ($GLOBALS['farmtree_cron_diagnostics_active'] ?? false)) {
                throw new RuntimeException('News12 production operations require the guarded pre-bootstrap cron diagnostics entrypoint.');
            }
            $apply = isset($assoc_args['apply']);
            $options = [
                'post_launch_images' => isset($assoc_args['post-launch-images']),
                'post_launch_editorial' => isset($assoc_args['post-launch-editorial']),
                'post_launch_news12' => isset($assoc_args['post-launch-news12']),
                'set_front_page' => isset($assoc_args['set-front-page']),
                'expected_site' => isset($assoc_args['expected-site']) ? (string) $assoc_args['expected-site'] : '',
                'expected_theme' => isset($assoc_args['expected-theme']) ? (string) $assoc_args['expected-theme'] : '',
                'source_commit' => isset($assoc_args['source-commit']) ? strtolower((string) $assoc_args['source-commit']) : '',
            ];
            $reconciler = new FarmTree_Content_Reconciler(isset($assoc_args['post-launch-news12']));
            if (isset($assoc_args['post-launch-news12']) && isset($GLOBALS['farmtree_news12_commit_guard']) && $GLOBALS['farmtree_news12_commit_guard'] instanceof Closure) {
                $reconciler->set_news12_commit_guard($GLOBALS['farmtree_news12_commit_guard']);
            }

            if (!$apply) {
                $plan = $this->build_dry_run_plan($reconciler, $options);
                $this->emit($plan, empty($plan['summary']['conflict']) ? 0 : 2);
                return;
            }

            $this->validate_apply_gates((array) $assoc_args, $reconciler);
            $plan = $reconciler->build_plan($options);
            $provided = strtolower((string) $assoc_args['plan-digest']);
            if (!hash_equals((string) $plan['plan_digest'], $provided)) {
                $this->emit([
                    'mode' => 'apply',
                    'ok' => false,
                    'error' => 'plan_digest_mismatch',
                    'provided_plan_digest' => $provided,
                    'recomputed_plan_digest' => $plan['plan_digest'],
                    'recomputed_plan_summary' => $plan['summary'],
                ], 2);
                return;
            }
            if (!empty($plan['summary']['conflict'])) {
                $this->emit([
                    'mode' => 'apply',
                    'ok' => false,
                    'error' => 'plan_has_conflicts',
                    'plan_digest' => $plan['plan_digest'],
                    'conflicts' => $plan['conflicts'],
                ], 2);
                return;
            }

            $this->emit($reconciler->apply_plan(
                $plan,
                strtolower((string) $assoc_args['source-commit']),
                strtolower((string) $assoc_args['backup-digest'])
            ), 0);
        } catch (FarmTree_Content_Dry_Run_Write_Exception $error) {
            $this->emit([
                'mode' => 'dry-run',
                'ok' => false,
                'error' => 'dry_run_sql_write_blocked',
                'write_attempt' => $error->write_attempt(),
            ], 2);
        } catch (Throwable $error) {
            $payload = [
                'mode' => isset($assoc_args['apply']) ? 'apply' : 'dry-run',
                'ok' => false,
                'error' => 'reconcile_failed',
                'message' => $error->getMessage(),
            ];
            if ($error instanceof FarmTree_Content_Apply_Exception) {
                $payload['apply_context'] = $error->apply_context();
            }
            $this->emit($payload, 1);
        }
    }

    /**
     * Run the dry plan inside a short-lived, fail-closed SQL read boundary.
     *
     * @param array<string,mixed> $options
     * @return array<string,mixed>
     */
    private function build_dry_run_plan(FarmTree_Content_Reconciler $reconciler, array $options): array
    {
        $active_plugin_roots = $this->active_plugin_roots();
        $firewall = function ($query) use ($active_plugin_roots) {
            return $this->inspect_dry_run_query((string) $query, $active_plugin_roots);
        };

        add_filter('query', $firewall, PHP_INT_MAX);
        try {
            return $reconciler->build_plan($options);
        } finally {
            remove_filter('query', $firewall, PHP_INT_MAX);
        }
    }

    /**
     * Permit only database reads while the dry plan is being built.
     *
     * Throwing from WordPress's final query filter prevents wpdb from sending
     * the modifying statement to the database driver.
     *
     * @param array<int,string> $active_plugin_roots
     */
    private function inspect_dry_run_query(string $query, array $active_plugin_roots): string
    {
        $without_leading_comments = preg_replace(
            '/\A(?:\s+|\/\*.*?\*\/|--[^\r\n]*(?:\r?\n|\z)|#[^\r\n]*(?:\r?\n|\z))*/s',
            '',
            $query
        );
        $candidate = is_string($without_leading_comments) ? ltrim($without_leading_comments) : ltrim($query);
        preg_match('/\A([A-Za-z]+)/', $candidate, $match);
        $operation = strtoupper((string) ($match[1] ?? 'UNKNOWN'));
        $read_only = in_array($operation, ['SELECT', 'SHOW', 'DESCRIBE', 'DESC', 'EXPLAIN'], true);
        if ($read_only && !preg_match('/\bINTO\s+(?:OUTFILE|DUMPFILE)\b/i', $candidate)) {
            return $query;
        }

        $trace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 40);
        $origin = $this->classify_stack_origin($trace, $active_plugin_roots);
        throw new FarmTree_Content_Dry_Run_Write_Exception(array_merge([
            'operation' => $operation,
            'table' => $this->query_table($candidate, $operation),
            'redacted_fingerprint' => $this->redacted_query_fingerprint($query),
            'sha256' => hash('sha256', $query),
        ], $this->safe_query_context($query), $origin));
    }

    /** @return array<int,string> */
    private function active_plugin_roots(): array
    {
        $plugins = (array) get_option('active_plugins', []);
        if (is_multisite()) {
            $plugins = array_merge($plugins, array_keys((array) get_site_option('active_sitewide_plugins', [])));
        }
        $roots = [];
        foreach (array_unique(array_map('strval', $plugins)) as $plugin) {
            if (!preg_match('/\A[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._\/-]+)?\z/', $plugin)) {
                continue;
            }
            $path = wp_normalize_path(WP_PLUGIN_DIR . '/' . $plugin);
            $roots[] = str_contains($plugin, '/') ? dirname($path) . '/' : $path;
        }
        return array_values(array_unique($roots));
    }

    /**
     * @param array<int,array<string,mixed>> $trace
     * @param array<int,string> $active_plugin_roots
     * @return array<string,mixed>
     */
    private function classify_stack_origin(array $trace, array $active_plugin_roots): array
    {
        $application_candidates = [];
        $core_candidates = [];
        $stack = [];
        foreach ($trace as $frame) {
            $file = isset($frame['file']) ? wp_normalize_path((string) $frame['file']) : '';
            if ('' === $file || wp_normalize_path(__FILE__) === $file) {
                continue;
            }
            $function = (string) ($frame['function'] ?? 'unknown');
            $class = (string) ($frame['class'] ?? '');
            $relative = $this->redacted_stack_path($file);
            $summary = $relative . ':' . max(0, (int) ($frame['line'] ?? 0)) . '::' . $class . $function;
            if (count($stack) < 8) {
                $stack[] = $summary;
            }
            if (str_starts_with($file, wp_normalize_path(WP_PLUGIN_DIR . '/farmtree-content/'))) {
                $application_candidates[] = ['classification' => 'FarmTree', 'origin' => $summary];
                continue;
            }
            $active = false;
            foreach ($active_plugin_roots as $root) {
                if ((str_ends_with($root, '/') && str_starts_with($file, $root)) || $file === $root) {
                    $active = true;
                    break;
                }
            }
            if ($active) {
                $application_candidates[] = ['classification' => 'active plugin', 'origin' => $summary];
            } elseif (str_starts_with($file, wp_normalize_path(ABSPATH . 'wp-admin/'))
                || str_starts_with($file, wp_normalize_path(ABSPATH . WPINC . '/'))) {
                $core_candidates[] = $summary;
            } else {
                $application_candidates[] = ['classification' => 'unknown', 'origin' => $summary];
            }
        }

        if ($application_candidates) {
            return [
                'caller_classification' => (string) $application_candidates[0]['classification'],
                'stack_origin' => (string) $application_candidates[0]['origin'],
                'stack' => $stack,
            ];
        }
        if ($core_candidates) {
            return [
                'caller_classification' => 'WordPress core',
                'stack_origin' => (string) $core_candidates[0],
                'stack' => $stack,
            ];
        }
        return ['caller_classification' => 'unknown', 'stack_origin' => 'unavailable', 'stack' => []];
    }

    private function redacted_stack_path(string $file): string
    {
        $content_root = wp_normalize_path(WP_CONTENT_DIR . '/');
        $wordpress_root = wp_normalize_path(ABSPATH);
        if (str_starts_with($file, $content_root)) {
            return 'wp-content/' . ltrim(substr($file, strlen($content_root)), '/');
        }
        if (str_starts_with($file, $wordpress_root)) {
            return 'wordpress/' . ltrim(substr($file, strlen($wordpress_root)), '/');
        }
        return basename($file);
    }

    private function query_table(string $query, string $operation): ?string
    {
        $patterns = [
            'INSERT' => '/\AINSERT\s+(?:IGNORE\s+)?INTO\s+(`?[A-Za-z0-9_.-]+`?)/i',
            'REPLACE' => '/\AREPLACE\s+(?:INTO\s+)?(`?[A-Za-z0-9_.-]+`?)/i',
            'UPDATE' => '/\AUPDATE\s+(`?[A-Za-z0-9_.-]+`?)/i',
            'DELETE' => '/\ADELETE\s+FROM\s+(`?[A-Za-z0-9_.-]+`?)/i',
            'ALTER' => '/\AALTER\s+TABLE\s+(`?[A-Za-z0-9_.-]+`?)/i',
            'CREATE' => '/\ACREATE\s+(?:TEMPORARY\s+)?TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(`?[A-Za-z0-9_.-]+`?)/i',
            'DROP' => '/\ADROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?(`?[A-Za-z0-9_.-]+`?)/i',
            'TRUNCATE' => '/\ATRUNCATE\s+(?:TABLE\s+)?(`?[A-Za-z0-9_.-]+`?)/i',
        ];
        if (!isset($patterns[$operation]) || !preg_match($patterns[$operation], $query, $match)) {
            return null;
        }
        $identifier = trim((string) $match[1], '`');
        $parts = explode('.', $identifier);
        return (string) end($parts);
    }

    /** @return array<string,mixed> */
    private function safe_query_context(string $query): array
    {
        $context = [];
        foreach (['option_name', 'meta_key'] as $field) {
            $pattern = '/\b`?' . preg_quote($field, '/') . "`?\\s*=\\s*'([A-Za-z0-9_.:-]{1,191})'/i";
            if (preg_match($pattern, $query, $match)) {
                $context[$field] = (string) $match[1];
            }
        }
        if (!isset($context['option_name'])
            && preg_match('/\(\s*`?option_name`?\s*,[^)]*\)\s*VALUES\s*\(\s*\'([A-Za-z0-9_.:-]{1,191})\'/is', $query, $match)) {
            $context['option_name'] = (string) $match[1];
        }
        foreach (['post_id', 'term_id', 'user_id', 'comment_id'] as $field) {
            if (preg_match('/\b`?' . preg_quote($field, '/') . '`?\s*=\s*([0-9]{1,20})/i', $query, $match)) {
                $context['entity'] = $field . ':' . (string) $match[1];
                break;
            }
        }
        return $context;
    }

    private function redacted_query_fingerprint(string $query): string
    {
        $redacted = preg_replace('/\/\*.*?\*\/|--[^\r\n]*|#[^\r\n]*/s', ' ', $query);
        $redacted = preg_replace('/\'(?:\\\\.|\'\'|[^\'])*\'/s', '?', (string) $redacted);
        $redacted = preg_replace('/"(?:\\\\.|""|[^"])*"/s', '?', (string) $redacted);
        $redacted = preg_replace('/\b(?:0x[0-9a-f]+|[0-9]+(?:\.[0-9]+)?)\b/i', '?', (string) $redacted);
        $redacted = preg_replace('/\s+/', ' ', trim((string) $redacted));
        return substr((string) $redacted, 0, 512);
    }

    /** @param array<int,string> $args @param array<string,mixed> $assoc_args */
    private function validate_arguments(array $args, array $assoc_args): void
    {
        if ($args) {
            throw new InvalidArgumentException('Positional arguments are not accepted.');
        }
        $allowed = [
            'apply', 'dry-run', 'plan-digest', 'source-commit', 'expected-site',
            'expected-theme', 'backup-digest', 'confirmation',
            'publication-confirmation', 'protection-confirmation',
            'set-front-page', 'format', 'post-launch-images', 'post-launch-editorial', 'post-launch-news12',
        ];
        $unknown = array_diff(array_keys($assoc_args), $allowed);
        if ($unknown) {
            throw new InvalidArgumentException('Unsupported arguments: ' . implode(', ', $unknown) . '.');
        }
        if (isset($assoc_args['apply'], $assoc_args['dry-run'])) {
            throw new InvalidArgumentException('--apply and --dry-run are mutually exclusive.');
        }
        if (isset($assoc_args['post-launch-news12']) && (isset($assoc_args['set-front-page']) || isset($assoc_args['post-launch-images']) || isset($assoc_args['post-launch-editorial']))) {
            throw new InvalidArgumentException('News12 mode cannot combine with front-page changes or another release scope.');
        }
        if (isset($assoc_args['post-launch-images'], $assoc_args['set-front-page'])) {
            throw new InvalidArgumentException('Post-launch image mode cannot change the front page.');
        }
        if (isset($assoc_args['post-launch-editorial']) && (isset($assoc_args['set-front-page']) || isset($assoc_args['post-launch-images']))) {
            throw new InvalidArgumentException('Editorial mode cannot combine with front-page changes or another release scope.');
        }
        if (isset($assoc_args['format']) && 'json' !== strtolower((string) $assoc_args['format'])) {
            throw new InvalidArgumentException('Only --format=json is supported.');
        }
    }

    /** @param array<string,mixed> $args */
    private function validate_apply_gates(array $args, FarmTree_Content_Reconciler $reconciler): void
    {
        $required = [
            'plan-digest', 'source-commit', 'expected-site', 'expected-theme',
            'backup-digest', 'confirmation', 'publication-confirmation',
            'protection-confirmation',
        ];
        foreach ($required as $name) {
            if (!isset($args[$name]) || '' === trim((string) $args[$name])) {
                throw new InvalidArgumentException('--' . $name . ' is required with --apply.');
            }
        }
        if (!preg_match('/^[0-9a-f]{64}$/', strtolower((string) $args['plan-digest']))) {
            throw new InvalidArgumentException('--plan-digest must be a 64-character SHA-256.');
        }
        if (!preg_match('/^[0-9a-f]{40}$/', strtolower((string) $args['source-commit']))) {
            throw new InvalidArgumentException('--source-commit must be a 40-character Git commit.');
        }
        if (!preg_match('/^[0-9a-f]{64}$/', strtolower((string) $args['backup-digest']))) {
            throw new InvalidArgumentException('--backup-digest must be a 64-character SHA-256.');
        }
        $public_mode = isset($args['post-launch-images']) || isset($args['post-launch-editorial']) || isset($args['post-launch-news12']);
        $confirmation = isset($args['post-launch-news12']) ? self::NEWS12_CONFIRMATION : (isset($args['post-launch-editorial']) ? self::EDITORIAL_CONFIRMATION : ($public_mode ? self::POST_LAUNCH_CONFIRMATION : self::APPLY_CONFIRMATION));
        if ($confirmation !== (string) $args['confirmation']) {
            throw new InvalidArgumentException('The apply confirmation text is not exact.');
        }
        if (($public_mode ? self::PUBLICATION_CONFIRMATION : self::PRIVATE_REVIEW_CONFIRMATION) !== (string) $args['publication-confirmation']) {
            throw new InvalidArgumentException('The authenticated private-review confirmation text is not exact.');
        }
        if (($public_mode ? self::PUBLIC_STATE_CONFIRMATION : self::PROTECTION_CONFIRMATION) !== (string) $args['protection-confirmation']) {
            throw new InvalidArgumentException('The protection confirmation text is not exact.');
        }
        $errors = $reconciler->runtime_gate_errors((string) $args['expected-site'], (string) $args['expected-theme'], $public_mode);
        if ($errors) {
            throw new RuntimeException('Runtime gates failed: ' . wp_json_encode($errors, JSON_UNESCAPED_SLASHES));
        }
    }

    /** @param array<string,mixed> $payload */
    private function emit(array $payload, int $exit_code): void
    {
        WP_CLI::line(wp_json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
        if (0 !== $exit_code) {
            WP_CLI::halt($exit_code);
        }
    }
}
