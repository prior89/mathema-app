import { Prisma } from '@prisma/client';
import type { PrismaService } from '../../infrastructure/prisma/prisma.service';

/** Built-in dogfood / dev / seed accounts — always excluded from learning KPIs. */
const BUILTIN_EXCLUDE_EMAILS = [
  'admin@mathema.app',
  'polopot123@gmail.com',
  'polopot12@gmail.com',
];

/** E2E throwaway users created by app/e2e/helpers.ts */
const E2E_EMAIL_RE = /^e2e-.+@example\.com$/i;

export function metricsExcludeEmailPatterns(): string[] {
  const fromEnv = [
    process.env.METRICS_EXCLUDE_EMAILS,
    process.env.ADMIN_EMAILS,
    process.env.SEED_USER_EMAIL,
  ]
    .filter(Boolean)
    .flatMap((raw) => raw!.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean));

  return [...new Set([...BUILTIN_EXCLUDE_EMAILS.map((e) => e.toLowerCase()), ...fromEnv])];
}

export function isMetricsExcludedEmail(email: string): boolean {
  const lower = email.toLowerCase();
  if (E2E_EMAIL_RE.test(lower)) return true;
  return metricsExcludeEmailPatterns().includes(lower);
}

export function isMetricsExcludedUser(user: {
  id: string;
  email: string;
  role: string;
}): boolean {
  if (user.role !== 'STUDENT') return true;
  return isMetricsExcludedEmail(user.email);
}

/** Resolve user IDs to drop from all learning-effectiveness aggregates. */
export async function resolveMetricsExcludedUserIds(
  prisma: Pick<PrismaService, 'user'>,
): Promise<string[]> {
  const users = await prisma.user.findMany({
    where: { deletedAt: null },
    select: { id: true, email: true, role: true },
  });
  return users.filter(isMetricsExcludedUser).map((u) => u.id);
}

/** Prisma filter for tables with a required userId column. */
export function userIdNotExcluded(
  excludedIds: string[],
): { userId?: { notIn: string[] } } {
  if (excludedIds.length === 0) return {};
  return { userId: { notIn: excludedIds } };
}

/** Prisma filter for tables where userId may be null (keep anonymous rows). */
export function actorNotExcluded(excludedIds: string[]) {
  if (excludedIds.length === 0) return {};
  return {
    OR: [{ userId: null }, { userId: { notIn: excludedIds } }],
  };
}

/** Extra SQL fragment for raw queries — empty when nothing to exclude. */
export function sqlUserIdNotIn(excludedIds: string[]): Prisma.Sql {
  if (excludedIds.length === 0) return Prisma.empty;
  return Prisma.sql`AND "userId" NOT IN (${Prisma.join(excludedIds)})`;
}