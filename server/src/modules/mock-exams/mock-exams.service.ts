import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CountryCode, Difficulty, DistractorType, ErrorCode, MockExamType } from '@prisma/client';
import { MockExamsRepository } from './mock-exams.repository';
import { GradingService } from './services/grading.service';
import { AiRecommendExamService } from './services/ai-recommend-exam.service';
import { SubmitExamDto } from './dto/submit-exam.dto';
import { SubmitPaperDto } from './dto/submit-paper.dto';
import { pointsToNextGrade } from '../../common/utils/grade-calculator.util';
import { AttemptsService } from '../attempts/attempts.service';
import { SessionContext } from '../../common/enums/session-context.enum';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { Lang } from '../../common/i18n/current-lang.decorator';
import { PROBLEM_EN, STEP_PROMPT_EN, CHOICE_EN, SOURCE_EN, HINT_EN, CONCEPT_EN, FORMULA_EN } from '../../common/i18n/content-en';
import { LlmDraftService, DraftPayload } from '../content-ingest/llm-draft.service';
import { DeterministicCheckService } from '../../infrastructure/math/deterministic-check.service';
import { choiceErrorCode } from '../../common/learning/distractor-error-codes';

/**
 * MockExam name → English short label.
 * 예: "2024 9월 모의평가" → "2024 Sep Mock", "6월 모의평가" → "Jun Mock"
 */
function translateExamName(name: string): string {
  if (!name) return name;
  let s = name;
  const monthMap: Record<string, string> = {
    '1월': 'Jan', '2월': 'Feb', '3월': 'Mar', '4월': 'Apr', '5월': 'May', '6월': 'Jun',
    '7월': 'Jul', '8월': 'Aug', '9월': 'Sep', '10월': 'Oct', '11월': 'Nov', '12월': 'Dec',
  };
  for (const [k, v] of Object.entries(monthMap)) s = s.replace(k, v);
  s = s.replace('모의평가', 'Mock').replace('학력평가', 'Practice')
       .replace('수능', 'SAT').replace('교육청', 'Edu')
       .replace(/\s+/g, ' ').trim();
  return s;
}

/**
 * 응시용 sanitize — answer/isCorrect/distractorType/rationale 제거 + lang 번역 + 보기 셔플.
 * 매 요청마다 보기 순서를 무작위로 섞어 "정답은 항상 1번" 패턴 차단.
 */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sanitizeForExam(p: any, lang: Lang = 'en'): any {
  if (!p) return p;
  // expectedSolutionSteps carries the full worked solution — serving it in
  // the exam-start payload lets a devtools user read answers mid-exam.
  const { answer, expectedSolutionSteps, ...rest } = p;
  if (lang !== 'ko') {
    const en = PROBLEM_EN[p.source];
    if (en) rest.body = en.body;
    if (SOURCE_EN[p.source]) rest.source = SOURCE_EN[p.source];
    if (rest.hint && HINT_EN[rest.hint]) rest.hint = HINT_EN[rest.hint];
    if (CONCEPT_EN[p.source]) rest.concept = CONCEPT_EN[p.source];
    if (FORMULA_EN[p.source]) rest.formula = FORMULA_EN[p.source];
  }
  if (Array.isArray(rest.steps)) {
    rest.steps = rest.steps.map((s: any) => {
      const promptEn = STEP_PROMPT_EN[`${p.source}:${s.stepIndex}`];
      const choices = (s.choices ?? []).map((c: any) => {
        const choiceEn = CHOICE_EN[`${p.source}:${s.stepIndex}:${c.choiceIndex}`];
        return {
          id: c.id, choiceIndex: c.choiceIndex,
          text: lang !== 'ko' && choiceEn ? choiceEn.text : c.text,
        };
      });
      return {
        id: s.id, stepIndex: s.stepIndex, stepType: s.stepType,
        prompt: lang !== 'ko' && promptEn ? promptEn : s.prompt,
        choices: shuffle(choices),
      };
    });
  }
  return rest;
}

@Injectable()
export class MockExamsService {
  private readonly logger = new Logger(MockExamsService.name);

  constructor(
    private readonly repo: MockExamsRepository,
    private readonly grading: GradingService,
    private readonly aiRec: AiRecommendExamService,
    private readonly attempts: AttemptsService,
    private readonly prisma: PrismaService,
    private readonly llmDraft: LlmDraftService,
    private readonly deterministicCheck: DeterministicCheckService,
  ) {}

  async trajectory(userId: string, count: number, lang: Lang = 'en') {
    const rows = await this.repo.findTrajectory(userId, count);
    // 목표선 — 사용자 targetGrade 기반 동적 환산. 가짜 고정값 80 제거.
    // 등급당 ~8점 (1등급=96, 2등급=88, 3등급=80, 4등급=72 ...)
    const user = await this.prisma.user.findUnique({
      where: { id: userId }, select: { targetGrade: true },
    });
    const target = user?.targetGrade ? Math.max(40, 100 - (user.targetGrade - 1) * 8) : null;
    return rows.map((r: any) => ({
      name: lang !== 'ko'
        ? translateExamName(r.mockExam.name)
        : r.mockExam.name.replace(/^2024\s+/, '').replace('학력평가', '학평').replace('모의평가', '모평'),
      score: r.score, grade: r.grade, target,
    }));
  }

