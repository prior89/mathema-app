import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ConsentKind } from '@prisma/client';
import { Observable, tap } from 'rxjs';
import { AnalyticsService } from './analytics.service';
import { PrivacyService } from '../privacy/privacy.service';

/**
 * 인증된 모든 API 호출을 자동으로 AnalyticsEvent로 기록.
 *
 * 기록 내용: { method, path, statusCode, durationMs }
 * 제외 path:
 *   - /analytics/events  (자기 자신 — 무한 루프 방지)
 *   - /health            (모니터링 노이즈)
 *
 * fire-and-forget — 분석 기록 실패가 사용자 응답을 막지 않음.
 */
@Injectable()
export class AnalyticsInterceptor implements NestInterceptor {
  private static readonly SKIP_PATHS = ['/analytics/events', '/health', '/api/v1/analytics/events', '/api/v1/health'];
  private static readonly CONSENT_CACHE_MS = 5 * 60_000;

  // Play Families / DPDP: behavioral telemetry must honor the ANALYTICS consent
  // (minors get it forced false), so api.call logging is gated per user.
  // Cached to avoid one consent query per API call; 5-min staleness on
  // revoke is acceptable for fire-and-forget telemetry.
  private readonly consentCache = new Map<string, { allowed: boolean; exp: number }>();

  constructor(
    private readonly analytics: AnalyticsService,
    private readonly privacy: PrivacyService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest();
    const res = http.getResponse();
    const start = Date.now();
    const path: string = req.originalUrl?.split('?')[0] ?? req.url ?? '';
    const method: string = req.method;
    const skip = AnalyticsInterceptor.SKIP_PATHS.some((p) => path.startsWith(p));

    return next.handle().pipe(
      tap({
        next: () => !skip && this.log(req, res, path, method, start, true),
        error: () => !skip && this.log(req, res, path, method, start, false),
      }),
    );
  }

  private log(req: any, res: any, path: string, method: string, start: number, ok: boolean) {
    const userId = req?.user?.id ?? null;
    if (!userId) return; // 비인증 호출은 기록 X (랜딩 페이지뷰는 frontend가 직접 보냄)
    void this.logIfConsented(req, res, path, method, start, ok, userId);
  }

  private async logIfConsented(
    req: any, res: any, path: string, method: string, start: number, ok: boolean, userId: string,
  ) {
    if (!(await this.hasAnalyticsConsent(userId))) return;
    void this.analytics.record({
      userId,
      eventType: 'api.call',
      payload: {
        method, path,
        statusCode: ok ? res.statusCode : (res.statusCode || 500),
        durationMs: Date.now() - start,
      },
      sessionId: req.headers['x-session-id'] ?? null,
      userAgent: req.headers['user-agent'] ?? null,
      source: 'backend',
    });
  }

  private async hasAnalyticsConsent(userId: string): Promise<boolean> {
    const now = Date.now();
    const cached = this.consentCache.get(userId);
    if (cached && cached.exp > now) return cached.allowed;
    let allowed = false;
    try {
      allowed = await this.privacy.isActive(userId, ConsentKind.ANALYTICS);
    } catch {
      // fail closed — no telemetry without a confirmed consent
    }
    this.consentCache.set(userId, { allowed, exp: now + AnalyticsInterceptor.CONSENT_CACHE_MS });
    if (this.consentCache.size > 10_000) {
      for (const [k, v] of this.consentCache) {
        if (v.exp <= now) this.consentCache.delete(k);
      }
    }
    return allowed;
  }
}
