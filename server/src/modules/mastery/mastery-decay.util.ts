/**
 * Khan-style mastery decay (2026-06-11 audit, verdict 5).
 *
 * A trajectory that is not refreshed by new attempts slowly demotes, so the
 * Mastery tab reflects current ability rather than historical peak and
 * nudges the student back into review.
 *
 * Policy:
 *   - 14-day grace window: no decay while knowledge is fresh.
 *   - After the grace window, -0.5 points per idle day.
 *   - Floor at 35 (or the current score if already below): decay signals
 *     "needs refresh" — it never erases the evidence that the concept was
 *     once learned. 35 sits inside the <40 danger band on the Mastery tab,
 *     so a fully decayed concept surfaces as needing attention.
 *
 * Applied lazily — at write time (updateAfterAttempt bases its delta on the
 * decayed score, making demotion durable) and at the primary read surfaces
 * (Mastery tab trajectory list, KR grade heatmap). No cron required.
 */
export const MASTERY_DECAY_GRACE_DAYS = 14;
export const MASTERY_DECAY_PER_DAY = 0.5;
export const MASTERY_DECAY_FLOOR = 35;

const MS_PER_DAY = 86_400_000;

export function applyMasteryDecay(
  score: number,
  lastAttemptAt: Date | string | null | undefined,
  now: number = Date.now(),
): number {
  if (lastAttemptAt == null) return score;
  const idleDays =
    (now - new Date(lastAttemptAt).getTime()) / MS_PER_DAY - MASTERY_DECAY_GRACE_DAYS;
  if (idleDays <= 0) return score;
  const floor = Math.min(score, MASTERY_DECAY_FLOOR);
  return Math.max(floor, score - MASTERY_DECAY_PER_DAY * idleDays);
}
