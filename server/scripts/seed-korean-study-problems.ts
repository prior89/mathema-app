/**
 * seed-korean-study-problems.ts — Study (single-step) pool 시드.
 *
 * Mastery 3-step pool과 별도. KoreanConceptLesson.id를 koreanConceptLessonId
 * FK로 사용하되 ProblemStep 1개 (stepType=ANSWER) — Mastery 풀과 구분.
 * Mastery filter (steps.length=3) 가 Study problem을 제외함.
 *
 * Idempotent: 같은 chapter 의 single-step Problem rows 만 청소 (3-step Mastery
 * rows 는 보존). Attempt FK cascade 처리.
 */
import { PrismaClient, Difficulty, StepType } from '@prisma/client';
import { KOREAN_STUDY_PROBLEMS, KoreanStudyProblemSeed } from '../src/common/curriculum/korean-problems';

const args = process.argv.slice(2);
const codeIdx = args.indexOf('--code');
const specificCode = codeIdx >= 0 ? args[codeIdx + 1] : null;

const DIFFICULTY_MAP: Record<KoreanStudyProblemSeed['difficulty'], Difficulty> = {
  easy: 'MIDDLE', medium: 'UPPER_MIDDLE', hard: 'SEMI_KILLER',
};
const DIFFICULTY_LEVEL: Record<KoreanStudyProblemSeed['difficulty'], number> = {
  easy: 2, medium: 3, hard: 4,
};

const REASON_POLISH: Record<string, string> = {
  '근거 없음': '이 선택지는 문제의 조건이나 공식에서 바로 나오지 않습니다. 먼저 어떤 성질을 써야 하는지 확인해 보세요.',
  '곱': '곱하는 관계로 본 오답입니다. 이 문제에서 필요한 값이 두 배인지, 절반인지, 같은 값인지 먼저 확인해 보세요.',
  '나누기': '나누는 방향으로 관계를 반대로 적용한 오답입니다. 구하는 값이 기준값의 몇 배인지 다시 정리해 보세요.',
  '나누기 안 함': '마지막에 나누는 단계가 빠진 오답입니다. 비율 관계를 끝까지 적용한 뒤 답을 고르세요.',
  '거꾸로': '관계식을 반대로 적용한 오답입니다. 문제에서 구하는 값이 어느 쪽인지 먼저 표시해 보세요.',
  '평각': '평각 180° 성질을 그대로 가져온 오답입니다. 이 문제에서 필요한 각의 위치가 맞는지 확인해 보세요.',
  '항상 직각': '결정할 수 없는 상황이 아니라, 주어진 성질로 항상 직각임을 알 수 있습니다.',
  '같음': '같다고 볼 수 없는 대상을 같은 값으로 처리한 오답입니다. 대응되는 대상인지 먼저 확인해 보세요.',
  '다름': '서로 다르다고 보았지만, 같은 조건을 공유하는 대상입니다. 어떤 값이 공통인지 다시 표시해 보세요.',
  '가능': '판별 불가가 아니라, 주어진 조건만으로 결론을 낼 수 있습니다.',
  '식 의미 다름': '값이 우연히 비슷해 보여도 문제에서 요구한 관계식과 의미가 다릅니다. 식이 무엇을 나타내는지 확인해 보세요.',
  '맞지만 표현 우회': '숫자는 우연히 맞아 보일 수 있지만, 문제에서 요구한 풀이 관계를 설명하지 못합니다.',
  '판정 가능': '판별 불가가 아닙니다. 주어진 성분들이 일정한 배수인지 확인하면 관계를 판단할 수 있습니다.',
  '평면': '구의 방정식을 평면의 방정식처럼 본 오답입니다. 제곱항 세 개의 합이 반지름의 제곱이 되는지 확인해 보세요.',
  '한 성분 누락': '거리 계산에서 한 성분의 제곱을 빠뜨린 오답입니다. x, y, z 성분을 모두 포함했는지 확인해 보세요.',
  '$\\sqrt{}$ 누락': '거리의 제곱까지만 계산하고 제곱근을 취하지 않은 오답입니다. 길이는 마지막에 루트를 씌워야 합니다.',
  '$r$ 제곱 누락': '반지름을 그대로 넣고 제곱을 빠뜨린 오답입니다. 원이나 구의 방정식은 반지름의 제곱을 사용합니다.',
  '내적 $\\neq 0$': '내적이 0이 아닌데 수직으로 판단한 오답입니다. 수직 조건은 내적이 정확히 0일 때입니다.',
};

