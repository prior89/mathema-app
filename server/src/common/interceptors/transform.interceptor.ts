import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

/** 모든 응답을 { data, meta? } 포맷으로 통일.
 *  Exception: /health/* probes. External tooling (ACA liveness/readiness,
 *  Kubernetes, Playwright smoke, uptime monitors) inspects body.status
 *  directly without the {data:...} wrapper. Wrapping makes the wrapper a
 *  load-bearing dependency for ops tools, so health stays raw. */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, T | { data: T }> {
  intercept(ctx: ExecutionContext, next: CallHandler<T>): Observable<T | { data: T }> {
    const req = ctx.switchToHttp().getRequest<{ url?: string }>();
    const url = req?.url ?? '';
    const isHealth = url.startsWith('/health') || url.startsWith('/api/v1/health');
    return next.handle().pipe(map((data) => (isHealth ? data : { data })));
  }
}
