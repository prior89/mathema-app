import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { RedisModule } from '../../infrastructure/redis/redis.module';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { FreeTierSolverQuotaGuard } from './free-tier-solver-quota.guard';
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
    PlayApiClient,
    QuotaService,
    FreeTierSolverQuotaGuard,
    RtdnService,
  ],
  controllers: [BillingController, RtdnController],
  // Export the guard + QuotaService so MathHelperModule can wire the guard
  // onto its POST endpoints.
  exports: [BillingService, QuotaService, FreeTierSolverQuotaGuard],
})
export class BillingModule {}
