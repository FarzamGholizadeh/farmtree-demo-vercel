import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' });
const paths = (...args) => git(...args, '-z').split('\0').filter(Boolean).sort();
const tracked = paths('ls-files');
assert.equal(new Set(tracked).size, tracked.length, 'Duplicate tracked paths');
const runtime = JSON.parse(readFileSync(new URL('../config/farmtree-native-release-files.json', import.meta.url))).runtime;
assert.ok(Array.isArray(runtime) && runtime.length > 0);
assert.equal(new Set(runtime).size, runtime.length, 'Duplicate runtime allowlist entries');
const allowed = new Set(runtime);
for (const path of runtime) assert.ok(tracked.includes(path), `Runtime path is not tracked: ${path}`);

function classify(path) {
  const theme = path.startsWith('wordpress/wp-content/themes/farmtree-native/');
  const content = path.startsWith('wordpress/wp-content/plugins/farmtree-content/');
  const owner = theme ? 'FarmTree Native frontend' : content ? 'FarmTree content/back-end' : 'FarmTree engineering/release';
  if (allowed.has(path)) return [path.endsWith('/managed-content-manifest.php') ? 'GENERATED_RUNTIME' : 'RUNTIME', owner, 'runtime', 'Exact Native release allowlist'];
  if (path.startsWith('wordpress/wp-content/themes/farmtree/')) return ['LEGACY_RUNTIME_REFERENCE', 'FarmTree rollback/legacy', 'historical', 'Retained rollback reference; not Native artifact'];
  if (path.startsWith('wordpress/wp-content/plugins/') && !content) return ['SEPARATE_PLUGIN_SOURCE', 'FarmTree optional AI/compatibility', 'separate-runtime-source', 'Outside Native artifact; live parity not implied'];
  if (content && path.includes('/data/') || theme && path.endsWith('/assets/data/README.md')) return ['SOURCE_DATA', owner, 'development', 'Non-runtime source data/documentation'];
  if (theme || content) return ['SOURCE_ASSET', owner, 'development', 'Non-allowlisted Native source; dependency usage not individually proven'];
  if (path.startsWith('assets/') || path === 'favicon.ico') return ['LEGACY_ASSET', 'FarmTree legacy static frontend', 'historical', 'Root static asset; not Native artifact'];
  if (['robots.txt', 'sitemap.xml'].includes(path)) return ['LEGACY_SOURCE', 'FarmTree legacy static frontend', 'historical', 'Root static discovery reference, not WordPress live discovery state'];
  if (/\.html(?:\.bak)?$/.test(path)) return ['LEGACY_SOURCE', 'FarmTree legacy static frontend', 'historical', 'Static HTML reference'];
  if (path.startsWith('qa/tools/') || /^scripts\/(validate-|audit-|test-)/.test(path)) return ['TEST', 'FarmTree QA', 'development', 'Validation tooling'];
  if (path.startsWith('qa/')) return ['EVIDENCE', 'FarmTree QA', 'historical', 'Tracked QA evidence; not proof of current runtime'];
  if (path.startsWith('.agents/') || path.startsWith('.github/') || /^\.[^/]+$/.test(path)) return ['CONFIG', path.startsWith('.agents/') ? 'FarmTree agent delivery' : owner, 'development', 'Repository tooling/configuration'];
  if (/\.md$/.test(path) || path.startsWith('docs/')) return ['DOCUMENTATION', 'FarmTree project/architecture', 'documentation', 'Project documentation or documentation data'];
  if (path === 'package-lock.json') return ['GENERATED_CONFIG', owner, 'development', 'Dependency lockfile'];
  if (path.startsWith('config/') || ['package.json', 'vercel.json', 'stylelint.config.mjs'].includes(path)) return ['CONFIG', owner, 'development', 'Build/development configuration'];
  if (path.startsWith('scripts/')) return ['SOURCE_TOOLING', owner, 'development', 'Engineering/release source'];
  return ['UNKNOWN', 'Unassigned', 'unknown', 'No path rule matches; needs manual review'];
}
const files = tracked.map(path => {
  const [category, owner, lifecycle, evidence] = classify(path);
  return { path, category, owner, lifecycle, nativeDeployable: allowed.has(path), evidence };
});
assert.deepEqual(files.map(file => file.path), tracked, 'Exact tracked coverage failed');
assert.equal(files.filter(file => file.nativeDeployable).length, runtime.length, 'Runtime count mismatch');
const categoryCounts = {};
for (const file of files) categoryCounts[file.category] = (categoryCounts[file.category] || 0) + 1;
const pendingUntracked = paths('ls-files', '--others', '--exclude-standard');
const result = {
  schemaVersion: 2,
  sourceHead: git('rev-parse', 'HEAD').trim(),
  scope: 'Exact git ls-files index path snapshot. Runtime classification uses the current working-tree explicit allowlist. No file contents or credential values are included. Not a clean-commit checksum manifest.',
  trackedFileCount: files.length,
  nativeRuntimeFileCount: runtime.length,
  categoryCounts,
  unknownCount: categoryCounts.UNKNOWN || 0,
  files,
  pendingUntracked,
  notes: [
    'Historical does not mean unused or safe to delete. No files are deleted.',
    'Ownership and lifecycle are path-based inferences, not a full dependency or content/security audit.',
    'Ignored dependencies, generated artifacts and current QA evidence are excluded intentionally.',
    'Pending untracked paths are separate and unclassified until tracked. Regenerate after git add/commit as needed.',
    'Byte sizes omitted to avoid self-referential generated inventory churn; use release checksums for artifact integrity.'
  ]
};
const directory = new URL('../docs/audit/live-360/', import.meta.url);
writeFileSync(new URL('REPOSITORY-INVENTORY.json', directory), `${JSON.stringify(result, null, 2)}\n`);
writeFileSync(new URL('REPOSITORY-INVENTORY.md', directory), `# Repository inventory\n\nRegenerate with \`node scripts/build-repository-inventory.mjs\`.\n\nSource HEAD: \`${result.sourceHead}\`. Exact indexed path snapshot: **${files.length} tracked files**, **${runtime.length} Native runtime allowlist entries**, **${result.unknownCount} unmatched classifications**. Pending untracked paths: **${pendingUntracked.length}**, listed separately in [machine-readable inventory](REPOSITORY-INVENTORY.json).\n\n| Classification | Files |\n|---|---:|\n${Object.entries(categoryCounts).sort().map(([category, count]) => `| ${category} | ${count} |`).join('\n')}\n| **Total** | **${files.length}** |\n\n## Scope and ownership\n\nNative frontend and Content runtime are included only by the explicit release allowlist. Other FarmTree plugins are separately owned source, not part of this artifact. The legacy theme and root static assets remain historical/rollback references. Engineering scripts, tests, configuration, documentation and QA evidence remain outside the deployable Native artifact. Unknown paths are reported, never silently declared runtime.\n\n${result.notes.map(note => `- ${note}`).join('\n')}\n\nThis is an index-path inventory with working-tree allowlist classification, not a clean release snapshot. Zero unmatched categories does not establish zero technical debt. No deletions, production changes or live file-parity claims result from this inventory.\n`);
console.log(`PASS: ${files.length} unique tracked paths; ${runtime.length} exact runtime entries; ${result.unknownCount} unknown; ${pendingUntracked.length} pending untracked`);
