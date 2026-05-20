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
