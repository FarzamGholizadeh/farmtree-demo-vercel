import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, '..');
const playground = resolve(repositoryRoot, 'node_modules/.bin/wp-playground-cli');
const pluginRoot = resolve(repositoryRoot, 'wordpress/wp-content/plugins/farmtree-content');
const themeRoot = resolve(repositoryRoot, 'wordpress/wp-content/themes/farmtree-native');

function fail(message, details = []) {
  const suffix = details.length === 0 ? '' : `\n${details.map((detail) => `  - ${detail}`).join('\n')}`;
  throw new Error(`${message}${suffix}`);
}

function changedKeys(before, after) {
  const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])].sort();
  return keys.filter((key) => JSON.stringify(before[key] ?? null) !== JSON.stringify(after[key] ?? null));
}

function decodedOption(snapshot, name, fallback) {
  return snapshot.options?.[name]?.decoded ?? fallback;
}

function assertExactLifecycleTransitions(activation, deactivation) {
  const plugin = 'farmtree-content/farmtree-content.php';
  const beforeActive = decodedOption(activation.before, 'active_plugins', []);
  const activated = decodedOption(activation.after, 'active_plugins', []);
  const deactivationBefore = decodedOption(deactivation.before, 'active_plugins', []);
  const deactivated = decodedOption(deactivation.after, 'active_plugins', []);
  if (!Array.isArray(beforeActive) || !Array.isArray(activated) ||
      !Array.isArray(deactivationBefore) || !Array.isArray(deactivated) || beforeActive.includes(plugin)) {
    fail('Lifecycle probe did not begin with one inactive FarmTree plugin identity.');
  }
  const expectedActivated = [...beforeActive, plugin].sort();
  if (JSON.stringify(activated) !== JSON.stringify(expectedActivated) ||
      JSON.stringify(deactivationBefore) !== JSON.stringify(activated) ||
      JSON.stringify(deactivated) !== JSON.stringify(beforeActive)) {
    fail('WordPress lifecycle changed active_plugins beyond the exact FarmTree transition.', [
      `before: ${JSON.stringify(beforeActive)}`,
      `activated: ${JSON.stringify(activated)}`,
      `deactivated: ${JSON.stringify(deactivated)}`
    ]);
  }

  const beforeRecent = decodedOption(activation.before, 'recently_activated', {});
  const activatedRecent = decodedOption(activation.after, 'recently_activated', {});
  const deactivationRecentBefore = decodedOption(deactivation.before, 'recently_activated', {});
  const deactivatedRecent = decodedOption(deactivation.after, 'recently_activated', {});
  for (const value of [beforeRecent, activatedRecent, deactivationRecentBefore, deactivatedRecent]) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      fail('recently_activated lifecycle state was not a decoded option map.');
    }
  }
  const expectedAfterActivation = { ...beforeRecent };
  delete expectedAfterActivation[plugin];
  if (JSON.stringify(activatedRecent) !== JSON.stringify(expectedAfterActivation) ||
      JSON.stringify(deactivationRecentBefore) !== JSON.stringify(activatedRecent)) {
    fail('Activation changed recently_activated beyond removal of the FarmTree identity.');
  }
  const withoutFarmTree = { ...deactivatedRecent };
  const deactivatedAt = withoutFarmTree[plugin];
  delete withoutFarmTree[plugin];
  if (JSON.stringify(withoutFarmTree) !== JSON.stringify(deactivationRecentBefore)) {
    fail('Deactivation changed unrelated recently_activated bookkeeping.');
  }
  if (deactivatedAt !== undefined &&
      (!Number.isInteger(Number(deactivatedAt)) || Number(deactivatedAt) < deactivation.before.observedAt - 1 ||
       Number(deactivatedAt) > deactivation.after.observedAt + 1)) {
    fail('FarmTree recently_activated timestamp is outside the lifecycle observation window.');
  }
}

