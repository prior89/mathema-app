/* eslint-disable no-console */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'app');
const INVALID_VALUES = new Set(['', 'api입력칸']);

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
if (INVALID_VALUES.has(clientId)) {
  console.error(
    '[google-client-id] VITE_GOOGLE_CLIENT_ID is required before building a Capacitor Android bundle.',
  );
  console.error(
    '[google-client-id] Add the OAuth Web Client ID to .env or pass VITE_GOOGLE_CLIENT_ID in the shell.',
  );
  process.exit(1);
}
