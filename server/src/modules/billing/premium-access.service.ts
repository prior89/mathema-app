import { ForbiddenException, Injectable } from '@nestjs/common';
import { BillingService } from './billing.service';
import { FREE_TIER_MASTERY_PROBLEMS } from './billing.constants';
import { PremiumFeature } from './premium-feature.decorator';

/**
 * Service-level premium checks — used when a guard on the whole controller
 * is too coarse (e.g. strip insightJson on free tier, limit mastery set size).
 */
@Injectable()
export class PremiumAccessService {
  constructor(private readonly billing: BillingService) {}

  isGatingActive(): boolean {
    return this.billing.isBillingUiEnabled();
  }

  async hasPremiumAccess(userId: string): Promise<boolean> {
    if (!this.isGatingActive()) return true;
    return this.billing.isPremium(userId);
  }

  /**
   * Service-level equivalent of PremiumFeatureGuard. This is used when the
   * entitled account is not the requester (for example, a parent reading an
   * approved child's report). Callers must perform resource access checks
   * before this method so entitlement status cannot become an ID oracle.
   */
  async requirePremiumAccess(userId: string, feature: PremiumFeature): Promise<void> {
    if (await this.hasPremiumAccess(userId)) return;
    throw new ForbiddenException({
      error: 'PremiumRequired',
      message: 'This feature requires Matheo Premium.',
      feature,
      productSuggestion: 'premium_monthly',
    });
  }

  /** Free tier sees the first N problems of a frozen 20-problem mastery set. */
  async effectiveMasterySetIds(userId: string | undefined, ids: string[]): Promise<string[]> {
    if (!userId || ids.length === 0) return ids;
    if (await this.hasPremiumAccess(userId)) return ids;
    return ids.slice(0, FREE_TIER_MASTERY_PROBLEMS);
  }

  /** Hide LLM insight payload for free users when billing is on. */
  async redactInsightJson<T extends { insightJson?: unknown }>(
    userId: string,
    note: T,
  ): Promise<T> {
    if (await this.hasPremiumAccess(userId)) return note;
    return { ...note, insightJson: null };
  }
}
