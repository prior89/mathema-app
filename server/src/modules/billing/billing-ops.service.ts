import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RtdnInboxStatus } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { BillingService } from './billing.service';
import { RtdnInboxService } from './rtdn-inbox.service';
import { RtdnService } from './rtdn.service';

export type BillingGateCheck = {
  id: string;
  label: string;
  passed: boolean;
  detail?: string;
};

@Injectable()
export class BillingOpsService {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly billing: BillingService,
    private readonly inbox: RtdnInboxService,
    private readonly rtdn: RtdnService,
  ) {}

  async getReadiness(): Promise<{
    generatedAt: string;
    g1: { ready: boolean; checks: BillingGateCheck[] };
    g2: { ready: boolean; checks: BillingGateCheck[] };
    inbox: Record<string, number>;
    backlog: { orphan: number; retryable: number; dead: number; processing: number };
  }> {
    const playCreds = this.config.get<{ client_email: string } | null>('playBilling.credentials');
    const packageName = this.config.get<string>('playBilling.packageName') ?? '';
    const obfuscatedSecret = this.config.get<string>('playBilling.obfuscatedAccountSecret') ?? '';
    const rtdnAudience = this.config.get<string>('rtdn.audience') ?? '';
    const rtdnEmail = this.config.get<string>('rtdn.serviceAccountEmail') ?? '';
    const billingUi = this.billing.isBillingUiEnabled();

    const inboxGrouped = await this.prisma.rtdnInbox.groupBy({
      by: ['status'],
      _count: { _all: true },
    });
    const inbox: Record<string, number> = {};
    for (const row of inboxGrouped) {
      inbox[row.status] = row._count._all;
    }

    const orphan = inbox.ORPHAN ?? 0;
    const retryable = inbox.RETRYABLE ?? 0;
    const dead = inbox.DEAD ?? 0;
    const processing = inbox.PROCESSING ?? 0;

    const g1Checks: BillingGateCheck[] = [
      {
        id: 'play_api',
        label: 'Play Developer API configured',
        passed: Boolean(playCreds?.client_email && packageName),
        detail: packageName || 'PLAY_PACKAGE_NAME missing',
      },
      {
        id: 'obfuscated_account',
        label: 'HMAC obfuscated account secret configured',
        passed: obfuscatedSecret.length >= 16,
      },
      {
        id: 'rtdn_push',
        label: 'RTDN Pub/Sub push auth configured',
        passed: Boolean(rtdnAudience && rtdnEmail),
      },
      {
        id: 'billing_ui_switch',
        label: 'BILLING_UI_ENABLED runtime switch (internal testing only)',
        passed: billingUi,
        detail: billingUi ? 'ON — paywall exposed' : 'OFF — fail-closed for free PoC',
      },
      {
        id: 'inbox_no_dead',
        label: 'No DEAD RTDN inbox rows',
        passed: dead === 0,
        detail: dead ? `${dead} DEAD row(s) need operator review` : undefined,
      },
    ];

    const g2Checks: BillingGateCheck[] = [
      {
        id: 'inbox_orphan_clear',
        label: 'ORPHAN RTDN inbox drained',
        passed: orphan === 0,
        detail: orphan ? `${orphan} ORPHAN row(s) — run reconcile or wait for cron` : undefined,
      },
      {
        id: 'inbox_retryable_clear',
        label: 'RETRYABLE RTDN inbox drained',
        passed: retryable === 0,
        detail: retryable ? `${retryable} RETRYABLE row(s)` : undefined,
      },
      {
        id: 'license_tester_manual',
        label: 'License tester purchase/restore/cancel/refund E2E (manual)',
        passed: false,
        detail: 'Complete PLAY_BILLING_GATES.md §G2 checklist on device',
      },
    ];

    return {
      generatedAt: new Date().toISOString(),
      g1: { ready: g1Checks.every((c) => c.passed), checks: g1Checks },
      g2: {
        ready: g2Checks.filter((c) => c.id !== 'license_tester_manual').every((c) => c.passed),
        checks: g2Checks,
      },
      inbox,
      backlog: { orphan, retryable, dead, processing },
    };
  }

  async listInbox(opts: {
    status?: RtdnInboxStatus;
    limit?: number;
  }) {
    const limit = Math.min(opts.limit ?? 50, 200);
    return this.prisma.rtdnInbox.findMany({
      where: opts.status ? { status: opts.status } : undefined,
      orderBy: { receivedAt: 'desc' },
      take: limit,
      select: {
        id: true,
        messageId: true,
        status: true,
        attempts: true,
        notificationKind: true,
        purchaseToken: true,
        lastError: true,
        receivedAt: true,
        processedAt: true,
      },
    });
  }

  async reprocessInboxRow(id: string): Promise<{ ok: true }> {
    await this.rtdn.reprocessInboxRowById(id);
    return { ok: true };
  }
}