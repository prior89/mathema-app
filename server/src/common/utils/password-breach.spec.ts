/**
 * pwnedpasswords k-anonymity guard -- offline spec with fetch mocked.
 *
 * SHA-1 of "password" (canonical breached example):
 *   5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8
 * Prefix sent to API: 5BAA6
 * Suffix that must appear in response to block: 1E4C9B93F3F0682250B6CF8331B7EE68FD8
 */
import { BadRequestException } from '@nestjs/common';
import { assertPasswordNotBreached } from './password-breach';

const PASSWORD_SUFFIX = '1E4C9B93F3F0682250B6CF8331B7EE68FD8';

function mockFetch(body: string, ok = true, status = 200) {
  return jest.fn().mockResolvedValue({
    ok, status, text: async () => body,
  });
}

describe('assertPasswordNotBreached', () => {
  const ORIG_FETCH = global.fetch;
  const ORIG_DISABLED = process.env.PWNED_PASSWORDS_DISABLED;
  const ORIG_MIN = process.env.PWNED_PASSWORDS_MIN_COUNT;

  beforeEach(() => {
    delete process.env.PWNED_PASSWORDS_DISABLED;
    delete process.env.PWNED_PASSWORDS_MIN_COUNT;
  });
  afterEach(() => {
    global.fetch = ORIG_FETCH;
    process.env.PWNED_PASSWORDS_DISABLED = ORIG_DISABLED;
    process.env.PWNED_PASSWORDS_MIN_COUNT = ORIG_MIN;
  });

  it('throws when the password appears in the API response', async () => {
    global.fetch = mockFetch(`${PASSWORD_SUFFIX}:23597311\r\nOTHERHASH:1`) as any;
    await expect(assertPasswordNotBreached('password')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('allows when the password is not in the response', async () => {
    global.fetch = mockFetch('UNRELATEDSUFFIX:5\r\nANOTHERONE:1') as any;
    await expect(assertPasswordNotBreached('SufficientlyRandom-2026!')).resolves.toBeUndefined();
  });

  it('allows when API returns non-OK status (graceful degradation)', async () => {
    global.fetch = mockFetch('', false, 503) as any;
    await expect(assertPasswordNotBreached('password')).resolves.toBeUndefined();
  });

  it('allows when network/fetch throws (graceful degradation)', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('ENOTFOUND')) as any;
    await expect(assertPasswordNotBreached('password')).resolves.toBeUndefined();
  });

  it('skips entirely when PWNED_PASSWORDS_DISABLED=true (CI offline mode)', async () => {
    process.env.PWNED_PASSWORDS_DISABLED = 'true';
    const spy = jest.fn();
    global.fetch = spy as any;
    await expect(assertPasswordNotBreached('password')).resolves.toBeUndefined();
    expect(spy).not.toHaveBeenCalled();
  });

  it('allows when count is below PWNED_PASSWORDS_MIN_COUNT threshold', async () => {
    process.env.PWNED_PASSWORDS_MIN_COUNT = '100';
    // suffix present but only 5 occurrences -- below threshold
    global.fetch = mockFetch(`${PASSWORD_SUFFIX}:5`) as any;
    await expect(assertPasswordNotBreached('password')).resolves.toBeUndefined();
  });

  it('blocks when count meets PWNED_PASSWORDS_MIN_COUNT threshold', async () => {
    process.env.PWNED_PASSWORDS_MIN_COUNT = '100';
    global.fetch = mockFetch(`${PASSWORD_SUFFIX}:200`) as any;
    await expect(assertPasswordNotBreached('password')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('sends only the 5-char SHA-1 prefix, never the full hash', async () => {
    const spy = mockFetch('UNRELATED:1');
    global.fetch = spy as any;
    await assertPasswordNotBreached('password');
    const [url] = spy.mock.calls[0];
    // Range endpoint with exactly 5-hex-char prefix.
    expect(url).toMatch(/\/range\/[0-9A-F]{5}$/);
    // The full hash must NOT appear in the request URL.
    expect(url).not.toMatch(/[0-9A-F]{40}/i);
  });

  it('no-op on empty password (defensive)', async () => {
    const spy = jest.fn();
    global.fetch = spy as any;
    await expect(assertPasswordNotBreached('')).resolves.toBeUndefined();
    expect(spy).not.toHaveBeenCalled();
  });
});
