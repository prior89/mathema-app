# Master Chapter Upgrade Checklist — "1번" All-Chapters Content Pass
**Date:** 2026-06-14  
**Goal:** One complete, never-revisit pass that makes every NCERT (79) + Korean concept (43) + Korean STUDY file "sufficient" per CONTENT_QUALITY_RUBRIC.md.  
**Order principle (user requirement):** Foundations locked first → full audit + this checklist → batched topic-family upgrades (NCERT families first to establish patterns + exemplars, then Korean concept mirroring the same families with 2022 adaptations, STUDY files upgraded together with their concept family). No chapter touched twice. Structure/keys 100% preserved.

## Current Audit Summary (as of 2026-06-14, pre-upgrade pass)
- **NCERT concept files (6):** class-7.ts (13 ch), class-8.ts (13), class-9.ts (12), class-10.ts (14), class-11.ts (14), class-12.ts (13) = **79 chapters confirmed**.
- **Korean concept files (3):** middle-school.ts (21), high-common.ts (7), high-elective.ts (15) = **43 chapters confirmed**.
- **Korean STUDY files (currently 2, more expected over time):** K-G7-MATH1-CH02-INTEGERS.ts, K-G11-ALG-CH01-EXP-LOG.ts. Each contains ~20 problems with errorCode + short errorReason.
- **Foundations status:** 
  - CONTENT_QUALITY_RUBRIC.md (new, v1)
  - Content_Creation_Guidelines.md (new, with real before/after from audit)
  - exemplar-rationales.ts (new, 9+ reusable 4-part templates in ko/en)
  - llm-draft.service.ts prompts upgraded (v2.2026-06-14, 4-part student-facing rationales, "because" narration, KR 2022 signature misconceptions, Rubric reference). 
- **Current content quality (sampled across all files + full grep on narration patterns):**
  - Worked narration: overwhelmingly shallow/procedural ("절댓값을 따로 본다.", "부호가 다르므로 차를 구한다.", "합을 개수로 나눔.", "공통분모로 통분.", "y 에 대해 x.", "조립제법.", "결론.", "뺄셈 → 나눗셈."). Almost zero causal "because / 때문에 / this works because / 모델링" language.
  - Misconceptions: 1–2 short lines. "부호가 다른데 절댓값을 그대로 더했다.", "덧셈 규칙을 곱셈에 잘못 적용했다.", "공리와 정리를 구분 못 함.", "로그 법칙을 덧셈에도 적용." No student-thinking depth, no seductive-prior-rule analysis, no 2022-specific cards.
  - Abstracts: Better (many have decent rule + model sentences), but still miss explicit "why this holds here / what situation it models" in many places and lack KR 2022 tie-ins.
  - Retrieval explain + distractors / STUDY errorReason: Short, analyst-style or one-sentence. Not the required 4-part elaborated student-facing form.
  - Korean 2022 gaps: Proof chapters (Euclid, lines/angles II, quadrilaterals) have only generic "구분 못 함". Graph/coord chapters (C8-13, C9-03, K-G7-CH04, K high functions) lack x/y swap cards. Stats chapters (C7-03, C8-04, C9-12, C10-13, K stat) have mean/median listed but no skew/representative-value choice narration or misconceptions. No "증명 가정 오류", "순환 논증", "대푯값 맥락 선택" depth.
- **Conclusion of audit:** Every single one of the 79 + 43 + 2 (and future STUDY) requires the full upgrade treatment. No file can be skipped. No chapter is "good enough" yet. Foundations now provide the north star and reusable exemplars so the pass can be done cleanly.

## Execution Order (Topic-Family Batches) — Zero-Rework Sequence
**Rule:** Complete one full family across the relevant NCERT classes first (builds consistent language + tests exemplars), then immediately mirror the same family in Korean concept files (adding 2022 language), then upgrade the matching STUDY file(s) if they exist for that family. Move to next family. Lower-to-higher dependency respected (numbers before algebra before graphs/stats before advanced calc).

