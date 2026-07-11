import { get, post } from './api';

export type DashboardSummary = {
  todayMinutes: number; todayGoalMinutes: number;
  streakDays: number; weeklyAccuracy: number; weeklyAccuracyDelta: number;
  /** 모의고사 응시 없으면 null — UI 가 "—" 로 표시. */
  expectedGrade: number | null; expectedGradeFrom: number | null;
};
export type Mastery = { subject: string; value: number; unitId: string };
export type RecommendCard = {
  tag: string; tagColor: string; unit: string; title: string;
  reason: string; time: string; type: string; icon: string;
  /** Semantic urgency of `reason` — server-set, drives the line's color.
      Optional: older backends omit it (render neutral). */
  tone?: 'urgent' | 'info' | 'positive';
  unitId: string | null;
  /** First-session plan direct route (PR-07). */
  chapterCode?: string | null;
  route?: string | null;
};
export type WrongNoteInsightJson = {
  rootCause: string;
  correctConcept: string;
  drillSteps: string[];
  similarPatterns: string[];
  confidenceCalibration: 'over' | 'under' | 'aligned';
  reviewIntervalDays: number;
  lang: 'ko' | 'en';
};

export type WrongNoteCard = {
  id: string; problemId: string;
  /** ConceptLesson chapter code — populated for NCERT-derived problems; null for legacy seed. */
  chapterCode?: string | null;
  problem: string;
  /** 실제 문제 본문 — 어떤 문제였는지 카드/모달에서 즉시 확인 */
  problemBody?: string;
  /** 정답 — 상세 모달에서 노출 */
  problemAnswer?: string;
  /** 핵심 개념 — 상세 모달의 정답 ↔ AI 분석 사이에 표시 */
  problemConcept?: string | null;
  /** 관련 공식 — 개념 박스의 공식 라인 */
  problemFormula?: string | null;
  unit: string; subUnit: string;
  errorType: string; errorTypeRaw: string; insight: string;
  insightJson?: WrongNoteInsightJson | null;
  diff: string; date: string; similarCount: number; status: string;
  // SM-2
  easinessFactor: number; repetitionCount: number; intervalDays: number;
  nextReviewAt: string | null; dueIn: string | null; isDue: boolean;
  lapseCount: number;
};
export type WrongNotesStats = {
  total: number; analyzed: number; mastered: number;
  masteredPct: number; retryAccuracy: number;
};
export type ErrorDna = {
  distribution: Array<{ key: string; name: string; value: number; color: string }>;
  insight: string;
};
export type Pattern = { num: string; title: string; desc: string; count: number };
export type Diagnosis = {
  headline: string;
  weakUnit: string | null;
  /** 데이터 없으면 null — UI 가 '—' 표시. */
  weakScore: number | null;
  version: string | null;
  /** 데이터 없으면 null. */
  updatedAgo: string | null;
};
export type MentorMessage = { week: string; generatedAt: string; message: string; strength: string; nextGoal: string };
export type Heatmap = Array<{ day: number; intensity: number }>;
export type ActivityStats = { avgMinutesPerDay: number; totalProblems: number; avgAccuracy: number };
export type Trajectory = Array<{ name: string; score: number; grade: number; target: number | null }>;

/** Sprint 2 A9 response — adaptive daily 20-problem session. */
export type AdaptiveProblem = {
  id: string;
  reason: string;
  targetSkill: string | null;
  difficultyLevel: number;
};
export type AdaptiveStartResponse = {
  sessionId: string | null;
  title: string;
  reason: string;
  problems: AdaptiveProblem[];
};

