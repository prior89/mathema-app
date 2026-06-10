import { Module } from '@nestjs/common';
import { GuardianConsentController } from './guardian-consent.controller';
import { GuardianConsentService } from './guardian-consent.service';

@Module({
  controllers: [GuardianConsentController],
  providers: [GuardianConsentService],
  exports: [GuardianConsentService],
})
export class GuardianConsentModule {}