import { Injectable } from '@nestjs/common';
import { MasteryRepository } from './mastery.repository';
import { Lang } from '../../common/i18n/current-lang.decorator';
import { UNIT_NAME_EN } from '../../common/i18n/content-en';
import { UNIT_NAME_HI } from '../../common/i18n/content-hi';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

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
    // Country gate: findAll queries MasterySnapshot.include({unit:true}) and
    // Unit is NCERT-only. KR 사용자에게는 NCERT 단원명 (Linear Programming,
    // Application of Integrals 등) 영어/HI 라벨이 노출되는 cross-curriculum
    // 결함. KR Mastery aggregation 은 Phase 4. 그 전엔 빈 배열.
    const me = await this.prisma.user.findUnique({
      where: { id: userId }, select: { country: true },
    });
    if (me?.country === 'KR') return [];

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
