import { Injectable } from '@nestjs/common';
import { StudySessionsRepository } from './study-sessions.repository';
import { AiGuideService } from './services/ai-guide.service';
import { AttemptsService } from '../attempts/attempts.service';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { StartSessionDto } from './dto/start-session.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { SessionContext } from '../../common/enums/session-context.enum';
import { Lang } from '../../common/i18n/current-lang.decorator';
import { CHOICE_EN, UNIT_NAME_EN } from '../../common/i18n/content-en';
import { UNIT_NAME_HI } from '../../common/i18n/content-hi';
import { AdaptiveNextProblemService } from '../recommendations/services/adaptive-next-problem.service';
import { AdaptiveStartDto } from './dto/adaptive-start.dto';

@Injectable()
export class StudySessionsService {
  constructor(
    private readonly repo: StudySessionsRepository,
    private readonly aiGuide: AiGuideService,
    private readonly attempts: AttemptsService,
    private readonly prisma: PrismaService,
    private readonly adaptive: AdaptiveNextProblemService,
  ) {}

  /**
   * 명세서 §4 Flow 1 — 세션 시작 시 Adaptive Engine 추천 문제 1개를 함께 반환.
   *   { session-row, nextProblem: { problemId, reason, ... } | null }
   */
  async start(userId: string, dto: StartSessionDto, _lang: Lang = 'en') {
    const session = await this.repo.create(userId, dto);
    let nextProblem: any = null;
    try {
      nextProblem = await this.adaptive.getNext(userId, { sessionId: session.id });
    } catch {
      // 추천 실패해도 세션 자체는 반환 (학생 흐름 차단 X).
    }
    return { ...session, nextProblem };
  }
  get(userId: string, id: string, _lang: Lang = 'en') { return this.repo.findOne(userId, id); }

  /** 특정 문제로 학습 세션 시작 — 그 문제의 단원으로 세션을 만들고 focusProblemId 도 함께 반환. */
  async startFromProblem(userId: string, problemId: string) {
    const p = await this.prisma.problem.findUnique({
      where: { id: problemId }, select: { unitId: true },
    });
    if (!p) throw new Error('problem not found');
    const session = await this.repo.create(userId, { unitId: p.unitId } as any);
    return { ...session, focusProblemId: problemId };
  }

