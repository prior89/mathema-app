/**
 * 한국 2022 개정 교육과정 챕터별 개념학습 콘텐츠 — 시드 입력 타입.
 *
 * 단일 언어 (Korean) — mathema-kr 빌드 전용. 인도판의 ChapterContentMap과
 * 동일한 7-stage 구조지만 KO 하나만 보관해서 작성 시간을 압축한다.
 *
 *   1. HOOK            - 호기심 자극, 실세계 연결
 *   2. CONCRETE        - 구체적 수치 예시
 *   3. PICTORIAL       - 시각·그래프 표현
 *   4. ABSTRACT        - 정의·공식 (필수)
 *   5. WORKED_EXAMPLE  - 단계 분해 풀이 (필수)
 *   6. MISCONCEPTION   - 흔한 오개념
 *   7. RETRIEVAL       - 자가 점검 (필수)
 */

export interface KoreanConceptChapterContent {
  hook?: string;
  concrete?: string;
  pictorial?: string;
  abstract: string;
  worked: {
    intro: string;
    steps: Array<{ math: string; narration: string }>;
  };
  misconception?: {
    wrong: string;
    why: string;
    correct: string;
  };
  retrieval: {
    prompt: string;
    accept: string[];
    explain?: string;
    distractors?: Array<{ text: string; rationale?: string }>;
  };
  reflect?: { prompts: string[] };
}

export type KoreanChapterContentMap = Record<string, KoreanConceptChapterContent>;
