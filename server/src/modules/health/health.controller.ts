import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import type { Response } from 'express';
import { Public } from '../../common/decorators/public.decorator';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RedisService } from '../../infrastructure/redis/redis.service';
import { NCERT_CHAPTERS } from '../../common/curriculum/ncert-chapters';
import { CHAPTER_CONTENT } from '../../common/curriculum/concept-content';
import { KOREAN_CHAPTER_CONTENT } from '../../common/curriculum/concept-content-ko';

type ProviderHealthStatus = 'ready' | 'mock' | 'disabled' | 'not_configured' | 'not_implemented';

type ProviderHealthCheck = {
  id: string;
  status: ProviderHealthStatus;
  ready: boolean;
  required: boolean;
  message: string;
};

/**
 * 헬스 엔드포인트 — Azure Container Apps probe 와 1:1 매핑.
 *   /health            기본 호환 (이전 코드 호출용)
 *   /health/live       liveness — 프로세스가 살아있는지 (DB/Redis 미접속 시에도 200)
 *   /health/ready      readiness — DB·Redis 동작 확인 (의존성 끊기면 503)
 *   /health/version    release inventory — 어떤 SHA·migration·content가 떠있는지
 *                      (gitSha/buildTime/releaseId/dbMigrationHead/contentVersion/env).
 *                      추측 금지를 위해 smoke test 첫 step 으로 호출.
 */
