import { Body, Controller, Delete, ForbiddenException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { ConsentKind } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { PrivacyService } from '../privacy/privacy.service';

class RegisterDeviceDto {
  @IsString() @MinLength(20) token!: string;
  @IsIn(['android', 'ios', 'web']) platform!: 'android' | 'ios' | 'web';
  @IsOptional() @IsString() appVersion?: string;
}

@UseGuards(JwtAuthGuard)
@Controller('devices')
export class PushController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly privacy: PrivacyService,
  ) {}

  /** 모바일 앱 부팅 시 호출 — FCM 토큰 등록 (이미 있으면 갱신). */
  @Post('register')
  async register(@CurrentUser('id') userId: string, @Body() dto: RegisterDeviceDto) {
    return this.prisma.deviceToken.upsert({
      where: { token: dto.token },
      create: {
        userId, token: dto.token, platform: dto.platform, appVersion: dto.appVersion ?? null,
      },
      update: {
        userId, platform: dto.platform, appVersion: dto.appVersion ?? null,
        disabledAt: null,
      },
    });
  }

  /** 앱 로그아웃 / 언인스톨 시 호출. */
  @Delete(':token')
  async unregister(@CurrentUser('id') userId: string, @Param('token') token: string) {
    await this.prisma.deviceToken.deleteMany({ where: { userId, token } });
    return { ok: true };
  }

  /**
   * Opt this device into / out of marketing pushes.
   * Opt-in requires an active MARKETING consent (DPDP/GDPR). Opt-out is always allowed.
   * Learning-reminder pushes (streak / SM-2-due) are unaffected — they are essential service notifications.
   */
  @Patch(':token/marketing')
  async setMarketing(
    @CurrentUser('id') userId: string,
    @Param('token') token: string,
    @Body() dto: { enabled: boolean },
  ) {
    if (dto.enabled === true) {
      const active = await this.privacy.isActive(userId, ConsentKind.MARKETING);
      if (!active) {
        throw new ForbiddenException('MARKETING consent not granted');
      }
      await this.prisma.deviceToken.updateMany({
        where: { token, userId },
        data: { marketingEnabled: true },
      });
    } else {
      await this.prisma.deviceToken.updateMany({
        where: { token, userId },
        data: { marketingEnabled: false },
      });
    }
    return { ok: true };
  }
}
