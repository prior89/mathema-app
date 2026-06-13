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
  const service = new GuardianConsentService(prisma as never, mail as never);
  return { service, prisma, mail };
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
});
