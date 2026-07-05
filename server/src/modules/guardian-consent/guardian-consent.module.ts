import { Module } from '@nestjs/common';
import { GuardianConsentController } from './guardian-consent.controller';
import { GuardianConsentService } from './guardian-consent.service';
import { PassProviderService } from './pass-provider.service';

@Module({
  controllers: [GuardianConsentController],
  providers: [GuardianConsentService, PassProviderService],
  exports: [GuardianConsentService],
})
export class GuardianConsentModule {}