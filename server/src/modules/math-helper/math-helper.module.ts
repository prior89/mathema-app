import { Module } from '@nestjs/common';
import { AttemptsModule } from '../attempts/attempts.module';
import { MathHelperController } from './math-helper.controller';
import { MathHelperService } from './math-helper.service';

@Module({
  imports: [AttemptsModule],
  controllers: [MathHelperController],
  providers: [MathHelperService],
})
export class MathHelperModule {}
