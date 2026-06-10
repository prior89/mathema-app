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
import {
  CURRENT_GUARDIAN_POLICY_VERSION,
  requiresGuardianConsent,
  resolveConsentMethod,
} from './guardian-consent.util';

const TOKEN_TTL_DAYS = 7;

@Injectable()
export class GuardianConsentService {
  private readonly logger = new Logger(GuardianConsentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
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
    const required = requiresGuardianConsent(user.birthDate);
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
      select: { birthDate: true, guardianConsentVerifiedAt: true, role: true },
    });
    if (!user || user.role !== UserRole.STUDENT || !requiresGuardianConsent(user.birthDate)) {
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
    dto: { parentName: string; parentEmail: string; parentPhone?: string },
    ctx: { ip?: string; ua?: string } = {},
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: studentUserId },
      select: { name: true, role: true, birthDate: true, guardianConsentVerifiedAt: true, country: true },
    });
    if (!user || user.role !== UserRole.STUDENT) {
      throw new BadRequestException('guardian consent applies to student accounts only');
    }
    if (!requiresGuardianConsent(user.birthDate)) {
      throw new BadRequestException('guardian consent not required for this account');
    }
    if (user.guardianConsentVerifiedAt) {
      return { alreadyVerified: true };
    }

    const parentEmail = dto.parentEmail.trim().toLowerCase();
    const method = resolveConsentMethod(user.country) as GuardianConsentMethod;
    if (method === GuardianConsentMethod.KR_PASS) {
      throw new BadRequestException({
        code: 'pass_not_configured',
        message: 'Mobile identity verification (PASS) is not enabled yet. Set GUARDIAN_PASS_ENABLED or use email OTP.',
      });
    }

    const request = await this.prisma.guardianConsentRequest.upsert({
      where: { studentUserId },
      create: {
        studentUserId,
        country: user.country,
        method,
        status: GuardianConsentStatus.PENDING,
        parentName: dto.parentName.trim(),
        parentEmail,
        parentPhone: dto.parentPhone?.trim() ?? null,
        policyVersion: CURRENT_GUARDIAN_POLICY_VERSION,
        requestIp: ctx.ip ?? null,
        requestUa: ctx.ua ?? null,
      },
      update: {
        parentName: dto.parentName.trim(),
        parentEmail,
        parentPhone: dto.parentPhone?.trim() ?? null,
        status: GuardianConsentStatus.PENDING,
        verifiedAt: null,
        method,
      },
    });

    await this.issueConsentEmail(request.id, {
      parentEmail,
      parentName: dto.parentName.trim(),
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

  private async issueConsentEmail(
    requestId: string,
    opts: { parentEmail: string; parentName: string; childName: string; country: CountryCode },
  ) {
    const raw = randomBytes(32).toString('base64url');
    const tokenHash = createHash('sha256').update(raw).digest('hex');
    const expiresAt = new Date(Date.now() + TOKEN_TTL_DAYS * 86400000);
    await this.prisma.guardianConsentToken.create({
      data: { requestId, tokenHash, expiresAt },
    });
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
      this.logger.error(`guardian consent mail failed: ${(e as Error).message}`);
      throw new BadRequestException('could not send parent consent email');
    }
  }
}