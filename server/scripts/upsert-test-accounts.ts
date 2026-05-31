/**
 * Upsert the two dogfood accounts used for KR/IN app-bundle testing.
 *
 * This is an ops script, not an app feature:
 * - password is read from TEST_ACCOUNT_PASSWORD (never hard-coded)
 * - existing users keep role/name/grade/progress; only password/country/
 *   emailVerifiedAt/deletedAt are updated
 * - DATA_PROCESSING consent is ensured so the normal signup invariant holds
 *
 * Usage:
 *   TEST_ACCOUNT_PASSWORD='...' npx ts-node scripts/upsert-test-accounts.ts
 */
import * as bcrypt from 'bcrypt';
import { ConsentKind, CountryCode, PrismaClient, UserRole } from '@prisma/client';
import { BCRYPT_COST } from '../src/common/utils/auth-constants';
import { CURRENT_POLICY_VERSION } from '../src/modules/privacy/privacy.service';

const prisma = new PrismaClient();

const ACCOUNTS: Array<{ email: string; name: string; country: CountryCode }> = [
  { email: 'polopot123@gmail.com', name: 'KR Test', country: CountryCode.KR },
  { email: 'polopot12@gmail.com', name: 'IN Test', country: CountryCode.IN },
];

async function ensureDataProcessingConsent(userId: string): Promise<'kept' | 'created'> {
  const current = await prisma.consent.findFirst({
    where: { userId, kind: ConsentKind.DATA_PROCESSING },
    orderBy: { grantedAt: 'desc' },
  });
  if (current && current.revokedAt === null && current.policyVersion === CURRENT_POLICY_VERSION) {
    return 'kept';
  }
  await prisma.consent.create({
    data: {
      userId,
      kind: ConsentKind.DATA_PROCESSING,
      policyVersion: CURRENT_POLICY_VERSION,
      ipAddress: 'ops-script',
      userAgent: 'upsert-test-accounts',
    },
  });
  return 'created';
}

async function main() {
  const password = process.env.TEST_ACCOUNT_PASSWORD;
  if (!password || password.length < 8) {
    throw new Error('TEST_ACCOUNT_PASSWORD must be set and at least 8 characters');
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
  const now = new Date();

  for (const account of ACCOUNTS) {
    const email = account.email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    const user = await prisma.user.upsert({
      where: { email },
      create: {
        email,
        passwordHash,
        name: account.name,
        role: UserRole.STUDENT,
        examDate: new Date('2027-02-14'),
        targetGrade: 3,
        gradeLevel: null,
        country: account.country,
        emailVerifiedAt: now,
      },
      update: {
        passwordHash,
        country: account.country,
        emailVerifiedAt: now,
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        country: true,
        role: true,
        emailVerifiedAt: true,
      },
    });

    const consent = await ensureDataProcessingConsent(user.id);
    const tokens = await prisma.emailVerificationToken.updateMany({
      where: { email, usedAt: null },
      data: { usedAt: now },
    });

    console.log(
      [
        `[ok] ${user.email}`,
        existing ? 'existing' : 'created',
        `country=${user.country}`,
        `role=${user.role}`,
        `verifiedAt=${user.emailVerifiedAt?.toISOString()}`,
        `dataProcessing=${consent}`,
        `staleVerifyTokensClosed=${tokens.count}`,
      ].join(' '),
    );
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
