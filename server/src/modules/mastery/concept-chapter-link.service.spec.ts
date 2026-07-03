import { ConceptChapterLinkService } from './concept-chapter-link.service';

/**
 * Country-correctness is the whole point of this resolver — a KR learner must
 * deep-link to the Korean chapter, an IN learner to the NCERT one, and an
 * unresolvable concept must yield null (client falls back to the chapter list).
 */
function buildPrisma(country: string, over: Record<string, any> = {}) {
  return {
    user: { findUnique: jest.fn().mockResolvedValue({ country }) },
    concept: { findMany: jest.fn().mockResolvedValue([]) },
    conceptLesson: { findMany: jest.fn().mockResolvedValue([]) },
    problemConcept: { findMany: jest.fn().mockResolvedValue([]) },
    koreanConceptLesson: { findMany: jest.fn().mockResolvedValue([]) },
    ...over,
  } as any;
}

describe('ConceptChapterLinkService', () => {
  it('returns {} for empty ids without touching the DB', async () => {
    const prisma = buildPrisma('KR');
    const svc = new ConceptChapterLinkService(prisma);
    expect(await svc.resolveForUser('u1', [])).toEqual({});
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  it('IN: maps concept.code to chapterCode when the lesson exists, null otherwise', async () => {
    const prisma = buildPrisma('IN', {
      concept: { findMany: jest.fn().mockResolvedValue([
        { id: 'c1', code: 'C11-CH01-SETS' },
        { id: 'c2', code: 'C11-CH99-GHOST' },
      ]) },
      conceptLesson: { findMany: jest.fn().mockResolvedValue([
        { chapterCode: 'C11-CH01-SETS' }, // only c1's lesson exists
      ]) },
    });
    const svc = new ConceptChapterLinkService(prisma);
    const out = await svc.resolveForUser('u1', ['c1', 'c2']);
    expect(out).toEqual({ c1: 'C11-CH01-SETS', c2: null });
    // KR path must not run for an IN user.
    expect(prisma.problemConcept.findMany).not.toHaveBeenCalled();
  });

  it('KR: picks the dominant Korean chapter among the concept\'s problems', async () => {
    const prisma = buildPrisma('KR', {
      problemConcept: { findMany: jest.fn().mockResolvedValue([
        { conceptId: 'k1', problem: { koreanConceptLessonId: 'L1' } },
        { conceptId: 'k1', problem: { koreanConceptLessonId: 'L1' } },
        { conceptId: 'k1', problem: { koreanConceptLessonId: 'L2' } }, // minority
      ]) },
      koreanConceptLesson: { findMany: jest.fn().mockResolvedValue([
        { id: 'L1', chapterCode: 'K-G10-CS1-CH03-FUNCTIONS' },
        { id: 'L2', chapterCode: 'K-G10-CS1-CH09-OTHER' },
      ]) },
    });
    const svc = new ConceptChapterLinkService(prisma);
    const out = await svc.resolveForUser('u1', ['k1']);
    expect(out).toEqual({ k1: 'K-G10-CS1-CH03-FUNCTIONS' });
    // NCERT path must not run for a KR user.
    expect(prisma.concept.findMany).not.toHaveBeenCalled();
  });

  it('KR: leaves a concept null when none of its problems map to a Korean lesson', async () => {
    const prisma = buildPrisma('KR'); // problemConcept.findMany → []
    const svc = new ConceptChapterLinkService(prisma);
    const out = await svc.resolveForUser('u1', ['k1']);
    expect(out).toEqual({ k1: null });
  });
});
