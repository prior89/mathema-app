import { ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { OtpProviderService } from './otp-provider.service';

function svc(env: Record<string, string | undefined>) {
  const config = { get: (k: string) => env[k] };
  return new OtpProviderService(config as never);
}

describe('OtpProviderService (mock)', () => {
  it('echoes the code on the mock channel', async () => {
    const r = await svc({ OTP_AUTH_MOCK: 'true' }).send('+919000000001', '123456');
    expect(r.channel).toBe('mock');
    expect(r.devCode).toBe('123456');
  });

  it('returns a deterministic +91 identity for a Truecaller token in mock mode', async () => {
    const s = svc({ OTP_AUTH_MOCK: 'true' });
    const a = await s.verifyTruecaller('tc-token-aaaa');
    const b = await s.verifyTruecaller('tc-token-aaaa');
    expect(a).toEqual(b);
    expect(a.phone).toMatch(/^\+91[0-9]{10}$/);
  });

  it('rejects a too-short Truecaller token', async () => {
    await expect(svc({ OTP_AUTH_MOCK: 'true' }).verifyTruecaller('x')).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('fails closed (no provider) when not mocked and unconfigured', async () => {
    await expect(svc({ OTP_AUTH_MOCK: 'false' }).send('+919000000001', '123456'))
      .rejects.toBeInstanceOf(ServiceUnavailableException);
  });
});
