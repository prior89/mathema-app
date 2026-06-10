import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { RedisModule } from '../../infrastructure/redis/redis.module';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { FreeTierSolverQuotaGuard } from './free-tier-solver-quota.guard';
import { PremiumAccessService } from './premium-access.service';
import { PremiumFeatureGuard } from './premium-feature.guard';
import { ObfuscatedAccountService } from './obfuscated-account.service';
import { PlayApiClient } from './play-api-client.service';
import { QuotaService } from './quota.service';
import { RtdnController } from './rtdn.controller';
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
    PremiumFeatureGuard,
    PremiumAccessService,
    RtdnService,
  ],
  controllers: [BillingController, RtdnController],
  exports: [
    BillingService,
    QuotaService,
    FreeTierSolverQuotaGuard,
    PremiumFeatureGuard,
    PremiumAccessService,
  ],
})
export class BillingModule {}
