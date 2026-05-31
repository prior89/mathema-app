import { ForbiddenException, Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

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
    if (this.allowsUnverifiedEmail(req)) return true;

    if (req.user?.emailVerifiedAt || req.user?.role === 'ADMIN') return true;

    const userId = req.user?.id;
    if (!userId) return true;
    // Defensive fallback for tests or custom strategies that only attach
    // {id}. The production JwtStrategy already includes these fields, so this
    // query is not on the hot path.
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { emailVerifiedAt: true, role: true },
    });
    if (user?.emailVerifiedAt || user?.role === 'ADMIN') return true;
    throw new ForbiddenException({
      code: 'email_not_verified',
      message: 'Please verify your email address before continuing.',
    });
  }

  private allowsUnverifiedEmail(req: any): boolean {
    const method = String(req.method ?? '').toUpperCase();
    const path = String(req.path ?? req.originalUrl?.split('?')[0] ?? '');
    const normalized = path.replace(/^\/api\/v1/, '');
    return (
      (method === 'GET' && normalized === '/users/me')
      || (method === 'POST' && normalized === '/auth/resend-verification')
      || (method === 'POST' && normalized === '/auth/logout')
      || (method === 'DELETE' && normalized === '/users/me')
    );
  }
}