function fallbackReason(errorCode: string | null): string {
  switch (errorCode) {
    case 'SIGN_ERROR':
      return '부호가 바뀌는 지점을 한 줄 더 확인해 보세요.';
    case 'ARITHMETIC_ERROR':
      return '연산 순서와 마지막 계산을 차례대로 다시 확인해 보세요.';
    case 'ALGEBRA_ERROR':
      return '식 변형 과정에서 항, 계수, 괄호가 바뀌었는지 확인해 보세요.';
    case 'CONDITION_MISSING':
      return '문제 조건을 모두 표시한 뒤 식에 대입해야 합니다.';
    case 'FORMULA_SELECTION_ERROR':
      return '이 문제에 맞는 공식인지 먼저 확인한 뒤 값을 넣어 보세요.';
    case 'DENOMINATOR_ERROR':
      return '분모와 분자를 따로 보지 말고, 전체 분수의 기준을 다시 맞춰 보세요.';
    case 'GRAPH_READING_ERROR':
    case 'COORDINATE_ERROR':
      return '좌표, 기울기, 축의 의미를 먼저 표시한 뒤 읽어야 합니다.';
    case 'GEOMETRY_PROPERTY_ERROR':
    case 'CORRESPONDING_PART_ERROR':
    case 'AREA_RATIO_ERROR':
    case 'VOLUME_RATIO_ERROR':
      return '도형 성질을 적용할 대상이 맞는지, 대응 관계가 맞는지 확인해 보세요.';
    case 'RATIO_SCALE_ERROR':
      return '비율을 길이, 넓이, 부피 중 어느 기준에 적용해야 하는지 다시 구분해 보세요.';
    case 'PROBABILITY_COUNTING_ERROR':
      return '전체 경우와 원하는 경우를 같은 기준으로 세고 있는지 확인해 보세요.';
    case 'STATISTICS_INTERPRETATION_ERROR':
      return '평균, 중앙값, 최빈값처럼 서로 다른 통계량을 구분해 보세요.';
    case 'EXPONENT_ERROR':
      return '거듭제곱의 밑과 지수가 어디까지인지 괄호로 확인해 보세요.';
    default:
      return '선택한 식이 문제 조건에서 어떻게 나오는지 한 줄씩 확인해 보세요.';
  }
}

function trimFinalPeriod(text: string): string {
  return text.trim().replace(/[.。]\s*$/, '');
}

function errorLabel(errorCode: string | null): string {
  switch (errorCode) {
    case 'SIGN_ERROR':
      return '부호 처리 오류';
    case 'ARITHMETIC_ERROR':
      return '계산 절차 오류';
    case 'ALGEBRA_ERROR':
      return '식 변형 오류';
    case 'CONDITION_MISSING':
      return '조건 누락';
    case 'FORMULA_SELECTION_ERROR':
      return '공식 선택 오류';
    case 'DENOMINATOR_ERROR':
      return '분모 처리 오류';
    case 'GRAPH_READING_ERROR':
    case 'COORDINATE_ERROR':
      return '좌표 해석 오류';
    case 'GEOMETRY_PROPERTY_ERROR':
    case 'CORRESPONDING_PART_ERROR':
    case 'AREA_RATIO_ERROR':
    case 'VOLUME_RATIO_ERROR':
      return '도형 성질 적용 오류';
    case 'RATIO_SCALE_ERROR':
      return '비율 적용 오류';
    case 'PROBABILITY_COUNTING_ERROR':
      return '경우의 수 세기 오류';
    case 'STATISTICS_INTERPRETATION_ERROR':
      return '통계량 해석 오류';
    case 'EXPONENT_ERROR':
      return '지수 법칙 오류';
    default:
      return '근거 확인 오류';
  }
}

