#!/usr/bin/env node
/**
 * G1 internal-testing preflight — checks operator env before Play Console upload.
 * Usage: node scripts/billing-g1-preflight.cjs
 * Loads server/.env when present (same as sync-env).
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const envPath = path.join(root, 'server', '.env');

if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = /^([^#=]+)=(.*)$/.exec(line.trim());
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const checks = [
  {
    id: 'PLAY_SERVICE_ACCOUNT_JSON',
    ok: () => {
      const inline = process.env.PLAY_SERVICE_ACCOUNT_JSON ?? '';
      const file = process.env.PLAY_SERVICE_ACCOUNT_JSON_FILE ?? '';
      let raw = inline;
      if (!raw && file) {
        try {
          raw = fs.readFileSync(path.resolve(file), 'utf8');
        } catch {
          return false;
        }
      }
      if (!raw) return false;
      try {
        const j = JSON.parse(raw);
        return Boolean(j.client_email && j.private_key);
      } catch {
        return false;
      }
    },
    hint: 'PLAY_SERVICE_ACCOUNT_JSON or PLAY_SERVICE_ACCOUNT_JSON_FILE (androidpublisher scope)',
  },
  {
    id: 'PLAY_PACKAGE_NAME',
    ok: () => Boolean(process.env.PLAY_PACKAGE_NAME),
    hint: 'e.g. ai.matheo.app',
  },
  {
    id: 'PLAY_OBFUSCATED_ACCOUNT_SECRET',
    ok: () => (process.env.PLAY_OBFUSCATED_ACCOUNT_SECRET ?? '').length >= 16,
    hint: 'min 16 chars — node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"',
  },
  {
    id: 'RTDN_AUDIENCE',
    ok: () => Boolean(process.env.RTDN_AUDIENCE),
    hint: 'Public URL of POST /api/v1/billing/rtdn',
  },
  {
    id: 'RTDN_SERVICE_ACCOUNT_EMAIL',
    ok: () => Boolean(process.env.RTDN_SERVICE_ACCOUNT_EMAIL),
    hint: 'Pub/Sub push OIDC service account email',
  },
  {
    id: 'BILLING_UI_ENABLED',
    ok: () => ['true', '1'].includes(process.env.BILLING_UI_ENABLED ?? ''),
    hint: 'Set true only for internal testing track',
  },
];

let failed = 0;
console.log('Matheo billing G1 preflight\n');
for (const c of checks) {
  const pass = c.ok();
  if (!pass) failed += 1;
  console.log(`${pass ? '✓' : '✗'} ${c.id}${pass ? '' : ` — ${c.hint}`}`);
}

if (failed) {
  console.log(`\n${failed} check(s) failed — fix server/.env before internal testing upload.`);
  process.exit(1);
}

console.log('\nAll G1 env checks passed. Next: build AAB (android-release workflow) and upload to Internal testing.');
console.log('Manual steps: PLAY_BILLING_GATES.md §G1');
process.exit(0);