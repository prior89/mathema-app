import { Module } from '@nestjs/common';
import { FcmService } from './fcm.service';
import { PushController } from './push.controller';
import { PrivacyModule } from '../privacy/privacy.module';

@Module({
  imports: [PrivacyModule],
  controllers: [PushController],
  providers: [FcmService],
  exports: [FcmService],
})
export class PushModule {}
