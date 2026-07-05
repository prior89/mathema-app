import { z } from 'zod';
import type { AttemptAnalysis } from '../../infrastructure/ai/prompts/attempt-analyze.prompt';
import { WRONG_NOTE_INITIAL_COOLDOWN_DAYS } from './wrong-note-schedule.constants';
import { KR_DISTRACTOR_TO_ERROR_CODE, IN_DISTRACTOR_TO_ERROR_CODE } from '../../common/learning/distractor-error-codes';

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

/**
 * Per-error-code EXPLANATION — a specific "what likely went wrong" + a targeted
 * "how to fix it", so the wrong-note cause reads as a couple of concrete
 * sentences instead of a one-word label. LLM-free and native-language.
 */
type ErrorDetail = { cause: string; fix: string };
const ERROR_CODE_DETAIL: Record<string, { ko: ErrorDetail; en: ErrorDetail }> = {
  SIGN: {
    ko: { cause: '부호를 다루는 과정에서 어긋났어요. 항을 이항하거나 괄호를 풀 때 +와 −가 뒤바뀌는 지점을 놓치기 쉬워요.', fix: '각 항의 부호를 하나씩 표시하며 다시 풀고, 이항·분배할 때 부호가 제대로 바뀌었는지 확인하세요.' },
    en: { cause: 'The slip was in handling signs — a + and − most likely got swapped while moving a term across or expanding a bracket.', fix: 'Re-solve while marking the sign of every term, and double-check the sign flips when you move or distribute terms.' },
  },
  ALG: {
    ko: { cause: '식을 정리·변형하는 과정에서 한 단계가 어긋났어요. 전개, 인수분해, 양변 연산 중 하나에서 등식이 깨진 경우가 많아요.', fix: '한 줄씩 등식이 유지되는지 확인하며 천천히 변형하고, 의심되는 단계는 간단한 값을 대입해 검산하세요.' },
    en: { cause: 'One algebra step broke the equality — usually an expansion, factoring, or an operation done to only one side.', fix: 'Rework it line by line, checking the equality holds each step, and test a suspect step by plugging in a simple value.' },
  },
  CON: {
    ko: { cause: '문제의 핵심 개념을 실제와 살짝 다르게 이해한 것 같아요. 정의나 성립 조건을 조금만 다르게 적용해도 답이 완전히 달라져요.', fix: '핵심 개념의 정의와 조건을 다시 확인하고, 그 개념이 이 문제에 어떻게 적용되는지 한 문장으로 설명해 보세요.' },
    en: { cause: 'The key concept was understood a little differently from its real definition — a small mismatch in the rule or its conditions flips the whole answer.', fix: 'Recheck the definition and when it applies, then explain in one sentence how it maps onto this problem.' },
  },
  FORMULA: {
    ko: { cause: '공식을 잘못 고르거나 값을 자리에 잘못 대입했어요. 비슷해 보이는 공식이나 변수 순서를 헷갈리기 쉬운 자리예요.', fix: '어떤 공식을 왜 쓰는지 먼저 정하고, 각 변수에 들어갈 값을 표로 정리한 뒤 대입하세요.' },
    en: { cause: 'The wrong formula was picked, or values went into the wrong slots — easy to confuse look-alike formulas or variable order here.', fix: 'Decide which formula and why first, then lay out each variable and its value in a table before substituting.' },
  },
  GRAPH: {
    ko: { cause: '그래프나 도형에서 정보를 읽는 과정에서 어긋났어요. 축, 눈금, 교점, 기울기 중 하나를 놓친 경우가 많아요.', fix: '축과 눈금 단위부터 확인하고, 교점·절편·기울기를 그림에 직접 표시하며 읽어 보세요.' },
    en: { cause: 'Something was misread off the graph or figure — often an axis, a scale, an intersection, or a slope.', fix: 'Start from the axes and scale, then mark the intercepts, intersections, and slope on the figure as you read them.' },
  },
  UNIT: {
    ko: { cause: '단위나 축척을 놓쳤어요. 단위를 통일하지 않거나 배율을 빠뜨리면 방법이 맞아도 크기만 틀리게 나와요.', fix: '모든 값을 같은 단위로 먼저 바꾼 뒤 계산하고, 마지막에 답의 단위가 맞는지 확인하세요.' },
    en: { cause: 'A unit or scale was dropped — mixing units or missing a conversion factor makes only the magnitude wrong even when the method is right.', fix: 'Convert everything to the same unit before computing, and check the unit of the final answer.' },
  },
  CALC: {
    ko: { cause: '풀이 방향은 맞지만 계산 도중 실수가 있었어요. 자릿수, 분수, 약분 같은 단순 연산에서 자주 생겨요.', fix: '중간 계산을 건너뛰지 말고 한 줄씩 쓰고, 구한 답을 원래 식에 넣어 검산하세요.' },
    en: { cause: 'The approach was right but a step of arithmetic slipped — commonly a digit, a fraction, or a cancellation.', fix: 'Write each intermediate step instead of skipping, and verify by substituting your answer back into the original.' },
  },
  LOGIC: {
    ko: { cause: '조건들을 연결해 결론으로 잇는 추론에서 어긋났어요. 조건을 빠뜨리거나 순서를 바꾸면 결론이 달라져요.', fix: '주어진 조건을 모두 나열하고, 각 조건이 결론까지 어떻게 이어지는지 화살표로 연결해 보세요.' },
    en: { cause: 'The reasoning that chains the conditions to the conclusion went off — a missed condition or a reversed step changes the result.', fix: 'List every given condition and draw arrows showing how each one leads toward the conclusion.' },
  },
};

