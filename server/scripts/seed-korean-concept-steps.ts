/**
 * seed-korean-concept-steps.ts — Phase 2 콘텐츠 적재.
 *
 * `concept-content-ko/` 의 KOREAN_CHAPTER_CONTENT 를 읽어 43 챕터의
 * KoreanConceptStep rows 를 생성. LLM 미사용 — 직접 author 한 콘텐츠.
 *
 * Idempotent: 매 실행마다 해당 챕터의 기존 step 을 모두 지우고 새로 삽입.
 *
 * Usage:
 *   npx ts-node scripts/seed-korean-concept-steps.ts            # 모든 챕터
 *   npx ts-node scripts/seed-korean-concept-steps.ts --code K-G10-CS1-CH01-POLYNOMIAL
 */

import { PrismaClient, ConceptStepKind } from '@prisma/client';
import {
  KOREAN_CHAPTER_CONTENT,
  KoreanConceptChapterContent,
} from '../src/common/curriculum/concept-content-ko';

const args = process.argv.slice(2);
const codeIdx = args.indexOf('--code');
const specificCode = codeIdx >= 0 ? args[codeIdx + 1] : null;

/** Convert one chapter's hand-authored content blob → ordered KoreanConceptStep
 *  insert payloads. Optional fields (concrete / pictorial / misconception /
 *  reflect) are skipped when absent so we don't seed empty rows. */
function buildSteps(content: KoreanConceptChapterContent): Array<{
  stepIndex: number;
  kind: ConceptStepKind;
  titleKo: string;
  bodyKo: string;
  workedSteps?: any;
  retrievalCheck?: any;
  misconception?: any;
  reflectPrompts?: any;
}> {
  const out: any[] = [];
  let idx = 1;

  if (content.hook) {
    out.push({ stepIndex: idx++, kind: 'HOOK', titleKo: '도입', bodyKo: content.hook });
  }
  if (content.concrete) {
    out.push({ stepIndex: idx++, kind: 'CONCRETE', titleKo: '구체적 예시', bodyKo: content.concrete });
  }
  if (content.pictorial) {
    out.push({ stepIndex: idx++, kind: 'PICTORIAL', titleKo: '시각화', bodyKo: content.pictorial });
  }
  out.push({ stepIndex: idx++, kind: 'ABSTRACT', titleKo: '정의·공식', bodyKo: content.abstract });
  out.push({
    stepIndex: idx++,
    kind: 'WORKED_EXAMPLE',
    titleKo: '예제 풀이',
    bodyKo: content.worked.intro,
    workedSteps: content.worked.steps.map((s, i) => ({
      step: i + 1,
      math: s.math,
      narrationKo: s.narration,
      fade: s.fade === true,
    })),
  });
  if (content.misconception) {
    out.push({
      stepIndex: idx++,
      kind: 'MISCONCEPTION',
      titleKo: '흔한 실수',
      bodyKo: '아래 잘못된 추론이 왜 틀렸는지 확인하세요.',
      misconception: {
        wrongKo: content.misconception.wrong,
        whyKo: content.misconception.why,
        correctKo: content.misconception.correct,
      },
    });
  }
  out.push({
    stepIndex: idx++,
    kind: 'RETRIEVAL',
    titleKo: '자가 점검',
    bodyKo: content.retrieval.prompt,
    retrievalCheck: {
      prompt: content.retrieval.prompt,
      accept: content.retrieval.accept,
      ...(content.retrieval.explain ? { explainKo: content.retrieval.explain } : {}),
      ...(content.retrieval.distractors ? { distractors: content.retrieval.distractors } : {}),
    },
  });
  if (content.reflect) {
    out.push({
      stepIndex: idx++,
      kind: 'REFLECT',
      titleKo: '되돌아보기',
      bodyKo: '아래 질문에 답해보세요.',
      reflectPrompts: { prompts: content.reflect.prompts },
    });
  }

  return out;
}

async function main() {
  const prisma = new PrismaClient();
  const codes = specificCode ? [specificCode] : Object.keys(KOREAN_CHAPTER_CONTENT);
  console.log(`Seeding ${codes.length} chapters...\n`);

  let inserted = 0;
  let missingLesson = 0;
  let missingContent = 0;

  for (const code of codes) {
    const content = KOREAN_CHAPTER_CONTENT[code];
    if (!content) {
      missingContent += 1;
      console.log(`[skip] ${code} — no content in KOREAN_CHAPTER_CONTENT`);
      continue;
    }
    const lesson = await prisma.koreanConceptLesson.findUnique({ where: { chapterCode: code } });
    if (!lesson) {
      missingLesson += 1;
      console.log(`[skip] ${code} — no KoreanConceptLesson row (run seed-korean-curriculum.ts first)`);
      continue;
    }

    const steps = buildSteps(content);
    await prisma.koreanConceptStep.deleteMany({ where: { lessonId: lesson.id } });
    await prisma.koreanConceptStep.createMany({
      data: steps.map((s) => ({
        lessonId: lesson.id,
        stepIndex: s.stepIndex,
        kind: s.kind,
        titleKo: s.titleKo,
        bodyKo: s.bodyKo,
        workedSteps: s.workedSteps ?? undefined,
        retrievalCheck: s.retrievalCheck ?? undefined,
        misconception: s.misconception ?? undefined,
        reflectPrompts: s.reflectPrompts ?? undefined,
      })),
    });
    inserted += steps.length;
    console.log(`[ok]   ${code}  ${steps.length} steps`);
  }

  console.log(`\nDone. inserted=${inserted} steps  missingLesson=${missingLesson}  missingContent=${missingContent}`);

  // Coverage summary
  const allLessons = await prisma.koreanConceptLesson.findMany({
    include: { _count: { select: { steps: true } } },
    orderBy: [{ koreanGrade: 'asc' }, { koreanSubject: 'asc' }, { chapterNumber: 'asc' }],
  });
  const withSteps = allLessons.filter((l) => l._count.steps > 0).length;
  console.log(`Coverage: ${withSteps}/${allLessons.length} KoreanConceptLessons have steps.`);

  await prisma.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
