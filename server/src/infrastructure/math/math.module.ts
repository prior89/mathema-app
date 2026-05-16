import { Module, Global } from '@nestjs/common';
import { DeterministicCheckService } from './deterministic-check.service';

@Global()
@Module({
  providers: [DeterministicCheckService],
  exports: [DeterministicCheckService],
})
export class MathModule {}
