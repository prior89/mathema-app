import { Injectable } from '@nestjs/common';
import { CountryCode, GradeLevel } from '@prisma/client';
import { Lang } from '../../common/i18n/current-lang.decorator';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { NCERT_TO_KR_GRADE } from '../diagnostic/diagnostic-pool-gate';
import { FirstSessionCard, SeedPlacementInput } from './first-session-plan.types';

const MAX_CARDS = 3;
const TARGET_CARDS = 2;

@Injectable()
export class FirstSessionPlanService {
  constructor(private readonly prisma: PrismaService) {}

  /** Build 2–3 real chapter cards from placement and persist FirstSessionPlan. */
  async seedFirstSession(userId: string, input: SeedPlacementInput): Promise<FirstSessionCard[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { country: true, gradeLevel: true },
    });
    if (!user) return [];

    const country: CountryCode = user.country === 'KR' ? 'KR' : 'IN';
    const codes = [...new Set(input.recommendedChapterCodes.filter(Boolean))];
    const cards: FirstSessionCard[] = [];

    for (const chapterCode of codes) {
      if (cards.length >= MAX_CARDS) break;
      const card = await this.resolveChapterCard(chapterCode, country, cards.length + 1);
      if (card) cards.push(card);
    }

    if (cards.length < TARGET_CARDS) {
      const fallbacks = await this.gradeStarterChapterCodes(user.gradeLevel, country);
      for (const chapterCode of fallbacks) {
        if (cards.length >= MAX_CARDS) break;
        if (cards.some((c) => c.chapterCode === chapterCode)) continue;
        const card = await this.resolveChapterCard(chapterCode, country, cards.length + 1);
        if (card) cards.push(card);
      }
    }

    if (cards.length === 0) return [];

    await this.prisma.firstSessionPlan.upsert({
      where: { userId },
      create: { userId, cards },
      update: { cards, seededAt: new Date(), completedAt: null },
    });

    return cards;
  }

  async getActiveCards(userId: string): Promise<FirstSessionCard[]> {
    const plan = await this.prisma.firstSessionPlan.findUnique({ where: { userId } });
    if (!plan || plan.completedAt) return [];
    const raw = plan.cards;
    if (!Array.isArray(raw)) return [];
    return raw.filter((c): c is FirstSessionCard => (
      !!c && typeof c === 'object'
      && typeof (c as FirstSessionCard).chapterCode === 'string'
      && typeof (c as FirstSessionCard).route === 'string'
    ));
  }

  /** Map stored plan cards → Home today RecommendCard shape. */
  toRecommendCards(cards: FirstSessionCard[], lang: Lang = 'en') {
    const isKo = lang === 'ko';
    return cards
      .sort((a, b) => a.priority - b.priority)
      .map((c) => ({
        tag: isKo ? '첫 학습' : 'Start here',
        tagColor: '#1D4ED8',
        unit: c.label,
        title: isKo ? `${c.label} 개념부터` : `Start with ${c.label}`,
        reason: isKo ? '진단 결과를 바탕으로 추천했어요.' : 'Recommended from your diagnostic.',
        time: '~15 min',
        type: isKo ? '개념 학습' : 'Concept lesson',
        icon: 'BookOpen',
        unitId: null as string | null,
        chapterCode: c.chapterCode,
        route: c.route,
      }));
  }

  private async resolveChapterCard(
    chapterCode: string,
    country: CountryCode,
    priority: number,
  ): Promise<FirstSessionCard | null> {
    if (country === 'KR') {
      const lesson = await this.prisma.koreanConceptLesson.findUnique({
        where: { chapterCode },
        select: { titleKo: true, titleEn: true },
      });
      if (!lesson) return null;
      const label = lesson.titleKo || lesson.titleEn || chapterCode;
      return {
        chapterCode,
        label,
        route: `/app/learn/${chapterCode}`,
        priority,
      };
    }

    const lesson = await this.prisma.conceptLesson.findUnique({
      where: { chapterCode },
      select: { titleEn: true, titleKo: true },
    });
    if (!lesson) return null;
    const label = lesson.titleEn || lesson.titleKo || chapterCode;
    return {
      chapterCode,
      label,
      route: `/app/learn/${chapterCode}`,
      priority,
    };
  }

  private async gradeStarterChapterCodes(
    gradeLevel: GradeLevel | null | undefined,
    country: CountryCode,
  ): Promise<string[]> {
    const grade = gradeLevel ?? 'CLASS_11';
    if (country === 'KR') {
      const krGrade = NCERT_TO_KR_GRADE[grade];
      const rows = await this.prisma.koreanConceptLesson.findMany({
        where: { koreanGrade: krGrade },
        orderBy: { chapterNumber: 'asc' },
        take: 4,
        select: { chapterCode: true },
      });
      return rows.map((r) => r.chapterCode);
    }

    const rows = await this.prisma.conceptLesson.findMany({
      where: { ncertClass: grade },
      orderBy: { chapterNumber: 'asc' },
      take: 4,
      select: { chapterCode: true },
    });
    return rows.map((r) => r.chapterCode);
  }
}