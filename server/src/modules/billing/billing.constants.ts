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

/** Free-tier daily AI Solver call cap after the new-user grace window.
 *  Premium users bypass. Keep in sync with the pricing memory
 *  (`project_matheo_pricing_india`). */
export const FREE_TIER_SOLVER_LIMIT = 8;

/** Free-tier cap on problems visible per chapter mastery set (of 20 frozen).
 *  Raised 5→10 (2026-07-07): mastery practice is the free tier's core habit
 *  builder — 5 problems is below the threshold to reach the "it's working"
 *  moment or build any chapter mastery, and was the widest deviation from
 *  competitors (Photomath/Khan/Gauth keep core practice generous). The
 *  personalized ORDERING/sequencing of these problems stays premium. */
export const FREE_TIER_MASTERY_PROBLEMS = 10;

/** Daily cap on the OCR-only endpoint (/math-helper/ocr).
 *
 * OCR is deliberately NOT counted against the solver credit (so a misfired
 * upload / retake doesn't cost a solve), but the endpoint calls paid Mathpix +
 * GPT-vision, so an unbounded loop is a cost vector. This is a much looser
 * abuse ceiling than the solver cap: a legit free user doing ~8 solves/day
 * issues well under this. Premium bypasses, matching the solver policy. */
export const FREE_TIER_OCR_DAILY_LIMIT = 40;

/** Elevated daily cap during the post-signup grace window (PR-17). */
export const GRACE_SOLVER_LIMIT = 16;

/** Days after account creation during which GRACE_SOLVER_LIMIT applies. */
export const GRACE_PERIOD_DAYS = 7;

/** Cardless launch preview.
 *
 * This is intentionally NOT a Play Billing free trial. It lets a learner feel
 * the Premium loop before we ask for a payment method, then the Play paywall
 * can offer the normal monthly/yearly products later. That keeps launch trust
 * higher than a first-session "0 today, auto-renew later" funnel.
 */
export const PREMIUM_PREVIEW_PRODUCT_ID = 'premium_preview_3d';
export const PREMIUM_PREVIEW_DAYS = 3;

/** Non-purchasable entitlement reserved for the Google Play review account.
 *
 * Reviewers cannot be required to buy a subscription or start a trial. This
 * marker lets the dedicated, non-user reviewer account keep access to every
 * paid surface without pretending that its entitlement came from Google Play.
 * It must only be provisioned through the audited reviewer script.
 */
export const PREMIUM_REVIEW_PRODUCT_ID = 'premium_review';

export const PLAY_PRODUCT_IDS = ['premium_monthly', 'premium_yearly'] as const;
export type PlayProductId = (typeof PLAY_PRODUCT_IDS)[number];

export const MONETIZATION_STRATEGY = {
  mode: 'freemium_contextual_upgrade',
  free: {
    solverDailyLimit: FREE_TIER_SOLVER_LIMIT,
    graceSolverDailyLimit: GRACE_SOLVER_LIMIT,
    gracePeriodDays: GRACE_PERIOD_DAYS,
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
