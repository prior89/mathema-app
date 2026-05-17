import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { ChapterTestDto, WeeklyAssessmentDto } from './dto/assessment.dto';
import { SolveMathHelperDto } from './dto/solve-math-helper.dto';

type DbStudentProfile = {
  weakConcepts: Array<Record<string, unknown>>;
  frequentUnits: Array<Record<string, unknown>>;
  recentWrongNotes: Array<Record<string, unknown>>;
  source: 'database';
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
  ) {}

  async health() {
    return this.request('GET', '/health');
  }

  async solve(userId: string, dto: SolveMathHelperDto) {
    const [profile, classLevel] = await Promise.all([
      this.buildStudentProfile(userId),
      dto.classLevel ? Promise.resolve(dto.classLevel) : this.defaultClassLevel(userId),
    ]);

    return this.request('POST', '/solve', this.withoutUndefined({
      classLevel,
      question: dto.question,
      studentAnswer: dto.studentAnswer,
      studentProfile: profile,
    }));
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
      const payload = text ? JSON.parse(text) : null;
      if (!res.ok) {
        const detail = payload?.detail ?? payload?.message ?? res.statusText;
        throw new HttpException(`Math helper failed: ${detail}`, res.status);
      }
      return payload;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      const message = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Math helper ${method} ${path} failed: ${message}`);
      throw new HttpException('Math helper service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
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
}
