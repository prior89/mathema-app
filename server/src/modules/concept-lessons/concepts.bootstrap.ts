import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { NCERT_CHAPTERS } from '../../common/curriculum/ncert-chapters';
import { GradeLevel } from '@prisma/client';

/**
 * Concept 시드 부트스트랩.
 *
 *   NCERT 79 챕터 (ncert-chapters.ts) → Concept 1:1 매핑.
 *   Concept.code = chapterCode (예: "C11-CH01-SETS").
 *   prerequisiteConceptIds = chapter 의 prerequisiteCodes 를 그대로 사용.
 *
 *   이전에는 ConceptLesson 이 "콘텐츠(빅 아이디어/HOOK/CONCRETE/...)" 로 쓰였고,
 *   추천 엔진의 "개념 그래프" 는 없었다. 이제 Concept 가 그래프 역할,
 *   ConceptLesson 은 학습 콘텐츠로 분리된다.
 *
 *   ProblemConcept (N:M) 매핑은 후속 — 챕터별 Problem 컬렉션이 시드되면
 *   동일 chapter unit/subUnit 의 Problem 을 자동 link 한다.
 *
 * 정책:
 *   - upsert by code → 신규 챕터 자동 반영.
 *   - prerequisiteConceptIds 는 chapterCode 그대로 저장 — 실 id 로의
 *     resolution 은 service 가 수행 (code → id lookup).
 *   - production 에서도 안전 (콘텐츠는 시스템 자원).
 *
 *   ConceptLessonsBootstrap 이후 실행되어야 ConceptLesson.unitId 도 사용 가능.
 */
