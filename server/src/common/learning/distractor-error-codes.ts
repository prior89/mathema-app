import { ErrorCode } from '@prisma/client';

/**
 * IN distractor taxonomy (ProblemChoice.distractorType) → ErrorCode.
 * Mirrors GradingService.analyze first-pass mapping. TIME_PRESSURE_GUESS is
 * intentionally unmapped — time pressure is handled as a separate signal.
 */
export const IN_DISTRACTOR_TO_ERROR_CODE: Record<string, ErrorCode> = {
  CONCEPT_CONFUSION: ErrorCode.CON,
  CALC_ERROR: ErrorCode.CALC,
  PROCESS_SKIP: ErrorCode.LOGIC,
};

/** KR distractor strings (ProblemChoice.distractorErrorCode) → ErrorCode. Unmapped strings drop. */
export const KR_DISTRACTOR_TO_ERROR_CODE: Record<string, ErrorCode> = {
  SIGN_ERROR: ErrorCode.SIGN,
  ARITHMETIC_ERROR: ErrorCode.CALC,
  CONCEPT_MISUNDERSTANDING: ErrorCode.CON,
  CONDITION_MISSING: ErrorCode.CONDITION_MISSING,
  DENOMINATOR_ERROR: ErrorCode.DENOMINATOR_ERROR,
  ALGEBRA_ERROR: ErrorCode.ALG,
  FORMULA_SELECTION_ERROR: ErrorCode.FORMULA,
  GRAPH_READING_ERROR: ErrorCode.GRAPH,
  GEOMETRY_PROPERTY_ERROR: ErrorCode.GEOMETRY_PROPERTY_ERROR,
  RATIO_SCALE_ERROR: ErrorCode.RATIO_SCALE_ERROR,
  PROBABILITY_COUNTING_ERROR: ErrorCode.PROBABILITY_COUNTING_ERROR,
  STATISTICS_INTERPRETATION_ERROR: ErrorCode.STATISTICS_INTERPRETATION_ERROR,
  SLOPE_INTERCEPT_CONFUSION: ErrorCode.SLOPE_INTERCEPT_CONFUSION,
  CORRESPONDING_PART_ERROR: ErrorCode.CORRESPONDING_PART_ERROR,
  AREA_RATIO_ERROR: ErrorCode.AREA_RATIO_ERROR,
  ADD_NUMERATOR_ONLY: ErrorCode.ADD_NUMERATOR_ONLY,
  // Common KR seed strings without a dedicated enum entry — fall back to CON
  // (concept misunderstanding) since EXPONENT/COORDINATE mistakes are
  // conceptually misapplied rules.
  EXPONENT_ERROR: ErrorCode.CON,
  COORDINATE_ERROR: ErrorCode.CON,
};

/** Resolve a choice's KR or IN distractor metadata to an ErrorCode (null when unmapped). */
export function choiceErrorCode(choice: {
  distractorErrorCode?: string | null;
  distractorType?: string | null;
}): ErrorCode | null {
  if (choice.distractorErrorCode) {
    return KR_DISTRACTOR_TO_ERROR_CODE[choice.distractorErrorCode] ?? null;
  }
  if (choice.distractorType) {
    return IN_DISTRACTOR_TO_ERROR_CODE[choice.distractorType] ?? null;
  }
  return null;
}
