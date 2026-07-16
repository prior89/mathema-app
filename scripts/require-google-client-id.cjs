/* eslint-disable no-console */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'app');
const DUMMY_GOOGLE_CLIENT_ID = 'dummy-web-client.apps.googleusercontent.com';
const GOOGLE_WEB_CLIENT_ID_PATTERN = /^\d+-[a-z0-9_-]+\.apps\.googleusercontent\.com$/i;

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const parsed = {};
  const body = fs.readFileSync(filePath, 'utf8');
  for (const rawLine of body.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const match = /^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/.exec(line);
    if (!match) continue;
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    parsed[match[1]] = value;
  }
  return parsed;
}

const env = {};
for (const filePath of [
  path.join(ROOT, '.env'),
  path.join(APP, '.env'),
  path.join(APP, '.env.local'),
  path.join(APP, '.env.production'),
  path.join(APP, '.env.production.local'),
]) {
  Object.assign(env, parseEnvFile(filePath));
}

if (process.env.VITE_GOOGLE_CLIENT_ID != null) {
  env.VITE_GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID;
}

const clientId = (env.VITE_GOOGLE_CLIENT_ID ?? '').trim();
if (!clientId || clientId === DUMMY_GOOGLE_CLIENT_ID) {
  console.error(
    '[google-client-id] VITE_GOOGLE_CLIENT_ID is required before building a production app.',
  );
  console.error(
    '[google-client-id] Add the OAuth Web Client ID to .env or pass VITE_GOOGLE_CLIENT_ID in the shell.',
  );
  process.exit(1);
}

if (!GOOGLE_WEB_CLIENT_ID_PATTERN.test(clientId)) {
  console.error(
    '[google-client-id] VITE_GOOGLE_CLIENT_ID is not a valid Google OAuth Web client ID.',
  );
  process.exit(1);
}

const expectedClientId = (process.env.EXPECTED_GOOGLE_WEB_CLIENT_ID ?? '').trim();
if (expectedClientId && clientId !== expectedClientId) {
  console.error(
    '[google-client-id] VITE_GOOGLE_CLIENT_ID does not match the production OAuth Web client.',
  );
  process.exit(1);
}

const artifactFlag = process.argv.indexOf('--artifact');
if (artifactFlag !== -1) {
  const artifactArg = process.argv[artifactFlag + 1];
  if (!artifactArg) {
    console.error('[google-client-id] --artifact requires a directory path.');
    process.exit(1);
  }

  const artifactRoot = path.resolve(ROOT, artifactArg);
  if (!fs.existsSync(artifactRoot) || !fs.statSync(artifactRoot).isDirectory()) {
    console.error(`[google-client-id] Artifact directory does not exist: ${artifactRoot}`);
    process.exit(1);
  }

  const queue = [artifactRoot];
  let found = false;
  while (queue.length > 0 && !found) {
    const current = queue.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const entryPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        queue.push(entryPath);
      } else if (/\.(?:html|js|mjs)$/i.test(entry.name)) {
        if (fs.readFileSync(entryPath, 'utf8').includes(clientId)) {
          found = true;
          break;
        }
      }
    }
  }

  if (!found) {
    console.error(
      '[google-client-id] Production OAuth Web client ID is missing from the built application.',
    );
    process.exit(1);
  }
}

console.log(
  artifactFlag === -1
    ? '[google-client-id] Production OAuth Web client ID verified.'
    : '[google-client-id] Production OAuth Web client ID verified in build artifact.',
);