function contrastFor(errorCode: string | null): string {
  switch (errorCode) {
    case 'SIGN_ERROR':
      return '부호가 바뀌는 줄을 먼저 표시하고 괄호 안팎의 음수를 따로 확인하는 것입니다';
    case 'ARITHMETIC_ERROR':
      return '식은 맞는지 확인한 뒤 연산 순서대로 한 줄씩 계산을 검산하는 것입니다';
    case 'ALGEBRA_ERROR':
      return '대입, 전개, 이항 중 지금 쓰는 조작을 먼저 정하고 같은 조작을 양쪽에 적용하는 것입니다';
    case 'CONDITION_MISSING':
      return '문제에 주어진 조건을 모두 표시한 뒤 그 조건이 식에 반영됐는지 확인하는 것입니다';
    case 'FORMULA_SELECTION_ERROR':
      return '공식을 외워 넣기 전에 이 문제가 요구하는 관계와 공식의 조건이 일치하는지 맞추는 것입니다';
    case 'DENOMINATOR_ERROR':
      return '분자와 분모를 따로 처리하지 않고 전체 분수의 기준을 맞춘 뒤 계산하는 것입니다';
    case 'GRAPH_READING_ERROR':
    case 'COORDINATE_ERROR':
      return '좌표축, 위치, 기울기 기준을 먼저 표시하고 그 기준에 맞춰 값을 읽는 것입니다';
    case 'GEOMETRY_PROPERTY_ERROR':
    case 'CORRESPONDING_PART_ERROR':
    case 'AREA_RATIO_ERROR':
    case 'VOLUME_RATIO_ERROR':
      return '대응되는 대상과 적용할 도형 성질을 먼저 짝지은 뒤 길이, 넓이, 부피 기준을 구분하는 것입니다';
    case 'RATIO_SCALE_ERROR':
      return '비율이 길이, 넓이, 부피 중 어느 양에 적용되는지 먼저 정한 뒤 배율을 적용하는 것입니다';
    case 'PROBABILITY_COUNTING_ERROR':
      return '전체 경우와 원하는 경우를 같은 기준으로 세고 중복 또는 누락을 확인하는 것입니다';
    case 'STATISTICS_INTERPRETATION_ERROR':
      return '평균, 중앙값, 최빈값처럼 서로 다른 통계량의 정의를 먼저 구분하는 것입니다';
    case 'EXPONENT_ERROR':
      return '거듭제곱의 밑과 지수가 어디까지인지 괄호로 묶어 확인하는 것입니다';
    default:
      return '선택지가 문제 조건에서 실제로 따라오는지 식과 조건을 연결해 확인하는 것입니다';
  }
}

function nextCheckFor(errorCode: string | null): string {
  switch (errorCode) {
    case 'SIGN_ERROR':
      return '답을 고르기 전 음수, 괄호, 부등호 방향이 바뀐 줄을 한 번 더 표시하세요';
    case 'ARITHMETIC_ERROR':
      return '마지막 계산만 보지 말고 이전 줄의 식과 같은 값인지 대입해서 검산하세요';
    case 'ALGEBRA_ERROR':
      return '전개하거나 이항한 줄마다 사라진 항, 바뀐 계수, 빠진 괄호가 없는지 점검하세요';
    case 'CONDITION_MISSING':
      return '문제에서 밑줄 친 조건이 풀이식에 모두 들어갔는지 체크 표시를 하세요';
    case 'FORMULA_SELECTION_ERROR':
      return '공식 이름보다 먼저 공식이 쓰이는 조건과 이 문제의 조건을 나란히 비교하세요';
    case 'DENOMINATOR_ERROR':
      return '통분 기준과 약분 대상을 표시한 뒤 전체 분수가 같은 값을 유지하는지 확인하세요';
    case 'GRAPH_READING_ERROR':
    case 'COORDINATE_ERROR':
      return '좌표를 읽기 전 x축, y축, 행과 열의 순서를 손으로 먼저 적으세요';
    default:
      return '선택한 보기의 근거가 문제 조건의 어느 줄에서 나오는지 한 문장으로 적어 보세요';
  }
}

export function polishKoreanRationale(
  errorCode: string | null,
  rawReason: string | null,
  optionText: string,
): string | null {
  if (!errorCode) return null;
  const raw = rawReason?.trim() ?? '';
  const label = raw || errorLabel(errorCode);
  const seedReason = raw && REASON_POLISH[raw]
    ? REASON_POLISH[raw]
    : fallbackReason(errorCode);
  const optionHint = optionText ? `선택지 "${optionText}"는 ` : '이 선택지는 ';
  const failure = `${optionHint}${trimFinalPeriod(seedReason)} 상태라 문제의 조건이나 계산 흐름과 맞지 않습니다`;
  return [
    `오답 이름: ${label}`,
    `왜 실패하나: ${failure}`,
    `대신 올바른 접근은 ${contrastFor(errorCode)}`,
    `다음에는 ${nextCheckFor(errorCode)}`,
  ].join('. ') + '.';
}

function polishKoreanSolution(solution: string, concept: string): string {
  const body = solution.trim();
  if (!body) {
    return `핵심은 ${concept}입니다. 먼저 문제 조건을 식으로 정리하고, 마지막 계산까지 차례대로 확인하세요.`;
  }
  if (body.startsWith('핵심:')) return body;
  return `핵심: ${concept}\n풀이: ${body}`;
}

