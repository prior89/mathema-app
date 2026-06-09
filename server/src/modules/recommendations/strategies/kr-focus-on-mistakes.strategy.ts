import { Injectable } from '@nestjs/common';
import { Lang } from '../../../common/i18n/current-lang.decorator';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { buildKrCard, KrRecommendCard } from './kr-recommend-card.util';

/**
 * KR "오답 집중" — KoreanConceptLesson 단원별 누적 오답 최다 챕터 추천.
 */
@Injectable()
export class KrFocusOnMistakesStrategy {
  constructor(private readonly prisma: PrismaService) {}

  async recommend(userId: string, lang: Lang = 'ko'): Promise<KrRecommendCard | null> {
    const notes = await this.prisma.wrongNote.findMany({
      where: {
        userId,
        status: { not: 'MASTERED' },
        problem: { koreanConceptLessonId: { not: null } },
      },
      include: {
        problem: {
          include: {
            koreanConceptLesson: { select: { chapterCode: true, titleKo: true, titleEn: true } },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    if (notes.length === 0) return null;

    const buckets = new Map<string, {
      occurrences: number;
      noteCount: number;
      chapterCode: string;
      titleKo: string;
      titleEn: string | null;
    }>();

    for (const n of notes) {
      const lesson = n.problem.koreanConceptLesson;
      if (!lesson) continue;
      const cur = buckets.get(lesson.chapterCode);
      if (cur) {
        cur.occurrences += n.occurrences;
        cur.noteCount += 1;
      } else {
        buckets.set(lesson.chapterCode, {
          occurrences: n.occurrences,
          noteCount: 1,
          chapterCode: lesson.chapterCode,
          titleKo: lesson.titleKo,
          titleEn: lesson.titleEn,
        });
      }
    }

    if (buckets.size === 0) return null;

    const top = [...buckets.values()].sort((a, b) => b.occurrences - a.occurrences)[0];
    return buildKrCard(top, lang, 'focus', {
      occurrences: top.occurrences,
      noteCount: top.noteCount,
    });
  }
}