import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const base = process.argv[2] || 'http://localhost:8888/';
assert(['http://localhost:8888/', 'https://farmtree.eu/'].includes(base));
// Read-only browser interactions. Never submit forms, reconcile or alter WP state.
for (const script of ['validate-menu-links.cjs', 'validate-menu-pointer.cjs',
  'validate-cta-layout.cjs', 'validate-lcp-priority.cjs', 'validate-prose-links.cjs',
  'validate-discovery-metadata.cjs', 'validate-security-headers.mjs']) {
  console.log(`Running ${script} against ${base}`);
  const result = spawnSync(process.execPath, [`scripts/${script}`, base], {
    stdio: 'inherit', env: { ...process.env, FARMTREE_METADATA_URL: base },
  });
  assert.equal(result.status, 0, `${script} failed; subsequent checks not run`);
}
console.log('Read-only browser regression suite PASS');
