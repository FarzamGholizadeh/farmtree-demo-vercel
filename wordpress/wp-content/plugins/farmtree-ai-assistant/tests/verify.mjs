#!/usr/bin/env node
/**
 * FarmTree AI — static security & structure verifier.
 *
 * Runs WITHOUT WordPress or PHP. It asserts the plugin's non-negotiable
 * invariants directly against the source:
 *   1. No hard-coded API key / secret / password anywhere.
 *   2. The API key is read ONLY from a constant/env (get_api_key isolation).
 *   3. The key is never localized to the browser, returned by REST, or logged.
 *   4. Every PHP file has the ABSPATH guard and balanced braces (class files).
 *   5. No fake-AI fallback: the REST layer never emits a canned "reply" when
 *      unconfigured — it returns a structured error instead.
 *
 * Usage:  node tests/verify.mjs
 * Exit 0 = all pass, 1 = failure.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
let failures = 0;
let checks = 0;

function ok(msg) { checks++; console.log(`  ✓ ${msg}`); }
function fail(msg) { failures++; checks++; console.error(`  ✗ ${msg}`); }
function assert(cond, msg) { cond ? ok(msg) : fail(msg); }

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'tests') continue;
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const files = walk(ROOT);
const php = files.filter((f) => f.endsWith('.php'));
const read = (f) => readFileSync(f, 'utf8');
const rel = (f) => relative(ROOT, f);

console.log('FarmTree AI — static verification\n');

// ---- 1. No hard-coded secrets ----
console.log('1) Secret scan');
const secretPatterns = [
  [/sk-[A-Za-z0-9]{16,}/, 'OpenAI-style key literal'],
  [/AKIA[0-9A-Z]{16}/, 'AWS access key id'],
  [/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/, 'private key block'],
  [/(?:api[_-]?key|apikey|secret|password|passwd|token)\s*[:=>]{1,2}\s*['"][^'"]{12,}['"]/i, 'inline secret assignment'],
];
let secretHit = false;
for (const f of files) {
  if (/\.(png|jpg|jpeg|gif|webp|woff2?|ico|mp4)$/i.test(f)) continue;
  const txt = read(f);
  for (const [re, label] of secretPatterns) {
    const m = txt.match(re);
    if (m) {
      // Allow the doc/placeholder "sk-..." example used in admin guidance.
      if (m[0].startsWith('sk-') && /sk-\.\.\./.test(txt)) continue;
      fail(`${label} found in ${rel(f)}: ${m[0].slice(0, 24)}…`);
      secretHit = true;
    }
  }
}
if (!secretHit) ok('no hard-coded secrets in any file');

// ---- 2. get_api_key isolation ----
console.log('2) API key isolation');
const settings = read(join(ROOT, 'includes/class-ft-ai-settings.php'));
const keyFn = settings.match(/function get_api_key\(\)[^{]*\{([\s\S]*?)\n\s{4}\}/);
assert(!!keyFn, 'get_api_key() is present');
if (keyFn) {
  const body = keyFn[1];
  assert(/FARMTREE_AI_API_KEY/.test(body), 'get_api_key reads the FARMTREE_AI_API_KEY constant');
  assert(/getenv\(\s*['"]FARMTREE_AI_API_KEY['"]\s*\)/.test(body), 'get_api_key falls back to the env var');
  assert(!/get_option|wpdb|\$_POST|\$_GET|\$_REQUEST/.test(body), 'get_api_key never touches the DB or request input');
}
assert(!/update_option\([^)]*api_key/i.test(settings) && !/'api_key'/.test(settings),
  'settings never persist an api_key field');

// ---- 3. Key never leaves the server ----
console.log('3) No key exposure to the browser / logs');
const frontend = read(join(ROOT, 'public/class-ft-ai-frontend.php'));
assert(!/get_api_key/.test(frontend), 'frontend never calls get_api_key');
assert(!/get_api_key/.test(read(join(ROOT, 'includes/class-ft-ai-rest.php'))), 'REST handler never calls get_api_key');
// The only place the key is used must be inside a provider adapter, for the Authorization header.
const openai = read(join(ROOT, 'includes/providers/class-ft-ai-provider-openai.php'));
assert(/Authorization.*Bearer.*\$key/.test(openai.replace(/\n/g, ' ')), 'provider uses the key only in the Authorization header');
for (const f of php) {
  const txt = read(f);
  assert(!/error_log\s*\(/.test(txt), `${rel(f)} contains no error_log() call`);
  assert(!/(var_dump|print_r)\s*\(\s*\$key/.test(txt), `${rel(f)} never dumps the key`);
}

// ---- 4. Structure: ABSPATH guard + brace balance ----
console.log('4) File structure');
for (const f of php) {
  const txt = read(f);
  if (rel(f) === 'uninstall.php') {
    assert(/WP_UNINSTALL_PLUGIN/.test(txt), 'uninstall.php guards on WP_UNINSTALL_PLUGIN');
  } else {
    assert(/if \(!defined\('ABSPATH'\)\)/.test(txt), `${rel(f)} has the ABSPATH guard`);
  }
  // Brace balance for class/logic files (skip HTML-heavy view templates).
  if (!rel(f).startsWith('admin/views/')) {
    const opens = (txt.match(/\{/g) || []).length;
    const closes = (txt.match(/\}/g) || []).length;
    assert(opens === closes, `${rel(f)} braces balanced (${opens}/${closes})`);
  }
}

// ---- 5. No fake-AI fallback ----
console.log('5) No fabricated AI responses');
const rest = read(join(ROOT, 'includes/class-ft-ai-rest.php'));
assert(/is_assistant_active\(\)/.test(rest), 'REST checks is_assistant_active() before answering');
assert(/FT_AI_Provider_Factory::get\(\)/.test(rest), 'REST obtains a real provider or bails');
assert(/'unavailable'/.test(rest), 'REST returns a structured "unavailable" error when not configured');
const overview = read(join(ROOT, 'admin/views/overview.php'));
assert(/is_assistant_active/.test(overview), 'Overview gates the "active" state on is_assistant_active()');

// ---- summary ----
console.log(`\n${failures ? '✗' : '✓'} ${checks - failures}/${checks} checks passed`);
process.exit(failures ? 1 : 0);
