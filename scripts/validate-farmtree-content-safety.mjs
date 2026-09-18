import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const repositoryRoot = resolve(import.meta.dirname, '..');
const releaseClassificationPath = resolve(
  repositoryRoot,
  'config/farmtree-native-release-files.json'
);
const pluginPrefix = 'wordpress/wp-content/plugins/farmtree-content/';
const mainPath = `${pluginPrefix}farmtree-content.php`;
const cliPath = `${pluginPrefix}includes/class-farmtree-content-cli-command.php`;
const reconcilerPath = `${pluginPrefix}includes/class-farmtree-content-reconciler.php`;
const managedManifestPath = `${pluginPrefix}includes/managed-content-manifest.php`;
const exactPluginRuntime = [mainPath, cliPath, reconcilerPath, managedManifestPath].sort();
const auditedRuntimeSourceSha256 = '7dc0f1a3bf9f1192b4ebc2b2590b06f1f2160a0249937b59d10df6b38d67332a';

function fail(message, details = []) {
  const suffix = details.length === 0
    ? ''
    : `\n${details.map((detail) => `  - ${detail}`).join('\n')}`;
  throw new Error(`${message}${suffix}`);
}

function arraysEqual(left, right) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function lineNumber(source, index) {
  return source.slice(0, index).split('\n').length;
}

/**
 * Mask PHP comments and string bodies while preserving byte offsets/newlines.
 * Backtick strings are counted separately because they execute a shell in PHP.
 */
function maskPhpNonCode(source, sourceName) {
  const masked = [...source];
  let state = 'code';
  let heredocLabel = '';
  let backtickCount = 0;

  const blank = (index) => {
    if (masked[index] !== '\n' && masked[index] !== '\r') {
      masked[index] = ' ';
    }
  };
  const blankRange = (start, end) => {
    for (let index = start; index < end; index += 1) {
      blank(index);
    }
  };

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    const next = source[index + 1] ?? '';

    if (state === 'heredoc') {
      const atLineStart = index === 0 || source[index - 1] === '\n';
      if (!atLineStart) {
        blank(index);
        continue;
      }
      const lineEnd = source.indexOf('\n', index);
      const end = lineEnd === -1 ? source.length : lineEnd;
      const line = source.slice(index, end).replace(/\r$/, '');
      const terminator = new RegExp(`^[\\t ]*${escapeRegex(heredocLabel)};?[\\t ]*$`);
      blankRange(index, end);
      if (terminator.test(line)) {
        state = 'code';
        heredocLabel = '';
      }
      index = end - 1;
      continue;
    }

    if (state === 'line-comment') {
      blank(index);
      if (character === '\n') {
        state = 'code';
      }
      continue;
    }

    if (state === 'block-comment') {
      blank(index);
      if (character === '*' && next === '/') {
        blank(index + 1);
        index += 1;
        state = 'code';
      }
      continue;
    }

    if (state === 'single-quote' || state === 'double-quote' || state === 'backtick') {
      blank(index);
      if (character === '\\') {
        if (index + 1 < source.length) {
          blank(index + 1);
          index += 1;
        }
        continue;
      }
      const delimiter = state === 'single-quote' ? "'" : state === 'double-quote' ? '"' : '`';
      if (character === delimiter) {
        state = 'code';
      }
      continue;
    }

    if (character === '/' && next === '/') {
      blank(index);
      blank(index + 1);
      index += 1;
      state = 'line-comment';
      continue;
    }
    if (character === '/' && next === '*') {
      blank(index);
      blank(index + 1);
      index += 1;
      state = 'block-comment';
      continue;
    }
    if (character === '#' && next !== '[') {
      blank(index);
      state = 'line-comment';
      continue;
    }
    if (source.startsWith('<<<', index)) {
      const lineEnd = source.indexOf('\n', index);
      const end = lineEnd === -1 ? source.length : lineEnd;
      const declaration = source.slice(index, end).match(
        /^<<<[\t ]*(?:'([A-Za-z_][A-Za-z0-9_]*)'|"([A-Za-z_][A-Za-z0-9_]*)"|([A-Za-z_][A-Za-z0-9_]*))/
      );
      if (!declaration) {
        fail(`Could not safely parse a heredoc declaration in ${sourceName}.`, [
          `line ${lineNumber(source, index)}`
        ]);
      }
      heredocLabel = declaration[1] ?? declaration[2] ?? declaration[3];
      blankRange(index, end);
      index = end - 1;
      state = 'heredoc';
      continue;
    }
    if (character === "'") {
      blank(index);
      state = 'single-quote';
      continue;
    }
    if (character === '"') {
      blank(index);
      state = 'double-quote';
      continue;
    }
    if (character === '`') {
      blank(index);
      backtickCount += 1;
      state = 'backtick';
    }
  }

  if (state !== 'code' && state !== 'line-comment') {
    fail(`Unterminated PHP lexical construct in ${sourceName}.`, [state]);
  }

  return { masked: masked.join(''), backtickCount };
}

function matchingDelimiter(source, openIndex, openCharacter, closeCharacter) {
  let depth = 0;
  for (let index = openIndex; index < source.length; index += 1) {
    if (source[index] === openCharacter) {
      depth += 1;
    } else if (source[index] === closeCharacter) {
      depth -= 1;
      if (depth === 0) {
        return index;
      }
    }
  }
  return -1;
}

