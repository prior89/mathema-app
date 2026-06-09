/** CAT-lite adaptive diagnostic tuning (PR-05). */
export const ADAPTIVE_DIAGNOSTIC_CONFIG = {
  minItems: 6,
  maxItems: 12,
  stopSE: 0.35,
  minConceptsProbed: 6,
  itemsPerSet: 2,
} as const;

export type PlacementConceptScore = {
  conceptId: string;
  placementScore: number;
  standardError: number;
};

export type AdaptiveProblemPayload = {
  id: string;
  body: string;
  difficulty: string;
  difficultyLevel: number;
  step: {
    id: string;
    stepIndex: number;
    prompt: string;
    choices: Array<{ id: string; choiceIndex: number; text: string }>;
  } | null;
  conceptLessonId: string | null;
};