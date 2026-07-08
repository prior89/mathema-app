import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';
import { BillingService } from './billing.service';
import { QuotaService } from './quota.service';

/**
 * Refund a free-tier solver credit when the solve itself fails.
 *
 * FreeTierSolverQuotaGuard increments the daily counter BEFORE the handler runs
 * (it must fail-closed on the cap). So if the downstream solve then fails —
 * math-helper unavailable, LLM error, upstream 5xx — a free user would lose one
 * of their 8/day credits for a solve they never received. This interceptor
 * catches that and gives the credit back.
 *
 * Safe by construction:
 *  - NestJS runs guards BEFORE interceptors, so the guard's own QuotaExceeded is
 *    thrown before this interceptor is even invoked — we only ever see handler
 *    (solve) errors, never the quota rejection itself.
 *  - Premium users are skipped (their solve never incremented a counter).
 *  - The refund is fire-and-forget and best-effort: it never delays or masks the
 *    original error, and refundSolver() won't drive the counter below zero.
 */
@Injectable()
export class SolverQuotaRefundInterceptor implements NestInterceptor {
  constructor(
    private readonly billing: BillingService,
    private readonly quota: QuotaService,
  ) {}

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = ctx.switchToHttp().getRequest<{ user?: { id?: string } }>();
    const userId = req.user?.id;
    return next.handle().pipe(
      catchError((err) => {
        if (userId) {
          void (async () => {
            try {
              if (!(await this.billing.isPremium(userId))) {
                await this.quota.refundSolver(userId);
              }
            } catch {
              /* best-effort — never let a refund failure change the response */
            }
          })();
        }
        return throwError(() => err);
      }),
    );
  }
}
