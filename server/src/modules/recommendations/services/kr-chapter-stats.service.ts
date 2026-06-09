import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

const MASTERY_CAP = 20;
const PEER_PROGRESS = 71;

export type KrChapterStat = {
  chapterCode: string;
  titleKo: string;
  titleEn: string | null;
  progress: number;
  progressPct: number;
  gapPct: number;
  accuracy: number;
  lastAttemptAt: Date | null;
};

/**
 * Per-chapter mastery progress for KR recommendations — mirrors
 * dashboard chapterProgressKorean ANSWER-step gate (stepIndex=3).
 */
@Injectable()
export class KrChapterStatsService {
  constructor(private readonly prisma: PrismaService) {}

  async listActiveChapters(userId: string): Promise<KrChapterStat[]> {
    const rows = await this.prisma.$queryRawUnsafe<Array<{
      chapter_code: string;
      title_ko: string;
      title_en: string | null;
      problems_total: bigint;
      problems_attempted: bigint;
      total_attempts: bigint;
      correct_attempts: bigint;
      last_attempt_at: Date | null;
    }>>(
      `SELECT kcl."chapterCode"        AS chapter_code,
              kcl."titleKo"             AS title_ko,
              kcl."titleEn"             AS title_en,
              COUNT(DISTINCT p.id)                                                AS problems_total,
              COUNT(DISTINCT CASE WHEN a.id IS NOT NULL AND a."stepIndex" = 3 THEN p.id END) AS problems_attempted,
              COUNT(a.id)                                                         AS total_attempts,
              SUM(CASE WHEN a."isCorrect" THEN 1 ELSE 0 END)                      AS correct_attempts,
              MAX(a."createdAt")                                                  AS last_attempt_at
       FROM "KoreanConceptLesson" kcl
       LEFT JOIN "Problem"   p ON p."koreanConceptLessonId" = kcl.id
                              AND (SELECT COUNT(*) FROM "ProblemStep" ps WHERE ps."problemId" = p.id) = 3
                              AND (
                                COALESCE(array_length(kcl."masterySetProblemIds", 1), 0) <> 20
                                OR p.id = ANY(kcl."masterySetProblemIds")
                              )
       LEFT JOIN "Attempt"   a ON a."problemId" = p.id
                              AND a."userId" = $1
                              AND a."context" IN ('STUDY', 'PRACTICE')
       GROUP BY kcl.id, kcl."chapterCode", kcl."titleKo", kcl."titleEn"
       HAVING COUNT(a.id) > 0
       ORDER BY MAX(a."createdAt") DESC NULLS LAST`,
      userId,
    );

    return rows.map((r) => {
      const problemsTotal = Math.min(Number(r.problems_total), MASTERY_CAP);
      const problemsAttempted = Math.min(Number(r.problems_attempted), problemsTotal);
      const totalAttempts = Number(r.total_attempts);
      const correctAttempts = Number(r.correct_attempts);
      const progress = problemsTotal > 0 ? problemsAttempted / problemsTotal : 0;
      const progressPct = Math.round(progress * 100);
      const gapPct = PEER_PROGRESS - progressPct;
      const accuracy = totalAttempts > 0 ? correctAttempts / totalAttempts : 0;
      return {
        chapterCode: r.chapter_code,
        titleKo: r.title_ko,
        titleEn: r.title_en,
        progress,
        progressPct,
        gapPct,
        accuracy,
        lastAttemptAt: r.last_attempt_at,
      };
    });
  }
}