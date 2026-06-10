import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { ParentLinksService } from './parent-links.service';
import { ParentLinkTokenDto } from './dto/parent-link-token.dto';

@UseGuards(ThrottlerGuard)
@Controller('parent-links')
export class ParentLinksController {
  constructor(private readonly links: ParentLinksService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me/status')
  myStatus(@CurrentUser('id') userId: string) {
    return this.links.getStatusForParent(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('incoming')
  incoming(@CurrentUser('id') userId: string) {
    return this.links.listIncomingForStudent(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':linkId/approve')
  approveAuthenticated(
    @CurrentUser('id') userId: string,
    @Param('linkId') linkId: string,
    @Req() req: any,
  ) {
    const ip = (req?.ip ?? req?.headers?.['x-forwarded-for'] ?? null) as string | null;
    const ua = (req?.headers?.['user-agent'] ?? null) as string | null;
    return this.links.approveById(linkId, userId, { ip: ip ?? undefined, ua: ua ?? undefined });
  }

  @Throttle({ auth: { ttl: 60_000, limit: 10 } })
  @Public()
  @Post('approve')
  approveByToken(@Body() dto: ParentLinkTokenDto, @Req() req: any) {
    const ip = (req?.ip ?? req?.headers?.['x-forwarded-for'] ?? null) as string | null;
    const ua = (req?.headers?.['user-agent'] ?? null) as string | null;
    return this.links.approveByToken(dto.token, { ip: ip ?? undefined, ua: ua ?? undefined });
  }

  @Throttle({ auth: { ttl: 60_000, limit: 10 } })
  @Public()
  @Post('reject')
  rejectByToken(@Body() dto: ParentLinkTokenDto, @Req() req: any) {
    const ip = (req?.ip ?? req?.headers?.['x-forwarded-for'] ?? null) as string | null;
    const ua = (req?.headers?.['user-agent'] ?? null) as string | null;
    return this.links.rejectByToken(dto.token, { ip: ip ?? undefined, ua: ua ?? undefined });
  }
}