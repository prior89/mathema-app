import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { MulterError } from 'multer';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    const isMulter = exception instanceof MulterError;
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : isMulter
        ? HttpStatus.BAD_REQUEST
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const body = exception instanceof HttpException
      ? exception.getResponse()
      : isMulter
        ? { message: exception.code === 'LIMIT_FILE_SIZE' ? 'File is too large. Maximum size is 12MB.' : exception.message }
        : { message: 'Internal error' };

    this.logger.error(`${req.method} ${req.url} → ${status}`, exception as any);
    // 5xx 만 Sentry 로 — 4xx 는 클라이언트 잘못이므로 스팸 방지
    if (status >= 500 && process.env.SENTRY_DSN) {
      Sentry.withScope((scope) => {
        scope.setExtra('path', req.url);
        scope.setExtra('method', req.method);
        // Never forward a stable Matheo user ID to the crash processor. The
        // exception, route, release, and environment are enough for diagnosis.
        scope.setUser(null);
        Sentry.captureException(exception);
      });
    }
    res.status(status).json({ error: body, path: req.url, timestamp: new Date().toISOString() });
  }
}
