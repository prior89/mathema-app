import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ErrorPatternStatus,
  MasteryTrend,
  MasteryUpdateSource,
  Prisma,
  TeacherOverrideTargetType,
  UserRole,
} from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

type OverrideInput = {
  teacherId: string;
  studentUserId: string;
  targetType: TeacherOverrideTargetType;
  targetId: string;
  afterValue: Record<string, unknown>;
  reason: string;
};

type TargetRow = {
  id: string;
  userId: string;
  tenantId: string | null;
  [key: string]: unknown;
};

/**
 * Applies a human correction to an AI-derived student record and stores its
 * immutable audit entry in the same transaction.
 */
@Injectable()
export class TeacherOverrideService {
  constructor(private readonly prisma: PrismaService) {}

  async apply(input: OverrideInput) {
    const afterValue = this.validateAfterValue(input.targetType, input.afterValue);
    const reason = input.reason.trim();
    if (!reason) throw new BadRequestException('Override reason is required.');

    return this.prisma.$transaction(async (tx) => {
      const [actor, student] = await Promise.all([
        tx.user.findUnique({
          where: { id: input.teacherId },
          select: { role: true, tenantId: true, deletedAt: true },
        }),
        tx.user.findUnique({
          where: { id: input.studentUserId },
          select: { role: true, tenantId: true, deletedAt: true },
        }),
      ]);

      if (!actor || actor.deletedAt) {
        throw new ForbiddenException('Teacher account is not active.');
      }
      if (actor.role !== UserRole.TEACHER && actor.role !== UserRole.ADMIN) {
        throw new ForbiddenException('Teacher or admin access is required.');
      }
      if (!student || student.deletedAt || student.role !== UserRole.STUDENT) {
        throw new NotFoundException('Student not found.');
      }
      if (
        actor.role === UserRole.TEACHER
        && (!actor.tenantId || actor.tenantId !== student.tenantId)
      ) {
        throw new ForbiddenException('Student is outside the teacher tenant.');
      }

      let before = await this.fetchTarget(tx, input.targetType, input.targetId);
      if (!before) throw new NotFoundException('Override target not found.');

      if (
        input.targetType === TeacherOverrideTargetType.MASTERY
        && typeof before.conceptId === 'string'
      ) {
        // Mastery attempt writers use this exact key. Re-read after acquiring
        // the lock so beforeValue is the real value immediately preceding the
        // teacher mutation, not a stale pre-listener snapshot.
        await tx.$queryRaw`
          SELECT pg_advisory_xact_lock(hashtext(${before.userId}), hashtext(${before.conceptId}))
        `;
      } else {
        await tx.$queryRaw`
          SELECT pg_advisory_xact_lock(hashtext(${input.targetType}), hashtext(${input.targetId}))
        `;
      }
      before = await this.fetchTarget(tx, input.targetType, input.targetId);
      if (!before) throw new NotFoundException('Override target not found.');

      if (before.userId !== input.studentUserId) {
        throw new ForbiddenException('Override target does not belong to the student.');
      }
      if (
        actor.role === UserRole.TEACHER
        && before.tenantId !== null
        && before.tenantId !== student.tenantId
      ) {
        throw new ForbiddenException('Override target is outside the teacher tenant.');
      }

      await this.applyToTarget(tx, input.targetType, input.targetId, afterValue);

      return tx.teacherOverride.create({
        data: {
          teacherId: input.teacherId,
          userId: input.studentUserId,
          tenantId: student.tenantId,
          targetType: input.targetType,
          targetId: input.targetId,
          beforeValue: before as Prisma.InputJsonValue,
          afterValue: afterValue as Prisma.InputJsonValue,
          reason,
        },
      });
    });
  }

  listForStudent(studentUserId: string) {
    return this.prisma.teacherOverride.findMany({
      where: { userId: studentUserId },
      orderBy: { createdAt: 'desc' },
    });
  }

  private fetchTarget(
    tx: Prisma.TransactionClient,
    type: TeacherOverrideTargetType,
    id: string,
  ): Promise<TargetRow | null> {
    if (type === TeacherOverrideTargetType.MASTERY) {
      return tx.masteryTrajectory.findUnique({ where: { id } }) as Promise<TargetRow | null>;
    }
    if (type === TeacherOverrideTargetType.ERROR_PATTERN) {
      return tx.errorPatternProfile.findUnique({ where: { id } }) as Promise<TargetRow | null>;
    }
    if (type === TeacherOverrideTargetType.RECOMMENDATION) {
      return tx.recommendationLog.findUnique({ where: { id } }) as Promise<TargetRow | null>;
    }
    throw new BadRequestException('Unsupported override target type.');
  }

