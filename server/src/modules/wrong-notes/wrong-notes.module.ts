import { Module } from '@nestjs/common';
import { WrongNotesController } from './wrong-notes.controller';
import { WrongNotesService } from './wrong-notes.service';
import { WrongNotesRepository } from './wrong-notes.repository';
import { OcrService } from './services/ocr.service';
import { PdfExtractorService } from './services/pdf-extractor.service';
import { SimilarFinderService } from './services/similar-finder.service';
import { SpacedRepetitionService } from './services/spaced-repetition.service';
import { ReviewSchedulerService } from './review-scheduler.service';
import { AttemptsModule } from '../attempts/attempts.module';
import { BillingModule } from '../billing/billing.module';

/**
 * 오답노트 — 오답노트 페이지 전체 + 대시보드 "최근 오답 인사이트" 카드.
 * 사진/직접/PDF 3가지 등록 경로, AI 인사이트 자동 생성, 유사문제 추천,
 * SM-2 간격 반복(망각 곡선 대응) 포함. AttemptsModule 의존성은 review-queue
 * checkAnswer 가 Attempt + (오답 시) WrongNote upsert 흐름을 재사용하기 위함.
 */
@Module({
  imports: [AttemptsModule, BillingModule],
  controllers: [WrongNotesController],
  providers: [
    WrongNotesService,
    WrongNotesRepository,
    OcrService,
    PdfExtractorService,
    SimilarFinderService,
    SpacedRepetitionService,
    ReviewSchedulerService,
  ],
  exports: [WrongNotesService, SpacedRepetitionService, WrongNotesRepository, ReviewSchedulerService],
})
export class WrongNotesModule {}
