# Mathema Content Creation Guidelines
**Aligned to:** CONTENT_QUALITY_RUBRIC.md (2026-06-14)  
**Purpose:** Ensure every future edit, new chapter, or LLM draft maintains "sufficient" depth. This is the practical playbook + living before/after library. Zero tolerance for shallow procedural narration going forward.

## Core Philosophy (from research)
- Worked examples are powerful only when the *why* behind each step is narrated (reduces cognitive load while building schema).
- Elaborated feedback (naming the exact misconception + contrast + repair hint) repairs errors far better than "correct answer is X" or analyst shorthand.
- Korean 2022 개정 emphasizes proof as "가정에서 출발하는 사슬", early meaningful statistics (대푯값 선택의 맥락), and "변화와 관계" via graphs/functions. Content must surface these explicitly in misconceptions and narration.

## The Non-Negotiable Rewrite Checklist (apply to EVERY chapter)
For each chapter you touch:
1. **Worked steps** — rewrite every `narration*` to be a full explanatory sentence with causal language. Test: "Can a student explain back *why* this move is allowed?"
2. **Misconception** — expand `why*` to student-thinking + seductive similarity + context trap. Make `correct*` contrast the rule with the model (number line, balance, area, assumption chain).
3. **Abstract** — add one "why this rule holds / what it models in the world" sentence. For KR chapters weave in 2022 language where natural.
4. **Retrieval / distractors / STUDY errorReason** — upgrade to (or start from) 4-part elaborated rationale. Reference EXEMPLAR_RATIONALES where the error matches a common pattern.
5. **Header** — add or update the upgrade comment at top of the .ts file.
6. **No structure change** — never add/remove keys, reorder steps, change chapterCode, or alter the shape of worked.steps, misconception, etc.

## Before / After Library (real examples from the audit)

### Example 1: C7-CH01-INTEGERS worked (addition of opposite signs)
**Before (shallow, current on disk):**
```ts
steps: [
  { math: '|−7|=7, |+4|=4', narrationKo: '절댓값을 따로 본다.', narrationEn: 'Read absolute values separately.' },
  { math: '7 − 4 = 3',     narrationKo: '부호가 다르므로 차를 구한다.', narrationEn: 'Signs differ → subtract.' },
  { math: 'Result sign: −',   narrationKo: '|−7|이 더 크므로 결과는 음수.', narrationEn: 'Larger |·| had the minus sign.' },
  { math: '∴ −3',          narrationKo: '최종 답.', narrationEn: 'Final answer.' },
]
```

**After (sufficient per Rubric):**
```ts
steps: [
  { math: '|−7|=7, |+4|=4', narrationKo: '절댓값을 따로 계산하는 이유는 수의 크기(0으로부터의 거리)만 먼저 보고, 방향(부호)은 나중에 결정하기 위해서다. 이는 음수와 양수가 수직선에서 반대 방향을 가리키기 때문에 크기만 비교하면 부분 상쇄를 쉽게 볼 수 있기 때문이다.', narrationEn: 'We extract absolute values first because they represent distance from zero regardless of direction; signs (directions) are decided afterwards. This works because negatives and positives point opposite ways on the number line, so we only need to compare how far each is from zero before netting the result.' },
  { math: '7 − 4 = 3',     narrationKo: '부호가 다르기 때문에 큰 쪽의 크기에서 작은 쪽을 빼는 것이다. 이는 한 방향으로의 이동과 반대 방향으로의 이동이 서로를 상쇄하는 모델을 반영한다. 더하기 전체가 아니라 차이만 남는 이유다.', narrationEn: 'Because the signs oppose we subtract the smaller magnitude from the larger. This models opposing directed movements on the number line that partially cancel; the net displacement keeps only the difference and the direction of the longer move.' },
  { math: 'Result sign: −',   narrationKo: '7이 4보다 크므로 남는 방향은 원래 −7의 방향(음수)이다. 절댓값이 큰 수가 결과의 부호를 결정하는 것은 거리가 더 먼 이동이 이기는 원리 때문이다.', narrationEn: 'The larger magnitude (7) belonged to the negative, so the result keeps the negative sign. The number farther from zero "wins" the direction because its movement was stronger than the opposing one.' },
  { math: '∴ −3',          narrationKo: '최종 결과. 이처럼 부호 규칙은 수직선 이동의 방향과 크기를 일관되게 다루기 위한 약속이다.', narrationEn: 'Final result. The sign rule is simply a consistent contract for handling size and direction together on the number line.' },
]
```

### Example 2: C7-CH02-FRACTIONS-DECIMALS worked + misconception
**Before:**
worked steps: "분자는 분자끼리.", "분모는 분모끼리.", "약분으로 마무리."
misconception why: "덧셈 규칙을 곱셈에 잘못 적용했다."

