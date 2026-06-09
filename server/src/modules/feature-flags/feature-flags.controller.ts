import { Controller, Get, Req } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { FeatureFlagsService, PUBLIC_FEATURE_FLAGS } from './feature-flags.service';

@Controller('config')
export class FeatureFlagsController {
  constructor(private readonly flags: FeatureFlagsService) {}

  /** Client feature branching — pass JWT when logged in for %-rollout bucketing. */
  @Public()
  @Get('features')
  getFeatures(@Req() req: { user?: { id?: string } }) {
    const userId = req.user?.id ?? null;
    return {
      flags: this.flags.getPublicFlags(userId),
      rolloutPct: Object.fromEntries(
        PUBLIC_FEATURE_FLAGS.map((f) => [f, this.flags.rolloutPercent(f)]),
      ),
    };
  }
}