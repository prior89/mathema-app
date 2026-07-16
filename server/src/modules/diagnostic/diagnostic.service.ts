import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { GradeLevel, KoreanGrade, ProblemStep } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AttemptsService } from '../attempts/attempts.service';
import { FirstSessionPlanService } from '../recommendations/first-session-plan.service';

// India NCERT GradeLevel → closest Korean grade. Same mapping used by
// frontend HomeScreen / LearnScreen / OnboardingPage so KR students
// onboarded through the India class picker land on a sensible Korean
// grade (e.g. CLASS_11 → HIGH_2 = 고2).
const NCERT_TO_KR_GRADE: Record<string, KoreanGrade> = {
  CLASS_7: 'MIDDLE_1', CLASS_8: 'MIDDLE_2', CLASS_9: 'MIDDLE_3',
  CLASS_10: 'HIGH_1', CLASS_11: 'HIGH_2', CLASS_12: 'HIGH_3',
};

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
    private readonly firstSessionPlan: FirstSessionPlanService,
  ) {}

  async start(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { gradeLevel: true, country: true },
    });
    if (!user) throw new NotFoundException('user not found');

    // Country-aware diagnostic pool selection.
    //   - country='KR'  → 한국 커리큘럼 (KoreanConceptLesson 매핑 problem)
    //   - 그 외 / null  → NCERT (legacy selectFour, ConceptLesson 매핑 problem)
    // 응답 형태는 두 경우 모두 동일 — 프론트 ScreenDiagnostic이 한 줄도 안 바뀜.
    const problems = user.country === 'KR'
      ? await this.selectFourKorean(user.gradeLevel ?? 'CLASS_11')
      : await this.selectFour(user.gradeLevel ?? 'CLASS_11');
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
            problem: {
              include: {
                concepts: { include: { concept: true } },
                conceptLesson: { select: { chapterCode: true } },
                koreanConceptLesson: { select: { chapterCode: true } },
              },
            },
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
    const wasAlreadyFinished = !!session.endedAt;
    if (!wasAlreadyFinished) {
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
    const diagnosticScores = new Map<string, {
      correct: number;
      total: number;
      conceptName: string;
      conceptNameKo: string | null;
      conceptCode: string;
    }>();
    for (const attempt of session.attempts) {
      for (const pc of attempt.problem.concepts) {
        const current = diagnosticScores.get(pc.conceptId) ?? {
          correct: 0,
          total: 0,
          conceptName: pc.concept.name,
          conceptNameKo: pc.concept.nameKo,
          conceptCode: pc.concept.code,
        };
        current.total += 1;
        if (attempt.isCorrect) current.correct += 1;
        diagnosticScores.set(pc.conceptId, current);
      }
    }
    // attempt.completed listeners are intentionally asynchronous. Diagnostic
    // results must therefore be derived exclusively from the committed
    // attempts in this session. Mixing an already-updated trajectory for one
    // concept with a still-pending trajectory for another made the same
    // answers produce different first-render scores depending on timing.
    const masteries = [...diagnosticScores.entries()].map(([conceptId, score]) => {
      return {
        conceptId,
        conceptName: score.conceptName,
        conceptNameKo: score.conceptNameKo,
        conceptCode: score.conceptCode,
        score: Math.round((score.correct / Math.max(1, score.total)) * 100),
      };
    });

    const weakConceptIds = masteries
      .filter((m) => m.score < 50)
      .map((m) => m.conceptId);
    const recommendedChapterCodes = [
      ...new Set(
        session.attempts
          .filter((a) => a.problem.concepts.some((pc) => weakConceptIds.includes(pc.conceptId)))
          .map((a) => a.problem.conceptLesson?.chapterCode ?? a.problem.koreanConceptLesson?.chapterCode)
          .filter((c): c is string => !!c),
      ),
    ].slice(0, 5);

    const firstSessionPlan = wasAlreadyFinished
      ? await this.firstSessionPlan.getActiveCards(userId)
      : await this.firstSessionPlan.seedFirstSession(userId, {
          recommendedChapterCodes,
          weakConceptIds,
        });

    return {
      sessionId,
      attempted: session.attempts.length,
      correct: session.attempts.filter((a) => a.isCorrect).length,
      masteries,
      firstSessionPlan,
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
    const lpsPool = await this.selectFourFromDiagnosticSets('IN', grade);
    if (lpsPool.length >= 4) return lpsPool as Sel[];

    const pool: Sel[] = await this.prisma.problem.findMany({
      where: {
        conceptLesson: { ncertClass: grade },
        steps: { some: { stepIndex: 1 } },
        // Sprint 4: diagnostic must not surface EXCLUDED or chapter-mismatched.
        conceptMismatch: { not: true },
        OR: [
          { qualityStatus: null },
          { qualityStatus: { in: ['APPROVED', 'USABLE'] } },
        ],
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
    const candidates: Sel[] = pool;

    // 서로 다른 conceptLesson 우선 선택, 부족하면 중복 허용.
    const seen = new Set<string>();
    const picks: Sel[] = [];
    for (const p of candidates) {
      if (picks.length === 4) break;
      if (!p.conceptLessonId || seen.has(p.conceptLessonId)) continue;
      picks.push(p);
      seen.add(p.conceptLessonId);
    }
    for (const p of candidates) {
      if (picks.length === 4) break;
      if (!picks.find((x) => x.id === p.id)) picks.push(p);
    }
    return picks;
  }

  /**
   * KR 진단 풀 — country='KR' 사용자 전용. selectFour(NCERT)와 응답 shape 동일
   * (id/body/difficulty/unitId/conceptLessonId/steps). 다른 점:
   *   - NCERT ConceptLesson 대신 KoreanConceptLesson 매핑 problem만 추출
   *   - 학년 매핑은 NCERT_TO_KR_GRADE (CLASS_N → MIDDLE_x/HIGH_x)
   *   - 매핑된 학년 풀 부족 시 KR 전체 풀에서 fallback
   *   - conceptLessonId 필드는 항상 null (KR쪽은 koreanConceptLessonId지만
   *     응답 shape 호환을 위해 null로 채움 — frontend는 conceptLessonId 사용 안 함)
   * 현재 시드 상태: 2 챕터만 (INTEGERS, EXP-LOG). 학년 매핑에 따라 0개일 수
   * 있고 그땐 start()가 BadRequestException 그대로. 프론트는 동일 에러 핸들링.
   */
  private async selectFourKorean(grade: GradeLevel) {
    type Sel = {
      id: string; body: string; difficulty: string;
      unitId: string; conceptLessonId: string | null;
      steps: Array<ProblemStep & { choices: Array<{ id: string; choiceIndex: number; text: string }> }>;
    };
    const krGrade = NCERT_TO_KR_GRADE[grade] ?? 'HIGH_2';
    const lpsPool = await this.selectFourFromDiagnosticSets('KR', grade);
    if (lpsPool.length >= 4) return lpsPool as Sel[];

    // 1차: krGrade 매핑된 KoreanConceptLesson 의 매핑 problem
    const pool: Sel[] = await this.prisma.problem.findMany({
      where: {
        koreanConceptLesson: { koreanGrade: krGrade },
        steps: { some: { stepIndex: 1 } },
        conceptMismatch: { not: true },
        OR: [
          { qualityStatus: null },
          { qualityStatus: { in: ['APPROVED', 'USABLE'] } },
        ],
      },
      orderBy: { source: 'asc' },
      select: {
        id: true, body: true, difficulty: true, unitId: true, conceptLessonId: true,
        koreanConceptLessonId: true,
        steps: {
          where: { stepIndex: 1 },
          take: 1,
          include: { choices: { orderBy: { choiceIndex: 'asc' }, select: { id: true, choiceIndex: true, text: true } } },
        },
      },
    }) as any;

    // fallback: 학년 풀이 0개면 KR 전체 풀 (다른 학년이라도 진단 가능하게)
    const candidates: Sel[] = pool;

    // 서로 다른 koreanConceptLesson 우선, 부족하면 중복 허용. NCERT 측과 동일.
    const seen = new Set<string>();
    const picks: Sel[] = [];
    for (const p of candidates as Array<Sel & { koreanConceptLessonId: string | null }>) {
      if (picks.length === 4) break;
      if (!p.koreanConceptLessonId || seen.has(p.koreanConceptLessonId)) continue;
      picks.push(p);
      seen.add(p.koreanConceptLessonId);
    }
    for (const p of candidates) {
      if (picks.length === 4) break;
      if (!picks.find((x) => x.id === p.id)) picks.push(p);
    }
    return picks;
  }

  private async selectFourFromDiagnosticSets(country: 'IN' | 'KR', grade: GradeLevel) {
    const krGrade = NCERT_TO_KR_GRADE[grade] ?? 'HIGH_2';
    const sets = await this.prisma.lessonProblemSet.findMany({
      where: {
        country,
        setType: 'DIAGNOSTIC',
        status: 'READY',
        retiredAt: null,
        ...(country === 'IN'
          ? { conceptLesson: { ncertClass: grade } }
          : { koreanConceptLesson: { koreanGrade: krGrade } }),
      },
      orderBy: { chapterCode: 'asc' },
      select: { problemIds: true },
    });
    const ids = sets.flatMap((s) => s.problemIds.slice(0, 2)).slice(0, 24);
    if (ids.length < 4) return [];

    const rows = await this.prisma.problem.findMany({
      where: {
        id: { in: ids },
        conceptMismatch: { not: true },
        OR: [
          { qualityStatus: null },
          { qualityStatus: { in: ['APPROVED', 'USABLE'] } },
        ],
      },
      select: {
        id: true, body: true, difficulty: true, unitId: true, conceptLessonId: true,
        steps: {
          where: { stepIndex: 1 },
          take: 1,
          include: { choices: { orderBy: { choiceIndex: 'asc' }, select: { id: true, choiceIndex: true, text: true } } },
        },
      },
    });
    const byId = new Map(rows.map((p) => [p.id, p]));
    const ordered = ids.map((id) => byId.get(id)).filter(Boolean);

    const picks: typeof ordered = [];
    for (const p of ordered) {
      if (!p || picks.length === 4) break;
      if (!p.steps[0] || p.steps[0].choices.length !== 5) continue;
      picks.push(p);
    }
    return picks.slice(0, 4);
  }
}
