import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { GradeLevel, ProblemStep } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AttemptsService } from '../attempts/attempts.service';

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
  constructor(
    private readonly prisma: PrismaService,
    private readonly attempts: AttemptsService,
  ) {}

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

    // Route through attempts.service so attempt.completed fires — that event
    // feeds activity (DailyActivity / streak), mastery (snapshot + trajectory),
    // and llm-analysis (error-pattern profiling). The earlier direct
    // prisma.attempt.create bypassed every listener, so a user who only ever
    // sat the diagnostic showed up as "0 minutes studied today" on Home and
    // never accumulated mastery history.
    const attempt = await this.attempts.create(userId, {
      problemId: body.problemId,
      choiceId: body.choiceId,
      stepIndex: 1,
      durationSec: 0,
      confidence: body.confidence,
      context: 'DIAGNOSTIC',
      studySessionId: body.sessionId,
    });

    return { attemptId: attempt.id, isCorrect: attempt.isCorrect };
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

    // Idempotency: a replayed finish (network retry, tab refresh, double-tap)
    // must not re-stamp endedAt or re-bump counters. Just recompute the
    // summary from the same attempts and return it. The mastery-trajectory
    // listener already ran once per Attempt at submit-time, so concept
    // scores are stable too.
    if (!session.endedAt) {
      await this.prisma.studySession.update({
        where: { id: sessionId },
        data: {
          endedAt: new Date(),
          correctCount: session.attempts.filter((a) => a.isCorrect).length,
        },
      });
    }

    // Mastery trajectories are now maintained by mastery-trajectory.listener
    // (attempt.completed → updateAfterAttempt per concept). We just read the
    // current state for the concepts this session touched and ship them back
    // to the client as the diagnostic summary. Earlier code did its own
    // weighted-average upsert here, which double-counted evidence (listener
    // already incremented it) and clobbered the listener's gradient updates
    // with a flat session score.
    const conceptIds = Array.from(new Set(
      session.attempts.flatMap((a) => a.problem.concepts.map((pc) => pc.conceptId)),
    ));
    const trajectories = conceptIds.length > 0
      ? await this.prisma.masteryTrajectory.findMany({
          where: { userId, conceptId: { in: conceptIds } },
          include: { concept: { select: { name: true, code: true } } },
        })
      : [];

    return {
      sessionId,
      attempted: session.attempts.length,
      correct: session.attempts.filter((a) => a.isCorrect).length,
      masteries: trajectories.map((t) => ({
        conceptId: t.conceptId,
        conceptName: t.concept.name,
        conceptCode: t.concept.code,
        score: t.masteryScore,
      })),
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