  async recentResults(userId: string, count: number, lang: Lang = 'en') {
    const rows = await this.repo.findRecent(userId, count);
    return rows.map((r: any) => {
      const iso = r.takenAt.toISOString().slice(0, 10);
      const dateKo = iso.replace(/-/g, '년 ').replace(/년 (\d+)$/, '년 $1월') + '일';
      return {
        id: r.id,
        name: lang !== 'ko' ? translateExamName(r.mockExam.name) : r.mockExam.name,
        date: lang !== 'ko' ? iso : dateKo,
        score: r.score, grade: r.grade, percentile: r.percentile,
        time: lang !== 'ko'
          ? `${r.durationMin}min / ${r.mockExam.totalMinutes}min`
          : `${r.durationMin}분/${r.mockExam.totalMinutes}분`,
      };
    });
  }

  /**
   * 단일 결과 상세 — Recent results 카드 클릭 시 review 페이지에 표시.
   * 응시 attempt 별 problem 이름·정답 여부·내가 고른 보기까지 포함.
   */
  async getResultById(userId: string, resultId: string, lang: Lang = 'en') {
    const r = await this.prisma.mockExamResult.findFirst({
      where: { id: resultId, userId },
      include: {
        mockExam: true,
        attempts: {
          include: {
            problem: { select: { id: true, source: true, body: true, difficulty: true } },
            choice: { select: { choiceIndex: true, text: true, isCorrect: true, rationale: true } },
          },
          orderBy: [{ problemId: 'asc' }, { stepIndex: 'asc' }],
        },
      },
    });
    if (!r) throw new NotFoundException('Result not found');

    // 문제별로 묶기: { problemId → { source, steps:[{stepIndex, isCorrect, choiceText}] } }
    const byProblem = new Map<string, any>();
    for (const a of r.attempts) {
      const key = a.problemId;
      const cur = byProblem.get(key) ?? {
        problemId: a.problemId,
        source: lang !== 'ko' && SOURCE_EN[a.problem.source]
          ? SOURCE_EN[a.problem.source]
          : a.problem.source,
        body: a.problem.body,
        steps: [],
        allCorrect: true,
      };
      const isCorrect = !!a.choice?.isCorrect;
      cur.steps.push({
        stepIndex: a.stepIndex,
        isCorrect,
        myChoice: a.choice?.text ?? null,
        rationale: a.choice?.rationale ?? null,
      });
      if (!isCorrect) cur.allCorrect = false;
      byProblem.set(key, cur);
    }
    return {
      id: r.id,
      name: lang !== 'ko' ? translateExamName(r.mockExam.name) : r.mockExam.name,
      takenAt: r.takenAt.toISOString(),
      score: r.score,
      grade: r.grade,
      percentile: r.percentile,
      durationMin: r.durationMin,
      totalMinutes: r.mockExam.totalMinutes,
      problems: Array.from(byProblem.values()),
    };
  }

  async summary(userId: string) {
    // 최근 10개 + 전체 count 동시 조회.
    const [recent, attemptCount] = await Promise.all([
      this.repo.findRecent(userId, 10),
      this.prisma.mockExamResult.count({ where: { userId } }),
    ]);
    const last = recent[0];
    const N = recent.length;

    let reliability: number | null = null;
    let bestScore: number | null = null;
    let avgScore: number | null = null;
    let improvementSinceFirst: number | null = null;
    let scoreDelta: number | null = null;

    if (N > 0) {
      const scores = recent.map((r: any) => r.score);
      bestScore = Math.max(...scores);
      avgScore = Math.round(scores.reduce((s: number, x: number) => s + x, 0) / N);
      // recent 는 takenAt desc 순 — 첫 응시는 배열 끝.
      const first = scores[scores.length - 1];
      improvementSinceFirst = last!.score - first;
      // 직전 응시(idx 1) vs 이번(idx 0).
      if (N >= 2) scoreDelta = last!.score - scores[1];

      const mean = avgScore;
      const variance = scores.reduce((s: number, x: number) => s + (x - mean) ** 2, 0) / N;
      const sigma = Math.sqrt(variance);
      const base = Math.min(95, Math.round(50 + 7 * Math.sqrt(N) + (N >= 3 ? 10 : 0)));
      const penalty = sigma >= 10 ? 10 : sigma >= 5 ? 5 : 0;
      reliability = Math.max(0, base - penalty);
    }

    return {
      lastScore:         last?.score ?? null,
      expectedGrade:     last?.grade ?? null,
      reliability,
      pointsToNextGrade: last ? pointsToNextGrade(last.score) : null,
      percentile:        last?.percentile ?? null,
      // 신규 — frontend stat 라벨과 1:1 매칭.
      bestScore,
      avgScore,
      attemptCount,
      improvementSinceFirst,
      scoreDelta,
    };
  }

  async startRecommended(userId: string, lang: Lang = 'en') {
    const { problems } = await this.aiRec.compose(userId);
    return this.beginSession(
      userId,
      { name: 'AI-tailored Mock', type: MockExamType.RECOMMENDED, totalMinutes: 50, problems },
      lang,
    );
  }

