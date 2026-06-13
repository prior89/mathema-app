# Mathema Content Quality Rubric
**Version:** 2026-06-14  
**Scope:** All NCERT concept-content/*.ts (79 chapters), Korean concept-content-ko/* (43 chapters), korean-problems/*-STUDY.ts, and any LLM draft prompts or seed data that feed ConceptLesson 5/7-step flows or AnswerFeedback / ExamTaking / MockExamPlay feedback.  
**Golden Rule:** Every student-facing explanation must be "sufficient": it names the idea/misconception, explains *why* it works or fails in this exact context (using "because / 때문에 / this works because / 이를 통해 ...을 모델링"), contrasts with the correct move, and gives a tiny actionable next-step or repair hint. Data-only changes; structure/keys of chapters never altered.

## 1. Worked Example Narration (Highest Priority Gate)
**Requirement:** Every `worked.steps[n].narrationKo` / `narrationEn` (and Korean `narration`) MUST be explanatory, not telegraphic.

- **Mandatory language:** Must contain explicit causal/explanatory connectors in the language of the field:
  - English: "because", "this works because", "this preserves", "models the situation", "to keep the balance/equality/...", "the reason we can do this is", "reflecting that..."
  - Korean: "왜냐하면 ... 때문이다", "이는 ...이기 때문이다", "등식을 유지하기 위해", "수직선에서 방향이 반대이므로", "모델링한다", "증명의 가정으로 ...를 두는 이유는"
- **Length & depth:** 1 sentence minimum that goes beyond "what" to "why this step is valid here and what invariant/property it relies on".
- **NCERT examples of sufficient depth:**
  - Integers: "부호가 다르므로 절댓값의 차를 구하는 것이다. 이는 음수와 양수를 더할 때 방향이 반대이기 때문에 크기 차이만 계산하면 되기 때문이다. 수직선에서 오른쪽 이동과 왼쪽 이동이 부분적으로 상쇄되는 원리를 반영한다."
  - Equations: "양변에 같은 수를 더하거나 빼는 이유는 저울의 양팔에 동일한 무게를 추가/제거해도 균형이 깨지지 않기 때문이다. 이는 등식의 성질(가감법)이 '균형 유지'라는 모델에서 직접 도출되기 때문이다."
- **Proof / Euclid chapters (C9-CH05, related):** Narration must name the assumption being introduced ("a = b라고 가정하는 이유는...") and what we are licensed to do from axioms/postulates without circularity.
- **Korean 2022 signature (graphs, stats, proof):** 
  - Graphs/coord: "x와 y를 바꿔 생각하는 오류를 피하기 위해, 입력(독립변수)을 항상 가로축에 배치한다. 이는 '변화와 관계'에서 한 변수가 다른 변수를 어떻게 결정짓는지 시각화하는 2022 개정의 핵심이다."
  - Stats (mean/median): "합을 개수로 나누는 것은 평균의 정의이지만, 극단값이 평균을 한쪽으로 끌고 가는 이유는 각 데이터가 동등한 가중치를 갖기 때문이다. 반면 중앙값은 위치만 보기 때문에 비대칭 분포에서 '전형적' 값을 더 잘 대표한다."

**Fail examples (current shallow, must be rewritten):**  
"절댓값을 따로 본다.", "부호가 다르므로 차를 구한다.", "합을 개수로 나눔.", "공통분모로 통분.", "결론.", "조립제법."

**Pass test:** Read the narration aloud — does a 7th-grader understand *why* the move is legal and what it represents in the real model (number line, balance, area, etc.)?

## 2. Misconception Card Depth
**Structure (all three fields required and non-trivial):**
- `wrong*`: The exact incorrect statement or answer the student produces.
- `why*`: Minimum ~3 lines / 2-3 sentences. Describe:
  1. The plausible student thinking or prior rule mis-application that produces this.
  2. In which problem features this trap is especially attractive (signs, common terms, "it worked last chapter", "I saw x and y swapped before", "proofs are just 'apply the thing'").
  3. The surface similarity to a correct rule that makes it seductive.
- `correct*`: The right move + explicit contrast ("대신 ...을 해야 하는 이유는...").

**Korean 2022 proof/stats/graph emphasis (mandatory for relevant chapters):**
- "증명 없이 성질을 사용한다" (assuming a theorem before it is proved, or treating a postulate as needing proof).
- "그래프에서 x/y 좌표를 혼동한다" (reading (x,y) as vertical/horizontal swap, confusing independent/dependent).
- "대푯값 선택 오류" (mean vs median in income, test scores, or right-skewed data; why mean is pulled while median resists).
- "공리/정리 구분 오류", "순환 논증" (using the thing you are proving inside the proof).

**Example sufficient (Integers sign error):**
wrong: "(-7) + (+4) = -11"
why: "학생은 부호가 다를 때도 '크기끼리 더한다'는 규칙을 기계적으로 적용했다. 이전에 음수끼리 더할 때는 절댓값을 더하고 부호를 붙이는 패턴이 성공했기 때문에, 이번에도 '더하기'라는 단어에 이끌려 크기를 무조건 합산했다. 실제로는 방향이 반대인 이동이므로 차이를 내고 큰 쪽의 방향을 따라야 한다는 점을 놓쳤다."
correct: "부호가 다르면 절댓값 차를 구하고, |·|가 큰 수의 부호를 따른다. 이는 수직선에서 반대 방향 이동이 부분적으로 상쇄되기 때문이다."

## 3. Student-Facing Elaborated Rationales (for distractors / error feedback)
**Applies to:**
- concept-content retrieval.distractors[].rationaleKo/En
- Korean STUDY options[].errorReason (and solution explanations)
- Any LLM-generated DraftChoice.rationale (CONCEPT/PROCESS/ANSWER steps)
- Future AnswerFeedbackSheet / ExamTakingScreen / MockExamPlayScreen messages (even if currently derived from these data).

**Mandatory 4-part structure (2-4 full sentences):**
1. **Name the misconception/slip** ("This is a classic sign-error on different signs / common-denominator-in-multiplication / mean-vs-median confusion / assuming a property without having proved it / x/y coordinate swap...")
2. **Why it fails specifically here** (tie to the numbers, diagram, proof assumption, skew in the data set, or the exact operation in the stem).
3. **Correct contrast** ("Instead, we ... because ...")
4. **Repair / next-step hint** ("Next time draw the number line / ask 'is this addition or multiplication?' / check 'what is the independent variable on the horizontal axis?' / test with a simple number like 2 and 3 before generalizing.")

**Tone:** Kind, precise, student-to-student. Never "you are wrong because you are careless." Always "많은 학생들이 ... 때문에 이렇게 생각하기 쉽습니다. 하지만 여기서는..."

**Do NOT** leave rationale as analyst-only shorthand ("sign slip", "added denom"). Every rationale is shown or paraphrased to the learner in feedback.

## 4. Abstract Step
- Must not be a pure rule list.
- Add at least one sentence: "why this rule holds / what situation in the world it models / what invariant it protects".
- For Korean 2022 chapters: explicitly surface the curriculum emphasis (e.g. "2022 개정에서 강조하는 '변화와 관계' 관점에서 함수는 한 양의 변화가 다른 양에 미치는 영향을 나타내는 도구다.").

## 5. Concrete / Pictorial / Hook / Retrieval / Reflect
- Concrete & Pictorial: prefer real or imaginable models (temperature, pizza, balance, area, coordinate plane as "위치와 관계"). Avoid pure procedural.
- Retrieval explain: must be at least as rich as a good worked narration (mini "because").
- Reflect prompts: for proof chapters ask "이 공리를 가정하지 않고 어떻게 시작할 수 있을까?", for stats "이 자료가 오른쪽으로 치우쳐 있다면 평균과 중앙값 중 어떤 것이 더 '대표적'일까? 그 이유는?"

## 6. Korean 2022 개정 Curriculum Specific Gates (non-negotiable for KR files)
- 중2 proof introduction (Euclid-style 공리→정리 사슬): every proof-related worked/misconception must surface "가정(assumption) 없이 증명할 수 없다", "순환을 피하는 방법".
- Early statistics (대푯값): mean/median/mode choice in context of skew, outliers (소득, 성적, 강수량).
- Graphs & functions (변화와 관계, 일차함수, 그래프 해석): x축=독립변수, y축=종속변수 명시; "x와 y를 바꿔 그리는" 흔한 오개념 카드 필수.
- Coordinate geometry: (x,y) 순서, 원점 기준 방향 명확화.
- Functions/relations: "각 입력에 유일한 출력"의 의미를 "왜"와 함께.

## 7. Overall Quality Gate (before any chapter is considered "upgraded")
- [ ] Every worked step narration passes the "because / 때문에" explanatory test (use grep or manual).
- [ ] Every misconception has why + correct fields that are 2+ sentences and contain student-thinking language.
- [ ] Every distractor rationale (where present) or STUDY errorReason follows the 4-part elaborated form or references an EXEMPLAR.
- [ ] Abstract contains at least one "why this holds / models" sentence.
- [ ] For KR chapters in proof/stats/graph families: dedicated 2022-specific misconception language present.
- [ ] Structure, chapterCodes, step order, key names 100% identical to before (data-only).
- [ ] Added header comment in the .ts file: `// 2026-06-14 upgraded per CONTENT_QUALITY_RUBRIC.md — all narration, misconceptions, abstracts, rationales enriched for depth. Exact structure/keys preserved.`

## 8. How to Use This Rubric
1. Before editing a chapter, re-read its current worked/misconception/abstract/retrieval.
2. Rewrite only the value strings (never keys).
3. Cross-reference EXEMPLAR_RATIONALES for common cases.
4. After edit, run the "pass test" above.
5. When adding new chapters or regenerating via LLM, the updated prompts in llm-draft.service.ts + this rubric + guidelines are the contract.

This rubric exists so that future human authors or LLM drafts never regress to the shallow "절차만 나열" style that research shows produces weaker transfer and poorer misconception repair.

(End of Rubric — see Content_Creation_Guidelines.md for concrete before/after rewrites and the checklist to follow on every chapter.)