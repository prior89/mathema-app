import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { type Transporter } from 'nodemailer';

/**
 * Mail dispatch.
 *
 * Production must configure SMTP_* env vars. When SMTP_HOST is absent we keep
 * the old log-only stub in non-production so local development can still copy
 * verification/reset links from logs.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter | null = null;

  constructor(private readonly config: ConfigService) {}

  private appUrl(): string {
    return this.config.get<string>('app.webOrigin') ?? 'http://localhost:5173';
  }

  private isProduction(): boolean {
    return this.config.get<string>('app.env') === 'production'
      || this.config.get<string>('NODE_ENV') === 'production';
  }

  private mailFrom(): string {
    return this.config.get<string>('MAIL_FROM') ?? 'noreply@matheo.ai';
  }

  private smtpTransporter(): Transporter | null {
    const host = this.config.get<string>('SMTP_HOST');
    if (!host) return null;
    if (this.transporter) return this.transporter;

    const port = Number(this.config.get<string>('SMTP_PORT') ?? '587');
    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASS');
    const secure = (this.config.get<string>('SMTP_SECURE') ?? '').toLowerCase() === 'true'
      || port === 465;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user && pass ? { user, pass } : undefined,
    });
    return this.transporter;
  }

  private async deliver(kind: string, to: string, subject: string, text: string, html: string): Promise<void> {
    const transporter = this.smtpTransporter();
    if (!transporter) {
      this.logger.warn(`[MAIL stub] ${kind} -> ${to}`);
      this.logger.warn(`           ${text.replace(/\s+/g, ' ').trim()}`);
      if (this.isProduction()) {
        throw new ServiceUnavailableException({
          code: 'mail_not_configured',
          message: 'Email delivery is not configured. Please contact support.',
        });
      }
      return;
    }

    await transporter.sendMail({
      from: this.mailFrom(),
      to,
      subject,
      text,
      html,
    });
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const link = `${this.appUrl()}/reset-password?token=${encodeURIComponent(token)}`;
    await this.deliver(
      'password-reset',
      to,
      'Reset your Matheo password',
      `Reset your Matheo password: ${link}`,
      `<p>Reset your Matheo password:</p><p><a href="${link}">${link}</a></p>`,
    );
  }

  async sendEmailVerification(to: string, token: string): Promise<void> {
    const link = `${this.appUrl()}/verify-email?token=${encodeURIComponent(token)}`;
    await this.deliver(
      'verify-email',
      to,
      'Verify your Matheo email',
      `Verify your Matheo email: ${link}`,
      `<p>Verify your Matheo email:</p><p><a href="${link}">${link}</a></p>`,
    );
  }

  /**
   * DEV-4 -- informational, non-blocking notice that a new device just logged
   * into the account. Anti-theft signal: if it was not the user, they can
   * change their password from the reset link.
   */
  async sendNewDeviceLoginAlert(to: string, opts: { ip?: string | null; ua?: string | null; at?: Date }): Promise<void> {
    const when = (opts.at ?? new Date()).toISOString();
    const resetLink = `${this.appUrl()}/forgot-password`;
    await this.deliver(
      'new-device-login',
      to,
      'New Matheo login',
      `New Matheo login at ${when}. IP: ${opts.ip ?? 'unknown'}. User agent: ${opts.ua ?? 'unknown'}. If this was not you, reset your password: ${resetLink}`,
      `<p>New Matheo login at ${when}.</p><p>IP: ${opts.ip ?? 'unknown'}</p><p>User agent: ${opts.ua ?? 'unknown'}</p><p>If this was not you, reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
    );
  }
}