  async startTyped(userId: string, kind: 'mini' | 'wrong-redo' | 'real', lang: Lang = 'en') {
    const result = await this.aiRec.composeTyped(userId, kind);
    const fb = (result as { fallbackReason?: string }).fallbackReason;
    const meta: Record<string, { name: string; type: any; totalMinutes: number }> = {
      mini:        { name: 'Unit Mini Test',                  type: 'MINI',       totalMinutes: 15 },
      'wrong-redo':{ name: 'Wrong-Redo Exam',                 type: 'WRONG_REDO', totalMinutes: 30 },
      real:        { name: 'Full Mock Exam (Grade-wide)',     type: 'REAL',       totalMinutes: 60 },
    };
    const m = { ...meta[kind] };
    // Override name if a fallback kicked in — keep user informed.
    if (fb === 'no-wrong-notes' && kind === 'wrong-redo') {
      m.name = 'Practice (no wrong notes yet)';
    } else if (fb === 'no-grade-problems' && kind === 'real') {
      m.name = 'Practice (grade pool empty)';
    }
    return this.beginSession(userId, { ...m, problems: result.problems }, lang);
  }

  /**
   * Study tab — pool-first chapter test.
   *
   * Strategy: pick up to 20 problems from the shared pool for the given
   * chapter that the user has NEVER attempted. This delivers two product
   * promises at once: (a) no user ever sees the same problem twice, and
   * (b) AI generation cost shrinks as the pool grows (later users draw from
   * earlier users' contributions). Schema unchanged — Attempt rows are the
   * deduplication index. If the pool runs dry for a user we return what we
   * have; AI augmentation lands as a follow-up (P16).
   */
  async startChapter(userId: string, chapterCode: string, lang: Lang = 'en') {
    const TARGET = 20;
    const lesson = await this.prisma.conceptLesson.findUnique({
      where: { chapterCode },
      select: { id: true, ncertClass: true, chapterNumber: true, titleEn: true, unitId: true, subUnitId: true },
    });
    if (!lesson) throw new NotFoundException(`Chapter not found: ${chapterCode}`);

    // Mastery gate — practice is unlocked the moment the user has mastered
    // the concept lesson for this chapter, regardless of which NCERT class
    // it belongs to. A Class 11 student who has mastered a Class 9 review
    // chapter can drill it in Study; conversely an unattempted chapter is
    // blocked even if it is in the user's own class.
    const progress = await this.prisma.conceptProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId: lesson.id } },
      select: { masteredAt: true },
    });
    if (!progress?.masteredAt) {
      throw new ForbiddenException(
        `Finish the concept lesson for ${chapterCode} in Mastery before practising.`,
      );
    }

    // "Never show the same problem twice" applies only to Study/practice
    // history. Pure mock-exam attempts (EXAM context) and diagnostic seeds
    // stay eligible.
    const attemptedRows = await this.prisma.attempt.findMany({
      where: { userId, context: { in: [SessionContext.STUDY, SessionContext.PRACTICE] } },
      select: { problemId: true },
      distinct: ['problemId'],
    });
    // Bound the SQL `IN (...)` clause for the $queryRawUnsafe call below.
    // A user with 5k+ Study attempts would otherwise inflate the parameter
    // array (DoS surface; Postgres parser slows past a few thousand). Cap at
    // 500 most-recent — older attempts are unlikely to be drawn again from a
    // random LIMIT 20 pool, so the de-dup quality cost is negligible.
    const ATTEMPTED_CAP = 500;
    const attemptedIds = attemptedRows.map((a) => a.problemId).slice(0, ATTEMPTED_CAP);

    // Pool: SINGLE-STEP problems only — the Study tab is single-question
    // practice (5-choice MC + handwriting pad). Multi-step (3-step MC)
    // problems are reserved for Mastery (ConceptLessonScreen practice
    // phase), so we filter to problems whose ProblemStep count is exactly 1.
    // Problem.id is text (not uuid) → cast the user's attempted-ids array
    // as text[].
    const candidates = await this.prisma.$queryRawUnsafe<Array<{ id: string; source: string; difficulty: string }>>(
      `SELECT p.id, p.source, p.difficulty::text AS difficulty
       FROM "Problem" p
       WHERE p."conceptLessonId" = $1
         AND EXISTS (SELECT 1 FROM "ProblemStep" s WHERE s."problemId" = p.id AND s."stepIndex" = 1)
         AND NOT EXISTS (SELECT 1 FROM "ProblemStep" s2 WHERE s2."problemId" = p.id AND s2."stepIndex" >= 2)
         ${attemptedIds.length > 0 ? `AND p.id <> ALL($2::text[])` : ''}
       ORDER BY random()
       LIMIT 20`,
      lesson.id,
      ...(attemptedIds.length > 0 ? [attemptedIds] : []),
    );

    // 2026-05-22 user decision: do NOT silently top-up with LLM-generated
    // problems when the pool is short. Surface the gap so we can curate
    // problems by hand (NCERT exercises, exemplar problems, etc.). The
    // `LLM_POOL_TOPUP` env var is the kill-switch — set to "on" to re-enable
    // generation for a specific deploy if needed.
    const shortfall = TARGET - candidates.length;
    if (shortfall > 0 && process.env.LLM_POOL_TOPUP === 'on') {
      const generated = await this.generateSingleStepProblems(lesson, shortfall, userId);
      candidates.push(...generated);
    }

    const name = `Class ${lesson.ncertClass.replace('CLASS_', '')} · ${lesson.titleEn}`;
    return this.beginSession(userId, {
      name,
      type: 'MINI',
      totalMinutes: 25,
      problems: candidates,
    }, lang);
  }

  /**
   * Stateless "next problem" for the Study tab.
   *
   * The Study flow generates one problem at a time on demand: the student
   * solves, the screen asks for the next, and so on. Compared with the
   * batched startChapter (20 problems up front) this:
   *   • cuts the LLM bill — a student who quits after 3 problems only ever
   *     triggers ~3 generations, not 20;
   *   • feels snappier — first paint is one LLM round trip, not twenty;
   *   • allows the recommender to react to per-problem performance over
   *     the course of a session (future hook).
   *
   * Returns null when no fresh problem is available (pool dry + LLM
   * top-up failed or the chapter has no unitId for persistence).
   * The returned shape is the full exam-ready problem (with its
   * single ProblemStep + 5 choices) — fetchFullProblems handles the
   * sanitize (no answer leakage, choices shuffled).
   */
  async nextChapterProblem(userId: string, chapterCode: string, lang: Lang = 'en'): Promise<any | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { country: true },
    });
    const country = chapterCode.startsWith('K-') || user?.country === 'KR' ? 'KR' : 'IN';
    return country === 'KR'
      ? this.nextKoreanStudyProblem(userId, chapterCode, lang)
      : this.nextNcertStudyProblem(userId, chapterCode, lang);
  }

  private async nextNcertStudyProblem(userId: string, chapterCode: string, lang: Lang = 'en'): Promise<any | null> {
    const lesson = await this.prisma.conceptLesson.findUnique({
      where: { chapterCode },
      select: { id: true, ncertClass: true, chapterNumber: true, titleEn: true, unitId: true, subUnitId: true },
    });
    if (!lesson) throw new NotFoundException(`Chapter not found: ${chapterCode}`);

    // Mastery gate — same rule as startChapter.
    const progress = await this.prisma.conceptProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId: lesson.id } },
      select: { masteredAt: true },
    });
    if (!progress?.masteredAt) {
      throw new ForbiddenException(
        `Finish the concept lesson for ${chapterCode} in Mastery before practising.`,
      );
    }

    let chosenId = await this.pickStudyProblemId({
      userId,
      country: 'IN',
      chapterCode,
      lessonId: lesson.id,
      lessonFk: 'conceptLessonId',
    });

    // Legacy fallback: keep the old direct-pool query during the
    // LessonProblemSet expand phase so chapters without STUDY_1STEP rows
    // still work until the backfill has run everywhere.
    if (!chosenId) {
    // Skip every problem this user has already touched in a learning context.
    const attemptedRows = await this.prisma.attempt.findMany({
      where: { userId, context: { in: [SessionContext.STUDY, SessionContext.PRACTICE] } },
      select: { problemId: true },
      distinct: ['problemId'],
    });
    // Same DoS bound as startChapter — cap the `IN (...)` parameter array.
    const ATTEMPTED_CAP = 500;
    const attemptedIds = attemptedRows.map((a) => a.problemId).slice(0, ATTEMPTED_CAP);

    // Pool — single-step, mapped to this chapter, never tried by this user.
    const pooled = await this.prisma.$queryRawUnsafe<Array<{ id: string; source: string; difficulty: string }>>(
      `SELECT p.id, p.source, p.difficulty::text AS difficulty
       FROM "Problem" p
       WHERE p."conceptLessonId" = $1
         AND EXISTS (SELECT 1 FROM "ProblemStep" s WHERE s."problemId" = p.id AND s."stepIndex" = 1)
         AND NOT EXISTS (SELECT 1 FROM "ProblemStep" s2 WHERE s2."problemId" = p.id AND s2."stepIndex" >= 2)
         ${attemptedIds.length > 0 ? `AND p.id <> ALL($2::text[])` : ''}
       ORDER BY random()
       LIMIT 1`,
      lesson.id,
      ...(attemptedIds.length > 0 ? [attemptedIds] : []),
    );

    chosenId = pooled[0]?.id ?? null;
    }
    if (!chosenId && process.env.LLM_POOL_TOPUP === 'on') {
      // Pool dry — opt-in LLM top-up. Off by default (2026-05-22 user
      // decision: chapters with empty single-step pools should signal that
      // the pool needs hand-curation, not silently fall back to AI gen).
      const generated = await this.generateSingleStepProblems(lesson, 1, userId);
      chosenId = generated[0]?.id ?? null;
    }
    if (!chosenId) return null;

    // Return the full exam-ready shape (body + sanitized steps + shuffled
    // choices, answer field stripped) so the client can render the question
    // without a second round-trip.
    const [full] = await this.fetchFullProblems([chosenId], lang);
    return full ?? null;
  }

  private async nextKoreanStudyProblem(userId: string, chapterCode: string, lang: Lang = 'ko'): Promise<any | null> {
    const lesson = await this.prisma.koreanConceptLesson.findUnique({
      where: { chapterCode },
      select: { id: true },
    });
    if (!lesson) throw new NotFoundException(`Korean chapter not found: ${chapterCode}`);

    const progress = await this.prisma.koreanConceptProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId: lesson.id } },
      select: { masteredAt: true },
    });
    if (!progress?.masteredAt) {
      throw new ForbiddenException(
        `Finish the concept lesson for ${chapterCode} in Mastery before practising.`,
      );
    }

    const chosenId = await this.pickStudyProblemId({
      userId,
      country: 'KR',
      chapterCode,
      lessonId: lesson.id,
      lessonFk: 'koreanConceptLessonId',
    });
    if (!chosenId) return null;

    const [full] = await this.fetchFullProblems([chosenId], lang);
    return full ?? null;
  }

  private async pickStudyProblemId(args: {
    userId: string;
    country: CountryCode;
    chapterCode: string;
    lessonId: string;
    lessonFk: 'conceptLessonId' | 'koreanConceptLessonId';
  }): Promise<string | null> {
    const attemptedRows = await this.prisma.attempt.findMany({
      where: { userId: args.userId, context: { in: [SessionContext.STUDY, SessionContext.PRACTICE] } },
      orderBy: { createdAt: 'desc' },
      select: { problemId: true },
      distinct: ['problemId'],
      take: 500,
    });
    const attemptedIds = attemptedRows.map((a) => a.problemId);

    const weaknessRows = await this.prisma.errorPatternProfile.findMany({
      where: { userId: args.userId, status: 'ACTIVE' },
      orderBy: [{ recentFrequency: 'desc' }, { frequency: 'desc' }, { lastDetectedAt: 'desc' }],
      take: 5,
      select: { errorCode: true },
    });
    const weaknessCodes = new Set<ErrorCode>(weaknessRows.map((r) => r.errorCode));

    const activeSet = await this.prisma.lessonProblemSet.findFirst({
      where: {
        country: args.country,
        chapterCode: args.chapterCode,
        setType: 'STUDY_1STEP',
        status: 'READY',
        retiredAt: null,
      },
      orderBy: { version: 'desc' },
      select: { problemIds: true },
    });
    const setOrder = new Map<string, number>(
      (activeSet?.problemIds ?? []).map((id, idx) => [id, idx]),
    );

    const candidates = await this.prisma.problem.findMany({
      where: {
        [args.lessonFk]: args.lessonId,
        ...(activeSet?.problemIds.length ? { id: { in: activeSet.problemIds } } : {}),
        ...(attemptedIds.length ? { id: { notIn: attemptedIds } } : {}),
        conceptMismatch: { not: true },
        OR: [
          { qualityStatus: null },
          { qualityStatus: { in: ['APPROVED', 'USABLE'] } },
        ],
        AND: [
          { steps: { some: { stepIndex: 1 } } },
          { steps: { none: { stepIndex: { gte: 2 } } } },
        ],
      },
      orderBy: activeSet?.problemIds.length
        ? undefined
        : [{ difficultyLevel: 'asc' }, { createdAt: 'asc' }],
      take: 50,
      select: {
        id: true,
        difficultyLevel: true,
        createdAt: true,
        commonErrorCodes: true,
        steps: {
          select: {
            choices: { select: { isCorrect: true, distractorErrorCode: true, distractorType: true } },
          },
        },
      },
    });

    const valid = candidates.filter((p) => {
      const step = p.steps[0];
      if (p.steps.length !== 1 || !step || step.choices.length !== 5) return false;
      return step.choices.filter((c) => c.isCorrect).length === 1;
    });
    if (valid.length === 0) return null;

    // Concept-mastery weighting — problems testing the user's weakest concepts
    // surface first. Concepts without attempt evidence stay neutral (boost 0)
    // so the operator-curated set order is preserved for cold-start users.
    const conceptLinks = await this.prisma.problemConcept.findMany({
      where: { problemId: { in: valid.map((p) => p.id) } },
      select: { problemId: true, conceptId: true, weight: true },
    });
    const boostByProblem = new Map<string, number>();
    if (conceptLinks.length > 0) {
      const trajectories = await this.prisma.masteryTrajectory.findMany({
        where: {
          userId: args.userId,
          conceptId: { in: [...new Set(conceptLinks.map((l) => l.conceptId))] },
          evidenceCount: { gt: 0 },
        },
        select: { conceptId: true, masteryScore: true },
      });
      const masteryByConcept = new Map(trajectories.map((t) => [t.conceptId, t.masteryScore]));
      for (const link of conceptLinks) {
        const mastery = masteryByConcept.get(link.conceptId);
        if (mastery === undefined) continue;
        const boost = ((100 - mastery) / 100) * link.weight;
        boostByProblem.set(link.problemId, Math.max(boostByProblem.get(link.problemId) ?? 0, boost));
      }
    }

    const weaknessScore = (p: typeof valid[number]) => {
      if (p.commonErrorCodes.some((c) => weaknessCodes.has(c))) return 2;
      // commonErrorCodes has no writer yet, so in practice the distractor
      // metadata on wrong choices (IN distractorType / KR distractorErrorCode)
      // is the only per-problem error signal available for matching.
      const matchesChoice = p.steps.some((s) =>
        s.choices.some((c) => {
          if (c.isCorrect) return false;
          const code = choiceErrorCode(c);
          return code !== null && weaknessCodes.has(code);
        }),
      );
      return matchesChoice ? 1 : 0;
    };

    // weaknessScore dominates (0|1|2) and masteryBoost (0..1) breaks ties
    // within the same weakness tier without ever overriding it.
    const totalScore = (p: typeof valid[number]) =>
      weaknessScore(p) + (boostByProblem.get(p.id) ?? 0);

    valid.sort((a, b) => {
      const weakDiff = totalScore(b) - totalScore(a);
      if (weakDiff !== 0) return weakDiff;
      if (setOrder.size > 0) {
        return (setOrder.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (setOrder.get(b.id) ?? Number.MAX_SAFE_INTEGER);
      }
      if (a.difficultyLevel !== b.difficultyLevel) return a.difficultyLevel - b.difficultyLevel;
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
    return valid[0]?.id ?? null;
  }

  /**
   * Top up a chapter's single-step pool by generating `count` fresh problems
   * via the LLM and persisting them as Problem rows (conceptLessonId set).
   * Runs in 5-way parallel chunks per the BULK-LLM policy. Each failed
   * generation/persist is logged and skipped — partial top-up is acceptable
   * (the caller falls back to whatever it managed to grab).
   */
  private async generateSingleStepProblems(
    lesson: {
      id: string;
      ncertClass: string;
      chapterNumber: number;
      titleEn: string;
      unitId: string | null;
      subUnitId: string | null;
    },
    count: number,
    userId?: string,
  ): Promise<Array<{ id: string; source: string; difficulty: string }>> {
    // Problem.unitId is non-null in the schema, so a chapter whose
    // ConceptLesson lost its unit mapping (legacy seed glitch) can't host
    // new Problem rows. Skip top-up rather than crash; the user gets the
    // already-pooled candidates and a fix-up migration can backfill unitId.
    if (!lesson.unitId) {
      this.logger.warn(`Skipping LLM top-up: chapter ${lesson.id} has no unitId`);
      return [];
    }
    const unitId = lesson.unitId;
    const classLabel = lesson.ncertClass.replace('CLASS_', 'Class ');
    const attribution = `AI generated for Matheo · ${classLabel} Chapter ${lesson.chapterNumber} (${lesson.titleEn}) — derived from NCERT syllabus`;
    const chapterRef = `${classLabel} · Chapter ${lesson.chapterNumber} · ${lesson.titleEn}`;
    // Per-variant prompt nudges the LLM to vary the problems even when
    // called in parallel. The seed integer + difficulty hint avoids
    // collapsing into the same canonical question N times.
    // Difficulty quota + random seed prevent the LLM from emitting near-
    // duplicate problems in same-prompt parallel batches (see the post-
    // mortem in dedupe-problems where 5-way calls produced exact body
    // collisions).
    const difficulties = ['MIDDLE', 'UPPER_MIDDLE', 'SEMI_KILLER', 'KILLER'] as const;
    const variants = Array.from({ length: count }, (_, i) => {
      const targetDiff = difficulties[i % difficulties.length];
      const seed = Math.random().toString(36).slice(2, 8);
      return (
        `[seed=${seed}] Generate a fresh single-step practice problem for NCERT ${chapterRef}. ` +
        `Aim for difficulty=${targetDiff}. Variation #${i + 1} (out of ${count}). ` +
        `Pick numeric values that have not appeared in any earlier variation in this batch — change every constant. ` +
        `Make it pedagogically distinct.`
      );
    });

    const CHUNK = 5;
    const results: Array<{ id: string; source: string; difficulty: string }> = [];
    for (let i = 0; i < variants.length; i += CHUNK) {
      const slice = variants.slice(i, i + CHUNK);
      const drafts = await Promise.all(
        slice.map((text) =>
          this.llmDraft
            .generate(
              {
                ncertClass: lesson.ncertClass,
                chapterNumber: lesson.chapterNumber,
                chapterTitleHint: lesson.titleEn,
                text,
              },
              { mode: 'single-step', userId },
            )
            .catch((err) => {
              this.logger.warn(`Single-step LLM gen failed: ${(err as Error).message}`);
              return null;
            }),
        ),
      );
      for (const draft of drafts) {
        if (!draft) continue;
        try {
          const persisted = await this.persistSingleStepProblem(
            { id: lesson.id, unitId, subUnitId: lesson.subUnitId },
            draft.payload,
            attribution,
          );
          results.push(persisted);
        } catch (err) {
          this.logger.warn(`Persist single-step problem failed: ${(err as Error).message}`);
        }
      }
    }
    return results;
  }

  /**
   * Materialise a validated single-step DraftPayload as a Problem (+ its
   * single ProblemStep + 5 ProblemChoice rows). The conceptLessonId binds
   * it to the chapter so subsequent users for the same chapter pull it
   * from the shared pool — this is the cost-amortisation lever for AI
   * top-up.
   */
  private async persistSingleStepProblem(
    lesson: { id: string; unitId: string; subUnitId: string | null },
    payload: DraftPayload,
    attribution: string,
  ): Promise<{ id: string; source: string; difficulty: string }> {
    const step0 = payload.steps[0];
    const correctChoice = step0.choices.find((c) => c.isCorrect);

    // QUALITY gate — deterministic-check tries to solve the LLM's problem
    // from scratch and compares with the answer the LLM marked correct.
    // null = the question doesn't fit any of the 9 closed-form checkers
    // (geometry, proofs, statistics narratives, …) — let it through.
    // isStudentCorrect === false = the LLM contradicted a reproducible
    // solver; reject the problem so a bad answer never lands in the pool.
    const verdict = correctChoice
      ? this.deterministicCheck.check(payload.problemBody, correctChoice.text)
      : null;
    if (verdict && verdict.isStudentCorrect === false) {
      throw new Error(
        `Deterministic verdict mismatch (${verdict.checker}): LLM answer="${correctChoice?.text}" vs solver="${verdict.answer}"`,
      );
    }

    const problem = await this.prisma.problem.create({
      data: {
        source: attribution,
        unitId: lesson.unitId,
        ...(lesson.subUnitId ? { subUnitId: lesson.subUnitId } : {}),
        difficulty: payload.difficulty as Difficulty,
        difficultyLevel: payload.difficultyLevel,
        body: payload.problemBody,
        hint: payload.hint,
        concept: payload.concept,
        answer: correctChoice?.text ?? '',
        expectedTimeSec: payload.expectedTimeSec,
        conceptLessonId: lesson.id,
        steps: {
          create: payload.steps.map((s, i) => ({
            stepIndex: i + 1,
            stepType: s.stepType,
            prompt: s.prompt,
            choices: {
              create: s.choices.map((c, ci) => ({
                choiceIndex: ci + 1,
                text: c.text,
                isCorrect: c.isCorrect,
                ...(c.distractorType ? { distractorType: c.distractorType as DistractorType } : {}),
                ...(c.rationale ? { rationale: c.rationale } : {}),
              })),
            },
          })),
        },
      },
      select: { id: true, source: true, difficulty: true },
    });
    return { id: problem.id, source: problem.source, difficulty: problem.difficulty };
  }

  private async beginSession(userId: string, p: {
    name: string; type: any; totalMinutes: number;
    problems: Array<{ id: string; source: string; difficulty: string }>;
  }, lang: Lang = 'en') {
    if (!p.problems || p.problems.length === 0) {
      return { resultId: null, name: p.name, type: p.type, totalMinutes: p.totalMinutes, problems: [] };
    }
    const { result } = await this.repo.createSession(userId, {
      name: p.name, type: p.type, totalProblems: p.problems.length, totalMinutes: p.totalMinutes,
    });
    const fullProblems = await this.fetchFullProblems(p.problems.map((x) => x.id), lang);
    return {
      resultId: result.id,
      name: p.name,
      type: p.type,
      totalMinutes: p.totalMinutes,
      problems: fullProblems,
    };
  }

  private async fetchFullProblems(ids: string[], lang: Lang = 'en') {
    if (ids.length === 0) return [];
    const ps = await this.prisma.problem.findMany({
      where: { id: { in: ids } },
      include: {
        steps: {
          orderBy: { stepIndex: 'asc' },
          include: { choices: { orderBy: { choiceIndex: 'asc' } } },
        },
      },
    });
    const byId = new Map(ps.map((p) => [p.id, p]));
    return ids
      .map((id) => byId.get(id))
      .filter(Boolean)
      .map((p: any) => sanitizeForExam(p, lang));
  }

  /**
   * 모의고사 — 학습과 같은 방식으로 per-step 제출.
   * choice를 선택하면 attempt 생성 + isCorrect/distractorType/rationale 즉시 반환.
   * 학습페이지의 study-sessions/:id/answer 와 동일한 흐름.
   */
  async submitStepAnswer(userId: string, resultId: string, dto: {
    problemId: string; choiceId: string;
    stepIndex: number; durationSec: number; confidence?: number;
  }, lang: Lang = 'en') {
    // Chapter-test sessions (MockExam.type=MINI) come from the Study tab.
    // Tag those attempts as STUDY rather than EXAM so startChapter's "never
    // show the same problem twice" filter only excludes Study-context history
    // — real mock-exam attempts stay eligible for chapter-test pickup.
    const session = await this.prisma.mockExamResult.findUniqueOrThrow({
      where: { id: resultId },
      select: { mockExam: { select: { type: true } } },
    });
    const context = session.mockExam.type === 'MINI' ? SessionContext.STUDY : SessionContext.EXAM;

    const attempt = await this.attempts.create(userId, {
      problemId: dto.problemId,
      answer: '',
      durationSec: dto.durationSec,
      confidence: dto.confidence,
      stepIndex: dto.stepIndex,
      choiceId: dto.choiceId,
      context,
      mockExamResultId: resultId,
    });
    const choice = await this.prisma.problemChoice.findUnique({
      where: { id: dto.choiceId },
      select: {
        id: true, choiceIndex: true, text: true, isCorrect: true, distractorType: true, rationale: true,
        step: { select: { stepIndex: true, problem: { select: { source: true } } } },
      },
    });
    if (choice && lang !== 'ko' && choice.step) {
      const key = `${choice.step.problem.source}:${choice.step.stepIndex}:${choice.choiceIndex}`;
      const en = CHOICE_EN[key];
      if (en) return { ...attempt, choice: { ...choice, text: en.text, rationale: en.rationale ?? null } };
    }
    return { ...attempt, choice };
  }

  /**
   * Per-step submit flow ends here. Delegates to grading.service so /submit
   * and /finalize produce identical scores on the same MockExamResult — they
   * used to drift (different grade cuts, attempt-level vs problem-level
   * accuracy, percentile = score vs table lookup).
   */
  async finalize(userId: string, resultId: string) {
    // Ownership guard — grading.service is user-agnostic so we 404 here.
    await this.prisma.mockExamResult.findFirstOrThrow({
      where: { id: resultId, userId },
    });
    const graded = await this.grading.grade(userId, resultId, {});
    const saved = await this.repo.saveResult(resultId, {
      score: graded.score,
      grade: graded.grade,
      percentile: graded.percentile,
      durationMin: graded.durationMin,
    });
    return {
      ...saved,
      correctCount: graded.correctCount,
      totalProblems: graded.totalProblems,
      attemptedProblems: graded.attemptedProblems,
    };
  }

  /**
   * 모의고사 제출 (레거시 — 한 번에 모든 답안 제출).
   *   1) 각 답안을 Attempt로 저장 (context: EXAM, mockExamResultId 연결)
   *      → attempt.completed 이벤트가 mastery·activity·wrong-note 자동 갱신
   *   2) totalScore 기반 등급/백분위 계산 후 MockExamResult 업데이트
   *
   * 결과로 mastery score는 단원별로 PFA에 따라 변동, DailyActivity는 풀이수·시간 누적.
   */
  async submit(userId: string, resultId: string, dto: SubmitExamDto) {
    // Each answer → Attempt rows. Multiple-choice with N choiceIds expands to
    // N attempts (stepIndex 1..N). Steps within one problem must stay
    // sequential so the mastery listener sees consistent prior state, but
    // different problems can run in parallel — a 60-problem × 3-step exam
    // used to walk 180 awaits in series (15+s on a warm DB); parallelising
    // by-problem brings it back under a second.
    await Promise.all(dto.answers.map(async (a) => {
      if (a.choiceIds && a.choiceIds.length > 0) {
        const perStepDuration = Math.max(1, Math.round(a.durationSec / a.choiceIds.length));
        for (let i = 0; i < a.choiceIds.length; i++) {
          await this.attempts.create(userId, {
            problemId: a.problemId,
            answer: '',
            durationSec: perStepDuration,
            confidence: a.confidence,
            stepIndex: i + 1,
            choiceId: a.choiceIds[i],
            context: SessionContext.EXAM,
            mockExamResultId: resultId,
          });
        }
      } else {
        await this.attempts.create(userId, {
          problemId: a.problemId,
          answer: a.answer,
          durationSec: a.durationSec,
          confidence: a.confidence,
          context: SessionContext.EXAM,
          mockExamResultId: resultId,
        });
      }
    }));
    const graded = await this.grading.grade(userId, resultId, dto);
    // saveResult spreads into prisma update — pass only persisted columns.
    return this.repo.saveResult(resultId, {
      score: graded.score,
      grade: graded.grade,
      percentile: graded.percentile,
      durationMin: graded.durationMin,
    });
  }

  /**
   * Full-paper submit (REAL exams) — the client collects one final choice per
   * problem (palette navigation, answers changeable until submit) and sends
   * them all at once. Each answer lands as an Attempt with the choice's real
   * stepIndex so wrong-note / mastery listeners see consistent rows, then the
   * paper is graded with JEE negative marking (grading.service REAL branch).
   */
  async submitPaper(userId: string, resultId: string, dto: SubmitPaperDto) {
    await this.prisma.mockExamResult.findFirstOrThrow({
      where: { id: resultId, userId },
    });

    const answers = dto.answers ?? [];
    const choiceIds = answers.map((a) => a.choiceId);
    const choices = choiceIds.length > 0
      ? await this.prisma.problemChoice.findMany({
          where: { id: { in: choiceIds } },
          select: { id: true, step: { select: { stepIndex: true, problemId: true } } },
        })
      : [];
    const choiceById = new Map(choices.map((c) => [c.id, c]));

    await Promise.all(answers.map(async (a) => {
      const choice = choiceById.get(a.choiceId);
      // Drop answers whose choice doesn't belong to the claimed problem —
      // a tampered payload must not be able to score one problem's choice
      // against another problem.
      if (!choice || choice.step.problemId !== a.problemId) return;
      await this.attempts.create(userId, {
        problemId: a.problemId,
        answer: '',
        durationSec: Math.max(1, Math.round(a.durationSec || 1)),
        stepIndex: choice.step.stepIndex,
        choiceId: a.choiceId,
        context: SessionContext.EXAM,
        mockExamResultId: resultId,
      });
    }));

    const graded = await this.grading.grade(userId, resultId, {});
    const saved = await this.repo.saveResult(resultId, {
      score: graded.score,
      grade: graded.grade,
      percentile: graded.percentile,
      durationMin: graded.durationMin,
    });
    return {
      ...saved,
      correctCount: graded.correctCount,
      totalProblems: graded.totalProblems,
      attemptedProblems: graded.attemptedProblems,
      marks: graded.marks,
      maxMarks: graded.maxMarks,
      wrongCount: graded.wrongCount,
      unattemptedCount: graded.unattemptedCount,
    };
  }
}
