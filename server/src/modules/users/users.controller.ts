import { Body, Controller, Delete, ForbiddenException, Get, Header, Patch, Post, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { UsersService } from './users.service';
import { StudentEfficacyService } from './student-efficacy.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FeatureFlagsService } from '../feature-flags/feature-flags.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly service: UsersService,
    private readonly efficacy: StudentEfficacyService,
    private readonly flags: FeatureFlagsService,
  ) {}

  // TopNav 의 아바타 이름·D-day 계산용
  @Get('me')
  me(@CurrentUser('id') id: string) { return this.service.findOne(id); }

  /** Student efficacy card — Redis cached 1h; gated by student_efficacy_card flag. */
  @Get('me/efficacy')
  async myEfficacy(@CurrentUser('id') id: string) {
    if (!this.flags.isEnabled('student_efficacy_card', id)) {
      throw new ForbiddenException({
        code: 'student_efficacy_card_disabled',
        message: 'Student efficacy card is not enabled for this account.',
      });
    }
    return this.efficacy.getCard(id);
  }

  @Patch('me')
  updateProfile(@CurrentUser('id') id: string, @Body() dto: UpdateProfileDto) {
    return this.service.updateProfile(id, dto);
  }

  @Post('me/password')
  changePassword(@CurrentUser('id') id: string, @Body() dto: ChangePasswordDto) {
    return this.service.changePassword(id, dto.current, dto.next);
  }

  /**
   * Self account deletion — DPDP §12 / Play Console 2024 policy.
   * Hard delete: the User row and every owned child record are purged in
   * a single transaction (see UsersRepository.hardDelete). AnalyticsEvent
   * rows have their userId anonymised so aggregate funnels survive without
   * personal trace. AdminAccessLog rows are kept for the audit window.
   */
  @Delete('me')
  async deleteAccount(@CurrentUser('id') id: string) {
    return this.service.deleteSelf(id);
  }

  /**
   * 자기데이터 다운로드 — GDPR Art. 20.
   * JSON 파일로 직접 다운로드 트리거 (브라우저 Save As).
   */
  @Get('me/export')
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="matheo-data-export.json"')
  async exportData(@CurrentUser('id') id: string, @Res() res: Response) {
    const data = await this.service.exportSelf(id);
    res.json(data);
  }
}
