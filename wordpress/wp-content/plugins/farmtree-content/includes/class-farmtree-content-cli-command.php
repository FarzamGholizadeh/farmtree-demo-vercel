<?php
/**
 * Guarded WP-CLI entry point for managed FarmTree content.
 *
 * @package FarmTree_Content
 */

if (!defined('ABSPATH')) {
    exit;
}

final class FarmTree_Content_CLI_Command
{
    private const APPLY_CONFIRMATION = 'APPLY FARMTREE PRIVATE REVIEW CONTENT';
    private const PRIVATE_REVIEW_CONFIRMATION = 'MATERIALIZE ENGLISH CONTENT AS PRIVATE REVIEW';
    private const PROTECTION_CONFIRMATION = 'COMING SOON AND NOINDEX VERIFIED';

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
            $apply = isset($assoc_args['apply']);
            $options = [
                'set_front_page' => isset($assoc_args['set-front-page']),
                'expected_site' => isset($assoc_args['expected-site']) ? (string) $assoc_args['expected-site'] : '',
                'expected_theme' => isset($assoc_args['expected-theme']) ? (string) $assoc_args['expected-theme'] : '',
                'source_commit' => isset($assoc_args['source-commit']) ? strtolower((string) $assoc_args['source-commit']) : '',
            ];
            $reconciler = new FarmTree_Content_Reconciler();

            if (!$apply) {
                $plan = $reconciler->build_plan($options);
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
            'set-front-page', 'format',
        ];
        $unknown = array_diff(array_keys($assoc_args), $allowed);
        if ($unknown) {
            throw new InvalidArgumentException('Unsupported arguments: ' . implode(', ', $unknown) . '.');
        }
        if (isset($assoc_args['apply'], $assoc_args['dry-run'])) {
            throw new InvalidArgumentException('--apply and --dry-run are mutually exclusive.');
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
        if (self::APPLY_CONFIRMATION !== (string) $args['confirmation']) {
            throw new InvalidArgumentException('The apply confirmation text is not exact.');
        }
        if (self::PRIVATE_REVIEW_CONFIRMATION !== (string) $args['publication-confirmation']) {
            throw new InvalidArgumentException('The authenticated private-review confirmation text is not exact.');
        }
        if (self::PROTECTION_CONFIRMATION !== (string) $args['protection-confirmation']) {
            throw new InvalidArgumentException('The protection confirmation text is not exact.');
        }
        $errors = $reconciler->runtime_gate_errors((string) $args['expected-site'], (string) $args['expected-theme']);
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
