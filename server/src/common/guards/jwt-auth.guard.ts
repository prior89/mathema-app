import { ForbiddenException, Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { guardianAccessSatisfied } from '../../modules/guardian-consent/guardian-consent.util';

// Email gate is soft (payment-only); guardian gate stays country-aware.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) { super(); }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), context.getClass(),
    ]);
    if (isPublic) return true;

    const ok = await super.canActivate(context) as boolean;
    if (!ok) return false;

    const req = context.switchToHttp().getRequest();

    // Email verification is a SOFT gate. Hard-blocking learning on an inbox
    // click was the larger half of the onboarding "double-mail" friction, and
    // social/phone login already supplies a verified identity. Only payment /
    // entitlement-granting mutations still require a verified email (a
    // reachable contact for receipts and recovery); all learning, diagnostic,
    // and profile endpoints are reachable immediately after signup.
    if (this.requiresVerifiedEmail(req) && !(await this.hasVerifiedEmail(req))) {
      throw new ForbiddenException({
        code: 'email_not_verified',
        message: 'Please verify your email address before continuing.',
      });
    }

    await this.assertGuardianGate(context, req);
    return true;
  }

  private async hasVerifiedEmail(req: any): Promise<boolean> {
    if (req.user?.emailVerifiedAt || req.user?.role === 'ADMIN') return true;
    const userId = req.user?.id;
    // Fail CLOSED when no user id is attached — if a future route re-enables the
    // email gate (see requiresVerifiedEmail), an unidentified request must not
    // pass it. The production JwtStrategy always attaches the fields below.
    if (!userId) return false;
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { emailVerifiedAt: true, role: true },
    });
    return !!(user?.emailVerifiedAt || user?.role === 'ADMIN');
  }

  private async assertGuardianGate(context: ExecutionContext, req: any): Promise<void> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), context.getClass(),
    ]);
    if (isPublic) return;

    const userId = req.user?.id;
    if (!userId) return;

    if (this.allowsGuardianExempt(req)) return;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        birthDate: true,
        guardianConsentVerifiedAt: true,
        country: true,
        isGuest: true,
      },
    });
    if (!user || user.role !== 'STUDENT') return;
    // Guests carry zero PII (no name/birthDate, synthetic email) so the
    // DPDP/PIPA guardian-consent requirement does not attach. The gate
    // re-engages at /auth/guest/upgrade when a real profile is created.
    if ((user as any).isGuest) return;

    if (!guardianAccessSatisfied(user)) {
      const needsAge = !user.birthDate;
      throw new ForbiddenException({
        code: needsAge ? 'age_profile_required' : 'guardian_consent_required',
        message: needsAge
          ? 'Please complete your age profile before using learning features.'
          : 'Parent/guardian email confirmation is required before using learning features.',
      });
    }
  }

  private allowsGuardianExempt(req: any): boolean {
    const method = String(req.method ?? '').toUpperCase();
    const path = String(req.path ?? req.originalUrl?.split('?')[0] ?? '');
    const normalized = path.replace(/^\/api\/v1/, '');
    return (
      (method === 'GET' && normalized === '/users/me')
      || (method === 'PATCH' && normalized === '/users/me')
      || (method === 'DELETE' && normalized === '/users/me')
      || (method === 'GET' && normalized.startsWith('/guardian-consent'))
      || (method === 'POST' && normalized.startsWith('/guardian-consent'))
      || (method === 'POST' && normalized === '/auth/logout')
      || (method === 'POST' && normalized === '/auth/resend-verification')
      || (method === 'GET' && normalized.startsWith('/privacy/'))
      || (method === 'POST' && normalized.startsWith('/privacy/consents/'))
      || (method === 'DELETE' && normalized.startsWith('/privacy/consents/'))
    );
  }

  // Email verification is a fully SOFT gate — no learning, diagnostic, or
  // billing endpoint hard-blocks on it. Notably billing is NOT gated:
  //   - POST /billing/preview/start grants the FREE cardless preview; gating it
  //     would wall the "experience value first" funnel.
  //   - POST /billing/verify records an already-completed Play purchase; gating
  //     it would leave a paying user paid-but-not-entitled (refund/CS hazard).
  // Social/phone login already supplies a verified identity, and a Kakao user
  // may have no email at all. If a genuinely email-dependent action is added
  // later (e.g. changing the account email), gate that specific route here.
  private requiresVerifiedEmail(_req: any): boolean {
    return false;
  }
}
