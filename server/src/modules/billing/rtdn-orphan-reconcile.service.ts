import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RtdnInboxService } from './rtdn-inbox.service';
import { RtdnService } from './rtdn.service';

/** Re-processes ORPHAN / stale RETRYABLE RTDN inbox rows (e.g. verify arrived late). */
@Injectable()
export class RtdnOrphanReconcileService {
  private readonly logger = new Logger(RtdnOrphanReconcileService.name);
  private running = false;

  constructor(
    private readonly inbox: RtdnInboxService,
    private readonly rtdn: RtdnService,
  ) {}

  @Cron('0 */15 * * * *', { name: 'rtdn-orphan-reconcile' })
  async reconcileOrphans(): Promise<void> {
    if (this.running) return;
    this.running = true;
    try {
      const rows = await this.inbox.listForReconcile(50);
      if (rows.length === 0) return;

      this.logger.log(`RTDN reconcile: ${rows.length} ORPHAN/RETRYABLE row(s)`);
      for (const row of rows) {
        try {
          await this.rtdn.reprocessInboxRowById(row.id);
        } catch (e) {
          this.logger.warn(
            `RTDN reconcile failed for ${row.messageId}: ${(e as Error).message}`,
          );
        }
      }
    } finally {
      this.running = false;
    }
  }
}