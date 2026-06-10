import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ParentLinkStatus, UserRole } from '@prisma/client';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { MailService } from '../../infrastructure/mail/mail.service';
import { SecurityEventService } from '../auth/security-event.service';

const APPROVAL_TOKEN_TTL_DAYS = 7;

@Injectable()
export class ParentLinksService {
  private readonly logger = new Logger(ParentLinksService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
    private readonly events: SecurityEventService,
  ) {}

  /** True when parent has an APPROVED link to the student. */
  async hasApprovedAccess(parentUserId: string, childUserId: string): Promise<boolean> {
    const link = await this.prisma.parentChildLink.findFirst({
      where: {
        parentUserId,
        childUserId,
        status: ParentLinkStatus.APPROVED,
      },
    });
    return !!link;
  }

  /** Create a pending link and email the student an approval link. */
  async requestLink(opts: {
    parentUserId: string;
    childUserId: string;
    parentName: string;
    childEmail: string;
    ip?: string;
    ua?: string;
  }) {
    const child = await this.prisma.user.findUnique({
      where: { id: opts.childUserId },
      select: { id: true, role: true, email: true, name: true },
    });
    if (!child || child.role !== UserRole.STUDENT) {
      throw new BadRequestException('child account not found — student must register first');
    }

    const approvedOther = await this.prisma.parentChildLink.findFirst({
      where: {
        parentUserId: opts.parentUserId,
        status: ParentLinkStatus.APPROVED,
        NOT: { childUserId: opts.childUserId },
      },
    });
    if (approvedOther) {
      throw new BadRequestException('parent already linked to another student — revoke first');
    }

    const existing = await this.prisma.parentChildLink.findUnique({
      where: {
        parentUserId_childUserId: {
          parentUserId: opts.parentUserId,
          childUserId: opts.childUserId,
        },
      },
    });

    if (existing?.status === ParentLinkStatus.APPROVED) {
      return { linkId: existing.id, status: existing.status, alreadyApproved: true };
    }
    if (existing?.status === ParentLinkStatus.PENDING) {
      await this.issueApprovalToken(existing.id, child.email, opts.parentName, child.name);
      return { linkId: existing.id, status: existing.status, resent: true };
    }
    if (existing?.status === ParentLinkStatus.REJECTED) {
      const revived = await this.prisma.parentChildLink.update({
        where: { id: existing.id },
        data: {
          status: ParentLinkStatus.PENDING,
          rejectedAt: null,
          revokedAt: null,
          approvedAt: null,
        },
      });
      await this.issueApprovalToken(revived.id, child.email, opts.parentName, child.name);
      this.events.record('PARENT_LINK_REQUESTED', {
        userId: opts.parentUserId,
        ip: opts.ip ?? null,
        userAgent: opts.ua ?? null,
        metadata: { childUserId: opts.childUserId, linkId: revived.id, revived: true },
      });
      return { linkId: revived.id, status: revived.status };
    }

    const link = await this.prisma.parentChildLink.create({
      data: {
        parentUserId: opts.parentUserId,
        childUserId: opts.childUserId,
        status: ParentLinkStatus.PENDING,
      },
    });

    await this.issueApprovalToken(link.id, child.email, opts.parentName, child.name);

    this.events.record('PARENT_LINK_REQUESTED', {
      userId: opts.parentUserId,
      ip: opts.ip ?? null,
      userAgent: opts.ua ?? null,
      metadata: { childUserId: opts.childUserId, linkId: link.id },
    });

    return { linkId: link.id, status: link.status };
  }

  private async issueApprovalToken(
    linkId: string,
    childEmail: string,
    parentName: string,
    childName: string,
  ) {
    const raw = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(raw).digest('hex');
    const expiresAt = new Date(Date.now() + APPROVAL_TOKEN_TTL_DAYS * 24 * 3600 * 1000);

    await this.prisma.parentLinkApprovalToken.create({
      data: { linkId, tokenHash, expiresAt },
    });

    await this.mail.sendParentLinkApproval(childEmail, raw, { parentName, childName });
  }

