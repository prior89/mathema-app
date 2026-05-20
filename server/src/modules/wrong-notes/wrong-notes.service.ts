import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WrongNotesRepository } from './wrong-notes.repository';
import { OcrService } from './services/ocr.service';
import { PdfExtractorService } from './services/pdf-extractor.service';
import { SimilarFinderService } from './services/similar-finder.service';
import { SpacedRepetitionService } from './services/spaced-repetition.service';
import { AttemptsService } from '../attempts/attempts.service';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateWrongNoteDto } from './dto/create-wrong-note.dto';
import { QueryWrongNotesDto } from './dto/query-wrong-notes.dto';
import { ReviewWrongNoteDto } from './dto/review-wrong-note.dto';
import { Lang } from '../../common/i18n/current-lang.decorator';
import { STATIC_FALLBACK_EN } from '../../common/i18n/content-en';

@Injectable()
export class WrongNotesService {
  constructor(
    private readonly repo: WrongNotesRepository,
    private readonly ocr: OcrService,
    private readonly pdf: PdfExtractorService,
    private readonly similar: SimilarFinderService,
    private readonly sr: SpacedRepetitionService,
    private readonly attempts: AttemptsService,
    private readonly prisma: PrismaService,
    private readonly events: EventEmitter2,
  ) {}

  getStats(userId: string) { return this.repo.aggregateStats(userId); }
  getRecent(userId: string, limit: number, lang: Lang = 'en') { return this.repo.findRecent(userId, limit, lang); }
  list(userId: string, query: QueryWrongNotesDto, lang: Lang = 'en') { return this.repo.list(userId, query, lang); }
  getDue(userId: string, limit?: number, lang: Lang = 'en') { return this.repo.findDue(userId, limit, lang); }

  /**
   * Review queue — FIFO with 3-day cooldown + sequential gate.
   *
   * Returns the SINGLE oldest wrong note ready for review:
   *  - status != MASTERED
   *  - createdAt < now − 3 days   (so the user has time to absorb the lesson
   *    before re-encountering the problem; deliberate spaced-practice gap)
   *
   * The frontend renders exactly one problem at a time and won't advance until
   * the user solves it (forced sequential review). Returns null when nothing
   * is ready (queue empty or every item still in cooldown).
   */
  async getQueueNext(userId: string) {
    const COOLDOWN_DAYS = 3;
    const threshold = new Date(Date.now() - COOLDOWN_DAYS * 24 * 60 * 60 * 1000);
    const note = await this.prisma.wrongNote.findFirst({
      where: { userId, status: { not: 'MASTERED' }, createdAt: { lte: threshold } },
      orderBy: { createdAt: 'asc' },
      include: {
        problem: {
          select: { id: true, body: true, source: true, answer: true, conceptLessonId: true, hint: true },
        },
      },
    });
    const totalEligible = await this.prisma.wrongNote.count({
      where: { userId, status: { not: 'MASTERED' }, createdAt: { lte: threshold } },
    });
    // Next-up timestamp (when the OLDEST non-eligible note becomes eligible) —
    // useful for UI copy like "Next problem unlocks Wed 5pm" when the queue is
    // empty but some notes are still in cooldown.
    const nextEligibleAt = note
      ? null
      : await this.prisma.wrongNote.findFirst({
          where: { userId, status: { not: 'MASTERED' }, createdAt: { gt: threshold } },
          orderBy: { createdAt: 'asc' },
          select: { createdAt: true },
        });
    return {
      wrongNote: note
        ? {
            wrongNoteId: note.id,
            problemId: note.problemId,
            problemBody: note.problem.body,
            source: note.problem.source,
            // problem.answer is NOT included in the payload — clients used to
            // grade locally, which leaked the answer via DevTools and skipped
            // Attempt creation. Channel all grading through POST /:id/check.
            hint: note.problem.hint,
            occurrences: note.occurrences,
            createdAt: note.createdAt.toISOString(),
          }
        : null,
      totalEligible,
      nextEligibleAt: nextEligibleAt
        ? new Date(nextEligibleAt.createdAt.getTime() + COOLDOWN_DAYS * 24 * 60 * 60 * 1000).toISOString()
        : null,
    };
  }

