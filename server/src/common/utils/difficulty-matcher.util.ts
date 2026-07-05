import { Difficulty } from '../enums/difficulty.enum';

/**
 * Vygotsky ZPD (근접발달영역) 적용:
 *   학습 효율은 정답 확률 70-85% 근처에서 최대.
 *   너무 쉬우면 지루(boredom), 너무 어려우면 좌절(anxiety).
 *
 * mastery score → 권장 난이도 셋:
 *   < 40   : MIDDLE                        (개념 정착 단계)
 *   < 65   : MIDDLE, UPPER_MIDDLE          (응용력 형성)
 *   < 85   : UPPER_MIDDLE, SEMI_KILLER     (실전 진입)
 *   ≥ 85   : SEMI_KILLER, KILLER           (변별력 훈련)
 */
export function recommendedDifficulties(score: number): Difficulty[] {
  if (score < 40) return [Difficulty.MIDDLE];
  if (score < 65) return [Difficulty.MIDDLE, Difficulty.UPPER_MIDDLE];
  if (score < 85) return [Difficulty.UPPER_MIDDLE, Difficulty.SEMI_KILLER];
  return [Difficulty.SEMI_KILLER, Difficulty.KILLER];
}

/**
 * 모의고사 30문제 난이도 분포 비율 (CBSE Pre-Board / JEE Mock 실전 분포 근사):
 *   중 50% / 중상 30% / 준킬러 13% / 킬러 7%
 *   약점 단원에서는 중·중상 비율을 더 높여 구성한다.
 */
/**
 * Concept/unit SELECTION weight for a personalized exam.
 *
 * Research (triangulated 2026-07): the Eighty-Five-Percent Rule (Wilson et al.,
 * Nature Comms 2019), Bjork's desirable difficulties, and Vygotsky's ZPD all
 * agree that learning is fastest at the *reachable-weak* frontier (~75-85%
 * success) — NOT at the absolute weakest concept, whose problems are effectively
 * unreachable (below productive struggle, usually because prerequisites are
 * still missing). Our own Monte-Carlo simulation of this app (8k runs on the
 * real 43-chapter DAG) reproduced this: "target the single weakest" ranked dead
 * last across every parameter regime; targeting the reachable-weak band won.
 *
 * So the selection weight is  weakness x reachability, floored:
 *   - room  = (100 - score)/100   — weaker concepts have more room to gain.
 *   - reach = min(1, score/KNEE)  — below KNEE mastery even the easiest problems
 *             fall short of productive struggle, so we de-prioritise them (their
 *             prerequisites should come up first; as they do, the concept's
 *             score rises into the productive band and its weight climbs).
 *
 * Net effect vs the old `max(5, 100 - score)` (pure weakness): the peak moves
 * off the absolute weakest onto the reachable-weak band, and mastered concepts
 * still taper out. Difficulty *within* a chosen concept stays ZPD-matched by
 * examDifficultyDistribution(). Explicit prerequisite-DAG gating is a follow-up.
 */
export const PRODUCTIVE_STRUGGLE_KNEE = 30;
export const PRODUCTIVE_STRUGGLE_FLOOR = 10;

export function productiveStruggleWeight(score: number): number {
  const s = Math.max(0, Math.min(100, score));
  const room = (100 - s) / 100;
  const reach = Math.min(1, s / PRODUCTIVE_STRUGGLE_KNEE);
  return PRODUCTIVE_STRUGGLE_FLOOR + 90 * room * reach;
}

export function examDifficultyDistribution(score: number): Record<Difficulty, number> {
  if (score < 40) {
    return { MIDDLE: 0.7, UPPER_MIDDLE: 0.25, SEMI_KILLER: 0.05, KILLER: 0 } as any;
  }
  if (score < 65) {
    return { MIDDLE: 0.55, UPPER_MIDDLE: 0.3, SEMI_KILLER: 0.1, KILLER: 0.05 } as any;
  }
  if (score < 85) {
    return { MIDDLE: 0.4, UPPER_MIDDLE: 0.35, SEMI_KILLER: 0.18, KILLER: 0.07 } as any;
  }
  return { MIDDLE: 0.3, UPPER_MIDDLE: 0.3, SEMI_KILLER: 0.25, KILLER: 0.15 } as any;
}
