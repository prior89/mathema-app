import { HttpException, HttpStatus, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Difficulty } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RedisService } from '../../infrastructure/redis/redis.service';
import { OcrService } from '../../infrastructure/ocr/ocr.service';
import { AttemptsService } from '../attempts/attempts.service';
import { LlmDraftService } from '../content-ingest/llm-draft.service';
import { SolveMathHelperDto } from './dto/solve-math-helper.dto';
import { normalizeProblemBody, problemBodyHash } from '../../common/utils/normalize-problem-body';
import { mathAnswersEqual } from '../../common/utils/normalize-math-answer';

/** Solve-cache TTL — a re-uploaded/common problem serves its stored solution
 *  instead of a fresh LLM call (the flywheel: cheaper, faster, consistent). */
const SOLVE_CACHE_TTL_SEC = 90 * 24 * 3600;
/** Cache-key version — bump whenever solver OUTPUT semantics change (prompt
 *  language overhaul, response shape). With a 90-day TTL, un-versioned keys
 *  kept replaying pre-fix English solutions to KR users for weeks after the
 *  Korean-output deploy. v2 = language-scoped keys, 2026-07-12.
 *  Exported so report-invalidation (problems.service) can never drift from
 *  the writer's key format. */
export const SOLVE_CACHE_VER = 'v2';
/** Every language value userLanguage() can produce (+ 'hi' for safety) —
 *  report-invalidation must purge each variant. */
export const SOLVE_CACHE_LANGS = ['ko', 'en', 'hi'] as const;

type DbStudentProfile = {
  weakConcepts: Array<Record<string, unknown>>;
  frequentUnits: Array<Record<string, unknown>>;
  recentWrongNotes: Array<Record<string, unknown>>;
  /// Lv 2 RAG — APPROVED problems in the user's current chapter, injected
  /// into the solve prompt as verified examples. nodes.py reads
  /// student_profile["fewShotExamples"] and renders them in-prompt.
  fewShotExamples: Array<{
    question: string;
    answer: string;
    explanation?: string;
    chapter?: string | null;
  }>;
  source: 'database';
};

type SolveHelperResponse = {
  detected?: {
    classLevel?: number;
    chapter?: string;
    topic?: string;
    chapterCode?: string | null;
    conceptCodes?: string[];
  };
  answer?: string;
  isStudentCorrect?: boolean | null;
  explanation?: string;
  /// Step-by-step worked derivation. Each entry is one "Step N." block,
  /// possibly multi-line (literal "\n" preserved). Surfaced in the UI as
  /// a numbered list with LaTeX rendered inline; persisted into
  /// Problem.expectedSolutionSteps for the practice replay.
  steps?: string[];
  /// Pedagogical "why" per step — same length as `steps`. Rendered as a
  /// collapsible accordion in UploadProblemModal (PR-14 / PR-15).
  stepRationales?: string[];
  verification?: {
    isVerified?: boolean;
    method?: string;
    issues?: string[];
    confidence?: number;
    verifiedAnswer?: string | null;
    attempts?: number;
    caution?: string | null;
  };
};

const GRADE_TO_CLASS: Record<string, number> = {
  G_MIDDLE_1: 7,
  G_MIDDLE_2: 8,
  G_MIDDLE_3: 9,
  G_HIGH_1: 10,
  G_HIGH_2: 11,
  G_HIGH_3: 12,
};

@Injectable()
export class MathHelperService {
  private readonly logger = new Logger(MathHelperService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly attempts: AttemptsService,
    private readonly ocr: OcrService,
    private readonly llmDraft: LlmDraftService,
    private readonly redis: RedisService,
  ) {}

  async health() {
    return this.request('GET', '/health');
  }

