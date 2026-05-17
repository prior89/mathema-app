import { Module } from '@nestjs/common';
import { MathpixModule } from '../../infrastructure/mathpix/mathpix.module';
import { AttemptsModule } from '../attempts/attempts.module';
import { MathHelperController } from './math-helper.controller';
import { MathHelperService } from './math-helper.service';

@Module({
  imports: [AttemptsModule, MathpixModule],
  controllers: [MathHelperController],
  providers: [MathHelperService],
})
export class MathHelperModule {}
