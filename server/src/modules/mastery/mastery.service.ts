import { Injectable } from '@nestjs/common';
import { MasteryRepository } from './mastery.repository';
import { Lang } from '../../common/i18n/current-lang.decorator';
import { UNIT_NAME_EN } from '../../common/i18n/content-en';
import { UNIT_NAME_HI } from '../../common/i18n/content-hi';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { aggregateKrGradeMastery } from './kr-grade-mastery.util';

function localizeUnit(name: string, lang: Lang): string {
  if (lang === 'hi') return UNIT_NAME_HI[name] ?? UNIT_NAME_EN[name] ?? name;
  if (lang === 'en') return UNIT_NAME_EN[name] ?? name;
  return name;
}

@Injectable()
export class MasteryService {
  constructor(
    private readonly repo: MasteryRepository,
    private readonly prisma: PrismaService,
  ) {}

  async all(userId: string, lang: Lang = 'en') {
    const me = await this.prisma.user.findUnique({
      where: { id: userId }, select: { country: true },
    });

    // KR: NCERT Unit names must not surface on the mastery tab. Aggregate
    // concept-level trajectories by grade instead (Phase 4).
    if (me?.country === 'KR') {
      const trajectories = await this.prisma.masteryTrajectory.findMany({
        where: { userId },
        select: {
          masteryScore: true,
          evidenceCount: true,
          concept: { select: { gradeLevel: true } },
        },
      });
      return aggregateKrGradeMastery(trajectories, lang);
    }

    const list = await this.repo.findAll(userId);
    return list
      .sort((a: any, b: any) => a.unit.order - b.unit.order)
      .map((m: any) => ({
        subject: localizeUnit(m.unit.name, lang),
        value: Math.round(m.score),
        unitId: m.unitId,
      }));
  }
}
