import { track } from './analytics';

/** Canonical production learning-event names — keep in sync with
 *  server learning-metrics.service recentLearningEvents filters. */
export const LearningEvents = {
  studySessionStart: (chapterCode: string) =>
    track('study.session.start', { chapterCode }),
  studyProblemSubmit: (p: {
    chapterCode: string;
    problemId: string;
    isCorrect: boolean;
    durationSec: number;
    questionNum: number;
  }) =>
    track('study.problem.submit', p),
  studySessionEnd: (p: {
    chapterCode: string;
    correct: number;
    wrong: number;
    total: number;
  }) =>
    track('study.session.end', p),

  reviewQueueOpen: (eligible: number) =>
    track('review.queue.open', { eligible }),
  reviewProblemSubmit: (p: {
    wrongNoteId: string;
    problemId: string;
    isCorrect: boolean;
    durationSec: number;
    wrongAttempts: number;
  }) =>
    track('review.problem.submit', p),
  reviewProblemMastered: (p: { wrongNoteId: string; problemId: string }) =>
    track('review.problem.mastered', p),

  solverOcrStart: () => track('solver.ocr.start'),
  solverOcrDone: (p: { confidence: number | null; source: string; textLen: number }) =>
    track('solver.ocr.done', p),
  solverOcrRetake: () => track('solver.ocr.retake'),
  solverResultShown: (p: { problemId?: string | null; hasSteps: boolean }) =>
    track('solver.result.shown', p),
  solverPracticeNow: (problemId: string) =>
    track('solver.practice.now', { problemId }),

  notesTabOpen: (p: { total: number; active: number; mastered: number }) =>
    track('notes.tab.open', p),
  notesCardOpen: (p: { wrongNoteId: string; status: string }) =>
    track('notes.card.open', p),
} as const;