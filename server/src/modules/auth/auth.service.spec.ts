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
import { BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { COUNTRY_CONFIG } from '../../common/enums/country.enum';

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
  const prisma: any = {
    passwordResetToken: {
      create: jest.fn(), findUnique: jest.fn(), update: jest.fn(),
      updateMany: jest.fn(), deleteMany: jest.fn(),
    },
    emailVerificationToken: {
      create: jest.fn(), findUnique: jest.fn(), update: jest.fn(), deleteMany: jest.fn(),
    },
    user: { findUnique: jest.fn(), update: jest.fn(), updateMany: jest.fn() },
  };
  prisma.$transaction = jest.fn(async (
    operation: Promise<unknown>[] | ((tx: typeof prisma) => Promise<unknown>),
  ) => (typeof operation === 'function' ? operation(prisma) : Promise.all(operation)));
  return prisma;
}
function mockRedis(): AnyMock {
  return {
    exists: jest.fn().mockResolvedValue(false),
    set: jest.fn().mockResolvedValue(undefined),
    get: jest.fn().mockResolvedValue(null),        // SEC-3 lockout counter read
    incrWithTtl: jest.fn().mockResolvedValue(1),   // SEC-3 lockout counter incr
    setNx: jest.fn().mockResolvedValue(true),
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
    assertOptionalConsentProfile: jest.fn(),
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

function mockGuardianConsent(): AnyMock {
  return {
    ensurePendingForStudent: jest.fn().mockResolvedValue({ required: false }),
  };
}

function build(over: Partial<{
  users: AnyMock; jwt: AnyMock; config: AnyMock; prisma: any;
  redis: AnyMock; mail: AnyMock; privacy: AnyMock;
  events: AnyMock; devices: AnyMock; parentLinks: AnyMock;
  guardianConsent: AnyMock; social: AnyMock; otp: AnyMock;
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
  const guardianConsent = over.guardianConsent ?? mockGuardianConsent();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const social = over.social ?? {
    isMock: jest.fn().mockReturnValue(true),
    verify: jest.fn().mockResolvedValue({
      provider: 'kakao', providerUserId: 'kk1', email: 'kakao_kk1@mock.local', emailVerified: true, name: '카카오 사용자',
    }),
  };
  const otp = over.otp ?? {
    isMock: jest.fn().mockReturnValue(true),
    send: jest.fn().mockResolvedValue({ channel: 'mock', devCode: '123456' }),
    verifyTruecaller: jest.fn().mockResolvedValue({ phone: '+919000000001', name: 'Truecaller User' }),
  };
  const svc = new AuthService(
    users as any, jwt as any, config as any, prisma,
    redis as any, mail as any, privacy as any,
    events as any, devices as any, parentLinks as any,
    guardianConsent as any, social as any, otp as any,
  );
  return { svc, users, jwt, config, prisma, redis, mail, privacy, events, devices, parentLinks, guardianConsent, social, otp };
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

    // KR-first launch park: IN + AE share the un-seeded NCERT bank and are
    // 'planned' in COUNTRY_CONFIG, so the register API must reject them even
    // though the DTO whitelists the code. Guards against a re-live regression.
    it('rejects sign-up for a parked market (country: IN)', async () => {
      const users = mockUsers();
      users.findByEmail.mockResolvedValue(null);
      const { svc } = build({ users });
      await expect(
        svc.register({
          email: 'in@b.com', password: 'pw12345678', name: 'IN', role: 'STUDENT',
          examDate: '2027-02-14', targetGrade: 2, country: 'IN',
        } as any),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(users.create).not.toHaveBeenCalled();
    });

    it('defaults an omitted country to the live KR market', async () => {
      const users = mockUsers();
      users.findByEmail.mockResolvedValue(null);
      users.create.mockResolvedValue({ id: 'u-kr', email: 'k@b.com' });
      const jwt = mockJwt();
      jwt.sign.mockImplementation((p) => `token-${(p as any).sub ?? 'x'}`);
      const prisma = mockPrisma();
      const { svc } = build({ users, jwt, prisma });
      await svc.register({
        email: 'k@b.com', password: 'pw12345678', name: 'K', role: 'STUDENT',
        examDate: '2027-02-14', targetGrade: 2,
      } as any);
      expect(users.create).toHaveBeenCalledWith(expect.objectContaining({ country: 'KR' }));
    });

    it('rejects an ineligible optional-consent payload before creating the user', async () => {
      const users = mockUsers();
      users.findByEmail.mockResolvedValue(null);
      const privacy = mockPrivacy();
      privacy.assertOptionalConsentProfile.mockImplementation(() => {
        throw new BadRequestException({ code: 'minor_optional_consent_requires_guardian' });
      });
      const { svc } = build({ users, privacy });

      await expect(svc.register({
        email: 'minor@b.com', password: 'pw12345678', name: 'Minor', role: 'STUDENT',
        country: 'KR', birthDate: '2014-01-01', consentAnalytics: true,
      } as any)).rejects.toMatchObject({
        response: { code: 'minor_optional_consent_requires_guardian' },
      });
      expect(users.create).not.toHaveBeenCalled();
      expect(privacy.grantInitial).not.toHaveBeenCalled();
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

  describe('phone OTP', () => {
    it('stores phone OTP state and synthetic email without exposing the raw phone', async () => {
      const previousStatus = COUNTRY_CONFIG.IN.status;
      COUNTRY_CONFIG.IN.status = 'live';
      try {
      const rawPhone = '+91 98123 45678';
      const rawDigits = '919812345678';
      const users = mockUsers();
      users.findByEmail.mockResolvedValue(null);
      users.create.mockResolvedValue({
        id: 'phone-user',
        email: 'phone_hash@users.matheo.local',
        emailVerifiedAt: new Date(),
      });
      const jwt = mockJwt();
      jwt.sign.mockImplementation((p) => `t-${(p as any).sub}`);
      const redis = mockRedis();
      const otp = {
        isMock: jest.fn().mockReturnValue(true),
        send: jest.fn(async (_phone: string, code: string) => ({ channel: 'mock', devCode: code })),
        verifyTruecaller: jest.fn(),
      };
      const { svc } = build({
        users,
        jwt,
        redis,
        otp,
        config: mockConfig({
          'jwt.accessSecret': 'a'.repeat(48),
          'jwt.refreshSecret': 'b'.repeat(48),
          'jwt.accessTtl': '15m',
          'jwt.refreshTtl': '30d',
          PHONE_ID_HASH_SECRET: 'phone-hash-secret',
        }),
      });

      const started = await svc.startPhoneOtp(rawPhone);
      const otpSet = redis.set.mock.calls.find(([key]) => String(key).startsWith('otp:phone:'));
      expect(otpSet).toBeTruthy();
      expect(String(otpSet![0])).not.toContain(rawDigits);
      expect(redis.incrWithTtl.mock.calls[0][0]).not.toContain(rawDigits);

      redis.get.mockResolvedValueOnce(otpSet![1]);
      await expect(svc.verifyPhoneOtp(rawPhone, started.devCode!, { deviceHash: 'dh' }))
        .resolves.toEqual({ accessToken: 't-phone-user', refreshToken: 't-phone-user' });

      const created = users.create.mock.calls[0][0];
      expect(created.email).toMatch(/^phone_[0-9a-f]{32}@users\.matheo\.local$/);
      expect(created.email).not.toContain(rawDigits);
      expect(created.passwordHash).not.toContain(rawDigits);
      } finally {
        COUNTRY_CONFIG.IN.status = previousStatus;
      }
    });

    it('does not send an OTP while the India market is planned', async () => {
      const otp = {
        isMock: jest.fn().mockReturnValue(true),
        send: jest.fn(),
        verifyTruecaller: jest.fn(),
      };
      const { svc } = build({ otp });

      await expect(svc.startPhoneOtp('+91 98123 45678')).rejects.toMatchObject({
        response: { code: 'country_unavailable' },
      });
      expect(otp.send).not.toHaveBeenCalled();
    });
  });

  describe('guest account gates', () => {
    it('enforces the server-side guest-mode kill switch before creating a user', async () => {
      const users = mockUsers();
      const { svc } = build({ users });

      await expect(svc.guestStart({ country: 'KR' })).rejects.toMatchObject({
        response: { code: 'guest_mode_disabled' },
      });
      expect(users.create).not.toHaveBeenCalled();
    });

    it('rejects a planned guest market before creating a user', async () => {
      const users = mockUsers();
      const config = mockConfig({
        'jwt.accessSecret': 'a'.repeat(48),
        'jwt.refreshSecret': 'b'.repeat(48),
        'jwt.accessTtl': '15m',
        'jwt.refreshTtl': '30d',
        FEATURE_GUEST_MODE_PCT: '100',
      });
      const { svc } = build({ users, config });

      await expect(svc.guestStart({ country: 'IN' })).rejects.toMatchObject({
        response: { code: 'country_unavailable' },
      });
      expect(users.create).not.toHaveBeenCalled();
    });

    it('checks optional-consent eligibility before mutating a guest account', async () => {
      const prisma = mockPrisma();
      prisma.user.findUnique.mockResolvedValue({
        id: 'guest-1', isGuest: true, deletedAt: null, country: 'KR',
      });
      const users = mockUsers();
      users.findByEmail.mockResolvedValue(null);
      const privacy = mockPrivacy();
      privacy.assertOptionalConsentProfile.mockImplementation(() => {
        throw new BadRequestException({ code: 'minor_optional_consent_requires_guardian' });
      });
      const { svc } = build({ prisma, users, privacy });

      await expect(svc.guestUpgrade('guest-1', {
        email: 'upgrade@b.com', password: 'pw12345678', name: 'Student',
        country: 'KR', birthDate: '2014-01-01', consentMarketing: true,
      })).rejects.toMatchObject({
        response: { code: 'minor_optional_consent_requires_guardian' },
      });
      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(privacy.grant).not.toHaveBeenCalled();
    });
  });

  // ─────── refresh ───────
  describe('Google ID-token nonce', () => {
    const nonce = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

    function googleTicket(
      tokenNonce?: string,
      overrides: Record<string, unknown> = {},
    ) {
      return {
        getPayload: () => ({
          sub: 'google-user-1',
          email: 'student@gmail.com',
          email_verified: true,
          name: 'Student',
          exp: Math.floor(Date.now() / 1000) + 3_000,
          ...(tokenNonce ? { nonce: tokenNonce } : {}),
          ...overrides,
        }),
      };
    }

    function googleService(redis = mockRedis()) {
      const users = mockUsers();
      const existingUser = {
        id: 'user-1', email: 'student@gmail.com', emailVerifiedAt: new Date(),
      };
      users.findByEmail.mockResolvedValue(existingUser);
      const prisma = mockPrisma();
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.update.mockImplementation(async ({ data }: any) => ({
        ...existingUser,
        ...data,
      }));
      prisma.user.updateMany.mockResolvedValue({ count: 1 });
      const jwt = mockJwt();
      jwt.sign.mockImplementation((_payload, options) =>
        options?.secret === 'access-secret' ? 'access-token' : 'refresh-token');
      const config = mockConfig({
        GOOGLE_CLIENT_ID: 'google-client-id',
        'jwt.accessSecret': 'access-secret',
        'jwt.refreshSecret': 'refresh-secret',
        'jwt.accessTtl': '15m',
        'jwt.refreshTtl': '30d',
      });
      return build({ users, jwt, config, redis, prisma });
    }

    it('accepts a matching signed nonce while replay-keying the exact token', async () => {
      const redis = mockRedis();
      const { svc } = googleService(redis);
      (svc as any).googleClient = {
        verifyIdToken: jest.fn().mockResolvedValue(googleTicket(nonce)),
      };

      await expect(svc.signInWithGoogle('signed-id-token', { nonce }))
        .resolves.toEqual({ accessToken: 'access-token', refreshToken: 'refresh-token' });
      expect(redis.setNx).toHaveBeenCalledWith(
        expect.stringMatching(/^auth:google:token:(?!.*signed-id-token)/),
        '1',
        expect.any(Number),
      );
    });

    it('rejects replay of the exact nonce-bearing token', async () => {
      const redis = mockRedis();
      redis.setNx.mockResolvedValue(false);
      const { svc } = googleService(redis);
      (svc as any).googleClient = {
        verifyIdToken: jest.fn().mockResolvedValue(googleTicket(nonce)),
      };

      await expect(svc.signInWithGoogle('replayed-id-token', { nonce }))
        .rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('allows a fresh token to retry with the same mounted GIS nonce', async () => {
      const redis = mockRedis();
      const { svc } = googleService(redis);
      (svc as any).googleClient = {
        verifyIdToken: jest.fn().mockResolvedValue(googleTicket(nonce)),
      };

      await expect(svc.signInWithGoogle('first-id-token', { nonce })).resolves.toBeDefined();
      await expect(svc.signInWithGoogle('fresh-id-token', { nonce })).resolves.toBeDefined();
      expect(redis.setNx.mock.calls.map(([key]) => key)).toEqual([
        expect.stringMatching(/^auth:google:token:/),
        expect.stringMatching(/^auth:google:token:/),
      ]);
      expect(redis.setNx.mock.calls[0][0]).not.toBe(redis.setNx.mock.calls[1][0]);
    });

    it('rejects mismatched or stripped request nonces before user lookup', async () => {
      const redis = mockRedis();
      const { svc, users } = googleService(redis);
      (svc as any).googleClient = {
        verifyIdToken: jest.fn().mockResolvedValue(googleTicket(nonce)),
      };

      await expect(svc.signInWithGoogle('signed-id-token', { nonce: 'f'.repeat(64) }))
        .rejects.toBeInstanceOf(UnauthorizedException);
      await expect(svc.signInWithGoogle('signed-id-token'))
        .rejects.toBeInstanceOf(UnauthorizedException);
      expect(redis.setNx).not.toHaveBeenCalled();
      expect(users.findByEmail).not.toHaveBeenCalled();
    });

    it('keeps nonce-free legacy tokens compatible but makes each token one-time-use', async () => {
      const redis = mockRedis();
      const { svc } = googleService(redis);
      (svc as any).googleClient = {
        verifyIdToken: jest.fn().mockResolvedValue(googleTicket()),
      };

      await expect(svc.signInWithGoogle('legacy-id-token'))
        .resolves.toEqual({ accessToken: 'access-token', refreshToken: 'refresh-token' });
      expect(redis.setNx).toHaveBeenCalledWith(
        expect.stringMatching(/^auth:google:token:/),
        '1',
        expect.any(Number),
      );
    });

    it('rejects replay of a nonce-free legacy token', async () => {
      const redis = mockRedis();
      redis.setNx.mockResolvedValue(false);
      const { svc } = googleService(redis);
      (svc as any).googleClient = {
        verifyIdToken: jest.fn().mockResolvedValue(googleTicket()),
      };

      await expect(svc.signInWithGoogle('replayed-legacy-id-token'))
        .rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('resolves returning Google users by immutable subject, not email', async () => {
      const { svc, prisma, users } = googleService();
      prisma.user.findUnique.mockResolvedValue({
        id: 'linked-user',
        email: 'old-address@example.com',
        googleSubject: 'google-user-1',
        emailVerifiedAt: new Date(),
      });
      (svc as any).googleClient = {
        verifyIdToken: jest.fn().mockResolvedValue(googleTicket(undefined, {
          email: 'new-address@example.com',
        })),
      };

      await expect(svc.signInWithGoogle('linked-id-token')).resolves.toBeDefined();
      expect(users.findByEmail).not.toHaveBeenCalled();
      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(prisma.user.updateMany).not.toHaveBeenCalled();
    });

    it('refuses to auto-link an existing account by non-authoritative email', async () => {
      const { svc, prisma, users } = googleService();
      users.findByEmail.mockResolvedValue({
        id: 'password-user', email: 'student@example.com', emailVerifiedAt: new Date(),
      });
      (svc as any).googleClient = {
        verifyIdToken: jest.fn().mockResolvedValue(googleTicket(undefined, {
          email: 'student@example.com',
        })),
      };

      await expect(svc.signInWithGoogle('external-email-token'))
        .rejects.toBeInstanceOf(ConflictException);
      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(prisma.user.updateMany).not.toHaveBeenCalled();
    });

    it('links an existing external-email account after current-password proof', async () => {
      const { svc, prisma, users } = googleService();
      users.findByEmail.mockResolvedValue({
        id: 'password-user',
        email: 'student@example.com',
        emailVerifiedAt: new Date(),
        passwordHash: await bcrypt.hash('current-password', 4),
      });
      (svc as any).googleClient = {
        verifyIdToken: jest.fn().mockResolvedValue(googleTicket(undefined, {
          email: 'student@example.com',
        })),
      };

      await expect(svc.signInWithGoogle('external-link-token', {
        linkPassword: 'current-password',
      })).resolves.toBeDefined();
      expect(prisma.user.updateMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: 'password-user', googleSubject: null },
        data: expect.objectContaining({ googleSubject: 'google-user-1' }),
      }));
      const linkedPasswordHash = prisma.user.updateMany.mock.calls[0][0].data.passwordHash;
      await expect(bcrypt.compare('current-password', linkedPasswordHash)).resolves.toBe(true);
      expect(prisma.passwordResetToken.deleteMany)
        .toHaveBeenCalledWith({ where: { userId: 'password-user' } });
      expect(prisma.emailVerificationToken.deleteMany)
        .toHaveBeenCalledWith({ where: { userId: 'password-user' } });
    });

    it('allows an authoritative Workspace email to link once', async () => {
      const { svc, prisma, users } = googleService();
      users.findByEmail.mockResolvedValue({
        id: 'workspace-user',
        email: 'student@school.edu',
        emailVerifiedAt: null,
        passwordHash: await bcrypt.hash('old-workspace-password', 4),
      });
      (svc as any).googleClient = {
        verifyIdToken: jest.fn().mockResolvedValue(googleTicket(undefined, {
          email: 'student@school.edu',
          hd: 'school.edu',
        })),
      };

      await expect(svc.signInWithGoogle('workspace-token')).resolves.toBeDefined();
      expect(prisma.user.updateMany).toHaveBeenCalledWith({
        where: { id: 'workspace-user', googleSubject: null },
        data: {
          googleSubject: 'google-user-1',
          emailVerifiedAt: expect.any(Date),
          passwordHash: expect.any(String),
        },
      });
      const securedPasswordHash = prisma.user.updateMany.mock.calls[0][0].data.passwordHash;
      await expect(bcrypt.compare('old-workspace-password', securedPasswordHash))
        .resolves.toBe(false);
      expect(prisma.passwordResetToken.deleteMany)
        .toHaveBeenCalledWith({ where: { userId: 'workspace-user' } });
      expect(prisma.emailVerificationToken.deleteMany)
        .toHaveBeenCalledWith({ where: { userId: 'workspace-user' } });
    });

    it('does not revoke recovery tokens when another first-link wins the race', async () => {
      const { svc, prisma, users } = googleService();
      users.findByEmail.mockResolvedValue({
        id: 'workspace-user', email: 'student@school.edu', emailVerifiedAt: new Date(),
      });
      prisma.user.updateMany.mockResolvedValue({ count: 0 });
      prisma.user.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      (svc as any).googleClient = {
        verifyIdToken: jest.fn().mockResolvedValue(googleTicket(undefined, {
          email: 'student@school.edu',
          hd: 'school.edu',
        })),
      };

      await expect(svc.signInWithGoogle('workspace-race-token'))
        .rejects.toBeInstanceOf(ConflictException);
      expect(prisma.passwordResetToken.deleteMany).not.toHaveBeenCalled();
      expect(prisma.emailVerificationToken.deleteMany).not.toHaveBeenCalled();
    });

    it('never replaces a different Google subject already linked to the email', async () => {
      const { svc, prisma, users } = googleService();
      users.findByEmail.mockResolvedValue({
        id: 'existing-user',
        email: 'student@gmail.com',
        emailVerifiedAt: new Date(),
        googleSubject: 'original-google-subject',
      });
      (svc as any).googleClient = {
        verifyIdToken: jest.fn().mockResolvedValue(googleTicket()),
      };

      await expect(svc.signInWithGoogle('replacement-attempt-token'))
        .rejects.toBeInstanceOf(ConflictException);
      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(prisma.user.updateMany).not.toHaveBeenCalled();
    });

    it('creates a new external-email Google identity without mailbox verification', async () => {
      const { svc, users } = googleService();
      users.findByEmail.mockResolvedValue(null);
      users.create.mockImplementation(async (data: any) => ({ id: 'new-google-user', ...data }));
      (svc as any).googleClient = {
        verifyIdToken: jest.fn().mockResolvedValue(googleTicket(undefined, {
          email: 'new-user@example.com',
        })),
      };

      await expect(svc.signInWithGoogle('new-external-token')).resolves.toBeDefined();
      expect(users.create).toHaveBeenCalledWith(expect.objectContaining({
        email: 'new-user@example.com',
        googleSubject: 'google-user-1',
        emailVerifiedAt: null,
      }));
    });

    it('updates an authoritative changed Workspace email and revokes old mailbox tokens', async () => {
      const { svc, prisma, users } = googleService();
      prisma.user.findUnique.mockResolvedValue({
        id: 'workspace-linked',
        email: 'old@school.edu',
        googleSubject: 'google-user-1',
        emailVerifiedAt: new Date(),
      });
      prisma.user.update.mockResolvedValue({
        id: 'workspace-linked',
        email: 'new@school.edu',
        googleSubject: 'google-user-1',
        emailVerifiedAt: new Date(),
      });
      users.findByEmail.mockResolvedValue(null);
      (svc as any).googleClient = {
        verifyIdToken: jest.fn().mockResolvedValue(googleTicket(undefined, {
          email: 'new@school.edu',
          hd: 'school.edu',
        })),
      };

      await expect(svc.signInWithGoogle('workspace-email-change-token')).resolves.toBeDefined();
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'workspace-linked', googleSubject: 'google-user-1' },
        data: { email: 'new@school.edu', emailVerifiedAt: expect.any(Date) },
      });
      expect(prisma.passwordResetToken.deleteMany)
        .toHaveBeenCalledWith({ where: { userId: 'workspace-linked' } });
      expect(prisma.emailVerificationToken.deleteMany)
        .toHaveBeenCalledWith({ where: { userId: 'workspace-linked' } });
    });
  });

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

    it('does not send recovery mail to a reassignable Google-linked address', async () => {
      const users = mockUsers();
      users.findByEmail.mockResolvedValue({
        id: 'u-workspace',
        email: 'student@school.edu',
        googleSubject: 'google-subject',
        deletedAt: null,
      });
      const mail = mockMail();
      const prisma = mockPrisma();
      const { svc } = build({ users, mail, prisma });

      await expect(svc.forgotPassword('student@school.edu')).resolves.toEqual({ ok: true });
      expect(prisma.passwordResetToken.create).not.toHaveBeenCalled();
      expect(mail.sendPasswordResetEmail).not.toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('rejects and consumes a late token after a reassignable Google account is linked', async () => {
      const prisma = mockPrisma();
      prisma.passwordResetToken.findUnique.mockResolvedValue({
        id: 'late-token',
        userId: 'u-workspace',
        usedAt: null,
        expiresAt: new Date(Date.now() + 60_000),
      });
      // The guarded user update sees googleSubject != null and a non-Gmail
      // address, so it affects zero rows.
      prisma.user.updateMany.mockResolvedValue({ count: 0 });
      const events = mockSecurityEvents();
      const { svc } = build({ prisma, events });

      await expect(svc.resetPassword('late-raw-token', 'new-password-123'))
        .rejects.toBeInstanceOf(BadRequestException);
      expect(prisma.user.updateMany).toHaveBeenCalledWith({
        where: {
          id: 'u-workspace',
          deletedAt: null,
          OR: [
            { googleSubject: null },
            { email: { endsWith: '@gmail.com' } },
          ],
        },
        data: { passwordHash: expect.any(String) },
      });
      expect(prisma.passwordResetToken.deleteMany)
        .toHaveBeenCalledWith({ where: { id: 'late-token' } });
      expect(events.record).not.toHaveBeenCalledWith(
        'PASSWORD_RESET_SUCCESS',
        expect.anything(),
      );
    });

    it('atomically changes the password and claims an eligible token once', async () => {
      const prisma = mockPrisma();
      prisma.passwordResetToken.findUnique.mockResolvedValue({
        id: 'valid-token',
        userId: 'u-local',
        usedAt: null,
        expiresAt: new Date(Date.now() + 60_000),
      });
      prisma.user.updateMany.mockResolvedValue({ count: 1 });
      prisma.passwordResetToken.updateMany.mockResolvedValue({ count: 1 });
      const { svc } = build({ prisma });

      await expect(svc.resetPassword('valid-raw-token', 'new-password-123'))
        .resolves.toEqual({ ok: true });
      expect(prisma.passwordResetToken.updateMany).toHaveBeenCalledWith({
        where: {
          id: 'valid-token',
          usedAt: null,
          expiresAt: { gt: expect.any(Date) },
        },
        data: { usedAt: expect.any(Date) },
      });
    });
  });

  // HIGH-1 (security): a social identity must NOT link into an existing local
  // account unless the provider asserts the email is verified — else an
  // attacker's Kakao/Naver identity claiming victim@x could take over the
  // victim's password account.
  describe('signInWithSocial account-linking safety', () => {
    it('does NOT link an UNVERIFIED social email to an existing account (creates a namespaced account)', async () => {
      const users = mockUsers();
      users.findByEmail.mockImplementation((e: string) =>
        e === 'victim@x.com' ? { id: 'victim', emailVerifiedAt: new Date() } : null);
      users.create.mockResolvedValue({ id: 'social-new' });
      const jwt = mockJwt(); jwt.sign.mockImplementation((p: any) => `t-${p?.sub}`);
      const social = {
        isMock: jest.fn(), providerName: jest.fn(),
        verify: jest.fn().mockResolvedValue({ provider: 'kakao', providerUserId: 'kk9', email: 'victim@x.com', emailVerified: false, name: 'x' }),
      };
      const { svc } = build({ users, jwt, social });
      await svc.signInWithSocial('kakao', 'tok');
      // must mint a provider-namespaced account, never return the victim's
      expect(users.create).toHaveBeenCalledWith(expect.objectContaining({ email: 'kakao_kk9@users.matheo.local' }));
    });

    it('DOES link a VERIFIED social email to an existing account (no new account)', async () => {
      const users = mockUsers();
      users.findByEmail.mockImplementation((e: string) =>
        e === 'v@x.com' ? { id: 'v', emailVerifiedAt: new Date() } : null);
      const jwt = mockJwt(); jwt.sign.mockImplementation((p: any) => `t-${p?.sub}`);
      const social = {
        isMock: jest.fn(), providerName: jest.fn(),
        verify: jest.fn().mockResolvedValue({ provider: 'kakao', providerUserId: 'kk1', email: 'v@x.com', emailVerified: true, name: 'x' }),
      };
      const { svc } = build({ users, jwt, social });
      await svc.signInWithSocial('kakao', 'tok');
      expect(users.create).not.toHaveBeenCalled();
    });
  });
});