**After (key excerpt):**
narrationKo for numerators: "분자끼리 곱하는 이유는 '전체의 몇 분의 몇' × '전체의 몇 분의 몇'이 '전체의 (a×c) 분의 (b×d)' 가 되기 때문이다. 이는 면적(또는 확률) 모델에서 부분 × 부분 = 더 작은 부분이라는 직관을 정확히 반영한다."
misconception why: "학생은 분수 연산을 모두 '통분이 먼저'라고 외웠다. 덧셈·뺄셈에서는 공통분모가 필수지만, 곱셈은 '부분의 부분'을 직접 구하므로 분모를 맞출 필요가 없다. '더하기'라는 단어가 아니라 '곱하기'라는 연산 기호를 보고 규칙을 선택해야 한다는 점을 놓쳤다."
correct: "곱셈에서는 분자·분모를 그대로 곱한 뒤 약분한다. 공통분모는 오직 + 와 − 에서만 필요하다. 이는 곱셈이 '배'의 연산이기 때문이다."

### Example 3: Proof / Euclid (C9-CH05) misconception (Korean 2022 emphasis)
**Before (shallow):**
wrongKo: '공리는 증명할 수 있다.'
whyKo: '공리와 정리를 구분 못 함.'

**After:**
whyKo: "학생은 모든 수학적 주장이 '증명'되어야 한다고 생각한다. 중학교 때까지 '왜 그런지' 설명을 요구받았기 때문에, 공리(자명한 출발점)도 어딘가에서 증명해야 한다고 착각한다. 2022 개정 교육과정에서 처음으로 '공리 → 정리'의 사슬 구조를 배우면서, '증명 없이 그냥 쓰는 것'에 대한 불편함이 생기는 지점이다."
correctKo: "공리는 증명의 출발점으로 '가정'하는 것이다. 증명하려는 대상이 아니라, 그 위에서 다른 명제를 끌어내는 기초다. Euclid 공준처럼 '두 점을 지나는 직선은 하나뿐'은 우리가 받아들이고 시작하는 약속이며, 이로부터 정리들을 유도한다. 가정을 증명하려 들면 순환 논증에 빠진다."

### Example 4: STUDY / distractor rationale (K-G7-MATH1-CH02-INTEGERS sign error)
**Before (short analyst note):**
errorReason: '부호를 무시하고 절댓값만 더한 결과.'

**After (elaborated 4-part, student-facing):**
"이는 '부호가 다른 수의 덧셈'에서 절댓값만 더하고 부호를 무시하는 전형적인 SIGN_ERROR다. 학생은 이전에 '크기끼리 더한다'는 패턴을 성공적으로 썼던 기억 때문에 이번에도 '더하기니까 크기를 합치자'고 생각했다. 하지만 여기서는 한 수는 양의 방향, 한 수는 음의 방향이므로 방향을 고려한 차이를 내야 한다. 올바른 방법은 절댓값 차를 구한 뒤 큰 수의 부호를 따르는 것이다. 다음에는 수직선을 그려보고 '어느 방향으로 얼마나 움직이는가?'를 먼저 말로 표현해 보자."

## Prompt & LLM Guidance
- When editing llm-draft.service.ts or writing new seed data, the prompts must explicitly require the 4-part rationale and "because" narration style.
- Always tell the model: "Every wrong-choice rationale must be written as if it will be shown (or closely paraphrased) to a real student in feedback. Name the misconception, explain why it fails *in this problem*, contrast the correct thinking, and end with a one-sentence repair hint."
- For Korean content, add: "2022 개정 교육과정의 특징적 오개념(증명 가정 오류, x/y 좌표 스왑, 평균-중앙값 혼동, 순환 논증)을 적극적으로 생성하고, rationale에도 반영하라."

## Common Patterns & EXEMPLAR_REUSE
See `exemplar-rationales.ts` for copy-pasteable high-quality ko/en pairs for:
- Sign/direction errors (integers, trig signs, negative exponents)
- Common-denominator applied to multiplication/division
- Mean pulled by skew vs median (stats chapters)
- Assuming a theorem or property before it is proved (geometry, Euclid, identities)
- Coordinate (x,y) swap or axis confusion (graphs, coordinate geom, functions)
- Exponent vs logarithm mix-ups, base/exponent reversal
- "Add numerators and denominators separately"
- "SSA is always congruence" (ambiguous case)
- Treating axioms as things that need proof

When a chapter's error matches one of these, prefer the exemplar text (adapted to the concrete numbers) for consistency across the curriculum.

## Final Gate Before "Done" on a Chapter
Run the 7-point checklist from the Rubric. If any narration still sounds like a procedure title ("이항한다", "약분한다", "정리한다") without the "왜 / because" justification, it is not finished.

This document + the Rubric + the exemplar library are the single source of truth for what "sufficient" means in mathema concept teaching and error feedback. Future contributors (human or AI) must read them before touching content.

(2026-06-14 initial version — will be expanded with more before/after pairs as batches are completed.)