1. **Numbers & Integers / Rationals / Reals / Factorization (foundational arithmetic)**
   - NCERT: C7-CH01-INTEGERS, C8-CH01-RATIONAL-NUMBERS, C9-CH01-NUMBER-SYSTEMS, C10-CH01-REAL-NUMBERS (+ C7-CH08-RATIONAL-NUMBERS if separate)
   - Korean concept: K-G7-MATH1-CH02-INTEGERS, K-G7-MATH1-CH01-FACTORIZATION (and any high real/complex that map)
   - STUDY: K-G7-MATH1-CH02-INTEGERS.ts (full 20 problems — deepen every errorReason to 4-part)
   - Special: heavy use of signErrorDifferentSigns, signErrorSameSigns, addNumeratorsAndDenominators exemplars. Add early mean/median if any data handling here.

2. **Fractions, Decimals, Percent, Ratio, Comparing Quantities**
   - NCERT: C7-CH02-FRACTIONS-DECIMALS, C7-CH07-COMPARING-QUANTITIES, C7-CH08 (overlap), C8-CH07-COMPARING-QUANTITIES, C8-CH11-DIRECT-INVERSE (proportion)
   - Korean: corresponding middle fractions/ratio/proportion chapters + high if any
   - STUDY: any that exist for these codes
   - Special: commonDenominatorInMultiplication exemplar.

3. **Equations & Inequalities (linear, simple, pairs, quadratic, one-var)**
   - NCERT: C7-CH04-SIMPLE-EQUATIONS, C8-CH02-LINEAR-EQ-ONE-VAR, C9-CH04-LINEAR-EQ-TWO-VAR, C10-CH03-LINEAR-EQ-PAIRS, C10-CH04-QUADRATIC-EQ, C11-CH05-LINEAR-INEQ, ...
   - Korean: K-G7-MATH1-CH03-LETTERS-EQ and high eq/ineq chapters
   - Special: balance-scale "preserve equality" narration emphasis.

4. **Algebra Expressions, Identities, Polynomials, Factorisation**
   - NCERT: C7-CH10-ALG-EXPRESSIONS, C8-CH08-ALG-IDENTITIES, C8-CH12-FACTORISATION, C9-CH02-POLYNOMIALS, C10-CH02-POLYNOMIALS, C11-CH07-BINOMIAL, ...
   - Korean: K-G10-CS1-CH01-POLYNOMIAL and related
   - Special: identity "holds for every value" why language.

5. **Geometry Foundations + Proof (lines, angles, triangles, quad, Euclid, congruence, similarity, circles)**
   - NCERT: C7-CH05-LINES-ANGLES, C7-CH06-TRIANGLE, C8-CH03-QUADRILATERALS, C9-CH05-EUCLID, C9-CH06-LINES-ANGLES-II, C9-CH07-TRIANGLES-II, C9-CH08-QUADRILATERALS, C9-CH09-CIRCLES, C10-CH06-TRIANGLES-III, C10-CH10-CIRCLES-II, ...
   - Korean: middle basic figures, 중2 proof-related, high geometry
   - Special: **CRITICAL** — assumingWithoutProof exemplar + 2022 "공리→정리 사슬", "가정 명시", "순환 피하기". Every proof chapter must have at least one dedicated misconception card on this.

6. **Graphs, Coordinate Geometry, Functions & Relations ("변화와 관계")**
   - NCERT: C8-CH13-GRAPHS, C9-CH03-COORDINATE-GEOM, C10-CH07-COORDINATE-GEOM-II, C11-CH02-RELATIONS-FUNCTIONS, C11-CH09-STRAIGHT-LINES, C11-CH10-CONIC, C12-CH01-RELATIONS-FUNCTIONS-II, C12-CH02-INV-TRIG (graph aspects), ...
   - Korean: K-G7-MATH1-CH04-COORD-GRAPH, K high functions/graphs, K-G10 etc.
   - Special: **coordinateSwap** exemplar mandatory. x축=독립변수, y축=종속변수, (x,y) 순서 narration + misconception. "변화와 관계" 2022 language in abstracts and reflect.

7. **Exponents, Powers, Roots, Logs, Sequences & Series**
   - NCERT: C7-CH11-EXPONENTS, C8-CH05-SQUARES-ROOTS, C8-CH06-CUBES-ROOTS, C8-CH10-EXPONENTS, C10-CH05-AP, C11-CH06-PERMUTATIONS, C11-CH08-SEQUENCES, C12-CAL2 sequences, ...
   - Korean: K-G11-ALG-CH01-EXP-LOG (already has a STUDY file) + roots/logs chapters
   - STUDY: K-G11-ALG-CH01-EXP-LOG.ts — upgrade all 20 errorReasons with exponentSignFlipOrBaseConfusion etc.
   - Special: exponent exemplar + log vs exp reversal.

