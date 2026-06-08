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

function mockUser(over: Partial<{ id: string; role: UserRole; examDate: Date }> = {}) {
  return {
    id: 'user-1',
    role: 'STUDENT' as UserRole,
    examDate: new Date('2026-12-01'),
    passwordHash: 'hash',
    ...over,
  };
}

function build(over: { user?: ReturnType<typeof mockUser> | null } = {}) {
  const repo: RepoMock = {
    findById: jest.fn().mockResolvedValue(over.user === null ? null : (over.user ?? mockUser())),
    update: jest.fn().mockResolvedValue(undefined),
  };
  const svc = new UsersService(repo as never);
  return { svc, repo };
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
});