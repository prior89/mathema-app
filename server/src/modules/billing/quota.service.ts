import { Injectable } from '@nestjs/common';
import { RedisService } from '../../infrastructure/redis/redis.service';

/** Daily call quota tracking — backs the Free-tier 8/day AI Solver cap.
 * Keyed by (userId, UTC date). Auto-expires after 25h so the previous
 * day rolls off without manual cleanup. */
@Injectable()
export class QuotaService {
  constructor(private readonly redis: RedisService) {}

  private dayKey(d: Date = new Date()): string {
    return d.toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
  }
  private redisKey(userId: string, day: string): string {
    return `quota:solver:${userId}:${day}`;
  }
  private nextMidnightUtc(d: Date = new Date()): Date {
    const t = new Date(d);
    t.setUTCHours(24, 0, 0, 0);
    return t;
  }

  /** Atomic-ish INCR + first-call EXPIRE. Uses RedisService.incrWithTtl
   * which encapsulates the standard rate-limit pattern. 25h cushion ensures
   * the key is still around briefly past midnight UTC for late requests. */
  async incrementSolver(userId: string): Promise<number> {
    const key = this.redisKey(userId, this.dayKey());
    return this.redis.incrWithTtl(key, 60 * 60 * 25);
  }

  async getSolverUsed(userId: string): Promise<number> {
    const v = await this.redis.get(this.redisKey(userId, this.dayKey()));
    return v ? parseInt(v, 10) : 0;
  }

  resetAt(): Date {
    return this.nextMidnightUtc();
  }
}
