#!/usr/bin/env node
/**
 * Print GCP Pub/Sub + Play RTDN wiring commands (operator runs with gcloud).
 * Values loaded from server/.env — no secrets printed except public URLs/emails.
 */
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', 'server', '.env');
const map = new Map();
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = /^([^#=]+)=(.*)$/.exec(line.trim());
    if (m) map.set(m[1].trim(), m[2]);
  }
}

const project = process.env.GCP_PROJECT ?? 'matheo-prod';
const topic = process.env.RTDN_TOPIC ?? 'play-rtdn-matheo';
const pushSa = map.get('RTDN_SERVICE_ACCOUNT_EMAIL') ?? 'matheo-rtdn-push@matheo-prod.iam.gserviceaccount.com';
const audience = map.get('RTDN_AUDIENCE') ?? '<set RTDN_AUDIENCE in server/.env>';
const subscription = `${topic}-push`;

console.log('Matheo G1 — RTDN Pub/Sub setup (run in Cloud Shell or gcloud CLI)\n');
console.log(`Project:     ${project}`);
console.log(`Push SA:     ${pushSa}`);
console.log(`Audience:    ${audience}`);
console.log(`Topic:       ${topic}`);
console.log(`Subscription:${subscription}\n`);

const cmds = [
  `gcloud config set project ${project}`,
  `gcloud iam service-accounts create matheo-rtdn-push --display-name="Matheo RTDN push" || true`,
  `# If SA email differs, update RTDN_SERVICE_ACCOUNT_EMAIL in server/.env`,
  `gcloud pubsub topics create ${topic} || true`,
  `gcloud pubsub subscriptions create ${subscription} \\`,
  `  --topic=${topic} \\`,
  `  --push-endpoint="${audience}" \\`,
  `  --push-auth-service-account=${pushSa} \\`,
  `  --push-auth-token-audience="${audience}"`,
  `# Play Console → Monetize → Monetization setup → Real-time notifications`,
  `#   Link topic: projects/${project}/topics/${topic}`,
  `# Send test notification → expect HTTP 200 on ${audience}`,
];

for (const c of cmds) console.log(c);
console.log('\nAfter test notification: GET /admin/billing/rtdn-inbox (admin JWT) → PROCESSED row.');