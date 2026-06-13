import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConceptStepKind, Difficulty, NcertClass } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { Lang } from '../../common/i18n/current-lang.decorator';
import { UNIT_NAME_EN } from '../../common/i18n/content-en';
import { UNIT_NAME_HI } from '../../common/i18n/content-hi';
import { LlmDraftService, DraftPayload } from '../content-ingest/llm-draft.service';
import { DeterministicCheckService } from '../../infrastructure/math/deterministic-check.service';
import { AchievementsService } from '../achievements/achievements.service';
import { PremiumAccessService } from '../billing/premium-access.service';

/**
 * 수학식 답안 비교 — 학생 표기 변이를 흡수.
 *
 *   x^2     == x²    == x*x
 *   pi      == π
 *   sqrt(2) == √2
 *   1/2     == 0.5
 *   공백·콤마·중괄호·곱셈기호 무시
 *
 * 동치 클래스로 매핑한 두 문자열이 같으면 정답.
 */
function normalise(s: string): string {
  if (s == null) return '';
  let v = String(s).trim().toLowerCase();
  // 흔한 수학 기호 정규화
  v = v.replace(/π/g, 'pi');
  v = v.replace(/[√]/g, 'sqrt');
  v = v.replace(/[×*·•]/g, '');           // 곱셈 기호 제거
  v = v.replace(/\^/g, '');                // 지수 캐럿
  v = v.replace(/[²³⁴⁵⁶⁷⁸⁹]/g, (ch) =>
    String('²³⁴⁵⁶⁷⁸⁹'.indexOf(ch) + 2),  // 위첨자 숫자 → 일반 숫자
  );
  v = v.replace(/[°˚]/g, '');              // 도(°)
  v = v.replace(/\s+/g, '');               // 공백
  v = v.replace(/[,，{}()\[\]]/g, '');     // 콤마·괄호
  return v;
}

/** 분수 / 소수 동치 검사 — 가능하면 두 표기 모두 비교 */
function maybeFraction(s: string): number | null {
  // a/b 꼴
  const m = s.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);
  if (m) {
    const b = Number(m[2]);
    if (b !== 0) return Number(m[1]) / b;
  }
  // 일반 숫자
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function answersMatch(accept: string, given: string): boolean {
  const a = normalise(accept);
  const g = normalise(given);
  if (a === g) return true;
  // 분수 ↔ 소수 동치
  const an = maybeFraction(a);
  const gn = maybeFraction(g);
  if (an !== null && gn !== null) {
    return Math.abs(an - gn) < 1e-9;
  }
  return false;
}

/**
 * 개념학습 (ConceptLesson) 서비스.
 *
 * 흐름:
 *   1. GET /concept-lessons              — 학년/단원 트리 (요약).
 *   2. GET /concept-lessons/:code        — 한 lesson 의 모든 step 상세.
 *   3. POST /concept-lessons/:code/start — ConceptProgress upsert (currentStep=1).
 *   4. POST /concept-lessons/:code/step  — 단계 완료 표시 (completedSteps push).
 *   5. POST /concept-lessons/:code/check — RETRIEVAL 응답 채점 → 통과 시 masteredAt.
 *   6. GET /concept-lessons/by-unit/:unitId — 단원의 lesson + mastered 여부 (gating).
 */
@Injectable()
export class ConceptLessonsService {
  private readonly logger = new Logger(ConceptLessonsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly llmDraft: LlmDraftService,
    private readonly deterministicCheck: DeterministicCheckService,
    private readonly achievements: AchievementsService,
    private readonly premiumAccess: PremiumAccessService,
  ) {}

  /** Free tier sees the first N of a frozen 20-problem mastery set. */
  private async applyMasterySetLimit<T extends { id: string }>(
    userId: string | undefined,
    problems: T[],
  ): Promise<T[]> {
    if (!userId || problems.length === 0) return problems;
    const effectiveIds = await this.premiumAccess.effectiveMasterySetIds(
      userId,
      problems.map((p) => p.id),
    );
    const allowed = new Set(effectiveIds);
    return problems.filter((p) => allowed.has(p.id));
  }

  // ---------- LIST ----------
  async tree(userId: string, lang: Lang, ncertClass?: NcertClass) {
    const lessons = await this.prisma.conceptLesson.findMany({
      where: ncertClass ? { ncertClass } : undefined,
      orderBy: [{ ncertClass: 'asc' }, { chapterNumber: 'asc' }],
      include: {
        unit: { select: { id: true, name: true } },
        progress: { where: { userId } },
      },
    });
    return lessons.map((l) => this.shapeSummary(l, lang));
  }

