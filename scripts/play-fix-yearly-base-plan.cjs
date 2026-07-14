'use strict';

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const PRODUCT_ID = 'premium_yearly';
const CORRECT_BASE_PLAN_ID = 'annual-2026';
const WRONG_BASE_PLAN_ID = 'yearly';

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

function editableBasePlan(plan) {
  const result = {
    basePlanId: plan.basePlanId,
    regionalConfigs: plan.regionalConfigs ?? [],
  };
  if (plan.offerTags?.length) result.offerTags = plan.offerTags;
  if (plan.otherRegionsConfig) result.otherRegionsConfig = plan.otherRegionsConfig;
  if (plan.autoRenewingBasePlanType) result.autoRenewingBasePlanType = plan.autoRenewingBasePlanType;
  if (plan.prepaidBasePlanType) result.prepaidBasePlanType = plan.prepaidBasePlanType;
  if (plan.installmentsBasePlanType) result.installmentsBasePlanType = plan.installmentsBasePlanType;
  return result;
}

function validateAnnual(plan, expectedState) {
  if (!plan) throw new Error('Correct annual base plan is missing');
  if (expectedState && plan.state !== expectedState) {
    throw new Error(`Expected ${CORRECT_BASE_PLAN_ID} state ${expectedState}, got ${plan.state}`);
  }
  if (plan.autoRenewingBasePlanType?.billingPeriodDuration !== 'P1Y') {
    throw new Error(`Expected P1Y, got ${plan.autoRenewingBasePlanType?.billingPeriodDuration}`);
  }
  const korea = (plan.regionalConfigs ?? []).find((region) => region.regionCode === 'KR');
  if (!korea?.newSubscriberAvailability || korea.price?.currencyCode !== 'KRW' || korea.price?.units !== '99000') {
    throw new Error('Correct annual base plan must be available in KR for KRW 99,000');
  }
}

async function main() {
  loadDotEnv(path.resolve(__dirname, '..', 'server', '.env'));
  const packageName = process.env.PLAY_PACKAGE_NAME;
  if (!packageName) throw new Error('PLAY_PACKAGE_NAME is required');
  const apply = process.argv.includes('--apply');

  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount(),
    scopes: ['https://www.googleapis.com/auth/androidpublisher'],
  });
  const publisher = google.androidpublisher({ version: 'v3', auth });
  const getSubscription = async () =>
    (await publisher.monetization.subscriptions.get({ packageName, productId: PRODUCT_ID })).data;

  let subscription = await getSubscription();
  let annual = (subscription.basePlans ?? []).find((plan) => plan.basePlanId === CORRECT_BASE_PLAN_ID);

  if (!apply) {
    process.stdout.write(
      JSON.stringify({
        apply: false,
        productId: PRODUCT_ID,
        existingPlans: (subscription.basePlans ?? []).map((plan) => ({
          basePlanId: plan.basePlanId,
          state: plan.state,
          billingPeriodDuration: plan.autoRenewingBasePlanType?.billingPeriodDuration ?? null,
        })),
        action: annual
          ? `verify/activate ${CORRECT_BASE_PLAN_ID}, then deactivate ${WRONG_BASE_PLAN_ID}`
          : `create/activate ${CORRECT_BASE_PLAN_ID}, then deactivate ${WRONG_BASE_PLAN_ID}`,
      }, null, 2),
    );
    return;
  }

  if (!annual) {
    const converted = await publisher.monetization.convertRegionPrices({
      packageName,
      requestBody: { price: { currencyCode: 'KRW', units: '99000' } },
    });
    const regionVersion = converted.data.regionVersion?.version;
    if (!regionVersion) throw new Error('Google Play did not return a region version');

    const newPlan = {
      basePlanId: CORRECT_BASE_PLAN_ID,
      autoRenewingBasePlanType: {
        billingPeriodDuration: 'P1Y',
        gracePeriodDuration: 'P14D',
        accountHoldDuration: 'P46D',
        resubscribeState: 'RESUBSCRIBE_STATE_ACTIVE',
        prorationMode: 'SUBSCRIPTION_PRORATION_MODE_CHARGE_ON_NEXT_BILLING_DATE',
        legacyCompatible: false,
      },
      regionalConfigs: [
        {
          regionCode: 'KR',
          newSubscriberAvailability: true,
          price: { currencyCode: 'KRW', units: '99000' },
        },
      ],
    };

    await publisher.monetization.subscriptions.patch({
      packageName,
      productId: PRODUCT_ID,
      updateMask: 'basePlans',
      'regionsVersion.version': regionVersion,
      requestBody: {
        packageName,
        productId: PRODUCT_ID,
        basePlans: [...(subscription.basePlans ?? []).map(editableBasePlan), newPlan],
      },
    });

    subscription = await getSubscription();
    annual = (subscription.basePlans ?? []).find((plan) => plan.basePlanId === CORRECT_BASE_PLAN_ID);
    validateAnnual(annual, 'DRAFT');
  }

  if (annual.state !== 'ACTIVE') {
    await publisher.monetization.subscriptions.basePlans.activate({
      packageName,
      productId: PRODUCT_ID,
      basePlanId: CORRECT_BASE_PLAN_ID,
      requestBody: {},
    });
  }

  subscription = await getSubscription();
  annual = (subscription.basePlans ?? []).find((plan) => plan.basePlanId === CORRECT_BASE_PLAN_ID);
  validateAnnual(annual, 'ACTIVE');

  const wrong = (subscription.basePlans ?? []).find((plan) => plan.basePlanId === WRONG_BASE_PLAN_ID);
  if (wrong?.state === 'ACTIVE') {
    if (wrong.autoRenewingBasePlanType?.billingPeriodDuration !== 'P1M') {
      throw new Error('Refusing to deactivate the old base plan because it is no longer P1M');
    }
    await publisher.monetization.subscriptions.basePlans.deactivate({
      packageName,
      productId: PRODUCT_ID,
      basePlanId: WRONG_BASE_PLAN_ID,
      requestBody: {},
    });
  }

  subscription = await getSubscription();
  annual = (subscription.basePlans ?? []).find((plan) => plan.basePlanId === CORRECT_BASE_PLAN_ID);
  validateAnnual(annual, 'ACTIVE');
  const old = (subscription.basePlans ?? []).find((plan) => plan.basePlanId === WRONG_BASE_PLAN_ID);
  if (old && old.state !== 'INACTIVE') {
    throw new Error(`Expected ${WRONG_BASE_PLAN_ID} to be INACTIVE, got ${old.state}`);
  }

  process.stdout.write(
    JSON.stringify({
      ok: true,
      productId: PRODUCT_ID,
      activeBasePlan: {
        basePlanId: annual.basePlanId,
        state: annual.state,
        billingPeriodDuration: annual.autoRenewingBasePlanType.billingPeriodDuration,
        gracePeriodDuration: annual.autoRenewingBasePlanType.gracePeriodDuration,
        accountHoldDuration: annual.autoRenewingBasePlanType.accountHoldDuration,
        region: 'KR',
        price: 'KRW 99000',
      },
      oldBasePlan: old ? { basePlanId: old.basePlanId, state: old.state } : null,
    }, null, 2),
  );
}

main().catch((error) => {
  const status = error?.response?.status;
  const apiMessage = error?.response?.data?.error?.message;
  process.stderr.write(`${status ? `HTTP ${status}: ` : ''}${apiMessage || error.message}\n`);
  process.exitCode = 1;
});
