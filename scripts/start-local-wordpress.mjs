import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const baseUrl = new URL(process.env.FARMTREE_LOCAL_WP_URL ?? 'http://localhost:8888');
const loopbackHosts = new Set(['127.0.0.1', 'localhost', '::1']);

if (!loopbackHosts.has(baseUrl.hostname)) {
  throw new Error('Local WordPress startup refuses to inspect or modify a non-loopback host.');
}

const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function runtimeIsReachable() {
  try {
    const response = await fetch(baseUrl, {
      redirect: 'manual',
      signal: AbortSignal.timeout(2_000)
    });

    return response.status > 0;
  } catch {
    return false;
  }
}

async function waitForRuntime(timeoutMilliseconds) {
  const deadline = Date.now() + timeoutMilliseconds;

  do {
    if (await runtimeIsReachable()) return true;
    await pause(500);
  } while (Date.now() < deadline);

  return false;
}

if (!(await runtimeIsReachable())) {
  const wpEnvBinary = fileURLToPath(new URL('../node_modules/.bin/wp-env', import.meta.url));
  const start = spawnSync(wpEnvBinary, ['start', '--runtime=playground'], {
    cwd: fileURLToPath(new URL('..', import.meta.url)),
    stdio: 'inherit'
  });

  // A second start can lose a race with an already-launching local process.
  // Continue only when the intended loopback URL actually becomes reachable;
  // the bootstrap performs the stronger WordPress/theme/plugin identity checks.
  if (start.status !== 0 && !(await waitForRuntime(5_000))) {
    process.exit(start.status ?? 1);
  }
}

if (!(await waitForRuntime(60_000))) {
  throw new Error(`Local WordPress did not become reachable at ${baseUrl.href}.`);
}

const bootstrap = spawnSync(
  process.execPath,
  [fileURLToPath(new URL('./bootstrap-local-wordpress.mjs', import.meta.url))],
  { stdio: 'inherit' }
);

process.exit(bootstrap.status ?? 1);
