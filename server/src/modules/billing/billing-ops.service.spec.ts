import { BillingOpsService } from './billing-ops.service';

function mockConfig(values: Record<string, unknown> = {}) {
  return {
    get: jest.fn((k: string) => values[k] ?? ''),
  };
}

describe('BillingOpsService', () => {
  it('reports G1 not ready when Play env is missing', async () => {
    const prisma = {
      rtdnInbox: {
        groupBy: jest.fn().mockResolvedValue([]),
      },
    };
    const billing = { isBillingUiEnabled: jest.fn().mockReturnValue(false) };
    const svc = new BillingOpsService(
      mockConfig() as any,
      prisma as any,
      billing as any,
      {} as any,
      {} as any,
    );

    const report = await svc.getReadiness();
    expect(report.g1.ready).toBe(false);
    expect(report.g1.checks.find((c) => c.id === 'play_api')?.passed).toBe(false);
  });

  it('reports G1 ready when all automated checks pass', async () => {
    const prisma = {
      rtdnInbox: {
        groupBy: jest.fn().mockResolvedValue([]),
      },
    };
    const billing = { isBillingUiEnabled: jest.fn().mockReturnValue(true) };
    const svc = new BillingOpsService(
      mockConfig({
        'playBilling.credentials': { client_email: 'sa@play.iam.gserviceaccount.com' },
        'playBilling.packageName': 'ai.matheo.app',
        'playBilling.obfuscatedAccountSecret': 'a'.repeat(32),
        'rtdn.audience': 'https://api.example/rtdn',
        'rtdn.serviceAccountEmail': 'pubsub@project.iam.gserviceaccount.com',
      }) as any,
      prisma as any,
      billing as any,
      {} as any,
      {} as any,
    );

    const report = await svc.getReadiness();
    expect(report.g1.ready).toBe(true);
    expect(report.g2.ready).toBe(true);
  });
});