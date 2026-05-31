/* Curriculum metadata seed + backfill — H8b of 2026-05-24 multi-country structure.
 *
 * What this does (idempotent — safe to re-run):
 *   1. Reads DISTINCT (ncertClass) from ConceptLesson → upserts an IN/NCERT
 *      Curriculum row per class (Class 7 .. Class 12).
 *   2. Reads DISTINCT (koreanGrade, koreanSubject) from KoreanConceptLesson
 *      → upserts a KR Curriculum row per combo (e.g. {MIDDLE_1, MIDDLE_MATH_1}
 *      → "중1 수학 1", {HIGH_2, HIGH_ALGEBRA} → "고2 대수").
 *   3. Backfills ConceptLesson.curriculumId for every row.
 *   4. Backfills KoreanConceptLesson.curriculumId for every row.
 *
 * Why: Curriculum is a metadata index layer (Option C of the multi-country
 * structure). Existing parallel tables (NCERT ConceptLesson + Korean
 * KoreanConceptLesson) stay untouched in shape — they just gain a nullable
 * FK pointing at "which country/grade/course do I belong to". Future US/UK
 * rollouts add Curriculum rows + their own pool without forcing a single-
 * table merge.
 *
 * Run: cd server && npx ts-node scripts/seed-curriculum-metadata.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Display labels for grade codes (NCERT + Korean). Kept here, not in DB,
// because the Curriculum.name field already carries the rendered "Class 7
// · Mathematics" / "고2 대수" string per row. These maps are only used to
// build the rendered string at seed time.
const NCERT_CLASS_LABEL: Record<string, string> = {
  CLASS_7: 'Class 7', CLASS_8: 'Class 8', CLASS_9: 'Class 9',
  CLASS_10: 'Class 10', CLASS_11: 'Class 11', CLASS_12: 'Class 12',
};

const KR_GRADE_LABEL: Record<string, string> = {
  MIDDLE_1: '중1', MIDDLE_2: '중2', MIDDLE_3: '중3',
  HIGH_1: '고1', HIGH_2: '고2', HIGH_3: '고3',
};

const KR_SUBJECT_LABEL: Record<string, string> = {
  MIDDLE_MATH_1: '수학 1',
  MIDDLE_MATH_2: '수학 2',
  MIDDLE_MATH_3: '수학 3',
  HIGH_COMMON_1: '공통수학1',
  HIGH_COMMON_2: '공통수학2',
  HIGH_ALGEBRA: '대수',
  HIGH_CALCULUS_1: '미적분Ⅰ',
  HIGH_CALCULUS_2: '미적분Ⅱ',
  HIGH_STATISTICS: '확률과 통계',
  HIGH_GEOMETRY: '기하',
};

// Sort order for KR grades + subjects so the seeded curriculum list reads
// 중1 → 중2 → 중3 → 고1 공통1 → 고1 공통2 → 고2 대수 → 고2 미적1 → ...
const KR_GRADE_ORDER: Record<string, number> = {
  MIDDLE_1: 1, MIDDLE_2: 2, MIDDLE_3: 3,
  HIGH_1: 4, HIGH_2: 5, HIGH_3: 6,
};
const KR_SUBJECT_ORDER: Record<string, number> = {
  MIDDLE_MATH_1: 1, MIDDLE_MATH_2: 1, MIDDLE_MATH_3: 1,
  HIGH_COMMON_1: 1, HIGH_COMMON_2: 2,
  HIGH_ALGEBRA: 1, HIGH_CALCULUS_1: 2, HIGH_STATISTICS: 3,
  HIGH_CALCULUS_2: 1, HIGH_GEOMETRY: 2,
};

async function seedNcertCurriculum() {
  // DISTINCT classes present in ConceptLesson — only seed Curriculum for
  // classes the app actually has chapters for. Empty class buckets stay
  // out of the curriculum picker.
  const classes = await prisma.conceptLesson.findMany({
    distinct: ['ncertClass'],
    select: { ncertClass: true },
    orderBy: { ncertClass: 'asc' },
  });
  console.log(`NCERT distinct classes: ${classes.length}`);

  const inserted: Array<{ grade: string; id: string }> = [];
  for (const c of classes) {
    const grade = c.ncertClass as string;
    const label = NCERT_CLASS_LABEL[grade] ?? grade;
    const name = `${label} · Mathematics`;
    // Class 7 → order 7, Class 11 → 11, etc. NCERT is single course per class.
    const order = parseInt(grade.replace('CLASS_', ''), 10);

    const row = await prisma.curriculum.upsert({
      where: {
        countryCode_grade_courseCode: { countryCode: 'IN', grade, courseCode: 'NCERT' },
      },
      update: { name, order, isActive: true },
      create: {
        countryCode: 'IN', grade, courseCode: 'NCERT', name, order, isActive: true,
      },
      select: { id: true },
    });
    inserted.push({ grade, id: row.id });
  }
  return inserted;
}

async function seedKoreanCurriculum() {
  // DISTINCT (koreanGrade, koreanSubject) combos actually present in
  // KoreanConceptLesson — every combo that has at least one chapter gets
  // a Curriculum row.
  const combos = await prisma.koreanConceptLesson.findMany({
    distinct: ['koreanGrade', 'koreanSubject'],
    select: { koreanGrade: true, koreanSubject: true },
    orderBy: [{ koreanGrade: 'asc' }, { koreanSubject: 'asc' }],
  });
  console.log(`KR distinct (grade, subject) combos: ${combos.length}`);

  const inserted: Array<{ grade: string; courseCode: string; id: string }> = [];
  for (const c of combos) {
    const grade = c.koreanGrade as string;
    const courseCode = c.koreanSubject as string;
    const gLabel = KR_GRADE_LABEL[grade] ?? grade;
    const sLabel = KR_SUBJECT_LABEL[courseCode] ?? courseCode;
    const name = `${gLabel} ${sLabel}`;
    // Two-tier order: 100*grade_order + subject_order. Keeps grades grouped
    // and subjects ordered within a grade.
    const order = (KR_GRADE_ORDER[grade] ?? 99) * 100 + (KR_SUBJECT_ORDER[courseCode] ?? 99);

    const row = await prisma.curriculum.upsert({
      where: {
        countryCode_grade_courseCode: { countryCode: 'KR', grade, courseCode },
      },
      update: { name, order, isActive: true },
      create: {
        countryCode: 'KR', grade, courseCode, name, order, isActive: true,
      },
      select: { id: true },
    });
    inserted.push({ grade, courseCode, id: row.id });
  }
  return inserted;
}

async function backfillConceptLessons(ncertRows: Array<{ grade: string; id: string }>) {
  // updateMany per class — way fewer round-trips than per-row update.
  // Only updates rows whose curriculumId is still null (so re-runs are no-ops).
  const map = new Map(ncertRows.map((r) => [r.grade, r.id]));
  let total = 0;
  for (const [grade, curriculumId] of map.entries()) {
    const res = await prisma.conceptLesson.updateMany({
      where: { ncertClass: grade as any, curriculumId: null },
      data: { curriculumId },
    });
    if (res.count > 0) console.log(`  NCERT ${grade}: ${res.count} lessons linked`);
    total += res.count;
  }
  return total;
}

async function backfillKoreanLessons(krRows: Array<{ grade: string; courseCode: string; id: string }>) {
  let total = 0;
  for (const r of krRows) {
    const res = await prisma.koreanConceptLesson.updateMany({
      where: {
        koreanGrade: r.grade as any,
        koreanSubject: r.courseCode as any,
        curriculumId: null,
      },
      data: { curriculumId: r.id },
    });
    if (res.count > 0) console.log(`  KR ${r.grade} + ${r.courseCode}: ${res.count} lessons linked`);
    total += res.count;
  }
  return total;
}

async function main() {
  console.log('=== Curriculum seed + backfill (H8b) ===');

  console.log('\n[1/4] Seeding NCERT (IN) Curriculum rows...');
  const ncert = await seedNcertCurriculum();
  console.log(`  → ${ncert.length} IN Curriculum rows upserted`);

  console.log('\n[2/4] Seeding KR Curriculum rows...');
  const kr = await seedKoreanCurriculum();
  console.log(`  → ${kr.length} KR Curriculum rows upserted`);

  console.log('\n[3/4] Backfilling ConceptLesson.curriculumId...');
  const lessonsLinked = await backfillConceptLessons(ncert);
  console.log(`  → ${lessonsLinked} NCERT lessons linked`);

  console.log('\n[4/4] Backfilling KoreanConceptLesson.curriculumId...');
  const krLinked = await backfillKoreanLessons(kr);
  console.log(`  → ${krLinked} KR lessons linked`);

  // Final sanity counts — should be 0 unlinked after a clean run.
  const unlinkedNcert = await prisma.conceptLesson.count({ where: { curriculumId: null } });
  const unlinkedKr = await prisma.koreanConceptLesson.count({ where: { curriculumId: null } });
  console.log(`\nSanity: unlinked NCERT=${unlinkedNcert}, unlinked KR=${unlinkedKr}`);
  if (unlinkedNcert > 0 || unlinkedKr > 0) {
    console.warn('⚠ Some lessons did not get a curriculumId — investigate distinct mismatches');
  } else {
    console.log('✅ All lessons have a curriculumId');
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
