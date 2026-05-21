/**
 * URL-safety guard — exercises the SSRF defence on known-bad targets.
 *
 * DNS resolution is mocked so the spec runs offline and deterministically.
 */
import * as dns from 'node:dns/promises';
import { assertSafeFetchUrl } from './url-safety';

jest.mock('node:dns/promises');

const mockedLookup = dns.lookup as unknown as jest.Mock;

function setResolution(...addrs: string[]) {
  mockedLookup.mockResolvedValueOnce(addrs.map((address) => ({ address, family: address.includes(':') ? 6 : 4 })));
}

describe('assertSafeFetchUrl', () => {
  beforeEach(() => {
    mockedLookup.mockReset();
    delete process.env.NCERT_INGEST_ALLOWED_HOSTS;
  });

  it('rejects malformed URL', async () => {
    await expect(assertSafeFetchUrl('not a url')).rejects.toThrow(/Invalid URL/);
  });

  it('rejects http:// (plaintext)', async () => {
    await expect(assertSafeFetchUrl('http://example.com/x')).rejects.toThrow(/Only https/);
  });

  it('rejects ftp://', async () => {
    await expect(assertSafeFetchUrl('ftp://example.com/x')).rejects.toThrow(/Only https/);
  });

  it('rejects when hostname resolves to localhost (127.0.0.1)', async () => {
    setResolution('127.0.0.1');
    await expect(assertSafeFetchUrl('https://attacker.example.com/x'))
      .rejects.toThrow(/private address/);
  });

  it('rejects when hostname resolves to Azure metadata (169.254.169.254)', async () => {
    setResolution('169.254.169.254');
    await expect(assertSafeFetchUrl('https://attacker.example.com/x'))
      .rejects.toThrow(/private address/);
  });

  it('rejects when hostname resolves to RFC1918 10/8', async () => {
    setResolution('10.0.0.5');
    await expect(assertSafeFetchUrl('https://internal.example.com/x'))
      .rejects.toThrow(/private address/);
  });

  it('rejects when hostname resolves to RFC1918 192.168/16', async () => {
    setResolution('192.168.1.1');
    await expect(assertSafeFetchUrl('https://router.example.com/'))
      .rejects.toThrow(/private address/);
  });

  it('rejects when hostname resolves to CGNAT 100.64/10', async () => {
    setResolution('100.64.0.1');
    await expect(assertSafeFetchUrl('https://cgnat.example.com/'))
      .rejects.toThrow(/private address/);
  });

  it('rejects when ANY of the resolved addresses is private (rebind defence)', async () => {
    setResolution('8.8.8.8', '127.0.0.1'); // one public, one private
    await expect(assertSafeFetchUrl('https://rebinder.example.com/'))
      .rejects.toThrow(/private address/);
  });

  it('rejects IPv6 ::1', async () => {
    setResolution('::1');
    await expect(assertSafeFetchUrl('https://[::1]/'))
      .rejects.toThrow(/private address/);
  });

  it('rejects IPv6 unique-local fc00::/7', async () => {
    setResolution('fc00::1');
    await expect(assertSafeFetchUrl('https://internal6.example.com/'))
      .rejects.toThrow(/private address/);
  });

  it('rejects IPv4-mapped IPv6 of private address (::ffff:127.0.0.1)', async () => {
    setResolution('::ffff:127.0.0.1');
    await expect(assertSafeFetchUrl('https://sneaky.example.com/'))
      .rejects.toThrow(/private address/);
  });

  it('accepts a public address', async () => {
    setResolution('8.8.8.8');
    await expect(assertSafeFetchUrl('https://public.example.com/api')).resolves.toBeInstanceOf(URL);
  });

  it('honours NCERT_INGEST_ALLOWED_HOSTS allowlist', async () => {
    process.env.NCERT_INGEST_ALLOWED_HOSTS = 'allowed.example.com,other.com';
    // Even with a public IP, non-allowlisted host must be rejected.
    setResolution('8.8.8.8');
    await expect(assertSafeFetchUrl('https://public.example.com/api'))
      .rejects.toThrow(/not in NCERT_INGEST_ALLOWED_HOSTS/);

    setResolution('8.8.8.8');
    await expect(assertSafeFetchUrl('https://allowed.example.com/x')).resolves.toBeInstanceOf(URL);
  });
});