@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  @Public() @Get()
  ok() {
    return { status: 'ok', service: 'mathema-backend', time: new Date().toISOString() };
  }

  @Public() @Get('live')
  live() {
    return { status: 'ok', uptime: process.uptime() };
  }

  /**
   * Release inventory — 라이브가 어떤 commit/migration/content 인지 한 번에 확인.
   * 모든 필드는 graceful fallback: env 누락 시 'unknown', DB 실패 시 null. 의존성
   * 끊겨도 200 + 부분 정보 반환 (probe 가 아니라 inventory 용도이므로).
   *
   * - gitSha          GIT_SHA env (Docker build arg 로 주입). 누락 시 'unknown'.
   * - buildTime       BUILD_TIME env (Docker build 시각, ISO-8601). 누락 시 'unknown'.
   * - releaseId       RELEASE_ID env (deploy 식별자). 누락 시 gitSha 앞 7자.
   * - dbMigrationHead 가장 최근 적용된 prisma migration_name. _prisma_migrations
   *                   접근 실패 시 null (테이블 없음·권한 부족 등).
   * - contentVersion  curriculum 데이터 카운트 — concept-lessons.bootstrap.ts 의
   *                   sync 로직과 짝이 됨. ncertChapters/conceptChapters/koreanConceptChapters.
   * - env             NODE_ENV (production / staging / development).
   */
  @Public() @Get('version')
  async version() {
    const gitSha = process.env.GIT_SHA ?? 'unknown';
    const buildTime = process.env.BUILD_TIME ?? 'unknown';
    const releaseId = process.env.RELEASE_ID ?? (gitSha !== 'unknown' ? gitSha.slice(0, 7) : 'unknown');
    const env = process.env.NODE_ENV ?? 'unknown';

    let dbMigrationHead: string | null = null;
    try {
      const rows = await this.prisma.$queryRaw<Array<{ migration_name: string }>>`
        SELECT migration_name FROM _prisma_migrations
        WHERE finished_at IS NOT NULL
        ORDER BY finished_at DESC
        LIMIT 1
      `;
      dbMigrationHead = rows[0]?.migration_name ?? null;
    } catch {
      dbMigrationHead = null;
    }

    return {
      gitSha,
      buildTime,
      releaseId,
      dbMigrationHead,
      contentVersion: {
        ncertChapters: NCERT_CHAPTERS.length,
        conceptChapters: Object.keys(CHAPTER_CONTENT).length,
        koreanConceptChapters: Object.keys(KOREAN_CHAPTER_CONTENT).length,
      },
      env,
      time: new Date().toISOString(),
    };
  }

  @Public() @Get('ready')
  async ready(@Res({ passthrough: true }) res: Response) {
    const checks: Record<string, 'ok' | string> = {};
    try { await this.prisma.$queryRaw`SELECT 1`; checks.db = 'ok'; }
    catch (e) { checks.db = (e as Error).message; }
    try { await this.redis.get('health:ping'); checks.redis = 'ok'; }
    catch (e) { checks.redis = (e as Error).message; }
    const ready = checks.db === 'ok' && checks.redis === 'ok';
    // ACA readiness probe relies on the HTTP status code, not the body --
    // returning 200 while degraded would keep routing traffic to a backend
    // that can't talk to its DB. Set 503 so probes drain the bad replica.
    if (!ready) res.status(HttpStatus.SERVICE_UNAVAILABLE);
    return { status: ready ? 'ready' : 'degraded', checks, time: new Date().toISOString() };
  }

  @Public() @Get('providers')
  providers(@Res({ passthrough: true }) res: Response) {
    const checks = this.authProviderChecks();
    const ready = checks.filter((c) => c.required).every((c) => c.ready);
    if (!ready) res.status(HttpStatus.SERVICE_UNAVAILABLE);
    return {
      status: ready ? 'ready' : 'degraded',
      checks,
      time: new Date().toISOString(),
    };
  }

  private authProviderChecks(): ProviderHealthCheck[] {
    const prod = process.env.NODE_ENV === 'production';
    const passEnabled = process.env.GUARDIAN_PASS_ENABLED === 'true';
    const passProvider = process.env.GUARDIAN_PASS_PROVIDER ?? 'mock';
    const otpMock = process.env.OTP_AUTH_MOCK === 'true';
    const otpEnabled = otpMock || process.env.OTP_AUTH_ENABLED === 'true' || this.present(process.env.MSG91_AUTH_KEY);
    const socialMock = process.env.SOCIAL_AUTH_MOCK === 'true';

    return [
      this.checkPassProvider({ prod, enabled: passEnabled, provider: passProvider }),
      {
        id: 'kr_social_kakao_naver_backend',
        status: socialMock ? (prod ? 'not_configured' : 'mock') : 'ready',
        ready: !socialMock || !prod,
        required: true,
        message: socialMock
          ? 'SOCIAL_AUTH_MOCK auto-approves Kakao/Naver identities; use only in local/dev.'
          : 'Backend verifies Kakao/Naver provider access tokens against provider userinfo APIs. Client SDK wiring is checked in the app build.',
      },
      this.checkOtpProvider({ prod, enabled: otpEnabled, mock: otpMock }),
    ];
  }

  private checkPassProvider(opts: { prod: boolean; enabled: boolean; provider: string }): ProviderHealthCheck {
    if (!opts.enabled) {
      return {
        id: 'kr_guardian_pass',
        status: 'disabled',
        ready: true,
        required: false,
        message: 'GUARDIAN_PASS_ENABLED is not true; KR under-14 guardian consent falls back to the non-PASS rail.',
      };
    }
    if (opts.provider === 'mock') {
      return {
        id: 'kr_guardian_pass',
        status: opts.prod ? 'not_configured' : 'mock',
        ready: !opts.prod,
        required: true,
        message: 'GUARDIAN_PASS_PROVIDER=mock auto-approves guardian identity; production must use a real PASS/NICE/PortOne provider.',
      };
    }
    return {
      id: 'kr_guardian_pass',
      status: 'not_implemented',
      ready: false,
      required: true,
      message: `GUARDIAN_PASS_PROVIDER=${opts.provider} is selected, but the real provider branch is not wired yet.`,
    };
  }

  private checkOtpProvider(opts: { prod: boolean; enabled: boolean; mock: boolean }): ProviderHealthCheck {
    if (!opts.enabled) {
      return {
        id: 'in_phone_otp_truecaller',
        status: 'disabled',
        ready: true,
        required: false,
        message: 'OTP_AUTH_ENABLED is not true and MSG91_AUTH_KEY is absent; India phone OTP/Truecaller rail should stay hidden.',
      };
    }
    if (opts.mock) {
      return {
        id: 'in_phone_otp_truecaller',
        status: opts.prod ? 'not_configured' : 'mock',
        ready: !opts.prod,
        required: true,
        message: 'OTP_AUTH_MOCK echoes OTP codes and fakes Truecaller identities; production must use real providers.',
      };
    }
    return {
      id: 'in_phone_otp_truecaller',
      status: 'not_implemented',
      ready: false,
      required: true,
      message: 'MSG91/Truecaller credentials may be present, but real SMS and Truecaller verification branches are not wired yet.',
    };
  }

  private present(value: string | undefined): boolean {
    return !!value && value.trim().length > 0;
  }
}
