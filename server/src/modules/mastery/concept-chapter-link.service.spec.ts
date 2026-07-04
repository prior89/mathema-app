import { ConceptChapterLinkService } from './concept-chapter-link.service';

/**
 * Country-correctness AND prerequisite gating are the point of this resolver:
 *   - a KR learner deep-links to the Korean chapter, an IN learner to the NCERT one;
 *   - a weakness whose prerequisites are unmet routes to the weakest prerequisite
 *     first (research: don't send a learner into undesirable difficulty);
 *   - an unresolvable concept yields null (client falls back to the chapter list).
 */
function buildPrisma(country: string, opts: {
  requested: any[];            // concept.findMany by id (with prerequisiteConceptIds)
  prereqs?: any[];             // concept.findMany by code
  trajectory?: any[];          // masteryTrajectory rows
  conceptLessons?: any[];      // ConceptLesson chapterCodes (NCERT)
  problemConcept?: any[];      // KR problem links
  koreanLessons?: any[];       // KR chapterCodes
} = { requested: [] }) {
  // Faithful concept.findMany: filter a master list by the where clause, mirroring
  // Prisma. The service calls it three ways: by id (requested), by code (prereqs),
  // and by id again inside resolveNcert (needs prereq concepts too).
  const master = [
    ...(opts.requested ?? []),
    ...((opts.prereqs ?? []).map((p) => ({ prerequisiteConceptIds: [], ...p }))),
  ].reduce((acc: any[], c) => (acc.some((x) => x.id === c.id) ? acc : [...acc, c]), []);
  const conceptFindMany = jest.fn((args: any) => {
    const where = args?.where ?? {};
    if (where.id?.in) return Promise.resolve(master.filter((c) => where.id.in.includes(c.id)));
    if (where.code?.in) return Promise.resolve(master.filter((c) => where.code.in.includes(c.code)));
    return Promise.resolve(master);
  });
  return {
    user: { findUnique: jest.fn().mockResolvedValue({ country }) },
    concept: { findMany: conceptFindMany },
    masteryTrajectory: { findMany: jest.fn().mockResolvedValue(opts.trajectory ?? []) },
    conceptLesson: { findMany: jest.fn().mockResolvedValue(opts.conceptLessons ?? []) },
    problemConcept: { findMany: jest.fn().mockResolvedValue(opts.problemConcept ?? []) },
    koreanConceptLesson: { findMany: jest.fn().mockResolvedValue(opts.koreanLessons ?? []) },
  } as any;
}

describe('ConceptChapterLinkService', () => {
  it('returns {} for empty ids without touching the DB', async () => {
    const prisma = buildPrisma('KR');
    const svc = new ConceptChapterLinkService(prisma);
    expect(await svc.resolveForUser('u1', [])).toEqual({});
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  it('IN: resolves chapterCode and reports prereqReady when prerequisites are met', async () => {
    const prisma = buildPrisma('IN', {
      requested: [
        { id: 'c1', code: 'C11-CH02-REL', prerequisiteConceptIds: ['C11-CH01-SETS'] },
        { id: 'c0', code: 'C11-CH01-SETS', prerequisiteConceptIds: [] },
      ],
      prereqs: [{ id: 'c0', code: 'C11-CH01-SETS' }],
      trajectory: [{ conceptId: 'c0', masteryScore: 72 }], // prereq mastered
      conceptLessons: [{ chapterCode: 'C11-CH02-REL' }, { chapterCode: 'C11-CH01-SETS' }],
    });
    const svc = new ConceptChapterLinkService(prisma);
    const out = await svc.resolveForUser('u1', ['c1', 'c0']);
    expect(out.c1).toEqual({ chapterCode: 'C11-CH02-REL', prereqReady: true, prereqChapterCode: null });
    expect(out.c0).toEqual({ chapterCode: 'C11-CH01-SETS', prereqReady: true, prereqChapterCode: null });
    expect(prisma.problemConcept.findMany).not.toHaveBeenCalled(); // KR path must not run
  });

  it('IN: routes to the weakest unmet prerequisite when prerequisites are NOT met', async () => {
    const prisma = buildPrisma('IN', {
      requested: [
        { id: 'c1', code: 'C11-CH02-REL', prerequisiteConceptIds: ['C11-CH01-SETS', 'C11-CH00-NUM'] },
      ],
      prereqs: [
        { id: 'c0', code: 'C11-CH01-SETS' },
        { id: 'cN', code: 'C11-CH00-NUM' },
      ],
      trajectory: [
        { conceptId: 'c0', masteryScore: 40 },  // unmet (< 50)
        { conceptId: 'cN', masteryScore: 15 },  // unmet AND weaker → should win
      ],
      conceptLessons: [
        { chapterCode: 'C11-CH02-REL' }, { chapterCode: 'C11-CH01-SETS' }, { chapterCode: 'C11-CH00-NUM' },
      ],
    });
    const svc = new ConceptChapterLinkService(prisma);
    const out = await svc.resolveForUser('u1', ['c1']);
    expect(out.c1.prereqReady).toBe(false);
    expect(out.c1.chapterCode).toBe('C11-CH02-REL');
    expect(out.c1.prereqChapterCode).toBe('C11-CH00-NUM'); // the weakest unmet prereq
  });

  it('treats a never-attempted prerequisite (no trajectory row) as unmet', async () => {
    const prisma = buildPrisma('IN', {
      requested: [{ id: 'c1', code: 'C11-CH02-REL', prerequisiteConceptIds: ['C11-CH01-SETS'] }],
      prereqs: [{ id: 'c0', code: 'C11-CH01-SETS' }],
      trajectory: [], // never attempted → score 0 → unmet
      conceptLessons: [{ chapterCode: 'C11-CH02-REL' }, { chapterCode: 'C11-CH01-SETS' }],
    });
    const svc = new ConceptChapterLinkService(prisma);
    const out = await svc.resolveForUser('u1', ['c1']);
    expect(out.c1.prereqReady).toBe(false);
    expect(out.c1.prereqChapterCode).toBe('C11-CH01-SETS');
  });

  it('KR: resolves via problems and reports prereqReady for a root concept (no prereqs)', async () => {
    const prisma = buildPrisma('KR', {
      requested: [{ id: 'k1', code: 'K-G7-MATH1-CH01-FACTORIZATION', prerequisiteConceptIds: [] }],
      problemConcept: [
        { conceptId: 'k1', problem: { koreanConceptLessonId: 'L1' } },
        { conceptId: 'k1', problem: { koreanConceptLessonId: 'L1' } },
      ],
      koreanLessons: [{ id: 'L1', chapterCode: 'K-G7-MATH1-CH01-FACTORIZATION' }],
    });
    const svc = new ConceptChapterLinkService(prisma);
    const out = await svc.resolveForUser('u1', ['k1']);
    expect(out.k1).toEqual({
      chapterCode: 'K-G7-MATH1-CH01-FACTORIZATION',
      prereqReady: true,
      prereqChapterCode: null,
    });
    expect(prisma.conceptLesson.findMany).not.toHaveBeenCalled(); // NCERT path must not run
  });
});