function assertPurePhase(phase) {
  const optionChanges = changedKeys(phase.before.options, phase.after.options);
  const tableChanges = changedKeys(phase.before.tables, phase.after.tables);
  const fileChanges = changedKeys(phase.before.files, phase.after.files);
  if (phase.writeQueries.length > 0 || optionChanges.length > 0 || tableChanges.length > 0 || fileChanges.length > 0) {
    fail(`FarmTree phase ${phase.name} was not write-free.`, [
      `write queries: ${phase.writeQueries.length}`,
      `options: ${optionChanges.join(', ') || 'none'}`,
      `tables: ${tableChanges.join(', ') || 'none'}`,
      `files: ${fileChanges.join(', ') || 'none'}`
    ]);
  }
}

function assertLifecyclePhase(phase, allowedOptions) {
  const optionChanges = changedKeys(phase.before.options, phase.after.options);
  const unexpectedOptions = optionChanges.filter((name) => !allowedOptions.includes(name));
  const tableChanges = changedKeys(phase.before.tables, phase.after.tables);
  const fileChanges = changedKeys(phase.before.files, phase.after.files);
  if (unexpectedOptions.length > 0 || tableChanges.length > 0 || fileChanges.length > 0) {
    fail(`WordPress lifecycle phase ${phase.name} changed state outside core lifecycle bookkeeping.`, [
      `unexpected options: ${unexpectedOptions.join(', ') || 'none'}`,
      `tables: ${tableChanges.join(', ') || 'none'}`,
      `files: ${fileChanges.join(', ') || 'none'}`
    ]);
  }
  for (const query of phase.writeQueries) {
    if (!/^\s*(?:INSERT\s+INTO|UPDATE|DELETE\s+FROM)\s+[^\s]+options\b/i.test(query) ||
        !/\b(?:active_plugins|recently_activated)\b/i.test(query)) {
      fail(`WordPress lifecycle phase ${phase.name} issued an unexpected write query.`);
    }
  }
  return optionChanges;
}

