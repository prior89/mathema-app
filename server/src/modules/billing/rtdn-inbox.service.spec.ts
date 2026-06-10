import { RtdnInboxService } from './rtdn-inbox.service';

function mockPrisma() {
  return {
    rtdnInbox: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      findMany: jest.fn(),
    },
  };
}

describe('RtdnInboxService', () => {
  it('ingests a fresh Pub/Sub message', async () => {
    const prisma = mockPrisma();
    prisma.rtdnInbox.create.mockResolvedValue({ id: 'inbox-1', messageId: 'msg-1', status: 'RECEIVED' });
    const svc = new RtdnInboxService(prisma as any);

    const result = await svc.ingest({
      messageId: 'msg-1',
      rawData: Buffer.from('{}').toString('base64'),
      decoded: { version: '1.0', packageName: 'ai.matheo.app', eventTimeMillis: '1' },
    });

    expect(result.alreadyProcessed).toBe(false);
    expect(prisma.rtdnInbox.create).toHaveBeenCalled();
  });

  it('treats existing PROCESSED row as duplicate', async () => {
    const prisma = mockPrisma();
    prisma.rtdnInbox.create.mockRejectedValue({ code: 'P2002' });
    prisma.rtdnInbox.findUnique.mockResolvedValue({
      id: 'inbox-1',
      messageId: 'msg-dup',
      status: 'PROCESSED',
    });
    const svc = new RtdnInboxService(prisma as any);

    const result = await svc.ingest({
      messageId: 'msg-dup',
      rawData: 'abc',
      decoded: null,
    });

    expect(result.alreadyProcessed).toBe(true);
  });

  it('marks DEAD after max attempts on retryable failure', async () => {
    const prisma = mockPrisma();
    prisma.rtdnInbox.findUnique.mockResolvedValue({ id: 'inbox-1', attempts: 10, messageId: 'msg-x' });
    prisma.rtdnInbox.update.mockResolvedValue({});
    const svc = new RtdnInboxService(prisma as any);

    const { dead } = await svc.markRetryable('inbox-1', 'Play down');
    expect(dead).toBe(true);
    expect(prisma.rtdnInbox.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'inbox-1' },
        data: expect.objectContaining({ status: 'DEAD' }),
      }),
    );
  });
});