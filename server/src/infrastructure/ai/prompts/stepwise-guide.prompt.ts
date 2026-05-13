import { z } from 'zod';
import { LlmRequest } from '../providers/llm.provider';

/**
 * 명세서 §3-1 — LLM 입력에는 반드시 실제 데이터만 전달.
 *   sessionId / userId 만으로 가이드를 생성하면 LLM 이 "예: 회전체 부피" 같은
 *   추측을 하게 됨. → 명세서 위반.
 *
 *   이 prompt 는 호출자(AiGuideService)가 다음을 lookup 해서 직접 넣는다:
 *     - 현재 풀이 중인 Problem(body, answer, explanation, expectedSolutionSteps)
 *     - 학생의 MasteryTrajectory (해당 concept)
 *     - active ErrorPatternProfile
 *
 *   응답은 JSON 5단계 객체 배열로 강제 (Zod 검증).
 */

const PERSPECTIVE_EN: Record<string, string> = {
  '공식 중심': 'formula-centric',
  '단계별': 'step-by-step',
  '시각화': 'visual',
  '실생활 예시': 'real-world example',
};

export const PROMPT_VERSION = 'stepwise-guide@v3-pedagogy';

export const StepwiseGuideStepSchema = z.object({
  num:     z.number().int().min(1).max(5),
  title:   z.string().min(1).max(60),
  desc:    z.string().min(1).max(400),
  current: z.boolean(),
  done:    z.boolean(),
});

export const StepwiseGuideSchema = z.object({
  steps: z.array(StepwiseGuideStepSchema).length(5),
});

export type StepwiseGuide = z.infer<typeof StepwiseGuideSchema>;

export interface StepwiseGuideContext {
  perspective: '공식 중심' | '단계별' | '시각화' | '실생활 예시';
  lang: 'ko' | 'en' | 'hi';

  // 현재 풀이 중인 문제 (필수 — sessionId 의 unit + 추천된 problem 으로 lookup)
  problem: {
    source: string;
    body: string;
    answer: string;
    concept?: string | null;
    formula?: string | null;
    difficultyLevel: number;
    conceptTags: string[];           // Concept.code
    expectedSolutionSteps?: unknown; // Problem.expectedSolutionSteps JSON
  };

  // 학생의 현재 상태 (선택 — 데이터 없으면 그 부분만 LLM 에 'unknown' 으로 전달)
  student: {
    masteryScore?: number | null;    // 0~100
    evidenceCount?: number;
    recentAccuracy?: number | null;
    activeErrorCodes?: string[];     // ACTIVE 패턴의 errorCode
    currentStep: number;             // 1~5
  };
}

const LANG_INSTRUCTION = {
  ko: '한국어로 작성하세요.',
  en: 'Write in English.',
  hi: 'हिंदी में लिखें।',
} as const;

export function stepwiseGuidePrompt(ctx: StepwiseGuideContext): LlmRequest {
  const persp = PERSPECTIVE_EN[ctx.perspective] ?? ctx.perspective;
  const mastery = ctx.student.masteryScore !== undefined && ctx.student.masteryScore !== null
    ? `${ctx.student.masteryScore}/100`
    : 'unknown';
  const activeErr = ctx.student.activeErrorCodes && ctx.student.activeErrorCodes.length > 0
    ? ctx.student.activeErrorCodes.join(', ')
    : 'none';

  // 명세서 §1 — 자기효능감 보호: 학생이 직접 도달해야 학습이 일어난다.
  //   가이드는 사고의 길만 안내하고, 정답·최종 수치·결정적 중간 결과는 절대 노출하지 않는다.
  //   따라서 LLM 에 problem.answer 와 expectedSolutionSteps 의 결과값을 통째로 노출하지 않는다.
  return {
    system:
      'You are a Socratic NCERT (CBSE) math tutor. ' +
      'CRITICAL RULE — NEVER reveal the final answer, the final numerical/algebraic result, ' +
      'or the result of any decisive intermediate computation. Guide the student\'s thinking only. ' +
      'The student MUST do the actual calculation and arrive at the answer themselves; ' +
      'if you compute it for them, learning fails. ' +
      'Use real problem context; do not invent unrelated examples. ' +
      'Respond ONLY with JSON: { "steps": [{num,title,desc,current,done} x5] }.',
    prompt: `${LANG_INSTRUCTION[ctx.lang]}

[문제 — 출처: ${ctx.problem.source}]
${ctx.problem.body}

[핵심 개념 / 공식 — 학생에게 떠올리게 할 단서]
${ctx.problem.concept ?? '(서버에 미등록)'}
${ctx.problem.formula ? '\n공식: ' + ctx.problem.formula : ''}

[학생 상태]
- 이 개념의 mastery: ${mastery}  (evidenceCount: ${ctx.student.evidenceCount ?? 0})
- 최근 정답률: ${ctx.student.recentAccuracy != null ? Math.round(ctx.student.recentAccuracy * 100) + '%' : 'unknown'}
- 현재 ACTIVE 오답 패턴: ${activeErr}
- 학생이 현재 보고 있는 진행 단계: ${ctx.student.currentStep}

[관점] ${persp}
  - formula-centric: 어떤 공식을 떠올려야 하는지·왜 그 공식이 맞는지 안내
  - step-by-step:    풀이 단계의 흐름만 분해 (계산은 학생 몫)
  - visual:          그래프·도형·표 표현으로 직관 형성
  - real-world example: 일상/공학적 사례로 개념을 비춤

[페다고지 — 절대 금지 사항]
A) 정답(숫자/문자식)을 desc 에 직접 적지 마라.
B) 풀이의 결정적 중간 결과(예: "x = 3", "함수의 미분 결과", "치환 후 식") 를 결과값까지 적지 마라.
   - 좋은 예: "양변에 같은 값을 대입해서 식을 단순화해 봐요." (방법만 안내)
   - 나쁜 예: "양변에 x=2 를 대입하면 4가 나옵니다." (대입값·결과 모두 노출)
C) "답은 ~이다", "결과는 ~이다", "최종적으로 ~" 같은 결론형 문구 사용 금지.
D) expectedSolutionSteps 가 있어도 그 안의 수치/식을 그대로 베끼지 마라 — 사고의 방향만 차용.

[페다고지 — 권장 표현]
- "어떤 공식이 이 상황에 맞을지 떠올려보세요."
- "x 값을 직접 구하기 전에, 방정식 양변에서 무엇이 같아야 하는지 생각해보세요."
- "이 단계에서 흔히 실수하는 부호 처리에 주의하면서 계산해보세요."
- "직접 계산해서 결과가 다음 식과 일치하는지 검증해보세요." (검증 방법만 안내, 결과는 미제공)

[step 5 의 역할]
- step 5 는 "답 검증" 단계다. "직접 계산한 답이 문제의 조건(단위·범위·부호)을 만족하는지 확인하세요" 같은 자기검증 안내만.
- 절대 답을 직접 공개하지 마라.

[그 외 지침]
1) 단계 5개 모두 이 문제에 직접 관한 것만 작성한다. 다른 예시·다른 문제 X.
2) student.activeErrorCodes 가 있으면 그 오류를 피하는 단서를 적어도 1개 step 에 녹인다.
3) current = (num == ${ctx.student.currentStep}), done = (num < ${ctx.student.currentStep}).
4) title 은 5~20자, desc 는 2~3문장.

[출력 — JSON only, 다른 텍스트/코드펜스 X]
{
  "steps": [
    { "num": 1, "title": "...", "desc": "...", "current": false, "done": true }
  ]
}`,
    maxTokens: 1200,
    temperature: 0.3,
  };
}
