import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { GradeLevel, MasteryUpdateSource, ProblemStep } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

/**
 * 4문항 진단 — 온보딩 06번 화면.
 *
 * 데이터 흐름:
 *  1. start(userId)  → 사용자 grade 에 맞춰 4개 Problem 선별 (concept-lesson 매핑 우선),
 *                       각 Problem 의 CONCEPT step (5지선다) 만 반환. 새 StudySession(context=DIAGNOSTIC) 생성.
 *  2. answer(userId, sessionId, ...) → Attempt 생성 (mastery 이벤트 자동 emit).
 *  3. finish(userId, sessionId) → 세션 내 Attempt 집계 → 각 concept 의 초기 MasteryTrajectory upsert.
 *
 *  AI는 콘텐츠 생성 X — 실 시드 문제 선별 + 학생 답안 집계 → 데이터화만 함.
 */
@Injectable()
export class DiagnosticService {
  constructor(private readonly prisma: PrismaService) {}

  async start(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { gradeLevel: true },
    });
    if (!user) throw new NotFoundException('user not found');

    // 사용자 grade 에 매핑된 ConceptLesson 들 → 매핑된 Problem 들 풀에서 4개 추출 (서로 다른 concept 우선).
    const problems = await this.selectFour(user.gradeLevel ?? 'CLASS_11');
    if (problems.length === 0) {
      throw new BadRequestException('No diagnostic problems available for your grade yet. Please contact support.');
    }

    // 임시 unit 으로 첫 problem 의 unitId 사용 (StudySession.unitId 필수). DIAGNOSTIC context 가 분류 지표.
    const session = await this.prisma.studySession.create({
      data: {
        userId,
        unitId: problems[0].unitId,
        sessionNumber: 1,
        totalSessions: 1,
        context: 'DIAGNOSTIC',
        problemCount: problems.length,
      },
    });

    return {
      sessionId: session.id,
      problems: problems.map((p) => ({
        id: p.id,
        body: p.body,
        difficulty: p.difficulty,
        // CONCEPT step + 5지선다만 (PROCESS/ANSWER 는 진단에 불필요).
        step: p.steps[0]
          ? {
              id: p.steps[0].id,
              stepIndex: p.steps[0].stepIndex,
              prompt: p.steps[0].prompt,
              choices: p.steps[0].choices.map((c) => ({
                id: c.id,
                choiceIndex: c.choiceIndex,
                text: c.text,
              })),
            }
          : null,
        conceptLessonId: p.conceptLessonId,
      })),
    };
  }

  async submitAnswer(
    userId: string,
    body: { sessionId: string; problemId: string; choiceId: string; confidence?: number },
  ) {
    const session = await this.prisma.studySession.findUnique({ where: { id: body.sessionId } });
    if (!session || session.userId !== userId) throw new NotFoundException('Session not found');

    const choice = await this.prisma.problemChoice.findUnique({
      where: { id: body.choiceId },
      select: { id: true, isCorrect: true, text: true, stepId: true },
    });
    if (!choice) throw new BadRequestException('Invalid choiceId');

    const attempt = await this.prisma.attempt.create({
      data: {
        userId,
        problemId: body.problemId,
        choiceId: body.choiceId,
        context: 'DIAGNOSTIC',
        answer: choice.text,
        isCorrect: choice.isCorrect,
        durationSec: 0,
        stepIndex: 1,
        studySessionId: body.sessionId,
        selfConfidenceScore: typeof body.confidence === 'number' ? body.confidence : null,
      },
    });

    return { attemptId: attempt.id, isCorrect: choice.isCorrect };
  }

  async finish(userId: string, sessionId: string) {
    const session = await this.prisma.studySession.findUnique({
      where: { id: sessionId },
      include: {
        attempts: {
          include: {
            problem: { include: { concepts: { include: { concept: true } } } },
          },
        },
      },
    });
    if (!session || session.userId !== userId) throw new NotFoundException('Session not found');

    // 세션 종료 표시.
    await this.prisma.studySession.update({
      where: { id: sessionId },
      data: {
        endedAt: new Date(),
        correctCount: session.attempts.filter((a) => a.isCorrect).length,
      },
    });

    // concept 별 정답률 집계 → 초기 MasteryTrajectory upsert.
    // 한 attempt 가 여러 concept 에 weight 로 기여 — 가중 평균.
    type Acc = { score: number; weight: number };
    const byConcept = new Map<string, Acc>();
    for (const a of session.attempts) {
      for (const pc of a.problem.concepts) {
        const id = pc.conceptId;
        const cur = byConcept.get(id) ?? { score: 0, weight: 0 };
        cur.score += (a.isCorrect ? 100 : 0) * pc.weight;
        cur.weight += pc.weight;
        byConcept.set(id, cur);
      }
    }

    const masteries = [];
    for (const [conceptId, acc] of byConcept) {
      const masteryScore = acc.weight > 0 ? Math.round(acc.score / acc.weight) : 0;
      const updated = await this.prisma.masteryTrajectory.upsert({
        where: { userId_conceptId: { userId, conceptId } },
        update: {
          masteryScore,
          evidenceCount: { increment: 1 },
          updatedBy: MasteryUpdateSource.RULE_BASED,
          lastAttemptAt: new Date(),
        },
        create: {
          userId,
          conceptId,
          masteryScore,
          evidenceCount: 1,
          recentAccuracy: masteryScore / 100,
          updatedBy: MasteryUpdateSource.RULE_BASED,
          lastAttemptAt: new Date(),
        },
        include: { concept: { select: { name: true, code: true } } },
      });
      masteries.push({
        conceptId,
        conceptName: updated.concept.name,
        conceptCode: updated.concept.code,
        score: updated.masteryScore,
      });
    }

    return {
      sessionId,
      attempted: session.attempts.length,
      correct: session.attempts.filter((a) => a.isCorrect).length,
      masteries,
    };
  }

  /** 사용자 학년에 맞는 진단 문제 4개 — concept-lesson 매핑 된 문제 풀에서 서로 다른 conceptLesson 우선. */
  private async selectFour(grade: GradeLevel) {
    type Sel = {
      id: string; body: string; difficulty: string;
      unitId: string; conceptLessonId: string | null;
      steps: Array<ProblemStep & { choices: Array<{ id: string; choiceIndex: number; text: string }> }>;
    };

    // 1차: grade 와 매핑되는 conceptLesson 의 매핑 문제 풀.
    const lessons = await this.prisma.conceptLesson.findMany({
      where: { unit: { gradeLevels: { has: grade } } },
      select: { id: true },
    });
    const lessonIds = lessons.map((l) => l.id);

    const pool: Sel[] = await this.prisma.problem.findMany({
      where: {
        conceptLessonId: { in: lessonIds.length ? lessonIds : ['__none__'] },
        steps: { some: { stepIndex: 1 } },
      },
      orderBy: { source: 'asc' },
      select: {
        id: true, body: true, difficulty: true, unitId: true, conceptLessonId: true,
        steps: {
          where: { stepIndex: 1 },
          take: 1,
          include: { choices: { orderBy: { choiceIndex: 'asc' }, select: { id: true, choiceIndex: true, text: true } } },
        },
      },
    }) as any;

    // fallback: 학년 매핑 풀이 0개면 전체에서.
    const fallback: Sel[] = pool.length
      ? pool
      : ((await this.prisma.problem.findMany({
          where: { conceptLessonId: { not: null }, steps: { some: { stepIndex: 1 } } },
          orderBy: { source: 'asc' },
          select: {
            id: true, body: true, difficulty: true, unitId: true, conceptLessonId: true,
            steps: {
              where: { stepIndex: 1 },
              take: 1,
              include: { choices: { orderBy: { choiceIndex: 'asc' }, select: { id: true, choiceIndex: true, text: true } } },
            },
          },
        })) as any);

    // 서로 다른 conceptLesson 우선 선택, 부족하면 중복 허용.
    const seen = new Set<string>();
    const picks: Sel[] = [];
    for (const p of fallback) {
      if (picks.length === 4) break;
      if (!p.conceptLessonId || seen.has(p.conceptLessonId)) continue;
      picks.push(p);
      seen.add(p.conceptLessonId);
    }
    for (const p of fallback) {
      if (picks.length === 4) break;
      if (!picks.find((x) => x.id === p.id)) picks.push(p);
    }
    return picks;
  }
}
