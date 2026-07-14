import { describe, expect, it, vi } from 'vitest';

// billing.ts pulls in Capacitor + the native bridge + billing-recovery at import
// time; stub them so we can unit-test the pure offer-selection helpers.
vi.mock('@capacitor/core', () => ({
  Capacitor: { isNativePlatform: () => true, getPlatform: () => 'android' },
}));
vi.mock('../native/billing-bridge', () => ({ Billing: {} }));
vi.mock('./api', () => ({ get: vi.fn(), post: vi.fn() }));

import { displayRecurringPhase, introPhase, selectPaidOffer } from './billing';
import type { BillingProductDetails } from '../native/billing-bridge';

type Phase = BillingProductDetails['offers'][number]['pricingPhases'][number];
type Offer = BillingProductDetails['offers'][number];

const infinitePhase = (micros: string, billingPeriod = 'P1M'): Phase => ({
  priceFormatted: '₩4,900',
  priceAmountMicros: micros,
  currencyCode: 'KRW',
  billingPeriod,
  recurrenceMode: 1, // INFINITE_RECURRING = base/renewal phase
  billingCycleCount: 0,
});

const finiteIntroPhase = (micros: string, cycles = 3): Phase => ({
  priceFormatted: '₩2,900',
  priceAmountMicros: micros,
  currencyCode: 'KRW',
  billingPeriod: 'P1M',
  recurrenceMode: 2, // FINITE_RECURRING = promo phase
  billingCycleCount: cycles,
});

const freeTrialPhase = (): Phase => ({
  priceFormatted: '₩0',
  priceAmountMicros: '0',
  currencyCode: 'KRW',
  billingPeriod: 'P1W',
  recurrenceMode: 2,
  billingCycleCount: 1,
});

const basePlan: Offer = {
  offerToken: 'tok-base',
  basePlanId: 'monthly',
  offerId: null,
  pricingPhases: [infinitePhase('4900000000')],
};
const launchPromo: Offer = {
  offerToken: 'tok-promo',
  basePlanId: 'monthly',
  offerId: 'launch-60',
  pricingPhases: [finiteIntroPhase('2900000000'), infinitePhase('4900000000')],
};
const cheaperPromo: Offer = {
  offerToken: 'tok-promo-cheap',
  basePlanId: 'monthly',
  offerId: 'launch-90',
  pricingPhases: [finiteIntroPhase('1900000000'), infinitePhase('4900000000')],
};
const freeTrial: Offer = {
  offerToken: 'tok-trial',
  basePlanId: 'monthly',
  offerId: 'trial',
  pricingPhases: [freeTrialPhase(), infinitePhase('4900000000')],
};
const misconfiguredYearlyMonthly: Offer = {
  offerToken: 'tok-yearly-but-monthly',
  basePlanId: 'yearly',
  offerId: null,
  pricingPhases: [infinitePhase('99000000000', 'P1M')],
};
const realYearly: Offer = {
  offerToken: 'tok-real-yearly',
  basePlanId: 'annual-2026',
  offerId: null,
  pricingPhases: [infinitePhase('99000000000', 'P1Y')],
};

const product = (offers: Offer[]): BillingProductDetails => ({
  productId: 'premium_monthly',
  title: 'Premium',
  description: '',
  offers,
});

describe('selectPaidOffer', () => {
  it('prefers a promotional offer (non-empty offerId) over the base plan', () => {
    // The old order picked the base plan → users paid full price and never saw
    // the launch promo. Selection must now pass the promo offerToken.
    const chosen = selectPaidOffer(product([basePlan, launchPromo]));
    expect(chosen.offerId).toBe('launch-60');
    expect(chosen.offerToken).toBe('tok-promo');
  });

  it('falls back to the base plan when no promo is offered', () => {
    const chosen = selectPaidOffer(product([basePlan]));
    expect(chosen.offerId).toBeNull();
    expect(chosen.offerToken).toBe('tok-base');
  });

  it('never selects a free-trial-only path as the paid offer', () => {
    const chosen = selectPaidOffer(product([basePlan, freeTrial]));
    expect(chosen.offerId).toBeNull(); // trial excluded → base plan
  });

  it('among multiple promos, picks the cheapest first phase', () => {
    const chosen = selectPaidOffer(product([launchPromo, cheaperPromo, basePlan]));
    expect(chosen.offerId).toBe('launch-90');
  });

  it('refuses a yearly product whose recurring phase is actually monthly', () => {
    expect(selectPaidOffer(product([misconfiguredYearlyMonthly]), 'P1Y')).toBeUndefined();
  });

  it('selects only the real annual offer when both periods are active', () => {
    const chosen = selectPaidOffer(
      product([misconfiguredYearlyMonthly, realYearly]),
      'P1Y',
    );
    expect(chosen?.offerToken).toBe('tok-real-yearly');
    expect(displayRecurringPhase(chosen!)?.billingPeriod).toBe('P1Y');
  });
});

describe('introPhase / displayRecurringPhase', () => {
  it('introPhase returns the discounted finite phase, not the base', () => {
    const phase = introPhase(launchPromo);
    expect(phase?.recurrenceMode).toBe(2);
    expect(phase?.priceAmountMicros).toBe('2900000000');
  });

  it('introPhase is null for a plain base plan', () => {
    expect(introPhase(basePlan)).toBeNull();
  });

  it('displayRecurringPhase returns the infinite base (renewal) phase', () => {
    const phase = displayRecurringPhase(launchPromo);
    expect(phase.recurrenceMode).toBe(1);
    expect(phase.priceAmountMicros).toBe('4900000000');
  });
});
