import { Injectable, NotFoundException } from '@nestjs/common';
import { KoreanGrade, KoreanSubject } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

/**
 * Korean-curriculum (2022 개정) parallel to ConceptLessonsService. Country=KR
 * users hit this module; country=IN continues to use the NCERT-driven
 * ConceptLessonsService. Phase 1 ships list + by-grade + detail (metadata
 * only — KoreanConceptStep content lands in Phase 2 via LLM authoring).
 */
@Injectable()
export class KoreanConceptLessonsService {
  constructor(private readonly prisma: PrismaService) {}

  /** List all Korean chapters, optionally filtered by grade + subject.
   *  Includes per-user mastered flag (KoreanConceptProgress.masteredAt
   *  presence) so the Study tab can show only chapters the user has cleared
   *  Mastery on. userId optional — when omitted (anonymous / tests) every
   *  chapter returns mastered=false. */
  async tree(args: { koreanGrade?: KoreanGrade; koreanSubject?: KoreanSubject; userId?: string }) {
    const lessons = await this.prisma.koreanConceptLesson.findMany({
      where: {
        ...(args.koreanGrade ? { koreanGrade: args.koreanGrade } : {}),
        ...(args.koreanSubject ? { koreanSubject: args.koreanSubject } : {}),
      },
      orderBy: [
        { koreanGrade: 'asc' },
        { koreanSubject: 'asc' },
        { chapterNumber: 'asc' },
      ],
    });
    // Per-user mastered set — single round-trip via lesson ids.
    let masteredIds = new Set<string>();
    if (args.userId && lessons.length > 0) {
      const progress = await this.prisma.koreanConceptProgress.findMany({
        where: {
          userId: args.userId,
          lessonId: { in: lessons.map((l) => l.id) },
          masteredAt: { not: null },
        },
        select: { lessonId: true },
      });
      masteredIds = new Set(progress.map((p) => p.lessonId));
    }
    return lessons.map((l) => ({
      ...this.shapeSummary(l),
      mastered: masteredIds.has(l.id),
    }));
  }