  async solve(userId: string, dto: SolveMathHelperDto) {
    const studentAnswer = this.normalizeStudentAnswer(dto.studentAnswer);
    const classLevel = dto.classLevel ?? await this.defaultClassLevel(userId);

    // Flywheel: reuse a stored solution for an identical problem (hash of the
    // OCR-noise-normalized body) instead of re-calling the LLM. Cache hit-rate
    // rises as the corpus grows → cheaper, faster, and a consistent answer
    // (competitors' top complaint is inconsistent/uncorrectable answers).
    const cacheHash = problemBodyHash(dto.question);
    // Language is part of the cache identity: the same problem body must serve
    // a Korean solution to a KR account and English elsewhere. A shared key
    // replayed whichever language solved first (prod incident 2026-07-12).
    const language = (await this.userLanguage(userId)) ?? 'en';
    const cacheKey = cacheHash ? `solve:${SOLVE_CACHE_VER}:${language}:${cacheHash}` : null;
    const t0 = Date.now();
    let response: SolveHelperResponse | undefined;
    let cached = false;
    let fewShotCount = 0;

    if (cacheKey) {
      const raw = await this.redis.get(cacheKey).catch(() => null);
      if (raw) {
        try { response = JSON.parse(raw) as SolveHelperResponse; cached = true; } catch { /* fall through */ }
      }
    }

    if (!response) {
      const profile = await this.buildStudentProfile(userId);
      fewShotCount = profile.fewShotExamples.length;
      response = await this.request('POST', '/solve', this.withoutUndefined({
        classLevel: classLevel ?? 12,
        question: dto.question,
        studentAnswer,
        // KR accounts get Korean steps/hints even for bare-symbol equations
        // the language sniffer can't classify (solver-side gate).
        language,
        studentProfile: profile,
      })) as SolveHelperResponse;
      this.assertUsableSolveResponse(response);
      if (cacheKey) {
        // Never cache per-student verdicts: isStudentCorrect was computed for
        // THIS student's answer; replaying it to the next student who uploads
        // the same problem (with a different or no answer) shows them someone
        // else's grading for up to 90 days.
        const shareable = { ...response, isStudentCorrect: null };
        await this.redis.set(cacheKey, JSON.stringify(shareable), SOLVE_CACHE_TTL_SEC).catch(() => {});
      }
    }
    // Cache hits carry no verdict (stripped above; legacy entries may carry a
    // stale one) — grade THIS student's answer against the cached final answer
    // with the same comparator the attempt recorder uses.
    if (cached) {
      response.isStudentCorrect =
        studentAnswer && response.answer
          ? mathAnswersEqual(studentAnswer, response.answer)
          : null;
    }
    const durationMs = Date.now() - t0;

    // recordSolveAttempt creates the persistent Problem row (when math-helper
    // returned an answer). It creates an Attempt only when the student actually
    // submitted an answer, so "AI 풀이 보기" does not pollute accuracy stats or
    // auto-file a WrongNote. We still expose problemId for "Practice now".
    const problemId = await this.recordSolveAttempt(userId, dto, response, classLevel).catch((err) => {
      this.logger.warn(`Could not record solve attempt: ${(err as Error).message}`);
      return null;
    });

    // Lv 1 — fire-and-forget audit log of every solve. Read by weekly review
    // for prompt-tuning patterns + downstream few-shot bank curation.
    this.logSolverAttempt({
      userId,
      problemId,
      question: dto.question,
      classLevel: classLevel ?? null,
      studentAnswer: studentAnswer ?? null,
      response,
      durationMs,
      fewShotCount,
    }).catch((e) => this.logger.warn(`SolverAttempt log failed: ${(e as Error).message}`));

    return { ...response, problemId, cached };
  }

  async ocrSolve(userId: string, file: Express.Multer.File, dto: Omit<SolveMathHelperDto, 'question'>) {
    const ocr = await this.ocr.extract(file);
    const result = await this.solve(userId, {
      classLevel: dto.classLevel,
      question: ocr.text,
      studentAnswer: dto.studentAnswer,
      durationSec: dto.durationSec,
    });

    return {
      extractedText: ocr.text,
      latex: ocr.latex ?? null,
      confidence: ocr.confidence ?? null,
      source: ocr.source,
      result,
    };
  }

