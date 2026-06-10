import { Module, forwardRef } from '@nestjs/common';
import { ParentLinksController } from './parent-links.controller';
import { ParentLinksService } from './parent-links.service';
import { MailModule } from '../../infrastructure/mail/mail.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [MailModule, forwardRef(() => AuthModule)],
  controllers: [ParentLinksController],
  providers: [ParentLinksService],
  exports: [ParentLinksService],
})
export class ParentLinksModule {}