/**
 * Normalize whatever taxonomy a WrongNote.errorType was stored in (canonical
 * short code like 'CON', a raw KR distractor string like 'CONCEPT_MISUNDERSTANDING',
 * or a raw IN distractorType like 'CALC_ERROR') to a canonical code present in
 * ERROR_CODE_LABELS — so the why-wrong label works regardless of market.
 */
// Prisma `ErrorType` enum values (the user-facing WrongNote.errorType) mapped to
// the canonical mechanism code. These are the values that actually reach us in
// production (160 CONCEPT_MISUNDERSTANDING + 60 CALCULATION_MISTAKE of 220 notes);
// resolving them here — not by coincidental membership in a distractor map — is
// what turns the generic cause into the concept-anchored, mechanism-specific one.
// TIME_SHORTAGE / OTHER have no math-mechanism detail and intentionally fall through.
const ERRORTYPE_TO_CODE: Record<string, string> = {
  CONCEPT_MISUNDERSTANDING: 'CON',
  CALCULATION_MISTAKE: 'CALC',
};

function canonicalErrorCode(raw?: string | null): string | null {
  if (!raw) return null;
  const up = raw.toUpperCase();
  if (ERROR_CODE_LABELS[up]) return up;
  const et = ERRORTYPE_TO_CODE[up];
  if (et && ERROR_CODE_LABELS[et]) return et;
  const kr = KR_DISTRACTOR_TO_ERROR_CODE[up] ?? KR_DISTRACTOR_TO_ERROR_CODE[raw];
  if (kr && ERROR_CODE_LABELS[kr]) return kr;
  const inc = IN_DISTRACTOR_TO_ERROR_CODE[up] ?? IN_DISTRACTOR_TO_ERROR_CODE[raw];
  if (inc && ERROR_CODE_LABELS[inc]) return inc;
  return null;
}

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

/**
 * Deterministic, LLM-free "why you got it wrong" insight. Built from the error
 * type + concept + formula the problem already carries, so EVERY wrong note
 * explains something the moment it's opened — no AI_TRAINING consent, no Redis
 * worker, no confidence gate, no ads, no paywall. The async LLM pass (when it
 * runs and clears confidence) upgrades this to a richer insightJson.
 */
export function buildFallbackInsight(
  card: {
    errorTypeRaw?: string | null;
    problemConcept?: string | null;
    problemFormula?: string | null;
  },
  langIn: 'ko' | 'en' | 'hi',
): WrongNoteInsightJson {
  const lang = langIn === 'ko' ? 'ko' : 'en';
  const code = canonicalErrorCode(card.errorTypeRaw);
  const errLabel = code ? ERROR_CODE_LABELS[code]?.[lang] : undefined;
  const detail = code ? ERROR_CODE_DETAIL[code]?.[lang] : undefined;
  const hasConcept = !!card.problemConcept?.trim();
  const concept = card.problemConcept?.trim() || (lang === 'ko' ? '핵심 개념' : 'the key concept');

  // Root cause: a specific couple of sentences (what likely went wrong), anchored
  // to this problem's concept — not a one-word label.
  let rootCause: string;
  if (detail) {
    const anchor = hasConcept
      ? (lang === 'ko'
          ? ` 특히 '${concept}' 개념을 이 문제에 적용하는 지점을 다시 짚어 보세요.`
          : ` In particular, recheck how "${concept}" applies to this problem.`)
      : '';
    rootCause = detail.cause + anchor;
  } else {
    rootCause = lang === 'ko'
      ? `'${concept}' 개념을 적용하는 과정에서 어긋난 것 같아요. 풀이 단계를 하나씩 되짚으며 어디서 막혔는지 찾아보세요.`
      : `The slip was in applying "${concept}". Retrace your steps one at a time to find where it broke.`;
  }

  // Drill steps: the targeted remedy first, then concept, formula, re-solve.
  const drillSteps: string[] = [];
  if (detail) drillSteps.push(detail.fix);
  drillSteps.push(lang === 'ko' ? `핵심 개념 다시 보기: ${concept}` : `Revisit the key idea: ${concept}`);
  if (card.problemFormula?.trim()) {
    drillSteps.push(lang === 'ko' ? `공식 확인: ${card.problemFormula.trim()}` : `Check the formula: ${card.problemFormula.trim()}`);
  }
  drillSteps.push(lang === 'ko' ? '변형 문제로 다시 풀어 확실히 익히기' : 'Re-solve a fresh variant to lock it in');

  return WrongNoteInsightJsonSchema.parse({
    rootCause,
    correctConcept: concept,
    drillSteps: drillSteps.slice(0, 5),
    similarPatterns: errLabel ? [errLabel] : [],
    confidenceCalibration: 'aligned',
    reviewIntervalDays: WRONG_NOTE_INITIAL_COOLDOWN_DAYS,
    lang,
  });
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