  private async request(method: 'GET' | 'POST', path: string, body?: unknown) {
    const baseUrl = (this.config.get<string>('mathHelper.url') ?? 'http://127.0.0.1:8000').replace(/\/$/, '');
    const timeoutMs = this.config.get<number>('mathHelper.timeoutMs') ?? 120000;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(`${baseUrl}${path}`, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      const text = await res.text();
      const payload = this.parseJson(text);
      if (!res.ok) {
        const detail = this.formatRemoteError(payload?.detail ?? payload?.message ?? (text || res.statusText));
        this.logger.warn(`Math helper ${method} ${path} upstream ${res.status}: ${detail}`);
        // code SolverUnavailable → the app renders its localized copy instead
        // of leaking pydantic validation paths / raw upstream errors to users.
        throw new HttpException({ code: 'SolverUnavailable', message: `Solver failed: ${detail}` }, res.status);
      }
      return payload;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      const message = err instanceof Error ? err.message : String(err);
      const name = err instanceof Error ? err.name : 'Error';
      this.logger.warn(`Math helper ${method} ${path} failed at ${baseUrl}: ${name}: ${message}`);
      throw new HttpException(
        { code: 'SolverUnavailable', message: `Solver request failed: ${name}: ${message}` },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    } finally {
      clearTimeout(timeout);
    }
  }

  private assertUsableSolveResponse(response: SolveHelperResponse) {
    const method = response.verification?.method;
    const issues = response.verification?.issues ?? [];
    const upstreamFallback = method === 'fallback' || issues.some((issue) => issue.startsWith('upstream_unavailable'));
    if (upstreamFallback || !response.answer?.trim()) {
      this.logger.warn(
        `Math helper returned unusable solve response: method=${method ?? 'unknown'} issues=${issues.join('; ') || 'none'} answer=${response.answer ? 'present' : 'empty'}`,
      );
      // Prefer the helper's student-facing explanation over an opaque code —
      // the app maps SolverUnavailable → upload.error.solverUnavailable, but
      // a concrete "AI service temporarily unreachable" line is more actionable.
      const detail =
        (typeof response.explanation === 'string' && response.explanation.trim())
        || (typeof response.verification?.caution === 'string' && response.verification.caution.trim())
        || 'SolverUnavailable';
      throw new ServiceUnavailableException({
        code: 'SolverUnavailable',
        message: detail,
      });
    }
  }

  /** Solver output language for this account — 'ko' for KR users. */
  private async userLanguage(userId: string): Promise<string | undefined> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { country: true },
    });
    return user?.country === 'KR' ? 'ko' : undefined;
  }

  private async defaultClassLevel(userId: string): Promise<number | undefined> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { gradeLevel: true },
    });
    return user?.gradeLevel ? GRADE_TO_CLASS[user.gradeLevel] : 12;
  }

  /// Lv 2 — fetch up to N APPROVED problems in the user's current chapter.
  /// "Current chapter" = the conceptLessonId of the most-recent attempt that
  /// has one (covers Study/Mastery/Test/Practice). When no recent attempt
  /// has a conceptLesson (brand-new user or all uploads), returns [] and the
  /// solve prompt falls back to its existing zero-shot behaviour.
  private async buildFewShotExamples(userId: string, limit = 2): Promise<DbStudentProfile['fewShotExamples']> {
    const recent = await this.prisma.attempt.findFirst({
      where: { userId, problem: { conceptLessonId: { not: null } } },
      orderBy: { createdAt: 'desc' },
      select: { problem: { select: { conceptLessonId: true } } },
    });
    const conceptLessonId = recent?.problem?.conceptLessonId;
    if (!conceptLessonId) return [];

    const examples = await this.prisma.problem.findMany({
      where: {
        conceptLessonId,
        qualityStatus: 'APPROVED',
        expectedSolutionSteps: { not: undefined },
      },
      orderBy: [{ qualityScore: 'desc' }],
      take: limit,
      select: {
        body: true,
        answer: true,
        concept: true,
        expectedSolutionSteps: true,
        conceptLesson: { select: { titleEn: true } },
      },
    });

    return examples.map((p) => {
      const steps = p.expectedSolutionSteps as { explanation?: string } | null;
      return {
        question: p.body,
        answer: p.answer,
        explanation: steps?.explanation ?? p.concept ?? undefined,
        chapter: p.conceptLesson?.titleEn ?? null,
      };
    });
  }

  /// Lv 1 — append-only solve audit. Best-effort: failures are warned, not
  /// thrown. studentCorrect populated later via Attempt joined on problemId.
  private async logSolverAttempt(args: {
    userId: string;
    problemId: string | null;
    question: string;
    classLevel: number | null;
    studentAnswer: string | null;
    response: SolveHelperResponse;
    durationMs: number;
    fewShotCount: number;
  }): Promise<void> {
    const explanation = args.response.explanation ?? null;
    const steps = args.response.steps ?? null;
    await this.prisma.solverAttempt.create({
      data: {
        userId: args.userId,
        problemId: args.problemId,
        question: args.question,
        classLevel: args.classLevel,
        llmAnswer: args.response.answer ?? null,
        llmExplanation: explanation,
        llmSteps: steps && steps.length > 0 ? (steps as unknown as object) : undefined,
        modelUsed: process.env.AI_LLM_MODEL ?? null,
        durationMs: args.durationMs,
        detected: args.response.detected ? (args.response.detected as object) : undefined,
        studentAnswer: args.studentAnswer,
        studentCorrect: args.response.isStudentCorrect ?? null,
        fewShotCount: args.fewShotCount,
      },
    });
  }

  private async buildStudentProfile(userId: string): Promise<DbStudentProfile> {
    const [weakTrajectories, recentAttempts, recentWrongNotes, fewShotExamples] = await Promise.all([
      this.prisma.masteryTrajectory.findMany({
        where: { userId, masteryScore: { lt: 70 } },
        orderBy: [{ masteryScore: 'asc' }, { evidenceCount: 'desc' }],
        take: 5,
        include: { concept: { select: { code: true, name: true, nameKo: true } } },
      }),
      this.prisma.attempt.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 300,
        select: {
          isCorrect: true,
          problem: {
            select: {
              unit: { select: { name: true } },
              conceptLesson: { select: { chapterCode: true, titleEn: true } },
            },
          },
        },
      }),
      this.prisma.wrongNote.findMany({
        where: { userId, status: { not: 'MASTERED' } },
        orderBy: { updatedAt: 'desc' },
        take: 5,
        include: {
          problem: {
            select: {
              body: true,
              answer: true,
              conceptLesson: { select: { chapterCode: true } },
              concepts: { include: { concept: { select: { code: true } } } },
            },
          },
        },
      }),
      this.buildFewShotExamples(userId, 2),
    ]);

    const frequent = new Map<string, { unit: string; attempts: number; correct: number; wrong: number; label?: string }>();
    for (const attempt of recentAttempts) {
      const key = attempt.problem.conceptLesson?.chapterCode ?? attempt.problem.unit.name;
      const cur = frequent.get(key) ?? {
        unit: key,
        label: attempt.problem.conceptLesson?.titleEn ?? attempt.problem.unit.name,
        attempts: 0,
        correct: 0,
        wrong: 0,
      };
      cur.attempts += 1;
      if (attempt.isCorrect) cur.correct += 1;
      else cur.wrong += 1;
      frequent.set(key, cur);
    }

    return {
      source: 'database',
      weakConcepts: weakTrajectories.map((t) => ({
        conceptCode: t.concept.code,
        conceptName: t.concept.name,
        conceptNameKo: t.concept.nameKo,
        masteryScore: t.masteryScore,
        attempts: t.evidenceCount,
        recentAccuracy: t.recentAccuracy,
        wrong: Math.max(0, Math.round(t.evidenceCount * (1 - t.recentAccuracy))),
      })),
      frequentUnits: Array.from(frequent.values())
        .sort((a, b) => b.attempts - a.attempts)
        .slice(0, 5),
      recentWrongNotes: recentWrongNotes.map((note) => ({
        createdAt: note.createdAt.toISOString(),
        question: note.problem.body,
        correctAnswer: note.problem.answer,
        mistakeDiagnosis: note.insight || note.errorType,
        chapterCode: note.problem.conceptLesson?.chapterCode ?? null,
        conceptCodes: note.problem.concepts.map((pc) => pc.concept.code),
        occurrences: note.occurrences,
      })),
      fewShotExamples,
    };
  }

  private withoutUndefined<T extends Record<string, unknown>>(value: T): T {
    return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined)) as T;
  }

  private normalizeStudentAnswer(answer?: string | null): string | undefined {
    const trimmed = answer?.trim();
    return trimmed ? trimmed : undefined;
  }

  private parseJson(text: string): any {
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  private formatRemoteError(value: unknown): string {
    if (value == null) return 'unknown error';
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) {
      return value.map((item) => this.formatRemoteError(item)).join('; ');
    }
    if (typeof value === 'object') {
      const obj = value as Record<string, unknown>;
      const loc = Array.isArray(obj.loc) ? obj.loc.join('.') : null;
      const msg = typeof obj.msg === 'string' ? obj.msg : null;
      const type = typeof obj.type === 'string' ? obj.type : null;
      if (msg) return [loc, msg, type].filter(Boolean).join(': ');
      try {
        return JSON.stringify(obj);
      } catch {
        return String(value);
      }
    }
    return String(value);
  }

  /**
   * Persist every usable /solve as an AI-created practice Problem so the user
   * can jump into "Practice now" immediately. Only create an Attempt when the
   * student submitted their own answer; otherwise a solver view would look like
   * a wrong student attempt and damage WrongNotes, accuracy, streaks, and
   * weekly reports.
   *
   * Behaviour by branch:
   *   - studentAnswer absent       -> Problem only; no Attempt, no WrongNote
   *   - studentAnswer && correct   -> Attempt with isCorrect=true, no WrongNote
   *   - studentAnswer && incorrect -> Attempt with isCorrect=false -> WrongNote
   *
   * If the solver itself failed to return an answer we have nothing to grade
   * against, so we skip silently; math-helper already returned the user a
   * polite fallback response.
   */
  private async recordSolveAttempt(
    userId: string,
    dto: SolveMathHelperDto,
    response: SolveHelperResponse,
    classLevel?: number,
  ): Promise<string | null> {
    if (!response.answer) return null;

    const problemId = await this.createPracticeProblem(userId, dto.question, response, classLevel);
    if (!problemId) return null;

    const studentAnswer = this.normalizeStudentAnswer(dto.studentAnswer);
    if (!studentAnswer) return problemId;

    await this.attempts.create(userId, {
      problemId,
      answer: studentAnswer,
      // durationSec is best-effort wall time from the client; fall back to a
      // small placeholder (15s) when missing so streak-farming a photo upload
      // doesn't credit a full minute for a single tap.
      durationSec: Math.max(5, Math.min(600, Math.floor(dto.durationSec ?? 15))),
      context: 'PRACTICE',
    });
    return problemId;
  }

  private async createPracticeProblem(
    userId: string,
    question: string,
    response: SolveHelperResponse,
    classLevel?: number,
  ): Promise<string | null> {
    const answer = response.answer;
    if (!answer) return null;

    // Flywheel dedup: if this exact problem (same normalized body) is already
    // stored, reuse that row instead of creating a duplicate — the attempt below
    // still records against it. Same body ⇒ same problem ⇒ same answer.
    // EXCLUDED rows (student-reported) must NOT be reused: reporting retired
    // their solution, so the fresh solve gets a fresh row (bodyHash is a
    // non-unique index, duplicates are fine).
    const bodyHash = problemBodyHash(question);
    if (bodyHash) {
      const existing = await this.prisma.problem.findFirst({
        // qualityStatus is nullable and Prisma's `not` is NULL-unsafe (SQL <>),
        // so spell out "null OR not-excluded" — AI-solve rows are created with
        // qualityStatus null and must keep deduping.
        where: {
          bodyHash,
          OR: [{ qualityStatus: null }, { qualityStatus: { not: 'EXCLUDED' } }],
        },
        select: { id: true },
      });
      if (existing) return existing.id;
    }

    const detected = response.detected ?? {};
    const chapterCode = detected.chapterCode ?? null;
    const conceptCodes = detected.conceptCodes ?? [];

    const [user, lesson, concepts] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId }, select: { gradeLevel: true } }),
      chapterCode
        ? this.prisma.conceptLesson.findUnique({
            where: { chapterCode },
            select: { id: true, unitId: true, subUnitId: true },
          })
        : Promise.resolve(null),
      conceptCodes.length > 0
        ? this.prisma.concept.findMany({
            where: { code: { in: conceptCodes } },
            select: { id: true, unitId: true },
          })
        : Promise.resolve([]),
    ]);

    let unitId = lesson?.unitId ?? concepts.find((c) => c.unitId)?.unitId ?? null;
    let subUnitId = lesson?.subUnitId ?? null;

    if (!unitId) {
      const fallbackUnit = await this.prisma.unit.findFirst({
        where: user?.gradeLevel ? { gradeLevels: { has: user.gradeLevel } } : {},
        orderBy: { order: 'asc' },
        select: { id: true, subUnits: { orderBy: { order: 'asc' }, take: 1, select: { id: true } } },
      });
      unitId = fallbackUnit?.id ?? null;
      subUnitId = fallbackUnit?.subUnits[0]?.id ?? null;
    }

    if (!unitId) {
      this.logger.warn('No unit available to record math-helper wrong answer.');
      return null;
    }

    const conceptText = [detected.chapter, detected.topic].filter(Boolean).join(' · ') || null;
    const problem = await this.prisma.problem.create({
      data: {
        source: `AI Solve · Class ${classLevel ?? detected.classLevel ?? '?'}`,
        unitId,
        subUnitId,
        difficulty: Difficulty.MIDDLE,
        body: question,
        normalizedBody: normalizeProblemBody(question),
        bodyHash,
        concept: conceptText,
        answer,
        difficultyLevel: 3,
        expectedSolutionSteps:
          response.explanation || (response.steps && response.steps.length > 0)
            ? {
                explanation: response.explanation ?? '',
                steps: response.steps ?? [],
                stepRationales: response.stepRationales ?? [],
              }
            : undefined,
        conceptLessonId: lesson?.id ?? null,
        concepts: concepts.length > 0
          ? { create: concepts.map((c) => ({ conceptId: c.id, weight: 1 })) }
          : undefined,
      },
      select: { id: true },
    });

    // Fire and forget — generate a single-step 5-choice MC variant so the
    // student can later "Practice this problem" in Study-style (handwriting
    // pad + 5 choices + grading). Failure here is non-fatal; the problem is
    // still saved with body + answer + explanation, and the Notes screen
    // renders that via NoStepsReview.
    this.generateMcChoicesForUploadedProblem(problem.id, question, userId).catch((e) => {
      this.logger.warn(`MC generation failed for problem ${problem.id}: ${(e as Error).message}`);
    });

    return problem.id;
  }

  /**
   * Post-OCR 5-choice MC generation. Runs LlmDraftService in single-step mode
   * with the math-helper's verified answer pinned to the correct choice, then
   * persists ProblemStep + ProblemChoice rows so the existing 5-choice
   * Study/Mastery practice flow renders this problem with no extra branching.
   *
   * Idempotent: skips if the problem already has steps (e.g. retry on the
   * same upload). Daily-quota guarded by LlmDraftService (cap 100/user/day).
   */
  private async generateMcChoicesForUploadedProblem(
    problemId: string,
    question: string,
    userId: string,
  ): Promise<void> {
    const existingSteps = await this.prisma.problemStep.count({ where: { problemId } });
    if (existingSteps > 0) return;
    const fresh = await this.prisma.problem.findUnique({
      where: { id: problemId },
      select: { answer: true },
    });
    if (!fresh?.answer) return;

    const draft = await this.llmDraft.generate(
      { text: question },
      { mode: 'single-step', userId },
    );
    const payload = draft.payload;
    const step = payload.steps[0];
    if (!step || step.choices.length !== 5) return;

    // Replace whichever choice the LLM marked correct with math-helper's
    // verified answer string -- single source of truth for grading.
    const sanitisedChoices = step.choices.map((c, idx) => ({
      choiceIndex: idx + 1,
      text: c.isCorrect ? fresh.answer! : c.text,
      isCorrect: c.isCorrect,
      distractorType: c.isCorrect ? null : (c.distractorType ?? null),
      rationale: c.rationale ?? null,
    }));

    await this.prisma.problemStep.create({
      data: {
        problemId,
        stepIndex: 1,
        stepType: 'ANSWER',
        prompt: step.prompt,
        choices: { create: sanitisedChoices },
      },
    });
  }
}
