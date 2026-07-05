import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { RedisModule } from '../../infrastructure/redis/redis.module';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { FreeTierSolverQuotaGuard } from './free-tier-solver-quota.guard';
import { OcrDailyQuotaGuard } from './ocr-daily-quota.guard';
import { PremiumAccessService } from './premium-access.service';
import { PremiumFeatureGuard } from './premium-feature.guard';
import { ObfuscatedAccountService } from './obfuscated-account.service';
import { PlayApiClient } from './play-api-client.service';
import { QuotaService } from './quota.service';
import { RtdnController } from './rtdn.controller';
import { RtdnInboxService } from './rtdn-inbox.service';
import { BillingOpsService } from './billing-ops.service';
import { RtdnOrphanReconcileService } from './rtdn-orphan-reconcile.service';
import { RtdnService } from './rtdn.service';

@Module({
  // RedisModule is @Global() but imported explicitly for clarity — QuotaService
  // depends on RedisService.
  imports: [ConfigModule, PrismaModule, RedisModule],
  providers: [
    BillingService,
    ObfuscatedAccountService,
    PlayApiClient,
    QuotaService,
    FreeTierSolverQuotaGuard,
    OcrDailyQuotaGuard,
    PremiumFeatureGuard,
    PremiumAccessService,
    RtdnInboxService,
    RtdnService,
    RtdnOrphanReconcileService,
    BillingOpsService,
  ],
  controllers: [BillingController, RtdnController],
  exports: [
    BillingService,
    BillingOpsService,
    QuotaService,
    FreeTierSolverQuotaGuard,
    OcrDailyQuotaGuard,
    PremiumFeatureGuard,
    PremiumAccessService,
    RtdnService,
    RtdnInboxService,
  ],
})
export class BillingModule {}
