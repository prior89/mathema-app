'use strict';

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

function loadDotEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = /^([^#=]+)=(.*)$/.exec(line.trim());
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
}

function serviceAccount() {
  if (process.env.PLAY_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.PLAY_SERVICE_ACCOUNT_JSON);
  }
  const file = process.env.PLAY_SERVICE_ACCOUNT_JSON_FILE;
  if (!file) throw new Error('PLAY_SERVICE_ACCOUNT_JSON or PLAY_SERVICE_ACCOUNT_JSON_FILE is required');
  return JSON.parse(fs.readFileSync(path.resolve(file), 'utf8'));
}

async function main() {
  loadDotEnv(path.resolve(__dirname, '..', 'server', '.env'));
  const packageName = process.env.PLAY_PACKAGE_NAME;
  const productId = process.argv[2];
  if (!packageName) throw new Error('PLAY_PACKAGE_NAME is required');
  if (!productId) throw new Error('Usage: node scripts/play-subscription-audit.cjs <productId>');

  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount(),
    scopes: ['https://www.googleapis.com/auth/androidpublisher'],
  });
  const publisher = google.androidpublisher({ version: 'v3', auth });
  const { data } = await publisher.monetization.subscriptions.get({ packageName, productId });

  const summary = {
    packageName: data.packageName,
    productId: data.productId,
    basePlans: (data.basePlans ?? []).map((plan) => ({
      basePlanId: plan.basePlanId,
      state: plan.state,
      billingPeriodDuration: plan.autoRenewingBasePlanType?.billingPeriodDuration ?? null,
      gracePeriodDuration: plan.autoRenewingBasePlanType?.gracePeriodDuration ?? null,
      accountHoldDuration: plan.autoRenewingBasePlanType?.accountHoldDuration ?? null,
      resubscribeState: plan.autoRenewingBasePlanType?.resubscribeState ?? null,
      prorationMode: plan.autoRenewingBasePlanType?.prorationMode ?? null,
      legacyCompatible: plan.autoRenewingBasePlanType?.legacyCompatible ?? false,
      offerTags: plan.offerTags ?? [],
      regions: (plan.regionalConfigs ?? []).map((region) => ({
        regionCode: region.regionCode,
        available: region.newSubscriberAvailability,
        price: region.price
          ? { currencyCode: region.price.currencyCode, units: region.price.units, nanos: region.price.nanos }
          : null,
      })),
    })),
  };
  process.stdout.write(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  const status = error?.response?.status;
  const apiMessage = error?.response?.data?.error?.message;
  process.stderr.write(`${status ? `HTTP ${status}: ` : ''}${apiMessage || error.message}\n`);
  process.exitCode = 1;
});
