import { spawnSync } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { createReadStream } from 'node:fs';
import {
  chmod,
  copyFile,
  lstat,
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  realpath,
  rename,
  rm,
  utimes,
  writeFile
} from 'node:fs/promises';
import { dirname, isAbsolute, posix, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, '..');
const manifestPath = resolve(repositoryRoot, 'config/farmtree-native-release-files.json');
const manifestRelativePath = 'config/farmtree-native-release-files.json';
const requiredSourceRoots = [
  'wordpress/wp-content/plugins/farmtree-content',
  'wordpress/wp-content/themes/farmtree-native'
];
const requiredRuntime = [
  'wordpress/wp-content/plugins/farmtree-content/includes/class-farmtree-content-cli-command.php',
  'wordpress/wp-content/plugins/farmtree-content/includes/class-farmtree-content-reconciler.php',
  'wordpress/wp-content/plugins/farmtree-content/includes/managed-content-manifest.php'
];
const requiredMaterializerPathSetSha256 = 'dc637a20b56ed35fd1bdd03849b86bf074eaabacef91f47cf90b1510ae3efdbe';
const privatePluginDataPrefix = 'wordpress/wp-content/plugins/farmtree-content/data/';
const allowedManifestKeys = [
  'artifactRoot',
  'excluded',
  'materializerSourceImages',
  'requiredRuntime',
  'runtime',
  'schemaVersion',
  'sourceRoots'
];
const allowedArguments = new Set(['--audit', '--build', '--check', '--help']);

function fail(message, details = []) {
  const detailText = details.length === 0 ? '' : `\n${details.map((detail) => `  - ${detail}`).join('\n')}`;
  throw new Error(`${message}${detailText}`);
}

function arraysEqual(left, right) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function sha256Text(value) {
  return createHash('sha256').update(value).digest('hex');
}

function pathSetDigest(paths) {
  return sha256Text(`${paths.join('\n')}\n`);
}

async function sha256File(path) {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(path)) {
    hash.update(chunk);
  }
  return hash.digest('hex');
}

function gitOutput(arguments_) {
  const result = spawnSync('git', ['-C', repositoryRoot, ...arguments_], {
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024
  });

  if (result.status !== 0) {
    fail(`Git command failed: git ${arguments_.join(' ')}`, [result.stderr.trim() || 'No error output.']);
  }

  return result.stdout;
}

function assertReleaseInputsClean(manifest) {
  const releaseInputs = [
    manifestRelativePath,
    'scripts/build-native-release.mjs',
    ...manifest.runtime,
    ...manifest.excluded
  ].sort();
  const status = gitOutput(['status', '--porcelain=v1', '--untracked-files=all', '--', ...releaseInputs]);
  if (status.length > 0) {
    fail('Release builds require manifest, builder, and every classified source file to match HEAD exactly.',
      status.trimEnd().split('\n'));
  }

  const mismatchedObjects = [];
  for (const path of releaseInputs) {
    const headObject = gitOutput(['rev-parse', `HEAD:${path}`]).trim();
    const worktreeObject = gitOutput(['hash-object', '--', path]).trim();
    if (!/^[0-9a-f]{40,64}$/.test(headObject) || headObject !== worktreeObject) {
      mismatchedObjects.push(path);
    }
  }
  if (mismatchedObjects.length > 0) {
    fail('Release input bytes differ from HEAD, including possible assume-unchanged or skip-worktree paths.', mismatchedObjects);
  }
}