  // ---------- DETAIL ----------
  async detail(userId: string, chapterCode: string, lang: Lang) {
    const lesson = await this.prisma.conceptLesson.findUnique({
      where: { chapterCode },
      include: {
        steps: { orderBy: { stepIndex: 'asc' } },
        unit: { select: { id: true, name: true } },
        progress: { where: { userId } },
      },
    });
    if (!lesson) throw new NotFoundException(`ConceptLesson ${chapterCode} not found`);

    const progress = lesson.progress[0] ?? null;
    // Count *any* attempt this user has made on a problem mapped to this
    // chapter. Drives the ConceptLessonScreen "first-time entry vs resume"
    // gate: 0 attempts → always show the concept walkthrough first (even if
    // conceptWalkthroughAt is already stamped from a previous read-through);
    // ≥1 → resume in practice phase. User-report 2026-05-23: re-entry
    // from Home progress card was skipping concept walkthrough when the
    // user had read it but not yet answered a single problem.
    const practiceAttempts = await this.prisma.attempt.count({
      where: {
        userId,
        problem: { conceptLessonId: lesson.id },
      },
    });
    return {
      ...this.shapeSummary(lesson, lang),
      steps: lesson.steps.map((s) => {
        // lang 별 title/body 우선순위 (hi → hi → en → ko fallback)
        const sTitle =
          lang === 'hi' ? ((s as any).titleHi ?? s.titleEn) :
          lang === 'en' ? s.titleEn :
          s.titleKo;
        const sBody =
          lang === 'hi' ? ((s as any).bodyHi ?? s.bodyEn) :
          lang === 'en' ? s.bodyEn :
          s.bodyKo;
        // workedSteps · misconception JSON 에서 lang 에 맞는 필드만 추려서 노출 (다른 언어 누출 차단)
        const filteredWorkedSteps = Array.isArray(s.workedSteps)
          ? (s.workedSteps as any[]).map((w) => ({
              math: w.math,
              narration:
                lang === 'hi' ? (w.narrationHi ?? w.narrationEn) :
                lang === 'en' ? w.narrationEn :
                w.narrationKo,
              fade: w.fade === true,
            }))
          : null;
        const filteredMisc = s.misconception
          ? {
              wrong:
                lang === 'hi' ? ((s.misconception as any).wrongHi ?? (s.misconception as any).wrongEn) :
                lang === 'en' ? (s.misconception as any).wrongEn :
                (s.misconception as any).wrongKo,
              why:
                lang === 'hi' ? ((s.misconception as any).whyHi ?? (s.misconception as any).whyEn) :
                lang === 'en' ? (s.misconception as any).whyEn :
                (s.misconception as any).whyKo,
              correct:
                lang === 'hi' ? ((s.misconception as any).correctHi ?? (s.misconception as any).correctEn) :
                lang === 'en' ? (s.misconception as any).correctEn :
                (s.misconception as any).correctKo,
            }
          : null;
        return {
        id: s.id,
        stepIndex: s.stepIndex,
        kind: s.kind,
        title: sTitle,
        body: sBody,
        visualType: s.visualType,
        visualUrl: s.visualUrl,
        visualData: (s as any).visualData ?? null,
        misconception: filteredMisc,
        workedSteps: filteredWorkedSteps,
        // RETRIEVAL 응답 비교용 정답은 클라이언트에 노출하지 않는다 (check 엔드포인트에서만 비교).
        retrievalCheck: s.retrievalCheck
          ? this.publicRetrieval(s.retrievalCheck as any, lang)
          : null,
        reflectPrompts: s.reflectPrompts,
        };
      }),
      // Always returned (even when no ConceptProgress row exists yet) so the
      // frontend can read `progress.practiceAttempts` without null-guarding.
      // First-time entry: progress = { practiceAttempts: 0, rest null }.
      progress: {
        currentStep: progress?.currentStep ?? 0,
        completedSteps: progress?.completedSteps ?? [],
        masteredAt: progress?.masteredAt ?? null,
        // Kept for backwards-compat / analytics. The phase-resume gate is
        // driven by practiceAttempts below, not by this timestamp.
        conceptWalkthroughAt: progress?.conceptWalkthroughAt ?? null,
        retrievalScore: progress?.retrievalScore ?? null,
        practiceAttempts,
      },
    };
  }

  // ---------- START ----------
  async start(userId: string, chapterCode: string) {
    const lesson = await this.prisma.conceptLesson.findUnique({
      where: { chapterCode },
      select: { id: true, prerequisiteCodes: true },
    });
    if (!lesson) throw new NotFoundException(`ConceptLesson ${chapterCode} not found`);

    // 선수 학습 chapterCode 의 ConceptProgress.masteredAt 이 있는지 확인.
    if (lesson.prerequisiteCodes.length > 0) {
      const prereqs = await this.prisma.conceptLesson.findMany({
        where: { chapterCode: { in: lesson.prerequisiteCodes } },
        select: { id: true, chapterCode: true },
      });
      const masteredIds = await this.prisma.conceptProgress.findMany({
        where: {
          userId,
          lessonId: { in: prereqs.map((p) => p.id) },
          masteredAt: { not: null },
        },
        select: { lessonId: true },
      });
      const masteredSet = new Set(masteredIds.map((m) => m.lessonId));
      const blockers = prereqs.filter((p) => !masteredSet.has(p.id));
      if (blockers.length > 0) {
        throw new BadRequestException({
          message: 'Prerequisites not met',
          missing: blockers.map((b) => b.chapterCode),
        });
      }
    }

    const progress = await this.prisma.conceptProgress.upsert({
      where: { userId_lessonId: { userId, lessonId: lesson.id } },
      update: {},
      create: { userId, lessonId: lesson.id, currentStep: 1 },
    });
    void this.achievements.tryAwardFirstConceptStep(userId, { chapterCode }).catch(() => {});
    return progress;
  }

