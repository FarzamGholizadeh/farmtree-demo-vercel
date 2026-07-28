import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import YAML from 'yaml';

const root = resolve(import.meta.dirname, '..');
const workflowDirectory = resolve(root, '.github/workflows');
const validationPath = resolve(workflowDirectory, 'validate-wordpress-native.yml');
const stagingPath = resolve(workflowDirectory, 'deploy-wordpress-staging.yml');

const validationSource = readFileSync(validationPath, 'utf8');
const stagingSource = readFileSync(stagingPath, 'utf8');
const validation = YAML.parse(validationSource);
const staging = YAML.parse(stagingSource);

const validationEvents = Object.keys(validation.on ?? {});

if (!['pull_request', 'push', 'workflow_dispatch'].every((event) => validationEvents.includes(event))) {
  throw new Error('Native validation must run on pull requests, branch pushes and manual dispatch.');
}

if (Object.keys(staging.on ?? {}).join(',') !== 'workflow_dispatch') {
  throw new Error('Staging deployment must remain workflow_dispatch-only.');
}

const stagingJob = staging.jobs?.deploy;

if (stagingJob?.environment?.name !== 'Preview') {
  throw new Error('Staging deployment must use the Preview environment.');
}

if (stagingJob?.environment?.url !== '${{ vars.STAGING_URL }}') {
  throw new Error('Staging deployment URL must come from the Preview environment.');
}

for (const forbidden of [
  'VIMEXX_',
  'farmtree.eu/wp-admin',
  'wp-content/themes/farmtree/',
  'wp-content/plugins/farmtree-core/',
  'wp-content/plugins/farmtree-ai-assistant/'
]) {
  if (stagingSource.includes(forbidden)) {
    throw new Error(`Staging workflow contains a production reference: ${forbidden}`);
  }
}

for (const required of [
  'STAGING_SSH_KEY',
  'STAGING_KNOWN_HOSTS',
  'STAGING_HOST',
  'STAGING_PORT',
  'STAGING_USER',
  'STAGING_WORDPRESS_PATH',
  '.farmtree-staging',
  'https://farmtree.eu/*) exit 1',
  'wordpress/wp-content/themes/farmtree-native/',
  'wordpress/wp-content/plugins/farmtree-content/'
]) {
  if (!stagingSource.includes(required)) {
    throw new Error(`Staging workflow is missing required boundary: ${required}`);
  }
}

console.log('FARMTREE_NATIVE_WORKFLOWS_OK');
