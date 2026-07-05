import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CountryCode,
  GuardianConsentMethod,
  GuardianConsentStatus,
  UserRole,
} from '@prisma/client';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { MailService } from '../../infrastructure/mail/mail.service';
import { PassProviderService } from './pass-provider.service';
import {
  CURRENT_GUARDIAN_POLICY_VERSION,
  requiresGuardianConsent,
  resolveConsentMethod,
} from './guardian-consent.util';

const TOKEN_TTL_DAYS = 7;
/** PASS auth sessions are short-lived — the parent authenticates in one sitting. */
const PASS_TX_TTL_MIN = 15;

@Injectable()
export class GuardianConsentService {
  private readonly logger = new Logger(GuardianConsentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
    private readonly pass: PassProviderService,
  ) {}

  async statusForStudent(studentUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: studentUserId },
      select: {
        role: true,
        birthDate: true,
        country: true,
        guardianConsentVerifiedAt: true,
      },
    });
    if (!user || user.role !== UserRole.STUDENT) {
      return { required: false, verified: true, method: null as GuardianConsentMethod | null };
    }
    const required = requiresGuardianConsent(user.birthDate, user.country);
    const verified = !required || !!user.guardianConsentVerifiedAt;
    const req = required
      ? await this.prisma.guardianConsentRequest.findUnique({
          where: { studentUserId },
          select: {
            status: true,
            method: true,
            parentEmail: true,
            parentName: true,
            verifiedAt: true,
          },
        })
      : null;
    return {
      required,
      verified,
      method: req?.method ?? (required ? resolveConsentMethod(user.country) : null),
      requestStatus: req?.status ?? null,
      parentEmail: req?.parentEmail ?? null,
      verifiedAt: user.guardianConsentVerifiedAt,
    };
  }

  /** Called after student registration when birthDate indicates a minor. */
  async ensurePendingForStudent(opts: {
    studentUserId: string;
    country: CountryCode;
    ip?: string;
    ua?: string;
  }) {
    const user = await this.prisma.user.findUnique({
      where: { id: opts.studentUserId },
      select: { birthDate: true, guardianConsentVerifiedAt: true, role: true, country: true },
    });
    if (!user || user.role !== UserRole.STUDENT || !requiresGuardianConsent(user.birthDate, user.country)) {
      return { required: false };
    }
    if (user.guardianConsentVerifiedAt) {
      return { required: true, verified: true };
    }
    const method = resolveConsentMethod(opts.country) as GuardianConsentMethod;
    await this.prisma.guardianConsentRequest.upsert({
      where: { studentUserId: opts.studentUserId },
      create: {
        studentUserId: opts.studentUserId,
        country: opts.country,
        method,
        status: GuardianConsentStatus.PENDING,
        policyVersion: CURRENT_GUARDIAN_POLICY_VERSION,
        requestIp: opts.ip ?? null,
        requestUa: opts.ua ?? null,
      },
      update: {
        method,
        status: GuardianConsentStatus.PENDING,
        policyVersion: CURRENT_GUARDIAN_POLICY_VERSION,
      },
    });
    return { required: true, verified: false, method };
  }

  async requestParentVerification(
    studentUserId: string,
    dto: { parentName?: string; parentEmail: string; parentPhone?: string },
    ctx: { ip?: string; ua?: string } = {},
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: studentUserId },
      select: {
        email: true,
        name: true,
        role: true,
        birthDate: true,
        guardianConsentVerifiedAt: true,
        country: true,
      },
    });
    if (!user || user.role !== UserRole.STUDENT) {
      throw new BadRequestException('guardian consent applies to student accounts only');
    }
    if (!requiresGuardianConsent(user.birthDate, user.country)) {
      throw new BadRequestException('guardian consent not required for this account');
    }
    if (user.guardianConsentVerifiedAt) {
      return { alreadyVerified: true };
    }

    const parentEmail = dto.parentEmail.trim().toLowerCase();
    if (parentEmail === user.email.trim().toLowerCase()) {
      throw new BadRequestException({
        code: 'parent_email_same_as_student',
        message: 'Please enter a parent or guardian email — not your own student email.',
      });
    }
    const parentName = (dto.parentName?.trim() || 'Parent/guardian');
    const method = resolveConsentMethod(user.country) as GuardianConsentMethod;
    if (method === GuardianConsentMethod.KR_PASS) {
      // KR under-14 consent runs on the carrier identity rail, not email.
      // The client must drive POST /guardian-consent/pass/start instead.
      throw new BadRequestException({
        code: 'use_pass_flow',
        message: 'This account uses mobile identity verification (PASS). Start it via /guardian-consent/pass/start.',
      });
    }

    const request = await this.prisma.guardianConsentRequest.upsert({
      where: { studentUserId },
      create: {
        studentUserId,
        country: user.country,
        method,
        status: GuardianConsentStatus.PENDING,
        parentName,
        parentEmail,
        parentPhone: dto.parentPhone?.trim() ?? null,
        policyVersion: CURRENT_GUARDIAN_POLICY_VERSION,
        requestIp: ctx.ip ?? null,
        requestUa: ctx.ua ?? null,
      },
      update: {
        parentName,
        parentEmail,
        parentPhone: dto.parentPhone?.trim() ?? null,
        status: GuardianConsentStatus.PENDING,
        verifiedAt: null,
        method,
      },
    });

    await this.issueConsentEmail(request.id, {
      parentEmail,
      parentName,
      childName: user.name,
      country: user.country,
    });

    return { sent: true, method };
  }

  async verifyByToken(token: string, ctx: { ip?: string; ua?: string } = {}) {
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const row = await this.prisma.guardianConsentToken.findUnique({
      where: { tokenHash },
      include: { request: { include: { student: { select: { id: true } } } } },
    });
    if (!row || row.usedAt || row.expiresAt < new Date()) {
      throw new BadRequestException('invalid or expired consent link');
    }
    if (row.request.status === GuardianConsentStatus.VERIFIED) {
      return { ok: true, alreadyVerified: true };
    }

    await this.prisma.$transaction([
      this.prisma.guardianConsentToken.update({
        where: { id: row.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.guardianConsentRequest.update({
        where: { id: row.requestId },
        data: {
          status: GuardianConsentStatus.VERIFIED,
          verifiedAt: new Date(),
          verifyIp: ctx.ip ?? null,
          verifyUa: ctx.ua ?? null,
        },
      }),
      this.prisma.user.update({
        where: { id: row.request.studentUserId },
        data: { guardianConsentVerifiedAt: new Date() },
      }),
    ]);

    return { ok: true };
  }

  async previewByToken(token: string) {
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const row = await this.prisma.guardianConsentToken.findFirst({
      where: { tokenHash, usedAt: null, expiresAt: { gt: new Date() } },
      include: {
        request: {
          include: { student: { select: { name: true, country: true } } },
        },
      },
    });
    if (!row) throw new NotFoundException('consent link not found');
    return {
      childName: row.request.student.name,
      parentName: row.request.parentName,
      country: row.request.country,
      method: row.request.method,
      policyVersion: row.request.policyVersion,
    };
  }

  /**
   * KR under-14 rail — start a guardian 휴대폰 본인인증 (PASS) session. Returns
   * a transaction id (raw token) + the provider auth URL the parent opens to
   * authenticate on their own phone. Mirrors the email request/verify pair but
   * the trust comes from the carrier identity check, not an inbox click.
   */
  async startPassVerification(studentUserId: string, ctx: { ip?: string; ua?: string } = {}) {
    if (!this.pass.isEnabled()) {
      throw new BadRequestException({
        code: 'pass_disabled',
        message: 'Mobile identity verification (PASS) is not enabled. Set GUARDIAN_PASS_ENABLED=true.',
      });
    }
    const user = await this.prisma.user.findUnique({
      where: { id: studentUserId },
      select: { name: true, role: true, birthDate: true, guardianConsentVerifiedAt: true, country: true },
    });
    if (!user || user.role !== UserRole.STUDENT) {
      throw new BadRequestException('guardian consent applies to student accounts only');
    }
    if (!requiresGuardianConsent(user.birthDate, user.country)) {
      throw new BadRequestException('guardian consent not required for this account');
    }
    if (user.guardianConsentVerifiedAt) {
      return { alreadyVerified: true as const };
    }
    const method = user.country === 'KR'
      ? GuardianConsentMethod.KR_PASS
      : resolveConsentMethod(user.country) as GuardianConsentMethod;
    if (method !== GuardianConsentMethod.KR_PASS) {
      throw new BadRequestException({
        code: 'not_pass_method',
        message: 'This account does not use PASS. Use the email consent flow.',
      });
    }

    const request = await this.prisma.guardianConsentRequest.upsert({
      where: { studentUserId },
      create: {
        studentUserId,
        country: user.country,
        method,
        status: GuardianConsentStatus.PENDING,
        policyVersion: CURRENT_GUARDIAN_POLICY_VERSION,
        requestIp: ctx.ip ?? null,
        requestUa: ctx.ua ?? null,
      },
      update: { method, status: GuardianConsentStatus.PENDING, verifiedAt: null },
    });

    // Reuse the consent-token table to hold the PASS transaction (hash of the
    // raw txId), invalidating any prior in-flight session for this request.
    const txId = randomBytes(24).toString('base64url');
    const tokenHash = createHash('sha256').update(txId).digest('hex');
    const expiresAt = new Date(Date.now() + PASS_TX_TTL_MIN * 60_000);
    await this.prisma.$transaction([
      this.prisma.guardianConsentToken.updateMany({
        where: { requestId: request.id, usedAt: null },
        data: { usedAt: new Date() },
      }),
      this.prisma.guardianConsentToken.create({
        data: { requestId: request.id, tokenHash, expiresAt },
      }),
    ]);

    const { authUrl } = await this.pass.start({ txId, requestId: request.id });
    return { method, txId, authUrl, provider: this.pass.providerName() };
  }

  /**
   * Complete a PASS session. In production this is the provider's signed
   * callback; the provider verify() rejects forged transactions. In mock mode
   * verify() auto-approves a synthetic adult identity, so this finishes the
   * dev flow. On success the student's guardianConsentVerifiedAt is set and the
   * guardian's CI is recorded as providerRef (no 주민등록번호 retained).
   */
  async completePassVerification(txId: string, ctx: { ip?: string; ua?: string } = {}) {
    const tokenHash = createHash('sha256').update(txId).digest('hex');
    const row = await this.prisma.guardianConsentToken.findUnique({
      where: { tokenHash },
      include: { request: { select: { id: true, studentUserId: true, status: true, method: true } } },
    });
    if (!row || row.usedAt || row.expiresAt < new Date()) {
      throw new BadRequestException('invalid or expired PASS session');
    }
    if (row.request.method !== GuardianConsentMethod.KR_PASS) {
      throw new BadRequestException('not a PASS consent request');
    }
    if (row.request.status === GuardianConsentStatus.VERIFIED) {
      return { ok: true as const, alreadyVerified: true as const };
    }

    const identity = await this.pass.verify({ txId });
    if (!identity.ok || !identity.isAdult) {
      throw new BadRequestException({
        code: 'pass_guardian_not_adult',
        message: 'The verifying person must be an adult guardian (19+).',
      });
    }

    await this.prisma.$transaction([
      this.prisma.guardianConsentToken.update({
        where: { id: row.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.guardianConsentRequest.update({
        where: { id: row.request.id },
        data: {
          status: GuardianConsentStatus.VERIFIED,
          verifiedAt: new Date(),
          parentName: identity.name,
          providerRef: identity.ci,
          verifyIp: ctx.ip ?? null,
          verifyUa: ctx.ua ?? null,
        },
      }),
      this.prisma.user.update({
        where: { id: row.request.studentUserId },
        data: { guardianConsentVerifiedAt: new Date() },
      }),
    ]);

    return { ok: true as const };
  }

  private async issueConsentEmail(
    requestId: string,
    opts: { parentEmail: string; parentName: string; childName: string; country: CountryCode },
  ) {
    const raw = randomBytes(32).toString('base64url');
    const tokenHash = createHash('sha256').update(raw).digest('hex');
    const expiresAt = new Date(Date.now() + TOKEN_TTL_DAYS * 86400000);
    const invalidatedAt = new Date();
    const [, issuedToken] = await this.prisma.$transaction([
      this.prisma.guardianConsentToken.updateMany({
        where: { requestId, usedAt: null },
        data: { usedAt: invalidatedAt },
      }),
      this.prisma.guardianConsentToken.create({
        data: { requestId, tokenHash, expiresAt },
      }),
    ]);
    try {
      await this.mail.sendGuardianConsent(
        opts.parentEmail,
        raw,
        {
          parentName: opts.parentName,
          childName: opts.childName,
          country: opts.country,
        },
      );
    } catch (e) {
      await this.prisma.guardianConsentToken.update({
        where: { id: issuedToken.id },
        data: { usedAt: new Date() },
      });
      this.logger.error(`guardian consent mail failed: ${(e as Error).message}`);
      throw new BadRequestException('could not send parent consent email');
    }
  }
}
