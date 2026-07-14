export const REAL_EXAM_SESSION_PREFIX = 'mathema.realexam.';
export const REAL_EXAM_PROGRESS_PREFIX = 'mathema.realexam.progress.';

type StorageReader = Pick<Storage, 'length' | 'key' | 'getItem'>;

export type PendingRealExam = {
  resultId: string;
  name: string;
  startedAt: number;
  userId: string;
};

/** Finds the most recently started full-paper session that still has local
 * progress. Successful submission and explicit discard remove both keys. */
export function findPendingRealExam(storage: StorageReader, userId: string): PendingRealExam | null {
  let latest: PendingRealExam | null = null;
  for (let i = 0; i < storage.length; i += 1) {
    const key = storage.key(i);
    if (!key?.startsWith(REAL_EXAM_SESSION_PREFIX) || key.startsWith(REAL_EXAM_PROGRESS_PREFIX)) continue;
    try {
      const session = JSON.parse(storage.getItem(key) ?? 'null') as { resultId?: unknown; name?: unknown; userId?: unknown } | null;
      if (!session || session.userId !== userId || typeof session.resultId !== 'string' || key !== `${REAL_EXAM_SESSION_PREFIX}${session.resultId}`) continue;
      const progress = JSON.parse(storage.getItem(`${REAL_EXAM_PROGRESS_PREFIX}${session.resultId}`) ?? 'null') as { startedAt?: unknown } | null;
      if (!progress || typeof progress.startedAt !== 'number') continue;
      const candidate: PendingRealExam = {
        resultId: session.resultId,
        name: typeof session.name === 'string' ? session.name : 'Full Mock Exam',
        startedAt: progress.startedAt,
        userId,
      };
      if (!latest || candidate.startedAt > latest.startedAt) latest = candidate;
    } catch {
      // Ignore a corrupt or partially-written local session; other sessions
      // remain recoverable.
    }
  }
  return latest;
}

export function clearPendingRealExams(storage: Pick<Storage, 'length' | 'key' | 'removeItem'>) {
  const keys: string[] = [];
  for (let i = 0; i < storage.length; i += 1) {
    const key = storage.key(i);
    if (key?.startsWith(REAL_EXAM_SESSION_PREFIX)) keys.push(key);
  }
  keys.forEach((key) => storage.removeItem(key));
}
