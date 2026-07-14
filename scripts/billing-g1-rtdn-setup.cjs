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
const playPublisher = 'google-play-developer-notifications@system.gserviceaccount.com';

console.log('Matheo G1 — RTDN Pub/Sub setup (run in Cloud Shell or gcloud CLI)\n');
console.log(`Project:     ${project}`);
console.log(`Push SA:     ${pushSa}`);
console.log(`Audience:    ${audience}`);
console.log(`Topic:       ${topic}`);
console.log(`Subscription:${subscription}\n`);

const cmds = [
  `gcloud config set project ${project}`,
  `gcloud services enable pubsub.googleapis.com`,
  `gcloud iam service-accounts create matheo-rtdn-push --display-name="Matheo RTDN push" || true`,
  `# If SA email differs, update RTDN_SERVICE_ACCOUNT_EMAIL in server/.env`,
  `gcloud pubsub topics create ${topic} || true`,
  `gcloud pubsub topics add-iam-policy-binding ${topic} \\`,
  `  --member="serviceAccount:${playPublisher}" \\`,
  `  --role="roles/pubsub.publisher"`,
  `PROJECT_NUMBER=$(gcloud projects describe ${project} --format='value(projectNumber)')`,
  `gcloud projects add-iam-policy-binding ${project} \\`,
  `  --member="serviceAccount:service-\${PROJECT_NUMBER}@gcp-sa-pubsub.iam.gserviceaccount.com" \\`,
  `  --role="roles/iam.serviceAccountTokenCreator"`,
  `gcloud pubsub subscriptions describe ${subscription} >/dev/null 2>&1 || \\`,
  `  gcloud pubsub subscriptions create ${subscription} --topic=${topic}`,
  `gcloud pubsub subscriptions modify-push-config ${subscription} \\`,
  `  --push-endpoint="${audience}" \\`,
  `  --push-auth-service-account=${pushSa} \\`,
  `  --push-auth-token-audience="${audience}"`,
  `gcloud pubsub subscriptions describe ${subscription} \\`,
  `  --format='yaml(name,topic,pushConfig.pushEndpoint,pushConfig.oidcToken.serviceAccountEmail,pushConfig.oidcToken.audience)'`,
  `# Play Console → Monetize → Monetization setup → Real-time notifications`,
  `#   Link topic: projects/${project}/topics/${topic}`,
  `# Send test notification → expect HTTP 200 on ${audience}`,
];

for (const c of cmds) console.log(c);
console.log('\nAfter test notification: GET /admin/billing/rtdn-inbox (admin JWT) → PROCESSED row.');
