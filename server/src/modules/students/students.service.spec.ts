import { ForbiddenException } from '@nestjs/common';
import { StudentsService } from './students.service';

function build() {
  const prisma = {
    user: { findUnique: jest.fn(), findUniqueOrThrow: jest.fn(), findMany: jest.fn() },
    weeklyReport: { findMany: jest.fn().mockResolvedValue([{ id: 'report-1' }]) },
  };
  const premiumAccess = {
    requirePremiumAccess: jest.fn().mockResolvedValue(undefined),
  };
  const service = new StudentsService(
    prisma as any,
    {} as any,
    {} as any,
    { hasApprovedAccess: jest.fn() } as any,
    premiumAccess as any,
  );
  return { service, prisma, premiumAccess };
}

describe('StudentsService weekly report entitlement', () => {
  it('checks resource access before looking up the target entitlement', async () => {
    const { service, premiumAccess } = build();
    jest.spyOn(service, 'assertAccess').mockRejectedValue(new ForbiddenException());

    await expect(service.getWeeklyReports('parent-1', 'student-1')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    expect(premiumAccess.requirePremiumAccess).not.toHaveBeenCalled();
  });

  it('uses the student entitlement for an approved parent or teacher request', async () => {
    const { service, prisma, premiumAccess } = build();
    jest.spyOn(service, 'assertAccess').mockResolvedValue({ id: 'student-1' } as any);

    await expect(service.getWeeklyReports('parent-1', 'student-1')).resolves.toEqual([
      { id: 'report-1' },
    ]);
    expect(premiumAccess.requirePremiumAccess).toHaveBeenCalledWith(
      'student-1',
      'weekly_reports',
    );
    expect(premiumAccess.requirePremiumAccess).not.toHaveBeenCalledWith(
      'parent-1',
      expect.anything(),
    );
    expect(prisma.weeklyReport.findMany).toHaveBeenCalledWith({
      where: { userId: 'student-1' },
      orderBy: { weekStart: 'desc' },
    });
  });

  it('does not query reports when the target student is not entitled', async () => {
    const { service, prisma, premiumAccess } = build();
    jest.spyOn(service, 'assertAccess').mockResolvedValue({ id: 'student-1' } as any);
    premiumAccess.requirePremiumAccess.mockRejectedValue(new ForbiddenException({
      error: 'PremiumRequired',
    }));

    await expect(service.getWeeklyReports('teacher-1', 'student-1')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    expect(prisma.weeklyReport.findMany).not.toHaveBeenCalled();
  });
});
