/**
 * MFA-1 -- TOTP enrollment / verification service.
 *
 * v1.0 scope (this commit): backend only. No login flow change yet -- a user
 * who enrolls in v1.0 gets a secret stored on their record but login still
 * succeeds without an OTP. v1.1 flips AuthService.login to gate when
 * totpEnabledAt is set + ships the UI.
 *
 * Two-stage enrollment so a misconfigured authenticator app cannot lock the
 * user out:
 *   1. POST /auth/mfa/setup   -> generate secret, save in totpSecret,
 *                                return otpauth URL + base64 QR PNG. NOT
 *                                enabled yet.
 *   2. POST /auth/mfa/verify  -> user types the first 6-digit code, server
 *                                checks against totpSecret. On hit stamp
 *                                totpEnabledAt; on miss return error so the
 *                                user re-enrolls.
 * Disable (POST /auth/mfa/disable) requires the user's current password +
 * a valid OTP to clear the secret -- prevents a stolen access token from
 * silently disabling 2FA.
 */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { generateSecret, generateURI, verifySync } from 'otplib';
import * as QRCode from 'qrcode';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { SecurityEventService } from './security-event.service';

const TOTP_ISSUER = 'Matheo';

// Standard authenticator-app friendly TOTP options: 30-second steps + 1-step
// drift window (+/-30s = 90s effective). Re-applied per verify call because
// otplib v13's functional API takes options inline.
const TOTP_OPTIONS = { algorithm: 'sha1' as const, digits: 6, period: 30, window: 1 };

@Injectable()
export class MfaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: SecurityEventService,
  ) {}

  private verify(token: string, secret: string): boolean {
    const r = verifySync({ token, secret, ...TOTP_OPTIONS });
    return r?.valid === true;
  }

  /**
   * Stage 1 -- generate + persist a fresh secret. Calling again before
   * /auth/mfa/verify overwrites (user re-scanning QR). Calling AFTER enabled
   * is rejected; user must /auth/mfa/disable first.
   */
  async startSetup(userId: string): Promise<{ otpauth: string; qrDataUrl: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }, select: { email: true, totpEnabledAt: true },
    });
    if (!user) throw new NotFoundException('user not found');
    if (user.totpEnabledAt) {
      throw new BadRequestException('MFA already enabled; disable first to re-enroll');
    }
    const secret = generateSecret();
    const otpauth = generateURI({ secret, label: user.email, issuer: TOTP_ISSUER, ...TOTP_OPTIONS });
    const qrDataUrl = await QRCode.toDataURL(otpauth);
    await this.prisma.user.update({
      where: { id: userId },
      data: { totpSecret: secret, totpEnabledAt: null },
    });
    return { otpauth, qrDataUrl };
  }

  /** Stage 2 -- confirm the QR was scanned correctly + flip the enabled flag. */
  async confirmSetup(userId: string, token: string): Promise<{ ok: boolean }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }, select: { email: true, totpSecret: true, totpEnabledAt: true },
    });
    if (!user) throw new NotFoundException('user not found');
    if (user.totpEnabledAt) throw new BadRequestException('MFA already enabled');
    if (!user.totpSecret) throw new BadRequestException('MFA setup not started');
    if (!this.verify(token, user.totpSecret)) {
      throw new BadRequestException('invalid OTP -- re-scan the QR and try again');
    }
    await this.prisma.user.update({
      where: { id: userId }, data: { totpEnabledAt: new Date() },
    });
    this.events.record('PASSWORD_CHANGE' as any, {
      userId, metadata: { kind: 'mfa_enrolled' },
    });
    return { ok: true };
  }

  /**
   * Disable -- requires current password + valid OTP to clear secret. Both
   * checks are needed: password alone wouldn't help against a stolen access
   * token (attacker doesn't have the password), and OTP alone wouldn't help
   * if the authenticator app was lost.
   */
  async disable(userId: string, password: string, token: string): Promise<{ ok: boolean }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true, totpSecret: true, totpEnabledAt: true },
    });
    if (!user) throw new NotFoundException('user not found');
    if (!user.totpEnabledAt || !user.totpSecret) {
      throw new BadRequestException('MFA not enabled');
    }
    if (!(await bcrypt.compare(password, user.passwordHash))) {
      throw new BadRequestException('current password mismatch');
    }
    if (!this.verify(token, user.totpSecret)) {
      throw new BadRequestException('invalid OTP');
    }
    await this.prisma.user.update({
      where: { id: userId }, data: { totpSecret: null, totpEnabledAt: null },
    });
    this.events.record('PASSWORD_CHANGE' as any, {
      userId, metadata: { kind: 'mfa_disabled' },
    });
    return { ok: true };
  }

  /**
   * Used by AuthService.login (v1.1 wiring). Returns true if OTP is currently
   * valid for the user. Exported so AuthService can stay free of otplib.
   */
  async verifyOtp(userId: string, token: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }, select: { totpSecret: true, totpEnabledAt: true },
    });
    if (!user?.totpEnabledAt || !user.totpSecret) return false;
    return this.verify(token, user.totpSecret);
  }
}