export type ExamResult = { id: string; name: string; date: string; score: number; grade: number; percentile: number; time: string };
export type MockSummary = {
  lastScore: number | null; expectedGrade: number | null;
  reliability: number | null; pointsToNextGrade: number | null;
  percentile: number | null;
  // 신규
  bestScore: number | null;
  avgScore: number | null;
  attemptCount: number;
  improvementSinceFirst: number | null;
  scoreDelta: number | null;
};
export type ReportCurrent = {
  /** ISO 8601 label (YYYY-Www) of the active week, decided server-side. */
  isoWeek: string;
  /** Week boundaries in UTC. weekEnd is exclusive (next Monday 00:00 local). */
  weekStart: string;
  weekEnd: string;
  timezone: string;
  /** True iff the user solved at least one problem this ISO week. */
  hasData: boolean;
  attemptCount: number;
  masterySampleCount: number;
  totalHours: number; hoursDelta: number;
  problemsSolved: number; problemsPerDay: number;
  accuracyPct: number; accuracyDelta: number;
  /** Live average mastery (0..100). 0 when masterySampleCount === 0. */
  aiScore: number;
  /** 모의고사 응시 없으면 null — UI 가 '—' 로 표시. */
  topPercentile: number | null;
};
export type TimeVsAccuracy = Array<{ week: string; time: number; accuracy: number }>;
export type FocusItem = { unit: string; area: string; priority: string; color: string; impact: string };
export type Achievement = { icon: string; title: string; sub: string; color: string };
export type GradeLevel = 'CLASS_7' | 'CLASS_8' | 'CLASS_9' | 'CLASS_10' | 'CLASS_11' | 'CLASS_12';
export type UserRole = 'STUDENT' | 'PARENT' | 'TEACHER' | 'ADMIN';
export type StudyGoal = 'BOARD' | 'JEE' | 'SCHOOL' | 'CATCHUP';
export type CountryCode = 'IN' | 'KR' | 'US' | 'UK' | 'AU' | 'SG' | 'AE' | 'ID' | 'GLOBAL';
export type Me = {
  id: string; name: string; email: string;
  emailVerifiedAt?: string | null;
  /** Try-first guest (zero-PII) — age/guardian gates skipped until upgrade. */
  isGuest?: boolean;
  birthDate?: string | null;
  guardianConsentVerifiedAt?: string | null;
  examDate: string; targetGrade: number; dDay: number;
  gradeLevel?: GradeLevel | null;
  studyGoal?: StudyGoal | null;
  role?: UserRole;
  pushRemindersEnabled?: boolean;
  tenantId?: string | null;
  country?: CountryCode;
};

export type GuardianConsentStatus = {
  required: boolean;
  verified: boolean;
  method: 'KR_PASS' | 'KR_EMAIL_OTP' | 'IN_EMAIL_OTP' | null;
  requestStatus?: 'PENDING' | 'VERIFIED' | 'EXPIRED' | null;
  parentEmail?: string | null;
  verifiedAt?: string | null;
};

/** Onboarding diagnostic — shared problem shape (fixed + adaptive). */
export type DiagnosticProblem = {
  id: string;
  body: string;
  difficulty: string;
  step: {
    id: string;
    stepIndex: number;
    prompt: string;
    choices: Array<{ id: string; choiceIndex: number; text: string }>;
  } | null;
  conceptLessonId: string | null;
};

export type DiagnosticMastery = {
  conceptId: string;
  conceptName: string;
  /** Korean localised name (populated from NCERT_CHAPTERS.titleKo). UI picks
   *  this when current language is `ko`; falls back to `conceptName`. */
  conceptNameKo?: string | null;
  conceptCode: string;
  score: number;
};

export type DiagnosticResult = {
  sessionId: string;
  attempted: number;
  correct: number;
  masteries: DiagnosticMastery[];
  placement?: {
    estimatedGradeBand: string;
    weakConceptIds: string[];
    recommendedChapterCodes: string[];
  };
};

export type AdaptiveDiagnosticStart = {
  sessionId: string;
  maxItems: number;
  problem: DiagnosticProblem;
};

export type AdaptiveDiagnosticAnswer = {
  attemptId: string;
  isCorrect: boolean;
  itemsAnswered: number;
  meanSE: number;
  shouldFinish: boolean;
  nextProblem: DiagnosticProblem | null;
};

// fetchers
export type FirstSessionAchievementKind =
  | 'FIRST_CONCEPT_STEP'
  | 'FIRST_PRACTICE_CORRECT'
  | 'FIRST_WRONGNOTE_MASTERED';

export type FirstSessionAchievement = {
  kind: FirstSessionAchievementKind;
  earnedAt: string;
  celebratedAt: string | null;
  metadata: Record<string, unknown> | null;
};

export const fetchMe = () => get<Me>('/users/me');

export const fetchGuardianConsentStatus = () => get<GuardianConsentStatus>('/guardian-consent/status');

export const requestGuardianConsent = (body: {
  parentEmail: string;
  parentName?: string;
  parentPhone?: string;
}) => post<{ sent: boolean; method: string }>('/guardian-consent/request', body);

export type ParentLinkStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVOKED' | null;

export type ParentLinkStatusResponse = {
  status: ParentLinkStatus;
  child: { id: string; name: string; email: string } | null;
  approvedAt?: string | null;
};

export const fetchParentLinkStatus = () => get<ParentLinkStatusResponse>('/parent-links/me/status');

export type StudentEfficacyCard = {
  northStarPct: number | null;
  cohortSize: number;
  chaptersMastered: number;
  wrongNotesMasteredPct: number;
  errorPatternsImproving: number;
  streakDays: number;
  message: string;
};

export const fetchEfficacy = () => get<StudentEfficacyCard>('/users/me/efficacy');
export const fetchFirstSessionAchievements = () =>
  get<FirstSessionAchievement[]>('/achievements');
export const celebrateFirstSessionAchievement = (kind: FirstSessionAchievementKind) =>
  post<FirstSessionAchievement>(`/achievements/${kind}/celebrate`, {});