  /**
   * 가중치 기반 추천 단원 — 학습 시작 화면에 노출.
   * weight = α·(100-mastery) + β·wrongNoteCount + γ·(timeBudget - timeSpent)
   * 학년 필터(grade) 가 주어지면 해당 학년 단원만, 아니면 사용자 자신의 학년.
   */
  async recommendedUnits(userId: string, count = 3, gradeOverride?: string, lang: Lang = 'en') {
    const user = await this.prisma.user.findUnique({ where: { id: userId } }) as any;
    const grade = (gradeOverride && gradeOverride !== '__all__' && gradeOverride !== '__mine__')
      ? gradeOverride
      : (gradeOverride === '__all__' ? null : user?.gradeLevel ?? null);

    // 사용자 mastery 가 있는 단원 + (필요시 학년 필터). mastery 가 없으면 0 으로 간주.
    const masteries = await this.prisma.masterySnapshot.findMany({
      where: { userId },
      include: { unit: true },
    });

    // 학년 필터: 학년이 지정됐으면 해당 학년에 속한 단원만
    let units = masteries.map((m: any) => ({
      unitId: m.unitId,
      unitName: m.unit.name,
      mastery: Math.round(m.score),
      gradeLevels: m.unit.gradeLevels ?? [],
    }));
    if (grade) units = units.filter((u: any) => (u.gradeLevels as string[]).includes(grade));

    if (units.length === 0) return [];

    // 단원별 부가 통계: 오답 카운트, 학습 시간(초)
    const wrongByUnit = await this.prisma.wrongNote.groupBy({
      by: ['problemId'],
      where: { userId, status: { not: 'MASTERED' } },
      _count: true,
    });
    const wrongProblemIds = wrongByUnit.map((w) => w.problemId);
    const wrongProblems = wrongProblemIds.length
      ? await this.prisma.problem.findMany({ where: { id: { in: wrongProblemIds } }, select: { id: true, unitId: true } })
      : [];
    const unitIdByProblem = new Map(wrongProblems.map((p) => [p.id, p.unitId]));
    const wrongCountByUnit: Record<string, number> = {};
    for (const w of wrongByUnit) {
      const unitId = unitIdByProblem.get(w.problemId);
      if (unitId) wrongCountByUnit[unitId] = (wrongCountByUnit[unitId] ?? 0) + (w._count as any);
    }

    const attempts = await this.prisma.attempt.findMany({
      where: { userId },
      select: { durationSec: true, problem: { select: { unitId: true } } },
    });
    const timeByUnit: Record<string, number> = {};
    const countByUnit: Record<string, number> = {};
    for (const a of attempts) {
      const uid = a.problem.unitId;
      timeByUnit[uid] = (timeByUnit[uid] ?? 0) + a.durationSec;
      countByUnit[uid] = (countByUnit[uid] ?? 0) + 1;
    }
    const maxTime = Math.max(60, ...Object.values(timeByUnit), 1);

    // 가중치: 약점(α) + 오답(β) + 학습부족(γ). 정규화로 0~100 score.
    const enriched = units.map((u: any) => {
      const wrongs = wrongCountByUnit[u.unitId] ?? 0;
      const timeSec = timeByUnit[u.unitId] ?? 0;
      const masteryGap = 100 - u.mastery; // 0~100
      const wrongScore = Math.min(60, wrongs * 12); // 오답 1건당 12pt, 최대 60
      const undertimeScore = Math.round((1 - timeSec / maxTime) * 40); // 시간 적을수록 ↑, 최대 40
      const score = Math.round(masteryGap * 0.45 + wrongScore * 0.35 + undertimeScore * 0.20);
      return {
        unitId: u.unitId,
        unitName: u.unitName,
        mastery: u.mastery,
        wrongCount: wrongs,
        attemptCount: countByUnit[u.unitId] ?? 0,
        studyMinutes: Math.round(timeSec / 60),
        weight: score,
      };
    });

    enriched.sort((a, b) => b.weight - a.weight);
    const top = enriched.slice(0, count);

    // 표시용 reason 라벨 (KO / EN / HI)
    const labelize = (e: typeof enriched[number]) => {
      const parts: string[] = [];
      if (lang === 'hi') {
        parts.push(`दक्षता ${e.mastery}%`);
        if (e.wrongCount > 0) parts.push(`${e.wrongCount} गलत नोट`);
        parts.push(`${e.studyMinutes} मिनट अध्ययन`);
      } else if (lang !== 'ko') {
        parts.push(`Mastery ${e.mastery}%`);
        if (e.wrongCount > 0) parts.push(`${e.wrongCount} wrong note${e.wrongCount > 1 ? 's' : ''}`);
        parts.push(`${e.studyMinutes} min studied`);
      } else {
        parts.push(`숙련도 ${e.mastery}%`);
        if (e.wrongCount > 0) parts.push(`오답 ${e.wrongCount}건`);
        parts.push(`학습 ${e.studyMinutes}분`);
      }
      return parts.join(' · ');
    };

    // 단원명 EN / HI 변환
    const unitDisplay = (name: string) => {
      if (lang === 'ko') return name;
      if (lang === 'hi') {
        return UNIT_NAME_HI[name] ?? UNIT_NAME_EN[name] ?? name;
      }
      return UNIT_NAME_EN[name] ?? name;
    };

    return top.map((e) => ({
      unitId: e.unitId,
      unit: unitDisplay(e.unitName),
      mastery: e.mastery,
      wrongCount: e.wrongCount,
      attemptCount: e.attemptCount,
      studyMinutes: e.studyMinutes,
      weight: e.weight,
      reason: labelize(e),
    }));
  }

  getAiGuide(userId: string, id: string, perspective: string, lang: Lang = 'en') {
    return this.aiGuide.generate(userId, id, perspective, lang);
  }

  /**
   * 답안 제출 응답을 선택지 메타로 enrich:
   *   - 정답: { isCorrect: true, choice: { text } }
   *   - 오답: { isCorrect: false, choice: { text, distractorType, rationale } } → 학습용 즉시 피드백
   *   - isRetry: 같은 step의 N번째 시도면 true (BKT 무효화됨)
   */
  async submitAnswer(userId: string, id: string, dto: SubmitAnswerDto, lang: Lang = 'en') {
    const attempt = await this.attempts.create(userId, {
      problemId: dto.problemId,
      answer: dto.answer,
      durationSec: dto.durationSec,
      confidence: dto.confidence,
      stepIndex: dto.stepIndex,
      choiceId: dto.choiceId,
      context: SessionContext.STUDY,
      studySessionId: id,
    });

    if (dto.choiceId) {
      const choice = await this.prisma.problemChoice.findUnique({
        where: { id: dto.choiceId },
        select: {
          id: true, text: true, isCorrect: true, distractorType: true, rationale: true,
          step: { select: { stepIndex: true, problem: { select: { source: true } } } },
        },
      });
      if (choice && lang !== 'ko' && choice.step) {
        const key = `${choice.step.problem.source}:${choice.step.stepIndex}:${(await this.prisma.problemChoice.findUnique({ where: { id: choice.id }, select: { choiceIndex: true } }))?.choiceIndex}`;
        const en = CHOICE_EN[key];
        if (en) {
          return { ...attempt, choice: { ...choice, text: en.text, rationale: en.rationale ?? null } };
        }
      }
      return { ...attempt, choice };
    }
    return attempt;
  }

