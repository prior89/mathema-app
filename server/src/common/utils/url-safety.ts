/**
 * SSRF defence for admin-supplied URLs.
 *
 * Threat model: admin endpoints (content-ingest HTTP source) accept a URL and
 * the server fetches it. Without this guard the URL can target:
 *   • localhost / 127.0.0.0/8     — sibling services on this host
 *   • 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 — internal infra
 *   • 169.254.0.0/16              — link-local incl. Azure/AWS metadata (steals
 *                                    managed-identity tokens)
 *   • 100.64.0.0/10               — CGNAT / cloud private peering
 *   • IPv6 ::1, fc00::/7, fe80::/10 — same families on v6
 *
 * Defence:
 *   1. https only (http and file/ftp/gopher rejected — no point fetching plaintext)
 *   2. Resolve hostname via DNS, then validate EVERY resolved A/AAAA address
 *      (prevents DNS rebind: hostname returns 8.8.8.8 then 127.0.0.1)
 *   3. Optional NCERT_INGEST_ALLOWED_HOSTS allowlist — when set, host must match
 */
import * as dns from 'node:dns/promises';
import * as net from 'node:net';

const PRIVATE_IPV4_BLOCKS: ReadonlyArray<[string, number]> = [
  ['10.0.0.0', 8],
  ['172.16.0.0', 12],
  ['192.168.0.0', 16],
  ['127.0.0.0', 8],
  ['169.254.0.0', 16],
  ['100.64.0.0', 10],
  ['0.0.0.0', 8],
  ['224.0.0.0', 4],   // multicast
  ['240.0.0.0', 4],   // reserved
];

function ipv4ToInt(ip: string): number {
  const [a, b, c, d] = ip.split('.').map(Number);
  return ((a << 24) >>> 0) + (b << 16) + (c << 8) + d;
}

function inCidr(ip: string, cidr: [string, number]): boolean {
  const ipInt = ipv4ToInt(ip);
  const baseInt = ipv4ToInt(cidr[0]);
  const mask = cidr[1] === 0 ? 0 : (~0 << (32 - cidr[1])) >>> 0;
  return (ipInt & mask) === (baseInt & mask);
}

function isPrivateIpv4(ip: string): boolean {
  return PRIVATE_IPV4_BLOCKS.some((cidr) => inCidr(ip, cidr));
}

function isPrivateIpv6(ip: string): boolean {
  const lower = ip.toLowerCase();
  if (lower === '::1' || lower === '::') return true;
  if (lower.startsWith('fe80:') || lower.startsWith('fec0:')) return true; // link/site-local
  if (lower.startsWith('fc') || lower.startsWith('fd')) return true;        // ULA fc00::/7
  if (lower.startsWith('::ffff:')) {
    // IPv4-mapped — extract v4 portion and re-check.
    const v4 = lower.slice('::ffff:'.length);
    if (net.isIPv4(v4)) return isPrivateIpv4(v4);
  }
  return false;
}

export async function assertSafeFetchUrl(rawUrl: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error(`Invalid URL: ${rawUrl}`);
  }
  if (url.protocol !== 'https:') {
    throw new Error(`Only https:// URLs are accepted (got ${url.protocol})`);
  }
  if (!url.hostname) throw new Error('URL has no hostname');

  const allow = (process.env.NCERT_INGEST_ALLOWED_HOSTS ?? '').trim();
  if (allow) {
    const list = allow.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
    if (!list.includes(url.hostname.toLowerCase())) {
      throw new Error(`Host ${url.hostname} not in NCERT_INGEST_ALLOWED_HOSTS`);
    }
  }

  // Resolve the hostname — every returned address must be public. Prevents
  // DNS rebind where the first lookup returns a public IP and the actual
  // fetch resolves to a private one.
  const addrs = net.isIP(url.hostname)
    ? [url.hostname]
    : (await dns.lookup(url.hostname, { all: true, verbatim: true })).map((a) => a.address);
  if (addrs.length === 0) {
    throw new Error(`Could not resolve ${url.hostname}`);
  }
  for (const addr of addrs) {
    const isV4 = net.isIPv4(addr);
    const isV6 = net.isIPv6(addr);
    if (!isV4 && !isV6) {
      throw new Error(`Unexpected non-IP resolution result for ${url.hostname}: ${addr}`);
    }
    if (isV4 ? isPrivateIpv4(addr) : isPrivateIpv6(addr)) {
      throw new Error(
        `Refusing to fetch ${url.hostname} — resolves to private address ${addr}`,
      );
    }
  }
  return url;
}