  /** Detail by chapterCode — includes prerequisites + step list + per-user
   *  progress signals (nextProblemId, mastered).
   *
   *  nextProblemId: first problem in masterySetProblemIds the user has NOT
   *  submitted an ANSWER-step attempt on. Used by frontend to deep-link
   *  "연습 문제 풀기" into the in-progress problem instead of always Q1.
   *  null when the chapter is fully attempted (= masterySet exhausted) or
   *  when masterySet isn't 20-frozen yet.
   *
   *  mastered: KoreanConceptProgress.masteredAt presence — Study tab unlock.
   */
  async detail(chapterCode: string, userId: string) {
    const lesson = await this.prisma.koreanConceptLesson.findUnique({
      where: { chapterCode },
      include: { steps: { orderBy: { stepIndex: 'asc' } } },
    });
    if (!lesson) throw new NotFoundException(`KoreanConceptLesson ${chapterCode} not found`);

    // Per-user signals — both depend on userId.
    let nextProblemId: string | null = null;
    let mastered = false;
    if (lesson.masterySetProblemIds.length === 20) {
      const attempts = await this.prisma.attempt.findMany({
        where: {
          userId,
          problemId: { in: lesson.masterySetProblemIds },
          stepIndex: 3,
          context: { in: ['STUDY' as const, 'PRACTICE' as const] },
        },
        distinct: ['problemId'],
        select: { problemId: true },
      });
      const attempted = new Set(attempts.map((a) => a.problemId));
      // Preserve seed order — first unattempted in masterySetProblemIds.
      nextProblemId = lesson.masterySetProblemIds.find((id) => !attempted.has(id)) ?? null;
    }
    const progress = await this.prisma.koreanConceptProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId: lesson.id } },
      select: { masteredAt: true },
    });
    mastered = !!progress?.masteredAt;

    return {
      ...this.shapeSummary(lesson),
      nextProblemId,
      mastered,
      steps: lesson.steps.map((s) => ({
        id: s.id,
        stepIndex: s.stepIndex,
        kind: s.kind,
        title: s.titleKo,
        body: s.bodyKo,
        visualType: s.visualType,
        visualUrl: s.visualUrl,
        visualData: s.visualData,
        misconception: s.misconception,
        workedSteps: s.workedSteps,
        retrievalCheck: s.retrievalCheck,
        reflectPrompts: s.reflectPrompts,
      })),
    };
  }

  /** Practice problems linked to this Korean chapter (Problem rows where
   *  koreanConceptLessonId = lesson.id). Mirrors the NCERT side multi-step
   *  shape — each problem returned with **3 steps** (CONCEPT/PROCESS/ANSWER)
   *  + each step's 5 choices. Per user spec 2026-05-24:
   *    "단원학습 20문제는 3단계문제로 나와야해"
   *
   *  Filter: only problems with exactly 3 ProblemStep rows are surfaced.
   *  Legacy single-step seed (Phase 4 pilot from 2026-05-23, 40 KR problems
   *  in INTEGERS + EXP-LOG chapters) doesn't satisfy this and is excluded
   *  until those chapters are re-authored as 3-step in Phase 2 of the
   *  user-spec rebuild. Frontend KoreanConceptLessonScreen displays
   *  "이 챕터의 연습 문제는 아직 준비 중입니다" when this returns []. */
  async practiceProblems(chapterCode: string) {
    const lesson = await this.prisma.koreanConceptLesson.findUnique({
      where: { chapterCode },
      select: { id: true },
    });
    if (!lesson) throw new NotFoundException(`KoreanConceptLesson ${chapterCode} not found`);

    const problems = await this.prisma.problem.findMany({
      where: {
        koreanConceptLessonId: lesson.id,
        // Sprint 1 B1 + Sprint 4 #44: active-pool filter. NULL = unsignaled
        // (legacy seed assumed safe), APPROVED/USABLE = LLM grader passed.
        // EXCLUDED rows and chapter-mismatched rows never reach students.
        conceptMismatch: { not: true },
        OR: [
          { qualityStatus: null },
          { qualityStatus: { in: ['APPROVED', 'USABLE'] } },
        ],
      },
      orderBy: [{ difficultyLevel: 'asc' }, { createdAt: 'asc' }],
      include: {
        steps: {
          orderBy: { stepIndex: 'asc' },
          include: {
            choices: { orderBy: { choiceIndex: 'asc' } },
          },
        },
      },
    });

    // Keep only 3-step problems (per user spec — single-step legacy excluded).
    const multiStep = problems.filter((p) => p.steps.length === 3);

    return multiStep.map((p) => ({
      id: p.id,
      stem: p.body,
      concept: p.concept,
      difficulty: p.difficulty,
      difficultyLevel: p.difficultyLevel,
      requiredSkills: p.requiredSkills,
      answer: p.answer,
      solution: (p.expectedSolutionSteps as any)?.explanation ?? null,
      steps: p.steps.map((s) => ({
        id: s.id,
        stepIndex: s.stepIndex,
        stepType: s.stepType,
        prompt: s.prompt,
        choices: s.choices.map((c) => ({
          id: c.id,
          choiceIndex: c.choiceIndex,
          text: c.text,
          isCorrect: c.isCorrect,
          distractorErrorCode: c.distractorErrorCode,
          rationale: c.rationale,
        })),
      })),
    }));
  }

  /** KR Study pool — single-step problems for this chapter. Returned shape
   *  mirrors NCERT mock-exams/start: 20 single-step MC problems. Mastery
   *  3-step rows excluded by steps.length===1 filter.
   *
   *  2026-05-29 user-aware ordering: problems the student already answered
   *  correctly in STUDY context are pushed to the back of the list. The
   *  frontend StudyPracticeScreen takes the first one, so the next entry
   *  lands on an un-solved (or previously wrong) row — implementing the
   *  "한 사용자가 같은 문제 2번 안 풀게" policy without removing rows from
   *  the pool (an empty Study tab on a fully-solved chapter is worse UX
   *  than 'replay your wrong notes'). Wrong-but-answered rows stay at the
   *  front along with un-attempted, so the queue naturally surfaces what
   *  the student should retry. */
  async studyProblems(chapterCode: string, userId: string) {
    const lesson = await this.prisma.koreanConceptLesson.findUnique({
      where: { chapterCode },
      select: { id: true },
    });
    if (!lesson) throw new NotFoundException(`KoreanConceptLesson ${chapterCode} not found`);

    const problems = await this.prisma.problem.findMany({
      where: {
        koreanConceptLessonId: lesson.id,
        // Sprint 1 B1 + Sprint 4 #44 (see practiceProblems above).
        conceptMismatch: { not: true },
        OR: [
          { qualityStatus: null },
          { qualityStatus: { in: ['APPROVED', 'USABLE'] } },
        ],
      },
      orderBy: [{ difficultyLevel: 'asc' }, { createdAt: 'asc' }],
      include: {
        steps: { orderBy: { stepIndex: 'asc' }, include: { choices: { orderBy: { choiceIndex: 'asc' } } } },
      },
    });

    // Single-step Study pool: keep only problems with exactly 1 ANSWER step.
    const singleStep = problems.filter((p) => p.steps.length === 1 && p.steps[0]?.stepType === 'ANSWER');

    // Look up problems this user already solved correctly in STUDY context.
    // Push those to the back of the queue so re-entering the chapter starts
    // with what they haven't mastered yet.
    const solvedRows = await this.prisma.attempt.findMany({
      where: {
        userId,
        problemId: { in: singleStep.map((p) => p.id) },
        context: 'STUDY',
        isCorrect: true,
      },
      distinct: ['problemId'],
      select: { problemId: true },
    });
    const solvedIds = new Set(solvedRows.map((r) => r.problemId));
    const unsolved = singleStep.filter((p) => !solvedIds.has(p.id));
    const solved = singleStep.filter((p) => solvedIds.has(p.id));
    const ordered = [...unsolved, ...solved];

    return ordered.map((p) => {
      const s = p.steps[0];
      return {
        id: p.id,
        stem: p.body,
        concept: p.concept,
        difficulty: p.difficulty,
        difficultyLevel: p.difficultyLevel,
        requiredSkills: p.requiredSkills,
        answer: p.answer,
        solution: (p.expectedSolutionSteps as any)?.explanation ?? null,
        // Frontend StudyPracticeScreen은 single-step UI를 그대로 쓸 수 있도록
        // 같은 step+choices shape 노출.
        stepId: s.id,
        stepIndex: s.stepIndex,
        choices: s.choices.map((c) => ({
          id: c.id,
          choiceIndex: c.choiceIndex,
          text: c.text,
          isCorrect: c.isCorrect,
          distractorErrorCode: c.distractorErrorCode,
          rationale: c.rationale,
        })),
      };
    });
  }

  /** Lightweight shape for list / chip rendering on frontend. */
  private shapeSummary(l: {
    id: string;
    chapterCode: string;
    koreanGrade: KoreanGrade;
    koreanSubject: KoreanSubject;
    chapterNumber: number;
    titleKo: string;
    titleEn: string | null;
    bigIdeaKo: string;
    estimatedMin: number;
    cognitiveLoad: number;
    prerequisiteCodes: string[];
  }) {
    return {
      id: l.id,
      chapterCode: l.chapterCode,
      koreanGrade: l.koreanGrade,
      koreanSubject: l.koreanSubject,
      chapterNumber: l.chapterNumber,
      titleKo: l.titleKo,
      titleEn: l.titleEn,
      bigIdeaKo: l.bigIdeaKo,
      estimatedMin: l.estimatedMin,
      cognitiveLoad: l.cognitiveLoad,
      prerequisiteCodes: l.prerequisiteCodes,
    };
  }
}
