import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConceptStepKind, NcertClass } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { Lang } from '../../common/i18n/current-lang.decorator';
import { UNIT_NAME_EN } from '../../common/i18n/content-en';
import { UNIT_NAME_HI } from '../../common/i18n/content-hi';

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
  constructor(private readonly prisma: PrismaService) {}

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
      progress: progress
        ? {
            currentStep: progress.currentStep,
            completedSteps: progress.completedSteps,
            masteredAt: progress.masteredAt,
            retrievalScore: progress.retrievalScore,
          }
        : null,
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

    return this.prisma.conceptProgress.upsert({
      where: { userId_lessonId: { userId, lessonId: lesson.id } },
      update: {},
      create: { userId, lessonId: lesson.id, currentStep: 1 },
    });
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

    // Mastery rule: every non-RETRIEVAL step is in the completed set.
    // Once true, masteredAt is sticky (don't move the timestamp back).
    const conceptStepIndexes = lesson.steps
      .filter((s) => s.kind !== 'RETRIEVAL')
      .map((s) => s.stepIndex);
    const allConceptDone = conceptStepIndexes.every((i) => completed.has(i));
    const masteredAt = progress.masteredAt ?? (allConceptDone ? new Date() : null);

    return this.prisma.conceptProgress.update({
      where: { id: progress.id },
      data: {
        completedSteps: Array.from(completed).sort((a, b) => a - b),
        currentStep: next,
        durationSec: { increment: durationSec },
        masteredAt,
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

    return this.prisma.conceptProgress.update({
      where: { id: progress.id },
      data: {
        completedSteps: merged,
        // Concept phase done → at least the last concept step is "current"; the
        // practice phase still drives Attempt rows for the retrieval / problems.
        currentStep: Math.max(progress.currentStep, conceptIndexes.length + 1),
        durationSec: { increment: Math.max(0, Math.floor(durationSec)) },
        // Sticky — preserve the earliest mastered timestamp.
        masteredAt: progress.masteredAt ?? new Date(),
      },
    });
  }

  // ---------- RETRIEVAL CHECK ----------
  async checkRetrieval(
    userId: string,
    chapterCode: string,
    stepIndex: number,
    answer: string,
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
    // 5지선다 객관식 우선 — choiceIndex 가 오면 그 정답성으로 채점.
    let passed = false;
    const choices: Array<{ choiceIndex: number; isCorrect: boolean }> = check.choices ?? [];
    const trimmed = (answer ?? '').trim();
    const idx = Number(trimmed);
    if (choices.length > 0 && Number.isInteger(idx) && idx >= 1 && idx <= choices.length) {
      const sel = choices.find((c) => c.choiceIndex === idx);
      passed = !!sel?.isCorrect;
    } else {
      // 텍스트 입력 (이전 모드) 호환 — accept 배열과 비교
      const accept: string[] = check.accept ?? [];
      passed = accept.some((a) => answersMatch(a, answer));
    }

    const progress = await this.prisma.conceptProgress.upsert({
      where: { userId_lessonId: { userId, lessonId: lesson.id } },
      update: {},
      create: { userId, lessonId: lesson.id },
    });

    // 점수: 정답이면 100, 아니면 기존 유지
    const newScore = passed ? 100 : progress.retrievalScore ?? 0;
    const updated = await this.prisma.conceptProgress.update({
      where: { id: progress.id },
      data: {
        retrievalScore: newScore,
        masteredAt: passed ? new Date() : progress.masteredAt,
        completedSteps: passed
          ? Array.from(new Set([...progress.completedSteps, stepIndex])).sort((a, b) => a - b)
          : progress.completedSteps,
      },
    });

    return {
      passed,
      score: updated.retrievalScore,
      explain: check.explain ?? null,
      hint: !passed ? check.hint ?? null : null,
    };
  }

  // ---------- PRACTICE PROBLEMS (chapter → 3-step MC problem list) ----------
  /**
   * 한 ConceptLesson 에 매핑된 Problem 목록 — 단원 학습 끝나면 3-step 객관식 풀이 대상.
   * Problem.conceptLessonId = lesson.id 로 시드/마이그레이션에서 채움.
   */
  async practiceProblems(chapterCode: string, _lang: Lang = 'en') {
    const lesson = await this.prisma.conceptLesson.findUnique({
      where: { chapterCode },
      select: { id: true, ncertClass: true },
    });
    if (!lesson) throw new NotFoundException();

    const select = {
      id: true, source: true, unitId: true, subUnitId: true,
      difficulty: true, difficultyLevel: true, body: true,
    } as const;
    const TARGET = 5; // 최소 노출 문제 수 — 직접 매핑 + same-class 누적.

    // 1) 직접 매핑된 problem 모두 (Problem.conceptLessonId = lesson.id)
    const direct = await this.prisma.problem.findMany({
      where: { conceptLessonId: lesson.id, steps: { some: { stepIndex: 1 } } },
      orderBy: { source: 'asc' },
      select,
    });
    const out: typeof direct = [...direct];
    const seen = new Set(out.map((p) => p.id));

    // 2) 부족하면 같은 NCERT class 내 다른 chapter 문제로 채움.
    if (out.length < TARGET) {
      const sameClassLessonIds = (await this.prisma.conceptLesson.findMany({
        where: { ncertClass: lesson.ncertClass, id: { not: lesson.id } },
        select: { id: true },
      })).map((l) => l.id);
      if (sameClassLessonIds.length > 0) {
        const sameClass = await this.prisma.problem.findMany({
          where: {
            conceptLessonId: { in: sameClassLessonIds },
            steps: { some: { stepIndex: 1 } },
          },
          orderBy: { source: 'asc' },
          select,
          take: TARGET * 2,
        });
        for (const p of sameClass) {
          if (out.length >= TARGET) break;
          if (!seen.has(p.id)) { out.push(p); seen.add(p.id); }
        }
      }
    }

    // 3) 그래도 부족하면 영문 매핑된 모든 problem 에서 채움 (마지막 폴백).
    if (out.length < TARGET) {
      const anyMapped = await this.prisma.problem.findMany({
        where: { conceptLessonId: { not: null }, steps: { some: { stepIndex: 1 } } },
        orderBy: { source: 'asc' },
        select,
        take: TARGET * 2,
      });
      for (const p of anyMapped) {
        if (out.length >= TARGET) break;
        if (!seen.has(p.id)) { out.push(p); seen.add(p.id); }
      }
    }

    return out;
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
