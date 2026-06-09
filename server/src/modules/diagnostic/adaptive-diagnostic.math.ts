import { ADAPTIVE_DIAGNOSTIC_CONFIG } from './adaptive-diagnostic.constants';

export type AttemptSnapshot = {
  isCorrect: boolean;
  confidence?: number | null;
  conceptIds: string[];
};

export function confidenceVariance(values: number[]): number {
  if (values.length <= 1) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  return values.reduce((a, x) => a + (x - mean) ** 2, 0) / values.length;
}

export function standardErrorForConcept(
  attempts: Array<{ confidence?: number | null }>,
): number {
  const n = Math.max(1, attempts.length);
  const confs = attempts
    .map((a) => a.confidence)
    .filter((c): c is number => c != null && c >= 1 && c <= 4);
  const cv = confidenceVariance(confs);
  return (1 / Math.sqrt(n)) * (1 + 0.1 * cv);
}

export function placementScoreForConcept(
  attempts: Array<{ isCorrect: boolean; confidence?: number | null }>,
): number {
  if (!attempts.length) return 0;
  let weighted = 0;
  let total = 0;
  for (const a of attempts) {
    const w = a.confidence != null ? 0.5 + a.confidence / 8 : 1;
    weighted += (a.isCorrect ? 1 : 0) * w;
    total += w;
  }
  return Math.round((weighted / total) * 100);
}

export function buildConceptScores(
  attempts: AttemptSnapshot[],
): Array<{ conceptId: string; placementScore: number; standardError: number }> {
  const byConcept = new Map<string, Array<{ isCorrect: boolean; confidence?: number | null }>>();
  for (const a of attempts) {
    for (const conceptId of a.conceptIds) {
      const list = byConcept.get(conceptId) ?? [];
      list.push({ isCorrect: a.isCorrect, confidence: a.confidence });
      byConcept.set(conceptId, list);
    }
  }
  return [...byConcept.entries()].map(([conceptId, rows]) => ({
    conceptId,
    placementScore: placementScoreForConcept(rows),
    standardError: standardErrorForConcept(rows),
  }));
}

export function meanStandardError(
  scores: Array<{ standardError: number }>,
): number {
  if (!scores.length) return 1;
  return scores.reduce((a, s) => a + s.standardError, 0) / scores.length;
}

export function shouldStopAdaptive(itemsAnswered: number, meanSE: number): boolean {
  const { minItems, maxItems, stopSE } = ADAPTIVE_DIAGNOSTIC_CONFIG;
  if (itemsAnswered >= maxItems) return true;
  if (itemsAnswered >= minItems && meanSE < stopSE) return true;
  return false;
}

/** Map last answer → target difficultyLevel 1–5 for next item selection. */
export function targetDifficultyLevel(
  isCorrect: boolean,
  confidence?: number | null,
): number {
  if (isCorrect && (confidence ?? 3) >= 3) return 4;
  if (!isCorrect || (confidence != null && confidence <= 2)) return 2;
  return 3;
}