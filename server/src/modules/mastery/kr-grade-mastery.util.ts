import { GradeLevel } from '@prisma/client';
import { Lang } from '../../common/i18n/current-lang.decorator';
import { GRADE_LABEL_EN, GRADE_LABEL_KO, GRADE_LEVELS } from '../../common/enums/unit.enum';

const GRADE_ORDER: Record<GradeLevel, number> = {
  CLASS_7: 7,
  CLASS_8: 8,
  CLASS_9: 9,
  CLASS_10: 10,
  CLASS_11: 11,
  CLASS_12: 12,
};

export interface KrGradeTrajectoryRow {
  masteryScore: number;
  evidenceCount: number;
  concept: { gradeLevel: GradeLevel | null };
}

export function krGradeLabel(grade: GradeLevel | null, lang: Lang): string {
  if (!grade) return lang === 'ko' ? '기타' : 'Other';
  if (lang === 'ko') return GRADE_LABEL_KO[grade];
  return GRADE_LABEL_EN[grade];
}

/** Aggregate concept-level trajectories into grade-level rows for KR users.
 *  Avoids surfacing NCERT unit names while still giving a meaningful heatmap. */
export function aggregateKrGradeMastery(
  trajectories: KrGradeTrajectoryRow[],
  lang: Lang,
): Array<{ subject: string; value: number; unitId: string; order: number }> {
  const buckets = new Map<string, { sum: number; count: number; grade: GradeLevel | null }>();

  for (const t of trajectories) {
    const grade = t.concept.gradeLevel;
    const key = grade ?? 'OTHER';
    const bucket = buckets.get(key) ?? { sum: 0, count: 0, grade };
    bucket.sum += t.masteryScore;
    bucket.count += 1;
    buckets.set(key, bucket);
  }

  return [...buckets.entries()]
    .map(([key, { sum, count, grade }]) => ({
      subject: krGradeLabel(grade, lang),
      value: Math.round(sum / count),
      unitId: `kr-grade:${key}`,
      order: grade ? GRADE_ORDER[grade] : 99,
    }))
    .sort((a, b) => a.order - b.order);
}

/** Grade order for stable sorting when building study-balance rows. */
export function krGradeSortOrder(grade: GradeLevel | null): number {
  if (!grade) return 99;
  const idx = (GRADE_LEVELS as readonly string[]).indexOf(grade);
  return idx >= 0 ? idx : 99;
}