export const fetchDashboardSummary = () => get<DashboardSummary>('/dashboard/summary');
export const fetchMastery = () => get<Mastery[]>('/mastery');
export const fetchToday = () => get<RecommendCard[]>('/recommendations/today');
export const fetchRecentMistakes = (limit = 3) => get<WrongNoteCard[]>('/wrong-notes/recent', { limit });
export const fetchWrongNotes = (params?: { unitName?: string; sort?: string }) => get<WrongNoteCard[]>('/wrong-notes', params);
export const fetchWrongNotesStats = () => get<WrongNotesStats>('/wrong-notes/stats');
/** Per-chapter mastery row for the Home dashboard. */
export type ChapterProgressRow = {
  chapterCode: string;
  titleEn: string;
  ncertClass: string;
  chapterNumber: number;
  problemsTotal: number;
  problemsAttempted: number;
  totalAttempts: number;
  correctAttempts: number;
  /** 0–1 — problems attempted out of all problems mapped to this chapter. */
  progress: number;
  /** 0–1 — correct attempts out of all attempts on this chapter. */
  accuracy: number;
  lastAttemptAt: string | null;
  /** First reachable problem in this chapter that the user has never
   *  attempted. Use it for resume-deep-links — Home's Chapter progress card
   *  passes it as `?problemId=<id>` so ConceptLessonScreen jumps to the
   *  practice step instead of restarting the concept walkthrough. Null when
   *  every reachable problem has been attempted (chapter is at 100%). */
  nextProblemId: string | null;
};
export const fetchChapterProgress = () =>
  get<ChapterProgressRow[]>('/dashboard/chapter-progress');
export const fetchErrorDna = () => get<ErrorDna>('/ai-coach/error-dna');
export const fetchPatterns = () => get<Pattern[]>('/ai-coach/patterns');
export const fetchDiagnosis = () => get<Diagnosis>('/ai-coach/diagnosis');
export const fetchMentorMessage = () => get<MentorMessage>('/ai-coach/mentor-message', { week: 'current' });
export const fetchHeatmap = (weeks = 12) => get<Heatmap>('/activity/heatmap', { weeks });
export const fetchStreak = () => get<{ days: number }>('/activity/streak');
export const fetchActivityStats = () => get<ActivityStats>('/activity/stats');
export const fetchTrajectory = () => get<Trajectory>('/mock-exams/trajectory');
export const fetchExamResults = () => get<ExamResult[]>('/mock-exams/results');
export const fetchMockSummary = () => get<MockSummary>('/mock-exams/summary');
export const fetchReportCurrent = () => get<ReportCurrent>('/reports/weekly/current');
export const fetchTimeVsAccuracy = () => get<TimeVsAccuracy>('/reports/weekly/time-vs-accuracy');
export const fetchNextFocus = () => get<FocusItem[]>('/reports/weekly/next-focus');
export const fetchAchievements = () => get<Achievement[]>('/reports/weekly/achievements');

export type Calibration = {
  brier: number | null;
  attemptCount: number;
  buckets: Array<{
    bucket: string;
    meanConfidence: number | null;
    meanAccuracy: number | null;
    count: number;
  }>;
  insight: string;
  avgGap?: number;
};
export const fetchCalibration = () => get<Calibration>('/reports/calibration');

// ===== Weakness Dashboard / Adaptive Plan (Phase 2~3) =====
export type UnitBalance = {
  unitId: string;
  unitName: string;
  order: number;
  score: number;
  studyTimeMin: number;
  samples: number;
  efficiency: number | null;
};

export type StudyBalanceResult = {
  gini: number;
  balanced: boolean;
  totalStudyMin: number;
  perUnit: UnitBalance[];
  underStudied: UnitBalance[];
  lowEfficiency: UnitBalance[];
  warnings: string[];
};

export type AdaptivePlanTask = {
  task: string;
  unitName: string;
  durationMin: number;
  type: 'concept' | 'practice' | 'review' | 'mock-exam';
  reason: string;
};

export type AdaptivePlan = {
  summary: string;
  totalMinutes: number;
  tasks: AdaptivePlanTask[];
  balanceTip: string;
};

export type AdaptiveResponse =
  | (AdaptivePlan & { fallback?: false })
  | { fallback: true; cards: RecommendCard[] };

export const fetchBalance = () => get<StudyBalanceResult>('/recommendations/balance');
export const fetchAdaptive = (minutes?: number) =>
  get<AdaptiveResponse>('/recommendations/adaptive', minutes ? { minutes } : undefined);

// ===== AI 처방 시스템 (Phase 2~3) =====
export type ConceptMastery = {
  id: string;
  userId: string;
  conceptId: string;
  masteryScore: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  evidenceCount: number;
  recentAccuracy: number;
  averageResponseTimeSec: number;
  hintUsageRate: number;
  confidenceGap: number;
  lastAttemptAt: string | null;
  updatedBy: 'RULE_BASED' | 'LLM' | 'HYBRID' | 'TEACHER_OVERRIDE';
  concept: { id: string; code: string; name: string; nameKo?: string | null; gradeLevel: string | null };
};

