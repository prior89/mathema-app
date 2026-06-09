/**
 * MathHelper response shape — shared by queries.uploadProblemImage so the
 * Notes "+" modal can render the AI-solved payload.
 *
 * Earlier iterations exported solve/ocrSolve/generateChapterTest helpers, but
 * the Solver and Mocks tabs were absorbed: photo flow lives in
 * UploadProblemModal (calling /math-helper/ocr-solve directly via queries.ts),
 * and chapter tests now run through /mock-exams/chapter/:code/start.
 */

export type MathHelperSolveResponse = {
  detected: {
    classLevel: number;
    chapter: string;
    topic: string;
    chapterCode?: string | null;
    topicCode?: string | null;
    concepts: string[];
    conceptCodes: string[];
  };
  answer: string;
  isStudentCorrect?: boolean | null;
  explanation: string;
  /// Step-by-step worked derivation. Each entry is one "Step N." block
  /// from the solver and may contain literal "\n" newlines for multi-line
  /// reasoning. Rendered as a numbered list in UploadProblemModal.
  steps?: string[];
  /// One short "why this step" per entry in `steps` (Socratic pedagogy).
  stepRationales?: string[];
  personalizedLearning?: string | null;
  mistakeDiagnosis?: string | null;
  hints: string[];
  nextPractice: string[];
  verification: {
    isVerified: boolean;
    method: string;
    issues: string[];
    confidence: number;
    verifiedAnswer?: string | null;
    attempts: number;
    caution?: string | null;
  };
};
