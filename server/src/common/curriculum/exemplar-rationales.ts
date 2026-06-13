/**
 * Reusable high-quality student-facing elaborated rationales for common misconceptions.
 * Both Korean and English provided. Use (adapted to concrete problem numbers)
 * in concept-content worked/misconception/retrieval upgrades and in STUDY errorReason fields.
 *
 * These implement the 4-part structure required by CONTENT_QUALITY_RUBRIC.md:
 * 1. Name the misconception or slip.
 * 2. Why it fails in *this* specific context (seductive prior rule or surface similarity).
 * 3. Correct contrast with the model or definition that actually applies here.
 * 4. Repair / next-step hint or question the student can use.
 *
 * 2026-06-14 created per Rubric. Expand as new patterns appear during the all-chapters pass.
 */

export const EXEMPLAR_RATIONALES = {
  ko: {
    signErrorDifferentSigns: `이는 '부호가 다른 수의 덧셈/뺄셈'에서 절댓값만 더하거나 부호를 무시하는 전형적인 부호 오류(SIGN_ERROR)다. 학생은 이전에 '크기끼리 더한다'는 패턴이 통했던 기억 때문에 이번에도 '더하기니까 그냥 크기를 합치자'고 생각했다. 하지만 여기서는 한 방향(양수)과 반대 방향(음수)의 이동이므로 방향을 고려한 차이를 내야 하며, 큰 쪽의 방향이 결과 부호가 된다. 올바른 방법은 절댓값 차를 구한 뒤 큰 수의 부호를 따르는 것이다. 다음에는 수직선을 그려 '어느 방향으로 얼마나 움직이는가'를 먼저 말로 표현해 보자.`,

    signErrorSameSigns: `이는 부호가 같은 수에서 '차를 구한다'거나 부호를 반대로 붙이는 오류다. 학생은 '다른 부호일 때만 더하고, 같을 때는 뺀다'는 규칙을 거꾸로 외웠거나, '항상 큰 수에서 작은 수를 빼야 한다'는 기계적 습관에 빠졌다. 실제로는 부호가 같으면 방향이 같으므로 크기를 더하고 그 방향(부호)을 그대로 유지해야 한다. 수직선에서 같은 방향 이동은 서로 더해진다는 모델을 떠올리면 쉽게 피할 수 있다. 다음 문제에서는 '방향이 같은가, 반대인가?'를 먼저 확인하자.`,

    commonDenominatorInMultiplication: `이는 분수 곱셈에서 '통분이 먼저'라고 생각하는 흔한 오개념(CONCEPT_CONFUSION)이다. 학생은 덧셈·뺄셈 규칙(공통분모 필수)을 모든 분수 연산에 기계적으로 적용했다. 하지만 곱셈은 '전체의 a/b × 전체의 c/d = 전체의 (a×c)/(b×d)'라는 '부분의 부분' 모델이므로 분모를 맞출 필요가 전혀 없다. 공통분모는 오직 + 와 − 에서만 필요하다. 다음에는 연산 기호를 보고 '더하기/빼기인가, 곱하기/나누기인가?'를 먼저 물어보자.`,

    meanVsMedianConfusion: `이는 평균과 중앙값의 차이를 혼동하는 대표적인 대푯값 오류다. 학생은 '모든 데이터를 더해서 개수로 나누는 것'이 항상 가장 '전형적인' 값이라고 생각한다. 하지만 자료가 한쪽으로 치우쳐 있으면(예: 소득, 시험 점수, 강수량) 극단값 한두 개가 평균을 끌고 가서 실제 대부분의 사람이 느끼는 '중간'과 멀어진다. 중앙값은 값을 정렬했을 때 가운데 위치만 보기 때문에 비대칭 분포에서 더 저항적(resistant)이고 '전형적'이다. 2022 개정에서 강조하는 '맥락에 맞는 대푯값 선택'의 핵심이다. 다음에는 '이 자료가 대칭인가, 한쪽으로 치우쳐 있는가?'를 먼저 보자.`,

    assumingWithoutProof: `이는 '증명 없이 성질을 사용한다'는 오류로, 특히 유클리드 기하·삼각형·사각형·원 단원에서 자주 나타난다. 학생은 '이 각이 같으니까 저 각도 같겠지' 또는 '이 성질은 전에 봤으니까 그냥 써도 된다'고 생각한다. 그러나 2022 개정 교육과정에서 중2부터 본격 도입되는 증명의 본질은 '공리(가정)에서 출발해 논리적 사슬로 정리를 끌어내는 것'이다. 아직 증명되지 않은 성질을 중간에 쓰면 순환 논증(circular reasoning)이 된다. 올바른 방법은 '지금 이 단계에서 내가 쓸 수 있는 것은 이미 증명된 정리 또는 공리뿐'이라고 스스로 점검하는 것이다. '이 사실은 어디서 왔는가? 이전 공리/정리에서 유도되었는가?'를 항상 물어보자.`,

    coordinateSwap: `이는 좌표평면에서 (x, y) 순서를 혼동하거나 x축/y축을 바꿔 읽는 전형적인 그래프 오류다. 학생은 '가로가 y, 세로가 x'라고 생각하거나, 독립변수(원인)를 세로축에 놓는다. 2022 개정 '변화와 관계' 영역에서 그래프는 '한 양의 변화가 다른 양에 미치는 영향'을 시각화하는 도구다. 따라서 독립변수(입력)를 항상 가로축(x), 종속변수(출력)를 세로축(y)에 배치해야 한다. (x, y) 점을 찍을 때는 '먼저 가로로 x만큼, 그 다음 세로로 y만큼' 순서를 지켜야 한다. 다음에는 '어느 것이 원인(입력)인가?'를 먼저 정하고 축을 라벨링하자.`,

    exponentSignFlipOrBaseConfusion: `이는 지수에서 밑과 지수를 바꾸거나 음수 지수의 부호를 잘못 처리하는 오류(EXPONENT_ERROR)다. 학생은 'a^n은 a를 n번 곱한다'는 정의를 'n^a'로 뒤집거나, 2^{-3} = -8 이라고 생각한다. 음수 지수는 '분수로의 역수' 의미(a^{-n} = 1/a^n)이고, 밑은 항상 아래쪽 숫자다. 0 지수(a^0 = 1, a≠0)도 자주 혼동된다. 올바른 방법은 정의로 돌아가 '이 지수는 몇 번의 곱셈을 뜻하는가?' 또는 '음수 지수면 분모로 내려가야 한다'를 확인하는 것이다. 숫자 2와 3으로 간단히 테스트해 보자.`,

    addNumeratorsAndDenominators: `이는 '분수 덧셈에서 분자+분자, 분모+분모'로 계산하는 ADD_NUMERATOR_ONLY / DENOMINATOR_ERROR다. 학생은 '분수도 그냥 정수처럼 더하면 되겠지'라고 직관적으로 생각하거나, '통분 귀찮으니까' 지름길을 택한다. 하지만 분모가 다르면 1/2과 1/3은 '같은 단위'가 아니므로 크기를 더할 수 없다. 반드시 공통분모로 통분한 뒤 분자만 더해야 한다. 이는 '부분 + 부분'이 되려면 단위가 같아야 한다는 모델에서 온다. 다음에는 '분모가 같은가?'를 가장 먼저 확인하자.`,

    ssaAmbiguousCase: `이는 SSA(두 변과 그중 하나에 대응하지 않는 각) 조건이 합동을 보장한다고 착각하는 오류다. 학생은 '변 두 개와 각 하나면 충분할 것'이라고 일반화한다. 실제로는 SSA는 '모호한 경우(ambiguous case)'를 만들어 두 개의 다른 삼각형이 가능하다(특히 예각일 때). 직각이 포함된 RHS(Right angle-Hypotenuse-Side)만 안전하다. 합동 조건은 SSS, SAS, ASA, AAS, RHS뿐이다. '지금 주어진 각이 끼인 각인가, 아닌가?'를 확인하는 습관을 들이자.`,

  },

  en: {
    signErrorDifferentSigns: `This is the classic "sign error on different signs" (SIGN_ERROR / CONCEPT_CONFUSION). The student added the absolute values as if both numbers had the same sign or forgot that the result keeps the sign of the number with the larger magnitude. In this problem the directions oppose on the number line, so we subtract the distances and attach the sign of the longer move. Opposite signs mean partial cancellation, not addition of sizes. Correct move: difference of absolutes + sign of the larger. Next time: draw arrows on a number line first and say out loud "this one goes right, that one goes left — which wins?"`,

    signErrorSameSigns: `This reflects the "sign error on same signs" misconception. The student subtracted magnitudes or flipped the sign even though both numbers point the same direction. When signs agree, the moves reinforce, so we add the distances and keep that common sign. The rule is not "always subtract the smaller from the larger"; it is "add when directions match, subtract when they oppose." Draw the number line or ask "are the directions the same or opposite?" before computing.`,

    commonDenominatorInMultiplication: `This is the "common denominator for everything" error (CONCEPT_CONFUSION). The student applied the addition/subtraction rule (you must have a common denominator) to multiplication. For multiplication we are taking "a part of a part," so we simply multiply numerators and denominators directly — no common denominator is required. Common denominators are needed only for + and −. Look at the operation symbol first: is it ×/÷ or +/−?`,

    meanVsMedianConfusion: `This is the mean-vs-median confusion in statistics (CONCEPT_MISUNDERSTANDING). The student believes "add everything and divide by how many" always gives the most "typical" value. In skewed data (incomes, test scores, rainfall) one or two extreme values pull the mean far away from where most of the data actually sits. The median only looks at the middle position after sorting, so it resists outliers and better represents the "typical" case in asymmetric distributions. In the 2022 Korean curriculum this is exactly why we must choose the representative value according to the question and the shape of the data. Before choosing, ask: "Is this data roughly symmetric or strongly skewed?"`,

    assumingWithoutProof: `This is the "assuming a property without having proved it" error (PROCESS_SKIP / assumingWithoutProof). The student treats a theorem or property seen earlier as something that can be used freely, even inside a proof that is supposed to establish it. In the 2022 curriculum, proof is introduced as an explicit chain: axioms/postulates (things we agree to accept without proof) → theorems (things we derive from those axioms by logical steps). Using an unproved statement in the middle creates a circular argument. The safe habit is to ask at every step: "Is this a postulate we were given, or a theorem we have already proved earlier in this chain?" If neither, we cannot use it yet.`,

    coordinateSwap: `This is the coordinate swap / axis confusion error (CONCEPT_CONFUSION). The student plots or reads (x, y) as (y, x), or puts the independent variable on the vertical axis. In the 2022 "change and relationships" emphasis, a graph shows how one quantity (the independent/input variable) affects or determines another (the dependent/output). By convention the input always goes on the horizontal (x) axis and the output on the vertical (y) axis. When reading or plotting a point, move horizontally first for x, then vertically for y. Before graphing ask: "Which quantity is the cause/input?" and label that axis x.`,

    exponentSignFlipOrBaseConfusion: `This is an exponent base/exponent reversal or negative-exponent sign error (EXPONENT_ERROR). The student computes a^n as n^a, or thinks 2^{-3} = -8, or forgets that a negative exponent means "take the reciprocal." The definition is repeated multiplication of the base (the lower number). a^{-n} = 1/a^n (a ≠ 0); a^0 = 1 (a ≠ 0). Always go back to the definition: "How many times am I multiplying the base by itself?" Test with tiny positive integers (2 and 3) before applying to the general case.`,

    addNumeratorsAndDenominators: `This is the "just add numerators and denominators separately" shortcut error (ADD_NUMERATOR_ONLY / DENOMINATOR_ERROR). The student treats fractions like whole numbers and adds top and bottom independently because "it looks like addition." When denominators differ, the pieces are not the same size, so you cannot add the numerators until you rewrite both fractions with a common unit (common denominator). Only after the denominators match do you add the numerators. The underlying model is "parts can only be combined when they are measured in the same unit." Check "Do the denominators already match?" before doing anything else.`,

    ssaAmbiguousCase: `This is the SSA-is-always-congruence misconception. The student generalizes "two sides and one angle" and expects a unique triangle. SSA (two sides and a non-included angle) is ambiguous in general: two different triangles can satisfy the same three measurements (especially when the given angle is acute). Only the RHS version (right angle + hypotenuse + one leg) is safe among the "two sides + angle" family. The complete list of congruence tests that guarantee a unique match is SSS, SAS, ASA, AAS, and RHS. Ask: "Is the given angle the included angle between the two sides?" If not, be careful.`,

  },
} as const;

export type ExemplarKey = keyof typeof EXEMPLAR_RATIONALES.ko;

export function getExemplar(key: ExemplarKey) {
  return {
    ko: EXEMPLAR_RATIONALES.ko[key],
    en: EXEMPLAR_RATIONALES.en[key],
  };
}