  async approveByToken(rawToken: string, ctx: { ip?: string; ua?: string } = {}) {
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    const rec = await this.prisma.parentLinkApprovalToken.findUnique({
      where: { tokenHash },
      include: { link: true },
    });
    if (!rec || rec.usedAt || rec.expiresAt < new Date()) {
      throw new BadRequestException('invalid or expired token');
    }
    if (rec.link.status !== ParentLinkStatus.PENDING) {
      throw new BadRequestException('link is no longer pending');
    }

    await this.finalizeApproval(rec.link.id, rec.link.parentUserId, rec.link.childUserId, rec.id, ctx);
    return { ok: true, status: ParentLinkStatus.APPROVED };
  }

  async rejectByToken(rawToken: string, ctx: { ip?: string; ua?: string } = {}) {
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    const rec = await this.prisma.parentLinkApprovalToken.findUnique({
      where: { tokenHash },
      include: { link: true },
    });
    if (!rec || rec.usedAt || rec.expiresAt < new Date()) {
      throw new BadRequestException('invalid or expired token');
    }
    if (rec.link.status !== ParentLinkStatus.PENDING) {
      throw new BadRequestException('link is no longer pending');
    }

    await this.prisma.$transaction([
      this.prisma.parentLinkApprovalToken.update({
        where: { id: rec.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.parentChildLink.update({
        where: { id: rec.link.id },
        data: { status: ParentLinkStatus.REJECTED, rejectedAt: new Date() },
      }),
      this.prisma.user.update({
        where: { id: rec.link.parentUserId },
        data: { childOfUserId: null },
      }),
    ]);

    this.events.record('PARENT_LINK_REJECTED', {
      userId: rec.link.childUserId,
      ip: ctx.ip ?? null,
      userAgent: ctx.ua ?? null,
      metadata: { parentUserId: rec.link.parentUserId, linkId: rec.link.id },
    });

    return { ok: true, status: ParentLinkStatus.REJECTED };
  }

  async approveById(linkId: string, studentUserId: string, ctx: { ip?: string; ua?: string } = {}) {
    const link = await this.prisma.parentChildLink.findUnique({ where: { id: linkId } });
    if (!link) throw new NotFoundException('link not found');
    if (link.childUserId !== studentUserId) {
      throw new BadRequestException('only the linked student can approve');
    }
    if (link.status !== ParentLinkStatus.PENDING) {
      throw new BadRequestException('link is no longer pending');
    }

    await this.finalizeApproval(link.id, link.parentUserId, link.childUserId, null, ctx);
    return { ok: true, status: ParentLinkStatus.APPROVED };
  }

  private async finalizeApproval(
    linkId: string,
    parentUserId: string,
    childUserId: string,
    tokenId: string | null,
    ctx: { ip?: string; ua?: string },
  ) {
    await this.prisma.$transaction(async (tx) => {
      if (tokenId) {
        await tx.parentLinkApprovalToken.update({
          where: { id: tokenId },
          data: { usedAt: new Date() },
        });
      }
      await tx.parentChildLink.update({
        where: { id: linkId },
        data: { status: ParentLinkStatus.APPROVED, approvedAt: new Date() },
      });
      await tx.user.update({
        where: { id: parentUserId },
        data: { childOfUserId: childUserId },
      });
    });

    this.events.record('PARENT_LINK_APPROVED', {
      userId: childUserId,
      ip: ctx.ip ?? null,
      userAgent: ctx.ua ?? null,
      metadata: { parentUserId, linkId },
    });

    this.logger.log(`Parent link approved: parent=${parentUserId} child=${childUserId}`);
  }

  async getStatusForParent(parentUserId: string) {
    const link = await this.prisma.parentChildLink.findFirst({
      where: { parentUserId },
      orderBy: { updatedAt: 'desc' },
      include: {
        child: { select: { id: true, name: true, email: true } },
      },
    });
    if (!link) return { status: null as ParentLinkStatus | null, child: null };
    return {
      status: link.status,
      child: link.child ? { id: link.child.id, name: link.child.name, email: link.child.email } : null,
      approvedAt: link.approvedAt,
    };
  }

  async listIncomingForStudent(studentUserId: string) {
    return this.prisma.parentChildLink.findMany({
      where: { childUserId: studentUserId, status: ParentLinkStatus.PENDING },
      include: {
        parent: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Approved child user id for a parent (for dashboard data routing). */
  async approvedChildId(parentUserId: string): Promise<string | null> {
    const link = await this.prisma.parentChildLink.findFirst({
      where: { parentUserId, status: ParentLinkStatus.APPROVED },
      select: { childUserId: true },
    });
    return link?.childUserId ?? null;
  }
}