function koreanHint(concept: string): string {
  return `먼저 ${concept} 관계를 떠올리고, 주어진 값을 식에 넣은 뒤 마지막 계산 방향을 확인해 보세요.`;
}

async function main() {
  const prisma = new PrismaClient();
  const codes = specificCode ? [specificCode] : Object.keys(KOREAN_STUDY_PROBLEMS);
  console.log(`Seeding KR Study (single-step) for ${codes.length} chapter(s)...\n`);

  let created = 0;
  for (const code of codes) {
    const chapter = KOREAN_STUDY_PROBLEMS[code];
    if (!chapter) { console.log(`[skip] ${code} — no STUDY entry`); continue; }
    const lesson = await prisma.koreanConceptLesson.findUnique({ where: { chapterCode: code } });
    if (!lesson) { console.log(`[skip] ${code} — no KoreanConceptLesson`); continue; }
    const fallbackUnit = await prisma.unit.findFirst({ orderBy: { order: 'asc' }, select: { id: true } });
    if (!fallbackUnit) { console.log(`[skip] ${code} — no Unit fallback`); continue; }

    // Idempotent: wipe ONLY single-step KR Study problems for this lesson.
    // Mastery 3-step rows (steps.length=3) 는 보존 — 같은 koreanConceptLessonId
    // 사용하지만 별도 풀로 식별.
    const existingSingles = await prisma.problem.findMany({
      where: {
        koreanConceptLessonId: lesson.id,
        steps: { every: { stepType: 'ANSWER' } }, // single-step only
      },
      include: { steps: true },
    });
    const singleIds = existingSingles
      .filter((p) => p.steps.length === 1)
      .map((p) => p.id);
    if (singleIds.length > 0) {
      await prisma.attempt.deleteMany({ where: { problemId: { in: singleIds } } });
      await prisma.wrongNote.deleteMany({ where: { problemId: { in: singleIds } } });
      await prisma.recommendationLog.deleteMany({ where: { recommendedProblemId: { in: singleIds } } });
      await prisma.problem.deleteMany({ where: { id: { in: singleIds } } });
    }

    const ids: string[] = [];
    for (const p of chapter.problems) {
      const answerText = p.options.find((o) => o.isCorrect)?.text ?? '';
      const createdProblem = await prisma.problem.create({
        data: {
          source: 'Matheo KR (2022 개정) · Study · 자체 제작',
          unitId: fallbackUnit.id,
          koreanConceptLessonId: lesson.id,
          difficulty: DIFFICULTY_MAP[p.difficulty],
          body: p.stem,
          concept: p.concept,
          answer: answerText,
          hint: koreanHint(p.concept),
          requiredSkills: p.requiredSkills,
          difficultyLevel: DIFFICULTY_LEVEL[p.difficulty],
          expectedSolutionSteps: { explanation: polishKoreanSolution(p.solution, p.concept) } as any,
          steps: {
            create: [{
              stepIndex: 1,
              stepType: StepType.ANSWER as any,
              prompt: p.stem,
              choices: {
                create: p.options.map((o, i) => ({
                  choiceIndex: i + 1,
                  text: o.text,
                  isCorrect: o.isCorrect,
                  distractorErrorCode: o.errorCode,
                  rationale: polishKoreanRationale(o.errorCode, o.errorReason, o.text),
                })),
              },
            }],
          },
        },
        select: { id: true },
      });
      ids.push(createdProblem.id);
      created += 1;
    }
    await prisma.lessonProblemSet.upsert({
      where: {
        country_chapterCode_setType_version: {
          country: 'KR',
          chapterCode: code,
          setType: 'STUDY_1STEP',
          version: 1,
        },
      },
      update: {
        koreanConceptLessonId: lesson.id,
        conceptLessonId: null,
        problemIds: ids.slice(0, 20),
        status: ids.length >= 20 ? 'READY' : 'NEEDS_REVIEW',
        curatedAt: ids.length > 0 ? new Date() : null,
        retiredAt: null,
      },
      create: {
        country: 'KR',
        chapterCode: code,
        setType: 'STUDY_1STEP',
        version: 1,
        koreanConceptLessonId: lesson.id,
        problemIds: ids.slice(0, 20),
        status: ids.length >= 20 ? 'READY' : 'NEEDS_REVIEW',
        curatedAt: ids.length > 0 ? new Date() : null,
      },
    });
    console.log(`[ok]   ${code}  ${chapter.problems.length} STUDY problems seeded`);
  }
  console.log(`\nDone. STUDY problems=${created}`);
  await prisma.$disconnect();
}
if (require.main === module) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
