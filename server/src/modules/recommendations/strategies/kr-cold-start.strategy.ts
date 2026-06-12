import { Injectable } from '@nestjs/common';
import { Lang } from '../../../common/i18n/current-lang.decorator';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { NCERT_TO_KR_GRADE } from '../../diagnostic/diagnostic-pool-gate';

const MAX_CARDS = 3;

/**
 * KR cold-start — 학습 기록이 없는 KR 사용자에게 학년 맞춤 정적 today 카드.
 * NCERT 3-strategy 는 Unit 기반이라 KR 에 노출하면 cross-curriculum; PR-26 전
 * minimal seed 로 Home EmptyCta 대신 chapterCode 카드를 반환한다.
 */
@Injectable()
export class KrColdStartStrategy {
  constructor(private readonly prisma: PrismaService) {}

  async recommend(userId: string, lang: Lang = 'ko') {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { country: true, gradeLevel: true },
    });
    if (user?.country !== 'KR') return [];

    const attemptCount = await this.prisma.attempt.count({ where: { userId } });
    if (attemptCount > 0) return [];

    const krGrade = NCERT_TO_KR_GRADE[user.gradeLevel ?? 'CLASS_11'];
    const lessons = await this.prisma.koreanConceptLesson.findMany({
      where: { koreanGrade: krGrade },
      orderBy: { chapterNumber: 'asc' },
      take: MAX_CARDS,
      select: { chapterCode: true, titleKo: true, titleEn: true },
    });
    if (lessons.length === 0) return [];

    const isKo = lang === 'ko';
    return lessons.map((lesson, index) => {
      const label = lesson.titleKo || lesson.titleEn || lesson.chapterCode;
      const isFirst = index === 0;
      return {
        tag: isKo ? (isFirst ? '시작하기' : '추천') : (isFirst ? 'Start here' : 'Recommended'),
        tagColor: isFirst ? '#1D4ED8' : '#0F766E',
        unit: label,
        title: isKo ? `${label} 개념부터` : `Start with ${label}`,
        reason: isKo
          ? '학년에 맞는 단원으로 첫 학습을 시작해 보세요.'
          : 'Start your first lesson for your grade.',
        tone: 'info' as const,
        time: '~15 min',
        type: isKo ? '개념 학습' : 'Concept lesson',
        icon: 'BookOpen',
        unitId: null as string | null,
        chapterCode: lesson.chapterCode,
        route: `/app/learn/${lesson.chapterCode}`,
      };
    });
  }
}