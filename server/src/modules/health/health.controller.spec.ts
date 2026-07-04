import { HealthController } from './health.controller';

function controller() {
  return new HealthController({} as never, {} as never);
}

const ORIGINAL_ENV = process.env;

describe('HealthController provider readiness', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    delete process.env.GUARDIAN_PASS_ENABLED;
    delete process.env.GUARDIAN_PASS_PROVIDER;
    delete process.env.SOCIAL_AUTH_MOCK;
    delete process.env.OTP_AUTH_ENABLED;
    delete process.env.OTP_AUTH_MOCK;
    delete process.env.MSG91_AUTH_KEY;
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('allows local mock identity providers for dev smoke tests', () => {
    process.env.NODE_ENV = 'development';
    process.env.GUARDIAN_PASS_ENABLED = 'true';
    process.env.GUARDIAN_PASS_PROVIDER = 'mock';
    process.env.SOCIAL_AUTH_MOCK = 'true';
    process.env.OTP_AUTH_MOCK = 'true';
    const res = { status: jest.fn() };

    const body = controller().providers(res as never);

    expect(res.status).not.toHaveBeenCalled();
    expect(body.status).toBe('ready');
    expect(body.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'kr_guardian_pass', status: 'mock', ready: true }),
      expect.objectContaining({ id: 'kr_social_kakao_naver_backend', status: 'mock', ready: true }),
      expect.objectContaining({ id: 'in_phone_otp_truecaller', status: 'mock', ready: true }),
    ]));
  });

  it('fails production readiness when mock providers are enabled', () => {
    process.env.NODE_ENV = 'production';
    process.env.GUARDIAN_PASS_ENABLED = 'true';
    process.env.GUARDIAN_PASS_PROVIDER = 'mock';
    process.env.SOCIAL_AUTH_MOCK = 'true';
    process.env.OTP_AUTH_MOCK = 'true';
    const res = { status: jest.fn() };

    const body = controller().providers(res as never);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(body.status).toBe('degraded');
    expect(body.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'kr_guardian_pass', status: 'not_configured', ready: false }),
      expect.objectContaining({ id: 'kr_social_kakao_naver_backend', status: 'not_configured', ready: false }),
      expect.objectContaining({ id: 'in_phone_otp_truecaller', status: 'not_configured', ready: false }),
    ]));
  });

  it('marks real PASS and OTP rails as not implemented until provider branches are wired', () => {
    process.env.NODE_ENV = 'production';
    process.env.GUARDIAN_PASS_ENABLED = 'true';
    process.env.GUARDIAN_PASS_PROVIDER = 'portone';
    process.env.OTP_AUTH_ENABLED = 'true';
    const res = { status: jest.fn() };

    const body = controller().providers(res as never);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(body.checks).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'kr_guardian_pass', status: 'not_implemented', ready: false }),
      expect.objectContaining({ id: 'in_phone_otp_truecaller', status: 'not_implemented', ready: false }),
    ]));
  });
});
