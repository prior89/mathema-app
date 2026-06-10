#!/usr/bin/env node
/**
 * Merge G1 billing env into root .env (then sync-env → server/app).
 *
 * Usage:
 *   node scripts/billing-g1-sync-env.cjs
 *   PLAY_SA_FILE=/path/to/matheo-play.json node scripts/billing-g1-sync-env.cjs
 *
 * Does not print secrets. PLAY_SERVICE_ACCOUNT_JSON_FILE is preferred over
 * inlining JSON in .env.
 */
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const envPath = path.join(root, '.env');

const defaults = {
  PLAY_SERVICE_ACCOUNT_JSON_FILE:
    process.env.PLAY_SA_FILE
    ?? 'C:/Users/User/Downloads/matheo-prod-9d9afe8c1d3e.json',
  PLAY_PACKAGE_NAME: 'ai.matheo.app',
  RTDN_AUDIENCE:
    'https://mathema-backend.redcoast-6e6508a7.centralindia.azurecontainerapps.io/api/v1/billing/rtdn',
  RTDN_SERVICE_ACCOUNT_EMAIL:
    process.env.RTDN_SERVICE_ACCOUNT_EMAIL
    ?? 'matheo-rtdn-push@matheo-prod.iam.gserviceaccount.com',
  BILLING_UI_ENABLED: 'true',
  VITE_BILLING_ENABLED: 'true',
};

function parseEnv(text) {
  const map = new Map();
  const order = [];
  for (const line of text.split(/\r?\n/)) {
    const m = /^([^#=]+)=(.*)$/.exec(line.trim());
    if (m) {
      const key = m[1].trim();
      if (!map.has(key)) order.push(key);
      map.set(key, m[2]);
    }
  }
  return { map, order };
}

function upsertBillingBlock(existingText) {
  const saFile = path.resolve(defaults.PLAY_SERVICE_ACCOUNT_JSON_FILE.replace(/\//g, path.sep));
  if (!fs.existsSync(saFile)) {
    console.error(`Play SA file not found: ${saFile}`);
    console.error('Set PLAY_SA_FILE to your Play Developer API service-account JSON.');
    process.exit(1);
  }

  const sa = JSON.parse(fs.readFileSync(saFile, 'utf8'));
  if (!sa.client_email || !sa.private_key) {
    console.error('Play SA JSON missing client_email or private_key');
    process.exit(1);
  }

  let text = existingText;
  if (!text) {
    console.error('No root .env — copy .env.example to .env first.');
    process.exit(1);
  }

  const { map } = parseEnv(text);
  const obfuscated =
    map.get('PLAY_OBFUSCATED_ACCOUNT_SECRET')
    ?? crypto.randomBytes(32).toString('hex');

  const billingKeys = {
    PLAY_SERVICE_ACCOUNT_JSON_FILE: saFile.replace(/\\/g, '/'),
    PLAY_PACKAGE_NAME: defaults.PLAY_PACKAGE_NAME,
    PLAY_OBFUSCATED_ACCOUNT_SECRET: obfuscated,
    RTDN_AUDIENCE: defaults.RTDN_AUDIENCE,
    RTDN_SERVICE_ACCOUNT_EMAIL: defaults.RTDN_SERVICE_ACCOUNT_EMAIL,
    BILLING_UI_ENABLED: defaults.BILLING_UI_ENABLED,
    VITE_BILLING_ENABLED: defaults.VITE_BILLING_ENABLED,
  };

  // Strip prior billing block if re-running.
  text = text.replace(
    /\r?\n# ===== G1 Play Billing \(billing-g1-sync-env\) =====[\s\S]*?(?=\r?\n# =====|\r?\n$|$)/,
    '',
  );

  const block = [
    '',
    '# ===== G1 Play Billing (billing-g1-sync-env) =====',
    `# Play verify SA: ${sa.client_email}`,
    ...Object.entries(billingKeys).map(([k, v]) => `${k}=${v}`),
    '# Create RTDN push SA in GCP if different from RTDN_SERVICE_ACCOUNT_EMAIL above.',
  ].join('\n');

  return text.trimEnd() + block + '\n';
}

if (!fs.existsSync(envPath)) {
  console.error('Missing root .env');
  process.exit(1);
}

const next = upsertBillingBlock(fs.readFileSync(envPath, 'utf8'));
fs.writeFileSync(envPath, next, 'utf8');
console.log('[billing-g1-sync-env] Updated root .env (billing block)');

require('./sync-env.cjs');