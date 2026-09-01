import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import YAML from 'yaml';

const root = resolve(import.meta.dirname, '..');
const workflowDirectory = resolve(root, '.github/workflows');
const validationPath = resolve(workflowDirectory, 'validate-wordpress-native.yml');
const privateRuntimePath = resolve(workflowDirectory, 'deploy-wordpress-native.yml');
const retiredStagingPath = resolve(workflowDirectory, 'deploy-wordpress-staging.yml');

const validationSource = readFileSync(validationPath, 'utf8');
const privateRuntimeSource = readFileSync(privateRuntimePath, 'utf8');
const validation = YAML.parse(validationSource);
const privateRuntime = YAML.parse(privateRuntimeSource);

const validationEvents = Object.keys(validation.on ?? {});

if (!['pull_request', 'push', 'workflow_dispatch'].every((event) => validationEvents.includes(event))) {
  throw new Error('Native validation must run on pull requests, branch pushes and manual dispatch.');
}

if (existsSync(retiredStagingPath)) {
  throw new Error('Separate staging deployment workflow must remain retired for FT-NATIVE-001B.');
}

if (!validationSource.includes('.github/workflows/deploy-wordpress-native.yml')) {
  throw new Error('Validation workflow must watch the private runtime deployment workflow.');
}

if (validationSource.includes('.github/workflows/deploy-wordpress-staging.yml')) {
  throw new Error('Validation workflow must not watch the retired staging workflow.');
}

for (const requiredValidationPath of [
  'config/farmtree-native-release-files.json',
  'scripts/build-native-release.mjs',
  'scripts/generate-managed-content-manifest.mjs'
]) {
  const occurrences = validationSource.match(new RegExp(requiredValidationPath.replaceAll('.', '\\.'), 'g')) ?? [];
  if (occurrences.length !== 2) {
    throw new Error(`Validation workflow must watch ${requiredValidationPath} for push and pull request.`);
  }
}

if (!validationSource.includes('-print0 | xargs -0 -r -n 1 php -l')) {
  throw new Error('Validation workflow PHP lint must propagate every syntax failure.');
}

for (const requiredValidationCommand of ['npm run release:build', 'npm run release:audit']) {
  if (!validationSource.includes(requiredValidationCommand)) {
    throw new Error(`Validation workflow must exercise the built artifact with ${requiredValidationCommand}.`);
  }
}

if (Object.keys(privateRuntime.on ?? {}).join(',') !== 'workflow_dispatch') {
  throw new Error('Private runtime deployment must remain workflow_dispatch-only.');
}

const dispatchInputs = privateRuntime.on?.workflow_dispatch?.inputs ?? {};
for (const input of ['source_commit', 'confirmation', 'backup_confirmation', 'backup_reference']) {
  if (dispatchInputs[input]?.required !== true) {
    throw new Error(`Private runtime deployment input ${input} must remain required.`);
  }
}

const privateRuntimeJob = privateRuntime.jobs?.deploy;

if (privateRuntimeJob?.environment?.name !== 'production') {
  throw new Error('Private runtime deployment must use the production environment boundary.');
}

if (privateRuntimeJob?.environment?.url !== 'https://farmtree.eu/') {
  throw new Error('Private runtime deployment URL must be https://farmtree.eu/.');
}

for (const forbidden of [
  'STAGING_',
  '.farmtree-staging',
  'wp-content/themes/farmtree/',
  'wp-content/plugins/farmtree-core/',
  'wp-content/plugins/farmtree-ai-assistant/',
  'wp theme activate',
  'wp plugin activate',
  'wp db ',
  'wp search-replace',
  'wp option update'
]) {
  if (privateRuntimeSource.includes(forbidden)) {
    throw new Error(`Private runtime workflow contains a forbidden operation or path: ${forbidden}`);
  }
}

