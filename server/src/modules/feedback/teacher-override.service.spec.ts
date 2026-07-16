import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { TeacherOverrideTargetType, UserRole } from '@prisma/client';
import { TeacherOverrideService } from './teacher-override.service';

const teacherId = '11111111-1111-4111-8111-111111111111';
const studentId = '22222222-2222-4222-8222-222222222222';
const targetId = '33333333-3333-4333-8333-333333333333';

function build(options: {
  actorRole?: UserRole;
  actorTenant?: string | null;
  studentTenant?: string | null;
  targetUserId?: string;
  targetTenant?: string | null;
  target?: object | null;
} = {}) {
  const actor = {
    role: options.actorRole ?? UserRole.TEACHER,
    tenantId: options.actorTenant === undefined ? 'tenant-a' : options.actorTenant,
    deletedAt: null,
  };
  const student = {
    role: UserRole.STUDENT,
    tenantId: options.studentTenant === undefined ? 'tenant-a' : options.studentTenant,
    deletedAt: null,
  };
  const target = options.target === null ? null : {
    id: targetId,
    userId: options.targetUserId ?? studentId,
    tenantId: options.targetTenant === undefined ? 'tenant-a' : options.targetTenant,
    masteryScore: 42,
    conceptId: 'concept-1',
    trend: 'STABLE',
    ...(options.target ?? {}),
  };

  const tx = {
    $queryRaw: jest.fn().mockResolvedValue([]),
    user: {
      findUnique: jest.fn(({ where }: { where: { id: string } }) =>
        Promise.resolve(where.id === teacherId ? actor : student)),
    },
    masteryTrajectory: {
      findUnique: jest.fn().mockResolvedValue(target),
      update: jest.fn().mockResolvedValue({ id: targetId }),
    },
    errorPatternProfile: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    recommendationLog: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    teacherOverride: {
      create: jest.fn().mockResolvedValue({ id: 'override-1' }),
    },
  };
  const prisma = {
    $transaction: jest.fn((callback: (client: typeof tx) => unknown) => callback(tx)),
    teacherOverride: { findMany: jest.fn() },
  };
  return { service: new TeacherOverrideService(prisma as never), prisma, tx };
}

function input(afterValue: Record<string, unknown> = { masteryScore: 70 }) {
  return {
    teacherId,
    studentUserId: studentId,
    targetType: TeacherOverrideTargetType.MASTERY,
    targetId,
    afterValue,
    reason: '  Classroom observation  ',
  };
}

describe('TeacherOverrideService', () => {
  it('allows a same-tenant teacher and writes mutation + audit atomically', async () => {
    const { service, prisma, tx } = build();

    await expect(service.apply(input())).resolves.toEqual({ id: 'override-1' });

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(tx.$queryRaw).toHaveBeenCalledTimes(1);
    expect(tx.masteryTrajectory.findUnique).toHaveBeenCalledTimes(2);
    expect(tx.masteryTrajectory.update).toHaveBeenCalledWith({
      where: { id: targetId },
      data: { masteryScore: 70, updatedBy: 'TEACHER_OVERRIDE' },
    });
    expect(tx.teacherOverride.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        teacherId,
        userId: studentId,
        tenantId: 'tenant-a',
        targetId,
        reason: 'Classroom observation',
        afterValue: { masteryScore: 70 },
      }),
    });
  });

  it('rejects ordinary students and parents before reading the target', async () => {
    for (const role of [UserRole.STUDENT, UserRole.PARENT]) {
      const { service, tx } = build({ actorRole: role });
      await expect(service.apply(input())).rejects.toBeInstanceOf(ForbiddenException);
      expect(tx.masteryTrajectory.findUnique).not.toHaveBeenCalled();
    }
  });

  it('rejects a teacher with no tenant or a different tenant', async () => {
    const missing = build({ actorTenant: null });
    await expect(missing.service.apply(input())).rejects.toBeInstanceOf(ForbiddenException);

    const different = build({ actorTenant: 'tenant-b' });
    await expect(different.service.apply(input())).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('rejects a target row that belongs to another student', async () => {
    const { service, tx } = build({ targetUserId: '44444444-4444-4444-8444-444444444444' });
    await expect(service.apply(input())).rejects.toBeInstanceOf(ForbiddenException);
    expect(tx.masteryTrajectory.update).not.toHaveBeenCalled();
  });

  it('allows an admin across tenants but still requires target ownership', async () => {
    const { service, tx } = build({
      actorRole: UserRole.ADMIN,
      actorTenant: null,
      studentTenant: 'tenant-b',
      targetTenant: 'tenant-b',
    });
    await service.apply(input({ trend: 'UP' }));
    expect(tx.masteryTrajectory.update).toHaveBeenCalledWith({
      where: { id: targetId },
      data: { trend: 'UP', updatedBy: 'TEACHER_OVERRIDE' },
    });
  });

  it('returns not found for a missing target', async () => {
    const { service } = build({ target: null });
    await expect(service.apply(input())).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rejects unknown, empty, and out-of-range mutation fields', async () => {
    const { service, prisma } = build();
    await expect(service.apply(input({ evidenceCount: 999 }))).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.apply(input({ masteryScore: 101 }))).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.apply(input({}))).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});
