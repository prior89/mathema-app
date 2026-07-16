import { Injectable, UnauthorizedException, BadRequestException, ConflictException, ServiceUnavailableException, Logger, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomBytes, createHash, createHmac, randomUUID, randomInt, timingSafeEqual } from 'crypto';
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
import { isKrUnder14SignupBlocked } from '../guardian-consent/guardian-consent.util';
import { UserRole } from '@prisma/client';
import { COUNTRY_CONFIG, CountryCode } from '../../common/enums/country.enum';
import { SocialProvider, SocialProviderService, SocialIdentity } from './social-provider.service';
import { OtpProviderService } from './otp-provider.service';

const RESET_TOKEN_TTL_MIN = 30;
const VERIFY_TOKEN_TTL_HOURS = 24;
const REFRESH_REVOKE_NAMESPACE = 'jwt:refresh:revoked:';
const GOOGLE_TOKEN_NAMESPACE = 'auth:google:token:';

// Phone-OTP hardening.
const OTP_CODE_TTL_SEC = 300;
const OTP_MAX_VERIFY_ATTEMPTS = 5;   // per issued code
const OTP_MAX_SENDS_PER_HOUR = 5;    // per phone
const OTP_PHONE_LOCK_FAILS = 10;     // persistent per-phone fail lock (survives re-send)
// Synthetic identifier namespaces — never accepted as a real signup email so a
// user can't squat a phone/social/guest identity address.
const RESERVED_EMAIL_DOMAINS = ['users.matheo.local', 'mock.local', 'guest.matheo.invalid'];

function isGoogleAuthoritativeForEmail(payload: { hd?: unknown }, email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  const hostedDomain = typeof payload.hd === 'string' ? payload.hd.trim().toLowerCase() : '';
  return domain === 'gmail.com' || (!!hostedDomain && hostedDomain === domain);
}

