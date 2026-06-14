/**
 * UsersService — updateProfile role guard + pushReminders persistence (PR-04).
 */
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { UsersService } from './users.service';

type RepoMock = {
  findById: jest.Mock;
  update: jest.Mock;
};

function mockUser(over: Partial<{
  id: string;
  role: UserRole;
  examDate: Date;
  birthDate: Date | null;
  guardianConsentVerifiedAt: Date | null;
}> = {}) {
  return {
    id: 'user-1',
    role: 'STUDENT' as UserRole,
    examDate: new Date('2026-12-01'),
    passwordHash: 'hash',
    birthDate: null as Date | null,
    guardianConsentVerifiedAt: null as Date | null,
    ...over,
  };
}

function build(over: { user?: ReturnType<typeof mockUser> | null } = {}) {
  const repo: RepoMock = {
    findById: jest.fn().mockResolvedValue(over.user === null ? null : (over.user ?? mockUser())),
    update: jest.fn().mockResolvedValue(undefined),
  };
  const guardianConsent = {
    ensurePendingForStudent: jest.fn().mockResolvedValue({ required: false }),
  };
  const svc = new UsersService(repo as never, guardianConsent as never);
  return { svc, repo, guardianConsent };
}

describe('UsersService.updateProfile', () => {
  it('throws NotFound when user missing', async () => {
    const { svc } = build({ user: null });
    await expect(svc.updateProfile('missing', { name: 'A' })).rejects.toBeInstanceOf(NotFoundException);
  });

  it('persists pushRemindersEnabled', async () => {
    const { svc, repo } = build();
    await svc.updateProfile('user-1', { pushRemindersEnabled: true });
    expect(repo.update).toHaveBeenCalledWith('user-1', { pushRemindersEnabled: true });
  });

  it('allows STUDENT self-assignment', async () => {
    const { svc, repo } = build();
    await svc.updateProfile('user-1', { role: 'STUDENT' });
    expect(repo.update).toHaveBeenCalledWith('user-1', { role: 'STUDENT' });
  });

  it('blocks PARENT role elevation (403)', async () => {
    const { svc } = build();
    await expect(svc.updateProfile('user-1', { role: 'PARENT' })).rejects.toMatchObject({
      response: { code: 'role_elevation_blocked' },
    });
    await expect(svc.updateProfile('user-1', { role: 'PARENT' })).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('blocks TEACHER role elevation (403)', async () => {
    const { svc } = build();
    await expect(svc.updateProfile('user-1', { role: 'TEACHER' })).rejects.toMatchObject({
      response: { code: 'role_elevation_blocked' },
    });
  });

  it('blocks ADMIN self-assignment (403)', async () => {
    const { svc } = build();
    await expect(svc.updateProfile('user-1', { role: 'ADMIN' as UserRole })).rejects.toMatchObject({
      response: { code: 'role_elevation_blocked' },
    });
  });

  it('blocks role change for non-STUDENT accounts', async () => {
    const { svc } = build({ user: mockUser({ role: 'PARENT' }) });
    await expect(svc.updateProfile('user-1', { role: 'STUDENT' })).rejects.toMatchObject({
      response: { code: 'role_change_blocked' },
    });
  });

  it('sets birthDate on first declaration', async () => {
    const { svc, repo } = build({ user: mockUser({ birthDate: null }) });
    await svc.updateProfile('user-1', { birthDate: '2010-03-15T00:00:00.000Z' });
    expect(repo.update).toHaveBeenCalledWith('user-1', {
      birthDate: new Date('2010-03-15T00:00:00.000Z'),
    });
  });

  it('allows DOB correction before guardian consent is verified', async () => {
    const { svc, repo } = build({
      user: mockUser({
        birthDate: new Date('2012-01-01'),
        guardianConsentVerifiedAt: null,
      }),
    });
    await svc.updateProfile('user-1', { birthDate: '2010-03-15T00:00:00.000Z' });
    expect(repo.update).toHaveBeenCalledWith('user-1', {
      birthDate: new Date('2010-03-15T00:00:00.000Z'),
    });
  });

  it('blocks DOB change after guardian consent is verified (403)', async () => {
    const { svc } = build({
      user: mockUser({
        birthDate: new Date('2012-01-01'),
        guardianConsentVerifiedAt: new Date('2026-06-14T10:00:00Z'),
      }),
    });
    await expect(
      svc.updateProfile('user-1', { birthDate: '2010-03-15T00:00:00.000Z' }),
    ).rejects.toMatchObject({ response: { code: 'birth_date_immutable' } });
  });
});