/**
 * ISO week boundaries with country-aware timezone.
 *
 * Both KR and IN use Monday-start ISO 8601 week. The only country-specific
 * piece is the timezone offset used to decide which calendar day a UTC
 * timestamp belongs to:
 *   KR  -> Asia/Seoul   (UTC+09:00, no DST)
 *   IN  -> Asia/Kolkata (UTC+05:30, no DST)
 *
 * No external timezone library required because both target timezones are
 * fixed offsets. If we ever add a country with DST the offset table needs to
 * become a luxon/date-fns-tz call.
 */

const TIMEZONE_OFFSET_MINUTES: Record<string, number> = {
  KR: 540, // UTC+09:00
  IN: 330, // UTC+05:30
};

const TIMEZONE_NAME: Record<string, string> = {
  KR: 'Asia/Seoul',
  IN: 'Asia/Kolkata',
};

const DEFAULT_COUNTRY = 'IN';

export interface WeekBoundaries {
  /** UTC instant of Monday 00:00 in the user's local timezone. */
  weekStart: Date;
  /** UTC instant of next Monday 00:00 (exclusive upper bound). */
  weekEnd: Date;
  /**
   * Local Monday calendar date represented at UTC midnight.
   *
   * Use this value for Prisma fields backed by PostgreSQL `date` (`@db.Date`).
   * It is intentionally different from `weekStart`, which is the real UTC
   * instant used for timestamp queries.
   */
  calendarWeekStart: Date;
  /** Local next-Monday calendar date for `@db.Date` storage. */
  calendarWeekEnd: Date;
  /** ISO 8601 label: YYYY-Www (e.g. '2026-W23'). */
  isoWeek: string;
  /** IANA timezone name used to compute the boundaries. */
  timezone: string;
}

function offsetMinutes(country: string | null | undefined): number {
  const key = country ?? DEFAULT_COUNTRY;
  return TIMEZONE_OFFSET_MINUTES[key] ?? TIMEZONE_OFFSET_MINUTES[DEFAULT_COUNTRY];
}

function timezoneName(country: string | null | undefined): string {
  const key = country ?? DEFAULT_COUNTRY;
  return TIMEZONE_NAME[key] ?? TIMEZONE_NAME[DEFAULT_COUNTRY];
}

/** ISO 8601 week label, computed from a local-time date. */
function computeIsoWeekLabel(localDate: Date): string {
  const d = new Date(
    Date.UTC(localDate.getUTCFullYear(), localDate.getUTCMonth(), localDate.getUTCDate()),
  );
  // ISO weeks start on Monday and are numbered relative to the year that
  // contains the week's Thursday.
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

/**
 * The ISO week that contains `now` in the given country's local timezone.
 *
 * `weekStart` and `weekEnd` are UTC instants suitable for Prisma `gte` / `lt`
 * filters. `weekEnd` is exclusive (next Monday 00:00 local time).
 * `calendarWeekStart` and `calendarWeekEnd` preserve the corresponding local
 * calendar dates for PostgreSQL `date` columns.
 */
export function getCurrentWeek(
  country: string | null | undefined,
  now: Date = new Date(),
): WeekBoundaries {
  const offset = offsetMinutes(country);
  const localNow = new Date(now.getTime() + offset * 60_000);

  // 0=Sun, 1=Mon, ... 6=Sat. ISO weeks start on Monday.
  const dayOfWeek = localNow.getUTCDay();
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  // Monday 00:00 in local time (still expressed as a UTC Date, but interpreted
  // as the user's calendar wall clock).
  const weekStartLocal = new Date(localNow);
  weekStartLocal.setUTCDate(localNow.getUTCDate() - daysFromMonday);
  weekStartLocal.setUTCHours(0, 0, 0, 0);

  const weekEndLocal = new Date(weekStartLocal);
  weekEndLocal.setUTCDate(weekStartLocal.getUTCDate() + 7);

  // Convert local-time-as-UTC back to actual UTC for DB queries.
  const weekStart = new Date(weekStartLocal.getTime() - offset * 60_000);
  const weekEnd = new Date(weekEndLocal.getTime() - offset * 60_000);

  return {
    weekStart,
    weekEnd,
    calendarWeekStart: weekStartLocal,
    calendarWeekEnd: weekEndLocal,
    isoWeek: computeIsoWeekLabel(weekStartLocal),
    timezone: timezoneName(country),
  };
}
