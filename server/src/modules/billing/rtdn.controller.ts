import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Logger,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { RtdnRequestDto } from './rtdn.dto';
import { RtdnService } from './rtdn.service';

/**
 * Public webhook (no JwtAuthGuard) — Google Pub/Sub push subscription POSTs
 * here. Authentication is via the OIDC token in the Authorization header.
 *
 * Response contract (Pub/Sub push):
 *   - 2xx: acknowledged (PROCESSED, ORPHAN, DEAD, or duplicate)
 *   - 5xx: transient failure — Pub/Sub retries (inbox stays RETRYABLE)
 *   - 400: permanently malformed payload (durable inbox audit, no retry)
 *   - 401/403: auth failure
 */
@Controller('billing')
export class RtdnController {
  private readonly logger = new Logger(RtdnController.name);

  constructor(private readonly rtdn: RtdnService) {}

  @Post('rtdn')
  @HttpCode(200)
  // Pub/Sub retries are already authenticated with Google OIDC. Do not put
  // this machine-to-machine webhook in the shared unauthenticated-IP bucket.
  @SkipThrottle()
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
