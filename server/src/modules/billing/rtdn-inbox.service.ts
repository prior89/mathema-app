import { createHash } from 'crypto';
import { Injectable, Logger } from '@nestjs/common';
import { Prisma, RtdnInbox, RtdnInboxStatus } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { DeveloperNotification } from './rtdn.dto';

export const RTDN_MAX_ATTEMPTS = 10;
export const RTDN_LEASE_MS = 120_000;

export type IngestResult = {
  row: RtdnInbox;
  alreadyProcessed: boolean;
};

@Injectable()
export class RtdnInboxService {
  private readonly logger = new Logger(RtdnInboxService.name);

  constructor(private readonly prisma: PrismaService) {}

  payloadHash(rawData: string): string {
    return createHash('sha256').update(rawData, 'utf8').digest('hex');
  }

  classifyNotification(notification: DeveloperNotification | null): string {
    if (!notification) return 'invalid';
    if (notification.testNotification) return 'test';
    if (notification.subscriptionNotification) return 'subscription';
    if (notification.voidedPurchaseNotification) return 'voided';
    if (notification.oneTimeProductNotification) return 'one_time';
    return 'other';
  }

  extractPurchaseToken(notification: DeveloperNotification | null): string | null {
    if (!notification) return null;
    const sub = notification.subscriptionNotification;
    if (sub?.purchaseToken) return sub.purchaseToken;
    const voided = notification.voidedPurchaseNotification as
      | { purchaseToken?: string }
      | undefined;
    return voided?.purchaseToken ?? null;
  }

  async ingest(params: {
    messageId: string;
    rawData: string;
    decoded: DeveloperNotification | null;
    publishTime?: string;
    pubsubSubscription?: string;
  }): Promise<IngestResult> {
    const { messageId, rawData, decoded, publishTime, pubsubSubscription } = params;
    const payloadHash = this.payloadHash(rawData);
    const payload = {
      decoded,
      pubsub: { messageId, publishTime, subscription: pubsubSubscription },
    };

    try {
      const row = await this.prisma.rtdnInbox.create({
        data: {
          messageId,
          payloadHash,
          payload: payload as Prisma.InputJsonValue,
          notificationKind: this.classifyNotification(decoded),
          purchaseToken: this.extractPurchaseToken(decoded),
          status: 'RECEIVED',
        },
      });
      return { row, alreadyProcessed: false };
    } catch (e: any) {
      if (e?.code !== 'P2002') throw e;
      const existing = await this.prisma.rtdnInbox.findUnique({ where: { messageId } });
      if (!existing) throw e;
      if (existing.status === 'PROCESSED' || existing.status === 'DEAD') {
        return { row: existing, alreadyProcessed: true };
      }
      return { row: existing, alreadyProcessed: false };
    }
  }

  /** Claim a row for processing (lease + attempts++). */
  async claim(id: string): Promise<boolean> {
    const leaseUntil = new Date(Date.now() + RTDN_LEASE_MS);
    const now = new Date();
    const updated = await this.prisma.rtdnInbox.updateMany({
      where: {
        id,
        status: { in: ['RECEIVED', 'RETRYABLE', 'ORPHAN'] },
        OR: [{ leaseUntil: null }, { leaseUntil: { lt: now } }],
      },
      data: {
        status: 'PROCESSING',
        leaseUntil,
        attempts: { increment: 1 },
      },
    });
    return updated.count === 1;
  }

  async markProcessed(id: string): Promise<void> {
    await this.prisma.rtdnInbox.update({
      where: { id },
      data: {
        status: 'PROCESSED',
        processedAt: new Date(),
        leaseUntil: null,
        lastError: null,
      },
    });
  }

  async markOrphan(id: string, error?: string): Promise<void> {
    await this.prisma.rtdnInbox.update({
      where: { id },
      data: {
        status: 'ORPHAN',
        leaseUntil: null,
        lastError: error?.slice(0, 2000) ?? null,
      },
    });
  }

  async markRetryable(id: string, error: string): Promise<{ dead: boolean }> {
    const row = await this.prisma.rtdnInbox.findUnique({ where: { id } });
    const dead = (row?.attempts ?? 0) >= RTDN_MAX_ATTEMPTS;
    await this.prisma.rtdnInbox.update({
      where: { id },
      data: {
        status: dead ? 'DEAD' : 'RETRYABLE',
        lastError: error.slice(0, 2000),
        leaseUntil: null,
        processedAt: dead ? new Date() : undefined,
      },
    });
    if (dead) {
      this.logger.error(
        `RTDN inbox ${id} messageId=${row?.messageId} marked DEAD after ${row?.attempts} attempts: ${error}`,
      );
    }
    return { dead };
  }

  /** Reset ORPHAN/RETRYABLE rows for background reconciliation. */
  async listForReconcile(limit: number): Promise<RtdnInbox[]> {
    const now = new Date();
    return this.prisma.rtdnInbox.findMany({
      where: {
        status: { in: ['ORPHAN', 'RETRYABLE'] },
        OR: [{ leaseUntil: null }, { leaseUntil: { lt: now } }],
      },
      orderBy: { receivedAt: 'asc' },
      take: limit,
    });
  }

  async resetForRetry(id: string): Promise<void> {
    await this.prisma.rtdnInbox.update({
      where: { id },
      data: { status: 'RECEIVED', leaseUntil: null },
    });
  }

  async findById(id: string): Promise<RtdnInbox | null> {
    return this.prisma.rtdnInbox.findUnique({ where: { id } });
  }

  terminalStatuses(): RtdnInboxStatus[] {
    return ['PROCESSED', 'DEAD'];
  }
}