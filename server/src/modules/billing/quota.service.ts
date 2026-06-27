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
  private ocrRedisKey(userId: string, day: string): string {
    return `quota:ocr:${userId}:${day}`;
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

  /** Separate, looser daily counter for the OCR-only endpoint. Same INCR+TTL
   * pattern as the solver counter but a distinct key namespace so OCR never
   * consumes a solve credit. */
  async incrementOcr(userId: string): Promise<number> {
    const key = this.ocrRedisKey(userId, this.dayKey());
    return this.redis.incrWithTtl(key, 60 * 60 * 25);
  }

  async getOcrUsed(userId: string): Promise<number> {
    const v = await this.redis.get(this.ocrRedisKey(userId, this.dayKey()));
    return v ? parseInt(v, 10) : 0;
  }

  async getSolverGraceState(userId: string): Promise<SolverGraceState> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { createdAt: true, isGuest: true },
    });
    if (!user) {
      return {
        inGrace: false,
        graceEndsAt: new Date(0),
        limit: FREE_TIER_SOLVER_LIMIT,
      };
    }
    // Guests don't get the elevated first-week grace limit: a guest account is
    // resettable by clearing app data, so granting 16/day to guests would let
    // reinstall farming double the free quota. Flat 8/day caps that vector.
    if (user.isGuest) {
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