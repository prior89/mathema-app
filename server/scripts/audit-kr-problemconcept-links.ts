/** Check whether KR-mapped Problems have ProblemConcept links. */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const total = await prisma.problem.count({ where: { koreanConceptLessonId: { not: null } } });
  const withConcepts = await prisma.problem.count({
    where: {
      koreanConceptLessonId: { not: null },
      concepts: { some: {} },
    },
  });
  const inTotal = await prisma.problem.count({ where: { conceptLessonId: { not: null } } });
  const inWithConcepts = await prisma.problem.count({
    where: {
      conceptLessonId: { not: null },
      concepts: { some: {} },
    },
  });
  console.log(`KR problems: ${total}, with ProblemConcept link: ${withConcepts} (${((withConcepts / total) * 100).toFixed(1)}%)`);
  console.log(`IN problems: ${inTotal}, with ProblemConcept link: ${inWithConcepts} (${((inWithConcepts / inTotal) * 100).toFixed(1)}%)`);

  // requiredSkills usage
  const withSkills = await prisma.problem.count({
    where: {
      koreanConceptLessonId: { not: null },
      requiredSkills: { isEmpty: false },
    },
  });
  console.log(`KR problems with requiredSkills: ${withSkills}`);

  // distractorErrorCode population
  const totalChoices = await prisma.problemChoice.count({
    where: { step: { problem: { koreanConceptLessonId: { not: null } } } },
  });
  const withErrorCode = await prisma.problemChoice.count({
    where: {
      step: { problem: { koreanConceptLessonId: { not: null } } },
      distractorErrorCode: { not: null },
    },
  });
  console.log(`KR choices: ${totalChoices}, with distractorErrorCode: ${withErrorCode} (${((withErrorCode / totalChoices) * 100).toFixed(1)}%)`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