  next(userId: string, id: string) { return this.repo.advanceStep(userId, id); }
  end(userId: string, id: string) { return this.repo.endSession(userId, id); }

  /**
   * Sprint 2 A9: POST /study-sessions/adaptive/start.
   *
   * Builds a 20-problem session driven by AdaptiveNextProblemService — each
   * getNext() call respects the user's mastery, error pattern, prerequisite
   * gaps, and 48h spacing window. KR/IN both supported (the engine filters
   * candidate Problems by country internally — Sprint 2 A7).
   *
   * Picks each problem in sequence so that the 48h-spacing exclusion
   * naturally diversifies the set (same problemId can't appear twice in
   * the same loop because RecommendationLog rows pile up).
   *
   * Response shape mirrors what HomeScreen "오늘의 맞춤 20문제" card needs:
   *   { sessionId, title, reason, problems[]: { id, reason, targetSkill, difficultyLevel } }
   *
   * If the engine returns no problems at all (cold-start with no Concept
   * for this gradeLevel, or exhausted candidate pool), returns an empty
   * problems[] with a friendly title — frontend shows an empty-state.
   */
  async startAdaptive(userId: string, dto: AdaptiveStartDto) {
    const target = 20;
    const picks: Awaited<ReturnType<AdaptiveNextProblemService['getNext']>>[] = [];
    // NOTE: chapterCode filtering not wired into AdaptiveNextProblemService
    // yet — Sprint 2 MVP supports mode='daily' only. chapterCode is parsed
    // but ignored; frontend can still call without it for the daily picker.
    for (let i = 0; i < target; i++) {
      const pick = await this.adaptive.getNext(userId);
      if (!pick) break;
      picks.push(pick);
    }

    if (picks.length === 0) {
      return {
        sessionId: null,
        title: '오늘의 맞춤 문제',
        reason: '학습 데이터를 더 모으면 맞춤 추천이 시작됩니다.',
        problems: [],
      };
    }

    // Build StudySession row anchored to the first problem's unit, so attempts
    // inside this session feed the same unit-balance analytics as a regular
    // StudySession. Multi-concept scope is tracked via RecommendationLog rows
    // (each pick already created one with sessionId=null).
    const firstProblem = await this.prisma.problem.findUnique({
      where: { id: picks[0]!.problemId },
      select: { unitId: true },
    });
    if (!firstProblem) {
      return {
        sessionId: null,
        title: '오늘의 맞춤 문제',
        reason: '추천된 문제를 불러오지 못했습니다.',
        problems: [],
      };
    }

    const session = await this.prisma.studySession.create({
      data: {
        userId,
        unitId: firstProblem.unitId,
        sessionNumber: 1,
        totalSessions: 1,
        context: SessionContext.STUDY,
        problemCount: picks.length,
      },
    });

    // Look up Concept.code for each targetConceptId so the response carries
    // a stable string skill identifier (not a uuid) that the frontend can use.
    const conceptIds = Array.from(new Set(picks.map((p) => p!.targetConceptId)));
    const concepts = await this.prisma.concept.findMany({
      where: { id: { in: conceptIds } },
      select: { id: true, code: true },
    });
    const codeByConceptId = new Map(concepts.map((c) => [c.id, c.code]));

    // Surface Problem.difficultyLevel from the engine pick itself (already
    // chosen for flow state) — no extra query needed.
    return {
      sessionId: session.id,
      title: '오늘의 맞춤 ' + picks.length + '문제',
      // The top-line reason is a brief summary; per-problem reasons are
      // already specific (from buildReason → ERROR_CODE_LABEL_KO).
      reason: '약점·오답 패턴·진도를 종합해 구성했어요.',
      problems: picks.map((p) => ({
        id: p!.problemId,
        reason: p!.reason,
        targetSkill: codeByConceptId.get(p!.targetConceptId) ?? null,
        difficultyLevel: p!.expectedDifficulty,
      })),
    };
  }
}
