import { Injectable } from '@nestjs/common';
import { AchievementKind, Prisma } from '@prisma/client';
import { MetricsService } from '../../common/metrics/metrics.service';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AchievementDto } from './achievements.types';

const FIRST_SESSION_KINDS = new Set<AchievementKind>([
  'FIRST_CONCEPT_STEP',
  'FIRST_PRACTICE_CORRECT',
  'FIRST_WRONGNOTE_MASTERED',
]);

@Injectable()
export class AchievementsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly metrics: MetricsService,
  ) {}

  async list(userId: string): Promise<AchievementDto[]> {
    const rows = await this.prisma.userAchievement.findMany({
      where: { userId },
      orderBy: { earnedAt: 'asc' },
    });
    return rows.map((r) => this.toDto(r));
  }

  /** Idempotent award — returns row when newly created, null if already earned. */
  async tryAward(
    userId: string,
    kind: AchievementKind,
    metadata?: Record<string, unknown>,
  ): Promise<AchievementDto | null> {
    try {
      const row = await this.prisma.userAchievement.create({
        data: {
          userId,
          kind,
          metadata: (metadata ?? Prisma.JsonNull) as Prisma.InputJsonValue,
        },
      });
      await this.markFirstSessionEngaged(userId);
      if (FIRST_SESSION_KINDS.has(kind)) {
        this.metrics.incFirstSessionAchievement(kind);
      }
      return this.toDto(row);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        return null;
      }
      throw e;
    }
  }

  /** Award FIRST_CONCEPT_STEP once the user has any concept progress row. */
  async tryAwardFirstConceptStep(
    userId: string,
    metadata?: Record<string, unknown>,
  ): Promise<AchievementDto | null> {
    const existing = await this.prisma.userAchievement.findUnique({
      where: { userId_kind: { userId, kind: 'FIRST_CONCEPT_STEP' } },
    });
    if (existing) return null;

    const [ncert, kr] = await Promise.all([
      this.prisma.conceptProgress.count({ where: { userId } }),
      this.prisma.koreanConceptProgress.count({ where: { userId } }),
    ]);
    if (ncert + kr === 0) return null;

    return this.tryAward(userId, 'FIRST_CONCEPT_STEP', metadata);
  }

  async celebrate(userId: string, kind: AchievementKind): Promise<AchievementDto | null> {
    const row = await this.prisma.userAchievement.findUnique({
      where: { userId_kind: { userId, kind } },
    });
    if (!row) return null;

    const meta = (row.metadata && typeof row.metadata === 'object' && !Array.isArray(row.metadata))
      ? { ...(row.metadata as Record<string, unknown>) }
      : {};
    if (meta.celebratedAt) return this.toDto(row);

    meta.celebratedAt = new Date().toISOString();
    const updated = await this.prisma.userAchievement.update({
      where: { id: row.id },
      data: { metadata: meta as Prisma.InputJsonValue },
    });
    return this.toDto(updated);
  }

  /** After first D0 achievement, graduate off FirstSessionPlan today cards. */
  private async markFirstSessionEngaged(userId: string) {
    await this.prisma.firstSessionPlan.updateMany({
      where: { userId, completedAt: null },
      data: { completedAt: new Date() },
    });
  }

  private toDto(row: {
    kind: AchievementKind;
    earnedAt: Date;
    metadata: Prisma.JsonValue | null;
  }): AchievementDto {
    const meta = row.metadata && typeof row.metadata === 'object' && !Array.isArray(row.metadata)
      ? (row.metadata as Record<string, unknown>)
      : null;
    const celebratedAt = typeof meta?.celebratedAt === 'string' ? meta.celebratedAt : null;
    return {
      kind: row.kind,
      earnedAt: row.earnedAt.toISOString(),
      celebratedAt,
      metadata: meta,
    };
  }
}