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

  // Always emit a display name. Without one Gmail/Outlook show the bare local
  // part ("DoNotReply") which trips spam heuristics.
  private mailFrom(): string {
    const raw = (this.config.get<string>('MAIL_FROM') ?? 'noreply@matheo.ai').trim();
    if (raw.includes('<') || raw.startsWith('"')) return raw;
    return `"Matheo" <${raw}>`;
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
      requireTLS: !secure,
      tls: { minVersion: 'TLSv1.2' },
      auth: user && pass ? { user, pass } : undefined,
    });
    return this.transporter;
  }

  private async deliver(kind: string, to: string, subject: string, text: string, html: string): Promise<void> {
    const transporter = this.smtpTransporter();
    if (!transporter) {
      // Guard BEFORE logging: the stub WARN below echoes the recipient and the
      // full message body (reset / verify / guardian-consent tokens). In prod a
      // misconfigured SMTP must fail closed without writing that PII + live
      // tokens to App Insights.
      if (this.isProduction()) {
        throw new ServiceUnavailableException({
          code: 'mail_not_configured',
          message: 'Email delivery is not configured. Please contact support.',
        });
      }
      this.logger.warn(`[MAIL stub] ${kind} -> ${to}`);
      this.logger.warn(`           ${text.replace(/\s+/g, ' ').trim()}`);
      return;
    }

    await transporter.sendMail({
      from: this.mailFrom(),
      to,
      subject,
      text,
      html,
      headers: {
        'X-Entity-Ref-ID': `${kind}-${Date.now()}`,
      },
    });
  }

  // Branded HTML shell. Inline styles only (Gmail/Outlook strip <style>).
  private htmlLayout(opts: { preheader: string; bodyHtml: string }): string {
    const origin = this.appUrl();
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Matheo</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1f2937;">
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#f5f5f7;opacity:0;">${opts.preheader}</div>
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f5f5f7;">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:560px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,0.04);">
        <tr>
          <td align="center" style="padding:32px 32px 20px 32px;border-bottom:1px solid #eef0f3;">
            <div style="font-size:26px;font-weight:700;color:#111827;letter-spacing:-0.5px;line-height:1;">Matheo</div>
            <div style="font-size:12px;color:#6b7280;margin-top:6px;letter-spacing:0.3px;">KOREAN MATH LEARNING</div>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">${opts.bodyHtml}</td>
        </tr>
        <tr>
          <td style="padding:20px 32px;background-color:#fafbfc;border-top:1px solid #eef0f3;font-size:12px;color:#6b7280;line-height:1.6;text-align:center;">
            <div>Matheo helps Korean middle- and high-school students master math with adaptive practice, mock exams, and a personal wrong-note review system.</div>
            <div style="margin-top:12px;">&copy; 2026 Matheo &middot; <a href="${origin}" style="color:#4f46e5;text-decoration:none;">${origin.replace(/^https?:\/\//, '')}</a></div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
  }

  private ctaButton(href: string, label: string): string {
    return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:28px auto;">
  <tr>
    <td align="center" style="border-radius:8px;background-color:#4f46e5;">
      <a href="${href}" style="display:inline-block;padding:14px 36px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;letter-spacing:0.2px;">${label}</a>
    </td>
  </tr>
</table>`;
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const link = `${this.appUrl()}/reset-password?token=${encodeURIComponent(token)}`;
    const bodyHtml = `
<h1 style="font-size:20px;font-weight:700;color:#111827;margin:0 0 16px 0;line-height:1.35;">Reset your password</h1>
<p style="font-size:15px;line-height:1.6;color:#374151;margin:0 0 16px 0;">We received a request to reset the password for your Matheo account. Click the button below to choose a new one.</p>
${this.ctaButton(link, 'Reset password')}
<p style="font-size:13px;line-height:1.6;color:#6b7280;margin:24px 0 0 0;">Or copy and paste this link into your browser:</p>
<p style="font-size:13px;line-height:1.5;word-break:break-all;margin:6px 0 0 0;"><a href="${link}" style="color:#4f46e5;text-decoration:underline;">${link}</a></p>
<p style="font-size:13px;line-height:1.6;color:#9ca3af;margin:24px 0 0 0;">This link expires in 30 minutes. If you did not request a password reset, you can safely ignore this email &mdash; your password will not change.</p>`;
    const text = [
      'Reset your Matheo password',
      '',
      'We received a request to reset the password for your Matheo account.',
      'Open the link below to choose a new password:',
      '',
      link,
      '',
      'This link expires in 30 minutes.',
      'If you did not request a password reset, you can safely ignore this email.',
      '',
      '--',
      'Matheo --- Adaptive Korean mathematics learning',
      this.appUrl(),
    ].join('\n');
    await this.deliver(
      'password-reset',
      to,
      'Reset your Matheo password',
      text,
      this.htmlLayout({
        preheader: 'Use the link inside to set a new password for your Matheo account.',
        bodyHtml,
      }),
    );
  }

  async sendEmailVerification(to: string, token: string): Promise<void> {
    const link = `${this.appUrl()}/verify-email?token=${encodeURIComponent(token)}`;
    const bodyHtml = `
<h1 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 16px 0;line-height:1.35;">Welcome to Matheo!</h1>
<p style="font-size:15px;line-height:1.6;color:#374151;margin:0 0 16px 0;">Thanks for creating your Matheo account. We are an adaptive math learning service for Korean middle- and high-school students, with diagnostic practice, mock exams, and a wrong-note review system built around spaced repetition.</p>
<p style="font-size:15px;line-height:1.6;color:#374151;margin:0 0 16px 0;">To finish setting up your account and unlock your personalised learning path, please confirm that this email address belongs to you.</p>
${this.ctaButton(link, 'Confirm my email')}
<p style="font-size:13px;line-height:1.6;color:#6b7280;margin:24px 0 0 0;">If the button does not work, copy and paste this link into your browser:</p>
<p style="font-size:13px;line-height:1.5;word-break:break-all;margin:6px 0 0 0;"><a href="${link}" style="color:#4f46e5;text-decoration:underline;">${link}</a></p>
<p style="font-size:13px;line-height:1.6;color:#9ca3af;margin:24px 0 0 0;">This confirmation link expires in 24 hours. If you did not create a Matheo account, you can safely ignore this email and no account will be created.</p>`;
    const text = [
      'Welcome to Matheo!',
      '',
      'Thanks for creating your Matheo account. Matheo is an adaptive math learning service',
      'for Korean middle- and high-school students, with diagnostic practice, mock exams,',
      'and a wrong-note review system built around spaced repetition.',
      '',
      'To finish setting up your account, please confirm your email address by opening the',
      'link below:',
      '',
      link,
      '',
      'This confirmation link expires in 24 hours.',
      'If you did not create a Matheo account, you can safely ignore this email.',
      '',
      '--',
      'Matheo --- Adaptive Korean mathematics learning',
      this.appUrl(),
    ].join('\n');
    await this.deliver(
      'verify-email',
      to,
      'Confirm your email to finish setting up Matheo',
      text,
      this.htmlLayout({
        preheader: 'Confirm your email to start your personalised Korean math learning path.',
        bodyHtml,
      }),
    );
  }

  /**
   * DEV-4 -- informational, non-blocking notice that a new device just logged
   * into the account. Anti-theft signal: if it was not the user, they can
   * change their password from the reset link.
   */
  async sendGuardianConsent(
    to: string,
    token: string,
    opts: { parentName: string; childName: string; country: string },
  ): Promise<void> {
    const verifyLink = `${this.appUrl()}/guardian-consent/verify?token=${encodeURIComponent(token)}`;
    const regionNote = opts.country === 'KR'
      ? 'Matheo requires parent/guardian approval for students under 14 in Korea.'
      : 'Matheo requires parent/guardian approval for this student based on their age and region.';
    const bodyHtml = `
<h1 style="font-size:20px;font-weight:700;color:#111827;margin:0 0 16px 0;line-height:1.35;">Parent/guardian consent required</h1>
<p style="font-size:15px;line-height:1.6;color:#374151;margin:0 0 16px 0;">Hello <strong>${opts.parentName}</strong>,</p>
<p style="font-size:15px;line-height:1.6;color:#374151;margin:0 0 16px 0;"><strong>${opts.childName}</strong> started setting up a Matheo student account. ${regionNote}</p>
<p style="font-size:15px;line-height:1.6;color:#374151;margin:0 0 16px 0;">By confirming below, you verify that you are the parent or legal guardian and consent to Matheo processing your child's learning data as described in our Privacy Policy.</p>
<p style="font-size:15px;line-height:1.6;color:#374151;margin:0 0 16px 0;">After approval, the student will continue automatically. This does not create a parent account or sign you into the student app.</p>
${this.ctaButton(verifyLink, 'Confirm as parent/guardian')}
<p style="font-size:13px;line-height:1.6;color:#6b7280;margin:24px 0 0 0;">Or copy and paste this link into your browser:</p>
<p style="font-size:13px;line-height:1.5;word-break:break-all;margin:6px 0 0 0;"><a href="${verifyLink}" style="color:#4f46e5;text-decoration:underline;">${verifyLink}</a></p>
<p style="font-size:13px;line-height:1.6;color:#9ca3af;margin:24px 0 0 0;">This link expires in 7 days. If you did not expect this email, you can ignore it — the account will remain restricted until consent is given.</p>`;
    const text = [
      'Parent/guardian consent — Matheo',
      '',
      `Hello ${opts.parentName},`,
      '',
      `${opts.childName} started setting up a Matheo student account.`,
      regionNote,
      '',
      'After approval, the student will continue automatically.',
      'This does not create a parent account or sign you into the student app.',
      '',
      'Confirm as parent/guardian:',
      verifyLink,
      '',
      'Expires in 7 days.',
      '',
      '--',
      'Matheo',
      this.appUrl(),
    ].join('\n');
    await this.deliver(
      'guardian-consent',
      to,
      `Confirm parent consent for ${opts.childName}'s Matheo account`,
      text,
      this.htmlLayout({
        preheader: `${opts.childName} needs your consent to use Matheo.`,
        bodyHtml,
      }),
    );
  }

  async sendParentLinkApproval(
    to: string,
    token: string,
    opts: { parentName: string; childName: string },
  ): Promise<void> {
    const approveLink = `${this.appUrl()}/parent-link/approve?token=${encodeURIComponent(token)}`;
    const rejectLink = `${this.appUrl()}/parent-link/reject?token=${encodeURIComponent(token)}`;
    const bodyHtml = `
<h1 style="font-size:20px;font-weight:700;color:#111827;margin:0 0 16px 0;line-height:1.35;">Parent access request</h1>
<p style="font-size:15px;line-height:1.6;color:#374151;margin:0 0 16px 0;"><strong>${opts.parentName}</strong> wants to view your Matheo learning progress as a parent/guardian.</p>
<p style="font-size:15px;line-height:1.6;color:#374151;margin:0 0 16px 0;">If you recognise this person, approve the request. If not, reject it — they will not see your study data.</p>
${this.ctaButton(approveLink, 'Approve parent access')}
<p style="text-align:center;margin:12px 0 0 0;"><a href="${rejectLink}" style="color:#6b7280;font-size:13px;text-decoration:underline;">Reject this request</a></p>
<p style="font-size:13px;line-height:1.6;color:#9ca3af;margin:24px 0 0 0;">This link expires in 7 days. You can also approve from the Matheo app after signing in.</p>`;
    const text = [
      'Parent access request — Matheo',
      '',
      `${opts.parentName} wants to view your learning progress.`,
      'Approve:',
      approveLink,
      '',
      'Reject:',
      rejectLink,
      '',
      'Expires in 7 days.',
      '',
      '--',
      'Matheo',
      this.appUrl(),
    ].join('\n');
    await this.deliver(
      'parent-link-approval',
      to,
      'Approve parent access to your Matheo account',
      text,
      this.htmlLayout({
        preheader: `${opts.parentName} requested parent access to your Matheo account.`,
        bodyHtml,
      }),
    );
  }

  /** Student-initiated parent invite — the K-factor loop. The parent registers
   *  via the prefilled link; registration then fires the normal link-request →
   *  student-approval rail, so no new approval surface is needed. */
  async sendParentInvite(
    to: string,
    opts: { childName: string; childEmail: string },
  ): Promise<void> {
    const registerLink = `${this.appUrl()}/register?role=parent&childEmail=${encodeURIComponent(opts.childEmail)}`;
    const bodyHtml = `
<h1 style="font-size:20px;font-weight:700;color:#111827;margin:0 0 16px 0;line-height:1.35;">${opts.childName} invited you to Matheo</h1>
<p style="font-size:15px;line-height:1.6;color:#374151;margin:0 0 16px 0;"><strong>${opts.childName}</strong> wants to share their math progress with you — which chapters they've mastered, where they keep slipping, and how their accuracy is moving week to week.</p>
<p style="font-size:15px;line-height:1.6;color:#374151;margin:0 0 16px 0;">Create a free parent account to see their learning report. ${opts.childName} approves the connection, so nothing is shared without their consent.</p>
${this.ctaButton(registerLink, 'Create a parent account')}
<p style="font-size:13px;line-height:1.6;color:#9ca3af;margin:24px 0 0 0;">If you don't know this student, you can ignore this email — no account is created and nothing is shared.</p>`;
    const text = [
      `${opts.childName} invited you to Matheo`,
      '',
      `${opts.childName} wants to share their math learning report with you.`,
      'Create a free parent account:',
      registerLink,
      '',
      `${opts.childName} approves the connection, so nothing is shared without their consent.`,
      "If you don't know this student, ignore this email.",
      '',
      '--',
      'Matheo',
      this.appUrl(),
    ].join('\n');
    await this.deliver(
      'parent-invite',
      to,
      `${opts.childName} wants to share their Matheo progress with you`,
      text,
      this.htmlLayout({
        preheader: `${opts.childName} invited you to follow their math progress on Matheo.`,
        bodyHtml,
      }),
    );
  }

  async sendNewDeviceLoginAlert(to: string, opts: { ip?: string | null; ua?: string | null; at?: Date }): Promise<void> {
    const when = (opts.at ?? new Date()).toISOString();
    const resetLink = `${this.appUrl()}/forgot-password`;
    const ip = opts.ip ?? 'unknown';
    const ua = opts.ua ?? 'unknown';
    const bodyHtml = `
<h1 style="font-size:20px;font-weight:700;color:#111827;margin:0 0 16px 0;line-height:1.35;">New sign-in to your Matheo account</h1>
<p style="font-size:15px;line-height:1.6;color:#374151;margin:0 0 16px 0;">We noticed a sign-in to your Matheo account from a device or location we have not seen before. If this was you, no action is needed.</p>
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:20px 0;border:1px solid #eef0f3;border-radius:8px;background-color:#fafbfc;">
  <tr><td style="padding:14px 18px;font-size:13px;color:#6b7280;border-bottom:1px solid #eef0f3;">Time</td><td style="padding:14px 18px;font-size:13px;color:#111827;border-bottom:1px solid #eef0f3;">${when}</td></tr>
  <tr><td style="padding:14px 18px;font-size:13px;color:#6b7280;border-bottom:1px solid #eef0f3;">IP address</td><td style="padding:14px 18px;font-size:13px;color:#111827;border-bottom:1px solid #eef0f3;">${ip}</td></tr>
  <tr><td style="padding:14px 18px;font-size:13px;color:#6b7280;vertical-align:top;">Device</td><td style="padding:14px 18px;font-size:13px;color:#111827;word-break:break-word;">${ua}</td></tr>
</table>
<p style="font-size:15px;line-height:1.6;color:#374151;margin:16px 0 0 0;">If this was <strong>not</strong> you, please reset your password right away to protect your account:</p>
${this.ctaButton(resetLink, 'Reset password')}
<p style="font-size:13px;line-height:1.6;color:#9ca3af;margin:24px 0 0 0;">You are receiving this email because security alerts are always on for your Matheo account.</p>`;
    const text = [
      'New sign-in to your Matheo account',
      '',
      'We noticed a sign-in from a device or location we have not seen before.',
      `Time:       ${when}`,
      `IP address: ${ip}`,
      `Device:     ${ua}`,
      '',
      'If this was you, no action is needed.',
      'If this was NOT you, reset your password immediately:',
      '',
      resetLink,
      '',
      '--',
      'Matheo --- Adaptive Korean mathematics learning',
      this.appUrl(),
    ].join('\n');
    await this.deliver(
      'new-device-login',
      to,
      'Security notice: new sign-in to your Matheo account',
      text,
      this.htmlLayout({
        preheader: `Sign-in detected at ${when} from ${ip}.`,
        bodyHtml,
      }),
    );
  }
}
