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
  'PROJECT_CONTEXT.md',
  'DECISIONS.md',
  'ROADMAP.md',
  'CURRENT_SPRINT.md',
  'SPRINT_REPORT.md',
  'SPRINT_HISTORY.md',
  'docs/FT-NATIVE-ARCHITECTURE.md',
  'docs/FT-NATIVE-002-HOMEPAGE.md',
  'RELEASE-CHECKLIST.md',
]) {
  assert.match(agentMap, new RegExp(source.replace('.', '\\.')));
}
assert.match(agentMap, /https:\/\/farmtree\.eu\//);
assert.match(agentMap, /`farmtree` is the current public and\s+rollback-safe theme/);
assert.match(agentMap, /`farmtree-native` remains inactive and must not become\s+public without explicit approval/);
assert.match(agentMap, /Coming Soon removal/);
assert.match(agentMap, /VISUAL DESIGN LOCK/);
assert.match(
  agentMap,
  /currently approved FarmTree frontend is the mandatory visual source of\s+truth/,
);
assert.match(agentMap, /approved UI\/UX must not be materially redesigned/);
assert.match(agentMap, /every current and future FarmTree page/);
assert.match(agentMap, /Required Reviewer protection is a deferred\s+governance enhancement/);

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
assert.match(skill, /VISUAL DESIGN LOCK/);
assert.match(
  skill,
  /currently approved FarmTree frontend is the mandatory visual source of\s+truth/,
);
assert.match(skill, /approved UI\/UX must not be materially redesigned/);
assert.match(skill, /every current and future FarmTree page/);
assert.match(skill, /https:\/\/farmtree\.eu\/#home/);
assert.match(skill, /Do not reinterpret, modernize or replace/);
assert.match(skill, /Required Reviewer protection may remain a\s+deferred governance enhancement/);
assert.match(skill, /production workflows stay `workflow_dispatch`\s+only/);
assert.match(skill, /reproduce it when possible/);
assert.match(skill, /multiple\s+evidence-based attempts/);
assert.match(skill, /Do not make speculative code changes/);
assert.match(skill, /320, 375, 390, 430, 768, 1024, 1280/);
for (const reportRequirement of [
  'visual and functional result',
  'production impact',
  'rollback method',
  'real limitation or blocker',
]) {
  assert.match(skill, new RegExp(reportRequirement));
}

const config = YAML.parse(interfaceConfig);
assert.equal(config.policy?.allow_implicit_invocation, true);
assert.match(config.interface?.default_prompt ?? '', /\$farmtree-autonomous-delivery/);

console.log('FarmTree agent map and autonomous delivery skill are valid.');
