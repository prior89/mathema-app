import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import { MailService } from './mail.service';

jest.mock('nodemailer');

function makeConfig(map: Record<string, string | undefined>): ConfigService {
  return {
    get: jest.fn((k: string) => map[k]),
  } as unknown as ConfigService;
}

describe('MailService', () => {
  const sendMail = jest.fn().mockResolvedValue({ messageId: 'm1' });
  const createTransportSpy = nodemailer.createTransport as unknown as jest.Mock;

  beforeEach(() => {
    sendMail.mockClear();
    createTransportSpy.mockReset();
    createTransportSpy.mockReturnValue({ sendMail });
  });

  function build(env: Record<string, string | undefined> = {}) {
    const defaults = {
      SMTP_HOST: 'smtp.test',
      SMTP_PORT: '587',
      SMTP_USER: 'user',
      SMTP_PASS: 'pass',
      MAIL_FROM: 'noreply@matheo.verastudy.net',
      'app.webOrigin': 'https://app.matheo.verastudy.net',
      'app.env': 'production',
    };
    return new MailService(makeConfig({ ...defaults, ...env }));
  }

  describe('sendEmailVerification', () => {
    it('requires STARTTLS with TLS 1.2+ on submission ports', async () => {
      const svc = build({ SMTP_PORT: '587', SMTP_SECURE: 'false' });
      await svc.sendEmailVerification('user@gmail.com', 'tok-tls');

      expect(createTransportSpy).toHaveBeenCalledWith(expect.objectContaining({
        port: 587,
        secure: false,
        requireTLS: true,
        tls: { minVersion: 'TLSv1.2' },
      }));
    });

    it('uses direct TLS on port 465', async () => {
      const svc = build({ SMTP_PORT: '465', SMTP_SECURE: 'true' });
      await svc.sendEmailVerification('user@gmail.com', 'tok-tls-465');

      expect(createTransportSpy).toHaveBeenCalledWith(expect.objectContaining({
        port: 465,
        secure: true,
        requireTLS: false,
        tls: { minVersion: 'TLSv1.2' },
      }));
    });

    it('builds branded HTML, friendly subject, and Matheo display name', async () => {
      const svc = build();
      await svc.sendEmailVerification('user@gmail.com', 'tok-abc');

      expect(sendMail).toHaveBeenCalledTimes(1);
      const call = sendMail.mock.calls[0][0];
      expect(call.to).toBe('user@gmail.com');
      expect(call.from).toBe('"Matheo" <noreply@matheo.verastudy.net>');
      expect(call.subject).toBe('Confirm your email to finish setting up Matheo');
      expect(call.text).toContain('Welcome to Matheo!');
      expect(call.text).toContain('https://app.matheo.verastudy.net/verify-email?token=tok-abc');
      expect(call.html).toContain('<title>Matheo</title>');
      expect(call.html).toContain('Welcome to Matheo!');
      expect(call.html).toContain('Confirm my email');
      expect(call.html).toContain('verify-email?token=tok-abc');
      expect(call.headers['X-Entity-Ref-ID']).toMatch(/^verify-email-\d+$/);
    });

    it('honors a pre-formatted MAIL_FROM with display name', async () => {
      const svc = build({ MAIL_FROM: '"Matheo Support" <support@matheo.verastudy.net>' });
      await svc.sendEmailVerification('user@gmail.com', 'tok-1');
      expect(sendMail.mock.calls[0][0].from).toBe('"Matheo Support" <support@matheo.verastudy.net>');
    });

    it('encodes token in the verification URL', async () => {
      const svc = build();
      await svc.sendEmailVerification('user@gmail.com', 'token with spaces+special&chars');
      const call = sendMail.mock.calls[0][0];
      expect(call.text).toContain('token%20with%20spaces%2Bspecial%26chars');
      expect(call.html).toContain('token%20with%20spaces%2Bspecial%26chars');
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('uses reset-password URL and 30 min expiry copy', async () => {
      const svc = build();
      await svc.sendPasswordResetEmail('user@gmail.com', 'reset-token-1');

      const call = sendMail.mock.calls[0][0];
      expect(call.subject).toBe('Reset your Matheo password');
      expect(call.text).toContain('Reset your Matheo password');
      expect(call.text).toContain('https://app.matheo.verastudy.net/reset-password?token=reset-token-1');
      expect(call.text).toContain('30 minutes');
      expect(call.html).toContain('Reset your password');
      expect(call.html).toContain('reset-password?token=reset-token-1');
      expect(call.headers['X-Entity-Ref-ID']).toMatch(/^password-reset-\d+$/);
    });
  });

  describe('sendNewDeviceLoginAlert', () => {
    it('includes IP, user agent, timestamp, and forgot-password link', async () => {
      const svc = build();
      const when = new Date('2026-06-05T10:00:00Z');
      await svc.sendNewDeviceLoginAlert('user@gmail.com', {
        ip: '203.0.113.42',
        ua: 'Mozilla/5.0 (Linux; Android 14)',
        at: when,
      });

      const call = sendMail.mock.calls[0][0];
      expect(call.subject).toBe('Security notice: new sign-in to your Matheo account');
      expect(call.text).toContain('203.0.113.42');
      expect(call.text).toContain('Mozilla/5.0 (Linux; Android 14)');
      expect(call.text).toContain('2026-06-05T10:00:00.000Z');
      expect(call.text).toContain('https://app.matheo.verastudy.net/forgot-password');
      expect(call.html).toContain('203.0.113.42');
      expect(call.html).toContain('Mozilla/5.0 (Linux; Android 14)');
      expect(call.html).toContain('forgot-password');
    });

    it('falls back to "unknown" when ip/ua are missing', async () => {
      const svc = build();
      await svc.sendNewDeviceLoginAlert('user@gmail.com', {});
      const call = sendMail.mock.calls[0][0];
      expect(call.text).toContain('unknown');
      expect(call.html).toContain('unknown');
    });
  });

  describe('SMTP not configured', () => {
    it('throws ServiceUnavailable in production when SMTP_HOST is absent', async () => {
      const svc = build({ SMTP_HOST: undefined });
      await expect(
        svc.sendEmailVerification('user@gmail.com', 'tok'),
      ).rejects.toMatchObject({
        response: expect.objectContaining({ code: 'mail_not_configured' }),
      });
    });

    it('logs and returns silently in non-production when SMTP_HOST is absent', async () => {
      const svc = build({ SMTP_HOST: undefined, 'app.env': 'development', NODE_ENV: 'development' });
      await expect(svc.sendEmailVerification('user@gmail.com', 'tok')).resolves.toBeUndefined();
      expect(sendMail).not.toHaveBeenCalled();
    });
  });
});
