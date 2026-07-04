import { createHash } from 'crypto';

/**
 * A/B cohorting for the personalized-exam SELECTION rule.
 *
 * We shipped a research-backed change (target the reachable-weak "productive
 * struggle" band, not the absolute weakest). The literature + our simulation
 * agree on the DIRECTION but the magnitude is empirical — the only real judge is
 * a live A/B (one-chapter). This util assigns each user a stable arm so the two
 * rules can run side by side, and so the new rule can be dialled back to 0%
 * without a deploy if it ever misbehaves.
 *
 *   RECOMMENDER_AB_SPLIT = percent (0..100) of users on the NEW rule.
 *     100 (default) → everyone on 'productive' (current behaviour, no A/B).
 *     0             → everyone on 'legacy' (instant revert, no deploy).
 *     50            → deterministic ~50/50 split for a live A/B.
 *
 * Assignment is a stable hash of userId, so a user never flips arms between
 * requests (which would corrupt the experiment and confuse the learner).
 */
export type RecommenderArm = 'productive' | 'legacy';

export function recommenderSplitPercent(splitEnv = process.env.RECOMMENDER_AB_SPLIT): number {
  const raw = parseInt(splitEnv ?? '100', 10);
  return Number.isNaN(raw) ? 100 : Math.max(0, Math.min(100, raw));
}

/** 0..99 stable bucket for a user (uniform, deterministic). */
export function userBucket(userId: string): number {
  const h = createHash('sha256').update(String(userId)).digest();
  return h.readUInt32BE(0) % 100;
}

export function recommenderArm(userId: string, splitEnv = process.env.RECOMMENDER_AB_SPLIT): RecommenderArm {
  const split = recommenderSplitPercent(splitEnv);
  if (split >= 100) return 'productive';
  if (split <= 0) return 'legacy';
  return userBucket(userId) < split ? 'productive' : 'legacy';
}
