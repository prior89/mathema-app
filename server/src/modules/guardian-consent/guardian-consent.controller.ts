import { BadRequestException, Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { GuardianConsentService } from './guardian-consent.service';
import { RequestGuardianConsentDto } from './dto/request-guardian-consent.dto';
import { GuardianConsentTokenDto } from './dto/guardian-consent-token.dto';
import { PassCompleteDto } from './dto/pass-complete.dto';

@UseGuards(ThrottlerGuard)
@Controller('guardian-consent')
export class GuardianConsentController {
  constructor(private readonly consent: GuardianConsentService) {}

  @UseGuards(JwtAuthGuard)
  @Get('status')
  status(@CurrentUser('id') userId: string) {
    return this.consent.statusForStudent(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('request')
  request(
    @CurrentUser('id') userId: string,
    @Body() dto: RequestGuardianConsentDto,
    @Req() req: any,
  ) {
    const ip = (req?.ip ?? req?.headers?.['x-forwarded-for'] ?? undefined) as string | undefined;
    const ua = (req?.headers?.['user-agent'] ?? undefined) as string | undefined;
    return this.consent.requestParentVerification(userId, dto, { ip, ua });
  }

  // KR under-14 rail — start guardian 휴대폰 본인인증 (PASS). Authed (the minor
  // initiates), exempt from the guardian gate so a not-yet-consented student
  // can reach it (see JwtAuthGuard.allowsGuardianExempt for /guardian-consent).
  @UseGuards(JwtAuthGuard)
  @Post('pass/start')
  passStart(@CurrentUser('id') userId: string, @Req() req: any) {
    const ip = (req?.ip ?? req?.headers?.['x-forwarded-for'] ?? undefined) as string | undefined;
    const ua = (req?.headers?.['user-agent'] ?? undefined) as string | undefined;
    return this.consent.startPassVerification(userId, { ip, ua });
  }

  // Provider callback / mock completion. Public: trust comes from the PASS
  // provider's verify() (a forged txId fails against a real provider). Rate-
  // limited like the email verify path.
  @Throttle({ auth: { ttl: 60_000, limit: 10 } })
  @Public()
  @Post('pass/complete')
  passComplete(@Body() dto: PassCompleteDto, @Req() req: any) {
    const ip = (req?.ip ?? req?.headers?.['x-forwarded-for'] ?? undefined) as string | undefined;
    const ua = (req?.headers?.['user-agent'] ?? undefined) as string | undefined;
    return this.consent.completePassVerification(dto.txId, { ip, ua });
  }

  @Public()
  @Get('preview')
  preview(@Query('token') token: string) {
    if (!token) throw new BadRequestException('token required');
    return this.consent.previewByToken(token);
  }

  @Throttle({ auth: { ttl: 60_000, limit: 10 } })
  @Public()
  @Post('verify')
  verify(@Body() dto: GuardianConsentTokenDto, @Req() req: any) {
    const ip = (req?.ip ?? req?.headers?.['x-forwarded-for'] ?? undefined) as string | undefined;
    const ua = (req?.headers?.['user-agent'] ?? undefined) as string | undefined;
    return this.consent.verifyByToken(dto.token, { ip, ua });
  }
}