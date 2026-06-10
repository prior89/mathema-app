#!/usr/bin/env node
/**
 * Push G1 billing values from server/.env → GitHub Actions secrets.
 * Does not print secret values. Requires `gh` CLI authenticated.
 *
 *   npm run billing:push-secrets
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', 'server', '.env');
const repo = process.env.GH_REPO ?? 'prior89/mathema-app';

const KEYS = [
  'BILLING_UI_ENABLED',
  'RTDN_AUDIENCE',
  'RTDN_SERVICE_ACCOUNT_EMAIL',
  'PLAY_OBFUSCATED_ACCOUNT_SECRET',
];

function loadEnv(file) {
  const map = new Map();
  if (!fs.existsSync(file)) return map;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = /^([^#=]+)=(.*)$/.exec(line.trim());
    if (m) map.set(m[1].trim(), m[2]);
  }
  return map;
}

function ghSecretSet(name, value) {
  execFileSync('gh', ['secret', 'set', name, '--repo', repo, '--body', value], {
    stdio: ['pipe', 'pipe', 'inherit'],
  });
}

const env = loadEnv(envPath);
let pushed = 0;
let skipped = 0;

console.log(`Pushing G1 secrets to ${repo} (values hidden)\n`);

for (const key of KEYS) {
  const value = env.get(key) ?? '';
  if (!value) {
    console.log(`⊘ ${key} — missing in server/.env, skipped`);
    skipped += 1;
    continue;
  }
  ghSecretSet(key, value);
  console.log(`✓ ${key}`);
  pushed += 1;
}

// AAB + SWA build gate uses the same flag name as the server kill-switch.
const billingUi = env.get('BILLING_UI_ENABLED') ?? env.get('VITE_BILLING_ENABLED') ?? '';
if (billingUi) {
  ghSecretSet('VITE_BILLING_ENABLED', billingUi === 'true' || billingUi === '1' ? 'true' : billingUi);
  console.log('✓ VITE_BILLING_ENABLED (mirrored from billing UI flag)');
  pushed += 1;
}

console.log(`\n${pushed} secret(s) set, ${skipped} skipped.`);
if (skipped) {
  console.log('Run npm run billing:sync-env first if billing block is missing.');
  process.exit(1);
}
console.log('Next: gh workflow run backend-deploy.yml --ref main');