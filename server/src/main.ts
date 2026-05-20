// Application Insights — Azure 모니터링. import 보다 먼저 시작해야 자동 계측이 동작.
// APPINSIGHTS_CONNECTION_STRING 미설정이면 no-op (안전).
if (process.env.APPINSIGHTS_CONNECTION_STRING) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const appInsights = require('applicationinsights');
  appInsights.setup(process.env.APPINSIGHTS_CONNECTION_STRING)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true, true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true, false)
    .setSendLiveMetrics(false)
    .setInternalLogging(false, false)
    .start();
  // 샘플링 — 비용 통제 (production 20%)
  appInsights.defaultClient.config.samplingPercentage =
    Number(process.env.APPINSIGHTS_SAMPLING_PCT ?? (process.env.NODE_ENV === 'production' ? 20 : 100));
  appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = 'mathema-backend';
}

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';
import * as promClient from 'prom-client';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

// Sentry 초기화 — DSN 미설정이면 SDK 가 no-op 모드로 동작 (안전).
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV ?? 'development',
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
  });
}

// Prometheus 기본 메트릭 — 프로세스/Node 런타임 카운터 자동 수집.
promClient.collectDefaultMetrics({ prefix: 'mathema_' });

// production 빌드에서 JWT 시크릿 placeholder/약한값 사용 금지 — 가드.
function validateProductionSecrets(logger: Logger) {
  if (process.env.NODE_ENV !== 'production') {
    if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
      logger.warn('JWT secrets missing in env — falling back to dev defaults.');
    }
    return;
  }
  const weak = (s?: string) =>
    !s || s.length < 32 ||
    /^(changeme|secret|default|placeholder|password|api입력|todo|jwt[-_]secret)$/i.test(s);

  const issues: string[] = [];
  if (weak(process.env.JWT_ACCESS_SECRET)) issues.push('JWT_ACCESS_SECRET');
  if (weak(process.env.JWT_REFRESH_SECRET)) issues.push('JWT_REFRESH_SECRET');
  if (process.env.JWT_ACCESS_SECRET && process.env.JWT_ACCESS_SECRET === process.env.JWT_REFRESH_SECRET) {
    issues.push('JWT_ACCESS_SECRET === JWT_REFRESH_SECRET (must differ)');
  }
  if (issues.length > 0) {
    logger.error('FATAL: insecure JWT configuration in production:');
    issues.forEach((i) => logger.error(`  - ${i}`));
    logger.error('Generate with: node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'base64\'))"');
    process.exit(1);
  }
}

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  validateProductionSecrets(logger);

  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = app.get(ConfigService);

  app.use(helmet());
  // CORS allow-list. We include four classes of origin:
  //   1. The SWA-hosted web frontend (webOrigin).
  //   2. The admin frontend (adminOrigin).
  //   3. Capacitor-shipped Android / iOS WebViews — those load the bundled
  //      assets under https://localhost (androidScheme=https in
  //      capacitor.config.ts) and capacitor://localhost on iOS. Without
  //      these the released APK would 404 on every API call because the
  //      browser blocks CORS preflight.
  //   4. http://localhost variants for local dev (Vite + emulator).
  // Comma-separated EXTRA_CORS_ORIGINS env lets ops add staging / preview
  // domains without a redeploy.
  const webOrigin = config.get<string>('app.webOrigin') ?? 'http://localhost:5173';
  const adminOrigin = config.get<string>('app.adminOrigin') ?? 'http://localhost:5174';
  const extra = (process.env.EXTRA_CORS_ORIGINS ?? '')
    .split(',').map((s) => s.trim()).filter(Boolean);
  const allowedOrigins = new Set<string>([
    webOrigin,
    adminOrigin,
    'https://localhost',     // Capacitor Android (androidScheme=https)
    'capacitor://localhost', // Capacitor iOS
    'http://localhost',      // Capacitor dev / iOS simulator
    ...extra,
  ]);
  app.enableCors({
    origin: (origin, cb) => {
      // Allow requests with no Origin header (curl, mobile WebView same-origin
      // navigation) and any origin explicitly in the allow-list. Reject the
      // rest with a CORS error rather than silently letting them through.
      if (!origin || allowedOrigins.has(origin)) return cb(null, true);
      cb(new Error(`CORS: origin not allowed (${origin})`));
    },
    credentials: true,
  });
  // X-Forwarded-For 신뢰 — throttler 가 진짜 client IP 로 카운트하도록.
  app.getHttpAdapter().getInstance().set('trust proxy', 1);
  app.setGlobalPrefix('api/v1');

  // /metrics — Prometheus scrape endpoint (api/v1 prefix 미적용)
  const server = app.getHttpAdapter().getInstance();
  server.get('/metrics', async (_req: any, res: any) => {
    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  const port = config.get<number>('app.port') ?? 4000;
  // Bind to all interfaces explicitly — required inside Container Apps /
  // Docker so the Container Apps gateway can route to the replica.
  await app.listen(port, '0.0.0.0');
  logger.log(`matheo backend listening on 0.0.0.0:${port}`);
}

bootstrap();
