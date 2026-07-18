import { AttemptsService } from './attempts.service';
import { BadRequestException } from '@nestjs/common';

describe('AttemptsService learning-state handoff', () => {
  it('waits for attempt.completed listeners before returning the attempt', async () => {
    let releaseListener!: () => void;
    const listenerFinished = new Promise<void>((resolve) => {
      releaseListener = resolve;
    });
    const attempt = {
      id: 'attempt-1',
      userId: 'student-1',
      problemId: 'problem-1',
      choiceId: null,
      isCorrect: true,
      errorCodes: [],
      hintUsed: false,
      durationSec: 10,
      stepIndex: 1,
      context: 'DIAGNOSTIC',
    };
    const repo = { create: jest.fn().mockResolvedValue(attempt) };
    const events = { emitAsync: jest.fn().mockReturnValue(listenerFinished) };
    const prisma = {
      problemChoice: { findUnique: jest.fn(), findFirst: jest.fn() },
    };
    const service = new AttemptsService(repo as never, events as never, prisma as never);

    let settled = false;
    const pending = service.create('student-1', {}).then((value) => {
      settled = true;
      return value;
    });
    await Promise.resolve();
    await Promise.resolve();

    expect(events.emitAsync).toHaveBeenCalledWith('attempt.completed', attempt);
    expect(settled).toBe(false);

    releaseListener();
    await expect(pending).resolves.toEqual(expect.objectContaining({
      id: 'attempt-1',
      attemptId: 'attempt-1',
      isCorrect: true,
    }));
  });

  it('blocks mockExamResultId on the generic attempt path', async () => {
    const repo = { create: jest.fn() };
    const events = { emitAsync: jest.fn() };
    const prisma = { problemChoice: { findUnique: jest.fn(), findFirst: jest.fn() } };
    const service = new AttemptsService(repo as never, events as never, prisma as never);

    await expect(service.create('student-1', {
      problemId: 'p-1',
      mockExamResultId: 'result-1',
    })).rejects.toBeInstanceOf(BadRequestException);
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('defers attempt.completed when persisting inside an exam transaction', async () => {
    const persisted = { id: 'attempt-1', userId: 'student-1' };
    const tx = { attempt: {} };
    const repo = { create: jest.fn().mockResolvedValue(persisted) };
    const events = { emitAsync: jest.fn() };
    const prisma = { problemChoice: { findUnique: jest.fn(), findFirst: jest.fn() } };
    const service = new AttemptsService(repo as never, events as never, prisma as never);

    await expect(service.createInTransaction('student-1', { problemId: 'p-1' }, tx as never))
      .resolves.toBe(persisted);
    expect(repo.create).toHaveBeenCalledWith('student-1', { problemId: 'p-1' }, tx);
    expect(events.emitAsync).not.toHaveBeenCalled();
  });
});
