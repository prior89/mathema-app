import { z } from 'zod';
import type { AttemptAnalysis } from '../../infrastructure/ai/prompts/attempt-analyze.prompt';
import { WRONG_NOTE_INITIAL_COOLDOWN_DAYS } from './wrong-note-schedule.constants';

export const WrongNoteInsightJsonSchema = z.object({
  rootCause: z.string(),
  correctConcept: z.string(),
  drillSteps: z.array(z.string()).min(1).max(5),
  similarPatterns: z.array(z.string()).max(3),
  confidenceCalibration: z.enum(['over', 'under', 'aligned']),
  reviewIntervalDays: z.number().int().min(1).max(30),
  lang: z.enum(['ko', 'en']),
});

export type WrongNoteInsightJson = z.infer<typeof WrongNoteInsightJsonSchema>;

const ERROR_CODE_LABELS: Record<string, { ko: string; en: string }> = {
  SIGN: { ko: '부호 실수', en: 'Sign error' },
  ALG: { ko: '대수 변형 오류', en: 'Algebra manipulation' },
  CON: { ko: '개념 오해', en: 'Concept misunderstanding' },
  FORMULA: { ko: '공식 적용 오류', en: 'Formula misuse' },
  GRAPH: { ko: '그래프 해석 오류', en: 'Graph interpretation' },
  UNIT: { ko: '단위·스케일 오류', en: 'Unit / scale error' },
  CALC: { ko: '계산 실수', en: 'Calculation slip' },
  LOGIC: { ko: '논리·추론 오류', en: 'Logic error' },
};

function asStringSteps(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((s) => (typeof s === 'string' ? s.trim() : ''))
    .filter((s) => s.length > 0);
}

export function inferConfidenceCalibration(
  isCorrect: boolean,
  selfConfidenceScore?: number | null,
): WrongNoteInsightJson['confidenceCalibration'] {
  const conf = selfConfidenceScore ?? 3;
  if (isCorrect && conf >= 4) return 'aligned';
  if (isCorrect && conf <= 2) return 'under';
  if (!isCorrect && conf >= 4) return 'over';
  return 'aligned';
}

export function mapAttemptAnalysisToInsightJson(input: {
  analysis: AttemptAnalysis;
  conceptTags: string[];
  expectedSolutionSteps?: unknown;
  isCorrect: boolean;
  selfConfidenceScore?: number | null;
  lang: 'ko' | 'en' | 'hi';
}): WrongNoteInsightJson {
  const lang = input.lang === 'ko' ? 'ko' : 'en';
  const correctConcept =
    input.analysis.conceptWeakness[0]
    ?? input.conceptTags[0]
    ?? (lang === 'ko' ? '핵심 개념' : 'Key concept');

  const solutionSteps = asStringSteps(input.expectedSolutionSteps).slice(0, 3);
  const drillSteps = [
    input.analysis.recommendedAction,
    ...solutionSteps,
  ].filter((s, i, arr) => s.length > 0 && arr.indexOf(s) === i).slice(0, 5);

  const similarPatterns = input.analysis.errorCodes
    .slice(0, 3)
    .map((code) => ERROR_CODE_LABELS[code]?.[lang] ?? code);

  const mapped: WrongNoteInsightJson = {
    rootCause: input.analysis.reasoningSummary,
    correctConcept,
    drillSteps: drillSteps.length > 0 ? drillSteps : [input.analysis.recommendedAction],
    similarPatterns,
    confidenceCalibration: inferConfidenceCalibration(input.isCorrect, input.selfConfidenceScore),
    reviewIntervalDays: WRONG_NOTE_INITIAL_COOLDOWN_DAYS,
    lang,
  };

  return WrongNoteInsightJsonSchema.parse(mapped);
}