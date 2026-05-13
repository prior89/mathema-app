/* eslint-disable */
/**
 * Copy the root `.env` into both workspaces (server/.env and app/.env) so that
 * NestJS (dotenv inside ConfigModule) and Vite each pick it up from their own
 * working directory.
 *
 * Runs automatically after `npm install` (via the `postinstall` hook) and
 * before any db:* script. Safe to call when no root .env exists — it just
 * prints a hint.
 */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, '.env');

if (!fs.existsSync(SRC)) {
  console.log('[sync-env] No root .env yet — copy .env.example to .env first.');
  process.exit(0);
}

for (const sub of ['server', 'app']) {
  const dst = path.join(ROOT, sub, '.env');
  fs.copyFileSync(SRC, dst);
  console.log(`[sync-env] .env -> ${sub}/.env`);
}
