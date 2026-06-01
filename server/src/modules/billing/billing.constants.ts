/**
 * Billing constants — kept in their own file so neither billing.service.ts
 * nor free-tier-solver-quota.guard.ts has to import each other just to read
 * a number. The previous arrangement (`FREE_TIER_SOLVER_LIMIT` exported
 * from the guard, imported by the service) was a constant-only cycle that
 * tsc happily compiled but Nest's reflect-metadata couldn't always resolve
 * at module-init time — caused intermittent `Nest can't resolve dependencies
 * of FreeTierSolverQuotaGuard (?, QuotaService)` crashes whenever the build
 * cache happened to evaluate the guard before the service.
 *
 * Keep this file dependency-free.
 */

/** Free-tier daily AI Solver call cap. Premium users bypass. Keep in sync
 *  with the pricing memory (`project_matheo_pricing_india`). */
export const FREE_TIER_SOLVER_LIMIT = 8;

/** Cardless launch preview.
 *
 * This is intentionally NOT a Play Billing free trial. It lets a learner feel
 * the Premium loop before we ask for a payment method, then the Play paywall
 * can offer the normal monthly/yearly products later. That keeps launch trust
 * higher than a first-session "0 today, auto-renew later" funnel.
 */
export const PREMIUM_PREVIEW_PRODUCT_ID = 'premium_preview_3d';
export const PREMIUM_PREVIEW_DAYS = 3;

export const PLAY_PRODUCT_IDS = ['premium_monthly', 'premium_yearly'] as const;
export type PlayProductId = (typeof PLAY_PRODUCT_IDS)[number];

export const MONETIZATION_STRATEGY = {
  mode: 'freemium_contextual_upgrade',
  free: {
    solverDailyLimit: FREE_TIER_SOLVER_LIMIT,
  },
  premium: {
    products: PLAY_PRODUCT_IDS,
    unlocks: [
      'unlimited_ai_solver',
      'full_mastery_sets',
      'adaptive_practice',
      'wrong_note_analysis',
      'weekly_reports',
    ],
  },
  premiumPreview: {
    productId: PREMIUM_PREVIEW_PRODUCT_ID,
    days: PREMIUM_PREVIEW_DAYS,
    paymentMethodRequired: false,
    eligibility: 'once_per_account_before_any_subscription',
  },
  playTrialPolicy: {
    defaultSurface: 'deferred',
    note: 'Use Play free trials later as an A/B test after content and support are stable.',
  },
} as const;
