import { BadRequestException } from '@nestjs/common';
import { GuardianConsentMethod, GuardianConsentStatus, UserRole } from '@prisma/client';
import { GuardianConsentService } from './guardian-consent.service';

function minorBirthDate(): Date {
  return new Date(Date.UTC(new Date().getUTCFullYear() - 17, 0, 1));
}

function build() {
  const prisma = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn().mockResolvedValue({}),
    },
    guardianConsentRequest: {
      upsert: jest.fn(),
      update: jest.fn().mockResolvedValue({}),
    },
    guardianConsentToken: {
      create: jest.fn().mockResolvedValue({ id: 'token-new' }),
      findUnique: jest.fn(),
      update: jest.fn().mockResolvedValue({}),
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
    $transaction: jest.fn(async (operations: Array<Promise<unknown>>) => Promise.all(operations)),
  };
  const mail = {
    sendGuardianConsent: jest.fn().mockResolvedValue(undefined),
  };
  const pass = {
    isEnabled: jest.fn().mockReturnValue(true),
    providerName: jest.fn().mockReturnValue('mock'),
    isMock: jest.fn().mockReturnValue(true),
    start: jest.fn().mockResolvedValue({ authUrl: 'http://localhost:5173/guardian-consent/pass?tx=tx' }),
    verify: jest.fn().mockResolvedValue({ ok: true, name: 'Mock Guardian', isAdult: true, ci: 'CI-1' }),
  };
  const service = new GuardianConsentService(prisma as never, mail as never, pass as never);
  return { service, prisma, mail, pass };
}

describe('GuardianConsentService flow contract', () => {
  it('invalidates older unused links before sending a replacement', async () => {
    const { service, prisma, mail } = build();
    prisma.user.findUnique.mockResolvedValue({
      email: 'student@example.com',
      name: 'Student',
      role: UserRole.STUDENT,
      birthDate: minorBirthDate(),
      guardianConsentVerifiedAt: null,
      country: 'IN',
    });
    prisma.guardianConsentRequest.upsert.mockResolvedValue({
      id: 'request-1',
      method: GuardianConsentMethod.IN_EMAIL_OTP,
    });

    await service.requestParentVerification('student-1', {
      parentEmail: 'parent@example.com',
    });

    expect(prisma.guardianConsentToken.updateMany).toHaveBeenCalledWith({
      where: { requestId: 'request-1', usedAt: null },
      data: { usedAt: expect.any(Date) },
    });
    expect(prisma.guardianConsentToken.create).toHaveBeenCalledWith({
      data: {
        requestId: 'request-1',
        tokenHash: expect.any(String),
        expiresAt: expect.any(Date),
      },
    });
    expect(mail.sendGuardianConsent).toHaveBeenCalledTimes(1);
  });

  it('invalidates a newly issued link when email delivery fails', async () => {
    const { service, prisma, mail } = build();
    prisma.user.findUnique.mockResolvedValue({
      email: 'student@example.com',
      name: 'Student',
      role: UserRole.STUDENT,
      birthDate: minorBirthDate(),
      guardianConsentVerifiedAt: null,
      country: 'IN',
    });
    prisma.guardianConsentRequest.upsert.mockResolvedValue({
      id: 'request-1',
      method: GuardianConsentMethod.IN_EMAIL_OTP,
    });
    mail.sendGuardianConsent.mockRejectedValue(new Error('delivery failed'));

    await expect(service.requestParentVerification('student-1', {
      parentEmail: 'parent@example.com',
    })).rejects.toBeInstanceOf(BadRequestException);

    expect(prisma.guardianConsentToken.update).toHaveBeenCalledWith({
      where: { id: 'token-new' },
      data: { usedAt: expect.any(Date) },
    });
  });

  it('records approval for the student without creating a guardian session', async () => {
    const { service, prisma } = build();
    prisma.guardianConsentToken.findUnique.mockResolvedValue({
      id: 'token-1',
      requestId: 'request-1',
      usedAt: null,
      expiresAt: new Date(Date.now() + 60_000),
      request: {
        status: GuardianConsentStatus.PENDING,
        studentUserId: 'student-1',
        student: { id: 'student-1' },
      },
    });

    await expect(service.verifyByToken('raw-token')).resolves.toEqual({ ok: true });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'student-1' },
      data: { guardianConsentVerifiedAt: expect.any(Date) },
    });
  });

  it('KR PASS: starts a session and returns a txId + provider auth URL', async () => {
    const { service, prisma, pass } = build();
    prisma.user.findUnique.mockResolvedValue({
      name: 'KR Student',
      role: UserRole.STUDENT,
      birthDate: new Date(Date.UTC(new Date().getUTCFullYear() - 12, 0, 1)), // under 14
      guardianConsentVerifiedAt: null,
      country: 'KR',
    });
    prisma.guardianConsentRequest.upsert.mockResolvedValue({ id: 'req-kr', method: GuardianConsentMethod.KR_PASS });

    const res = await service.startPassVerification('kr-student');
    expect(res).toMatchObject({ method: GuardianConsentMethod.KR_PASS, provider: 'mock' });
    expect((res as { txId: string }).txId.length).toBeGreaterThanOrEqual(16);
    expect(pass.start).toHaveBeenCalledTimes(1);
    expect(prisma.guardianConsentToken.create).toHaveBeenCalled();
  });

  it('KR PASS: start is rejected when PASS is disabled', async () => {
    const { service, pass } = build();
    pass.isEnabled.mockReturnValue(false);
    await expect(service.startPassVerification('kr-student')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('KR PASS: complete verifies an adult guardian and sets consent', async () => {
    const { service, prisma } = build();
    prisma.guardianConsentToken.findUnique.mockResolvedValue({
      id: 'tok-kr',
      usedAt: null,
      expiresAt: new Date(Date.now() + 60_000),
      request: {
        id: 'req-kr',
        studentUserId: 'kr-student',
        status: GuardianConsentStatus.PENDING,
        method: GuardianConsentMethod.KR_PASS,
      },
    });

    await expect(service.completePassVerification('tx-raw-token-123456')).resolves.toEqual({ ok: true });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'kr-student' },
      data: { guardianConsentVerifiedAt: expect.any(Date) },
    });
  });

  it('KR PASS: complete rejects a non-adult verification result', async () => {
    const { service, prisma, pass } = build();
    pass.verify.mockResolvedValue({ ok: true, name: 'Minor', isAdult: false, ci: 'CI-2' });
    prisma.guardianConsentToken.findUnique.mockResolvedValue({
      id: 'tok-kr',
      usedAt: null,
      expiresAt: new Date(Date.now() + 60_000),
      request: { id: 'req-kr', studentUserId: 'kr-student', status: GuardianConsentStatus.PENDING, method: GuardianConsentMethod.KR_PASS },
    });
    await expect(service.completePassVerification('tx-raw-token-123456')).rejects.toBeInstanceOf(BadRequestException);
  });
});
