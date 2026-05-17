import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Difficulty } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AttemptsService } from '../attempts/attempts.service';
import { ChapterTestDto, WeeklyAssessmentDto } from './dto/assessment.dto';
import { SolveMathHelperDto } from './dto/solve-math-helper.dto';

type DbStudentProfile = {
  weakConcepts: Array<Record<string, unknown>>;
  frequentUnits: Array<Record<string, unknown>>;
  recentWrongNotes: Array<Record<string, unknown>>;
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
  ) {}

  async health() {
    return this.request('GET', '/health');
  }

  async solve(userId: string, dto: SolveMathHelperDto) {
    const [profile, classLevel] = await Promise.all([
      this.buildStudentProfile(userId),
      dto.classLevel ? Promise.resolve(dto.classLevel) : this.defaultClassLevel(userId),
    ]);

    const response = await this.request('POST', '/solve', this.withoutUndefined({
      classLevel,
      question: dto.question,
      studentAnswer: dto.studentAnswer,
      studentProfile: profile,
    })) as SolveHelperResponse;

    await this.recordWrongSolveAttempt(userId, dto, response, classLevel).catch((err) => {
      this.logger.warn(`Could not record solved wrong answer: ${(err as Error).message}`);
    });

    return response;
  }

  async chapterTest(userId: string, dto: ChapterTestDto) {
    const [profile, classLevel] = await Promise.all([
      this.buildStudentProfile(userId),
      dto.classLevel ? Promise.resolve(dto.classLevel) : this.defaultClassLevel(userId),
    ]);

    return this.request('POST', '/assessments/chapter-test', this.withoutUndefined({
      classLevel,
      chapterCode: dto.chapterCode,
      chapter: dto.chapter,
      questionCount: dto.questionCount,
      studentProfile: profile,
    }));
  }

  async weekly(userId: string, dto: WeeklyAssessmentDto) {
    const [profile, classLevel] = await Promise.all([
      this.buildStudentProfile(userId),
      dto.classLevel ? Promise.resolve(dto.classLevel) : this.defaultClassLevel(userId),
    ]);

    return this.request('POST', '/assessments/weekly', this.withoutUndefined({
      classLevel,
      questionCount: dto.questionCount,
      studentProfile: profile,
    }));
  }

  private async request(method: 'GET' | 'POST', path: string, body?: unknown) {
    const baseUrl = (this.config.get<string>('mathHelper.url') ?? 'http://localhost:8000').replace(/\/$/, '');
    const timeoutMs = this.config.get<number>('mathHelper.timeoutMs') ?? 30000;
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
        const detail = payload?.detail ?? payload?.message ?? (text || res.statusText);
        throw new HttpException({ message: `Solver failed: ${detail}` }, res.status);
      }
      return payload;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      const message = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Math helper ${method} ${path} failed: ${message}`);
      throw new HttpException({ message: 'Solver is unavailable right now. Please try again in a moment.' }, HttpStatus.SERVICE_UNAVAILABLE);
    } finally {
      clearTimeout(timeout);
    }
  }

  private async defaultClassLevel(userId: string): Promise<number | undefined> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { gradeLevel: true },
    });
    return user?.gradeLevel ? GRADE_TO_CLASS[user.gradeLevel] : undefined;
  }

  private async buildStudentProfile(userId: string): Promise<DbStudentProfile> {
    const [weakTrajectories, recentAttempts, recentWrongNotes] = await Promise.all([
      this.prisma.masteryTrajectory.findMany({
        where: { userId, masteryScore: { lt: 70 } },
        orderBy: [{ masteryScore: 'asc' }, { evidenceCount: 'desc' }],
        take: 5,
        include: { concept: { select: { code: true, name: true } } },
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
    };
  }

  private withoutUndefined<T extends Record<string, unknown>>(value: T): T {
    return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined)) as T;
  }

  private parseJson(text: string): any {
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  private async recordWrongSolveAttempt(
    userId: string,
    dto: SolveMathHelperDto,
    response: SolveHelperResponse,
    classLevel?: number,
  ): Promise<void> {
    if (!dto.studentAnswer || response.isStudentCorrect !== false || !response.answer) return;

    const problemId = await this.createPracticeProblem(userId, dto.question, response, classLevel);
    if (!problemId) return;

    await this.attempts.create(userId, {
      problemId,
      answer: dto.studentAnswer,
      durationSec: 1,
      context: 'PRACTICE',
    });
  }

  private async createPracticeProblem(
    userId: string,
    question: string,
    response: SolveHelperResponse,
    classLevel?: number,
  ): Promise<string | null> {
    const answer = response.answer;
    if (!answer) return null;

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
        concept: conceptText,
        answer,
        difficultyLevel: 3,
        expectedSolutionSteps: response.explanation ? { explanation: response.explanation } : undefined,
        conceptLessonId: lesson?.id ?? null,
        concepts: concepts.length > 0
          ? { create: concepts.map((c) => ({ conceptId: c.id, weight: 1 })) }
          : undefined,
      },
      select: { id: true },
    });

    return problem.id;
  }
}
