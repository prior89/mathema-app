import { Injectable, UnauthorizedException, BadRequestException, Logger, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomBytes, createHash, randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RedisService } from '../../infrastructure/redis/redis.service';
import { MailService } from '../../infrastructure/mail/mail.service';
import { PrivacyService } from '../privacy/privacy.service';
import { BCRYPT_COST } from '../../common/utils/auth-constants';
import { assertPasswordNotBreached } from '../../common/utils/password-breach';
import {
  assertNotLocked,
  recordFailedLogin,
  clearLoginFailures,
} from '../../common/utils/login-lockout';
import { SecurityEventService } from './security-event.service';
import { AuthDeviceService } from './auth-device.service';
import { ParentLinksService } from '../parent-links/parent-links.service';
import { GuardianConsentService } from '../guardian-consent/guardian-consent.service';
import { UserRole } from '@prisma/client';
import { COUNTRY_CONFIG, CountryCode } from '../../common/enums/country.enum';

const RESET_TOKEN_TTL_MIN = 30;
const VERIFY_TOKEN_TTL_HOURS = 24;
const REFRESH_REVOKE_NAMESPACE = 'jwt:refresh:revoked:';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  // 단일 OAuth2 클라이언트 — verifyIdToken 만 사용 (서명 검증 + audience 검증).
  private googleClient: OAuth2Client | null = null;

  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly mail: MailService,
    private readonly privacy: PrivacyService,
    private readonly events: SecurityEventService,
    private readonly devices: AuthDeviceService,
    @Inject(forwardRef(() => ParentLinksService))
    private readonly parentLinks: ParentLinksService,
    private readonly guardianConsent: GuardianConsentService,
  ) {
    const cid = this.config.get<string>('GOOGLE_CLIENT_ID');
    if (cid && cid !== 'api입력칸') this.googleClient = new OAuth2Client(cid);
  }

  async register(dto: RegisterDto, ctx: { ip?: string; ua?: string; deviceHash?: string } = {}) {
    const email = dto.email.trim().toLowerCase();
    const childEmail = dto.childEmail?.trim().toLowerCase();
    const exists = await this.users.findByEmail(email);
    if (exists) throw new UnauthorizedException('email already used');

    const role = dto.role ?? 'STUDENT';

    // ── Market gate: the DTO whitelists every compiled CountryCode, but only
    // 'live'/'beta' markets have curriculum + locale wired. Reject 'planned'
    // countries (US/UK/AU/SG/ID) server-side so a crafted register payload
    // can't create a user who lands on an empty/English-fallback experience —
    // the onboarding chip UI already hides these, this closes the API path. ──
    const resolvedCountry = (dto.country ?? 'IN') as CountryCode;
    if (COUNTRY_CONFIG[resolvedCountry]?.status === 'planned') {
      throw new BadRequestException(
        `Sign-up for ${COUNTRY_CONFIG[resolvedCountry].name} is not available yet`,
      );
    }

    // ── PARENT: 자녀 이메일로 초대 요청 (즉시 연결 금지 — 학생 승인 필요) ──
    let pendingChildUserId: string | null = null;
    if (role === 'PARENT') {
      if (!childEmail) {
        throw new BadRequestException('childEmail required for PARENT role');
      }
      const child = await this.users.findByEmail(childEmail);
      if (!child || child.role !== UserRole.STUDENT) {
        throw new BadRequestException('child account not found — student must register first');
      }
      pendingChildUserId = child.id;
    }

    // ── TEACHER: tenantCode 매칭. 없으면 solo 교사 (tenantId null). ─
    let tenantId: string | null = null;
    if (role === 'TEACHER' && dto.tenantCode) {
      const tenant = await this.prisma.tenant.findUnique({ where: { code: dto.tenantCode } });
      if (!tenant) throw new BadRequestException('invalid tenant code');
      tenantId = tenant.id;
    }

    // ── STUDENT 만 examDate/targetGrade/gradeLevel 의미 ──────────
    const isStudent = role === 'STUDENT';
    const examDate = isStudent && dto.examDate ? new Date(dto.examDate) : new Date('2027-02-14'); // 인도 기본 board exam 날짜
    const targetGrade = isStudent ? (dto.targetGrade ?? 3) : 1; // 학부모/교사는 N/A 라 1
    const gradeLevel = isStudent ? dto.gradeLevel : undefined;
    const studyGoal = isStudent ? dto.studyGoal : undefined;

    // SEC-2 breach check before bcrypt (faster reject on bad password).
    await assertPasswordNotBreached(dto.password);
    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_COST);
    const user = await this.users.create({
      email,
      passwordHash,
      name: dto.name,
      role,
      examDate,
      targetGrade,
      // Country from onboarding country chip. Prisma default is IN so an
      // omitted value still lands on India behaviour — KR sign-ups must
      // explicitly send country: 'KR' for curriculum branching to fire.
      country: (dto.country ?? 'IN') as any,
      // Onboarding may create the account before the class picker runs.
      // Write an explicit null instead of letting Prisma's legacy CLASS_12
      // default leak into diagnostics and ProtectedRoute decisions.
      ...(isStudent ? { gradeLevel: gradeLevel ?? null } : {}),
      ...(isStudent && dto.birthDate ? { birthDate: new Date(dto.birthDate) } : {}),
      ...(studyGoal ? { studyGoal } : {}),
      ...(tenantId ? { tenantId } : {}),
    });

    if (role === 'PARENT' && pendingChildUserId) {
      await this.parentLinks.requestLink({
        parentUserId: user.id,
        childUserId: pendingChildUserId,
        parentName: dto.name,
        childEmail: childEmail!,
        ip: ctx.ip,
        ua: ctx.ua,
      });
    }

    // DPDP/GDPR — 가입 시 필수 동의(DATA_PROCESSING) + 선택 동의(가입 폼에서 보낸 값)
    await this.privacy.grantInitial(user.id, {
      analytics:  dto.consentAnalytics  === true,
      marketing:  dto.consentMarketing  === true,
      aiTraining: dto.consentAiTraining === true,
      ipAddress: ctx.ip,
      userAgent: ctx.ua,
    });

    let guardianConsentPending = false;
    if (role === 'STUDENT' && dto.birthDate) {
      const gc = await this.guardianConsent.ensurePendingForStudent({
        studentUserId: user.id,
        country: (dto.country ?? 'IN') as any,
        ip: ctx.ip,
        ua: ctx.ua,
      });
      guardianConsentPending = !!gc.required && !gc.verified;
      if (guardianConsentPending && dto.parentEmail) {
        await this.guardianConsent.requestParentVerification(
          user.id,
          {
            parentName: dto.parentName ?? 'Parent/guardian',
            parentEmail: dto.parentEmail,
            parentPhone: dto.parentPhone,
          },
          { ip: ctx.ip, ua: ctx.ua },
        );
      }
    }

    // 가입 직후 이메일 검증 토큰 발급 — 실패해도 가입은 진행 (fire-and-forget).
    this.issueVerificationToken(user.id, user.email).catch((e) =>
      this.logger.error(`verification token issue failed: ${e?.message}`),
    );
    // DEV-3: bind the registering device immediately so the user is
    // single-session from the very first token issuance.
    await this.bindAndDisplace({
      userId: user.id,
      deviceHash: ctx.deviceHash,
      ip: ctx.ip, ua: ctx.ua,
    });
    const tokens = this.issueTokens(user.id, ctx.deviceHash);
    if (role === 'PARENT' && pendingChildUserId) {
      return { ...tokens, parentLinkPending: true };
    }
    if (guardianConsentPending) {
      return { ...tokens, guardianConsentPending: true };
    }
    return tokens;
  }

  async login(
    dto: LoginDto,
    ctx: { ip?: string; ua?: string; deviceHash?: string } = {},
  ) {
    const ip = ctx.ip ?? '';
    const email = dto.email.trim().toLowerCase();
    // SEC-3 lockout: check before any DB / bcrypt work so a locked client
    // can't be used as a CPU-burn vector.
    await assertNotLocked(this.redis, ip, email);
    const user = await this.users.findByEmail(email);
    const ok = user
      && !(user as any).deletedAt
      && await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) {
      await recordFailedLogin(this.redis, ip, email);
      this.events.record('LOGIN_FAIL' as any, {
        userId: user?.id ?? null,
        ip, userAgent: ctx.ua, metadata: { email },
      });
      throw new UnauthorizedException('invalid credentials');
    }
    await clearLoginFailures(this.redis, ip, email);
    // DEV-3/5: bind this device, displace every other.
    await this.bindAndDisplace({
      userId: user!.id,
      deviceHash: ctx.deviceHash,
      ip, ua: ctx.ua,
    });
    this.events.record('LOGIN_SUCCESS' as any, {
      userId: user!.id, ip, userAgent: ctx.ua,
    });
    return this.issueTokens(user!.id, ctx.deviceHash);
  }

  /**
   * PoC dev login — admin/admin (any creds accepted) → admin@mathema.app token.
   *
   * The earlier guard rejected only NODE_ENV === 'production', so any
   * environment with NODE_ENV unset / 'development' / 'staging' (the common
   * default on QA boxes) silently handed out admin tokens to anyone hitting
   * the endpoint. Now requires BOTH NODE_ENV === 'development' AND an explicit
   * ENABLE_DEV_LOGIN=true env flag — staging must opt in deliberately.
   */
  async devLogin(ctx: { ip?: string; ua?: string; deviceHash?: string } = {}) {
    const isDev = process.env.NODE_ENV === 'development';
    const optIn = process.env.ENABLE_DEV_LOGIN === 'true';
    if (!isDev || !optIn) {
      throw new UnauthorizedException('dev-login disabled in this environment');
    }
    const email = 'admin@mathema.app';
    let user = await this.users.findByEmail(email);
    if (!user) {
      user = await this.users.create({
        email,
        passwordHash: await bcrypt.hash('admin1234', BCRYPT_COST),
        name: 'Aarav Sharma',
        examDate: new Date('2027-02-14'),
        targetGrade: 1,
        country: 'IN' as any,
        gradeLevel: 'CLASS_11' as any,
        role: 'STUDENT' as any,
        emailVerifiedAt: new Date(),
      });
    } else if (!(user as any).emailVerifiedAt) {
      // Dev-login is a local/internal shortcut. If it lands on the email
      // verification wall, developers and internal testers cannot reach the
      // app to validate flows. Production cannot call this branch because
      // devLogin is gated by NODE_ENV=development + ENABLE_DEV_LOGIN=true.
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { emailVerifiedAt: new Date() },
      }) as any;
    }
    // DPDP 컴플라이언스 — DATA_PROCESSING 이 아직 활성 아니면 부여 (idempotent).
    // 선택 동의(ANALYTICS/AI_TRAINING/MARKETING)는 온보딩 08 화면에서 별도 grant.
    const verifiedUser = user!;
    const hasDP = await this.privacy.isActive(verifiedUser.id, 'DATA_PROCESSING' as any);
    if (!hasDP) {
      await this.privacy.grant(verifiedUser.id, 'DATA_PROCESSING' as any, { ip: ctx.ip, ua: ctx.ua });
    }
    await this.bindAndDisplace({
      userId: verifiedUser.id, deviceHash: ctx.deviceHash, ip: ctx.ip, ua: ctx.ua,
    });
    return this.issueTokens(verifiedUser.id, ctx.deviceHash);
  }

  async refresh(token: string, requestDeviceHash?: string) {
    let payload: any;
    try {
      payload = await this.jwt.verifyAsync(token, {
        secret: this.config.get<string>('jwt.refreshSecret'),
      });
    } catch {
      throw new UnauthorizedException('invalid refresh token');
    }
    if (payload?.type !== 'refresh' || !payload?.jti) {
      throw new UnauthorizedException('invalid refresh token');
    }
    // Redis blacklist 확인 — 폐기된 jti 이면 거부.
    if (await this.redis.exists(`${REFRESH_REVOKE_NAMESPACE}${payload.jti}`)) {
      throw new UnauthorizedException('refresh token revoked');
    }
    // DEV-6 device-displacement check. The token carries dh=<deviceHash>
    // claim from when it was minted; the client also sends X-Device-Hash on
    // every request. If a different device tries to use this token (token
    // theft, paste, browser copy) the two will not match -> refuse. If the
    // token is from a device that's since been displaced (another login on
    // a different device deleted this AuthDevice row) isBound returns false.
    if (payload.dh) {
      if (requestDeviceHash && requestDeviceHash !== payload.dh) {
        throw new UnauthorizedException({
          message: 'Refresh token belongs to a different device.',
          code: 'device_mismatch',
        });
      }
      const bound = await this.devices.isBound(payload.sub, payload.dh);
      if (!bound) {
        throw new UnauthorizedException({
          message: 'This session was logged out by a newer device login.',
          code: 'device_displaced',
        });
      }
    }
    // Rotation: 사용한 refresh 는 즉시 blacklist (TTL은 원본 만료까지).
    const now = Math.floor(Date.now() / 1000);
    const remainSec = Math.max(60, (payload.exp ?? now) - now);
    await this.redis.set(`${REFRESH_REVOKE_NAMESPACE}${payload.jti}`, '1', remainSec);
    return this.issueTokens(payload.sub, payload.dh);
  }

  async logout(token: string) {
    if (!token) return { ok: true };
    try {
      const payload: any = this.jwt.decode(token);
      if (payload?.jti && payload?.exp) {
        const now = Math.floor(Date.now() / 1000);
        const ttl = Math.max(60, payload.exp - now);
        await this.redis.set(`${REFRESH_REVOKE_NAMESPACE}${payload.jti}`, '1', ttl);
      }
    } catch {
      // 잘못된 토큰이어도 로그아웃은 멱등 처리.
    }
    return { ok: true };
  }

  /**
   * Google ID Token 검증 후 user find-or-create.
   */
  async signInWithGoogle(idToken: string, ctx: { ip?: string; ua?: string; deviceHash?: string } = {}) {
    if (!this.googleClient) {
      throw new UnauthorizedException('Google sign-in not configured (GOOGLE_CLIENT_ID missing)');
    }
    let payload: any;
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.config.get<string>('GOOGLE_CLIENT_ID')!,
      });
      payload = ticket.getPayload();
    } catch {
      throw new UnauthorizedException('invalid Google ID token');
    }
    if (!payload?.email || !payload.email_verified) {
      throw new UnauthorizedException('email not verified by Google');
    }

    const email = payload.email.toLowerCase();
    const name = payload.name ?? payload.given_name ?? email.split('@')[0];
    let user = await this.users.findByEmail(email);
    if (!user) {
      const placeholderExam = new Date();
      placeholderExam.setFullYear(placeholderExam.getFullYear() + 1);
      // gradeLevel intentionally left null. ProtectedRoute on the frontend
      // routes any logged-in user with gradeLevel===null to /onboarding, where
      // the NCERT class picker (Class 7-12) is presented. Hard-coding CLASS_11
      // here used to give every Google sign-up the wrong-class curriculum.
      user = await this.users.create({
        email,
        passwordHash: await bcrypt.hash(`google:${payload.sub}:${Date.now()}`, BCRYPT_COST),
        name,
        examDate: placeholderExam,
        targetGrade: 1,
        country: 'IN' as any,
        emailVerifiedAt: new Date(),
      });
    } else if (!(user as any).emailVerifiedAt) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { emailVerifiedAt: new Date() },
      }) as any;
    }
    const verifiedUser = user!;
    await this.bindAndDisplace({
      userId: verifiedUser.id, deviceHash: ctx.deviceHash, ip: ctx.ip, ua: ctx.ua,
    });
    return this.issueTokens(verifiedUser.id, ctx.deviceHash);
  }

  // ---------- Guest (try-first) ----------

  /**
   * Try-first guest account — zero-PII by construction: synthetic email,
   * placeholder name, no birthDate. With no personal data collected, the
   * DPDP/PIPA guardian-consent gates are inapplicable (JwtAuthGuard exempts
   * isGuest users), and emailVerifiedAt is stamped so the email gate passes.
   *
   * Device reuse: if this deviceHash already owns a live guest account,
   * re-issue tokens for it instead of minting a new user — otherwise the
   * free-tier daily quota could be farmed by restarting the app.
   */
  async guestStart(
    dto: { country?: string; gradeLevel?: string } = {},
    ctx: { ip?: string; ua?: string; deviceHash?: string } = {},
  ) {
    if (ctx.deviceHash) {
      const bound = await (this.prisma as any).authDevice.findFirst({
        where: { deviceHash: ctx.deviceHash },
        orderBy: { lastSeenAt: 'desc' },
        select: { userId: true },
      });
      if (bound) {
        const existing = await this.prisma.user.findUnique({
          where: { id: bound.userId },
          select: { id: true, isGuest: true, deletedAt: true },
        });
        if (existing && (existing as any).isGuest && !existing.deletedAt) {
          await this.bindAndDisplace({
            userId: existing.id, deviceHash: ctx.deviceHash, ip: ctx.ip, ua: ctx.ua,
          });
          return { ...this.issueTokens(existing.id, ctx.deviceHash), isGuest: true };
        }
      }
    }

    const user = await this.users.create({
      email: `guest-${randomUUID()}@guest.matheo.invalid`,
      // Random unguessable hash — guests cannot password-login; they either
      // hold a valid token or upgrade to a real account.
      passwordHash: await bcrypt.hash(randomBytes(32).toString('hex'), BCRYPT_COST),
      name: 'Guest',
      role: 'STUDENT' as any,
      examDate: new Date('2027-02-14'),
      targetGrade: 3,
      country: (dto.country ?? 'IN') as any,
      gradeLevel: (dto.gradeLevel ?? null) as any,
      emailVerifiedAt: new Date(),
      isGuest: true,
    });
    await this.privacy.grantInitial(user.id, {
      analytics: false, marketing: false, aiTraining: false,
      ipAddress: ctx.ip, userAgent: ctx.ua,
    });
    this.events.record('LOGIN_SUCCESS' as any, {
      userId: user.id, ip: ctx.ip, userAgent: ctx.ua, metadata: { guest: true },
    });
    await this.bindAndDisplace({
      userId: user.id, deviceHash: ctx.deviceHash, ip: ctx.ip, ua: ctx.ua,
    });
    return { ...this.issueTokens(user.id, ctx.deviceHash), isGuest: true };
  }

  /**
   * Guest → real account, in place (same userId, so all progress rows stay).
   * Re-enters the standard funnel: emailVerifiedAt is reset so the email
   * verification gate applies, and a guardian-consent flow starts if a minor
   * birthDate is provided. The current JWT stays valid (payload is {sub}).
   */
  async guestUpgrade(
    userId: string,
    dto: {
      email: string;
      password: string;
      name: string;
      gradeLevel?: string;
      birthDate?: string;
      country?: string;
      parentName?: string;
      parentEmail?: string;
      parentPhone?: string;
      consentAnalytics?: boolean;
      consentMarketing?: boolean;
      consentAiTraining?: boolean;
    },
    ctx: { ip?: string; ua?: string } = {},
  ) {
    const me = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, isGuest: true, deletedAt: true, country: true },
    });
    if (!me || me.deletedAt) throw new UnauthorizedException('User not found');
    if (!(me as any).isGuest) throw new BadRequestException('account is not a guest');

    const email = dto.email.trim().toLowerCase();
    const exists = await this.users.findByEmail(email);
    if (exists) throw new BadRequestException('email already used');

    await assertPasswordNotBreached(dto.password);
    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_COST);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        email,
        passwordHash,
        name: dto.name,
        isGuest: false,
        // Real email is unproven — back into the verification funnel.
        emailVerifiedAt: null,
        ...(dto.gradeLevel ? { gradeLevel: dto.gradeLevel as any } : {}),
        ...(dto.birthDate ? { birthDate: new Date(dto.birthDate) } : {}),
        ...(dto.country ? { country: dto.country as any } : {}),
      },
    });

    // grant() is idempotent; grantInitial would duplicate the DATA_PROCESSING
    // row the guest already received at guestStart.
    if (dto.consentAnalytics)  await this.privacy.grant(userId, 'ANALYTICS' as any, { ip: ctx.ip, ua: ctx.ua });
    if (dto.consentMarketing)  await this.privacy.grant(userId, 'MARKETING' as any, { ip: ctx.ip, ua: ctx.ua });
    if (dto.consentAiTraining) await this.privacy.grant(userId, 'AI_TRAINING' as any, { ip: ctx.ip, ua: ctx.ua });

    let guardianConsentPending = false;
    if (dto.birthDate) {
      const gc = await this.guardianConsent.ensurePendingForStudent({
        studentUserId: userId,
        country: (dto.country ?? me.country ?? 'IN') as any,
        ip: ctx.ip,
        ua: ctx.ua,
      });
      guardianConsentPending = !!gc.required && !gc.verified;
      if (guardianConsentPending && dto.parentEmail) {
        await this.guardianConsent.requestParentVerification(
          userId,
          {
            parentName: dto.parentName ?? 'Parent/guardian',
            parentEmail: dto.parentEmail,
            parentPhone: dto.parentPhone,
          },
          { ip: ctx.ip, ua: ctx.ua },
        );
      }
    }

    this.issueVerificationToken(userId, email).catch((e) =>
      this.logger.error(`verification token issue failed: ${e?.message}`),
    );
    this.events.record('LOGIN_SUCCESS' as any, {
      userId, ip: ctx.ip, userAgent: ctx.ua, metadata: { guestUpgrade: true },
    });
    return { ok: true, guardianConsentPending };
  }

  // ---------- 비밀번호 재설정 ----------

  /**
   * forgot — email이 존재하든 안 하든 항상 같은 응답을 돌려서
   * 가입 여부 정보 누출(enumeration) 차단.
   */
  async forgotPassword(email: string, requestIp?: string) {
    const user = await this.users.findByEmail(email.trim().toLowerCase());
    if (user && !(user as any).deletedAt) {
      const raw = randomBytes(32).toString('hex');
      const tokenHash = createHash('sha256').update(raw).digest('hex');
      const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MIN * 60 * 1000);
      await (this.prisma as any).passwordResetToken.create({
        data: { userId: user.id, tokenHash, expiresAt, requestIp },
      });
      await this.mail.sendPasswordResetEmail(user.email, raw);
    }
    return { ok: true };
  }

  async resetPassword(rawToken: string, newPassword: string) {
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    const rec = await (this.prisma as any).passwordResetToken.findUnique({ where: { tokenHash } });
    if (!rec || rec.usedAt || rec.expiresAt < new Date()) {
      throw new BadRequestException('invalid or expired token');
    }
    await assertPasswordNotBreached(newPassword);
    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_COST);
    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: rec.userId }, data: { passwordHash } }),
      (this.prisma as any).passwordResetToken.update({
        where: { id: rec.id },
        data: { usedAt: new Date() },
      }),
    ]);
    this.events.record('PASSWORD_RESET_SUCCESS' as any, { userId: rec.userId });
    return { ok: true };
  }

  // ---------- 이메일 검증 ----------

  private async issueVerificationToken(userId: string, email: string): Promise<void> {
    const raw = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(raw).digest('hex');
    const expiresAt = new Date(Date.now() + VERIFY_TOKEN_TTL_HOURS * 3600 * 1000);
    await (this.prisma as any).emailVerificationToken.create({
      data: { userId, email, tokenHash, expiresAt },
    });
    await this.mail.sendEmailVerification(email, raw);
  }

  async resendVerification(userId: string) {
    const u = await this.users.findOne(userId);
    if (!u) throw new UnauthorizedException('User not found');
    await this.issueVerificationToken(u.id, u.email);
    return { ok: true };
  }

  async verifyEmail(rawToken: string) {
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    const rec = await (this.prisma as any).emailVerificationToken.findUnique({ where: { tokenHash } });
    if (!rec || rec.usedAt || rec.expiresAt < new Date()) {
      throw new BadRequestException('invalid or expired token');
    }
    // P2-1 -- mark the user as verified in the same transaction as token
    // consumption so partial failure can't leave them claimed-but-not-stamped.
    await this.prisma.$transaction([
      (this.prisma as any).emailVerificationToken.update({
        where: { id: rec.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.user.update({
        where: { id: rec.userId },
        data: { emailVerifiedAt: new Date() },
      }),
    ]);
    this.logger.log(`Email verified: ${rec.email}`);
    return { ok: true, email: rec.email };
  }

  // ---------- 토큰 발급 ----------

  private issueTokens(userId: string, deviceHash?: string) {
    const jti = randomUUID();
    // DEV-6: include the deviceHash claim so /auth/refresh + JWT guards can
    // bind the token to the device that minted it. Tokens forwarded to a
    // different device (cookie steal, paste) cannot be refreshed there.
    const accessToken = this.jwt.sign(
      { sub: userId, ...(deviceHash ? { dh: deviceHash } : {}) },
      {
        secret: this.config.get<string>('jwt.accessSecret'),
        expiresIn: this.config.get<string>('jwt.accessTtl'),
      },
    );
    const refreshToken = this.jwt.sign(
      { sub: userId, type: 'refresh', jti, ...(deviceHash ? { dh: deviceHash } : {}) },
      {
        secret: this.config.get<string>('jwt.refreshSecret'),
        expiresIn: this.config.get<string>('jwt.refreshTtl'),
      },
    );
    return { accessToken, refreshToken };
  }

  /**
   * DEV-3/5 -- bind the (user, device) pair and displace every other device.
   * The deletion of other AuthDevice rows is what actually displaces those
   * sessions: when the displaced client's refresh comes in, isBound() will
   * return false and we 401 it (see refresh()). Returns { isNewDevice } so
   * the caller can decide whether to log NEW_DEVICE_LOGIN.
   */
  private async bindAndDisplace(args: {
    userId: string;
    deviceHash?: string;
    deviceName?: string | null;
    ip?: string | null;
    ua?: string | null;
  }): Promise<{ isNewDevice: boolean; displaced: number }> {
    if (!args.deviceHash) return { isNewDevice: false, displaced: 0 };
    const { isNewDevice } = await this.devices.upsertOnLogin({
      userId: args.userId,
      deviceHash: args.deviceHash,
      deviceName: args.deviceName ?? args.ua ?? null,
      ip: args.ip ?? null,
    });
    const others = await this.devices.revokeOtherDevices(args.userId, args.deviceHash);
    if (isNewDevice && others.length > 0) {
      this.events.record('NEW_DEVICE_LOGIN' as any, {
        userId: args.userId,
        ip: args.ip,
        userAgent: args.ua,
        metadata: { displacedCount: others.length },
      });
      // DEV-4 -- best-effort anti-theft alert. Fire and forget so a stuck
      // mail provider does not slow down login.
      this.prisma.user.findUnique({
        where: { id: args.userId }, select: { email: true },
      }).then((u) => {
        if (u?.email) {
          this.mail.sendNewDeviceLoginAlert(u.email, { ip: args.ip, ua: args.ua }).catch(() => {});
        }
      }).catch(() => {});
    }
    return { isNewDevice, displaced: others.length };
  }
}