  /**
   * Server-side grading for the review-queue UX.
   *
   * Replaces the earlier client-side compare which (a) leaked problem.answer
   * to the browser, (b) bypassed Attempt creation, and (c) never ran SM-2.
   *
   * Behaviour:
   *   - Look up the wrong note (scoped to userId — 404 otherwise).
   *   - Create an Attempt (context: PRACTICE) so DailyActivity, streaks, and
   *     accuracy stats reflect this work.
   *   - If the student answer matches problem.answer (normalised), mark the
   *     wrong note MASTERED and stamp masteredAt. The forced-sequential queue
   *     in ReviewQueueScreen relies on this single source of truth.
   *
   * Returns { isCorrect, totalEligible: number } so the client can update the
   * "N ready" header without a second round-trip.
   */
  async checkAnswer(
    userId: string,
    wrongNoteId: string,
    dto: { answer: string; durationSec?: number },
  ) {
    const note = await this.prisma.wrongNote.findFirst({
      where: { id: wrongNoteId, userId },
      include: { problem: { select: { id: true, answer: true } } },
    });
    if (!note) {
      // Don't reveal "exists but wrong owner" — same NotFound for both cases.
      throw new NotFoundException(`Wrong note not found`);
    }

    const normalize = (s: string) =>
      (s ?? '').trim().toLowerCase().replace(/\s+/g, '');
    const isCorrect = normalize(dto.answer) === normalize(note.problem.answer);
    // Clamp duration to a sane range — the canvas/input can stay open
    // arbitrarily long, but we don't want to credit users with hours per problem.
    const durationSec = Math.max(1, Math.min(600, Math.floor(dto.durationSec ?? 60)));

    // attemptsService.create already handles Attempt + (on isCorrect=false)
    // WrongNote upsert. We pass the problemId so existing wrong-note logic
    // increments occurrences rather than creating duplicates.
    // NOTE: status flip below intentionally happens AFTER the attempt, so the
    // mastery side-effect listeners see the final state.
    const attempt = await this.attempts.create(userId, {
      problemId: note.problem.id,
      answer: dto.answer ?? '',
      durationSec,
      context: 'PRACTICE',
    });

    if (isCorrect) {
      await this.prisma.wrongNote.update({
        where: { id: note.id },
        data: { status: 'MASTERED', masteredAt: new Date() },
      });
    }

    const COOLDOWN_DAYS = 3;
    const threshold = new Date(Date.now() - COOLDOWN_DAYS * 24 * 60 * 60 * 1000);
    const totalEligible = await this.prisma.wrongNote.count({
      where: { userId, status: { not: 'MASTERED' }, createdAt: { lte: threshold } },
    });

    return {
      isCorrect,
      totalEligible,
      attemptId: attempt.id,
    };
  }
  async getOne(userId: string, id: string, lang: Lang = 'en') {
    const note = await this.repo.findOne(userId, id, lang);
    const similar = await this.similar.findSimilar(note.problemId, 5);
    return { ...note, similar };
  }
  create(userId: string, dto: CreateWrongNoteDto) { return this.repo.create(userId, dto); }
  async uploadPhoto(_userId: string, file: Express.Multer.File, lang: Lang = 'en') {
    if (!file) return { ok: false, message: 'file required' };
    const visionConfigured = !!(process.env.AI_VISION_API_KEY && process.env.AI_VISION_API_KEY !== 'api입력칸');
    if (!visionConfigured) {
      return { ok: false, message: lang !== 'ko'
        ? 'Photo OCR not available right now.'
        : '사진 자동 인식 서비스가 현재 사용 불가입니다.' };
    }
    return { ok: true, message: lang !== 'ko' ? STATIC_FALLBACK_EN.uploadPhotoOk : '사진이 등록되었습니다.' };
  }
  async uploadPdf(_userId: string, file: Express.Multer.File, lang: Lang = 'en') {
    if (!file) return { ok: false, message: 'file required' };
    const llmConfigured = !!(process.env.AI_LLM_API_KEY && process.env.AI_LLM_API_KEY !== 'api입력칸');
    if (!llmConfigured) {
      return { ok: false, message: lang !== 'ko'
        ? 'PDF batch extraction not available right now.'
        : 'PDF 자동 분리 서비스가 현재 사용 불가입니다.' };
    }
    return { ok: true, message: lang !== 'ko' ? STATIC_FALLBACK_EN.uploadPdfOk : 'PDF 가 등록되었습니다.' };
  }

  async updateStatus(userId: string, id: string, status: string) {
    const updated = await this.repo.updateStatus(userId, id, status as any);
    if (status === 'MASTERED') {
      this.events.emit('wrong-note.mastered', { userId, problemId: updated.problemId });
    }
    return updated;
  }

  /**
   * SM-2 복습 처리.
   * 4단계 quality(AGAIN/HARD/GOOD/EASY) → SM-2 갱신.
   * 연속 EASY 3회 이상 시 자동 MASTERED 처리.
   */
  async review(userId: string, id: string, dto: ReviewWrongNoteDto) {
    const current = await this.prisma.wrongNote.findFirstOrThrow({
      where: { id, userId },
    });
    const q = SpacedRepetitionService.parseQuality(dto.quality);
    const sm2 = this.sr.apply({
      easinessFactor: current.easinessFactor,
      repetitionCount: current.repetitionCount,
      intervalDays: current.intervalDays,
    }, q);

    const updated = await this.repo.applyReview(userId, id, sm2);

    // 자동 MASTERED: 연속 EASY 3회 + 간격 30일 이상이면 졸업
    if (q === 5 && updated.repetitionCount >= 3 && updated.intervalDays >= 30) {
      await this.repo.updateStatus(userId, id, 'MASTERED' as any);
      this.events.emit('wrong-note.mastered', { userId, problemId: updated.problemId });
    }

    return {
      id: updated.id,
      easinessFactor: Math.round(updated.easinessFactor * 100) / 100,
      repetitionCount: updated.repetitionCount,
      intervalDays: updated.intervalDays,
      nextReviewAt: updated.nextReviewAt?.toISOString() ?? null,
      lapsed: sm2.lapsed,
      autoMastered: q === 5 && updated.repetitionCount >= 3 && updated.intervalDays >= 30,
    };
  }
}
