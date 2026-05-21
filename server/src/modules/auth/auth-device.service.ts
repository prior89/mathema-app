/**
 * DEV-1/3/5 -- AuthDeviceService.
 *
 * Concurrent 1-account-1-device enforcement. On every successful auth we:
 *   1. upsertOnLogin(userId, deviceHash, ...) -- record the new login
 *   2. revokeOtherDevices(userId, deviceHash) -- returns the previously bound
 *      deviceHashes whose refresh-jti must be blacklisted in Redis
 *
 * The Redis blacklisting itself lives in AuthService (it owns the jti
 * minting), but this service answers "which sessions were displaced?".
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class AuthDeviceService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Upsert the (userId, deviceHash) row, refreshing lastSeenAt / lastIp.
   * Returns { isNewDevice, device } so the caller can record NEW_DEVICE_LOGIN.
   */
  async upsertOnLogin(args: {
    userId: string;
    deviceHash: string;
    deviceName?: string | null;
    ip?: string | null;
  }) {
    const existing = await this.prisma.authDevice.findUnique({
      where: { userId_deviceHash: { userId: args.userId, deviceHash: args.deviceHash } },
    });
    const device = await this.prisma.authDevice.upsert({
      where: { userId_deviceHash: { userId: args.userId, deviceHash: args.deviceHash } },
      update: { lastSeenAt: new Date(), lastIp: args.ip ?? undefined },
      create: {
        userId: args.userId,
        deviceHash: args.deviceHash,
        deviceName: args.deviceName ?? null,
        lastIp: args.ip ?? null,
      },
    });
    return { isNewDevice: !existing, device };
  }

  /**
   * Delete every AuthDevice row for this user except the one matching
   * keepDeviceHash. Returns the deleted rows so the caller can blacklist
   * their refresh jtis (jti is not stored on AuthDevice -- caller must walk
   * Redis on its own; this service only knows which deviceHashes are gone).
   */
  async revokeOtherDevices(userId: string, keepDeviceHash: string) {
    const others = await this.prisma.authDevice.findMany({
      where: { userId, NOT: { deviceHash: keepDeviceHash } },
      select: { id: true, deviceHash: true, deviceName: true },
    });
    if (others.length > 0) {
      await this.prisma.authDevice.deleteMany({
        where: { userId, NOT: { deviceHash: keepDeviceHash } },
      });
    }
    return others;
  }

  /** Settings UI -- list the user's currently bound devices. */
  async listForUser(userId: string) {
    return this.prisma.authDevice.findMany({
      where: { userId },
      orderBy: { lastSeenAt: 'desc' },
      select: { id: true, deviceHash: true, deviceName: true, lastIp: true, lastSeenAt: true, createdAt: true },
    });
  }

  /** Is this device currently bound to the user? Used by /auth/refresh. */
  async isBound(userId: string, deviceHash: string): Promise<boolean> {
    const row = await this.prisma.authDevice.findUnique({
      where: { userId_deviceHash: { userId, deviceHash } },
      select: { id: true },
    });
    return !!row;
  }
}
