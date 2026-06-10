/**
 * AuthService — unit tests against the service's behaviour, not Nest DI.
 *
 * Dependencies (UsersService, JwtService, ConfigService, PrismaService,
 * RedisService, MailService, PrivacyService) are all hand-rolled jest mocks
 * so the spec stays fast (sub-second) and runs in CI without Postgres or
 * Redis. Integration tests against a real DB live separately and are gated
 * on the same env flags as the dev server.
 */
import * as bcrypt from 'bcrypt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

type AnyMock = { [k: string]: jest.Mock };

function mockUsers(): AnyMock {
  return {
    findByEmail: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  };
}
function mockJwt(): AnyMock {
  return {
    sign: jest.fn(),
    verifyAsync: jest.fn(),
    decode: jest.fn(),
  };
}
function mockConfig(initial: Record<string, string> = {}): AnyMock {
  return {
    get: jest.fn((k: string) => initial[k]),
  };
}
function mockPrisma(): any {
  return {
    passwordResetToken: { create: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
    emailVerificationToken: { create: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
    user: { update: jest.fn() },
    $transaction: jest.fn(async (ops: Promise<unknown>[]) => Promise.all(ops)),
  };
}
function mockRedis(): AnyMock {
  return {
    exists: jest.fn().mockResolvedValue(false),
    set: jest.fn().mockResolvedValue(undefined),
    get: jest.fn().mockResolvedValue(null),        // SEC-3 lockout counter read
    incrWithTtl: jest.fn().mockResolvedValue(1),   // SEC-3 lockout counter incr
    del: jest.fn().mockResolvedValue(undefined),   // SEC-3 lockout clear on success
  };
}
function mockMail(): AnyMock {
  return {
    sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
    sendEmailVerification: jest.fn().mockResolvedValue(undefined),
  };
}
function mockPrivacy(): AnyMock {
  return {
    grantInitial: jest.fn().mockResolvedValue(undefined),
    grant: jest.fn().mockResolvedValue(undefined),
    isActive: jest.fn().mockResolvedValue(false),
  };
}

function mockSecurityEvents(): AnyMock {
  return { record: jest.fn() };
}
function mockDevices(): AnyMock {
  return {
    upsertOnLogin: jest.fn().mockResolvedValue({ isNewDevice: true, device: { id: 'd1' } }),
    revokeOtherDevices: jest.fn().mockResolvedValue([]),
    listForUser: jest.fn().mockResolvedValue([]),
    isBound: jest.fn().mockResolvedValue(true),
  };
}

function mockParentLinks(): AnyMock {
  return {
    requestLink: jest.fn().mockResolvedValue({ linkId: 'link-1', status: 'PENDING' }),
    hasApprovedAccess: jest.fn().mockResolvedValue(false),
  };
}

function build(over: Partial<{
  users: AnyMock; jwt: AnyMock; config: AnyMock; prisma: any;
  redis: AnyMock; mail: AnyMock; privacy: AnyMock;
  events: AnyMock; devices: AnyMock; parentLinks: AnyMock;
}> = {}) {
  const users   = over.users   ?? mockUsers();
  const jwt     = over.jwt     ?? mockJwt();
  const config  = over.config  ?? mockConfig({
    'jwt.accessSecret': 'a'.repeat(48),
    'jwt.refreshSecret': 'b'.repeat(48),
    'jwt.accessTtl': '15m',
    'jwt.refreshTtl': '30d',
    'GOOGLE_CLIENT_ID': '',
  });
  const prisma  = over.prisma  ?? mockPrisma();
  const redis   = over.redis   ?? mockRedis();
  const mail    = over.mail    ?? mockMail();
  const privacy = over.privacy ?? mockPrivacy();
  const events  = over.events  ?? mockSecurityEvents();
  const devices = over.devices ?? mockDevices();
  const parentLinks = over.parentLinks ?? mockParentLinks();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const svc = new AuthService(
    users as any, jwt as any, config as any, prisma,
    redis as any, mail as any, privacy as any,
    events as any, devices as any, parentLinks as any,
  );
  return { svc, users, jwt, config, prisma, redis, mail, privacy, events, devices, parentLinks };
}

describe('AuthService', () => {
  // SEC-2: the breach check calls api.pwnedpasswords.com over the network.
  // We don't want unit tests reaching the internet, so disable for all tests
  // here. The breach check itself is exercised in password-breach.spec.ts.
  const ORIG_PWNED = process.env.PWNED_PASSWORDS_DISABLED;
  beforeAll(() => { process.env.PWNED_PASSWORDS_DISABLED = 'true'; });
  afterAll(() => { process.env.PWNED_PASSWORDS_DISABLED = ORIG_PWNED; });

  // ─────── register ───────
  describe('register', () => {
    it('rejects duplicate email', async () => {
      const users = mockUsers();
      users.findByEmail.mockResolvedValue({ id: 'u1' });
      const { svc } = build({ users });
      await expect(
        svc.register({ email: 'a@b.com', password: 'pw12345678', name: 'X', role: 'STUDENT', examDate: '2027-02-14', targetGrade: 1 } as any),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rejects PARENT without childEmail', async () => {
      const users = mockUsers();
      users.findByEmail.mockResolvedValue(null);
      const { svc } = build({ users });
      await expect(
        svc.register({ email: 'p@b.com', password: 'pw12345678', name: 'P', role: 'PARENT' } as any),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('creates PARENT invite without immediate childOfUserId link', async () => {
      const users = mockUsers();
      users.findByEmail
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 'child-1', role: 'STUDENT', email: 'child@b.com' });
      users.create.mockResolvedValue({ id: 'parent-1', email: 'p@b.com' });
      const jwt = mockJwt();
      jwt.sign.mockImplementation((p) => `token-${(p as any).sub ?? 'x'}`);
      const parentLinks = mockParentLinks();
      const { svc } = build({ users, jwt, parentLinks });
      const result = await svc.register({
        email: 'p@b.com', password: 'pw12345678', name: 'Parent', role: 'PARENT',
        childEmail: 'child@b.com',
      } as any);
      expect(users.create).toHaveBeenCalledWith(expect.not.objectContaining({ childOfUserId: 'child-1' }));
      expect(parentLinks.requestLink).toHaveBeenCalledWith(expect.objectContaining({
        parentUserId: 'parent-1',
        childUserId: 'child-1',
      }));
      expect(result).toEqual(expect.objectContaining({ parentLinkPending: true }));
    });

    it('creates STUDENT + issues tokens', async () => {
      const users = mockUsers();
      users.findByEmail.mockResolvedValue(null);
      users.create.mockResolvedValue({ id: 'u-new', email: 'a@b.com' });
      const jwt = mockJwt();
      jwt.sign.mockImplementation((p) => `token-${(p as any).sub ?? 'x'}`);
      const prisma = mockPrisma();
      const { svc } = build({ users, jwt, prisma });
      const result = await svc.register({
        email: 'a@b.com', password: 'pw12345678', name: 'A', role: 'STUDENT',
        examDate: '2027-02-14', targetGrade: 2,
      } as any);
      expect(users.create).toHaveBeenCalledWith(expect.objectContaining({ email: 'a@b.com', name: 'A', gradeLevel: null }));
      expect(result).toEqual({ accessToken: 'token-u-new', refreshToken: 'token-u-new' });
    });
  });

  // ─────── login ───────
  describe('login', () => {
    it('rejects unknown email', async () => {
      const users = mockUsers();
      users.findByEmail.mockResolvedValue(null);
      const { svc } = build({ users });
      await expect(svc.login({ email: 'a@b.com', password: 'whatever' } as any)).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rejects wrong password', async () => {
      const hash = await bcrypt.hash('right-password', 4);
      const users = mockUsers();
      users.findByEmail.mockResolvedValue({ id: 'u1', passwordHash: hash, deletedAt: null });
      const { svc } = build({ users });
      await expect(svc.login({ email: 'a@b.com', password: 'wrong-password' } as any)).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rejects deletedAt user (soft-deleted legacy guard)', async () => {
      const hash = await bcrypt.hash('pw', 4);
      const users = mockUsers();
      users.findByEmail.mockResolvedValue({ id: 'u1', passwordHash: hash, deletedAt: new Date() });
      const { svc } = build({ users });
      await expect(svc.login({ email: 'a@b.com', password: 'pw' } as any)).rejects.toBeInstanceOf(UnauthorizedException);
    });

    // SEC-3 -- locked tuple rejected before bcrypt runs.
    it('rejects when (ip, email) is already over the lockout threshold', async () => {
      const users = mockUsers();
      const redis = mockRedis();
      redis.get.mockResolvedValue('5'); // counter already at threshold
      const { svc } = build({ users, redis });
      await expect(svc.login({ email: 'a@b.com', password: 'pw' } as any, { ip: '203.0.113.1' }))
        .rejects.toBeInstanceOf(UnauthorizedException);
      // bcrypt compare must NOT have run -- short-circuit before DB lookup.
      expect(users.findByEmail).not.toHaveBeenCalled();
    });

    // SEC-3 -- failure increments the (ip, email) counter.
    it('increments the lockout counter on wrong password', async () => {
      const hash = await bcrypt.hash('right-password', 4);
      const users = mockUsers();
      users.findByEmail.mockResolvedValue({ id: 'u1', passwordHash: hash, deletedAt: null });
      const redis = mockRedis();
      const { svc } = build({ users, redis });
      await expect(svc.login({ email: 'a@b.com', password: 'wrong' } as any, { ip: '203.0.113.1' }))
        .rejects.toBeInstanceOf(UnauthorizedException);
      expect(redis.incrWithTtl).toHaveBeenCalledWith(
        expect.stringContaining('auth:fail:203.0.113.1:a@b.com'),
        expect.any(Number),
      );
    });

    // SEC-3 -- success clears the counter.
    it('clears the lockout counter on successful login', async () => {
      const hash = await bcrypt.hash('pw', 4);
      const users = mockUsers();
      users.findByEmail.mockResolvedValue({ id: 'u1', passwordHash: hash, deletedAt: null });
      const jwt = mockJwt();
      jwt.sign.mockImplementation((p) => `t-${(p as any).sub}`);
      const redis = mockRedis();
      const { svc } = build({ users, jwt, redis });
      await svc.login({ email: 'a@b.com', password: 'pw' } as any, { ip: '203.0.113.1' });
      expect(redis.del).toHaveBeenCalledWith(expect.stringContaining('auth:fail:203.0.113.1:a@b.com'));
    });

    it('issues tokens on valid credentials', async () => {
      const hash = await bcrypt.hash('pw', 4);
      const users = mockUsers();
      users.findByEmail.mockResolvedValue({ id: 'u1', passwordHash: hash, deletedAt: null });
      const jwt = mockJwt();
      jwt.sign.mockImplementation((p) => `t-${(p as any).sub}`);
      const { svc } = build({ users, jwt });
      const r = await svc.login({ email: 'a@b.com', password: 'pw' } as any);
      expect(r).toEqual({ accessToken: 't-u1', refreshToken: 't-u1' });
    });
  });

  // ─────── devLogin ───────
  describe('devLogin', () => {
    const ORIG_NODE_ENV = process.env.NODE_ENV;
    const ORIG_OPT_IN = process.env.ENABLE_DEV_LOGIN;
    afterEach(() => {
      process.env.NODE_ENV = ORIG_NODE_ENV;
      process.env.ENABLE_DEV_LOGIN = ORIG_OPT_IN;
    });

    it('rejects when NODE_ENV is not development', async () => {
      process.env.NODE_ENV = 'production';
      process.env.ENABLE_DEV_LOGIN = 'true';
      const { svc } = build();
      await expect(svc.devLogin()).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rejects when ENABLE_DEV_LOGIN is not opt-in', async () => {
      process.env.NODE_ENV = 'development';
      process.env.ENABLE_DEV_LOGIN = '';
      const { svc } = build();
      await expect(svc.devLogin()).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('creates a verified local user for the dev shortcut', async () => {
      process.env.NODE_ENV = 'development';
      process.env.ENABLE_DEV_LOGIN = 'true';
      const users = mockUsers();
      users.findByEmail.mockResolvedValue(null);
      users.create.mockResolvedValue({
        id: 'dev-user',
        email: 'admin@mathema.app',
        emailVerifiedAt: new Date(),
      });
      const jwt = mockJwt();
      jwt.sign.mockImplementation((p) => `t-${(p as any).sub}`);
      const { svc } = build({ users, jwt });

      await svc.devLogin();

      expect(users.create).toHaveBeenCalledWith(expect.objectContaining({
        email: 'admin@mathema.app',
        emailVerifiedAt: expect.any(Date),
      }));
    });

    it('marks an existing dev shortcut user as verified', async () => {
      process.env.NODE_ENV = 'development';
      process.env.ENABLE_DEV_LOGIN = 'true';
      const users = mockUsers();
      users.findByEmail.mockResolvedValue({
        id: 'dev-user',
        email: 'admin@mathema.app',
        emailVerifiedAt: null,
      });
      const prisma = mockPrisma();
      prisma.user.update.mockResolvedValue({
        id: 'dev-user',
        email: 'admin@mathema.app',
        emailVerifiedAt: new Date(),
      });
      const jwt = mockJwt();
      jwt.sign.mockImplementation((p) => `t-${(p as any).sub}`);
      const { svc } = build({ users, prisma, jwt });

      await svc.devLogin();

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'dev-user' },
        data: { emailVerifiedAt: expect.any(Date) },
      });
    });
  });

  // ─────── refresh ───────
  describe('refresh', () => {
    it('rejects invalid signature', async () => {
      const jwt = mockJwt();
      jwt.verifyAsync.mockRejectedValue(new Error('bad signature'));
      const { svc } = build({ jwt });
      await expect(svc.refresh('garbage')).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rejects revoked jti', async () => {
      const jwt = mockJwt();
      jwt.verifyAsync.mockResolvedValue({ sub: 'u1', type: 'refresh', jti: 'j-1', exp: 9_999_999_999 });
      const redis = mockRedis();
      redis.exists.mockResolvedValue(true); // blacklisted
      const { svc } = build({ jwt, redis });
      await expect(svc.refresh('whatever')).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rotates: blacklists old jti + issues new tokens', async () => {
      const jwt = mockJwt();
      jwt.verifyAsync.mockResolvedValue({ sub: 'u1', type: 'refresh', jti: 'j-old', exp: 9_999_999_999 });
      jwt.sign.mockImplementation((p) => `t-${(p as any).sub}`);
      const redis = mockRedis();
      const { svc } = build({ jwt, redis });
      const out = await svc.refresh('whatever');
      expect(redis.set).toHaveBeenCalledWith(expect.stringContaining('j-old'), '1', expect.any(Number));
      expect(out.accessToken).toBe('t-u1');
    });
  });

  describe('logout', () => {
    it('blacklists the presented refresh token until its expiry', async () => {
      const jwt = mockJwt();
      jwt.decode.mockReturnValue({
        sub: 'u1',
        type: 'refresh',
        jti: 'j-logout',
        exp: Math.floor(Date.now() / 1000) + 3600,
      });
      const redis = mockRedis();
      const { svc } = build({ jwt, redis });

      await expect(svc.logout('refresh-token')).resolves.toEqual({ ok: true });
      expect(redis.set).toHaveBeenCalledWith(
        expect.stringContaining('j-logout'),
        '1',
        expect.any(Number),
      );
    });

    it('is idempotent for missing or malformed tokens', async () => {
      const jwt = mockJwt();
      jwt.decode.mockImplementation(() => { throw new Error('malformed'); });
      const redis = mockRedis();
      const { svc } = build({ jwt, redis });

      await expect(svc.logout('')).resolves.toEqual({ ok: true });
      await expect(svc.logout('bad-token')).resolves.toEqual({ ok: true });
      expect(redis.set).not.toHaveBeenCalled();
    });
  });

  // ─────── forgotPassword (no enumeration) ───────
  describe('forgotPassword', () => {
    it('returns ok=true and does NOT email when user is unknown', async () => {
      const users = mockUsers();
      users.findByEmail.mockResolvedValue(null);
      const mail = mockMail();
      const { svc } = build({ users, mail });
      const r = await svc.forgotPassword('ghost@b.com');
      expect(r).toEqual({ ok: true });
      expect(mail.sendPasswordResetEmail).not.toHaveBeenCalled();
    });

    it('returns ok=true AND emails when user exists', async () => {
      const users = mockUsers();
      users.findByEmail.mockResolvedValue({ id: 'u1', email: 'a@b.com', deletedAt: null });
      const mail = mockMail();
      const prisma = mockPrisma();
      const { svc } = build({ users, mail, prisma });
      const r = await svc.forgotPassword('a@b.com');
      expect(r).toEqual({ ok: true });
      expect(mail.sendPasswordResetEmail).toHaveBeenCalledWith('a@b.com', expect.any(String));
    });
  });
});