function isStableGmailAddress(email: string): boolean {
  return email.trim().toLowerCase().endsWith('@gmail.com');
}

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
    private readonly social: SocialProviderService,
    private readonly otp: OtpProviderService,
  ) {
    const cid = this.config.get<string>('GOOGLE_CLIENT_ID');
    if (cid && cid !== 'api입력칸') this.googleClient = new OAuth2Client(cid);
  }

  private assertMarketAvailable(rawCountry: string): CountryCode {
    const country = rawCountry as CountryCode;
    const market = COUNTRY_CONFIG[country];
    if (!market || market.status === 'planned') {
      throw new BadRequestException({
        code: 'country_unavailable',
        message: market
          ? `Sign-up for ${market.name} is not available yet`
          : 'This country curriculum is not available.',
      });
    }
    return country;
  }

  private assertGuestModeEnabled() {
    const pct = Number.parseInt(this.config.get<string>('FEATURE_GUEST_MODE_PCT') ?? '0', 10);
    // Pre-auth feature evaluation has no stable user bucket, so the public
    // flags service also treats guest mode as an explicit 0/100 kill switch.
    if (!Number.isFinite(pct) || pct < 100) {
      throw new BadRequestException({
        code: 'guest_mode_disabled',
        message: 'Guest mode is not available.',
      });
    }
  }

  async register(dto: RegisterDto, ctx: { ip?: string; ua?: string; deviceHash?: string } = {}) {
    const email = dto.email.trim().toLowerCase();
    // Structural isolation of the synthetic identity namespaces: reject them at
    // signup regardless of secret strength, so no one can pre-register a
    // phone_/kakao_/guest- address and hijack that identity later.
    if (RESERVED_EMAIL_DOMAINS.includes(email.split('@')[1] ?? '')) {
      throw new BadRequestException('this email domain is not allowed');
    }
    const childEmail = dto.childEmail?.trim().toLowerCase();
    const exists = await this.users.findByEmail(email);
    if (exists) throw new UnauthorizedException('email already used');

    const role = dto.role ?? 'STUDENT';

    // ── Market gate: the DTO whitelists every compiled CountryCode, but only
    // 'live'/'beta' markets have curriculum + locale wired. Reject 'planned'
    // countries (IN/AE/US/UK/AU/SG/ID at the KR-first launch) server-side so a
    // crafted register payload can't create a user who lands on an empty bank —
    // the onboarding chip UI already hides these, this closes the API path.
    // Default is 'KR' (the only live market) so an omitted country never hits
    // the reject branch. ──
    const resolvedCountry = this.assertMarketAvailable(dto.country ?? 'KR');

    // KR PIPA under-14 gate. Normally a no-op: under-14 KR onboards via the
    // decree-compliant email-OTP guardian rail (started after create). Only
    // fires when an operator opts into PASS-grade assurance (KR_UNDER14_REQUIRE
    // _PASS) that isn't live yet. 14+ and non-KR unaffected.
    const birthDateForGate = dto.birthDate ? new Date(dto.birthDate) : null;
    if (role === 'STUDENT' && isKrUnder14SignupBlocked(birthDateForGate, resolvedCountry)) {
      throw new BadRequestException({
        code: 'kr_under14_requires_pass',
        message: 'KR sign-up for under-14s currently requires guardian identity verification (PASS), which is being set up.',
      });
    }

    if (dto.consentAnalytics || dto.consentMarketing || dto.consentAiTraining) {
      // Run the deterministic consent guard before creating the user. The
      // post-create PrivacyService guard remains as defense in depth.
      this.privacy.assertOptionalConsentProfile({
        role,
        birthDate: birthDateForGate,
        country: resolvedCountry,
        isGuest: false,
      });
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
    let user: Awaited<ReturnType<typeof this.users.create>>;
    try {
      user = await this.users.create({
      email,
      passwordHash,
      name: dto.name,
      role,
      examDate,
      targetGrade,
      // Country from onboarding country chip. Default to 'KR' — the only live
      // market at the KR-first launch. (Prisma column default is still IN for
      // legacy rows; we write an explicit value so branching is unambiguous.)
      country: resolvedCountry as any,
      // Onboarding may create the account before the class picker runs.
      // Write an explicit null instead of letting Prisma's legacy CLASS_12
      // default leak into diagnostics and ProtectedRoute decisions.
      ...(isStudent ? { gradeLevel: gradeLevel ?? null } : {}),
      ...(isStudent && dto.birthDate ? { birthDate: new Date(dto.birthDate) } : {}),
      ...(studyGoal ? { studyGoal } : {}),
      ...(tenantId ? { tenantId } : {}),
      });
    } catch (e) {
      // A concurrent double-submit can slip past the findByEmail check above and
      // race into the unique(email) constraint. Convert the raw Prisma P2002
      // into the same clean "already used" signal instead of surfacing a 500.
      if ((e as { code?: string })?.code === 'P2002') {
        throw new UnauthorizedException('email already used');
      }
      throw e;
    }

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
        country: resolvedCountry as any,
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
        // KR-first: dev-login lands on the live market so local testing hits
        // the seeded KR curriculum instead of the empty India bank.
        country: 'KR' as any,
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
  async signInWithGoogle(
    idToken: string,
    ctx: {
      ip?: string;
      ua?: string;
      deviceHash?: string;
      nonce?: string;
      linkPassword?: string;
    } = {},
  ) {
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

    // Current GIS and native Credential Manager clients sign the request nonce
    // into the Google ID token. If either side supplies one, require both sides
    // to match so an attacker cannot bypass the check by stripping the API
    // field. Older app builds remain compatible through token-hash replay
    // protection below.
    if (ctx.nonce || payload?.nonce) {
      if (!ctx.nonce || typeof payload?.nonce !== 'string') {
        throw new UnauthorizedException('invalid Google sign-in nonce');
      }
      const requestNonce = Buffer.from(ctx.nonce, 'utf8');
      const tokenNonce = Buffer.from(payload.nonce, 'utf8');
      if (requestNonce.length !== tokenNonce.length || !timingSafeEqual(requestNonce, tokenNonce)) {
        throw new UnauthorizedException('invalid Google sign-in nonce');
      }
    }

    // The token, rather than the nonce, is the replay unit. GIS can issue more
    // than one token from a mounted button using the same nonce after a
    // recoverable backend failure; consuming the nonce would make a valid
    // retry fail. A token hash still makes every signed response one-time-use.
    const replayKey = GOOGLE_TOKEN_NAMESPACE
      + createHash('sha256').update(idToken).digest('base64url');
    const nowSec = Math.floor(Date.now() / 1000);
    const replayTtlSec = Math.max(60, Math.min(3_600, (payload.exp ?? nowSec + 600) - nowSec));
    let firstUse: boolean;
    try {
      firstUse = await this.redis.setNx(replayKey, '1', replayTtlSec);
    } catch {
      throw new ServiceUnavailableException('Google sign-in is temporarily unavailable');
    }
    if (!firstUse) {
      throw new UnauthorizedException('Google ID token was already used');
    }
    if (!payload?.sub || !payload?.email || !payload.email_verified) {
      throw new UnauthorizedException('email not verified by Google');
    }

    const email = payload.email.toLowerCase();
    const name = payload.name ?? payload.given_name ?? email.split('@')[0];
    const authoritativeEmail = isGoogleAuthoritativeForEmail(payload, email);

    // Google's immutable `sub` is the account key. Email is consulted only
    // for the initial link, and only Gmail / hosted-domain email is considered
    // authoritative enough to merge into an existing password account.
    let user = await this.prisma.user.findUnique({
      where: { googleSubject: payload.sub },
    });
    if ((user as any)?.deletedAt) {
      throw new UnauthorizedException('Account deactivated');
    }

    if (user && user.email !== email && authoritativeEmail) {
      const emailOwner = await this.users.findByEmail(email);
      if (emailOwner && emailOwner.id !== user.id) {
        throw new ConflictException('The current Google email is already used by another account');
      }
      try {
        const [updatedUser] = await this.prisma.$transaction([
          this.prisma.user.update({
            where: { id: user.id, googleSubject: payload.sub },
            data: { email, emailVerifiedAt: new Date() },
          }),
          // Any link issued to the old mailbox must become unusable in the
          // same transaction as the authoritative Workspace/Gmail change.
          this.prisma.passwordResetToken.deleteMany({ where: { userId: user.id } }),
          this.prisma.emailVerificationToken.deleteMany({ where: { userId: user.id } }),
        ]);
        user = updatedUser;
      } catch (error) {
        if ((error as { code?: string })?.code !== 'P2002') throw error;
        throw new ConflictException('The current Google email is already used by another account');
      }
    }

    if (!user) {
      const emailUser = await this.users.findByEmail(email);
      if (emailUser) {
        if ((emailUser as any).deletedAt) {
          throw new UnauthorizedException('Account deactivated');
        }
        const existingSubject = (emailUser as any).googleSubject as string | null | undefined;
        if (existingSubject) {
          if (existingSubject !== payload.sub) {
            throw new ConflictException('Google account link cannot be replaced');
          }
          user = emailUser as any;
        } else {
          let passwordConfirmed = false;
          if (!authoritativeEmail && ctx.linkPassword) {
            await assertNotLocked(this.redis, ctx.ip ?? '', email);
            passwordConfirmed = await bcrypt.compare(ctx.linkPassword, emailUser.passwordHash);
            if (!passwordConfirmed) {
              await recordFailedLogin(this.redis, ctx.ip ?? '', email);
            } else {
              await clearLoginFailures(this.redis, ctx.ip ?? '', email);
            }
          }
          if (!authoritativeEmail && !passwordConfirmed) {
            // The first attempt only discovers that explicit account proof is
            // required. Let the same short-lived signed token be retried once
            // with the password; wrong-password attempts remain consumed and
            // are also covered by the normal Redis login lockout above.
            if (!ctx.linkPassword) {
              try {
                await this.redis.del(replayKey);
              } catch {
                throw new ServiceUnavailableException('Google sign-in is temporarily unavailable');
              }
            }
            throw new ConflictException({
              code: 'google_account_link_required',
              message: 'Enter the existing account password, then use Google again to link it securely.',
            });
          }
          const verifiedAt = (emailUser as any).emailVerifiedAt ?? new Date();
          // Re-establish the password credential while taking ownership of a
          // reassignable address. A password-confirmed external account keeps
          // that proven password; an authoritative Workspace link gets a new
          // unguessable value so a concurrent old-mailbox reset cannot remain
          // a second login path. Gmail addresses are stable and need no reset.
          const securedPasswordHash = isStableGmailAddress(email)
            ? undefined
            : await bcrypt.hash(
              passwordConfirmed && ctx.linkPassword
                ? ctx.linkPassword
                : `google-linked:${randomBytes(32).toString('hex')}`,
              BCRYPT_COST,
            );
          try {
            const linkedResult = await this.prisma.$transaction(async (tx) => {
              const result = await tx.user.updateMany({
                // The null predicate makes first-linking atomic: two different
                // Google subjects can never race and overwrite one another.
                where: { id: emailUser.id, googleSubject: null },
                data: {
                  googleSubject: payload.sub,
                  ...(!(emailUser as any).emailVerifiedAt ? { emailVerifiedAt: verifiedAt } : {}),
                  ...(securedPasswordHash ? { passwordHash: securedPasswordHash } : {}),
                },
              });

              if (result.count === 1) {
                // A reset or verification link issued before the identity was
                // linked must not remain a recovery path to the old mailbox.
                // Keep revocation atomic with the winning first-link update.
                await Promise.all([
                  tx.passwordResetToken.deleteMany({ where: { userId: emailUser.id } }),
                  tx.emailVerificationToken.deleteMany({ where: { userId: emailUser.id } }),
                ]);
              }

              return result;
            });
            if (linkedResult.count === 1) {
              user = {
                ...emailUser,
                googleSubject: payload.sub,
                emailVerifiedAt: verifiedAt,
              } as any;
            } else {
              const linked = await this.prisma.user.findUnique({
                where: { googleSubject: payload.sub },
              });
              if (!linked || linked.id !== emailUser.id) {
                throw new ConflictException('Google account is already linked to another user');
              }
              user = linked;
            }
          } catch (error) {
            const code = (error as { code?: string })?.code;
            if (code !== 'P2002') throw error;
            const linked = await this.prisma.user.findUnique({
              where: { googleSubject: payload.sub },
            });
            if (!linked || linked.id !== emailUser.id) {
              throw new ConflictException('Google account is already linked to another user');
            }
            user = linked;
          }
        }
      } else {
        const placeholderExam = new Date();
        placeholderExam.setFullYear(placeholderExam.getFullYear() + 1);
        // gradeLevel intentionally left null. ProtectedRoute on the frontend
        // routes any logged-in user with gradeLevel===null to /onboarding, where
        // the class picker is presented.
        try {
          user = await this.users.create({
            email,
            passwordHash: await bcrypt.hash(`google:${payload.sub}:${Date.now()}`, BCRYPT_COST),
            name,
            examDate: placeholderExam,
            targetGrade: 1,
            // KR-first launch: new Google accounts start in the only live market.
            country: 'KR' as any,
            googleSubject: payload.sub,
            // Google is authoritative for Gmail and Workspace email. Other
            // addresses must still complete Matheo's mailbox verification.
            emailVerifiedAt: authoritativeEmail ? new Date() : null,
          });
        } catch (error) {
          if ((error as { code?: string })?.code !== 'P2002') throw error;
          const linked = await this.prisma.user.findUnique({
            where: { googleSubject: payload.sub },
          });
          if (!linked) {
            throw new ConflictException('An account already uses this email address');
          }
          user = linked;
        }
      }
    }
    if ((user as any).deletedAt) {
      throw new UnauthorizedException('Account deactivated');
    }
    const verifiedUser = user!;
    await this.bindAndDisplace({
      userId: verifiedUser.id, deviceHash: ctx.deviceHash, ip: ctx.ip, ua: ctx.ua,
    });
    return this.issueTokens(verifiedUser.id, ctx.deviceHash);
  }

  /**
   * Kakao / Naver sign-in — the default KR social rails. Verifies the
   * provider access token (SocialProviderService), then find-or-creates the
   * user on the same model as Google. New social accounts default to country
   * KR (these are KR-market rails) with gradeLevel null so ProtectedRoute
   * routes them through onboarding.
   */
  async signInWithSocial(
    provider: SocialProvider,
    accessToken: string,
    ctx: { ip?: string; ua?: string; deviceHash?: string } = {},
  ) {
    const identity = await this.social.verify(provider, accessToken);
    const user = await this.findOrCreateSocialUser(identity);
    await this.bindAndDisplace({
      userId: user.id, deviceHash: ctx.deviceHash, ip: ctx.ip, ua: ctx.ua,
    });
    this.events.record('LOGIN_SUCCESS' as any, { userId: user.id, ip: ctx.ip, userAgent: ctx.ua, metadata: { method: provider } });
    return this.issueTokens(user.id, ctx.deviceHash);
  }

  private async findOrCreateSocialUser(identity: SocialIdentity) {
    // SECURITY: only use the provider's email as the account key when the
    // provider asserts it is verified. Otherwise namespace the account by the
    // provider user id so an unverified/attacker-chosen social email can never
    // link into (take over) an existing local email/password or Google account.
    const accountKey = identity.emailVerified
      ? identity.email.toLowerCase()
      : `${identity.provider}_${identity.providerUserId}@users.matheo.local`;
    let user = await this.users.findByEmail(accountKey);
    if (!user) {
      const placeholderExam = new Date();
      placeholderExam.setFullYear(placeholderExam.getFullYear() + 1);
      user = await this.users.create({
        email: accountKey,
        passwordHash: await bcrypt.hash(`${identity.provider}:${identity.providerUserId}:${Date.now()}`, BCRYPT_COST),
        name: identity.name,
        examDate: placeholderExam,
        targetGrade: 1,
        country: 'KR' as any,
        // null (not the prisma CLASS_12 default) so ProtectedRoute routes the
        // new social user through onboarding to pick their class.
        gradeLevel: null,
        emailVerifiedAt: identity.emailVerified ? new Date() : null,
      });
    } else if (identity.emailVerified && !(user as any).emailVerifiedAt) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { emailVerifiedAt: new Date() },
      }) as any;
    }
    return user!;
  }

  // ---------- India phone-OTP rail ----------

  /** Digits-only, +country-prefixed key. Bare 10-digit numbers default to +91. */
  private normalizePhone(raw: string): string {
    const digits = raw.replace(/[^0-9]/g, '');
    if (raw.trim().startsWith('+')) return `+${digits}`;
    // Strip a leading trunk '0' so 09812345678 and 9812345678 map to one
    // identity before defaulting to +91 (Indian mobiles never start with 0).
    const local = digits.replace(/^0+/, '');
    if (local.length === 10) return `+91${local}`;
    return `+${digits}`;
  }

  // Dedicated, NON-rotatable secret for phone identity fingerprints. Must NOT
  // fall back to the JWT refresh secret — rotating JWTs would re-key every
  // phone user's synthetic email and orphan their account/entitlement. Fails
  // closed in prod so a world-known constant is never used there.
  private phoneHashSecret(): string {
    const s = this.config.get<string>('PHONE_ID_HASH_SECRET') ?? process.env.PHONE_ID_HASH_SECRET;
    if (s) return s;
    if (process.env.NODE_ENV === 'production') {
      throw new Error('PHONE_ID_HASH_SECRET is required in production');
    }
    return 'dev-phone-id-secret';
  }

  private phoneFingerprint(phone: string): string {
    return createHmac('sha256', this.phoneHashSecret())
      .update(`phone:${phone}`)
      .digest('hex')
      .slice(0, 32);
  }

  private otpCodeHash(phone: string, code: string): string {
    return createHmac('sha256', this.phoneHashSecret())
      .update(`otp:${phone}:${code}`)
      .digest('hex');
  }

  private hashEquals(a: string, b: string): boolean {
    const left = Buffer.from(a, 'hex');
    const right = Buffer.from(b, 'hex');
    return left.length === right.length && timingSafeEqual(left, right);
  }

  private otpKey(phone: string): string { return `otp:phone:${this.phoneFingerprint(phone)}`; }
  private otpSendKey(phone: string): string { return `otp:send:${this.phoneFingerprint(phone)}`; }
  // Cumulative failed-verify counter that PERSISTS across code re-requests, so
  // re-sending a fresh code can't reset the brute-force ceiling.
  private otpFailKey(phone: string): string { return `otp:fail:${this.phoneFingerprint(phone)}`; }

  /**
   * Send a one-time code to a phone (India default rail). Rate-limited per phone
   * (sends/hour + a persistent failed-verify lock). The code is delivered BEFORE
   * it is persisted, so a failed send never leaves a usable code in Redis.
   */
  async startPhoneOtp(phone: string, _ctx: { ip?: string; ua?: string } = {}) {
    this.assertMarketAvailable('IN');
    const normalized = this.normalizePhone(phone);
    if (normalized.replace(/[^0-9]/g, '').length < 8) {
      throw new BadRequestException('invalid phone number');
    }
    const fails = Number((await this.redis.get(this.otpFailKey(normalized))) ?? '0');
    if (fails >= OTP_PHONE_LOCK_FAILS) {
      throw new BadRequestException({ code: 'otp_locked', message: 'Too many attempts. Try again later.' });
    }
    const sends = await this.redis.incrWithTtl(this.otpSendKey(normalized), 3600);
    if (sends > OTP_MAX_SENDS_PER_HOUR) {
      throw new BadRequestException({ code: 'otp_rate_limited', message: 'Too many code requests. Try again later.' });
    }
    const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
    // Deliver first; only persist a live code once delivery is accepted.
    const result = await this.otp.send(normalized, code);
    await this.redis.set(
      this.otpKey(normalized),
      JSON.stringify({ codeHash: this.otpCodeHash(normalized, code), attempts: 0 }),
      OTP_CODE_TTL_SEC,
    );
    return { sent: true, channel: result.channel, expiresInSec: OTP_CODE_TTL_SEC, ...(result.devCode ? { devCode: result.devCode } : {}) };
  }

  /** Verify a phone code and find-or-create the user (country IN). */
  async verifyPhoneOtp(phone: string, code: string, ctx: { ip?: string; ua?: string; deviceHash?: string } = {}) {
    this.assertMarketAvailable('IN');
    const normalized = this.normalizePhone(phone);
    // Single generic error for every failure so /verify can't be used to probe
    // whether a code is currently pending / a number is mid-login.
    const invalid = () => new UnauthorizedException({ code: 'otp_invalid', message: 'invalid or expired code' });
    const raw = await this.redis.get(this.otpKey(normalized));
    if (!raw) throw invalid();
    const state = JSON.parse(raw) as { codeHash: string; attempts: number };
    if (state.attempts >= OTP_MAX_VERIFY_ATTEMPTS) {
      await this.redis.del(this.otpKey(normalized));
      throw invalid();
    }
    if (!this.hashEquals(this.otpCodeHash(normalized, code), state.codeHash)) {
      await this.redis.set(this.otpKey(normalized), JSON.stringify({ ...state, attempts: state.attempts + 1 }), OTP_CODE_TTL_SEC);
      const fails = await this.redis.incrWithTtl(this.otpFailKey(normalized), 3600);
      this.events.record('LOGIN_FAIL' as any, { userId: null, ip: ctx.ip, userAgent: ctx.ua, metadata: { method: 'phone_otp', fails } });
      throw invalid();
    }
    await this.redis.del(this.otpKey(normalized));
    await this.redis.del(this.otpFailKey(normalized));
    const user = await this.findOrCreatePhoneUser(normalized);
    await this.bindAndDisplace({ userId: user.id, deviceHash: ctx.deviceHash, ip: ctx.ip, ua: ctx.ua });
    this.events.record('LOGIN_SUCCESS' as any, { userId: user.id, ip: ctx.ip, userAgent: ctx.ua, metadata: { method: 'phone_otp' } });
    return this.issueTokens(user.id, ctx.deviceHash);
  }

  /** Truecaller one-tap — verify the SDK token, then find-or-create by phone. */
  async signInWithTruecaller(token: string, ctx: { ip?: string; ua?: string; deviceHash?: string } = {}) {
    this.assertMarketAvailable('IN');
    const identity = await this.otp.verifyTruecaller(token);
    const user = await this.findOrCreatePhoneUser(this.normalizePhone(identity.phone), identity.name);
    await this.bindAndDisplace({ userId: user.id, deviceHash: ctx.deviceHash, ip: ctx.ip, ua: ctx.ua });
    this.events.record('LOGIN_SUCCESS' as any, { userId: user.id, ip: ctx.ip, userAgent: ctx.ua, metadata: { method: 'truecaller' } });
    return this.issueTokens(user.id, ctx.deviceHash);
  }

  private async findOrCreatePhoneUser(phone: string, name?: string) {
    this.assertMarketAvailable('IN');
    // No phone column on User. Use a stable, non-reversible synthetic email as
    // the identifier so /users/me and exports do not expose the raw phone.
    const email = `phone_${this.phoneFingerprint(phone)}@users.matheo.local`;
    let user = await this.users.findByEmail(email);
    if (!user) {
      const placeholderExam = new Date();
      placeholderExam.setFullYear(placeholderExam.getFullYear() + 1);
      user = await this.users.create({
        email,
        passwordHash: await bcrypt.hash(randomBytes(32).toString('hex'), BCRYPT_COST),
        name: name ?? 'Student',
        examDate: placeholderExam,
        targetGrade: 1,
        country: 'IN' as any,
        gradeLevel: null,
        // The verified phone is the identity; stamp emailVerifiedAt so the
        // (now soft) email gate never nags a phone-first user.
        emailVerifiedAt: new Date(),
      });
    }
    return user!;
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
    this.assertGuestModeEnabled();
    const guestCountry = this.assertMarketAvailable(dto.country ?? 'KR');
    if (ctx.deviceHash) {
      const bound = await (this.prisma as any).authDevice.findFirst({
        where: { deviceHash: ctx.deviceHash },
        orderBy: { lastSeenAt: 'desc' },
        select: { userId: true },
      });
      if (bound) {
        const existing = await this.prisma.user.findUnique({
          where: { id: bound.userId },
          select: { id: true, isGuest: true, deletedAt: true, country: true },
        });
        if (existing && (existing as any).isGuest && !existing.deletedAt) {
          this.assertMarketAvailable(existing.country ?? 'KR');
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
      // KR-first: default guests to the only live market when the chip hasn't
      // sent one yet. The onboarding country step overrides this before content.
      country: guestCountry as any,
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

    // KR PIPA under-14 gate — same rule as register(): normally a no-op
    // (email-OTP consent runs after upgrade); only fires under the
    // KR_UNDER14_REQUIRE_PASS opt-in. Effective country = new value or guest's.
    const upgradeCountry = (dto.country ?? (me as any).country ?? 'KR') as CountryCode;
    this.assertMarketAvailable(upgradeCountry);
    const upgradeBirthDate = dto.birthDate ? new Date(dto.birthDate) : null;
    if (isKrUnder14SignupBlocked(upgradeBirthDate, upgradeCountry)) {
      throw new BadRequestException({
        code: 'kr_under14_requires_pass',
        message: 'KR sign-up for under-14s currently requires guardian identity verification (PASS), which is being set up.',
      });
    }


    if (dto.consentAnalytics || dto.consentMarketing || dto.consentAiTraining) {
      this.privacy.assertOptionalConsentProfile({
        role: UserRole.STUDENT,
        birthDate: upgradeBirthDate,
        country: upgradeCountry,
        // Eligibility is evaluated for the post-upgrade real account.
        isGuest: false,
      });
    }

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
        country: (dto.country ?? me.country ?? 'KR') as any,
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
    // Workspace and external-domain addresses can be reassigned while the
    // stable Google subject remains with the original person. Never let a new
    // mailbox owner reset a Google-linked account. Gmail addresses are stable;
    // unlinked legacy accounts can still reset once and use that password to
    // complete the explicit Google link flow.
    const safeGoogleRecovery = !user?.googleSubject || isStableGmailAddress(user.email);
    if (user && !(user as any).deletedAt && safeGoogleRecovery) {
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
    const now = new Date();
    const resetApplied = await this.prisma.$transaction(async (tx) => {
      // Lock/update the user before consuming the token. The Google first-link
      // transaction follows the same user-then-token order, avoiding a
      // deadlock while making the two operations serialize on this row.
      const updatedUser = await tx.user.updateMany({
        where: {
          id: rec.userId,
          deletedAt: null,
          OR: [
            { googleSubject: null },
            { email: { endsWith: '@gmail.com' } },
          ],
        },
        data: { passwordHash },
      });

      if (updatedUser.count !== 1) {
        // A token created by an already-started forgot-password request can
        // arrive just after Google linking deleted older tokens. Consume that
        // late token without changing the now Google-owned account.
        await tx.passwordResetToken.deleteMany({ where: { id: rec.id } });
        return false;
      }

      const consumed = await tx.passwordResetToken.updateMany({
        where: { id: rec.id, usedAt: null, expiresAt: { gt: now } },
        data: { usedAt: now },
      });
      if (consumed.count !== 1) {
        // Throwing rolls back the user update as well as the failed claim.
        throw new BadRequestException('invalid or expired token');
      }
      return true;
    });
    if (!resetApplied) {
      throw new BadRequestException('invalid or expired token');
    }
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