export type MasteryEventRow = {
  id: string;
  masteryScore: number;
  delta: number;
  evidenceCount: number;
  createdAt: string;
};

export type ErrorPatternRow = {
  id: string;
  conceptId: string;
  errorCode: 'SIGN' | 'ALG' | 'CON' | 'FORMULA' | 'GRAPH' | 'UNIT' | 'CALC' | 'LOGIC';
  frequency: number;
  recentFrequency: number;
  severity: 'low' | 'medium' | 'high';
  status: 'ACTIVE' | 'IMPROVING' | 'RESOLVED';
  llmSummary: string | null;
  lastDetectedAt: string;
  concept: { id: string; code: string; name: string; nameKo?: string | null };
};

export type ReviewScheduleRow = {
  conceptId: string;
  conceptName: string;
  conceptNameKo?: string | null;
  masteryScore: number;
  daysSinceLast: number | null;
  forgettingRisk: number;
  priority: 'high' | 'medium' | 'low';
};

export type NextProblemRec = {
  problemId: string;
  reason: string;
  targetConceptId: string;
  targetErrorCode: string | null;
  expectedDifficulty: number;
  recommendationLogId: string;
};

export type SimilarProblemRec = {
  problemId: string;
  reason: string;
  recommendationLogId: string;
};

/** 명세서 §7 — 5개 미만일 때 shortfallReason 명시. */
export type SimilarProblemResponse = {
  items: SimilarProblemRec[];
  requested: number;
  returned: number;
  shortfallReason?: string;
};

export type WeeklyReportFull = {
  id: string;
  isoWeek: string;
  weekStart: string;
  weekEnd: string | null;
  totalHours: number; problemsSolved: number; accuracyPct: number; aiScore: number;
  totalSessions: number; totalAttempts: number; averageStudyDurationSec: number;
  studentSummary: string | null;
  parentSummary: string | null;
  teacherSummary: string | null;
  topImprovedConcepts: string[];
  weakConcepts: string[];
  repeatedErrorPatterns: string[];
  recommendedNextGoals: string[];
  generatedAt: string;
};
export type WeeklyReportListItem = Pick<WeeklyReportFull,
  'id' | 'isoWeek' | 'weekStart' | 'weekEnd' | 'totalHours' | 'problemsSolved' |
  'accuracyPct' | 'aiScore' | 'totalSessions' | 'totalAttempts' | 'generatedAt'>;

export const fetchConceptMastery   = () => get<ConceptMastery[]>('/mastery/trajectory');
export const fetchConceptHistory   = (conceptId: string, take = 30) =>
  get<MasteryEventRow[]>(`/mastery/trajectory/${conceptId}/history`, { take });
export const fetchActivePatterns   = () => get<ErrorPatternRow[]>('/mastery/error-patterns/active');
/** Per-concept deep-link info: the concept's own (country-correct) chapter, plus
 *  prerequisite readiness so the UI can route to a missing prerequisite first. */
export type ChapterLink = {
  chapterCode: string | null;
  prereqReady: boolean;
  prereqChapterCode: string | null;
};
export const fetchChapterLinks     = (conceptIds: string[]) =>
  get<Record<string, ChapterLink>>('/mastery/chapter-links', { ids: conceptIds.join(',') });
export const fetchReviewSchedule   = () => get<ReviewScheduleRow[]>('/recommendations/review-schedule');
export const fetchNextProblem      = (sessionId?: string) =>
  get<NextProblemRec | null>('/recommendations/next-problem', sessionId ? { sessionId } : undefined);
export const fetchSimilarForAttempt = (attemptId: string) =>
  get<SimilarProblemResponse>(`/recommendations/similar/${attemptId}`);
export const fetchWeeklyList       = () => get<WeeklyReportListItem[]>('/reports/weekly');
export const fetchWeeklyById       = (id: string) => get<WeeklyReportFull>(`/reports/weekly/by-id/${id}`);

// ===== Students (Teacher / Parent 권한) =====
export type StudentRow = {
  id: string; name: string; email: string;
  gradeLevel: string | null; schoolLevel: string | null;
  createdAt: string;
};
export const fetchTeacherStudents = () => get<StudentRow[]>('/students/teacher/list');
export const fetchStudentMastery  = (studentId: string) => get<ConceptMastery[]>(`/students/${studentId}/mastery`);
export const fetchStudentPatterns = (studentId: string) => get<ErrorPatternRow[]>(`/students/${studentId}/error-patterns/active`);
export const fetchStudentWeekly   = (studentId: string) => get<WeeklyReportListItem[]>(`/students/${studentId}/weekly-reports`);

