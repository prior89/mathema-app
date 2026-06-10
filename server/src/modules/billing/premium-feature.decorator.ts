import { SetMetadata } from '@nestjs/common';

export const PREMIUM_FEATURE_KEY = 'premium_feature';

/** Premium tiers from MONETIZATION_STRATEGY.premium.unlocks */
export type PremiumFeature =
  | 'weekly_reports'
  | 'adaptive_practice'
  | 'wrong_note_analysis'
  | 'full_mastery_sets';

export const RequirePremium = (feature: PremiumFeature) =>
  SetMetadata(PREMIUM_FEATURE_KEY, feature);