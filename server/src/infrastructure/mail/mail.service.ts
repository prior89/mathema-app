import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Mail dispatch — 현재는 SMTP/SendGrid 미연결 stub.
 * SMTP_HOST 등 설정되면 nodemailer 활성화 (추후).
 * 미설정 환경: 로그로 토큰/링크 출력 → 개발 + 어드민 수동 운영 가능.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly config: ConfigService) {}

  private appUrl(): string {
    return this.config.get<string>('app.webOrigin') ?? 'http://localhost:5173';
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const link = `${this.appUrl()}/reset-password?token=${encodeURIComponent(token)}`;
    this.logger.warn(`[MAIL stub] password-reset → ${to}`);
    this.logger.warn(`           link: ${link}`);
    // 추후 SMTP 연결 시:
    // await this.transporter.sendMail({ to, subject, html })
  }

  async sendEmailVerification(to: string, token: string): Promise<void> {
    const link = `${this.appUrl()}/verify-email?token=${encodeURIComponent(token)}`;
    this.logger.warn(`[MAIL stub] verify-email → ${to}`);
    this.logger.warn(`           link: ${link}`);
  }

  /**
   * DEV-4 -- informational, non-blocking notice that a new device just logged
   * into the account. Anti-theft signal: if it wasn't the user, they can
   * change their password from the reset link.
   */
  async sendNewDeviceLoginAlert(to: string, opts: { ip?: string | null; ua?: string | null; at?: Date }): Promise<void> {
    const when = (opts.at ?? new Date()).toISOString();
    const resetLink = `${this.appUrl()}/forgot-password`;
    this.logger.warn(`[MAIL stub] new-device-login → ${to}`);
    this.logger.warn(`           at: ${when}  ip: ${opts.ip ?? 'unknown'}  ua: ${opts.ua ?? 'unknown'}`);
    this.logger.warn(`           reset-if-not-you: ${resetLink}`);
  }
}