// ===== 단건 조회 =====
export type WrongNoteDetail = WrongNoteCard & {
  // similar cards carry user-facing fields only (2026-06-12 audit): a body
  // preview + localized chapter/difficulty labels, never raw enum values.
  similar: Array<{ id: string; preview: string; chapter: string; difficulty: string }>;
};
export type ProblemChoice = {
  id: string; choiceIndex: number; text: string;
  // isCorrect/distractorType/rationale은 클라이언트에 노출되지 않음
};
export type ProblemStep = {
  id: string; stepIndex: number;
  stepType: 'CONCEPT' | 'PROCESS' | 'ANSWER';
  prompt: string;
  choices: ProblemChoice[];
};
export type Problem = {
  id: string; source: string; unitId: string; subUnitId: string | null;
  difficulty: string; body: string; formula: string | null;
  /** 핵심 개념 — 정답/오답 피드백에 사용 */
  concept: string | null;
  // answer 필드는 응시 중 클라이언트로 노출되지 않음
  imageUrl: string | null; hint: string | null;
  steps?: ProblemStep[];
  /** ConceptLesson chapter this problem belongs to (when mapped). Used by
   *  AnswerFeedbackSheet / FeedbackCard to deep-link a wrong answer back
   *  to the matching ConceptStep — see lib/distractor-reteach.ts. */
  chapterCode?: string | null;
};
export type Hint = {
  hint: string | null;
  /** Key formula for the problem — primary content of Hint Lv1. */
  formula: string | null;
  /** Concept name / one-line explanation — fallback when formula is empty. */
  concept: string | null;
};
export type StudySession = {
  id: string; unitId: string; sessionNumber: number; totalSessions: number;
  currentStep: number; startedAt: string; endedAt: string | null;
};
/** 명세서 §3-1 정합: 실 문제 + 학생 mastery/error-pattern 기반 5단계 JSON 가이드. */
export type GuideStep = { num: number; title: string; desc: string; current: boolean; done: boolean };
export type SessionGuide = {
  perspective: '공식 중심' | '단계별' | '시각화' | '실생활 예시';
  problemId: string | null;
  steps: GuideStep[];
  validationStatus: 'validated' | 'fallback' | 'empty';
  parseError?: string | null;
  text: string;                  // 호환 — 옛 UI 가 단순 text 만 쓸 때
  inputTokens: number;
  outputTokens: number;
};
export type Unit = {
  id: string; name: string; displayName?: string; order: number;
  gradeLevels?: GradeLevel[];
  subUnits: Array<{ id: string; name: string; displayName?: string; order: number }>;
};

export const fetchWrongNote = (id: string) => get<WrongNoteDetail>(`/wrong-notes/${id}`);
export const fetchDueWrongNotes = (limit?: number) =>
  get<WrongNoteCard[]>('/wrong-notes/due', limit ? { limit } : undefined);

/** Review queue (FIFO + 3-day cooldown) — next single problem ready to redo.
 *
 * NOTE: problem.answer is intentionally not in this payload. Grading happens
 * server-side via POST /wrong-notes/:id/check so the answer never leaks to
 * the client (devtools), and every check creates an Attempt + (on correct)
 * marks the wrong note MASTERED in one round trip. */
export type ReviewQueueNext = {
  wrongNote: {
    wrongNoteId: string;
    problemId: string;
    problemBody: string;
    source: string;
    /** One-line nudge — null until the user has racked up 3+ wrong attempts
     *  on this problem (matheo-ux-spec-full §Test). UI should hide the hint
     *  button entirely while null. */
    hint: string | null;
    /** True once the 3-wrong threshold is crossed. Frontend uses this to
     *  surface the hint button + one-line nudge; the full solution is never
     *  revealed via the review-queue path. */
    hintAvailable: boolean;
    occurrences: number;
    createdAt: string;
  } | null;
  totalEligible: number;
  /** When the oldest cooldown-locked note becomes ready (null when nothing is locked). */
  nextEligibleAt: string | null;
};
export const fetchReviewQueueNext = () =>
  get<ReviewQueueNext>('/wrong-notes/queue/next');
export const fetchProblem = (id: string) => get<Problem>(`/problems/${id}`);
export const fetchProblemHint = (id: string) => get<Hint>(`/problems/${id}/hint`);
/** Hint Lv2 — AI walkthrough generated on demand (OpenAI gpt-4o-mini, ≤6 short steps). */
export const fetchProblemHintWalkthrough = (id: string) =>
  get<{ steps: string[] }>(`/problems/${id}/hint-walkthrough`);
export const fetchStudySession = (id: string) => get<StudySession>(`/study-sessions/${id}`);
export const fetchSessionGuide = (id: string, perspective: string) =>
  get<SessionGuide>(`/study-sessions/${id}/guide`, { perspective });