  // ---------- STEP COMPLETE ----------
  async completeStep(
    userId: string,
    chapterCode: string,
    stepIndex: number,
    durationSec = 0,
  ) {
    const lesson = await this.prisma.conceptLesson.findUnique({
      where: { chapterCode },
      // Pull `kind` so we can derive how many non-RETRIEVAL steps exist —
      // ConceptLessonScreen's concept phase only iterates those, so finishing
      // them all is the canonical "mastery" signal. RETRIEVAL passes via
      // checkRetrieval also feed masteredAt, but neither path is required
      // for the other.
      include: { steps: { select: { stepIndex: true, kind: true } } },
    });
    if (!lesson) throw new NotFoundException();
    const total = lesson.steps.length;
    if (stepIndex < 1 || stepIndex > total) {
      throw new BadRequestException('stepIndex out of range');
    }

    const progress = await this.prisma.conceptProgress.upsert({
      where: { userId_lessonId: { userId, lessonId: lesson.id } },
      update: {},
      create: { userId, lessonId: lesson.id },
    });
    const completed = new Set(progress.completedSteps);
    completed.add(stepIndex);
    const next = Math.min(stepIndex + 1, total);

    // Concept-walkthrough rule: every non-RETRIEVAL step is in the completed
    // set. This now stamps conceptWalkthroughAt — distinct from masteredAt,
    // which is the Study-unlock signal driven by 20-problem ANSWER-step
    // correctness in AttemptsService.create (user-spec 2026-05-23).
    const conceptStepIndexes = lesson.steps
      .filter((s) => s.kind !== 'RETRIEVAL')
      .map((s) => s.stepIndex);
    const allConceptDone = conceptStepIndexes.every((i) => completed.has(i));
    const conceptWalkthroughAt =
      progress.conceptWalkthroughAt ?? (allConceptDone ? new Date() : null);

    return this.prisma.conceptProgress.update({
      where: { id: progress.id },
      data: {
        completedSteps: Array.from(completed).sort((a, b) => a - b),
        currentStep: next,
        durationSec: { increment: durationSec },
        conceptWalkthroughAt,
      },
    });
  }

  // ---------- FINALIZE CONCEPT PHASE ----------
  /**
   * Atomic "concept phase complete" — called by ConceptLessonScreen at the end
   * of the concept walkthrough (and again on phase='done' for safety).
   *
   * Replaces the legacy pattern of firing N concurrent completeStep calls,
   * which raced on the SELECT-then-UPDATE of ConceptProgress.completedSteps
   * and could leave allConceptDone=false even when every step was tapped.
   *
   * Marks every non-RETRIEVAL stepIndex as completed in a single update and
   * stamps masteredAt=now (sticky — never moves backward if already set).
   */
  async finalizeConceptPhase(userId: string, chapterCode: string, durationSec = 0) {
    const lesson = await this.prisma.conceptLesson.findUnique({
      where: { chapterCode },
      include: { steps: { select: { stepIndex: true, kind: true } } },
    });
    if (!lesson) throw new NotFoundException(`ConceptLesson ${chapterCode} not found`);

    const conceptIndexes = lesson.steps
      .filter((s) => s.kind !== ConceptStepKind.RETRIEVAL)
      .map((s) => s.stepIndex);

    const progress = await this.prisma.conceptProgress.upsert({
      where: { userId_lessonId: { userId, lessonId: lesson.id } },
      update: {},
      create: { userId, lessonId: lesson.id, currentStep: 1 },
    });

    const merged = Array.from(new Set([...progress.completedSteps, ...conceptIndexes]))
      .sort((a, b) => a - b);

    const updated = await this.prisma.conceptProgress.update({
      where: { id: progress.id },
      data: {
        completedSteps: merged,
        // Concept phase done → at least the last concept step is "current"; the
        // practice phase still drives Attempt rows for the retrieval / problems.
        currentStep: Math.max(progress.currentStep, conceptIndexes.length + 1),
        durationSec: { increment: Math.max(0, Math.floor(durationSec)) },
        // Concept-walkthrough complete signal — separate from masteredAt
        // (which is set only when 20-problem Mastery is finished by
        // AttemptsService.create). Sticky.
        conceptWalkthroughAt: progress.conceptWalkthroughAt ?? new Date(),
      },
    });
    void this.achievements.tryAwardFirstConceptStep(userId, { chapterCode }).catch(() => {});
    return updated;
  }

