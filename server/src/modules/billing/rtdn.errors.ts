/** Transient RTDN failure — controller should return 5xx so Pub/Sub retries. */
export class RtdnRetryableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RtdnRetryableError';
  }
}

/** No local Subscription row yet — durable ORPHAN inbox + 2xx (cron reconciles). */
export class RtdnOrphanError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RtdnOrphanError';
  }
}

export function isRtdnRetryableError(e: unknown): e is RtdnRetryableError {
  return e instanceof RtdnRetryableError;
}

export function isRtdnOrphanError(e: unknown): e is RtdnOrphanError {
  return e instanceof RtdnOrphanError;
}