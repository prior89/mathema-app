import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { PlayApiClient } from './play-api-client.service';

@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [BillingService, PlayApiClient],
  controllers: [BillingController],
  exports: [BillingService],
})
export class BillingModule {}