async function lstatIfExists(path) {
  try {
    return await lstat(path);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

function assertSortedUnique(name, values) {
  if (!Array.isArray(values) || values.some((value) => typeof value !== 'string')) {
    fail(`Manifest field ${name} must be an array of strings.`);
  }

  const sorted = [...values].sort();
  if (!arraysEqual(values, sorted)) {
    fail(`Manifest field ${name} must be sorted byte-for-byte.`);
  }

  if (new Set(values).size !== values.length) {
    fail(`Manifest field ${name} contains duplicate paths.`);
  }

  const caseFolded = values.map((value) => value.toLowerCase());
  if (new Set(caseFolded).size !== caseFolded.length) {
    fail(`Manifest field ${name} contains case-insensitive path collisions.`);
  }
}

function isWithin(parent, child) {
  const pathFromParent = relative(parent, child);
  return pathFromParent !== '..' && !pathFromParent.startsWith(`..${sep}`) && !isAbsolute(pathFromParent);
}

function assertSafeManifestPath(path, sourceRoots, fieldName) {
  if (
    path.length === 0 ||
    path !== path.trim() ||
    path.includes('\\') ||
    /[\u0000-\u001f\u007f]/u.test(path) ||
    isAbsolute(path)
  ) {
    fail(`Unsafe path in manifest field ${fieldName}: ${JSON.stringify(path)}`);
  }

  const normalized = posix.normalize(path);
  if (normalized !== path || path.split('/').some((segment) => segment === '' || segment === '.' || segment === '..')) {
    fail(`Non-canonical path in manifest field ${fieldName}: ${JSON.stringify(path)}`);
  }

  if (!sourceRoots.some((root) => path.startsWith(`${root}/`))) {
    fail(`Path in manifest field ${fieldName} is outside the deployable roots: ${path}`);
  }

  const resolvedPath = resolve(repositoryRoot, path);
  if (!isWithin(repositoryRoot, resolvedPath)) {
    fail(`Path in manifest field ${fieldName} escapes the repository: ${path}`);
  }
}

async function collectFiles(directory, files, problems, directories = null) {
  const entries = await readdir(directory, { withFileTypes: true });
  entries.sort((left, right) => left.name.localeCompare(right.name));

  for (const entry of entries) {
    const absolutePath = resolve(directory, entry.name);
    const repositoryPath = relative(repositoryRoot, absolutePath).split(sep).join('/');

    if (entry.isSymbolicLink()) {
      problems.push(`Symbolic link is forbidden in a deployable root: ${repositoryPath}`);
    } else if (entry.isDirectory()) {
      directories?.push(repositoryPath);
      await collectFiles(absolutePath, files, problems, directories);
    } else if (entry.isFile()) {
      files.push(repositoryPath);
    } else {
      problems.push(`Non-regular filesystem entry is forbidden in a deployable root: ${repositoryPath}`);
    }
  }
}

function parseMode() {
  const arguments_ = process.argv.slice(2);
  const unknownArguments = arguments_.filter((argument) => !allowedArguments.has(argument));
  if (unknownArguments.length > 0) {
    fail('Unknown argument.', unknownArguments);
  }

  if (arguments_.includes('--help')) {
    console.log('Usage: node scripts/build-native-release.mjs [--build | --check | --audit]');
    console.log('Default mode is --build. --check audits source classification; --audit verifies an existing artifact.');
    process.exit(0);
  }

  const requestedModes = arguments_.filter((argument) => ['--audit', '--build', '--check'].includes(argument));
  if (requestedModes.length > 1) {
    fail('Choose only one of --build, --check, or --audit.');
  }

  return requestedModes[0]?.slice(2) ?? 'build';
}

async function loadAndValidateManifest() {
  const source = await readFile(manifestPath, 'utf8');
  let manifest;

  try {
    manifest = JSON.parse(source);
  } catch (error) {
    fail(`Release manifest is not valid JSON: ${error.message}`);
  }

  if (!manifest || Array.isArray(manifest) || typeof manifest !== 'object') {
    fail('Release manifest must be a JSON object.');
  }

  const manifestKeys = Object.keys(manifest).sort();
  if (!arraysEqual(manifestKeys, allowedManifestKeys)) {
    fail('Release manifest has missing or unknown top-level fields.', [
      `Expected: ${allowedManifestKeys.join(', ')}`,
      `Actual: ${manifestKeys.join(', ')}`
    ]);
  }

  if (manifest.schemaVersion !== 1) {
    fail('Release manifest schemaVersion must be 1.');
  }

  if (manifest.artifactRoot !== '.release') {
    fail('Release manifest artifactRoot must remain .release.');
  }

  for (const fieldName of ['sourceRoots', 'requiredRuntime', 'materializerSourceImages', 'runtime', 'excluded']) {
    assertSortedUnique(fieldName, manifest[fieldName]);
  }

  if (!arraysEqual(manifest.sourceRoots, requiredSourceRoots)) {
    fail('Release manifest sourceRoots must remain restricted to the isolated native theme and content plugin.');
  }

  if (!arraysEqual(manifest.requiredRuntime, requiredRuntime)) {
    fail('Release manifest requiredRuntime paths do not match the approved materializer implementation contract.');
  }

  for (const fieldName of ['requiredRuntime', 'materializerSourceImages', 'runtime', 'excluded']) {
    for (const path of manifest[fieldName]) {
      assertSafeManifestPath(path, manifest.sourceRoots, fieldName);
    }
  }

  const runtime = new Set(manifest.runtime);
  const excluded = new Set(manifest.excluded);
  const overlap = manifest.runtime.filter((path) => excluded.has(path));
  if (overlap.length > 0) {
    fail('Runtime and excluded classifications overlap.', overlap);
  }

  const allClassifications = [...manifest.runtime, ...manifest.excluded];
  if (new Set(allClassifications.map((path) => path.toLowerCase())).size !== allClassifications.length) {
    fail('Runtime and excluded classifications contain a case-insensitive collision.');
  }

  const requiredOutsideRuntime = manifest.requiredRuntime.filter((path) => !runtime.has(path));
  if (requiredOutsideRuntime.length > 0) {
    fail('Every required runtime path must also be classified as runtime.', requiredOutsideRuntime);
  }

  if (manifest.materializerSourceImages.length !== 43) {
    fail(`materializerSourceImages must contain exactly 43 paths, found ${manifest.materializerSourceImages.length}.`);
  }

  if (pathSetDigest(manifest.materializerSourceImages) !== requiredMaterializerPathSetSha256) {
    fail('materializerSourceImages does not match the approved exact 43-path source set.');
  }

  const materializerOutsideRuntime = manifest.materializerSourceImages.filter((path) => !runtime.has(path));
  if (materializerOutsideRuntime.length > 0) {
    fail('Every materializer source image must be classified as runtime.', materializerOutsideRuntime);
  }

  const privatePluginDataInRuntime = manifest.runtime.filter((path) => path.startsWith(privatePluginDataPrefix));
  if (privatePluginDataInRuntime.length > 0) {
    fail('Raw plugin data is private source material and must never be classified as runtime.', privatePluginDataInRuntime);
  }

  return { manifest, manifestSource: source };
}

async function auditSource(manifest) {
  const classifiedPaths = [...manifest.runtime, ...manifest.excluded].sort();
  const classified = new Set(classifiedPaths);
  const trackedPaths = gitOutput(['ls-files', '-z', '--', ...manifest.sourceRoots])
    .split('\0')
    .filter(Boolean)
    .sort();
  const tracked = new Set(trackedPaths);

  const unknownTrackedPaths = trackedPaths.filter((path) => !classified.has(path));
  if (unknownTrackedPaths.length > 0) {
    fail('Tracked deployable-root files are missing from the release classification.', unknownTrackedPaths);
  }

  const staleClassifications = classifiedPaths.filter((path) => !tracked.has(path));
  if (staleClassifications.length > 0) {
    fail('Every release-classified path must be tracked by Git.', staleClassifications);
  }

  const diskPaths = [];
  const filesystemProblems = [];
  for (const root of manifest.sourceRoots) {
    const absoluteRoot = resolve(repositoryRoot, root);
    const rootStatus = await lstat(absoluteRoot);
    if (!rootStatus.isDirectory() || rootStatus.isSymbolicLink()) {
      fail(`Deployable source root is not a real directory: ${root}`);
    }
    await collectFiles(absoluteRoot, diskPaths, filesystemProblems);
  }

  if (filesystemProblems.length > 0) {
    fail('Deployable source roots contain unsafe filesystem entries.', filesystemProblems);
  }

  diskPaths.sort();
  const disk = new Set(diskPaths);
  const unknownDiskPaths = diskPaths.filter((path) => !classified.has(path));
  if (unknownDiskPaths.length > 0) {
    fail('On-disk deployable-root files are missing from the release classification.', unknownDiskPaths);
  }

  const missingClassifiedPaths = classifiedPaths.filter((path) => !disk.has(path));
  if (missingClassifiedPaths.length > 0) {
    fail('Classified files are missing from disk.', missingClassifiedPaths);
  }

  const untrackedDiskPaths = diskPaths.filter((path) => !tracked.has(path));
  if (untrackedDiskPaths.length > 0) {
    fail('Untracked files are forbidden in the deployable roots.', untrackedDiskPaths);
  }

  return {
    trackedFileCount: trackedPaths.length
  };
}

function buildClassificationSummary(manifest, sourceAudit, manifestSource) {
  const sourceCommit = gitOutput(['rev-parse', 'HEAD']).trim();
  if (!/^[0-9a-f]{40}$/.test(sourceCommit)) {
    fail(`Unable to resolve a full source commit SHA: ${sourceCommit}`);
  }

  return {
    schemaVersion: 1,
    sourceCommit,
    releaseManifest: manifestRelativePath,
    releaseManifestSha256: sha256Text(manifestSource),
    classification: {
      trackedFileCount: sourceAudit.trackedFileCount,
      runtimeFileCount: manifest.runtime.length,
      excludedFileCount: manifest.excluded.length,
      requiredRuntimeFileCount: manifest.requiredRuntime.length,
      materializerSourceImageCount: manifest.materializerSourceImages.length,
      pathSetSha256: {
        runtime: pathSetDigest(manifest.runtime),
        excluded: pathSetDigest(manifest.excluded),
        materializerSourceImages: pathSetDigest(manifest.materializerSourceImages)
      }
    }
  };
}

async function stageRuntime(manifest, summary) {
  const artifactRoot = resolve(repositoryRoot, manifest.artifactRoot);
  const expectedArtifactRoot = resolve(repositoryRoot, '.release');
  if (artifactRoot !== expectedArtifactRoot || !isWithin(repositoryRoot, artifactRoot)) {
    fail(`Unsafe artifact root: ${artifactRoot}`);
  }

  const existingArtifactStatus = await lstatIfExists(artifactRoot);
  if (existingArtifactStatus && (!existingArtifactStatus.isDirectory() || existingArtifactStatus.isSymbolicLink())) {
    fail('Artifact root exists but is not a real directory; refusing destructive staging operations.');
  }

  await mkdir(artifactRoot, { recursive: true });
  const repositoryRealPath = await realpath(repositoryRoot);
  const artifactRealPath = await realpath(artifactRoot);
  if (!isWithin(repositoryRealPath, artifactRealPath)) {
    fail('Artifact root resolves outside the repository; refusing destructive staging operations.');
  }

  const stagedWordPress = resolve(artifactRoot, 'wordpress');
  if (!isWithin(artifactRoot, stagedWordPress)) {
    fail('Resolved WordPress artifact path escaped the artifact root.');
  }

  const existingStagedStatus = await lstatIfExists(stagedWordPress);
  if (existingStagedStatus) {
    if (!existingStagedStatus.isDirectory() || existingStagedStatus.isSymbolicLink()) {
      fail('Existing WordPress artifact is not a real directory; refusing to replace it.');
    }

    const existingStagedRealPath = await realpath(stagedWordPress);
    if (!isWithin(artifactRealPath, existingStagedRealPath)) {
      fail('Existing WordPress artifact resolves outside .release; refusing to replace it.');
    }

    const existingFiles = [];
    const existingProblems = [];
    await collectFiles(stagedWordPress, existingFiles, existingProblems);
    if (existingProblems.length > 0) {
      fail('Existing WordPress artifact contains unsafe filesystem entries; refusing to remove it.', existingProblems);
    }
  }

  const temporaryWordPress = await mkdtemp(resolve(artifactRoot, '.wordpress-staging-'));
  if (!isWithin(artifactRoot, temporaryWordPress)) {
    fail('Resolved temporary staging path escaped the artifact root.');
  }

  const checksumLines = [];
  let totalBytes = 0;

  try {
    for (const repositoryPath of manifest.runtime) {
      const sourcePath = resolve(repositoryRoot, repositoryPath);
      const sourceStatus = await lstat(sourcePath);
      if (!sourceStatus.isFile() || sourceStatus.isSymbolicLink()) {
        fail(`Runtime source is not a regular file: ${repositoryPath}`);
      }
      if ((sourceStatus.mode & 0o777) !== 0o644) {
        fail(`Runtime source must use the production-safe 0644 file mode: ${repositoryPath}`);
      }

      const wordpressRelativePath = repositoryPath.slice('wordpress/'.length);
      if (wordpressRelativePath === repositoryPath || wordpressRelativePath.length === 0) {
        fail(`Runtime source is outside the WordPress artifact namespace: ${repositoryPath}`);
      }

      const destinationPath = resolve(temporaryWordPress, wordpressRelativePath);
      if (!isWithin(temporaryWordPress, destinationPath)) {
        fail(`Runtime destination escaped the staging tree: ${repositoryPath}`);
      }

      await mkdir(dirname(destinationPath), { recursive: true });
      await copyFile(sourcePath, destinationPath);
      await chmod(destinationPath, sourceStatus.mode & 0o777);
      await utimes(destinationPath, sourceStatus.mtime, sourceStatus.mtime);

      const sourceDigest = await sha256File(sourcePath);
      const destinationDigest = await sha256File(destinationPath);
      if (destinationDigest !== sourceDigest) {
        fail(`Staged file digest differs from source: ${repositoryPath}`);
      }

      totalBytes += sourceStatus.size;
      checksumLines.push(`${sourceDigest}  ${repositoryPath}`);
    }

    const stagedFiles = [];
    const stagingProblems = [];
    await collectFiles(temporaryWordPress, stagedFiles, stagingProblems);
    if (stagingProblems.length > 0) {
      fail('Temporary artifact contains unsafe filesystem entries.', stagingProblems);
    }

    const normalizedStagedFiles = stagedFiles
      .map((path) => `wordpress/${relative(temporaryWordPress, resolve(repositoryRoot, path)).split(sep).join('/')}`)
      .sort();

    if (!arraysEqual(normalizedStagedFiles, manifest.runtime)) {
      fail('Temporary artifact does not contain the exact runtime allowlist.', [
        ...manifest.runtime.filter((path) => !normalizedStagedFiles.includes(path)).map((path) => `Missing: ${path}`),
        ...normalizedStagedFiles.filter((path) => !manifest.runtime.includes(path)).map((path) => `Unexpected: ${path}`)
      ]);
    }

    assertReleaseInputsClean(manifest);
    await rm(stagedWordPress, { force: true, recursive: true });
    await rename(temporaryWordPress, stagedWordPress);
  } catch (error) {
    await rm(temporaryWordPress, { force: true, recursive: true });
    throw error;
  }

  const sha256sums = `${checksumLines.join('\n')}\n`;
  const completeSummary = {
    ...summary,
    artifact: {
      root: '.release/wordpress',
      fileCount: manifest.runtime.length,
      totalBytes,
      sha256sums: '.release/SHA256SUMS',
      sha256sumsSha256: sha256Text(sha256sums)
    }
  };

  const temporarySuffix = randomUUID();
  const checksumTemporaryPath = resolve(artifactRoot, `.SHA256SUMS-${temporarySuffix}`);
  const summaryTemporaryPath = resolve(artifactRoot, `.release-summary-${temporarySuffix}.json`);
  const checksumPath = resolve(artifactRoot, 'SHA256SUMS');
  const summaryPath = resolve(artifactRoot, 'release-summary.json');

  await writeFile(checksumTemporaryPath, sha256sums, { encoding: 'utf8', flag: 'wx', mode: 0o644 });
  await writeFile(summaryTemporaryPath, `${JSON.stringify(completeSummary, null, 2)}\n`, {
    encoding: 'utf8',
    flag: 'wx',
    mode: 0o644
  });
  await rm(checksumPath, { force: true });
  await rm(summaryPath, { force: true });
  await rename(checksumTemporaryPath, checksumPath);
  await rename(summaryTemporaryPath, summaryPath);

  return completeSummary;
}

function expectedArtifactDirectories(runtimePaths) {
  const directories = new Set(['wordpress']);

  for (const path of runtimePaths) {
    const segments = path.split('/');
    for (let index = 1; index < segments.length; index += 1) {
      directories.add(segments.slice(0, index).join('/'));
    }
  }

  return [...directories].sort();
}

async function auditArtifact(manifest, summary) {
  const artifactRoot = resolve(repositoryRoot, manifest.artifactRoot);
  const artifactRootStatus = await lstatIfExists(artifactRoot);
  if (!artifactRootStatus) {
    fail('Release artifact is missing. Run npm run release:build before npm run release:audit.');
  }
  if (!artifactRootStatus.isDirectory() || artifactRootStatus.isSymbolicLink()) {
    fail('Release artifact root must be a real directory.');
  }

  const repositoryRealPath = await realpath(repositoryRoot);
  const artifactRealPath = await realpath(artifactRoot);
  if (!isWithin(repositoryRealPath, artifactRealPath)) {
    fail('Release artifact resolves outside the repository.');
  }

  const rootEntries = await readdir(artifactRoot, { withFileTypes: true });
  rootEntries.sort((left, right) => left.name.localeCompare(right.name));
  const expectedRootEntries = ['SHA256SUMS', 'release-summary.json', 'wordpress'];
  const actualRootEntries = rootEntries.map(({ name }) => name).sort();
  if (!arraysEqual(actualRootEntries, expectedRootEntries)) {
    fail('Release artifact root does not contain the exact approved entries.', [
      ...expectedRootEntries.filter((name) => !actualRootEntries.includes(name)).map((name) => `Missing: ${name}`),
      ...actualRootEntries.filter((name) => !expectedRootEntries.includes(name)).map((name) => `Unexpected: ${name}`)
    ]);
  }

  for (const entry of rootEntries) {
    if (entry.isSymbolicLink()) {
      fail(`Symbol links are forbidden in the release artifact: .release/${entry.name}`);
    }
    if (entry.name === 'wordpress' ? !entry.isDirectory() : !entry.isFile()) {
      fail(`Release artifact entry has the wrong filesystem type: .release/${entry.name}`);
    }
  }

  const stagedWordPress = resolve(artifactRoot, 'wordpress');
  const stagedFiles = [];
  const stagedDirectories = [];
  const stagedProblems = [];
  await collectFiles(stagedWordPress, stagedFiles, stagedProblems, stagedDirectories);
  if (stagedProblems.length > 0) {
    fail('Release artifact contains unsafe filesystem entries.', stagedProblems);
  }

  const normalizeArtifactPath = (path) => {
    const prefix = `${manifest.artifactRoot}/`;
    if (!path.startsWith(prefix)) {
      fail(`Artifact entry is outside ${manifest.artifactRoot}: ${path}`);
    }
    return path.slice(prefix.length);
  };
  const normalizedFiles = stagedFiles.map(normalizeArtifactPath).sort();
  if (!arraysEqual(normalizedFiles, manifest.runtime)) {
    fail('Release artifact does not contain the exact runtime allowlist.', [
      ...manifest.runtime.filter((path) => !normalizedFiles.includes(path)).map((path) => `Missing: ${path}`),
      ...normalizedFiles.filter((path) => !manifest.runtime.includes(path)).map((path) => `Unexpected: ${path}`)
    ]);
  }

  const normalizedDirectories = ['wordpress', ...stagedDirectories.map(normalizeArtifactPath)].sort();
  const approvedDirectories = expectedArtifactDirectories(manifest.runtime);
  if (!arraysEqual(normalizedDirectories, approvedDirectories)) {
    fail('Release artifact contains missing or unexpected directories.', [
      ...approvedDirectories.filter((path) => !normalizedDirectories.includes(path)).map((path) => `Missing: ${path}`),
      ...normalizedDirectories.filter((path) => !approvedDirectories.includes(path)).map((path) => `Unexpected: ${path}`)
    ]);
  }

  const checksumLines = [];
  let totalBytes = 0;
  for (const repositoryPath of manifest.runtime) {
    const sourcePath = resolve(repositoryRoot, repositoryPath);
    const artifactPath = resolve(artifactRoot, repositoryPath);
    if (!isWithin(artifactRoot, artifactPath)) {
      fail(`Runtime artifact path escaped .release: ${repositoryPath}`);
    }

    const [sourceStatus, artifactStatus] = await Promise.all([lstat(sourcePath), lstat(artifactPath)]);
    if (!sourceStatus.isFile() || sourceStatus.isSymbolicLink()) {
      fail(`Runtime source is not a regular file: ${repositoryPath}`);
    }
    if ((sourceStatus.mode & 0o777) !== 0o644) {
      fail(`Runtime source must use the production-safe 0644 file mode: ${repositoryPath}`);
    }
    if (!artifactStatus.isFile() || artifactStatus.isSymbolicLink()) {
      fail(`Runtime artifact is not a regular file: ${repositoryPath}`);
    }

    const [sourceDigest, artifactDigest] = await Promise.all([
      sha256File(sourcePath),
      sha256File(artifactPath)
    ]);
    if (
      artifactDigest !== sourceDigest ||
      artifactStatus.size !== sourceStatus.size ||
      (artifactStatus.mode & 0o777) !== (sourceStatus.mode & 0o777)
    ) {
      fail(`Runtime artifact differs from the approved source: ${repositoryPath}`);
    }

    totalBytes += artifactStatus.size;
    checksumLines.push(`${artifactDigest}  ${repositoryPath}`);
  }

  const expectedChecksums = `${checksumLines.join('\n')}\n`;
  const checksumPath = resolve(artifactRoot, 'SHA256SUMS');
  const actualChecksums = await readFile(checksumPath, 'utf8');
  if (actualChecksums !== expectedChecksums) {
    fail('SHA256SUMS is not the exact canonical checksum list for the approved runtime files.');
  }

  const expectedSummary = {
    ...summary,
    artifact: {
      root: '.release/wordpress',
      fileCount: manifest.runtime.length,
      totalBytes,
      sha256sums: '.release/SHA256SUMS',
      sha256sumsSha256: sha256Text(expectedChecksums)
    }
  };
  const expectedSummarySource = `${JSON.stringify(expectedSummary, null, 2)}\n`;
  const actualSummarySource = await readFile(resolve(artifactRoot, 'release-summary.json'), 'utf8');
  if (actualSummarySource !== expectedSummarySource) {
    fail('release-summary.json does not exactly match the audited source, manifest, path sets and artifact.');
  }

  return expectedSummary;
}

async function main() {
  const mode = parseMode();
  const { manifest, manifestSource } = await loadAndValidateManifest();
  const sourceAudit = await auditSource(manifest);
  const summary = buildClassificationSummary(manifest, sourceAudit, manifestSource);

  if (mode === 'check') {
    console.log(JSON.stringify({ mode, status: 'ok', ...summary }, null, 2));
    return;
  }

  assertReleaseInputsClean(manifest);
  if (mode === 'audit') {
    const auditedSummary = await auditArtifact(manifest, summary);
    console.log(JSON.stringify({ mode, status: 'ok', ...auditedSummary }, null, 2));
    return;
  }

  await stageRuntime(manifest, summary);
  const completeSummary = await auditArtifact(manifest, summary);
  console.log(JSON.stringify({ mode, status: 'ok', ...completeSummary }, null, 2));
}

main().catch((error) => {
  console.error(`FARMTREE_NATIVE_RELEASE_ERROR: ${error.message}`);
  process.exitCode = 1;
});
