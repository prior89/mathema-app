import { access } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const APP = path.join(ROOT, 'app');
const FRONTEND_URL = 'http://127.0.0.1:5173';
const HEALTH_URL = `${FRONTEND_URL}/api/v1/health/live`;
const isWindows = process.platform === 'win32';
const npm = isWindows ? 'npm.cmd' : 'npm';
const npx = isWindows ? 'npx.cmd' : 'npx';

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd ?? ROOT,
      env: options.env ?? process.env,
      stdio: 'inherit',
      shell: false,
    });
    child.once('error', reject);
    child.once('exit', (code, signal) => {
      if (signal) return reject(new Error(`${command} stopped by ${signal}`));
      if (code !== 0) return reject(new Error(`${command} exited with code ${code}`));
      resolve();
    });
  });
}

async function waitFor(url, label, timeoutMs = 120_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The local process is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }
  throw new Error(`${label} did not become ready at ${url}`);
}

async function ensureWebAssets() {
  try {
    await access(path.join(APP, 'dist', 'index.html'));
  } catch {
    console.log('[android-dev] No app/dist found; creating the one-time native fallback bundle.');
    await run(npm, ['run', 'build'], { cwd: APP });
  }
}

async function main() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(`Usage: npm run android:dev -- [Capacitor run options]

Starts the Android debug app against the existing Vite dev server.

Common examples:
  npm run dev:local
  npm run android:dev
  npm run android:dev -- --target-name Pixel_7a
  npm run android:dev -- --target Medium_Phone_API_36.0

The command waits for:
  ${FRONTEND_URL}
  ${HEALTH_URL}`);
    return;
  }

  await ensureWebAssets();
  console.log('[android-dev] Waiting for the local Vite and Nest servers...');
  await waitFor(FRONTEND_URL, 'Vite');
  await waitFor(HEALTH_URL, 'Nest API');

  const androidSdk = process.env.ANDROID_HOME
    ?? (process.env.LOCALAPPDATA
      ? path.join(process.env.LOCALAPPDATA, 'Android', 'Sdk')
      : undefined);
  const env = { ...process.env };
  if (androidSdk) {
    env.ANDROID_HOME = androidSdk;
    const sdkBins = [
      path.join(androidSdk, 'platform-tools'),
      path.join(androidSdk, 'emulator'),
    ];
    env.PATH = `${sdkBins.join(path.delimiter)}${path.delimiter}${env.PATH ?? ''}`;
  }

  console.log('[android-dev] Starting Capacitor with live reload.');
  console.log('[android-dev] Keep this terminal open; saved web changes will update without a new AAB.');
  await run(
    npx,
    [
      'cap',
      'run',
      'android',
      '--live-reload',
      '--host',
      '127.0.0.1',
      '--port',
      '5173',
      '--forwardPorts',
      '5173:5173',
      ...process.argv.slice(2),
    ],
    { cwd: APP, env },
  );
}

main().catch((error) => {
  console.error(`[android-dev] ${error.message}`);
  process.exitCode = 1;
});
