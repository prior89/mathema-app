import { ConsentKind, CountryCode, UserRole } from '@prisma/client';
import { PrivacyService } from './privacy.service';

describe('PrivacyService minor optional-consent guard', () => {
  function build(ageYears: number | null, overrides: { isGuest?: boolean } = {}) {
    const now = new Date();
    const birthDate = ageYears == null
      ? null
      : new Date(Date.UTC(now.getUTCFullYear() - ageYears, 0, 1));
    const prisma = {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          role: UserRole.STUDENT,
          birthDate,
          country: CountryCode.KR,
          isGuest: overrides.isGuest ?? false,
        }),
      },
      consent: {
        findFirst: jest.fn(),
        create: jest.fn(),
        createMany: jest.fn(),
      },
    };
    return { service: new PrivacyService(prisma as never), prisma };
  }

  it('rejects self-granted optional consent for a guardian-gated Korean student', async () => {
    const { service, prisma } = build(12);

    await expect(service.grant('student-1', ConsentKind.ANALYTICS)).rejects.toMatchObject({
      response: { code: 'minor_optional_consent_requires_guardian' },
    });
    expect(prisma.consent.create).not.toHaveBeenCalled();
  });

  it('rejects optional flags passed through initial registration for the same student', async () => {
    const { service, prisma } = build(12);

    await expect(service.grantInitial('student-1', { marketing: true })).rejects.toMatchObject({
      response: { code: 'minor_optional_consent_requires_guardian' },
    });
    expect(prisma.consent.createMany).not.toHaveBeenCalled();
  });

  it('fails closed while a student age profile is missing', async () => {
    const { service, prisma } = build(null);

    await expect(service.grant('student-1', ConsentKind.AI_TRAINING)).rejects.toMatchObject({
      response: { code: 'minor_optional_consent_requires_guardian' },
    });
    expect(prisma.consent.create).not.toHaveBeenCalled();
  });

  it('rejects optional consent from a guest account', async () => {
    const { service, prisma } = build(20, { isGuest: true });

    await expect(service.grantInitial('guest-1', { analytics: true })).rejects.toMatchObject({
      response: { code: 'minor_optional_consent_requires_guardian' },
    });
    expect(prisma.consent.createMany).not.toHaveBeenCalled();
  });

  it('still allows an age-profiled adult student to opt in', async () => {
    const { service, prisma } = build(20);
    prisma.consent.findFirst.mockResolvedValue(null);

    await service.grant('student-1', ConsentKind.ANALYTICS);

    expect(prisma.consent.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ kind: ConsentKind.ANALYTICS }),
    }));
  });
});
