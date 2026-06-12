import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';

/** Public feature flags exposed to the client (PR-03). */
export const PUBLIC_FEATURE_FLAGS = [
  'adaptive_diagnostic',
  'first_session_achievement',
  'kr_cold_start',
  'student_efficacy_card',
  // Try-first guest mode. Evaluated pre-auth (no userId), so the bucket is
  // unavailable — effective values are 0 (off) or 100 (on); use it as a
  // dark-ship kill switch rather than a %-ramp.
  'guest_mode',
] as const;

export type PublicFeatureFlag = (typeof PUBLIC_FEATURE_FLAGS)[number];

const ENV_KEY: Record<PublicFeatureFlag, string> = {
  adaptive_diagnostic: 'FEATURE_ADAPTIVE_DIAGNOSTIC_PCT',
  first_session_achievement: 'FEATURE_FIRST_SESSION_ACHIEVEMENT_PCT',
  kr_cold_start: 'FEATURE_KR_COLD_START_PCT',
  student_efficacy_card: 'FEATURE_STUDENT_EFFICACY_CARD_PCT',
  guest_mode: 'FEATURE_GUEST_MODE_PCT',
};

@Injectable()
export class FeatureFlagsService {
  constructor(private readonly config: ConfigService) {}

  /** Stable 0–99 bucket for %-rollout (same user always gets same bucket per flag). */
  rolloutBucket(userId: string, flag: PublicFeatureFlag): number {
    const hash = createHash('sha256').update(`${flag}:${userId}`).digest();
    return hash.readUInt32BE(0) % 100;
  }

  rolloutPercent(flag: PublicFeatureFlag): number {
    const raw = this.config.get<string>(ENV_KEY[flag]);
    const pct = raw != null ? Number.parseInt(raw, 10) : 0;
    if (!Number.isFinite(pct)) return 0;
    return Math.max(0, Math.min(100, pct));
  }

  isEnabled(flag: PublicFeatureFlag, userId?: string | null): boolean {
    const pct = this.rolloutPercent(flag);
    if (pct >= 100) return true;
    if (pct <= 0) return false;
    if (!userId) return false;
    return this.rolloutBucket(userId, flag) < pct;
  }

  getPublicFlags(userId?: string | null): Record<PublicFeatureFlag, boolean> {
    return Object.fromEntries(
      PUBLIC_FEATURE_FLAGS.map((flag) => [flag, this.isEnabled(flag, userId)]),
    ) as Record<PublicFeatureFlag, boolean>;
  }
}