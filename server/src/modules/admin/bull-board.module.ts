/**
 * MON-3 -- Bull Board admin route.
 *
 * Mounts the @bull-board/express UI under /api/v1/admin/queues so operators
 * can inspect llm-analysis queue depth, failed jobs, retry buttons, etc.
 *
 * Access control: protected by AdminGuard (env ADMIN_EMAILS allowlist) +
 * JwtAuthGuard. The UI ships an SPA that talks back to /admin/queues/api/*
 * REST endpoints; all of them sit under the same guard chain.
 *
 * Wired in main.ts (express adapter must register BEFORE Nest's body parser
 * for some POST endpoints to work; ServerAdapter.setBasePath + getRouter is
 * the right hook).
 */
import { Module, OnModuleInit, Inject } from '@nestjs/common';
import { BullModule, getQueueToken } from '@nestjs/bullmq';
import type { Queue } from 'bullmq';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { LLM_ANALYSIS_QUEUE } from '../llm-analysis/llm-analysis.queue';

export const BULL_BOARD_BASE_PATH = '/api/v1/admin/queues';

@Module({
  imports: [
    // Re-register so Nest exposes the queue token in this module's scope.
    // BullMQ deduplicates by name; the underlying connection is shared with
    // LlmAnalysisModule.
    BullModule.registerQueue({ name: LLM_ANALYSIS_QUEUE }),
  ],
})
export class BullBoardModule implements OnModuleInit {
  /**
   * Singleton ExpressAdapter -- main.ts grabs it after Nest init and mounts
   * its router with the guard chain.
   */
  static readonly serverAdapter = new ExpressAdapter();

  constructor(
    @Inject(getQueueToken(LLM_ANALYSIS_QUEUE)) private readonly llmQueue: Queue,
  ) {}

  onModuleInit() {
    BullBoardModule.serverAdapter.setBasePath(BULL_BOARD_BASE_PATH);
    createBullBoard({
      queues: [new BullMQAdapter(this.llmQueue)],
      serverAdapter: BullBoardModule.serverAdapter,
    });
  }
}
