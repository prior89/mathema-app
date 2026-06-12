import { ForbiddenException, Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { guardianAccessSatisfied } from '../../modules/guardian-consent/guardian-consent.util';

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
    if (this.allowsUnverifiedEmail(req)) {
      await this.assertGuardianGate(context, req);
      return true;
    }

    if (req.user?.emailVerifiedAt || req.user?.role === 'ADMIN') {
      await this.assertGuardianGate(context, req);
      return true;
    }

    const userId = req.user?.id;
    if (!userId) return true;
    // Defensive fallback for tests or custom strategies that only attach
    // {id}. The production JwtStrategy already includes these fields, so this
    // query is not on the hot path.
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { emailVerifiedAt: true, role: true },
    });
    if (user?.emailVerifiedAt || user?.role === 'ADMIN') {
      await this.assertGuardianGate(context, req);
      return true;
    }
    throw new ForbiddenException({
      code: 'email_not_verified',
      message: 'Please verify your email address before continuing.',
    });
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

  private allowsUnverifiedEmail(req: any): boolean {
    const method = String(req.method ?? '').toUpperCase();
    const path = String(req.path ?? req.originalUrl?.split('?')[0] ?? '');
    const normalized = path.replace(/^\/api\/v1/, '');
    return (
      (method === 'GET' && normalized === '/users/me')
      // PATCH /users/me lets a freshly-registered user finish onboarding
      // (Role/Profile/Goal saves the picked gradeLevel + examDate +
      // targetGrade) before they have clicked the verify-email link in
      // their inbox. Without this, the Profile step would 403 and the
      // entire post-Auth onboarding flow would be unreachable. Learning /
      // billing endpoints stay verify-gated.
      || (method === 'PATCH' && normalized === '/users/me')
      || (method === 'POST' && normalized === '/auth/resend-verification')
      || (method === 'POST' && normalized === '/auth/logout')
      // Analytics is fire-and-forget and still privacy-gated by ConsentKind.
      // Blocking it at the email-verification wall creates noisy 403 loops
      // while the user is trying to verify, without protecting any learning or
      // billing surface.
      || (method === 'POST' && normalized === '/analytics/events')
      || (method === 'DELETE' && normalized === '/users/me')
      // Onboarding diagnostic (4-problem warm-up) must finish before the
      // user can verify in their inbox in a different tab — otherwise the
      // Step 5 screen renders an "email_not_verified" panel with no way
      // forward and the user is stuck. The diagnostic only records 4
      // answers + a per-concept ability snapshot, no Premium gating, so
      // the verify-email guard can safely exempt this trio. Mastery /
      // Study / problem fetch endpoints remain verify-gated, so any post-
      // onboarding learning surface still requires the verified email.
      || (method === 'POST' && normalized === '/diagnostic/start')
      || (method === 'POST' && normalized === '/diagnostic/answer')
      || (method === 'POST' && /^\/diagnostic\/[^/]+\/finish$/.test(normalized))
      || (method === 'POST' && normalized === '/diagnostic/adaptive/start')
      || (method === 'POST' && normalized === '/diagnostic/adaptive/answer')
      || (method === 'POST' && /^\/diagnostic\/adaptive\/[^/]+\/finish$/.test(normalized))
    );
  }
}