  // ---------- RETRIEVAL CHECK ----------
  async checkRetrieval(
    userId: string,
    chapterCode: string,
    stepIndex: number,
    answer: string,
    lang: Lang = 'en',
  ) {
    const lesson = await this.prisma.conceptLesson.findUnique({
      where: { chapterCode },
      include: { steps: true },
    });
    if (!lesson) throw new NotFoundException();
    const step = lesson.steps.find((s) => s.stepIndex === stepIndex);
    if (!step || step.kind !== ConceptStepKind.RETRIEVAL) {
      throw new BadRequestException('Step is not a RETRIEVAL step');
    }

    const check = (step.retrievalCheck as any) ?? {};
    // MCQ first — when choiceIndex is provided, grade by ProblemChoice.isCorrect.
    let passed = false;
    const choices: Array<{ choiceIndex: number; isCorrect: boolean }> = check.choices ?? [];
    const trimmed = (answer ?? '').trim();
    const idx = Number(trimmed);
    if (choices.length > 0 && Number.isInteger(idx) && idx >= 1 && idx <= choices.length) {
      const sel = choices.find((c) => c.choiceIndex === idx);
      passed = !!sel?.isCorrect;
    } else {
      // Legacy text answer mode — compare against the accept array.
      const accept: string[] = check.accept ?? [];
      passed = accept.some((a) => answersMatch(a, answer));
    }

    // Ensure a progress row exists for this user × lesson.
    await this.prisma.conceptProgress.upsert({
      where: { userId_lessonId: { userId, lessonId: lesson.id } },
      update: {},
      create: { userId, lessonId: lesson.id },
    });

    // Race-free append: Prisma's atomic `push` for Int[] survives concurrent
    // submits. The earlier fetch-then-write pattern could lose a stepIndex
    // when two tabs submitted RETRIEVAL answers at the same time.
    if (passed) {
      await this.prisma.conceptProgress.update({
        where: { userId_lessonId: { userId, lessonId: lesson.id } },
        data: { completedSteps: { push: stepIndex } },
      });
    }

    // Aggregate retrievalScore from how many RETRIEVAL steps the user has
    // cleared in this lesson — earlier code locked retrievalScore at 100 the
    // moment ONE retrieval step passed, so a 5-step retrieval that the user
    // half-completed still read as fully mastered.
    const refreshed = await this.prisma.conceptProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId: lesson.id } },
    });
    const retrievalIndexes = lesson.steps
      .filter((s) => s.kind === ConceptStepKind.RETRIEVAL)
      .map((s) => s.stepIndex);
    const completedSet = new Set(refreshed?.completedSteps ?? []);
    const passedRetrievals = retrievalIndexes.filter((i) => completedSet.has(i)).length;
    const newScore = retrievalIndexes.length > 0
      ? Math.round((passedRetrievals / retrievalIndexes.length) * 100)
      : 0;

    // masteredAt is NOT stamped here — chapter mastery unlocks only after the
    // full 20-problem practice set, not on retrieval-check completion.
    const updated = await this.prisma.conceptProgress.update({
      where: { userId_lessonId: { userId, lessonId: lesson.id } },
      data: { retrievalScore: newScore },
    });

    // explain/hint are stored as multilingual objects ({ko,en,hi}) like the
    // rest of retrievalCheck — flatten to the request language. explain ships
    // only on pass: it walks through the solution, so returning it on a wrong
    // answer would leak the answer to a devtools reader mid-gate.
    const localize = (v: any): string | null => {
      if (v == null) return null;
      if (typeof v === 'string') return v;
      return lang === 'hi' ? (v.hi ?? v.en ?? null)
        : lang === 'en' ? (v.en ?? null)
        : (v.ko ?? v.en ?? null);
    };
    return {
      passed,
      score: updated.retrievalScore,
      explain: passed ? localize(check.explain) : null,
      hint: !passed ? localize(check.hint) : null,
    };
  }

  // ---------- PRACTICE PROBLEMS (chapter → 3-step MC problem list) ----------
  /**
   * Mastery practice — always returns exactly 20 multi-step problems for
   * this chapter. Multi-step (ProblemStep length === 3, CONCEPT/PROCESS/
   * ANSWER) is the Mastery-only format; single-step problems live in the
   * Study tab pool and are filtered out here.
   *
   * Behaviour:
   *   1. Pull all multi-step problems directly mapped to this chapter
   *      (Problem.conceptLessonId = lesson.id).
   *   2. If < 20, LLM-generate the shortfall in multi-step mode and
   *      persist as new Problem rows (conceptLessonId set). Future users
   *      hitting the same chapter draw from the enriched pool.
   *   3. If > 20, return the 20 most pedagogically balanced — see the
   *      pickBalanced() helper (difficulty spread + concept dedupe).
   *   4. unitId is required to persist; chapters whose ConceptLesson lost
   *      their unitId pointer skip top-up rather than crash.
   */
  private static readonly MASTERY_TARGET = 20;

  /**
   * Returns the canonical 20-problem Mastery set for a chapter.
   *
   * Every user sees the same 20 Problem IDs in the same order. This is a
   * deliberate inversion of the "random per call" approach we briefly used
   * 2026-05-22 — cohort statistics, percentile, and concept-weakness
   * diagnostics are only meaningful when the comparison baseline is shared.
   *
   * Flow:
   *   1. If lesson.masterySetProblemIds is already filled (20 IDs frozen),
   *      fetch + return those Problems in the recorded order.
   *   2. Otherwise:
   *      a) Pull every multi-step problem in the pool.
   *      b) If pool < 20, top-up with LLM-generated multi-step problems.
   *      c) Pick a diverse 20 (difficulty buckets + concept coverage).
   *      d) Freeze those IDs on the ConceptLesson row.
   *      e) Return them.
   *
   * Re-curation (e.g. after content review) is an explicit admin tool
   * — never re-randomised silently, because that would break every running
   * student's progress measurement.
   */
  async practiceProblems(chapterCode: string, _lang: Lang = 'en', userId?: string) {
    const lesson = await this.prisma.conceptLesson.findUnique({
      where: { chapterCode },
      select: {
        id: true, ncertClass: true, chapterNumber: true, titleEn: true,
        unitId: true, subUnitId: true,
        masterySetProblemIds: true, masterySetCuratedAt: true,
      },
    });
    if (!lesson) throw new NotFoundException();

    const target = ConceptLessonsService.MASTERY_TARGET;

    // Path 1 — canonical set already frozen. Hydrate + return in order.
    if (lesson.masterySetProblemIds.length === target) {
      const problems = await this.prisma.problem.findMany({
        where: {
          id: { in: lesson.masterySetProblemIds },
          // Sprint 4: active-pool quality filter. If a previously-frozen row
          // was later marked EXCLUDED (Tier 2 LLM grading or student report
          // via Sprint 3 A13) or chapter-mismatched, it drops out here —
          // the ordered.length check below catches the shortfall and falls
          // through to Path 2 re-curation.
          conceptMismatch: { not: true },
          OR: [
            { qualityStatus: null },
            { qualityStatus: { in: ['APPROVED', 'USABLE'] } },
          ],
        },
        select: {
          id: true, source: true, unitId: true, subUnitId: true,
          difficulty: true, difficultyLevel: true, body: true,
        },
      });
      const byId = new Map(problems.map((p) => [p.id, p]));
      const ordered = lesson.masterySetProblemIds
        .map((id) => byId.get(id))
        .filter((p): p is NonNullable<typeof p> => !!p);
      // If even one frozen Problem has been deleted from the pool we fall
      // through to re-curation — a 19-problem set defeats the purpose.
      if (ordered.length === target) {
        const served = userId
          ? await this.substituteVariantsForRetake(userId, lesson.id, ordered)
          : ordered;
        return this.applyMasterySetLimit(userId, served);
      }
    }

    // Path 2 — no frozen set yet (or the frozen set lost a row to deletion).
    // Build the pool, top up via LLM if short, pick a diverse 20, freeze.
    const pool = await this.prisma.problem.findMany({
      where: {
        conceptLessonId: lesson.id,
        steps: { some: { stepIndex: 1 } },
        // The Mastery-vs-Study split: Mastery needs steps 2 and 3 present
        // too. Without these the problem is the single-step Study format
        // and must not surface in the multi-step walkthrough.
        AND: [
          { steps: { some: { stepIndex: 2 } } },
          { steps: { some: { stepIndex: 3 } } },
        ],
        // Sprint 4: never freeze an EXCLUDED / chapter-mismatched row into a
        // canonical set.
        conceptMismatch: { not: true },
        OR: [
          { qualityStatus: null },
          { qualityStatus: { in: ['APPROVED', 'USABLE'] } },
        ],
      },
      orderBy: { source: 'asc' },
      select: {
        id: true, source: true, unitId: true, subUnitId: true,
        difficulty: true, difficultyLevel: true, body: true,
      },
    });

    let working = pool;
    // 2026-05-22 user decision: when a chapter's multi-step pool is short of
    // 20, do NOT auto-generate the gap with LLM. Surface the shortfall so
    // problems can be curated by hand (NCERT exercises / exemplar / etc.).
    // `LLM_POOL_TOPUP=on` re-enables the auto top-up for one-off use.
    if (working.length < target && process.env.LLM_POOL_TOPUP === 'on') {
      const shortfall = target - working.length;
      const generated = await this.generateMultiStepProblems(lesson, shortfall, userId);
      working = [...working, ...generated];
    }

    const picked = this.pickDiverse(working, target);

    // Freeze. We tolerate failure here (logger.warn handled by the global
    // exception filter) — students still get a valid 20-problem set this
    // call, the next call will retry the freeze.
    if (picked.length === target) {
      await this.prisma.conceptLesson.update({
        where: { id: lesson.id },
        data: {
          masterySetProblemIds: picked.map((p) => p.id),
          masterySetCuratedAt: new Date(),
        },
      }).catch(() => undefined);
    }

    return this.applyMasterySetLimit(userId, picked);
  }

  /**
   * Retake variant re-serve (2026-06-11 audit, verdict 5).
   *
   * Once a student has submitted an ANSWER-step attempt on every canonical
   * problem, replaying the identical 20 measures answer memory, not skill.
   * For retakes each slot is swapped for an unattempted same-difficulty
   * problem from the chapter's multi-step pool. Pool-first only — no
   * on-demand LLM here; pool enrichment stays on the existing curated /
   * prewarm / top-up paths.
   *
   * Invariants preserved:
   *   - The frozen masterySetProblemIds row is never touched, so cohort
   *     statistics and admin re-curation keep their shared baseline.
   *   - Slots keep their canonical position and difficulty, preserving the
   *     set's difficulty arc. No same-difficulty alternative → canonical
   *     problem is kept (memorisation risk accepted over arc distortion).
   *   - The mastery unlock gate (ANSWER-step on all 20 canonical) has
   *     already fired by definition of retake, so substitution can never
   *     strand a first run.
   *   - 2nd+ retakes keep rotating: previously served variants are now
   *     attempted and excluded, until the pool runs dry.
   */
  private async substituteVariantsForRetake(
    userId: string,
    lessonId: string,
    canonical: Array<{ id: string; source: string; unitId: string | null; subUnitId: string | null; difficulty: Difficulty; difficultyLevel: number | null; body: string }>,
  ) {
    const attempted = await this.prisma.attempt.findMany({
      where: {
        userId,
        problemId: { in: canonical.map((p) => p.id) },
        stepIndex: 3,
        context: { in: ['STUDY' as const, 'PRACTICE' as const] },
      },
      distinct: ['problemId'],
      select: { problemId: true },
    });
    // First run still in progress — serve the canonical set untouched.
    if (attempted.length < canonical.length) return canonical;

    const alternates = await this.prisma.problem.findMany({
      where: {
        conceptLessonId: lessonId,
        id: { notIn: canonical.map((p) => p.id) },
        steps: { some: { stepIndex: 1 } },
        AND: [
          { steps: { some: { stepIndex: 2 } } },
          { steps: { some: { stepIndex: 3 } } },
        ],
        conceptMismatch: { not: true },
        OR: [
          { qualityStatus: null },
          { qualityStatus: { in: ['APPROVED', 'USABLE'] } },
        ],
      },
      orderBy: { source: 'asc' },
      select: {
        id: true, source: true, unitId: true, subUnitId: true,
        difficulty: true, difficultyLevel: true, body: true,
      },
    });
    if (alternates.length === 0) return canonical;

    const altAttempted = await this.prisma.attempt.findMany({
      where: {
        userId,
        problemId: { in: alternates.map((p) => p.id) },
        stepIndex: 3,
        context: { in: ['STUDY' as const, 'PRACTICE' as const] },
      },
      distinct: ['problemId'],
      select: { problemId: true },
    });
    const used = new Set(altAttempted.map((a) => a.problemId));
    const remaining = alternates.filter((p) => !used.has(p.id));

    return canonical.map((slot) => {
      const idx = remaining.findIndex((p) => p.difficulty === slot.difficulty);
      if (idx === -1) return slot;
      return remaining.splice(idx, 1)[0];
    });
  }

  /**
   * Pick `target` problems with deliberate variety so the resulting 20
   * cover a fair span of difficulty + concepts. Used once per chapter
   * (then frozen on the ConceptLesson row) so every student sees the
   * same diagnostic set.
   *
   * Algorithm:
   *   1. Bucket by difficulty: MIDDLE / UPPER_MIDDLE / SEMI_KILLER / KILLER.
   *      Quota = target / 4 per bucket (5 each for the default target of 20).
   *   2. Within each bucket, sort by `source` so picks are deterministic
   *      across runs (same chapter, same pool → same 20 IDs).
   *   3. If a bucket is short, the gap is drawn from neighbouring buckets
   *      in increasing-difficulty order so the easiest available problems
   *      backfill first.
   */
  private pickDiverse(
    pool: Array<{ id: string; source: string; unitId: string | null; subUnitId: string | null; difficulty: Difficulty; difficultyLevel: number | null; body: string }>,
    target: number,
  ) {
    const buckets = new Map<Difficulty, typeof pool>();
    for (const p of pool) {
      const arr = buckets.get(p.difficulty) ?? [];
      arr.push(p);
      buckets.set(p.difficulty, arr);
    }
    // Deterministic order within each bucket.
    for (const arr of buckets.values()) {
      arr.sort((a, b) => a.source.localeCompare(b.source));
    }

    const order: Difficulty[] = [Difficulty.MIDDLE, Difficulty.UPPER_MIDDLE, Difficulty.SEMI_KILLER, Difficulty.KILLER];
    const quota = Math.floor(target / order.length);

    const picked: typeof pool = [];
    // First pass — fill the quota for each bucket.
    for (const d of order) {
      const arr = buckets.get(d) ?? [];
      picked.push(...arr.slice(0, quota));
    }
    // Second pass — backfill the remainder from whatever buckets have stock,
    // walking buckets in difficulty order so easier problems land first.
    const remaining = target - picked.length;
    if (remaining > 0) {
      const leftovers: typeof pool = [];
      for (const d of order) {
        const arr = buckets.get(d) ?? [];
        leftovers.push(...arr.slice(quota));
      }
      picked.push(...leftovers.slice(0, remaining));
    }
    return picked;
  }

  /**
   * Admin-callable hook used by scripts/prewarm-mastery.ts to seed a
   * chapter's multi-step pool offline so the next student avoids the
   * 30-60s wait. Returns the count actually persisted (≤ requested).
   */
  async prewarmChapter(chapterCode: string, count: number): Promise<number> {
    const lesson = await this.prisma.conceptLesson.findUnique({
      where: { chapterCode },
      select: {
        id: true, ncertClass: true, chapterNumber: true, titleEn: true,
        unitId: true, subUnitId: true,
      },
    });
    if (!lesson) throw new NotFoundException(`Chapter not found: ${chapterCode}`);
    const generated = await this.generateMultiStepProblems(lesson, count);
    return generated.length;
  }

  /**
   * LLM-generate `count` multi-step problems for this chapter and persist
   * them as Problem rows. Mirrors mock-exams.generateSingleStepProblems
   * but uses mode='multi-step' so the LLM emits the CONCEPT/PROCESS/
   * ANSWER triple instead of a single ANSWER step.
   */
  private async generateMultiStepProblems(
    lesson: {
      id: string;
      ncertClass: NcertClass;
      chapterNumber: number;
      titleEn: string;
      unitId: string | null;
      subUnitId: string | null;
    },
    count: number,
    userId?: string,
  ) {
    if (!lesson.unitId) {
      this.logger.warn(`Skipping Mastery LLM top-up: chapter ${lesson.id} has no unitId`);
      return [];
    }
    const unitId = lesson.unitId;
    const classLabel = lesson.ncertClass.replace('CLASS_', 'Class ');
    const attribution = `AI generated for Matheo · ${classLabel} Chapter ${lesson.chapterNumber} (${lesson.titleEn}) — derived from NCERT syllabus`;
    const chapterRef = `${classLabel} · Chapter ${lesson.chapterNumber} · ${lesson.titleEn}`;
    // Per-variant difficulty quota + random seed beat the LLM's habit of
    // collapsing same-prompt parallel calls onto the same canonical
    // problem. The seed string is meaningless to the model semantically
    // but reliably forces it to pick different numeric values and
    // phrasing for each slot.
    const difficulties = ['MIDDLE', 'UPPER_MIDDLE', 'SEMI_KILLER', 'KILLER'] as const;
    const variants = Array.from({ length: count }, (_, i) => {
      const targetDiff = difficulties[i % difficulties.length];
      const seed = Math.random().toString(36).slice(2, 8);
      return (
        `[seed=${seed}] Generate a fresh 3-step (CONCEPT / PROCESS / ANSWER) variation for NCERT ${chapterRef}. ` +
        `Aim for difficulty=${targetDiff}. Variation #${i + 1} (out of ${count}). ` +
        `Pick numeric values that have not appeared in any earlier variation in this batch — change every constant. ` +
        `Make it pedagogically distinct.`
      );
    });

    const CHUNK = 5;
    const results: Array<{ id: string; source: string; unitId: string; subUnitId: string | null; difficulty: Difficulty; difficultyLevel: number; body: string }> = [];
    for (let i = 0; i < variants.length; i += CHUNK) {
      const slice = variants.slice(i, i + CHUNK);
      const drafts = await Promise.all(
        slice.map((text) =>
          this.llmDraft.generate(
            {
              ncertClass: lesson.ncertClass,
              chapterNumber: lesson.chapterNumber,
              chapterTitleHint: lesson.titleEn,
              text,
            },
            { mode: 'multi-step', userId },
          ).catch((err) => {
            this.logger.warn(`Mastery LLM gen failed: ${(err as Error).message}`);
            return null;
          }),
        ),
      );
      for (const draft of drafts) {
        if (!draft) continue;
        try {
          const persisted = await this.persistMultiStepProblem(
            { id: lesson.id, unitId, subUnitId: lesson.subUnitId },
            draft.payload,
            attribution,
          );
          results.push(persisted);
        } catch (err) {
          this.logger.warn(`Persist Mastery problem failed: ${(err as Error).message}`);
        }
      }
    }
    return results;
  }

  private async persistMultiStepProblem(
    lesson: { id: string; unitId: string; subUnitId: string | null },
    payload: DraftPayload,
    attribution: string,
  ) {
    const answerStep = payload.steps.find((s) => s.stepType === 'ANSWER') ?? payload.steps[payload.steps.length - 1];
    const correctChoice = answerStep?.choices.find((c) => c.isCorrect);

    // QUALITY gate — same deterministic verification mock-exams.persist
    // applies to single-step LLM problems. Multi-step adds a wrinkle: only
    // the ANSWER step's correctChoice is the "final" answer; CONCEPT /
    // PROCESS choices are reasoning markers that the closed-form solvers
    // can't validate. We check ANSWER only.
    const verdict = correctChoice
      ? this.deterministicCheck.check(payload.problemBody, correctChoice.text)
      : null;
    if (verdict && verdict.isStudentCorrect === false) {
      throw new Error(
        `Deterministic verdict mismatch (${verdict.checker}): LLM ANSWER="${correctChoice?.text}" vs solver="${verdict.answer}"`,
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
                ...(c.distractorType ? { distractorType: c.distractorType as any } : {}),
                ...(c.rationale ? { rationale: c.rationale } : {}),
              })),
            },
          })),
        },
      },
      select: {
        id: true, source: true, unitId: true, subUnitId: true,
        difficulty: true, difficultyLevel: true, body: true,
      },
    });
    return problem;
  }

  // ---------- UNIT GATING ----------
  /**
   * 한 Unit 의 모든 ConceptLesson 과 사용자 mastery 상태를 반환.
   * 프론트는 mastered 가 false 인 lesson 이 있으면 문제풀이 unlock 을 막는다.
   */
  async lessonsForUnit(userId: string, unitId: string, lang: Lang) {
    const lessons = await this.prisma.conceptLesson.findMany({
      where: { unitId },
      orderBy: [{ ncertClass: 'asc' }, { chapterNumber: 'asc' }],
      include: { progress: { where: { userId } } },
    });
    return lessons.map((l) => this.shapeSummary(l, lang));
  }

  // ---------- helpers ----------
  private shapeSummary(l: any, lang: Lang) {
    const progress = (l.progress ?? [])[0] ?? null;
    // lang 별 우선순위: hi → hi 컬럼 (없으면 en fallback), en → en, ko → ko.
    const title =
      lang === 'hi' ? (l.titleHi ?? l.titleEn) :
      lang === 'en' ? l.titleEn :
      l.titleKo;
    const bigIdea =
      lang === 'hi' ? (l.bigIdeaHi ?? l.bigIdeaEn) :
      lang === 'en' ? l.bigIdeaEn :
      l.bigIdeaKo;
    return {
      id: l.id,
      chapterCode: l.chapterCode,
      ncertClass: l.ncertClass,
      chapterNumber: l.chapterNumber,
      title,
      bigIdea,
      estimatedMin: l.estimatedMin,
      cognitiveLoad: l.cognitiveLoad,
      prerequisiteCodes: l.prerequisiteCodes,
      // Unit.name 은 DB 상 한국어로 저장됨. lang 에 따라 EN/HI 변환.
      unit: l.unit
        ? {
            id: l.unit.id,
            name: lang === 'hi'
              ? (UNIT_NAME_HI[l.unit.name] ?? UNIT_NAME_EN[l.unit.name] ?? l.unit.name)
              : lang === 'en'
                ? (UNIT_NAME_EN[l.unit.name] ?? l.unit.name)
                : l.unit.name,
          }
        : null,
      mastered: !!progress?.masteredAt,
      currentStep: progress?.currentStep ?? null,
      retrievalScore: progress?.retrievalScore ?? null,
    };
  }

  /** RETRIEVAL 응답에서 정답을 제거한 공개 안전한 페이로드. */
  // (helper: see answersMatch below)
  private publicRetrieval(check: any, lang: Lang) {
    const promptKo = check?.prompt?.ko ?? '';
    const promptEn = check?.prompt?.en ?? promptKo;
    const promptHi = check?.prompt?.hi ?? promptEn;
    const prompt = lang === 'hi' ? promptHi : lang === 'en' ? promptEn : promptKo;
    const hint = check?.hint
      ? lang === 'hi' ? (check.hint.hi ?? check.hint.en)
        : lang === 'en' ? check.hint.en
        : check.hint.ko
      : null;
    // 5지선다 보기 — isCorrect/rationale 은 비공개, text 만 lang 분기 노출.
    const choices = Array.isArray(check?.choices)
      ? check.choices.map((c: any) => ({
          choiceIndex: c.choiceIndex,
          text:
            lang === 'hi' ? (c.textHi ?? c.textEn ?? c.text ?? '') :
            lang === 'en' ? (c.textEn ?? c.text ?? '') :
            (c.textKo ?? c.text ?? ''),
        }))
      : [];
    return {
      prompt,
      hint,
      choices,
    };
  }
}
