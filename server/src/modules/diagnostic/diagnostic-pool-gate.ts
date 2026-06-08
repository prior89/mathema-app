import { CountryCode, GradeLevel, KoreanGrade, PrismaClient } from '@prisma/client';

/** Minimum READY DIAGNOSTIC sets per grade before enabling adaptive placement (PR-00 gate). */
export const MIN_READY_DIAGNOSTIC_SETS = 8;

/** NCERT grades used at onboarding — mirrors diagnostic.service.ts. */
export const ONBOARDING_NCERT_GRADES: GradeLevel[] = [
  'CLASS_7',
  'CLASS_8',
  'CLASS_9',
  'CLASS_10',
  'CLASS_11',
  'CLASS_12',
];

/** NCERT → Korean grade mapping — same as diagnostic.service.ts. */
export const NCERT_TO_KR_GRADE: Record<GradeLevel, KoreanGrade> = {
  CLASS_7: 'MIDDLE_1',
  CLASS_8: 'MIDDLE_2',
  CLASS_9: 'MIDDLE_3',
  CLASS_10: 'HIGH_1',
  CLASS_11: 'HIGH_2',
  CLASS_12: 'HIGH_3',
};

export type DiagnosticPoolGradeKey =
  | { country: 'IN'; grade: GradeLevel }
  | { country: 'KR'; grade: KoreanGrade };

export interface DiagnosticPoolGateRow {
  country: CountryCode;
  grade: string;
  readyCount: number;
  required: number;
  ok: boolean;
}

export interface DiagnosticPoolGateResult {
  ok: boolean;
  rows: DiagnosticPoolGateRow[];
  failures: DiagnosticPoolGateRow[];
}

export function expectedDiagnosticPoolGrades(): DiagnosticPoolGradeKey[] {
  const inRows = ONBOARDING_NCERT_GRADES.map(
    (grade) => ({ country: 'IN' as const, grade }),
  );
  const krGrades = [...new Set(Object.values(NCERT_TO_KR_GRADE))];
  const krRows = krGrades.map(
    (grade) => ({ country: 'KR' as const, grade }),
  );
  return [...inRows, ...krRows];
}

/** Count READY DIAGNOSTIC LessonProblemSet rows for one country+grade bucket. */
export async function countReadyDiagnosticSets(
  prisma: Pick<PrismaClient, 'lessonProblemSet'>,
  key: DiagnosticPoolGradeKey,
): Promise<number> {
  return prisma.lessonProblemSet.count({
    where: {
      country: key.country,
      setType: 'DIAGNOSTIC',
      status: 'READY',
      retiredAt: null,
      ...(key.country === 'IN'
        ? { conceptLesson: { ncertClass: key.grade } }
        : { koreanConceptLesson: { koreanGrade: key.grade } }),
    },
  });
}

/** Evaluate all onboarding grades against MIN_READY_DIAGNOSTIC_SETS. */
export async function evaluateDiagnosticPoolGate(
  prisma: Pick<PrismaClient, 'lessonProblemSet'>,
  minReady = MIN_READY_DIAGNOSTIC_SETS,
): Promise<DiagnosticPoolGateResult> {
  const rows: DiagnosticPoolGateRow[] = [];

  for (const key of expectedDiagnosticPoolGrades()) {
    const readyCount = await countReadyDiagnosticSets(prisma, key);
    rows.push({
      country: key.country,
      grade: key.grade,
      readyCount,
      required: minReady,
      ok: readyCount >= minReady,
    });
  }

  const failures = rows.filter((r) => !r.ok);
  return { ok: failures.length === 0, rows, failures };
}

export function formatDiagnosticPoolGateReport(result: DiagnosticPoolGateResult): string {
  const lines = ['DIAGNOSTIC pool gate (READY sets per grade):'];
  for (const row of result.rows) {
    const mark = row.ok ? 'OK' : 'FAIL';
    lines.push(
      `  [${mark}] ${row.country} ${row.grade}: ${row.readyCount}/${row.required}`,
    );
  }
  if (!result.ok) {
    lines.push('');
    lines.push(
      `Gate FAILED — ${result.failures.length} grade(s) below ${result.failures[0]?.required ?? MIN_READY_DIAGNOSTIC_SETS} READY DIAGNOSTIC sets.`,
    );
    lines.push('Run: npx ts-node scripts/backfill-lesson-problem-set.ts');
  } else {
    lines.push('');
    lines.push('Gate PASSED — adaptive diagnostic (PR-05) may be enabled.');
  }
  return lines.join('\n');
}