const phpHarness = String.raw`<?php
ini_set('display_errors', '1');
error_reporting(E_ALL);
register_shutdown_function(static function () {
    $error = error_get_last();
    if (is_array($error) && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
        file_put_contents('/farmtree-output/fatal.json', json_encode($error));
    }
});
require_once '/wordpress/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/plugin.php';
require_once ABSPATH . 'wp-admin/includes/theme.php';

switch_theme('farmtree-native');
update_option('permalink_structure', '/%postname%/');
$farmtree_setup_rewrite_state = [
    'matches' => $wp_rewrite->matches,
    'rules' => $wp_rewrite->rules,
    'extra_rules_top' => $wp_rewrite->extra_rules_top,
];
try {
    flush_rewrite_rules(false);
} finally {
    $wp_rewrite->matches = $farmtree_setup_rewrite_state['matches'];
    $wp_rewrite->rules = $farmtree_setup_rewrite_state['rules'];
    $wp_rewrite->extra_rules_top = $farmtree_setup_rewrite_state['extra_rules_top'];
}

if (!defined('WP_CLI')) {
    define('WP_CLI', true);
}
if (!class_exists('WP_CLI')) {
    final class WP_CLI
    {
        public static array $commands = [];
        public static array $lines = [];
        public static array $halt_codes = [];
        public static function add_command($name, $class): void
        {
            self::$commands[(string) $name] = (string) $class;
        }
        public static function line($line): void
        {
            self::$lines[] = (string) $line;
        }
        public static function halt($code): void
        {
            self::$halt_codes[] = (int) $code;
        }
    }
}

$GLOBALS['farmtree_probe_phase'] = '';
$GLOBALS['farmtree_probe_queries'] = [];
add_filter('query', static function ($query) {
    $phase = (string) ($GLOBALS['farmtree_probe_phase'] ?? '');
    if ('' !== $phase && preg_match('/^\s*(?:INSERT|UPDATE|DELETE|REPLACE|ALTER|CREATE|DROP|TRUNCATE|RENAME|BEGIN|START|COMMIT|ROLLBACK)\b/i', (string) $query)) {
        $GLOBALS['farmtree_probe_queries'][$phase][] = preg_replace('/\s+/', ' ', trim((string) $query));
    }
    return $query;
}, PHP_INT_MAX);

function farmtree_probe_hash($value): string
{
    return hash('sha256', serialize($value));
}

function farmtree_probe_files(): array
{
    $roots = [
        ABSPATH . '.htaccess',
        ABSPATH . 'web.config',
        WP_CONTENT_DIR . '/plugins/farmtree-content',
        WP_CONTENT_DIR . '/themes/farmtree-native',
        WP_CONTENT_DIR . '/uploads',
    ];
    $files = [];
    foreach ($roots as $root) {
        if (is_file($root)) {
            $files[str_replace(ABSPATH, '/', $root)] = [
                'sha256' => hash_file('sha256', $root),
                'size' => filesize($root),
                'mtime' => filemtime($root),
                'mode' => fileperms($root) & 0777,
            ];
            continue;
        }
        if (!is_dir($root)) {
            continue;
        }
        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS)
        );
        foreach ($iterator as $file) {
            if (!$file->isFile()) {
                continue;
            }
            $path = $file->getPathname();
            $files[str_replace(ABSPATH, '/', $path)] = [
                'sha256' => hash_file('sha256', $path),
                'size' => filesize($path),
                'mtime' => filemtime($path),
                'mode' => fileperms($path) & 0777,
            ];
        }
    }
    ksort($files, SORT_STRING);
    return $files;
}

function farmtree_probe_snapshot(): array
{
    global $wpdb;
    $options = [];
    $wpdb->last_error = '';
    $rows = $wpdb->get_results("SELECT option_name, option_value, autoload FROM {$wpdb->options} ORDER BY option_name ASC", ARRAY_A);
    if ('' !== (string) $wpdb->last_error || !is_array($rows)) {
        throw new RuntimeException('Could not capture the complete options table.');
    }
    foreach ((array) $rows as $row) {
        $name = (string) $row['option_name'];
        $options[$name] = [
            'autoload' => (string) $row['autoload'],
            'sha256' => hash('sha256', (string) $row['option_value']),
        ];
        if (in_array($name, ['active_plugins', 'recently_activated', 'rewrite_rules'], true)) {
            $options[$name]['decoded'] = maybe_unserialize($row['option_value']);
        }
    }

    $wpdb->last_error = '';
    $table_names = $wpdb->get_col('SHOW TABLES');
    if ('' !== (string) $wpdb->last_error || !is_array($table_names) || !$table_names) {
        throw new RuntimeException('Could not enumerate the complete WordPress schema.');
    }
    $tables = [];
    sort($table_names, SORT_STRING);
    foreach (array_values(array_unique($table_names, SORT_STRING)) as $table) {
        if ($table === $wpdb->options) {
            continue;
        }
        $wpdb->last_error = '';
        $table_rows = $wpdb->get_results('SELECT * FROM ' . $table, ARRAY_A);
        if ('' !== (string) $wpdb->last_error || !is_array($table_rows)) {
            throw new RuntimeException('Could not capture table ' . $table . '.');
        }
        $tables[$table] = farmtree_probe_hash($table_rows);
    }
    ksort($tables, SORT_STRING);
    return [
        'observedAt' => time(),
        'options' => $options,
        'tables' => $tables,
        'files' => farmtree_probe_files(),
    ];
}

function farmtree_probe_phase(string $name, callable $callback): array
{
    $before = farmtree_probe_snapshot();
    $GLOBALS['farmtree_probe_phase'] = $name;
    $GLOBALS['farmtree_probe_queries'][$name] = [];
    $value = $callback();
    $GLOBALS['farmtree_probe_phase'] = '';
    return [
        'name' => $name,
        'before' => $before,
        'after' => farmtree_probe_snapshot(),
        'writeQueries' => $GLOBALS['farmtree_probe_queries'][$name],
        'value' => $value,
    ];
}

function farmtree_run_cli_dry_run(string $source_commit): array
{
    WP_CLI::$lines = [];
    WP_CLI::$halt_codes = [];
    $command = new FarmTree_Content_CLI_Command();
    $command->reconcile([], [
        'dry-run' => true,
        'source-commit' => $source_commit,
        'expected-site' => home_url('/'),
        'expected-theme' => get_stylesheet(),
        'format' => 'json',
    ]);
    return [
        'payload' => json_decode((string) end(WP_CLI::$lines), true),
        'haltCodes' => WP_CLI::$halt_codes,
    ];
}

function farmtree_firewall_probe(string $name, callable $attempt, string $source_commit): array
{
    $hook = static function ($rules) use ($attempt) {
        $attempt();
        return $rules;
    };
    $before = farmtree_probe_snapshot();
    $GLOBALS['farmtree_probe_phase'] = 'firewall-' . $name;
    $GLOBALS['farmtree_probe_queries']['firewall-' . $name] = [];
    add_filter('customer_segment_rewrite_rules', $hook, 1);
    try {
        $result = farmtree_run_cli_dry_run($source_commit);
    } finally {
        remove_filter('customer_segment_rewrite_rules', $hook, 1);
        $GLOBALS['farmtree_probe_phase'] = '';
    }
    return [
        'name' => $name,
        'before' => $before,
        'after' => farmtree_probe_snapshot(),
        'attemptedWriteQueries' => $GLOBALS['farmtree_probe_queries']['firewall-' . $name],
        'result' => $result,
    ];
}

function farmtree_rewrite_regression(FarmTree_Content_Reconciler $reconciler, array $options): array
{
    global $wpdb, $wp_rewrite;
    $original_rules = get_option('rewrite_rules');
    $original_extra_rules_top = $wp_rewrite->extra_rules_top;
    $stored_row = $wpdb->get_row($wpdb->prepare(
        "SELECT option_id, autoload FROM {$wpdb->options} WHERE option_name = %s LIMIT 1",
        'rewrite_rules'
    ), ARRAY_A);
    if (!is_array($original_rules) || !$original_rules || !is_array($stored_row)) {
        throw new RuntimeException('Rewrite regression requires a populated stored rewrite option.');
    }
    $runtime_only = ['^sp-login/?$' => 'index.php?seedprod=login'];
    for ($index = 1; $index <= 17; $index++) {
        $runtime_only['seedprod/review-rule-' . str_pad((string) $index, 2, '0', STR_PAD_LEFT) . '/?$']
            = 'index.php?seedprod_rule=' . $index;
    }
    $stored_test_rules = ['farmtree-preserved-top/?$' => 'index.php?preserved=top']
        + $original_rules
        + ['farmtree-preserved-bottom/?$' => 'index.php?preserved=bottom'];
    try {
        update_option('rewrite_rules', $stored_test_rules);
        $wp_rewrite->extra_rules_top = $runtime_only + $original_extra_rules_top;
        $plan = $reconciler->build_plan($options);
        $operation = $plan['operations']['options'][1] ?? [];
        $target = (array) ($operation['desired']['merged_rules'] ?? []);
        $managed = array_merge(
            (array) ($operation['desired']['required_farmtree_rules']['customer_segment'] ?? []),
            (array) ($operation['desired']['required_farmtree_rules']['proof_story'] ?? [])
        );
        $target_unrelated = array_diff_key($target, $managed);
        $runtime_adopted = array_intersect_key($target, $runtime_only);
        $runtime_reported = (array) ($operation['desired']['runtime_unrelated_rules_not_adopted'] ?? []);

        $finalizer = new ReflectionMethod($reconciler, 'finalize_rewrite_rules');
        $finalizer->setAccessible(true);
        $finalizer_result = $finalizer->invoke($reconciler, $operation);
        $persisted = get_option('rewrite_rules');
        $after_plan = $reconciler->build_plan($options);

        update_option('rewrite_rules', $stored_test_rules + ['^sp-login/?$' => 'index.php?seedprod=login']);
        $sp_login_plan = $reconciler->build_plan($options);
        $sp_login_target = (array) ($sp_login_plan['operations']['options'][1]['desired']['merged_rules'] ?? []);

        update_option('rewrite_rules', ['farmtree-no-anchor/?$' => 'index.php?no_anchor=1']);
        $ambiguous = $reconciler->build_plan($options);

        update_option('rewrite_rules', ['(.+)?$' => 'index.php?shadow=1'] + $stored_test_rules);
        $shadowed = $reconciler->build_plan($options);

        $bad_identity = ['customer-segments/([^/]+)(?:/([0-9]+))?/?$' => 'index.php?foreign=$matches[1]']
            + $stored_test_rules;
        update_option('rewrite_rules', $bad_identity);
        $identity_conflict = $reconciler->build_plan($options);

        return [
            'planSummary' => $plan['summary'],
            'operation' => $operation['action'] ?? null,
            'managedRuleCount' => count($managed),
            'unrelatedPreserved' => $target_unrelated === $stored_test_rules,
            'unrelatedOrderPreserved' => array_keys($target_unrelated) === array_keys($stored_test_rules),
            'runtimeOnlyRuleCount' => count($runtime_only),
            'runtimeOnlyAdoptedCount' => count($runtime_adopted),
            'runtimeOnlyReportedCount' => count($runtime_reported),
            'finalizerResult' => $finalizer_result,
            'persistedExactTarget' => $persisted === $target,
            'optionIdentityPreserved' => (int) $stored_row['option_id'] === (int) $wpdb->get_var($wpdb->prepare(
                "SELECT option_id FROM {$wpdb->options} WHERE option_name = %s LIMIT 1",
                'rewrite_rules'
            )),
            'optionAutoloadPreserved' => (string) $stored_row['autoload'] === (string) $wpdb->get_var($wpdb->prepare(
                "SELECT autoload FROM {$wpdb->options} WHERE option_name = %s LIMIT 1",
                'rewrite_rules'
            )),
            'afterAction' => $after_plan['operations']['options'][1]['action'] ?? null,
            'spLoginPreservedWhenStored' => ($sp_login_target['^sp-login/?$'] ?? null) === 'index.php?seedprod=login',
            'ambiguousReason' => $ambiguous['operations']['options'][1]['reason'] ?? null,
            'shadowReason' => $shadowed['operations']['options'][1]['reason'] ?? null,
            'identityReason' => $identity_conflict['operations']['options'][1]['reason'] ?? null,
        ];
    } finally {
        $wp_rewrite->extra_rules_top = $original_extra_rules_top;
        update_option('rewrite_rules', $original_rules);
    }
}

$plugin_file = WP_CONTENT_DIR . '/plugins/farmtree-content/farmtree-content.php';
$phases = [];
$phases[] = farmtree_probe_phase('plugin-load-and-cli-registration', static function () use ($plugin_file) {
    require_once $plugin_file;
    return WP_CLI::$commands;
});
$phases[] = farmtree_probe_phase('model-registration', static function () {
    farmtree_content_register_customer_segments();
    farmtree_content_register_proof_stories();
    return [post_type_exists('customer_segment'), post_type_exists('proof_story')];
});
$reconciler = null;
$phases[] = farmtree_probe_phase('reconciler-construction', static function () use (&$reconciler) {
    $reconciler = new FarmTree_Content_Reconciler();
    return get_class($reconciler);
});
$source_commit = str_repeat('0', 40);
$options = [
    'set_front_page' => false,
    'expected_site' => home_url('/'),
    'expected_theme' => get_stylesheet(),
    'source_commit' => $source_commit,
];
$phases[] = farmtree_probe_phase('build-plan', static function () use (&$reconciler, $options) {
    $plan = $reconciler->build_plan($options);
    return ['summary' => $plan['summary'], 'plan_digest' => $plan['plan_digest']];
});
$phases[] = farmtree_probe_phase('cli-dry-run', static function () use ($source_commit) {
    return farmtree_run_cli_dry_run($source_commit)['payload'];
});
$rewrite_regression = farmtree_rewrite_regression($reconciler, $options);
$firewall_probes = [];
$firewall_probes[] = farmtree_firewall_probe('select', static function () use ($wpdb) {
    $wpdb->get_var('SELECT 1');
}, $source_commit);
$firewall_probes[] = farmtree_firewall_probe('insert', static function () use ($wpdb) {
    $wpdb->query("INSERT INTO {$wpdb->options} (option_name, option_value, autoload) VALUES ('farmtree_firewall_insert', 'secret-redacted', 'no')");
}, $source_commit);
$firewall_probes[] = farmtree_firewall_probe('update', static function () use ($wpdb) {
    $wpdb->query("UPDATE {$wpdb->options} SET option_value = 'secret-redacted' WHERE option_name = 'blogname'");
}, $source_commit);
$firewall_probes[] = farmtree_firewall_probe('delete', static function () use ($wpdb) {
    $wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name = 'blogname'");
}, $source_commit);
$firewall_probes[] = farmtree_firewall_probe('replace', static function () use ($wpdb) {
    $wpdb->query("REPLACE INTO {$wpdb->options} (option_name, option_value, autoload) VALUES ('farmtree_firewall_replace', 'secret-redacted', 'no')");
}, $source_commit);
$firewall_probes[] = farmtree_firewall_probe('update-option', static function () {
    update_option('farmtree_firewall_update_option', 'secret-redacted');
}, $source_commit);
$firewall_probes[] = farmtree_firewall_probe('insert-post', static function () {
    wp_insert_post(['post_title' => 'Firewall test', 'post_status' => 'draft']);
}, $source_commit);
$firewall_probes[] = farmtree_firewall_probe('update-post-meta', static function () {
    update_post_meta(1, 'farmtree_firewall_meta', 'secret-redacted');
}, $source_commit);
$phases[] = farmtree_probe_phase('plugin-activation', static function () {
    $result = activate_plugin('farmtree-content/farmtree-content.php');
    if (is_wp_error($result)) {
        throw new RuntimeException($result->get_error_message());
    }
    return get_option('active_plugins');
});
$phases[] = farmtree_probe_phase('plugin-deactivation', static function () {
    deactivate_plugins('farmtree-content/farmtree-content.php', false, false);
    return get_option('active_plugins');
});

$payload = [
    'wordpress' => get_bloginfo('version'),
    'php' => PHP_VERSION,
    'optionsTable' => $wpdb->options,
    'commands' => WP_CLI::$commands,
    'phases' => $phases,
    'rewriteRegression' => $rewrite_regression,
    'firewallProbes' => $firewall_probes,
];
file_put_contents('/farmtree-output/result.json', wp_json_encode($payload, JSON_UNESCAPED_SLASHES));
`;