for (const required of [
  'PRIVATE NATIVE FILES ONLY',
  'RECOVERABLE FILE AND DB BACKUP VERIFIED',
  'source_commit:',
  'SOURCE_COMMIT',
  'backup_reference:',
  'BACKUP_REFERENCE',
  'GITHUB_STEP_SUMMARY',
  'FARMTREE_BACKUP_EVIDENCE_DIGEST_RECORDED',
  'ref: ${{ inputs.source_commit }}',
  'fetch-depth: 0',
  'git merge-base --is-ancestor',
  'refs/heads/feat/wordpress-native-rebuild',
  'FARMTREE_APPROVED_NATIVE_SOURCE_OK',
  'VIMEXX_SSH_KEY',
  'VIMEXX_HOST',
  'VIMEXX_PORT',
  'VIMEXX_USER',
  'VIMEXX_WORDPRESS_PATH',
  'environment:',
  'name: production',
  'https://farmtree.eu/',
  'Coming Soon',
  'noindex',
  'wp option get template',
  'wp option get stylesheet',
  'wp option get blog_public',
  'wp plugin is-active coming-soon',
  'wp plugin is-active farmtree-content',
  'npm run release:build',
  'npm run release:audit',
  '.release/SHA256SUMS',
  'sha256sum --check',
  '.release/wordpress/wp-content/themes/farmtree-native/',
  '.release/wordpress/wp-content/plugins/farmtree-content/',
  'wordpress/wp-content/themes/farmtree-native/',
  'wordpress/wp-content/plugins/farmtree-content/',
  'wp theme is-installed farmtree-native',
  'wp plugin is-installed farmtree-content',
  'wp theme is-active farmtree-native',
  'is_block_theme'
]) {
  if (!privateRuntimeSource.includes(required)) {
    throw new Error(`Private runtime workflow is missing required boundary: ${required}`);
  }
}

if ((privateRuntimeSource.match(/wp plugin is-active farmtree-content/g) ?? []).length < 2) {
  throw new Error('Private runtime deployment must prove farmtree-content stays inactive before and after sync.');
}

for (const [stepName, requiredSource] of [
  ['Deploy inactive FarmTree Native theme', '.release/wordpress/wp-content/themes/farmtree-native/'],
  ['Deploy inactive FarmTree Content plugin', '.release/wordpress/wp-content/plugins/farmtree-content/']
]) {
  const step = privateRuntimeJob?.steps?.find(({ name }) => name === stepName);
  if (typeof step?.run !== 'string' || !step.run.includes(requiredSource)) {
    throw new Error(`${stepName} must transfer only the audited release artifact.`);
  }
  if ((step.run.match(/\brsync\b/g) ?? []).length !== 1 || !step.run.includes('rsync -azc --delete')) {
    throw new Error(`${stepName} must contain exactly one checksum-verifying scoped rsync.`);
  }
}

const approvedTransferSteps = new Set([
  'Deploy inactive FarmTree Native theme',
  'Deploy inactive FarmTree Content plugin'
]);
for (const step of privateRuntimeJob?.steps ?? []) {
  if (typeof step.run !== 'string') {
    continue;
  }
  if (/\b(?:rsync|scp|sftp)\b/.test(step.run) && !approvedTransferSteps.has(step.name)) {
    throw new Error(`Unexpected file-transfer command in private runtime step: ${step.name}`);
  }
}

for (const rawSourceRoot of [
  'wordpress/wp-content/themes/farmtree-native/',
  'wordpress/wp-content/plugins/farmtree-content/'
]) {
  const unprefixedPattern = new RegExp(`(?<!\\.release/)${rawSourceRoot.replaceAll('/', '\\/')}`);
  if (unprefixedPattern.test(privateRuntimeSource)) {
    throw new Error(`Private runtime workflow must never transfer or inspect the raw deployable root: ${rawSourceRoot}`);
  }
}

for (const step of privateRuntimeJob?.steps ?? []) {
  if (typeof step.run !== 'string') {
    continue;
  }

  const syntaxCheck = spawnSync('bash', ['-n'], {
    input: step.run,
    encoding: 'utf8'
  });
  if (syntaxCheck.status !== 0) {
    throw new Error(`Private runtime step "${step.name}" has invalid Bash: ${syntaxCheck.stderr.trim()}`);
  }
}

console.log('FARMTREE_NATIVE_WORKFLOWS_OK');
