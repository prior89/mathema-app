import { Module } from '@nestjs/common';
import { AdaptiveDiagnosticService } from './adaptive-diagnostic.service';
import { DiagnosticController } from './diagnostic.controller';
import { DiagnosticService } from './diagnostic.service';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AttemptsModule } from '../attempts/attempts.module';
import { FeatureFlagsModule } from '../feature-flags/feature-flags.module';

@Module({
  imports: [PrismaModule, AttemptsModule, FeatureFlagsModule],
  controllers: [DiagnosticController],
  providers: [DiagnosticService, AdaptiveDiagnosticService],
  exports: [AdaptiveDiagnosticService],
})
export class DiagnosticModule {}
