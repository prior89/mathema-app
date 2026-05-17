import { post } from './api';

export type MathHelperSolveRequest = {
  classLevel?: number;
  question: string;
  studentAnswer?: string;
};

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

export type MathHelperOcrSolveResponse = {
  extractedText: string;
  latex?: string | null;
  confidence?: number | null;
  source: 'mathpix';
  result: MathHelperSolveResponse;
};

export type MathHelperAssessmentQuestion = {
  questionId: string;
  source: string;
  classLevel: number;
  chapterCode?: string | null;
  topicCode?: string | null;
  conceptCodes: string[];
  difficultyLevel: number;
  estimatedTimeSec: number;
  questionType: string;
  body: string;
  answer?: string | null;
  hints: string[];
  solution?: Record<string, unknown> | null;
  adaptiveReason?: string | null;
};

export type MathHelperAssessmentResponse = {
  assessmentType: string;
  title: string;
  classLevel?: number | null;
  chapterCode?: string | null;
  durationMinutes: number;
  questionCount: number;
  adaptiveBasis: Record<string, unknown>;
  revisionFocus: string[];
  questions: MathHelperAssessmentQuestion[];
};

export const solveMathHelper = (body: MathHelperSolveRequest) =>
  post<MathHelperSolveResponse>('/math-helper/solve', body);

export const ocrSolveMathHelper = (body: { file: File; classLevel?: number; studentAnswer?: string }) => {
  const fd = new FormData();
  fd.append('file', body.file);
  if (body.classLevel) fd.append('classLevel', String(body.classLevel));
  if (body.studentAnswer?.trim()) fd.append('studentAnswer', body.studentAnswer.trim());
  return post<MathHelperOcrSolveResponse>('/math-helper/ocr-solve', fd, { isMultipart: true });
};

export const generateChapterTest = (body: {
  classLevel?: number;
  chapterCode?: string;
  chapter?: string;
  questionCount?: number;
}) => post<MathHelperAssessmentResponse>('/math-helper/assessments/chapter-test', body);

export const generateWeeklyAssessment = (body: { classLevel?: number; questionCount?: number }) =>
  post<MathHelperAssessmentResponse>('/math-helper/assessments/weekly', body);
