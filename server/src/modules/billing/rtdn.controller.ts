import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Logger,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { RtdnRequestDto } from './rtdn.dto';
import { RtdnService } from './rtdn.service';

/**
 * Public webhook (no JwtAuthGuard) — Google Pub/Sub push subscription POSTs
 * here. Authentication is via the OIDC token in the Authorization header,
 * which RtdnService.verifyOidcToken validates against Google's JWKS and the
 * configured audience + service-account email.
 *
 * Always returns HTTP 200 on well-formed requests (even unknown notification
 * types). Returning anything else triggers Pub/Sub retries, which we don't
 * want for permanently-unrecognized payloads.
 */
@Controller('billing')
export class RtdnController {
  private readonly logger = new Logger(RtdnController.name);

  constructor(private readonly rtdn: RtdnService) {}

  @Post('rtdn')
  @HttpCode(200)
  async receive(
    @Headers('authorization') auth: string | undefined,
    @Body() body: RtdnRequestDto,
  ): Promise<{ ok: true }> {
    if (!auth) {
      throw new UnauthorizedException('missing bearer token');
    }
    await this.rtdn.verifyOidcToken(auth);
    await this.rtdn.handle(body);
    return { ok: true };
  }
}