export type ProblemSolution = {
  id: string; source: string;
  unit: string | null; subUnit: string | null;
  difficulty: string;
  body: string; concept: string | null; formula: string | null; answer: string;
  /** AI-Solver-uploaded problems carry a free-form step-by-step explanation
   *  here (from Problem.expectedSolutionSteps.explanation). NULL for legacy
   *  NCERT-seeded problems that already have 3-step MC walkthroughs. */
  explanation?: string | null;
  steps: Array<{
    stepIndex: number;
    stepType: 'CONCEPT' | 'PROCESS' | 'ANSWER';
    prompt: string;
    correctChoice: { choiceIndex: number; text: string } | null;
  }>;
};
export const fetchProblemSolution = (id: string) => get<ProblemSolution>(`/problems/${id}/solution`);
/** Variant re-quiz: a fresh same-chapter problem (same type, new numbers) to
 *  re-solve a wrong note without memorising the original's answer. */
export const fetchVariant = (problemId: string) => get<{ id: string }>(`/problems/${problemId}/variant`);

export const fetchCurriculum = (grade?: string) =>
  get<Unit[]>('/curriculum', grade ? { grade } : undefined);
export const fetchUnitsForUser = (grade?: string) =>
  get<Unit[]>('/curriculum/units', grade ? { grade } : undefined);

// ===== Concept Lessons (사전 개념학습) =====
export type ConceptStepKind =
  | 'HOOK' | 'CONCRETE' | 'PICTORIAL' | 'ABSTRACT'
  | 'WORKED_EXAMPLE' | 'GUIDED_PRACTICE'
  | 'RETRIEVAL' | 'MISCONCEPTION' | 'REFLECT';

export type NcertClass = 'CLASS_7' | 'CLASS_8' | 'CLASS_9' | 'CLASS_10' | 'CLASS_11' | 'CLASS_12';

export type ConceptLessonSummary = {
  id: string;
  chapterCode: string;
  ncertClass: NcertClass;
  chapterNumber: number;
  title: string;
  bigIdea: string;
  estimatedMin: number;
  cognitiveLoad: number;
  prerequisiteCodes: string[];
  unit: { id: string; name: string } | null;
  mastered: boolean;
  currentStep: number | null;
  retrievalScore: number | null;
};

export type ConceptStep = {
  id: string;
  stepIndex: number;
  kind: ConceptStepKind;
  title: string;
  body: string;
  visualType: string | null;
  visualUrl: string | null;
  visualData: any | null;   // <GraphRenderer/> JSON 파라미터 — VisualData union
  // Backend pre-localises misconception/workedSteps to a single language per
  // request (CurrentLang decorator) and ships flattened payloads. The earlier
  // multi-language shape made these three fields silently render empty.
  misconception: { wrong: string; why: string; correct: string } | null;
  workedSteps: Array<{ math: string; narration: string; fade?: boolean }> | null;
  retrievalCheck: {
    prompt: string;
    hint: string | null;
    choices: Array<{ choiceIndex: number; text: string }>;
  } | null;
  // reflectPrompts is the raw json column — concept-content currently emits
  // null for every chapter; keep as `unknown` so any future shape is allowed
  // without retro-fitting types. Consumers should guard with Array.isArray.
  reflectPrompts: unknown;
};

export type ConceptLessonDetail = ConceptLessonSummary & {
  steps: ConceptStep[];
  progress: {
    /** Count of Attempts this user has on any problem mapped to this
     *  chapter. 0 = first-time entry → ConceptLessonScreen forces concept
     *  phase regardless of conceptWalkthroughAt. */
    practiceAttempts: number;
    currentStep: number;
    completedSteps: number[];
    masteredAt: string | null;
    /** When the user finished the concept walkthrough — distinct from
     *  masteredAt (which is the 20-problem Study-unlock gate). */
    conceptWalkthroughAt: string | null;
    retrievalScore: number | null;
  };
};

export const fetchConceptLessons = (ncertClass?: NcertClass) =>
  get<ConceptLessonSummary[]>('/concept-lessons', ncertClass ? { ncertClass } : undefined);

// ─── Korean curriculum (2022 개정) parallel hub ─────────────────────────

export type KoreanGrade =
  | 'MIDDLE_1' | 'MIDDLE_2' | 'MIDDLE_3'
  | 'HIGH_1' | 'HIGH_2' | 'HIGH_3';

export type KoreanSubject =
  | 'MIDDLE_MATH_1' | 'MIDDLE_MATH_2' | 'MIDDLE_MATH_3'
  | 'HIGH_COMMON_1' | 'HIGH_COMMON_2'
  | 'HIGH_ALGEBRA' | 'HIGH_CALCULUS_1' | 'HIGH_CALCULUS_2'
  | 'HIGH_STATISTICS' | 'HIGH_GEOMETRY';

