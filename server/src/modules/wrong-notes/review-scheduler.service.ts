import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { WRONG_NOTE_INITIAL_COOLDOWN_DAYS } from './wrong-note-schedule.constants';

/** Epoch anchor when nextReviewAt is unset — max() then reduces to createdAt + cooldown. */
export const WRONG_NOTE_EPOCH = new Date(0);

const COOLDOWN_MS = WRONG_NOTE_INITIAL_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;

export type WrongNoteDueReason = 'SM2_DUE' | 'COOLDOWN_ELIGIBLE';

export interface WrongNoteDueCandidate {
  wrongNoteId: string;
  effectiveDueAt: Date;
  priorityScore: number;
  reason: WrongNoteDueReason;
}

export interface WrongNoteScheduleRow {
  id: string;
  createdAt: Date;
  nextReviewAt: Date | null;
  occurrences: number;
  status: string;
  problem: {
    conceptLessonId: string | null;
    koreanConceptLessonId: string | null;
  };
}

/** createdAt + initial cooldown — FIFO gate from getQueueNext. */
export function cooldownEndAt(createdAt: Date): Date {
  return new Date(createdAt.getTime() + COOLDOWN_MS);
}

/**
 * Unified due timestamp: max(createdAt + 3d, nextReviewAt ?? epoch).
 * Single source of truth for all WrongNote due consumers (queue, FCM, due list).
 */
export function computeEffectiveDueAt(
  createdAt: Date,
  nextReviewAt: Date | null,
): Date {
  const cooldown = cooldownEndAt(createdAt);
  const sm2 = nextReviewAt ?? WRONG_NOTE_EPOCH;
  return new Date(Math.max(cooldown.getTime(), sm2.getTime()));
}

export function isWrongNoteEffectivelyDue(
  createdAt: Date,
  nextReviewAt: Date | null,
  now = new Date(),
): boolean {
  return computeEffectiveDueAt(createdAt, nextReviewAt).getTime() <= now.getTime();
}

export function classifyDueReason(
  createdAt: Date,
  nextReviewAt: Date | null,
  effectiveDueAt: Date,
): WrongNoteDueReason {
  const cooldown = cooldownEndAt(createdAt);
  if (
    nextReviewAt
    && nextReviewAt.getTime() >= cooldown.getTime()
    && effectiveDueAt.getTime() === nextReviewAt.getTime()
  ) {
    return 'SM2_DUE';
  }
  return 'COOLDOWN_ELIGIBLE';
}

/** Higher = sooner in queue. Mirrors FIFO (oldest effectiveDueAt first) + occurrence tie-break. */
export function computePriorityScore(effectiveDueAt: Date, occurrences: number): number {
  return -effectiveDueAt.getTime() + occurrences;
}

export function passesCurriculumGate(
  problem: { conceptLessonId: string | null; koreanConceptLessonId: string | null },
  isKR: boolean,
): boolean {
  return isKR
    ? problem.koreanConceptLessonId != null
    : problem.conceptLessonId != null;
}

/** In-memory filter — shared by scheduler and integration tests (3-consumer equality). */
export function filterDueWrongNotes(
  rows: WrongNoteScheduleRow[],
  opts: { isKR: boolean; now: Date },
): WrongNoteDueCandidate[] {
  const candidates: WrongNoteDueCandidate[] = [];
  for (const row of rows) {
    if (row.status === 'MASTERED') continue;
    if (!passesCurriculumGate(row.problem, opts.isKR)) continue;

    const effectiveDueAt = computeEffectiveDueAt(row.createdAt, row.nextReviewAt);
    if (effectiveDueAt.getTime() > opts.now.getTime()) continue;

    candidates.push({
      wrongNoteId: row.id,
      effectiveDueAt,
      priorityScore: computePriorityScore(effectiveDueAt, row.occurrences),
      reason: classifyDueReason(row.createdAt, row.nextReviewAt, effectiveDueAt),
    });
  }

  candidates.sort(
    (a, b) =>
      a.effectiveDueAt.getTime() - b.effectiveDueAt.getTime()
      || b.priorityScore - a.priorityScore,
  );
  return candidates;
}

@Injectable()
export class ReviewSchedulerService {
  constructor(private readonly prisma: PrismaService) {}

  private async fetchScheduleRows(userId: string) {
    const me = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { country: true },
    });
    const isKR = me?.country === 'KR';
    const problemCurriculumWhere = isKR
      ? { koreanConceptLessonId: { not: null } }
      : { conceptLessonId: { not: null } };

    const rows = await this.prisma.wrongNote.findMany({
      where: {
        userId,
        status: { not: 'MASTERED' },
        problem: problemCurriculumWhere,
      },
      select: {
        id: true,
        createdAt: true,
        nextReviewAt: true,
        occurrences: true,
        status: true,
        problem: {
          select: { conceptLessonId: true, koreanConceptLessonId: true },
        },
      },
    });

    return { rows, isKR };
  }

  /**
   * WrongNote due — unified set for queue, FCM cron, and GET /wrong-notes/due.
   * effectiveDueAt = max(createdAt + 3d, nextReviewAt ?? epoch); due when ≤ now.
   */
  async getDueWrongNotes(userId: string, now = new Date()): Promise<WrongNoteDueCandidate[]> {
    const { rows, isKR } = await this.fetchScheduleRows(userId);
    return filterDueWrongNotes(rows, { isKR, now });
  }

  /** Earliest effectiveDueAt among curriculum-eligible notes not yet due (queue empty UI). */
  async getNextEligibleAt(userId: string, now = new Date()): Promise<Date | null> {
    const { rows, isKR } = await this.fetchScheduleRows(userId);
    let min: Date | null = null;
    for (const row of rows) {
      if (row.status === 'MASTERED') continue;
      if (!passesCurriculumGate(row.problem, isKR)) continue;

      const effectiveDueAt = computeEffectiveDueAt(row.createdAt, row.nextReviewAt);
      if (effectiveDueAt.getTime() <= now.getTime()) continue;
      if (!min || effectiveDueAt.getTime() < min.getTime()) min = effectiveDueAt;
    }
    return min;
  }

  async getDueWrongNoteIds(userId: string, now = new Date()): Promise<string[]> {
    const due = await this.getDueWrongNotes(userId, now);
    return due.map((c) => c.wrongNoteId);
  }

  async countDueWrongNotes(userId: string, now = new Date()): Promise<number> {
    const due = await this.getDueWrongNotes(userId, now);
    return due.length;
  }

  /** FCM cron — per-user due counts with per-user curriculum gate. */
  async getDueCountsByUser(now = new Date()): Promise<Array<{ userId: string; count: number }>> {
    const rows = await this.prisma.wrongNote.findMany({
      where: { status: { not: 'MASTERED' } },
      select: {
        userId: true,
        createdAt: true,
        nextReviewAt: true,
        status: true,
        problem: {
          select: { conceptLessonId: true, koreanConceptLessonId: true },
        },
        user: { select: { country: true } },
      },
    });

    const counts = new Map<string, number>();
    for (const row of rows) {
      if (row.status === 'MASTERED') continue;
      const isKR = row.user.country === 'KR';
      if (!passesCurriculumGate(row.problem, isKR)) continue;

      const effectiveDueAt = computeEffectiveDueAt(row.createdAt, row.nextReviewAt);
      if (effectiveDueAt.getTime() > now.getTime()) continue;

      counts.set(row.userId, (counts.get(row.userId) ?? 0) + 1);
    }

    return [...counts.entries()].map(([userId, count]) => ({ userId, count }));
  }
}