const temporaryRoot = await mkdtemp(resolve(tmpdir(), 'farmtree-side-effects-'));
const blueprintPath = resolve(temporaryRoot, 'blueprint.json');
const resultPath = resolve(temporaryRoot, 'result.json');

try {
  await writeFile(blueprintPath, JSON.stringify({
    $schema: 'https://playground.wordpress.net/blueprint-schema.json',
    preferredVersions: { php: '8.1', wp: '7.1' },
    steps: [{ step: 'runPHP', code: phpHarness }]
  }));

  const run = spawnSync(playground, [
    'run-blueprint',
    '--blueprint', blueprintPath,
    '--php', '8.1',
    '--wp', '7.1',
    '--mount-dir', pluginRoot, '/wordpress/wp-content/plugins/farmtree-content',
    '--mount-dir', themeRoot, '/wordpress/wp-content/themes/farmtree-native',
    '--mount-dir', temporaryRoot, '/farmtree-output',
    '--verbosity', 'quiet'
  ], {
    cwd: repositoryRoot,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
    timeout: 180_000
  });

  if (run.error || run.status !== 0) {
    let fatal = '';
    try {
      fatal = await readFile(resolve(temporaryRoot, 'fatal.json'), 'utf8');
    } catch {
      fatal = '';
    }
    fail('Disposable WordPress side-effect probe failed to execute.', [
      run.error?.message ?? `exit ${run.status}`,
      fatal ? `PHP fatal: ${fatal}` : 'No PHP fatal detail file was produced.',
      run.stderr.trim() || run.stdout.trim() || 'No process output.'
    ]);
  }

  const result = JSON.parse(await readFile(resultPath, 'utf8'));
  if (result.commands?.['farmtree content'] !== 'FarmTree_Content_CLI_Command') {
    fail('WP-CLI command registration did not match the audited command class.');
  }

  const phases = Object.fromEntries(result.phases.map((phase) => [phase.name, phase]));
  for (const name of [
    'plugin-load-and-cli-registration',
    'model-registration',
    'reconciler-construction',
    'build-plan',
    'cli-dry-run'
  ]) {
    if (!phases[name]) fail(`Disposable WordPress probe omitted phase ${name}.`);
    assertPurePhase(phases[name]);
  }

  const activationOptions = assertLifecyclePhase(phases['plugin-activation'], ['active_plugins']);
  const deactivationOptions = assertLifecyclePhase(phases['plugin-deactivation'], ['active_plugins', 'recently_activated']);
  assertExactLifecycleTransitions(phases['plugin-activation'], phases['plugin-deactivation']);
  if (!activationOptions.includes('active_plugins') || !deactivationOptions.includes('active_plugins')) {
    fail('Actual WordPress activation/deactivation did not exercise active_plugins bookkeeping.');
  }

  for (const phase of result.phases) {
    const before = phase.before.options.rewrite_rules?.sha256 ?? null;
    const after = phase.after.options.rewrite_rules?.sha256 ?? null;
    if (before !== after) fail(`rewrite_rules changed during non-apply phase ${phase.name}.`);
  }

  const dryRun = phases['cli-dry-run'].value;
  if (!dryRun || dryRun.mode !== 'dry-run' || dryRun.summary?.conflict !== 0) {
    fail('The real CLI dry run did not complete conflict-free.', [
      JSON.stringify(dryRun?.summary ?? null),
      JSON.stringify(dryRun?.conflicts ?? null),
      JSON.stringify(dryRun?.operations?.options ?? null)
    ]);
  }
  const builtPlan = phases['build-plan'].value;
  if (!/^[0-9a-f]{64}$/.test(String(builtPlan?.plan_digest ?? '')) ||
      builtPlan.plan_digest !== dryRun.plan_digest ||
      JSON.stringify(builtPlan.summary) !== JSON.stringify(dryRun.summary)) {
    fail('Repeated planning against identical runtime state was not deterministic.', [
      `build-plan digest: ${String(builtPlan?.plan_digest ?? '')}`,
      `CLI dry-run digest: ${String(dryRun.plan_digest ?? '')}`
    ]);
  }
  const expectedSummary = { create: 90, update: 1, unchanged: 2, conflict: 0, skipped: 1 };
  if (JSON.stringify(dryRun.summary) !== JSON.stringify(expectedSummary)) {
    fail('The real CLI dry-run summary changed unexpectedly.', [JSON.stringify(dryRun.summary)]);
  }
  const rewriteOperation = dryRun.operations.options.find(({ key }) => key === 'rewrite-rules');
  const expectedCanonicalRules = {
    customer_segment: {
      'customer-segments/([^/]+)(?:/([0-9]+))?/?$': 'index.php?customer_segment=$matches[1]&page=$matches[2]'
    },
    proof_story: {
      'proof-stories/([^/]+)(?:/([0-9]+))?/?$': 'index.php?proof_story=$matches[1]&page=$matches[2]'
    }
  };
  if (rewriteOperation?.action !== 'update' ||
      JSON.stringify(rewriteOperation.desired?.required_canonical_rules) !== JSON.stringify(expectedCanonicalRules)) {
    fail('The dry run did not disclose both exact canonical FarmTree single-route rules.');
  }
  const requiredRewriteRuleCounts = Object.fromEntries(
    Object.entries(rewriteOperation.desired.required_farmtree_rules)
      .map(([postType, rules]) => [postType, Object.keys(rules).length])
  );

  const rewriteRegression = result.rewriteRegression;
  const expectedRewriteRegression = {
    operation: 'update',
    managedRuleCount: 34,
    unrelatedPreserved: true,
    unrelatedOrderPreserved: true,
    runtimeOnlyRuleCount: 18,
    runtimeOnlyAdoptedCount: 0,
    runtimeOnlyReportedCount: 18,
    persistedExactTarget: true,
    optionIdentityPreserved: true,
    optionAutoloadPreserved: true,
    afterAction: 'unchanged',
    spLoginPreservedWhenStored: true,
    ambiguousReason: 'farmtree_rewrite_anchors_ambiguous',
    shadowReason: 'canonical_farmtree_rule_shadowed',
    identityReason: 'preexisting_farmtree_namespace_collision'
  };
  for (const [key, expected] of Object.entries(expectedRewriteRegression)) {
    if (rewriteRegression?.[key] !== expected) {
      fail(`FarmTree-only rewrite regression failed for ${key}.`, [
        `expected: ${JSON.stringify(expected)}`,
        `actual: ${JSON.stringify(rewriteRegression?.[key])}`
      ]);
    }
  }
  if (rewriteRegression?.finalizerResult?.status !== 'updated' ||
      rewriteRegression?.planSummary?.conflict !== 0) {
    fail('FarmTree-only rewrite finalization did not converge safely.', [JSON.stringify(rewriteRegression)]);
  }

  const firewallProbes = Object.fromEntries(
    result.firewallProbes.map((probe) => [probe.name, probe])
  );
  const expectedFirewallOperations = {
    insert: 'INSERT',
    update: 'UPDATE',
    delete: 'DELETE',
    replace: 'REPLACE',
    'update-option': 'INSERT',
    'insert-post': 'INSERT',
    'update-post-meta': 'INSERT'
  };
  for (const [name, probe] of Object.entries(firewallProbes)) {
    const optionChanges = changedKeys(probe.before.options, probe.after.options);
    const tableChanges = changedKeys(probe.before.tables, probe.after.tables);
    const fileChanges = changedKeys(probe.before.files, probe.after.files);
    if (optionChanges.length > 0 || tableChanges.length > 0 || fileChanges.length > 0) {
      fail(`SQL firewall probe ${name} changed persistent state.`, [
        `options: ${optionChanges.join(', ') || 'none'}`,
        `tables: ${tableChanges.join(', ') || 'none'}`,
        `files: ${fileChanges.join(', ') || 'none'}`
      ]);
    }
    if (name === 'select') {
      if (probe.attemptedWriteQueries.length !== 0 || probe.result?.payload?.summary?.conflict !== 0) {
        fail('SQL firewall rejected a SELECT or changed the dry-run plan.', [JSON.stringify(probe.result)]);
      }
      continue;
    }
    const attempt = probe.result?.payload?.write_attempt;
    if (probe.result?.payload?.error !== 'dry_run_sql_write_blocked' ||
        attempt?.operation !== expectedFirewallOperations[name] ||
        !/^[0-9a-f]{64}$/.test(String(attempt?.sha256 ?? '')) ||
        typeof attempt?.redacted_fingerprint !== 'string' ||
        attempt.redacted_fingerprint.includes('secret-redacted') ||
        typeof attempt?.caller_classification !== 'string' ||
        typeof attempt?.stack_origin !== 'string' ||
        probe.attemptedWriteQueries.length !== 1) {
      fail(`SQL firewall did not safely block ${name} before execution.`, [JSON.stringify(probe.result)]);
    }
  }

  console.log(JSON.stringify({
    ok: true,
    wordpress: result.wordpress,
    php: result.php,
    purePhases: 5,
    databaseTablesCaptured: Object.keys(phases['build-plan'].before.tables).length + 1,
    lifecycleTransition: 'exact_single_plugin_identity',
    activationOptionChanges: activationOptions,
    deactivationOptionChanges: deactivationOptions,
    farmtreeWriteQueriesOutsideApply: 0,
    filesystemChangesOutsideApply: 0,
    rewriteRulesChangesOutsideApply: 0,
    rewriteRegression: {
      managedRuleCount: rewriteRegression.managedRuleCount,
      unrelatedRulesAndOrderPreserved: true,
      runtimeOnlyRulesNotAdopted: rewriteRegression.runtimeOnlyReportedCount,
      exactMergedTargetPersisted: true,
      ambiguousAnchorsConflict: true,
      routeShadowingConflict: true,
      foreignCanonicalIdentityConflict: true
    },
    sqlFirewall: {
      selectAllowed: true,
      blockedBeforeExecution: Object.keys(expectedFirewallOperations),
      persistentChanges: 0,
      redactedEvidence: true
    },
    dryRun: {
      summary: dryRun.summary,
      planDigest: dryRun.plan_digest,
      rewriteOperation: rewriteOperation.action,
      requiredRewriteRuleCounts,
      canonicalSingleRoutes: 2
    }
  }, null, 2));
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
