/**
 * Login as smoke/demo learner and print public billing status (+ admin probe).
 * Usage: node scripts/check-billing-status.mjs
 */
import fs from 'fs';
import os from 'os';
import path from 'path';

function loadEnv(p) {
  const o = {};
  if (!fs.existsSync(p)) return o;
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)=(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    o[m[1]] = v;
  }
  return o;
}

const home = os.homedir();
const env = {
  ...loadEnv('.env'),
  ...loadEnv('server/.env'),
  ...loadEnv(path.join(home, '.matheo-smoke-creds')),
};
const backend =
  process.env.SMOKE_BACKEND_URL?.replace(/\/$/, '') ||
  'https://mathema-backend.redcoast-6e6508a7.centralindia.azurecontainerapps.io';
const api = `${backend}/api/v1`;
const email = env.SMOKE_USER_EMAIL || env.VITE_DEMO_EMAIL;
const password = env.SMOKE_USER_PASSWORD || env.VITE_DEMO_PASSWORD;

if (!email || !password) {
  console.error('missing SMOKE_USER_* or VITE_DEMO_* credentials');
  process.exit(2);
}

const r = await fetch(`${api}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
const j = await r.json().catch(() => ({}));
const tok = j?.data?.accessToken || j?.accessToken || j?.data?.access;
console.log(`login_http=${r.status} token=${Boolean(tok)}`);
if (!tok) {
  console.error(JSON.stringify(j).slice(0, 200));
  process.exit(1);
}

const s = await fetch(`${api}/billing/status`, {
  headers: { Authorization: `Bearer ${tok}` },
});
const sj = await s.json().catch(() => ({}));
const d = sj.data || sj;
console.log(
  JSON.stringify(
    {
      billing_status_http: s.status,
      billingUiEnabled: d.billingUiEnabled,
      premium: d.premium,
      solverQuota: d.quota?.solver ?? d.quota ?? null,
      entitlementSource: d.entitlement?.source ?? null,
    },
    null,
    2,
  ),
);

const a = await fetch(`${api}/admin/billing/readiness`, {
  headers: { Authorization: `Bearer ${tok}` },
});
console.log(`admin_readiness_as_learner_http=${a.status}`);