@Injectable()
export class ConceptsBootstrap implements OnModuleInit {
  private readonly logger = new Logger(ConceptsBootstrap.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit(): Promise<void> {
    // 부팅 차단 회피 — 비동기.
    setImmediate(() => {
      this.sync().catch((err) => {
        this.logger.error(`Concept sync failed: ${(err as Error).message}`);
      });
    });
  }

  /**
   * 79 챕터 → Concept upsert + Problem↔Concept 자동 link (unit/subUnit 기반).
   */
  private async sync(): Promise<void> {
    // 1) 챕터 → Concept upsert. ConceptLesson 의 unitId 를 참고해 Concept.unitId 도 채움.
    let upserted = 0;
    for (const ch of NCERT_CHAPTERS) {
      // ConceptLesson 에서 같은 chapterCode 가 매핑한 unitId 가 있으면 그걸 사용.
      const lesson = await this.prisma.conceptLesson.findUnique({
        where: { chapterCode: ch.chapterCode },
        select: { unitId: true },
      });

      await this.prisma.concept.upsert({
        where: { code: ch.chapterCode },
        update: {
          name: ch.titleEn,
          nameKo: ch.titleKo,
          subject: 'math',
          gradeLevel: ncertToGrade(ch.ncertClass),
          prerequisiteConceptIds: ch.prerequisites ?? [],
          unitId: lesson?.unitId ?? null,
        },
        create: {
          code: ch.chapterCode,
          name: ch.titleEn,
          nameKo: ch.titleKo,
          subject: 'math',
          gradeLevel: ncertToGrade(ch.ncertClass),
          prerequisiteConceptIds: ch.prerequisites ?? [],
          relatedConceptIds: [],
          unitId: lesson?.unitId ?? null,
        },
      });
      upserted++;
    }
    this.logger.log(`Concepts synced: ${upserted}/${NCERT_CHAPTERS.length}`);

    // 2) Problem ↔ Concept 자동 link — Problem.unitId 가 Concept.unitId 와 같으면 weight=1.0
    //    (Problem 은 시드에서 unitId 만 채워져 있고 conceptId 가 없으므로, unit 기반 추정).
    const concepts = await this.prisma.concept.findMany({
      where: { unitId: { not: null } },
      select: { id: true, unitId: true },
    });
    const conceptsByUnit = new Map<string, string[]>();
    for (const c of concepts) {
      if (!c.unitId) continue;
      const arr = conceptsByUnit.get(c.unitId) ?? [];
      arr.push(c.id);
      conceptsByUnit.set(c.unitId, arr);
    }

    let linked = 0;
    for (const [unitId, conceptIds] of conceptsByUnit.entries()) {
      // EXCLUDE KR problems (koreanConceptLessonId != null). All 1720 KR
      // problems share one unitId, so this NCERT unit-heuristic used to collapse
      // every one of them onto a single concept (C7-CH01-INTEGERS), destroying
      // KR per-concept mastery. KR problems are linked chapter-scoped in
      // syncKoreanConcepts() instead; the unit-heuristic is NCERT-only.
      const problemIds = (await this.prisma.problem.findMany({
        where: { unitId, koreanConceptLessonId: null }, select: { id: true },
      })).map((p) => p.id);
      if (problemIds.length === 0) continue;

      // 같은 unit 의 모든 Problem 을 그 unit 의 모든 Concept 에 link (단순 매핑 — Phase 1).
      // Phase 2 에서 LLM 기반 conceptTags 자동 추출로 정교화 예정.
      for (const pid of problemIds) {
        for (const cid of conceptIds) {
          await this.prisma.problemConcept.upsert({
            where: { problemId_conceptId: { problemId: pid, conceptId: cid } },
            update: {},
            create: { problemId: pid, conceptId: cid, weight: 1.0 / conceptIds.length },
          });
          linked++;
        }
      }
    }
    this.logger.log(`ProblemConcept links upserted: ${linked}`);

    // 3) KR side — seed a Concept per KoreanConceptLesson and link KR problems
    //    to their own chapter concept (symmetric with NCERT, chapter-scoped).
    await this.syncKoreanConcepts();
  }

  /**
   * KoreanConceptLesson → Concept (code = chapterCode) + KR Problem link.
   *
   * KR lessons carry no unitId, so the NCERT unit-heuristic above can't (and
   * must not) reach KR problems. Here each KR problem is linked to exactly its
   * own chapter's concept, so KR per-concept mastery / weakness / deep-links are
   * chapter-scoped like the NCERT side. Upsert-only: on a fresh DB no degenerate
   * link is ever created (the unit-heuristic now skips KR). Existing databases
   * that were already polluted are cleaned once by
   * scripts/relink-kr-problems-to-chapter-concepts.ts.
   */
  private async syncKoreanConcepts(): Promise<void> {
    const lessons = await this.prisma.koreanConceptLesson.findMany({
      select: {
        id: true, chapterCode: true, titleKo: true, titleEn: true,
        koreanGrade: true, prerequisiteCodes: true,
      },
    });
    if (lessons.length === 0) return;

    const conceptIdByChapter = new Map<string, string>();
    for (const l of lessons) {
      const c = await this.prisma.concept.upsert({
        where: { code: l.chapterCode },
        update: {
          name: l.titleEn ?? l.titleKo, nameKo: l.titleKo, subject: 'math',
          gradeLevel: krGradeToLevel(l.koreanGrade),
          prerequisiteConceptIds: l.prerequisiteCodes ?? [],
        },
        create: {
          code: l.chapterCode, name: l.titleEn ?? l.titleKo, nameKo: l.titleKo,
          subject: 'math', gradeLevel: krGradeToLevel(l.koreanGrade),
          prerequisiteConceptIds: l.prerequisiteCodes ?? [], relatedConceptIds: [],
        },
        select: { id: true },
      });
      conceptIdByChapter.set(l.chapterCode, c.id);
    }

    const krProblems = await this.prisma.problem.findMany({
      where: { koreanConceptLessonId: { not: null } },
      select: { id: true, koreanConceptLesson: { select: { chapterCode: true } } },
    });
    let linked = 0;
    for (const p of krProblems) {
      const code = p.koreanConceptLesson?.chapterCode;
      const conceptId = code ? conceptIdByChapter.get(code) : undefined;
      if (!conceptId) continue;
      await this.prisma.problemConcept.upsert({
        where: { problemId_conceptId: { problemId: p.id, conceptId } },
        update: {},
        create: { problemId: p.id, conceptId, weight: 1.0 },
      });
      linked++;
    }
    this.logger.log(`KR concepts synced: ${conceptIdByChapter.size}, KR ProblemConcept links: ${linked}`);
  }
}

/** KoreanGrade → GradeLevel (Concept.gradeLevel uses the NCERT enum; the
 * middle/high alignment is what recommendation grade-filtering relies on). */
function krGradeToLevel(kg: string): GradeLevel {
  switch (kg) {
    case 'MIDDLE_1': return GradeLevel.CLASS_7;
    case 'MIDDLE_2': return GradeLevel.CLASS_8;
    case 'MIDDLE_3': return GradeLevel.CLASS_9;
    case 'HIGH_1':   return GradeLevel.CLASS_10;
    case 'HIGH_2':   return GradeLevel.CLASS_11;
    case 'HIGH_3':   return GradeLevel.CLASS_12;
    default:         return GradeLevel.CLASS_12;
  }
}

/** NcertClass → GradeLevel 매핑 (Class 7→CLASS_7 ... Class 12→CLASS_12). */
function ncertToGrade(nc: string): GradeLevel {
  switch (nc) {
    case 'CLASS_7':  return GradeLevel.CLASS_7;
    case 'CLASS_8':  return GradeLevel.CLASS_8;
    case 'CLASS_9':  return GradeLevel.CLASS_9;
    case 'CLASS_10': return GradeLevel.CLASS_10;
    case 'CLASS_11': return GradeLevel.CLASS_11;
    case 'CLASS_12': return GradeLevel.CLASS_12;
    default: return GradeLevel.CLASS_12;
  }
}
