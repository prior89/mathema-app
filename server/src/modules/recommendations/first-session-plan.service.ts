import { Injectable } from '@nestjs/common';
import { CountryCode, GradeLevel } from '@prisma/client';
import { Lang } from '../../common/i18n/current-lang.decorator';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { NCERT_TO_KR_GRADE } from '../diagnostic/diagnostic-pool-gate';
import { FirstSessionCard, SeedPlacementInput } from './first-session-plan.types';

const MAX_CARDS = 3;
const TARGET_CARDS = 2;
const MAX_RECOVERY_ATTEMPTS = 3;

type StoredFirstSessionPlan = {
  id: string;
  cards: unknown;
  seededAt: Date;
  completedAt: Date | null;
};

@Injectable()
export class FirstSessionPlanService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Idempotently guarantee the diagnostic's first-session plan.
   *
   * A finish retry may arrive after StudySession.endedAt was committed but the
   * original plan write failed. Active plans with fewer than two usable cards
   * are rebuilt from the same placement input. Completed plans are immutable:
   * they are never overwritten and completedAt is never cleared.
   */
  async ensureFirstSession(userId: string, input: SeedPlacementInput): Promise<FirstSessionCard[]> {
    const existing = await this.prisma.firstSessionPlan.findUnique({ where: { userId } });
    if (existing?.completedAt) return [];

    const existingCards = this.parseCards(existing?.cards);
    if (this.isComplete(existingCards)) return existingCards;

    const cards = await this.buildCards(userId, input);
    if (cards.length === 0) return existingCards;

    return this.persistRecovery(userId, cards, existing as StoredFirstSessionPlan | null);
  }

  /** Backward-compatible entry point; seeding now follows the safe ensure contract. */
  async seedFirstSession(userId: string, input: SeedPlacementInput): Promise<FirstSessionCard[]> {
    return this.ensureFirstSession(userId, input);
  }

  private async buildCards(userId: string, input: SeedPlacementInput): Promise<FirstSessionCard[]> {
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
    return cards;
  }

  async getActiveCards(userId: string): Promise<FirstSessionCard[]> {
    const plan = await this.prisma.firstSessionPlan.findUnique({ where: { userId } });
    if (!plan || plan.completedAt) return [];
    return this.parseCards(plan.cards);
  }

  /** Map stored plan cards → Home today RecommendCard shape. */
  toRecommendCards(cards: FirstSessionCard[], lang: Lang = 'en') {
    const isKo = lang === 'ko';
    return [...cards]
      .sort((a, b) => a.priority - b.priority)
      .map((c) => ({
        tag: isKo ? '첫 학습' : 'Start here',
        tagColor: '#1D4ED8',
        unit: c.label,
        title: isKo ? `${c.label} 개념부터` : `Start with ${c.label}`,
        reason: isKo ? '진단 결과를 바탕으로 추천했어요.' : 'Recommended from your diagnostic.',
        tone: 'info' as const,
        time: '~15 min',
        type: isKo ? '개념 학습' : 'Concept lesson',
        icon: 'BookOpen',
        unitId: null as string | null,
        chapterCode: c.chapterCode,
        route: c.route,
      }));
  }

  /**
   * Optimistic, bounded repair. seededAt acts as the plan version so a plan
   * completed or repaired by another request between read and write cannot be
   * overwritten. A unique-create race is reconciled through the same path.
   */
  private async persistRecovery(
    userId: string,
    cards: FirstSessionCard[],
    initial: StoredFirstSessionPlan | null,
  ): Promise<FirstSessionCard[]> {
    let observed = initial;

    for (let attempt = 0; attempt < MAX_RECOVERY_ATTEMPTS; attempt += 1) {
      if (!observed) {
        try {
          await this.prisma.firstSessionPlan.create({ data: { userId, cards } });
          return cards;
        } catch (error) {
          if ((error as { code?: string })?.code !== 'P2002') throw error;
          observed = await this.prisma.firstSessionPlan.findUnique({ where: { userId } });
          continue;
        }
      }

      if (observed.completedAt) return [];
      const observedCards = this.parseCards(observed.cards);
      if (this.isComplete(observedCards)) return observedCards;

      const nextSeededAt = new Date(Math.max(Date.now(), observed.seededAt.getTime() + 1));
      const updated = await this.prisma.firstSessionPlan.updateMany({
        where: {
          id: observed.id,
          completedAt: null,
          seededAt: observed.seededAt,
        },
        data: { cards, seededAt: nextSeededAt },
      });
      if (updated.count === 1) return cards;

      observed = await this.prisma.firstSessionPlan.findUnique({ where: { userId } });
    }

    // Under sustained contention, prefer the winner's active state. This
    // never writes after the bounded retries and therefore cannot resurrect a
    // plan that another request completed.
    return this.getActiveCards(userId);
  }

  private isComplete(cards: FirstSessionCard[]): boolean {
    return cards.length >= TARGET_CARDS;
  }

  private parseCards(raw: unknown): FirstSessionCard[] {
    if (!Array.isArray(raw)) return [];

    const seen = new Set<string>();
    const cards: FirstSessionCard[] = [];
    for (const value of raw) {
      if (!value || typeof value !== 'object') continue;
      const candidate = value as Partial<FirstSessionCard>;
      if (
        typeof candidate.chapterCode !== 'string'
        || candidate.chapterCode.length === 0
        || seen.has(candidate.chapterCode)
        || typeof candidate.label !== 'string'
        || candidate.label.length === 0
        || candidate.route !== `/app/learn/${candidate.chapterCode}`
        || typeof candidate.priority !== 'number'
        || !Number.isInteger(candidate.priority)
        || candidate.priority < 1
      ) continue;

      seen.add(candidate.chapterCode);
      cards.push(candidate as FirstSessionCard);
    }
    return cards.sort((a, b) => a.priority - b.priority);
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