export type KoreanConceptLessonSummary = {
  id: string;
  chapterCode: string;
  koreanGrade: KoreanGrade;
  koreanSubject: KoreanSubject;
  chapterNumber: number;
  titleKo: string;
  titleEn: string | null;
  bigIdeaKo: string;
  estimatedMin: number;
  cognitiveLoad: number;
  prerequisiteCodes: string[];
  /** KoreanConceptProgress.masteredAt presence — backend computes per-user.
   *  StudyScreen filters on this when country='KR' to mirror the NCERT
   *  "mastered chapters only" picker semantics. */
  mastered: boolean;
};

export const fetchKoreanConceptLessons = (args?: {
  koreanGrade?: KoreanGrade;
  koreanSubject?: KoreanSubject;
}) =>
  get<KoreanConceptLessonSummary[]>('/korean-concept-lessons', {
    ...(args?.koreanGrade ? { koreanGrade: args.koreanGrade } : {}),
    ...(args?.koreanSubject ? { koreanSubject: args.koreanSubject } : {}),
  });

export type KoreanConceptStep = {
  id: string;
  stepIndex: number;
  kind:
    | 'HOOK' | 'CONCRETE' | 'PICTORIAL' | 'ABSTRACT'
    | 'WORKED_EXAMPLE' | 'GUIDED_PRACTICE' | 'RETRIEVAL'
    | 'MISCONCEPTION' | 'REFLECT';
  title: string;
  body: string;
  visualType: string | null;
  visualUrl: string | null;
  visualData: any | null;
  // The KO seed stores these as-is (no flattening). Each block is the raw
  // JSON from the seed file — components should guard for shape.
  misconception: { wrongKo: string; whyKo: string; correctKo: string } | null;
  workedSteps: Array<{ step: number; math: string; narrationKo: string; fade?: boolean }> | null;
  retrievalCheck: {
    prompt: string;
    accept: string[];
    explainKo?: string;
    distractors?: Array<{ text: string; rationale?: string }>;
  } | null;
  reflectPrompts: { prompts: string[] } | null;
};

export type KoreanConceptLessonDetail = KoreanConceptLessonSummary & {
  steps: KoreanConceptStep[];
  /** First problem in masterySetProblemIds the user has NOT yet attempted.
   *  null when chapter fully attempted or masterySet not 20-frozen. Frontend
   *  KoreanConceptLessonScreen passes this to KoreanPracticePhase.startProblemId
   *  so "연습 문제 풀기" lands on the in-progress problem. */
  nextProblemId: string | null;
  /** KoreanConceptProgress.masteredAt presence — Study tab unlock signal. */
  mastered: boolean;
};

export const fetchKoreanConceptLesson = (chapterCode: string) =>
  get<KoreanConceptLessonDetail>(`/korean-concept-lessons/${chapterCode}`);

export type KoreanPracticeChoice = {
  id: string;
  choiceIndex: number;
  text: string;
  isCorrect: boolean;
  distractorErrorCode: string | null;
  rationale: string | null;
};

export type KoreanPracticeStep = {
  id: string;
  stepIndex: number;
  stepType: 'CONCEPT' | 'PROCESS' | 'ANSWER';
  prompt: string;
  choices: KoreanPracticeChoice[];
};

/// 3-step multi-step problem per user spec 2026-05-24. Each problem carries
/// CONCEPT/PROCESS/ANSWER steps; each step has 5 choices. Backend filters out
/// legacy single-step seed (see korean-concept-lessons.service.practiceProblems).
export type KoreanPracticeProblem = {
  id: string;
  stem: string;
  concept: string | null;
  difficulty: string;
  difficultyLevel: number;
  requiredSkills: string[];
  answer: string;
  solution: string | null;
  steps: KoreanPracticeStep[];
};

export const fetchKoreanPracticeProblems = (chapterCode: string) =>
  get<KoreanPracticeProblem[]>(`/korean-concept-lessons/${chapterCode}/practice-problems`);

/** KR Study (single-step) pool problem. Mastery 3-step과 별도. */
export type KoreanStudyProblem = {
  id: string;
  stem: string;
  concept: string | null;
  difficulty: string;
  difficultyLevel: number;
  requiredSkills: string[];
  answer: string;
  solution: string | null;
  stepId: string;
  stepIndex: number;
  choices: KoreanPracticeChoice[];
};

export const fetchKoreanStudyProblems = (chapterCode: string) =>
  get<KoreanStudyProblem[]>(`/korean-concept-lessons/${chapterCode}/study-problems`);

export const fetchConceptLessonsForUnit = (unitId: string) =>
  get<ConceptLessonSummary[]>(`/concept-lessons/by-unit/${unitId}`);

export const fetchConceptLesson = (chapterCode: string) =>
  get<ConceptLessonDetail>(`/concept-lessons/${chapterCode}`);

/** Practice problems for a chapter — uses Problem.conceptLessonId 매핑 (backfill 완료).
 *  GET /concept-lessons/:code/practice-problems
 */
