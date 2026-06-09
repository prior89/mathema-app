import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RedisService } from '../../infrastructure/redis/redis.service';
import { FREE_TIER_SOLVER_LIMIT } from './billing.constants';
import {
  computeSolverGraceState,
  SolverGraceState,
} from './solver-quota-grace.util';

/** Daily call quota tracking — backs the Free-tier AI Solver cap (16/day
 * during the first 7 days after signup, then 8/day). Keyed by (userId, UTC
 * date). Auto-expires after 25h so the previous day rolls off without manual
 * cleanup. */
@Injectable()
export class QuotaService {
  constructor(
    private readonly redis: RedisService,
    private readonly prisma: PrismaService,
  ) {}

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

  async getSolverGraceState(userId: string): Promise<SolverGraceState> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { createdAt: true },
    });
    if (!user) {
      return {
        inGrace: false,
        graceEndsAt: new Date(0),
        limit: FREE_TIER_SOLVER_LIMIT,
      };
    }
    return computeSolverGraceState(user.createdAt);
  }

  async getSolverDailyLimit(userId: string): Promise<number> {
    const state = await this.getSolverGraceState(userId);
    return state.limit;
  }

  resetAt(): Date {
    return this.nextMidnightUtc();
  }
}