import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ConsentKind } from '@prisma/client';
import { PrivacyService, CURRENT_POLICY_VERSION } from './privacy.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentLang, Lang } from '../../common/i18n/current-lang.decorator';

const POLICY_SUMMARY: Record<Lang, { title: string; sections: Array<{ heading: string; body: string }> }> = {
  ko: {
    title: '개인정보 처리방침 v' + CURRENT_POLICY_VERSION,
    sections: [
      { heading: '수집 정보', body: '이메일, 이름, 시험 일정, 학습 활동(문제 풀이·정답률·소요 시간·디바이스 종류)' },
      { heading: '이용 목적', body: '학습 진단·맞춤 추천 제공, 서비스 개선, 안내 알림(선택 동의 시)' },
      { heading: '보관 기간', body: '계정 활성 기간 + 삭제 요청 후 30일' },
      { heading: '귀하의 권리', body: '열람·정정·삭제 요청, 동의 철회 (DATA_PROCESSING 철회는 계정 삭제로 처리됨)' },
      { heading: '아동·보호자', body: '대한민국 기준 만 14세 미만 학생은 보호자 이메일 확인이 필요합니다. 분석·AI 학습 활용·마케팅은 기본 OFF이며, 보호자 확인 대상 학생과 게스트 계정은 스스로 활성화할 수 없습니다.' },
    ],
  },
  en: {
    title: 'Privacy Policy v' + CURRENT_POLICY_VERSION,
    sections: [
      { heading: 'Data we collect', body: 'Email, name, exam date, study activity (attempts, accuracy, duration, device type)' },
      { heading: 'How we use it', body: 'Diagnostics, personalised recommendations, service improvement, notifications (with consent)' },
      { heading: 'Retention', body: 'Active account period + 30 days after deletion request' },
      { heading: 'Your rights', body: 'Access, rectify, erase data; withdraw consent. Withdrawing DATA_PROCESSING triggers account deletion.' },
      { heading: 'Children & guardians', body: 'Students under 14 in Korea need parent email confirmation. Analytics, AI-training use, and marketing are off by default; guardian-gated students and guest accounts cannot enable them themselves.' },
    ],
  },
  hi: {
    title: 'Privacy Policy v' + CURRENT_POLICY_VERSION,
    sections: [
      { heading: 'Data we collect', body: 'Email, name, target exam date, study activity (attempts, accuracy, duration, device type)' },
      { heading: 'How we use it', body: 'Diagnostics, personalised recommendations, service improvement, notifications (with consent)' },
      { heading: 'Retention', body: 'Active account period + 30 days after deletion request' },
      { heading: 'Your rights', body: 'Access, rectify, erase data; withdraw consent. Withdrawing DATA_PROCESSING triggers account deletion.' },
      { heading: 'Children & guardians', body: 'Students under 14 in Korea need parent email confirmation. Analytics, AI-training use, and marketing are off by default; guardian-gated students and guest accounts cannot enable them themselves.' },
    ],
  },
};

@UseGuards(JwtAuthGuard)
@Controller('privacy')
export class PrivacyController {
  constructor(private readonly service: PrivacyService) {}

  /**
   * Public policy document — surfaced on the unauthenticated /privacy and
   * /terms SPA routes plus the Settings screen. Play Store policy requires a
   * Privacy URL reachable without login, so this is the one endpoint in the
   * controller that escapes the JwtAuthGuard.
   */
  @Public()
  @Get('policy')
  policy(@CurrentLang() lang: Lang) {
    return {
      version: CURRENT_POLICY_VERSION,
      effectiveDate: CURRENT_POLICY_VERSION,
      ...POLICY_SUMMARY[lang],
    };
  }

  /** 내 동의 현재 상태 (모든 kind). */
  @Get('consents')
  status(@CurrentUser('id') userId: string) {
    return this.service.status(userId);
  }

  /** 내 동의 이력 — DPDP/GDPR access right. */
  @Get('consents/history')
  history(@CurrentUser('id') userId: string) {
    return this.service.history(userId);
  }

  /** 동의 부여 (선택 동의 활성화). */
  @Post('consents/:kind')
  grant(
    @CurrentUser('id') userId: string,
    @Param('kind') kind: string,
    @Req() req: any,
  ) {
    const k = this.toKind(kind);
    const ip = req?.ip ?? req?.headers?.['x-forwarded-for'] ?? null;
    const ua = req?.headers?.['user-agent'] ?? null;
    return this.service.grant(userId, k, { ip, ua });
  }

  /** 동의 철회 — DATA_PROCESSING 은 계정 삭제 흐름으로 분기됨. */
  @Delete('consents/:kind')
  revoke(@CurrentUser('id') userId: string, @Param('kind') kind: string) {
    return this.service.revoke(userId, this.toKind(kind));
  }

  private toKind(raw: string): ConsentKind {
    const upper = raw.toUpperCase().replace(/-/g, '_');
    if (!(upper in ConsentKind)) {
      throw new Error(`Unknown consent kind: ${raw}`);
    }
    return upper as ConsentKind;
  }
}
