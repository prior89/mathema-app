import { Module } from '@nestjs/common';
import { DiagnosticController } from './diagnostic.controller';
import { DiagnosticService } from './diagnostic.service';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AttemptsModule } from '../attempts/attempts.module';

@Module({
  imports: [PrismaModule, AttemptsModule],
  controllers: [DiagnosticController],
  providers: [DiagnosticService],
})
export class DiagnosticModule {}
