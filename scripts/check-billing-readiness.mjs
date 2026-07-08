/**
 * One-shot: login with admin/demo creds from .env and print billing readiness.
 * Usage: node scripts/check-billing-readiness.mjs
 * Does not print secrets or full tokens.
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

const env = {
  ...loadEnv('.env'),
  ...loadEnv('server/.env'),
  ...loadEnv(path.join(os.homedir(), '.matheo-smoke-creds')),
};
const backend =
  process.env.SMOKE_BACKEND_URL?.replace(/\/$/, '') ||
  'https://mathema-backend.redcoast-6e6508a7.centralindia.azurecontainerapps.io';
const api = `${backend}/api/v1`;

const adminList = (env.ADMIN_EMAILS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const candidates = [];
// Prefer explicit admin smoke creds (recommended for prod readiness).
if (env.SMOKE_ADMIN_EMAIL && env.SMOKE_ADMIN_PASSWORD) {
  candidates.push({
    email: env.SMOKE_ADMIN_EMAIL,
    password: env.SMOKE_ADMIN_PASSWORD,
    source: 'SMOKE_ADMIN_*',
  });
}
for (const email of adminList) {
  if (env.SMOKE_ADMIN_PASSWORD) {
    candidates.push({ email, password: env.SMOKE_ADMIN_PASSWORD, source: 'ADMIN_EMAILS+SMOKE_ADMIN_PASSWORD' });
  }
  if (env.VITE_DEMO_PASSWORD) {
    candidates.push({ email, password: env.VITE_DEMO_PASSWORD, source: 'admin+demo_pass' });
  }
}
if (env.VITE_DEMO_EMAIL && env.VITE_DEMO_PASSWORD) {
  candidates.push({
    email: env.VITE_DEMO_EMAIL,
    password: env.VITE_DEMO_PASSWORD,
    source: 'demo',
  });
}

let token = null;
let used = null;
for (const c of candidates) {
  const r = await fetch(`${api}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: c.email, password: c.password }),
  });
  const j = await r.json().catch(() => ({}));
  const tok =
    j?.data?.accessToken || j?.accessToken || j?.data?.access || j?.access;
  console.log(`login try=${c.source} http=${r.status} token=${Boolean(tok)}`);
  if (tok) {
    token = tok;
    used = c.source;
    break;
  }
}

if (!token) {
  console.error('no_admin_login_succeeded — set admin password or SMOKE_ADMIN_*');
  process.exit(2);
}

const rr = await fetch(`${api}/admin/billing/readiness`, {
  headers: { Authorization: `Bearer ${token}` },
});
const body = await rr.text();
console.log(`readiness_http=${rr.status} via=${used}`);
if (!rr.ok) {
  console.error(body.slice(0, 400));
  process.exit(1);
}
const o = JSON.parse(body);
const d = o.data || o;
const summary = {
  g1_ready: d.g1?.ready,
  g2_ready: d.g2?.ready,
  g1_checks: (d.g1?.checks || []).map((c) => ({
    id: c.id,
    passed: c.passed,
    detail: c.detail ?? c.message ?? null,
  })),
  g2_checks: (d.g2?.checks || []).map((c) => ({
    id: c.id,
    passed: c.passed,
    detail: c.detail ?? c.message ?? null,
  })),
  inbox: d.inbox ?? d.backlog ?? null,
};
console.log(JSON.stringify(summary, null, 2));
process.exit(d.g1?.ready ? 0 : 3);