8. **Statistics, Data Handling, Probability (mean/median/mode, skew, distributions, conditional)**
   - NCERT: C7-CH03-DATA-HANDLING, C8-CH04-DATA-HANDLING, C9-CH12-STATISTICS, C10-CH13-STATISTICS-II, C10-CH14-PROBABILITY, C11-CH13-STATISTICS-III, C11-CH14-PROBABILITY-II, C12-CH13-PROBABILITY-III, ...
   - Korean: middle stat chapters + high 확률과통계 electives
   - Special: **meanVsMedianConfusion** exemplar + 2022 "대푯값 선택의 맥락(비대칭/이상치/소득·성적)" emphasis in every stats chapter. Early introduction in C7/C8/K-G7 must already teach the "why median resists" idea.

9. **Trigonometry (intro, applications, functions, inverse)**
   - NCERT: C10-CH08-TRIG-INTRO, C10-CH09-TRIG-APPLICATIONS, C11-CH03-TRIG-FUNCTIONS, C12-CH02-INV-TRIG, ...
   - Korean: corresponding trig fn chapters
   - Special: sign in quadrants, unit circle "why", inverse principal value.

10. **Advanced / Calculus / Vectors / 3D / Matrices / Linear Programming / Diff Eq (build on all prior)**
    - NCERT: C11-CH04-COMPLEX, C11-CH11-3D-INTRO, C11-CH12-LIMITS-DERIVATIVES, C12 all remaining (CONTINUITY, APP-DERIV, INTEGRALS, APP-INTEGRALS, DIFF-EQ, VECTORS, 3D-GEOM, LP, ...)
    - Korean: 고3 미적분, 기하, 대수 advanced electives
    - Special: only after families 1-9 are solid (limits rely on functions/graphs/alg, integrals on area/accumulation models from earlier geometry/stats).

**Post-1번 (after this checklist is 100% green):** Only then system work (seeds, any validator script that enforces Rubric rules in data, reseed tests, git per-feature commits of pure content data, multi-AI worktree rules if more agents join).

## Tracking Format (use during the pass)
For each batch/family:
- [ ] NCERT chapters in family rewritten + header comment added + Rubric gates passed (manual spot-check 2-3 worked/miscon + 1 rationale)
- [ ] Korean concept chapters in family rewritten + 2022 language + same gates
- [ ] STUDY problems (if any for the codes) errorReasons upgraded to 4-part + exemplars used
- [ ] Cross-sample: open the chapter in mind (or later via app), walk HOOK→...→RETRIEVAL, simulate one wrong distractor → richer feedback appears.

**Global final gate (after last batch):**
- Grep or script check that "because|때문에|this works because|모델링|왜냐하면" appears in virtually every narration and many abstracts/misconceptions across the 6+3 files.
- No chapterCode left with only the old 1-line narrations.
- All 79+43+existing STUDY touched exactly once in this pass.

## High-Impact Chapters (upgrade early in their family, extra care)
- All Integers/Rationals (base sign rules for everything later)
- C9-CH05-EUCLID + C9-CH06/07/08 (proof mindset sets the tone for geometry)
- All stats chapters (mean/median is a very common real-world misconception)
- All graph/coord/function chapters (x/y swap is extremely frequent for Korean students)
- C7-CH01/02 and K-G7-MATH1-CH02 (first chapters many users see)

## Notes for Implementers (human or future AI)
- Use `getExemplar('signErrorDifferentSigns')` etc. from exemplar-rationales.ts and adapt the numbers/context.
- Keep every object key and array length identical.
- Add the exact header: `// 2026-06-14 upgraded per CONTENT_QUALITY_RUBRIC.md — all narration, misconceptions, abstracts, rationales enriched for depth. Exact structure/keys preserved.`
- When in doubt on a rationale, make it kinder and more precise — the goal is repair, not shaming.
- After finishing a batch, update this file's checkboxes and commit the pure data change with conventional message (see user's multi-AI git rules).

This checklist + the Rubric + Guidelines + exemplars = the complete contract for "1번" perfect all-chapters upgrade with zero rework afterward.

