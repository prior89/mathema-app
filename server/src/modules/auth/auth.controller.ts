import { Body, Controller, Get, Headers, Ip, Post, Req, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { GoogleSignInDto } from './dto/google-signin.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthDeviceService } from './auth-device.service';
import { SecurityEventService } from './security-event.service';
import { MfaService } from './mfa.service';

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly devices: AuthDeviceService,
    private readonly events: SecurityEventService,
    private readonly mfa: MfaService,
  ) {}

  // 가입: 분당 5회/IP — 신규 botspam 방지.
  @Throttle({ auth: { ttl: 60_000, limit: 5 } })
  @Public() @Post('register')
  register(
    @Body() dto: RegisterDto,
    @Req() req: any,
    @Headers('x-device-hash') deviceHash?: string,
  ) {
    const ip = (req?.ip ?? req?.headers?.['x-forwarded-for'] ?? null) as string | null;
    const ua = (req?.headers?.['user-agent'] ?? null) as string | null;
    return this.service.register(dto, {
      ip: ip ?? undefined, ua: ua ?? undefined,
      deviceHash: deviceHash || undefined,
    });
  }

  // 로그인: 분당 5회/IP — credential stuffing 차단.
  @Throttle({ auth: { ttl: 60_000, limit: 5 } })
  @Public() @Post('login')
  login(
    @Body() dto: LoginDto,
    @Req() req: any,
    @Headers('x-device-hash') deviceHash?: string,
  ) {
    const ip = (req?.ip ?? req?.headers?.['x-forwarded-for'] ?? '') as string;
    const ua = (req?.headers?.['user-agent'] ?? '') as string;
    return this.service.login(dto, { ip, ua, deviceHash: deviceHash || undefined });
  }

  /** PoC dev login — admin/admin (or any creds). 자동 admin 시드 + DPDP 동의 + 토큰 발급. non-production only. */
  @Throttle({ auth: { ttl: 60_000, limit: 30 } })
  @Public() @Post('dev-login')
  devLogin(@Req() req: any, @Headers('x-device-hash') deviceHash?: string) {
    const ip = (req?.ip ?? req?.headers?.['x-forwarded-for'] ?? null) as string | null;
    const ua = (req?.headers?.['user-agent'] ?? null) as string | null;
    return this.service.devLogin({
      ip: ip ?? undefined, ua: ua ?? undefined,
      deviceHash: deviceHash || undefined,
    });
  }

  @Throttle({ auth: { ttl: 60_000, limit: 10 } })
  @Public() @Post('google/id-token')
  googleIdToken(
    @Body() dto: GoogleSignInDto,
    @Req() req: any,
    @Headers('x-device-hash') deviceHash?: string,
  ) {
    const ip = (req?.ip ?? null) as string | null;
    const ua = (req?.headers?.['user-agent'] ?? null) as string | null;
    return this.service.signInWithGoogle(dto.idToken, {
      ip: ip ?? undefined, ua: ua ?? undefined,
      deviceHash: deviceHash || undefined,
    });
  }

  @Throttle({ auth: { ttl: 60_000, limit: 10 } })
  @Public() @Post('refresh')
  refresh(
    @Body('refreshToken') token: string,
    @Headers('x-device-hash') deviceHash?: string,
  ) {
    return this.service.refresh(token, deviceHash || undefined);
  }

  @Post('logout')
  logout(@Body('refreshToken') token: string) { return this.service.logout(token); }

  // 비밀번호 재설정 요청 — 응답은 항상 200 (enumeration 방지).
  @Throttle({ auth: { ttl: 60_000, limit: 3 } })
  @Public() @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto, @Ip() ip: string) {
    return this.service.forgotPassword(dto.email, ip);
  }

  @Throttle({ auth: { ttl: 60_000, limit: 5 } })
  @Public() @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.service.resetPassword(dto.token, dto.password);
  }

  @Throttle({ auth: { ttl: 60_000, limit: 20 } })
  @Public() @Post('verify-email')
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.service.verifyEmail(dto.token);
  }

  @UseGuards(JwtAuthGuard)
  @Throttle({ auth: { ttl: 60_000, limit: 3 } })
  @Post('resend-verification')
  resendVerification(@CurrentUser('id') id: string) {
    return this.service.resendVerification(id);
  }

  /** DEV-8 -- list devices currently bound to this user (Settings screen). */
  @UseGuards(JwtAuthGuard)
  @Get('me/devices')
  listDevices(
    @CurrentUser('id') userId: string,
    @Headers('x-device-hash') currentHash?: string,
  ) {
    return this.devices.listForUser(userId).then((devices) => ({
      devices: devices.map((d) => ({
        ...d,
        isCurrent: !!currentHash && d.deviceHash === currentHash,
        // Don't leak the full deviceHash to the client; first 8 hex chars is
        // enough to disambiguate visually without making the hash recoverable.
        deviceHashShort: d.deviceHash.slice(0, 8),
        deviceHash: undefined as any,
      })),
    }));
  }

  /** DEV-8 -- revoke every device except the requester's current one. */
  @UseGuards(JwtAuthGuard)
  @Throttle({ auth: { ttl: 60_000, limit: 5 } })
  @Post('me/devices/revoke-others')
  async revokeOtherDevices(
    @CurrentUser('id') userId: string,
    @Req() req: any,
    @Headers('x-device-hash') currentHash?: string,
  ) {
    if (!currentHash) {
      return { ok: false, revoked: 0, reason: 'missing X-Device-Hash header' };
    }
    const others = await this.devices.revokeOtherDevices(userId, currentHash);
    this.events.record('DEVICE_REVOKE_OTHERS' as any, {
      userId,
      ip: (req?.ip ?? null) as string | null,
      userAgent: (req?.headers?.['user-agent'] ?? null) as string | null,
      metadata: { revokedCount: others.length },
    });
    return { ok: true, revoked: others.length };
  }

  // ---------- MFA-1 -- TOTP enrolment endpoints (v1.0 backend only) ----------

  /** Stage 1 of enrolment: return otpauth URL + base64 QR PNG. */
  @UseGuards(JwtAuthGuard)
  @Throttle({ auth: { ttl: 60_000, limit: 5 } })
  @Post('mfa/setup')
  mfaSetup(@CurrentUser('id') userId: string) {
    return this.mfa.startSetup(userId);
  }

  /** Stage 2: confirm with the first OTP from the authenticator app. */
  @UseGuards(JwtAuthGuard)
  @Throttle({ auth: { ttl: 60_000, limit: 10 } })
  @Post('mfa/verify')
  mfaVerify(@CurrentUser('id') userId: string, @Body('token') token: string) {
    return this.mfa.confirmSetup(userId, token);
  }

  /** Disable -- requires both current password and a valid OTP. */
  @UseGuards(JwtAuthGuard)
  @Throttle({ auth: { ttl: 60_000, limit: 5 } })
  @Post('mfa/disable')
  mfaDisable(
    @CurrentUser('id') userId: string,
    @Body() body: { password: string; token: string },
  ) {
    return this.mfa.disable(userId, body.password, body.token);
  }
}
