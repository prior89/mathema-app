/* Maps a wrong-answer distractorType to the ConceptStep the student should
 * revisit. Hattie & Timperley's process-level feedback: rather than just
 * naming the error, send the learner back to the part of the concept lesson
 * that addresses the failure mode. AnswerFeedbackSheet renders the CTA when
 * a re-teach target exists; ConceptLessonScreen reads the focus query param
 * to scroll/highlight the relevant step.
 *
 * Mapping rationale:
 *   CONCEPT_CONFUSION   → MISCONCEPTION step (explicit wrong/why/correct
 *                         contrast — the literature's elaborated feedback).
 *   CALC_ERROR          → WORKED_EXAMPLE  (re-read the demonstrated
 *                         procedure with its "because" narration).
 *   PROCESS_SKIP        → CONCRETE        (drop to the concrete/pictorial
 *                         scaffold instead of staying at the abstract step).
 *   TIME_PRESSURE_GUESS → REFLECT         (self-regulation prompt — the
 *                         issue isn't the math but the strategy).
 */
import type { ConceptStepKind } from './queries';

export type DistractorType =
  | 'CONCEPT_CONFUSION'
  | 'CALC_ERROR'
  | 'PROCESS_SKIP'
  | 'TIME_PRESSURE_GUESS';

export const RETEACH_STEP_BY_DISTRACTOR: Record<DistractorType, ConceptStepKind> = {
  CONCEPT_CONFUSION: 'MISCONCEPTION',
  CALC_ERROR: 'WORKED_EXAMPLE',
  PROCESS_SKIP: 'CONCRETE',
  TIME_PRESSURE_GUESS: 'REFLECT',
};

export function reteachStepFor(
  distractorType: string | null | undefined,
): ConceptStepKind | null {
  if (!distractorType) return null;
  return RETEACH_STEP_BY_DISTRACTOR[distractorType as DistractorType] ?? null;
}

/** i18n key for the CTA label on AnswerFeedbackSheet. Caller resolves via
 *  useT(); null means no CTA should render. */
export function reteachCtaKey(
  distractorType: string | null | undefined,
): string | null {
  if (!distractorType) return null;
  switch (distractorType) {
    case 'CONCEPT_CONFUSION': return 'practice.reteach.misconception';
    case 'CALC_ERROR':        return 'practice.reteach.worked';
    case 'PROCESS_SKIP':      return 'practice.reteach.breakdown';
    case 'TIME_PRESSURE_GUESS': return 'practice.reteach.reflect';
    default: return null;
  }
}
