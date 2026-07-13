/**
 * Probe prod AI Solver: login → text solve → print structured diagnostics.
 * Usage: node scripts/probe-ai-solver.mjs ["optional question"]
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
const api =
  (process.env.SMOKE_BACKEND_URL ||
    'https://mathema-backend.redcoast-6e6508a7.centralindia.azurecontainerapps.io') +
  '/api/v1';
const email = env.SMOKE_USER_EMAIL || env.VITE_DEMO_EMAIL;
const password = env.SMOKE_USER_PASSWORD || env.VITE_DEMO_PASSWORD;
const question =
  process.argv[2] || 'Solve for x: x^2 - 5x + 6 = 0. Show steps.';

const v = await fetch(api.replace('/api/v1', '/api/v1') + '/health/version');
console.log('version', await v.text());

const login = await fetch(`${api}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
const lj = await login.json();
const tok = lj?.data?.accessToken || lj?.accessToken;
console.log('login', login.status, Boolean(tok));
if (!tok) process.exit(1);

const t0 = Date.now();
const s = await fetch(`${api}/math-helper/solve`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${tok}`,
  },
  body: JSON.stringify({ question }),
});
const ms = Date.now() - t0;
const text = await s.text();
console.log('solve_http', s.status, 'ms', ms);
let body;
try {
  body = JSON.parse(text);
} catch {
  console.log('non_json', text.slice(0, 800));
  process.exit(1);
}
const d = body.data || body;
// Shape summary — do not dump huge latex blindly
const steps = d.steps || d.solution?.steps || d.result?.steps || null;
const summary = {
  keys: Object.keys(d),
  error: body.error || d.error || null,
  message: d.message || body.message || null,
  answer: d.answer ?? d.finalAnswer ?? d.solution?.answer ?? null,
  stepsType: Array.isArray(steps) ? `array(${steps.length})` : typeof steps,
  step0:
    Array.isArray(steps) && steps[0]
      ? typeof steps[0] === 'string'
        ? steps[0].slice(0, 200)
        : JSON.stringify(steps[0]).slice(0, 300)
      : null,
  latex: d.latex ? String(d.latex).slice(0, 200) : null,
  explanation: d.explanation ? String(d.explanation).slice(0, 200) : null,
  problemId: d.problemId ?? null,
  rawPrefix: JSON.stringify(d).slice(0, 1200),
};
console.log(JSON.stringify(summary, null, 2));