  private applyToTarget(
    tx: Prisma.TransactionClient,
    type: TeacherOverrideTargetType,
    id: string,
    after: Record<string, unknown>,
  ) {
    if (type === TeacherOverrideTargetType.MASTERY) {
      return tx.masteryTrajectory.update({
        where: { id },
        data: {
          ...(after.masteryScore !== undefined ? { masteryScore: after.masteryScore as number } : {}),
          ...(after.trend !== undefined ? { trend: after.trend as MasteryTrend } : {}),
          updatedBy: MasteryUpdateSource.TEACHER_OVERRIDE,
        },
      });
    }
    if (type === TeacherOverrideTargetType.ERROR_PATTERN) {
      return tx.errorPatternProfile.update({
        where: { id },
        data: {
          ...(after.status !== undefined ? { status: after.status as ErrorPatternStatus } : {}),
          ...(after.severity !== undefined ? { severity: after.severity as string } : {}),
          ...(after.llmSummary !== undefined ? { llmSummary: after.llmSummary as string } : {}),
        },
      });
    }
    if (type === TeacherOverrideTargetType.RECOMMENDATION) {
      return tx.recommendationLog.update({
        where: { id },
        data: {
          ...(after.reason !== undefined ? { reason: after.reason as string } : {}),
          ...(after.expectedDifficulty !== undefined
            ? { expectedDifficulty: after.expectedDifficulty as number }
            : {}),
        },
      });
    }
    throw new BadRequestException('Unsupported override target type.');
  }

  private validateAfterValue(
    type: TeacherOverrideTargetType,
    raw: Record<string, unknown>,
  ): Record<string, unknown> {
    if (!raw || Array.isArray(raw) || typeof raw !== 'object') {
      throw new BadRequestException('afterValue must be an object.');
    }

    if (type === TeacherOverrideTargetType.MASTERY) {
      this.assertAllowedKeys(raw, ['masteryScore', 'trend']);
      if (raw.masteryScore !== undefined) {
        if (
          typeof raw.masteryScore !== 'number'
          || !Number.isFinite(raw.masteryScore)
          || raw.masteryScore < 0
          || raw.masteryScore > 100
        ) {
          throw new BadRequestException('masteryScore must be between 0 and 100.');
        }
      }
      if (raw.trend !== undefined && !Object.values(MasteryTrend).includes(raw.trend as MasteryTrend)) {
        throw new BadRequestException('Invalid mastery trend.');
      }
    } else if (type === TeacherOverrideTargetType.ERROR_PATTERN) {
      this.assertAllowedKeys(raw, ['status', 'severity', 'llmSummary']);
      if (
        raw.status !== undefined
        && !Object.values(ErrorPatternStatus).includes(raw.status as ErrorPatternStatus)
      ) {
        throw new BadRequestException('Invalid error-pattern status.');
      }
      if (
        raw.severity !== undefined
        && (typeof raw.severity !== 'string' || !['low', 'medium', 'high'].includes(raw.severity))
      ) {
        throw new BadRequestException('severity must be low, medium, or high.');
      }
      if (
        raw.llmSummary !== undefined
        && (typeof raw.llmSummary !== 'string' || raw.llmSummary.length > 4000)
      ) {
        throw new BadRequestException('llmSummary must be a string up to 4000 characters.');
      }
    } else if (type === TeacherOverrideTargetType.RECOMMENDATION) {
      this.assertAllowedKeys(raw, ['reason', 'expectedDifficulty']);
      if (
        raw.reason !== undefined
        && (typeof raw.reason !== 'string' || !raw.reason.trim() || raw.reason.length > 2000)
      ) {
        throw new BadRequestException('Recommendation reason must be 1-2000 characters.');
      }
      if (
        raw.expectedDifficulty !== undefined
        && (!Number.isInteger(raw.expectedDifficulty)
          || (raw.expectedDifficulty as number) < 1
          || (raw.expectedDifficulty as number) > 5)
      ) {
        throw new BadRequestException('expectedDifficulty must be an integer from 1 to 5.');
      }
    } else {
      throw new BadRequestException('Unsupported override target type.');
    }

    if (Object.keys(raw).length === 0) {
      throw new BadRequestException('At least one override field is required.');
    }
    return raw;
  }

  private assertAllowedKeys(raw: Record<string, unknown>, allowed: string[]) {
    const unknown = Object.keys(raw).filter((key) => !allowed.includes(key));
    if (unknown.length > 0) {
      throw new BadRequestException(`Unsupported override field: ${unknown.join(', ')}`);
    }
  }
}