**Status (live tree, 2026-06-14 after initial port + refresh-audit + Batch 1 progress):**

**Foundations:** ✅ Fully ported and verified (RUBRIC.md, Content_Creation_Guidelines.md, exemplar-rationales.ts, Master_Chapter_Upgrade_Checklist.md). All in live mathema-app tree only. Desktop/mathema-kr ignored permanently.

**Batch 1 (Numbers / Integers / Rationals family) - audited & progressing:**
- C7-CH01-INTEGERS: ✅ (full Rubric: rich "because/모델링" narration in all 4 worked steps, 4+ sentence misconception with SIGN_ERROR + student prior pattern + number line model + exemplar ref, enriched abstract + retrieval explain).
- C7-CH02-FRACTIONS-DECIMALS: ✅ (full "part of a part" model narration, commonDenominatorInMultiplication 4-part misconception, "because" in abstract/worked).
- C7-CH03-DATA-HANDLING: ✅ (strong mean/median resistance narration with "균형점" vs "저항성", meanVsMedianConfusion + 2022 "대푯값 선택" in misconception).
- K-G7-MATH1-CH01-FACTORIZATION: ✅ (detailed "why smallest prime first + uniqueness model", 2022 "산술의 기본정리" tie-in, expanded misconception on why 1 excluded).
- K-G7-MATH1-CH02-INTEGERS: ✅ (direction/sign model narration with "이유는 ... 때문이다", 2022 "기초" mention in abstract, full student-intuition misconception for powers).
- C8-CH01-RATIONAL-NUMBERS: ✅ Upgraded (rich common-denominator model narration with "같은 단위" + "등식의 성질 보존", full ADD_NUMERATOR_ONLY misconception with student "위/아래 숫자끼리" habit + exemplar, enriched abstract with "why field models consistent measurement" + 2022 순환소수).
- C9-CH01-NUMBER-SYSTEMS: ✅ Upgraded (detailed proof-by-contradiction narration with explicit "가정 → 모순 → 거부" chain + 2022 "가정 명시", full "π=22/7 exactly" misconception, enriched completeness abstract).
- C10-CH01-REAL-NUMBERS: ✅ Upgraded (rich FTA "why unique factorization determines everything" narration with "indivisible building blocks" model + HCF/LCM exponent min/max explanation, full sum-vs-product misconception from FTA, enriched abstract with "why FTA proves completeness + 2022 emphasis").
- K-G9-MATH3-CH01-REAL-NUMBERS (KR mirror): ✅ Upgraded (rich rationalization "why conjugate preserves value + FTA link", 2022 completeness mention, expanded sqrt(a²+b²) misconception with Pythagoras error, enriched retrieval with FTA note).
- K-G9-MATH3-CH01-REAL-NUMBERS-STUDY: ✅ Sample upgraded (first 3 easy + 1 medium problem's errorReasons to full 4-part elaborated + exemplar refs, matching Rubric student-facing style. Pattern established for the family).

**Gates passed for audited:** Explanatory "because/때문에/모델" language abundant. Misconceptions 3+ lines with student thinking + contrast + 2022 where relevant. No structure changes. Headers present.

**Next (continue item 5):** C10-CH01 + finish Batch 1. Then item 6 (next families per checklist order).

**Important:** All work exclusively in live tree `Documents/Claude/Projects/mathema-app`. Git commits only from here. Review diff and commit current ports (foundations + C7/C8/C9 content) with conventional message like "feat(content): upgrade Batch 1 Numbers family (C7–C9 + KR G7 + foundations) per Rubric".

(Updated after live tree audit + C8/C9 upgrades. Continue sequential, no rework.)

**Gates passed for audited:** Explanatory "because/때문에/모델" language present (21+ in C7, 8+ in KR sample). Misconceptions 3+ lines with student thinking + contrast. No structure changes. Headers present.

**Next (item 5):** Complete Batch 1 Numbers family (C8-CH01-RATIONAL-NUMBERS, C9-CH01, C10-CH01 + mirrors + STUDY). One by one, Rubric gates before next.

**Important:** All work exclusively in live tree `Documents/Claude/Projects/mathema-app`. Git commits only from here.

(Updated after refresh-audit on live tree. Continue sequential per checklist.)