export type ProblemListItem = {
  id: string; source: string; unitId: string; subUnitId: string | null;
  difficulty: string; difficultyLevel?: number; body: string;
};
export const fetchPracticeProblems = (chapterCode: string) =>
  get<ProblemListItem[]>(`/concept-lessons/${chapterCode}/practice-problems`);

/** Study tab "next problem" — stateless, one-at-a-time. Returns null when
 *  pool is dry AND LLM top-up failed (or unitId missing). */
export type NextStudyProblem = {
  id: string;
  source: string;
  body: string;
  difficulty: string;
  hint?: string | null;
  steps: Array<{
    id: string;
    stepIndex: number;
    stepType: 'CONCEPT' | 'PROCESS' | 'ANSWER';
    prompt: string;
    choices: Array<{ id: string; choiceIndex: number; text: string }>;
  }>;
} | null;

/** Student-uploaded problem OCR result solved through the math helper. */
/** `result.problemId` is the id of the Problem row math-helper persisted while
 *  recording the attempt — UploadProblemModal uses it to deep-link into
 *  SoloProblemScreen for an immediate "Practice now" flow (the 3-day cooldown
 *  applies only to the Test review queue, not direct practice). */
export type OcrResult = {
  text: string;
  latex?: string | null;
  confidence?: number | null;
  source: 'openai' | 'mathpix' | 'mathpix+openai';
};
export type SolveResult = import('./mathHelper').MathHelperSolveResponse & {
  problemId?: string | null;
};
export type UploadAnalysisResult = {
  extractedText: string;
  latex?: string | null;
  confidence?: number | null;
  source: OcrResult['source'];
  result: SolveResult;
};

/**
 * 2-step Solver path — UploadProblemModal calls extractProblemText first so
 * the recognised problem text reaches the user in 1-3 s (Photomath-style
 * "instant recognition" feedback), then solveExtractedText drives the longer
 * 5-15 s LLM solve while the user reads the OCR card. Backed by
 * /math-helper/ocr (no quota) + /math-helper/solve (quota-guarded). The
 * single-shot uploadProblemImage path below is kept for back-compat callers.
 */
export const extractProblemText = (file: File): Promise<OcrResult> => {
  const fd = new FormData();
  fd.append('file', file);
  return post<OcrResult>('/math-helper/ocr', fd, { isMultipart: true });
};

export const solveExtractedText = (
  question: string,
  studentAnswer?: string,
  durationSec?: number,
  classLevel?: number,
): Promise<SolveResult> => {
  const payload: Record<string, unknown> = { question };
  if (studentAnswer?.trim()) payload.studentAnswer = studentAnswer.trim();
  if (durationSec && durationSec > 0) payload.durationSec = Math.floor(durationSec);
  if (classLevel) payload.classLevel = classLevel;
  return post<SolveResult>('/math-helper/solve', payload);
};

export const uploadProblemImage = (
  file: File,
  studentAnswer?: string,
  durationSec?: number,
) => {
  const fd = new FormData();
  fd.append('file', file);
  if (studentAnswer?.trim()) fd.append('studentAnswer', studentAnswer.trim());
  if (durationSec && durationSec > 0) fd.append('durationSec', String(Math.floor(durationSec)));
  return post<UploadAnalysisResult>('/math-helper/ocr-solve', fd, { isMultipart: true });
};

/** Sprint 2 A9: POST /study-sessions/adaptive/start. country-agnostic; the
 *  backend AdaptiveNextProblemService filters Problem candidates by the
 *  caller's user.country, so KR users get KR problems and IN users get NCERT. */
export const startAdaptiveSession = (mode: 'daily' | 'chapter' = 'daily', chapterCode?: string) =>
  post<AdaptiveStartResponse>('/study-sessions/adaptive/start', { mode, chapterCode });

/** Sprint 3 A13: student-side "이 문제 신고" — flips Problem to EXCLUDED
 *  + tags 'STUDENT_REPORTED'. Server is idempotent; duplicate flag = no-op. */
export const reportProblem = (problemId: string, reason?: string) =>
  post<{ ok: true; duplicate: boolean }>(`/problems/${problemId}/report`, { reason });

/** Student invites a parent by email (referral loop) — server emails a
 *  prefilled /register?role=parent link; the link request itself fires when
 *  the parent registers, and the student approves it. */
export const inviteParent = (parentEmail: string) =>
  post<{ sent: boolean; alreadyLinked?: boolean }>('/parent-links/invite', { parentEmail });

/** Public policy document — surfaces on /privacy and /terms before login.
 *  Backend Privacy controller marks `policy` as @Public so the SPA can fetch
 *  without a token (Play Store + DPDP require a public Privacy URL). */
export type PolicyDoc = {
  version: string;
  effectiveDate: string;
  title: string;
  sections: Array<{ heading: string; body: string }>;
};
export const fetchPolicy = () => get<PolicyDoc>('/privacy/policy');
