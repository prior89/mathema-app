import { Module } from '@nestjs/common';
import { FcmService } from './fcm.service';
import { WrongNotesModule } from '../wrong-notes/wrong-notes.module';
import { PushController } from './push.controller';
import { PrivacyModule } from '../privacy/privacy.module';

@Module({
  imports: [PrivacyModule, WrongNotesModule],
  controllers: [PushController],
  providers: [FcmService],
  exports: [FcmService],
})
export class PushModule {}
