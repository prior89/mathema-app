/**
 * 한국 2022 개정 교육과정 — 챕터별 20문항 5지선다 문제 시드 타입.
 *
 * 한 챕터 = 정확히 20문제 (쉬움 6 / 중간 9 / 어려움 5).
 * 각 문제는 5개 보기 (A~E), 정답 1개 + 오답 4개.
 * 오답에는 반드시 errorCode + errorReason 부여.
 */

export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * 오답 코드 — 모든 중·고등 수학 챕터에 걸쳐 공유되는 baseline 분류.
 * 챕터별로 특화 코드 (e.g. SLOPE_INTERCEPT_CONFUSION, AREA_RATIO_ERROR,
 * CORRESPONDING_PART_ERROR) 가 추가될 수 있다 — 자유로운 string 입력 허용.
 */
export const ERROR_CODE_VOCAB = {
  CONCEPT_MISUNDERSTANDING: '개념 자체를 잘못 이해',
  SIGN_ERROR: '음수, ±, 부등호 방향 실수',
  ALGEBRA_ERROR: '식 변형, 전개, 이항, 약분 오류',
  ARITHMETIC_ERROR: '단순 계산 실수',
  CONDITION_MISSING: '문제 조건 누락',
  FORMULA_SELECTION_ERROR: '공식을 잘못 선택',
  DENOMINATOR_ERROR: '통분, 분모 처리 오류',
  GRAPH_READING_ERROR: '그래프/좌표/기울기 해석 오류',
  GEOMETRY_PROPERTY_ERROR: '도형 성질 오해',
  RATIO_SCALE_ERROR: '비례, 닮음비, 단위/스케일 오류',
  PROBABILITY_COUNTING_ERROR: '경우의 수/확률 세기 오류',
  STATISTICS_INTERPRETATION_ERROR: '평균, 분산, 표준편차 해석 오류',
  // 챕터 특화
  ADD_NUMERATOR_ONLY: '분모를 고려하지 않고 분자만 더함',
  SIMPLIFICATION_ERROR: '약분 실수',
  SLOPE_INTERCEPT_CONFUSION: '기울기·절편 혼동',
  CORRESPONDING_PART_ERROR: '대응변·대응각 짝짓기 오류',
  AREA_RATIO_ERROR: '넓이비를 닮음비와 동일시',
  VOLUME_RATIO_ERROR: '부피비를 닮음비와 동일시',
  COORDINATE_ERROR: '좌표 위치·부호 오류',
  EXPONENT_ERROR: '지수 법칙 오류',
  COMPLEMENT_ERROR: '여사건·여집합 처리 오류',
  ORDER_OF_OPERATIONS_ERROR: '연산 순서 오류',
} as const;

export type ErrorCode = keyof typeof ERROR_CODE_VOCAB | (string & {});

export type KoreanProblemOption = {
  key: 'A' | 'B' | 'C' | 'D' | 'E';
  text: string;
  isCorrect: boolean;
  errorCode: ErrorCode | null;     // null on correct option
  errorReason: string | null;      // null on correct option
};

/**
 * Multi-step problem step (CONCEPT / PROCESS / ANSWER) — user spec
 * 2026-05-24 "단원학습 20문제는 3단계 문제로 나와야해". Each step has its
 * own 5 choices + own correct + own distractor errorCodes. The student
 * walks through all three; mastery unlock fires once the student has
 * submitted every problem's ANSWER step (정답률 무관 — H/A1 spec).
 */
export type KoreanProblemStep = {
  stepType: 'CONCEPT' | 'PROCESS' | 'ANSWER';
  prompt: string;                  // step question (LaTeX $...$ inline OK)
  options: [
    KoreanProblemOption,
    KoreanProblemOption,
    KoreanProblemOption,
    KoreanProblemOption,
    KoreanProblemOption,
  ];
};

export type KoreanProblemSeed = {
  chapterCode: string;             // KoreanConceptLesson.chapterCode
  difficulty: Difficulty;
  concept: string;                 // sub-concept inside the chapter
  requiredSkills: string[];
  stem: string;                    // problem body (LaTeX, shared across all steps)
  steps: [KoreanProblemStep, KoreanProblemStep, KoreanProblemStep]; // CONCEPT, PROCESS, ANSWER
  solution: string;                // full step-by-step rationale
};

export type KoreanChapterProblems = {
  chapterCode: string;
  problems: KoreanProblemSeed[];   // length 20: 6 easy + 9 medium + 5 hard
};

/**
 * Study-tab single-step problem (2026-05-24 user spec).
 *   - Mastery 3-step과 별도 풀 (사용자가 Mastery에 푼 문제는 Study에 안 나옴)
 *   - 단일 step: 문제 본문 + 5지선다 + 풀이
 *   - 학생 UI: body + 필기 패드 (HandwritingCanvas) + 5 choices
 *   - DB: Problem + ProblemStep 1개 (stepType=ANSWER) + ProblemChoice 5개
 */
export type KoreanStudyProblemSeed = {
  chapterCode: string;
  difficulty: Difficulty;
  concept: string;
  requiredSkills: string[];
  stem: string;
  options: [
    KoreanProblemOption,
    KoreanProblemOption,
    KoreanProblemOption,
    KoreanProblemOption,
    KoreanProblemOption,
  ];
  solution: string;
};

export type KoreanStudyChapterProblems = {
  chapterCode: string;
  problems: KoreanStudyProblemSeed[]; // length 20: 6 easy + 9 medium + 5 hard
};
