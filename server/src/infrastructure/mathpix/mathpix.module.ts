import { Module } from '@nestjs/common';
import { MathpixService } from './mathpix.service';

@Module({
  providers: [MathpixService],
  exports: [MathpixService],
})
export class MathpixModule {}
