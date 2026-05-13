/* One-off backfill: link existing Problems to ConceptLessons by chapter name match.
 *   Problem.source 형태: "Class 8 · Rational Numbers · Q1"
 *   ConceptLesson.titleEn: "Rational Numbers"
 * source의 두 번째 토큰(' · '로 분리)과 lesson title이 일치하면 매핑.
 *
 * 실행: npx ts-node prisma/backfill-problem-lesson.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔗 Backfilling Problem.conceptLessonId by chapter name...');

  const problems = await prisma.problem.findMany({
    where: { conceptLessonId: null },
    select: { id: true, source: true },
  });
  const lessons = await prisma.conceptLesson.findMany({
    select: { id: true, titleEn: true, titleKo: true, chapterCode: true },
  });

  // Build chapterTitle (lowercase) → lessonId map.
  const titleToId = new Map<string, string>();
  for (const l of lessons) {
    titleToId.set(l.titleEn.toLowerCase(), l.id);
    titleToId.set(l.titleKo.toLowerCase(), l.id);
  }

  let linked = 0;
  let skipped = 0;

  // 부분 매칭 헬퍼 — 양방향 substring 또는 첫 단어 매칭. 한국어 source 는 스킵.
  function findLesson(source: string): string | undefined {
    const parts = source.split('·').map((s) => s.trim());
    const raw = (parts[1] || '').toLowerCase();
    if (!raw) return undefined;
    // 한국어 chapter (한글 포함) → 인도 PoC 와 무관, 매핑 X.
    if (/[가-힣]/.test(raw)) return undefined;

    // 1) 정확 일치
    if (titleToId.has(raw)) return titleToId.get(raw);
    // 2) lesson title 이 chapter substring (예: "Linear Equations" ⊂ "Linear Equations in One Variable")
    for (const l of lessons) {
      const t = l.titleEn.toLowerCase();
      if (t.includes(raw) || raw.includes(t)) return l.id;
    }
    // 3) 첫 단어 매칭 (예: "Limits" → "Limits and Derivatives")
    const firstWord = raw.split(/\s+/)[0];
    for (const l of lessons) {
      const t = l.titleEn.toLowerCase();
      if (t.startsWith(firstWord)) return l.id;
    }
    return undefined;
  }

  for (const p of problems) {
    const lessonId = findLesson(p.source || '');
    if (lessonId) {
      await prisma.problem.update({
        where: { id: p.id },
        data: { conceptLessonId: lessonId },
      });
      linked++;
    } else {
      skipped++;
      console.log(`  · skip: ${p.source}`);
    }
  }

  console.log(`✅ ${linked} linked · ${skipped} skipped (out of ${problems.length})`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
