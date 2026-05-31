/**
 * Sprint 1 smoke verification — given the most recent KR attempt:
 *   1. Did distractorErrorCode get written to the Attempt row?
 *   2. Did ErrorPatternProfile get updated for the KR concept?
 *   3. Did KoreanConceptProgress / chapterProgress reflect the attempt?
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Find the most-recent attempt on a KR-mapped problem.
  const recent = await prisma.attempt.findFirst({
    where: { problem: { koreanConceptLessonId: { not: null } } },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      userId: true,
      problemId: true,
      isCorrect: true,
      choiceId: true,
      stepIndex: true,
      distractorErrorCode: true,
      errorCodes: true,
      createdAt: true,
      problem: {
        select: {
          koreanConceptLessonId: true,
          koreanConceptLesson: { select: { chapterCode: true, id: true } },
          concepts: { select: { conceptId: true, concept: { select: { code: true, name: true } } } },
        },
      },
      choice: { select: { isCorrect: true, distractorErrorCode: true, text: true } },
    },
  });

  if (!recent) {
    console.log('No KR attempts in DB yet.');
    return;
  }

  console.log('=== Most recent KR attempt ===');
  console.log(`attemptId    : ${recent.id}`);
  console.log(`createdAt    : ${recent.createdAt.toISOString()}`);
  console.log(`userId       : ${recent.userId}`);
  console.log(`problemId    : ${recent.problemId}`);
  console.log(`chapter      : ${recent.problem.koreanConceptLesson?.chapterCode}`);
  console.log(`isCorrect    : ${recent.isCorrect}`);
  console.log(`choiceId     : ${recent.choiceId}`);
  console.log(`stepIndex    : ${recent.stepIndex}`);
  console.log(`errorCodes   : [${recent.errorCodes.join(',')}]`);
  console.log(`>>> Attempt.distractorErrorCode : ${recent.distractorErrorCode ?? 'NULL'}`);
  console.log(`>>> Choice.distractorErrorCode  : ${recent.choice?.distractorErrorCode ?? 'NULL (or correct)'}`);
  console.log(`problemConcepts: ${recent.problem.concepts.map((c) => c.concept.code).join(', ')}`);

  const userId = recent.userId;
  const conceptIds = recent.problem.concepts.map((c) => c.conceptId);

  // (2) ErrorPatternProfile for this user + these concepts
  console.log('\n=== ErrorPatternProfile (this user × this problem\'s concepts) ===');
  const eps = await prisma.errorPatternProfile.findMany({
    where: { userId, conceptId: { in: conceptIds } },
    orderBy: { updatedAt: 'desc' },
  });
  if (eps.length === 0) {
    console.log('!! NO ErrorPatternProfile rows for this user × concept. Listener did not write.');
  } else {
    for (const e of eps) {
      console.log(
        `  conceptId=${e.conceptId} errorCode=${e.errorCode} status=${e.status} ` +
          `severity=${e.severity} recentFreq=${e.recentFrequency} cumulative=${e.cumulativeCount} ` +
          `updatedAt=${e.updatedAt.toISOString()}`,
      );
    }
  }

  // (3) MasteryTrajectory for the same scope
  console.log('\n=== MasteryTrajectory (this user × this problem\'s concepts) ===');
  const mts = await prisma.masteryTrajectory.findMany({
    where: { userId, conceptId: { in: conceptIds } },
    orderBy: { updatedAt: 'desc' },
  });
  for (const m of mts) {
    console.log(
      `  conceptId=${m.conceptId} mastery=${m.masteryScore.toFixed(1)} ` +
        `evidence=${m.evidenceCount} recentAcc=${m.recentAccuracy.toFixed(2)} ` +
        `updatedAt=${m.updatedAt.toISOString()}`,
    );
  }

  // (4) KoreanConceptProgress for this lesson
  console.log('\n=== KoreanConceptProgress (this lesson) ===');
  if (recent.problem.koreanConceptLessonId) {
    const kcp = await prisma.koreanConceptProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId: recent.problem.koreanConceptLessonId } },
    });
    if (!kcp) {
      console.log('!! NO KoreanConceptProgress row for this user × lesson.');
    } else {
      console.log(
        `  lessonId=${kcp.lessonId} masteredAt=${kcp.masteredAt?.toISOString() ?? 'NULL (not yet mastered)'} ` +
          `startedAt=${kcp.startedAt.toISOString()}`,
      );
    }
  }

  // (5) How many KR problems in this chapter has this user attempted vs total?
  if (recent.problem.koreanConceptLessonId) {
    const totalChapter = await prisma.problem.count({
      where: { koreanConceptLessonId: recent.problem.koreanConceptLessonId },
    });
    const attempted = await prisma.attempt.findMany({
      where: { userId, problem: { koreanConceptLessonId: recent.problem.koreanConceptLessonId } },
      select: { problemId: true },
    });
    const uniqAttempted = new Set(attempted.map((a) => a.problemId)).size;
    console.log(`\n=== Chapter coverage (this user × this lesson) ===`);
    console.log(`  problems in chapter: ${totalChapter}`);
    console.log(`  unique problems attempted: ${uniqAttempted}`);
    console.log(`  progress%: ${((uniqAttempted / totalChapter) * 100).toFixed(1)}%`);
  }

  // (6) Sanity: how many KR attempts overall have distractorErrorCode written?
  const krAttemptTotal = await prisma.attempt.count({
    where: { problem: { koreanConceptLessonId: { not: null } } },
  });
  const krAttemptWithCode = await prisma.attempt.count({
    where: {
      problem: { koreanConceptLessonId: { not: null } },
      distractorErrorCode: { not: null },
    },
  });
  const krAttemptWrong = await prisma.attempt.count({
    where: {
      problem: { koreanConceptLessonId: { not: null } },
      isCorrect: false,
      choiceId: { not: null },
    },
  });
  console.log(`\n=== KR Attempt-wide distractorErrorCode coverage ===`);
  console.log(`  total KR attempts          : ${krAttemptTotal}`);
  console.log(`  KR wrong with choiceId      : ${krAttemptWrong}`);
  console.log(`  KR with distractorErrorCode : ${krAttemptWithCode}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
