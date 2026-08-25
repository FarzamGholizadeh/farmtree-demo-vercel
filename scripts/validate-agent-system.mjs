import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillRoot = path.join(
  root,
  '.agents',
  'skills',
  'farmtree-autonomous-delivery',
);

const [agentMap, skill, interfaceConfig] = await Promise.all([
  readFile(path.join(root, 'AGENTS.md'), 'utf8'),
  readFile(path.join(skillRoot, 'SKILL.md'), 'utf8'),
  readFile(path.join(skillRoot, 'agents', 'openai.yaml'), 'utf8'),
]);

assert.match(agentMap, /\$farmtree-autonomous-delivery/);
for (const source of [
  'CURRENT_SPRINT.md',
  'SPRINT_REPORT.md',
  'DECISIONS.md',
  'RELEASE-CHECKLIST.md',
]) {
  assert.match(agentMap, new RegExp(source.replace('.', '\\.')));
}

const frontmatter = skill.match(/^---\n([\s\S]+?)\n---/);
assert.ok(frontmatter, 'SKILL.md must start with YAML frontmatter');
const metadata = YAML.parse(frontmatter[1]);
assert.equal(metadata.name, 'farmtree-autonomous-delivery');
assert.match(metadata.description, /Use automatically/);
for (const trigger of [
  'WordPress-native',
  'Gutenberg',
  'plugin',
  'motion',
  'responsive',
  'accessibility',
  'SEO',
  'GEO',
  'AEO',
  'performance',
  'bug-fix',
  'release-preparation',
]) {
  assert.match(metadata.description, new RegExp(trigger));
}
assert.match(skill, /Run The Delivery Loop/);
assert.match(skill, /Preserve The Production Boundary/);

const config = YAML.parse(interfaceConfig);
assert.equal(config.policy?.allow_implicit_invocation, true);
assert.match(config.interface?.default_prompt ?? '', /\$farmtree-autonomous-delivery/);

console.log('FarmTree agent map and autonomous delivery skill are valid.');