function extractFunctions(file) {
  const functions = [];
  const declaration = /\b(?:(public|private|protected)\s+)?(?:(?:final|abstract|static)\s+)*function\s+&?\s*([A-Za-z_][A-Za-z0-9_]*)\s*\(/g;
  let match;

  while ((match = declaration.exec(file.masked)) !== null) {
    const parametersStart = file.masked.indexOf('(', match.index);
    const parametersEnd = matchingDelimiter(file.masked, parametersStart, '(', ')');
    if (parametersEnd === -1) {
      fail(`Could not parse function parameters in ${file.path}.`, [
        `${match[2]} at line ${lineNumber(file.source, match.index)}`
      ]);
    }
    let bodyStart = parametersEnd + 1;
    while (bodyStart < file.masked.length && file.masked[bodyStart] !== '{' && file.masked[bodyStart] !== ';') {
      bodyStart += 1;
    }
    if (file.masked[bodyStart] !== '{') {
      continue;
    }
    const bodyEnd = matchingDelimiter(file.masked, bodyStart, '{', '}');
    if (bodyEnd === -1) {
      fail(`Could not parse function body in ${file.path}.`, [
        `${match[2]} at line ${lineNumber(file.source, match.index)}`
      ]);
    }
    functions.push({
      name: match[2],
      visibility: match[1] ?? '',
      declarationStart: match.index,
      bodyStart: bodyStart + 1,
      bodyEnd,
      line: lineNumber(file.source, match.index),
      file
    });
    declaration.lastIndex = bodyStart + 1;
  }

  return functions;
}

function functionNamed(file, name) {
  const matches = file.functions.filter((item) => item.name === name);
  if (matches.length !== 1) {
    fail(`Expected exactly one ${name}() declaration in ${file.path}.`, [
      `found ${matches.length}`
    ]);
  }
  return matches[0];
}

function enclosingFunction(file, index) {
  const matches = file.functions.filter((item) => index >= item.bodyStart && index < item.bodyEnd);
  if (matches.length === 0) {
    return null;
  }
  return matches.reduce((smallest, item) => {
    const size = item.bodyEnd - item.bodyStart;
    const smallestSize = smallest.bodyEnd - smallest.bodyStart;
    return size < smallestSize ? item : smallest;
  });
}

function findCalls(file, callable) {
  const expression = new RegExp(`\\b${escapeRegex(callable)}\\s*\\(`, 'g');
  const calls = [];
  let match;
  while ((match = expression.exec(file.masked)) !== null) {
    calls.push({
      callable,
      index: match.index,
      line: lineNumber(file.source, match.index),
      method: enclosingFunction(file, match.index)?.name ?? '<top-level>',
      file: file.path
    });
  }
  return calls;
}

function findCallsAcross(files, callable) {
  return files.flatMap((file) => findCalls(file, callable));
}

function rawCall(file, index) {
  const open = file.masked.indexOf('(', index);
  const close = matchingDelimiter(file.masked, open, '(', ')');
  if (open === -1 || close === -1) {
    fail(`Could not parse callable in ${file.path}.`, [
      `line ${lineNumber(file.source, index)}`
    ]);
  }
  return file.source.slice(index, close + 1).replace(/\s+/g, ' ').trim();
}

function assertCallSpecification(files, callable, specification) {
  const calls = findCallsAcross(files, callable);
  if (calls.length !== specification.count) {
    fail(`Unexpected ${callable}() call count in deployable farmtree-content runtime.`, [
      `expected ${specification.count}`,
      `found ${calls.length}`,
      ...calls.map((call) => `${call.file}:${call.line} (${call.method})`)
    ]);
  }
  for (const call of calls) {
    if (call.file !== reconcilerPath || !specification.methods.includes(call.method)) {
      fail(`${callable}() is outside its exact reconciler APPLY-only method allowlist.`, [
        `${call.file}:${call.line} (${call.method})`,
        `allowed methods: ${specification.methods.join(', ') || 'none'}`
      ]);
    }
  }
  return calls;
}

function methodCalls(record) {
  const body = record.file.masked.slice(record.bodyStart, record.bodyEnd);
  const expression = /\$this\s*->\s*([A-Za-z_][A-Za-z0-9_]*)\s*\(/g;
  const calls = [];
  let match;
  while ((match = expression.exec(body)) !== null) {
    calls.push(match[1]);
  }
  return calls;
}

function reachableMethods(adjacency, start) {
  const visited = new Set();
  const pending = [start];
  while (pending.length > 0) {
    const method = pending.pop();
    if (visited.has(method)) {
      continue;
    }
    visited.add(method);
    for (const dependency of adjacency.get(method) ?? []) {
      pending.push(dependency);
    }
  }
  return visited;
}

function assertNoUnsafeBodyCalls(record, unsafeCallables, label) {
  const problems = [];
  for (const callable of unsafeCallables) {
    const expression = new RegExp(`\\b${escapeRegex(callable)}\\s*\\(`, 'g');
    if (expression.test(record.file.masked.slice(record.bodyStart, record.bodyEnd))) {
      problems.push(callable);
    }
  }
  const body = record.file.masked.slice(record.bodyStart, record.bodyEnd);
  if (/\$wpdb\s*->\s*(?:insert|update|delete|replace|query)\s*\(/.test(body)) {
    problems.push('$wpdb mutation/query');
  }
  if (problems.length > 0) {
    fail(`${label} is not statically read-only.`, [
      `${record.file.path}:${record.line} (${record.name})`,
      ...problems
    ]);
  }
}

function assertOnlyNamedCalls(record, allowedCalls, label) {
  const body = record.file.masked.slice(record.bodyStart, record.bodyEnd);
  const allowed = new Set(allowedCalls);
  const ignoredLanguageConstructs = new Set([
    'if', 'isset', 'empty', 'array', 'echo', 'print', 'list', 'match'
  ]);
  const unexpected = [];
  for (const match of body.matchAll(/\b([A-Za-z_][A-Za-z0-9_]*)\s*\(/g)) {
    const before = body.slice(Math.max(0, match.index - 4), match.index);
    if (/(?:->|::)\s*$/.test(before) || ignoredLanguageConstructs.has(match[1])) {
      continue;
    }
    if (!allowed.has(match[1])) {
      unexpected.push(match[1]);
    }
  }
  if (unexpected.length > 0) {
    fail(`${label} contains an unreviewed callable.`, [
      `${record.file.path}:${record.line} (${record.name})`,
      ...unexpected
    ]);
  }
}

const releaseClassification = JSON.parse(readFileSync(releaseClassificationPath, 'utf8'));
if (!Array.isArray(releaseClassification.runtime)) {
  fail('Release classification has no runtime array.');
}
const classifiedPluginRuntime = releaseClassification.runtime
  .filter((path) => path.startsWith(pluginPrefix))
  .sort();
if (!arraysEqual(classifiedPluginRuntime, exactPluginRuntime)) {
  fail('Deployable farmtree-content runtime is not the exact audited four-file set.', [
    ...exactPluginRuntime.filter((path) => !classifiedPluginRuntime.includes(path)).map((path) => `missing: ${path}`),
    ...classifiedPluginRuntime.filter((path) => !exactPluginRuntime.includes(path)).map((path) => `unexpected: ${path}`)
  ]);
}

const files = exactPluginRuntime.map((path) => {
  const source = readFileSync(resolve(repositoryRoot, path), 'utf8');
  const lexical = maskPhpNonCode(source, path);
  if (lexical.backtickCount !== 0) {
    fail(`Shell-executing PHP backticks are forbidden in ${path}.`);
  }
  const file = { path, source, masked: lexical.masked, functions: [] };
  file.functions = extractFunctions(file);
  return file;
});
const runtimeSourceSha256 = createHash('sha256').update(
  files.map((file) => `${file.path}\0${file.source}`).join('\0')
).digest('hex');
if (runtimeSourceSha256 !== auditedRuntimeSourceSha256) {
  fail('Deployable farmtree-content source changed outside the exact audited source seal.', [
    `expected ${auditedRuntimeSourceSha256}`,
    `actual ${runtimeSourceSha256}`
  ]);
}
const filesByPath = new Map(files.map((file) => [file.path, file]));
const mainFile = filesByPath.get(mainPath);
const cliFile = filesByPath.get(cliPath);
const reconcilerFile = filesByPath.get(reconcilerPath);
const managedManifestFile = filesByPath.get(managedManifestPath);

const requestedSpecifications = {
  update_option: { count: 3, methods: ['apply_front_page', 'finalize_rewrite_rules'] },
  add_option: { count: 0, methods: [] },
  delete_option: { count: 0, methods: [] },
  set_transient: { count: 0, methods: [] },
  delete_transient: { count: 0, methods: [] },
  wp_insert_post: { count: 1, methods: ['apply_entity'] },
  wp_update_post: { count: 2, methods: ['apply_asset', 'apply_entity'] },
  wp_delete_post: { count: 0, methods: [] },
  update_post_meta: { count: 4, methods: ['apply_asset', 'write_post_meta'] },
  add_post_meta: { count: 0, methods: [] },
  delete_post_meta: { count: 0, methods: [] },
  wp_set_object_terms: { count: 0, methods: [] },
  wp_insert_term: { count: 1, methods: ['apply_term'] },
  wp_update_term: { count: 1, methods: ['apply_term'] },
  wp_delete_term: { count: 0, methods: [] },
  wp_schedule_event: { count: 0, methods: [] },
  wp_schedule_single_event: { count: 0, methods: [] },
  wp_clear_scheduled_hook: { count: 0, methods: [] },
  flush_rewrite_rules: { count: 0, methods: [] },
  file_put_contents: { count: 0, methods: [] },
  fwrite: { count: 0, methods: [] },
  unlink: { count: 0, methods: [] },
  rename: { count: 0, methods: [] },
  copy: { count: 0, methods: [] },
  mkdir: { count: 0, methods: [] },
  rmdir: { count: 0, methods: [] }
};

const additionalSpecifications = {
  update_site_option: { count: 0, methods: [] },
  add_site_option: { count: 0, methods: [] },
  delete_site_option: { count: 0, methods: [] },
  update_network_option: { count: 0, methods: [] },
  add_network_option: { count: 0, methods: [] },
  delete_network_option: { count: 0, methods: [] },
  set_site_transient: { count: 0, methods: [] },
  delete_site_transient: { count: 0, methods: [] },
  update_metadata: { count: 0, methods: [] },
  add_metadata: { count: 0, methods: [] },
  delete_metadata: { count: 0, methods: [] },
  update_term_meta: { count: 1, methods: ['write_term_meta'] },
  add_term_meta: { count: 0, methods: [] },
  delete_term_meta: { count: 0, methods: [] },
  wp_insert_attachment: { count: 1, methods: ['apply_asset'] },
  wp_update_attachment_metadata: { count: 1, methods: ['apply_asset'] },
  wp_delete_attachment: { count: 0, methods: [] },
  wp_publish_post: { count: 0, methods: [] },
  wp_transition_post_status: { count: 0, methods: [] },
  wp_insert_comment: { count: 0, methods: [] },
  wp_update_comment: { count: 0, methods: [] },
  wp_delete_comment: { count: 0, methods: [] },
  wp_set_comment_status: { count: 0, methods: [] },
  wp_save_post_revision: { count: 1, methods: ['capture_pre_update_revision'] },
  wp_trash_post: { count: 0, methods: [] },
  wp_untrash_post: { count: 0, methods: [] },
  wp_insert_user: { count: 0, methods: [] },
  wp_create_user: { count: 0, methods: [] },
  wp_update_user: { count: 0, methods: [] },
  wp_delete_user: { count: 0, methods: [] },
  update_user_meta: { count: 0, methods: [] },
  add_user_meta: { count: 0, methods: [] },
  delete_user_meta: { count: 0, methods: [] },
  wp_create_nav_menu: { count: 0, methods: [] },
  wp_update_nav_menu_item: { count: 0, methods: [] },
  wp_delete_nav_menu: { count: 0, methods: [] },
  set_post_thumbnail: { count: 1, methods: ['apply_relationships'] },
  delete_post_thumbnail: { count: 1, methods: ['apply_relationships'] },
  wp_set_post_categories: { count: 1, methods: ['apply_relationships'] },
  wp_set_post_terms: { count: 0, methods: [] },
  set_theme_mod: { count: 0, methods: [] },
  remove_theme_mod: { count: 0, methods: [] },
  remove_theme_mods: { count: 0, methods: [] },
  switch_theme: { count: 0, methods: [] },
  activate_plugin: { count: 0, methods: [] },
  deactivate_plugins: { count: 0, methods: [] },
  wp_rewrite_rules: { count: 0, methods: [] },
  wp_upload_bits: { count: 1, methods: ['apply_asset'] },
  wp_generate_attachment_metadata: { count: 1, methods: ['apply_asset'] },
  wp_delete_file: { count: 1, methods: ['cleanup_created_files'] },
  clean_post_cache: {
    count: 2,
    methods: ['lock_and_refresh_reconciliation_state', 'invalidate_caches_after_rollback']
  },
  clean_term_cache: {
    count: 2,
    methods: ['lock_and_refresh_reconciliation_state', 'invalidate_caches_after_rollback']
  },
  wp_cache_delete: {
    count: 8,
    methods: ['lock_and_refresh_reconciliation_state', 'invalidate_caches_after_rollback']
  },
  wp_cache_set_terms_last_changed: { count: 1, methods: ['invalidate_term_query_generation'] },
  wp_cache_set: { count: 1, methods: ['invalidate_term_query_generation'] },
  wp_cache_flush: { count: 1, methods: ['invalidate_caches_after_rollback'] }
};

const requestedCounts = {};
for (const [callable, specification] of Object.entries(requestedSpecifications)) {
  requestedCounts[callable] = assertCallSpecification(files, callable, specification).length;
}
const additionalCounts = {};
for (const [callable, specification] of Object.entries(additionalSpecifications)) {
  additionalCounts[callable] = assertCallSpecification(files, callable, specification).length;
}

const allWriteCallables = new Set([
  ...Object.keys(requestedSpecifications),
  ...Object.keys(additionalSpecifications)
]);

// Instantiating or invoking WP_Rewrite directly bypasses the reviewed global
// generator used only to derive FarmTree-owned identities and anchors.
for (const file of files) {
  if (/(?<!\$)\bWP_Rewrite\b/i.test(file.masked)) {
    fail(`Direct WP_Rewrite use is forbidden in ${file.path}.`);
  }
}
const wpRewriteGeneratorCalls = [];
for (const file of files) {
  for (const match of file.masked.matchAll(/\$(wp_rewrite|generator)\s*->\s*([A-Za-z_][A-Za-z0-9_]*)\s*\(/g)) {
    wpRewriteGeneratorCalls.push({
      object: match[1],
      file: file.path,
      line: lineNumber(file.source, match.index),
      method: enclosingFunction(file, match.index)?.name ?? '<top-level>',
      callable: match[2]
    });
  }
}
const rewriteCallInventory = wpRewriteGeneratorCalls.map(({ object, file, method, callable }) =>
  `${object}|${file}|${method}|${callable}`).sort();
const expectedRewriteCallInventory = [
  `generator|${reconcilerPath}|generate_permastruct_rules_read_only|generate_rewrite_rules`,
  `generator|${reconcilerPath}|generate_permastruct_rules_read_only|generate_rewrite_rules`,
  `generator|${reconcilerPath}|generate_permastruct_rules_read_only|generate_rewrite_rules`,
  `generator|${reconcilerPath}|generate_rewrite_rules_read_only|rewrite_rules`,
  `wp_rewrite|${reconcilerPath}|plan_rewrite_rules|using_permalinks`
].sort();
if (!arraysEqual(rewriteCallInventory, expectedRewriteCallInventory)) {
  fail('The rewrite-object call inventory drifted from its read-only plan generators.', [
    `expected: ${expectedRewriteCallInventory.join(' | ')}`,
    `actual: ${rewriteCallInventory.join(' | ')}`
  ]);
}

const nativeFilesystemWriters = [
  'fopen', 'fputs', 'fprintf', 'touch', 'chmod', 'chown', 'chgrp', 'symlink', 'link',
  'move_uploaded_file', 'tempnam'
];
const shellOrDynamicCallables = [
  'exec', 'shell_exec', 'system', 'passthru', 'proc_open', 'popen', 'pcntl_exec',
  'call_user_func', 'call_user_func_array', 'forward_static_call',
  'forward_static_call_array', 'eval', 'mysqli_query', 'mysql_query', 'pg_query'
];
for (const callable of [...nativeFilesystemWriters, ...shellOrDynamicCallables]) {
  const calls = findCallsAcross(files, callable);
  if (calls.length > 0) {
    fail(`${callable}() is forbidden in deployable farmtree-content runtime.`,
      calls.map((call) => `${call.file}:${call.line} (${call.method})`));
  }
}
for (const file of files) {
  if (/\b(?:include|include_once)\b/.test(file.masked)) {
    fail(`PHP include paths are forbidden in ${file.path}; reviewed require paths must be explicit.`);
  }
  if (/\bnew\s+Reflection(?:Function|Method|Class|Object)\b/.test(file.masked)) {
    fail(`Reflection-based dynamic invocation is forbidden in ${file.path}.`);
  }
  if (/\bnew\s+(?:PDO|mysqli)\b/.test(file.masked)) {
    fail(`Direct database clients are forbidden in ${file.path}.`);
  }
  if (/\bWP_Filesystem\b/.test(file.masked)
    || /\$wp_filesystem\s*->\s*(?:put_contents|delete|move|copy|mkdir|rmdir|chmod)\s*\(/.test(file.masked)) {
    fail(`Direct WP_Filesystem mutation is forbidden in ${file.path}.`);
  }
  if (/\bWP_CLI\s*::\s*runcommand\s*\(/.test(file.masked)) {
    fail(`Nested WP-CLI command execution is forbidden in ${file.path}.`);
  }
  if (/\$[A-Za-z_][A-Za-z0-9_]*[\t ]*\(/.test(file.masked)
    || /(?:->|::)[\t ]*\$[A-Za-z_][A-Za-z0-9_]*[\t ]*\(/.test(file.masked)
    || /(?:->|::)[\t ]*\{[\t ]*\$[A-Za-z_][A-Za-z0-9_]*[\t ]*\}[\t ]*\(/.test(file.masked)
    || /\bnew[\t ]+(?:\$|\{[\t ]*\$|\()/.test(file.masked)) {
    fail(`Dynamic PHP callable syntax is forbidden in ${file.path}.`);
  }
  if (/\$wpdb\s*->\s*(?:insert|update|delete|replace)\s*\(/.test(file.masked)) {
    fail(`Raw wpdb mutation helpers are forbidden in ${file.path}.`);
  }
}

// Every raw wpdb query must remain one of the four apply transaction controls.
const queryCalls = findCalls(reconcilerFile, 'query').filter((call) => {
  const prefix = reconcilerFile.masked.slice(Math.max(0, call.index - 24), call.index);
  return /\$wpdb\s*->\s*$/.test(prefix);
});
if (queryCalls.length !== 4 || queryCalls.some((call) => call.method !== 'apply_plan')) {
  fail('Raw wpdb query calls must be the four apply_plan transaction controls.',
    queryCalls.map((call) => `${call.file}:${call.line} (${call.method})`));
}
const applyPlan = functionNamed(reconcilerFile, 'apply_plan');
const applyPlanSource = reconcilerFile.source.slice(applyPlan.bodyStart, applyPlan.bodyEnd);
const expectedTransactionCalls = [
  "\$wpdb->query('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE')",
  "\$wpdb->query('BEGIN')",
  "\$wpdb->query('COMMIT')",
  "\$wpdb->query('ROLLBACK')"
].sort();
const actualTransactionCalls = queryCalls.map((call) => {
  const start = reconcilerFile.source.lastIndexOf('$wpdb', call.index);
  return rawCall(reconcilerFile, start);
}).sort();
if (!arraysEqual(actualTransactionCalls, expectedTransactionCalls)) {
  fail('apply_plan raw transaction query allowlist drifted.', [
    `expected: ${expectedTransactionCalls.join(' | ')}`,
    `actual: ${actualTransactionCalls.join(' | ')}`
  ]);
}
for (const file of files) {
  for (const match of file.masked.matchAll(/\$wpdb\s*->\s*(?:query|get_var|get_row|get_col|get_results)\s*\(/g)) {
    const open = file.masked.indexOf('(', match.index);
    const close = matchingDelimiter(file.masked, open, '(', ')');
    if (close === -1) {
      fail(`Could not parse wpdb query call in ${file.path}.`);
    }
    const rawCall = file.source.slice(match.index, close + 1);
    if (/\b(?:INSERT|UPDATE|DELETE|REPLACE|ALTER|CREATE|DROP|TRUNCATE|RENAME|GRANT|REVOKE|LOAD\s+DATA|CALL)\b/i.test(rawCall)) {
      fail(`Modifying SQL is forbidden outside reviewed WordPress APIs in ${file.path}.`, [
        `line ${lineNumber(file.source, match.index)}`
      ]);
    }
  }
}

// Main-file top-level execution is an exact read-only registration/bootstrap set.
const mainTopLevelCharacters = [...mainFile.masked];
for (const record of mainFile.functions) {
  for (let index = record.declarationStart; index <= record.bodyEnd; index += 1) {
    if (mainTopLevelCharacters[index] !== '\n' && mainTopLevelCharacters[index] !== '\r') {
      mainTopLevelCharacters[index] = ' ';
    }
  }
}
const mainTopLevel = mainTopLevelCharacters.join('');
const allowedTopLevelCalls = new Set([
  'defined', 'define', 'plugin_dir_path', 'add_action'
]);
const languageConstructs = new Set(['if', 'isset', 'empty', 'array']);
const topLevelCalls = [];
for (const match of mainTopLevel.matchAll(/\b([A-Za-z_][A-Za-z0-9_]*)\s*\(/g)) {
  const before = mainTopLevel.slice(Math.max(0, match.index - 4), match.index);
  if (/(?:->|::)\s*$/.test(before) || languageConstructs.has(match[1])) {
    continue;
  }
  topLevelCalls.push(match[1]);
}
for (const call of topLevelCalls) {
  if (!allowedTopLevelCalls.has(call)) {
    fail(`Unexpected top-level callable in ${mainPath}.`, [call]);
  }
}
const cliRegistrations = [...mainTopLevel.matchAll(/\bWP_CLI\s*::\s*add_command\s*\(/g)];
if (cliRegistrations.length !== 1
  || rawCall(mainFile, cliRegistrations[0].index)
    !== "WP_CLI::add_command('farmtree content', 'FarmTree_Content_CLI_Command')") {
  fail('WP-CLI command registration must remain the one exact read-only class registration.');
}
const topLevelMemberCalls = [...mainTopLevel.matchAll(
  /(?:\b[A-Za-z_][A-Za-z0-9_]*|\$[A-Za-z_][A-Za-z0-9_]*)\s*(?:::|->)\s*[A-Za-z_][A-Za-z0-9_]*\s*\(/g
)];
if (topLevelMemberCalls.length !== 1
  || !/^WP_CLI\s*::\s*add_command\s*\(/.test(topLevelMemberCalls[0][0])) {
  fail('Main plugin load may perform only the reviewed WP-CLI class registration.',
    topLevelMemberCalls.map((match) =>
      `${mainPath}:${lineNumber(mainFile.source, match.index)} (${match[0].trim()})`));
}
const expectedHookRegistrations = [
  "add_action('init', 'farmtree_content_register_customer_segments')",
  "add_action('init', 'farmtree_content_register_proof_stories')",
  "add_action('template_redirect', 'farmtree_content_redirect_legacy_proof_story_paths', 1)"
].sort();
const actualHookRegistrations = findCalls(mainFile, 'add_action')
  .filter((call) => call.method === '<top-level>')
  .map((call) => rawCall(mainFile, call.index))
  .sort();
if (!arraysEqual(actualHookRegistrations, expectedHookRegistrations)) {
  fail('Main plugin hook registration allowlist drifted.', [
    `expected: ${expectedHookRegistrations.join(' | ')}`,
    `actual: ${actualHookRegistrations.join(' | ')}`
  ]);
}
const mainRequires = [...mainTopLevel.matchAll(/\brequire_once\b/g)];
if (mainRequires.length !== 2
  || !mainFile.source.includes("require_once FARMTREE_CONTENT_DIR . 'includes/class-farmtree-content-reconciler.php';")
  || !mainFile.source.includes("require_once FARMTREE_CONTENT_DIR . 'includes/class-farmtree-content-cli-command.php';")) {
  fail('Main plugin file must require only the two reviewed WP-CLI classes.');
}
const reviewedRequireCounts = {
  [mainPath]: 2,
  [cliPath]: 0,
  [reconcilerPath]: 2,
  [managedManifestPath]: 0
};
for (const file of files) {
  const requireCount = [...file.masked.matchAll(/\brequire(?:_once)?\b/g)].length;
  if (requireCount !== reviewedRequireCounts[file.path]) {
    fail(`Reviewed PHP require allowlist drifted in ${file.path}.`, [
      `expected ${reviewedRequireCounts[file.path]}`,
      `found ${requireCount}`
    ]);
  }
}
if (!reconcilerFile.source.includes('$manifest = require $file;')
  || !reconcilerFile.source.includes("require_once ABSPATH . 'wp-admin/includes/image.php';")) {
  fail('Reconciler may require only its validated manifest and WordPress image API.');
}
for (const file of [cliFile, reconcilerFile]) {
  const topLevelCharacters = [...file.masked];
  for (const record of file.functions) {
    for (let index = record.declarationStart; index <= record.bodyEnd; index += 1) {
      if (topLevelCharacters[index] !== '\n' && topLevelCharacters[index] !== '\r') {
        topLevelCharacters[index] = ' ';
      }
    }
  }
  const topLevel = topLevelCharacters.join('');
  const unexpectedCalls = [];
  for (const match of topLevel.matchAll(/\b([A-Za-z_][A-Za-z0-9_]*)\s*\(/g)) {
    const before = topLevel.slice(Math.max(0, match.index - 4), match.index);
    if (/(?:->|::)\s*$/.test(before) || languageConstructs.has(match[1])) {
      continue;
    }
    if (match[1] !== 'defined') {
      unexpectedCalls.push(match[1]);
    }
  }
  const memberCalls = [...topLevel.matchAll(
    /(?:\b[A-Za-z_][A-Za-z0-9_]*|\$[A-Za-z_][A-Za-z0-9_]*)\s*(?:::|->)\s*[A-Za-z_][A-Za-z0-9_]*\s*\(/g
  )];
  if (unexpectedCalls.length > 0 || memberCalls.length > 0
    || /\b(?:new|require|require_once|include|include_once)\b/.test(topLevel)) {
    fail(`Class file load has unreviewed top-level execution in ${file.path}.`, [
      ...unexpectedCalls,
      ...memberCalls.map((match) => match[0].trim())
    ]);
  }
}

// The production plugin has no activation/deactivation execution path at all.
const lifecycleHooks = { activation: [], deactivation: [] };
for (const kind of ['activation', 'deactivation']) {
  const executableCount = findCallsAcross(files, `register_${kind}_hook`).length;
  if (executableCount !== 0) {
    fail(`FarmTree ${kind} hooks are forbidden; lifecycle must have no execution path.`);
  }
}
for (const callback of ['farmtree_content_activate', 'farmtree_content_deactivate']) {
  if (files.some((file) => file.functions.some((record) => record.name === callback))) {
    fail(`FarmTree lifecycle callback must be absent: ${callback}().`);
  }
}

for (const name of [
  'farmtree_content_register_customer_segments',
  'farmtree_content_register_proof_stories',
  'farmtree_content_redirect_legacy_proof_story_paths'
]) {
  assertNoUnsafeBodyCalls(functionNamed(mainFile, name), allWriteCallables, 'HTTP/runtime callback');
}
assertOnlyNamedCalls(
  functionNamed(mainFile, 'farmtree_content_register_customer_segments'),
  ['__', 'register_post_type'],
  'Customer Segment registration'
);
assertOnlyNamedCalls(
  functionNamed(mainFile, 'farmtree_content_register_proof_stories'),
  ['__', 'register_post_type'],
  'Proof Story registration'
);
assertOnlyNamedCalls(
  functionNamed(mainFile, 'farmtree_content_redirect_legacy_proof_story_paths'),
  ['is_admin', 'wp_parse_url', 'wp_unslash', 'home_url', 'wp_safe_redirect'],
  'HTTP redirect callback'
);

// Constructors are read-only, and the managed manifest is executable literal data only.
for (const file of files) {
  for (const constructor of file.functions.filter((record) => record.name === '__construct')) {
    assertNoUnsafeBodyCalls(constructor, allWriteCallables, 'constructor');
    if (methodCalls(constructor).length > 0) {
      fail('Constructor may not delegate to another FarmTree method.', [
        `${constructor.file.path}:${constructor.line}`,
        ...methodCalls(constructor)
      ]);
    }
  }
}
const manifestIdentifiers = new Set(
  [...managedManifestFile.masked.matchAll(/\b[A-Za-z_][A-Za-z0-9_]*\b/g)]
    .map((match) => match[0].toLowerCase())
);
const allowedManifestIdentifiers = new Set([
  'php', 'if', 'defined', 'abspath', 'exit', 'return', 'true', 'false', 'null'
]);
const unexpectedManifestIdentifiers = [...manifestIdentifiers]
  .filter((identifier) => !allowedManifestIdentifiers.has(identifier));
if (unexpectedManifestIdentifiers.length > 0
  || !/\breturn\s*\[/.test(managedManifestFile.masked)) {
  fail('Managed-content manifest must remain guarded literal array data.', unexpectedManifestIdentifiers);
}

// Build the reconciler's direct method graph and enforce exact write-helper callers.
const reconcilerMethods = new Map();
for (const record of reconcilerFile.functions) {
  if ('__construct' === record.name) {
    continue;
  }
  if (reconcilerMethods.has(record.name)) {
    fail(`Duplicate reconciler method name: ${record.name}.`);
  }
  reconcilerMethods.set(record.name, record);
}
const adjacency = new Map();
const callers = new Map();
for (const [name, record] of reconcilerMethods) {
  const dependencies = new Set(methodCalls(record));
  adjacency.set(name, dependencies);
  for (const dependency of dependencies) {
    if (!callers.has(dependency)) {
      callers.set(dependency, new Set());
    }
    callers.get(dependency).add(name);
  }
}
const exactWriteHelperCallers = {
  apply_term: ['apply_plan'],
  apply_asset: ['apply_plan'],
  apply_entity: ['apply_plan'],
  apply_relationships: ['apply_entity'],
  apply_front_page: ['apply_plan'],
  finalize_rewrite_rules: ['apply_plan'],
  capture_pre_update_revision: ['apply_entity'],
  lock_and_refresh_reconciliation_state: ['apply_plan'],
  invalidate_term_query_generation: [
    'invalidate_caches_after_rollback',
    'lock_and_refresh_reconciliation_state'
  ],
  invalidate_caches_after_rollback: ['apply_plan'],
  cleanup_created_files: ['apply_plan'],
  write_term_meta: ['apply_term'],
  write_post_meta: ['apply_asset', 'apply_entity']
};
for (const [method, expectedCallers] of Object.entries(exactWriteHelperCallers)) {
  const record = reconcilerMethods.get(method);
  if (!record || record.visibility !== 'private') {
    fail(`APPLY write helper ${method}() must exist exactly once and remain private.`);
  }
  const actualCallers = [...(callers.get(method) ?? [])].sort();
  if (!arraysEqual(actualCallers, [...expectedCallers].sort())) {
    fail(`APPLY write helper caller set drifted for ${method}().`, [
      `expected: ${[...expectedCallers].sort().join(', ')}`,
      `actual: ${actualCallers.join(', ')}`
    ]);
  }
}
if (applyPlan.visibility !== 'public') {
  fail('apply_plan() must remain the sole public reconciler write entry point.');
}
const lockedQueryIds = functionNamed(reconcilerFile, 'locked_query_ids');
const lockedQueryCallers = [...(callers.get('locked_query_ids') ?? [])].sort();
const lockedQuerySource = reconcilerFile.source.slice(lockedQueryIds.bodyStart, lockedQueryIds.bodyEnd);
if (lockedQueryIds.visibility !== 'private' ||
    !arraysEqual(lockedQueryCallers, ['lock_and_refresh_reconciliation_state']) ||
    !lockedQuerySource.includes("preg_match('/\\ASELECT\\b/i', $trimmed)") ||
    !lockedQuerySource.includes("str_contains($trimmed, ';')") ||
    !lockedQuerySource.includes('$wpdb->get_col($prepared)')) {
  fail('Dynamic locked SQL must remain one guarded private SELECT-only helper.', [
    `callers: ${lockedQueryCallers.join(', ')}`
  ]);
}
const planRewriteRules = functionNamed(reconcilerFile, 'plan_rewrite_rules');
const planRewriteCallers = [...(callers.get('plan_rewrite_rules') ?? [])].sort();
if (planRewriteRules.visibility !== 'private'
  || !arraysEqual(planRewriteCallers, ['build_plan', 'finalize_rewrite_rules'])) {
  fail('plan_rewrite_rules() must remain private and confined to planning/finalization.', [
    `actual callers: ${planRewriteCallers.join(', ')}`
  ]);
}

const writeBearingMethods = new Set(['apply_plan']);
for (const specification of [
  ...Object.values(requestedSpecifications),
  ...Object.values(additionalSpecifications)
]) {
  for (const method of specification.methods) {
    writeBearingMethods.add(method);
  }
}
const applyReachable = reachableMethods(adjacency, 'apply_plan');
for (const method of writeBearingMethods) {
  if (!applyReachable.has(method)) {
    fail(`Write-bearing reconciler method is not rooted in apply_plan(): ${method}.`);
  }
}
const buildPlanReachable = reachableMethods(adjacency, 'build_plan');
const dryRunWrites = [...writeBearingMethods].filter((method) => buildPlanReachable.has(method));
if (dryRunWrites.length > 0) {
  fail('build_plan() reaches an APPLY write method.', dryRunWrites);
}

// The CLI dry branch must return before every apply gate and write entry.
const reconcileCommand = functionNamed(cliFile, 'reconcile');
const reconcileSource = cliFile.source.slice(reconcileCommand.bodyStart, reconcileCommand.bodyEnd);
const dryIfIndex = reconcileSource.indexOf('if (!$apply)');
const firstBuildIndex = reconcileSource.indexOf('$this->build_dry_run_plan($reconciler, $options)', dryIfIndex);
const dryReturnIndex = reconcileSource.indexOf('return;', firstBuildIndex);
const applyGateIndex = reconcileSource.indexOf('$this->validate_apply_gates', dryReturnIndex);
const secondBuildIndex = reconcileSource.indexOf('$reconciler->build_plan($options)', applyGateIndex);
const digestIndex = reconcileSource.indexOf('hash_equals', secondBuildIndex);
const conflictIndex = reconcileSource.indexOf("!empty($plan['summary']['conflict'])", digestIndex);
const applyCallIndex = reconcileSource.indexOf('$reconciler->apply_plan', conflictIndex);
if ([dryIfIndex, firstBuildIndex, dryReturnIndex, applyGateIndex, secondBuildIndex,
  digestIndex, conflictIndex, applyCallIndex].some((index) => index < 0)) {
  fail('Could not prove the CLI dry-run/apply control-flow boundary.');
}
const cliApplyCalls = [...cliFile.masked.matchAll(/\$reconciler\s*->\s*apply_plan\s*\(/g)];
if (cliApplyCalls.length !== 1) {
  fail('CLI must contain exactly one reconciler apply_plan() call.');
}

// The independent apply gates and finalization ordering must precede every write.
const applyPlanOrder = [
  applyPlanSource.indexOf('$this->assert_plan_shape_and_actions'),
  applyPlanSource.indexOf('$this->runtime_gate_errors'),
  applyPlanSource.indexOf('$this->assert_transactional_tables'),
  applyPlanSource.indexOf("$wpdb->query('BEGIN')"),
  applyPlanSource.indexOf('$this->lock_and_refresh_reconciliation_state'),
  applyPlanSource.indexOf('$this->apply_term'),
  applyPlanSource.indexOf('$this->apply_asset'),
  applyPlanSource.indexOf('$this->apply_entity'),
  applyPlanSource.indexOf('$this->apply_front_page'),
  applyPlanSource.indexOf('$this->finalize_rewrite_rules'),
  applyPlanSource.indexOf('$this->assert_final_plan'),
  applyPlanSource.indexOf("$wpdb->query('COMMIT')")
];
if (applyPlanOrder.some((index) => index < 0)
  || applyPlanOrder.some((index, position) => position > 0 && index <= applyPlanOrder[position - 1])) {
  fail('Reconciler APPLY gates/write/finalization/postcondition order drifted.');
}

const finalizeRewriteRules = functionNamed(reconcilerFile, 'finalize_rewrite_rules');
if (finalizeRewriteRules.visibility !== 'private') {
  fail('finalize_rewrite_rules() must remain private.');
}
const finalizeMasked = reconcilerFile.masked.slice(
  finalizeRewriteRules.bodyStart,
  finalizeRewriteRules.bodyEnd
);
if (/\bflush_rewrite_rules\s*\(/.test(files.map((file) => file.masked).join('\n'))
  || !finalizeMasked.includes('update_option')
  || !finalizeMasked.includes('$planned_comparable')
  || !finalizeMasked.includes('$fresh_comparable')
  || !finalizeMasked.includes('unset')) {
  fail('Rewrite finalization must persist only its exact reviewed option target and never flush globally.');
}

const applyFrontPage = functionNamed(reconcilerFile, 'apply_front_page');
const applyFrontPageSource = reconcilerFile.source.slice(
  applyFrontPage.bodyStart,
  applyFrontPage.bodyEnd
);
for (const contract of [
  "has_action('update_option_page_on_front', 'update_home_siteurl')",
  "remove_action('update_option_page_on_front', 'update_home_siteurl'",
  "add_action('update_option_page_on_front', 'update_home_siteurl'",
  'finally'
]) {
  if (!applyFrontPageSource.includes(contract)) {
    fail('Managed front-page reconciliation must suppress and restore only the core global rewrite flush.', [contract]);
  }
}

const dryRunBuilder = functionNamed(cliFile, 'build_dry_run_plan');
const dryRunBuilderSource = cliFile.source.slice(dryRunBuilder.bodyStart, dryRunBuilder.bodyEnd);
if (dryRunBuilder.visibility !== 'private'
  || !dryRunBuilderSource.includes("add_filter('query', $firewall, PHP_INT_MAX)")
  || !dryRunBuilderSource.includes('$reconciler->build_plan($options)')
  || !dryRunBuilderSource.includes("remove_filter('query', $firewall, PHP_INT_MAX)")) {
  fail('The dry-run plan must remain inside the scoped final-query SQL firewall.');
}
const queryInspector = functionNamed(cliFile, 'inspect_dry_run_query');
const queryInspectorSource = cliFile.source.slice(queryInspector.bodyStart, queryInspector.bodyEnd);
for (const contract of [
  "['SELECT', 'SHOW', 'DESCRIBE', 'DESC', 'EXPLAIN']",
  'FarmTree_Content_Dry_Run_Write_Exception',
  "hash('sha256', $query)",
  'debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 40)'
]) {
  if (!queryInspectorSource.includes(contract)) {
    fail('The dry-run SQL firewall contract drifted.', [contract]);
  }
}

const protectionProbeCalls = findCallsAcross(files, 'wp_safe_remote_get');
if (protectionProbeCalls.length !== 1
  || protectionProbeCalls[0].file !== reconcilerPath
  || protectionProbeCalls[0].method !== 'runtime_gate_errors'
  || buildPlanReachable.has('runtime_gate_errors')) {
  fail('Anonymous protection probe must remain confined to APPLY runtime gates.');
}

const summary = {
  status: 'FARMTREE_CONTENT_SAFETY_OK',
  runtime_files: exactPluginRuntime.length,
  audited_runtime_source_sha256: runtimeSourceSha256,
  requested_write_api_counts: requestedCounts,
  additional_write_api_counts: Object.fromEntries(
    Object.entries(additionalCounts).filter(([, count]) => count > 0)
  ),
  apply_only_write_methods: [...writeBearingMethods].sort(),
  lifecycle_hooks: lifecycleHooks,
  dry_run_write_methods: 0,
  rewrite_finalization: 'exact_farmtree_only_apply_target',
  dry_run_sql_firewall: 'scoped_read_allowlist_block_before_execution',
  raw_wpdb_transaction_queries: queryCalls.length
};

console.log(JSON.stringify(summary));
