#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const LEGAL_PATHS = [
  '/legal/privacy-policy.md',
  '/legal/terms-of-service.md',
  '/legal/data-safety.md',
  '/legal/account-deletion.md',
];

const GOOGLE_SITE_VERIFICATION = 'Uv7M7AJ3Vp5JnxfuOI92ykyvqjZh1SpX_eacxEFEE8s';

function fail(message) {
  throw new Error(message);
}

function parseArgs(argv) {
  const result = { artifact: 'app/dist', url: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--artifact' && argv[i + 1]) result.artifact = argv[++i];
    else if (argv[i] === '--url' && argv[i + 1]) result.url = argv[++i];
    else fail(`Unknown or incomplete argument: ${argv[i]}`);
  }
  return result;
}

function isHtml(bytes) {
  const prefix = Buffer.from(bytes).subarray(0, 512).toString('utf8').trimStart().toLowerCase();
  return prefix.startsWith('<!doctype html') || prefix.startsWith('<html');
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function assetReferences(html) {
  const refs = new Set();
  const attr = /(?:src|href)=["']([^"']+)["']/g;
  for (const match of html.matchAll(attr)) {
    const pathname = new URL(match[1], 'https://artifact.invalid').pathname;
    if (pathname.startsWith('/assets/') && /\.(?:css|js|mjs)$/i.test(pathname)) refs.add(pathname);
  }
  return [...refs].sort();
}

function verifyGoogleSiteOwnership(html, label) {
  const tag = html.match(/<meta\b[^>]*\bname=["']google-site-verification["'][^>]*>/i)?.[0];
  if (!tag || (
    !tag.includes(`content="${GOOGLE_SITE_VERIFICATION}"`)
    && !tag.includes(`content='${GOOGLE_SITE_VERIFICATION}'`)
  )) {
    fail(`${label} is missing the pinned Google Search Console verification meta tag.`);
  }
}

function localPath(artifactRoot, urlPath) {
  const relative = decodeURIComponent(urlPath).replace(/^\/+/, '');
  const resolved = path.resolve(artifactRoot, relative);
  const root = `${path.resolve(artifactRoot)}${path.sep}`;
  if (!resolved.startsWith(root)) fail(`Artifact path escapes build directory: ${urlPath}`);
  return resolved;
}

async function readRequired(file, label) {
  try {
    const info = await stat(file);
    if (!info.isFile() || info.size === 0) fail(`${label} is empty or not a file: ${file}`);
    return await readFile(file);
  } catch (error) {
    if (error?.code === 'ENOENT') fail(`${label} is missing: ${file}`);
    throw error;
  }
}

async function deployableAssets(artifactRoot, directory = path.join(artifactRoot, 'assets')) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await deployableAssets(artifactRoot, absolute));
    else if (entry.isFile() && /\.(?:css|js|mjs)$/i.test(entry.name)) {
      result.push(`/${path.relative(artifactRoot, absolute).split(path.sep).join('/')}`);
    }
  }
  return result.sort();
}

async function verifyArtifact(artifactRoot) {
  const indexBytes = await readRequired(path.join(artifactRoot, 'index.html'), 'Built index');
  const indexHtml = indexBytes.toString('utf8');
  verifyGoogleSiteOwnership(indexHtml, 'Built index');
  const entryAssets = assetReferences(indexHtml);
  if (!entryAssets.some((asset) => /\.(?:js|mjs)$/i.test(asset))) {
    fail('Built index does not reference a JavaScript asset under /assets/.');
  }

  const assets = await deployableAssets(artifactRoot);
  if (assets.length === 0) fail('Build artifact contains no deployable JS/CSS assets.');

  const files = new Map();
  for (const asset of assets) {
    const bytes = await readRequired(localPath(artifactRoot, asset), 'Referenced asset');
    if (isHtml(bytes)) fail(`Referenced asset contains HTML instead of static bytes: ${asset}`);
    files.set(asset, bytes);
  }

  const configBytes = await readRequired(
    path.join(artifactRoot, 'staticwebapp.config.json'),
    'Static Web Apps config',
  );
  let config;
  try {
    config = JSON.parse(configBytes.toString('utf8'));
  } catch {
    fail('staticwebapp.config.json is not valid JSON.');
  }

  const excludes = config.navigationFallback?.exclude ?? [];
  if (config.navigationFallback?.rewrite !== '/index.html') {
    fail('navigationFallback must rewrite SPA routes to /index.html.');
  }
  for (const required of ['/assets/*', '/legal/*']) {
    if (!excludes.includes(required)) fail(`navigationFallback must exclude ${required}.`);
  }
  if (!String(config.mimeTypes?.['.md'] ?? '').toLowerCase().startsWith('text/markdown')) {
    fail('Static Web Apps must serve .md files as text/markdown.');
  }
  const override404 = config.responseOverrides?.['404'];
  if (override404?.rewrite === '/index.html') {
    fail('responseOverrides.404 must not rewrite missing assets or legal documents to index.html.');
  }
  for (const route of config.routes ?? []) {
    if (String(route.route ?? '').startsWith('/legal/') && (route.redirect || route.rewrite)) {
      fail(`Legal document route must remain a direct static file: ${route.route}`);
    }
  }

  for (const legalPath of LEGAL_PATHS) {
    const bytes = await readRequired(localPath(artifactRoot, legalPath), 'Legal document');
    if (isHtml(bytes)) fail(`Legal document contains HTML shell content: ${legalPath}`);
    files.set(legalPath, bytes);
  }

  return { entryAssets, assets, files };
}

function expectedContentType(urlPath) {
  if (/\.md$/i.test(urlPath)) return ['text/markdown'];
  if (/\.css$/i.test(urlPath)) return ['text/css'];
  return ['application/javascript', 'text/javascript'];
}

async function fetchBytes(url, { redirect = 'follow' } = {}) {
  const response = await fetch(url, {
    redirect,
    headers: { 'cache-control': 'no-cache', pragma: 'no-cache' },
    signal: AbortSignal.timeout(20_000),
  });
  const bytes = Buffer.from(await response.arrayBuffer());
  return { response, bytes };
}

async function verifyRemote(origin, artifact) {
  const base = new URL(origin);
  if (!['http:', 'https:'].includes(base.protocol)) fail('Smoke URL must use HTTP or HTTPS.');
  const cacheBust = `release-smoke=${Date.now()}`;
  const indexUrl = new URL(`/?${cacheBust}`, base);
  const { response: indexResponse, bytes: indexBytes } = await fetchBytes(indexUrl);
  if (indexResponse.status !== 200 || isHtml(indexBytes) === false) {
    fail(`Remote index is not an HTML 200 response (HTTP ${indexResponse.status}).`);
  }

  verifyGoogleSiteOwnership(indexBytes.toString('utf8'), 'Remote index');

  const remoteAssets = assetReferences(indexBytes.toString('utf8'));
  if (JSON.stringify(remoteAssets) !== JSON.stringify(artifact.entryAssets)) {
    fail('Remote index does not reference the assets from the artifact built in this workflow.');
  }

  for (const urlPath of [...artifact.assets, ...LEGAL_PATHS]) {
    const url = new URL(urlPath, base);
    url.search = cacheBust;
    const { response, bytes } = await fetchBytes(url, { redirect: 'manual' });
    if (response.status !== 200) fail(`${urlPath} returned HTTP ${response.status}, expected 200.`);

    const contentType = (response.headers.get('content-type') ?? '').toLowerCase();
    if (contentType.includes('text/html') || isHtml(bytes)) {
      fail(`${urlPath} returned the SPA HTML shell instead of the requested static file.`);
    }
    const allowed = expectedContentType(urlPath);
    if (!allowed.some((type) => contentType.startsWith(type))) {
      fail(`${urlPath} has Content-Type ${contentType || '(missing)'}, expected ${allowed.join(' or ')}.`);
    }

    const localBytes = artifact.files.get(urlPath);
    if (sha256(bytes) !== sha256(localBytes)) {
      fail(`${urlPath} does not match the artifact built in this workflow.`);
    }
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const artifactRoot = path.resolve(args.artifact);
  const artifact = await verifyArtifact(artifactRoot);
  console.log(`Static artifact verified: ${artifact.assets.length} JS/CSS asset(s), ${LEGAL_PATHS.length} legal document(s).`);
  if (args.url) {
    await verifyRemote(args.url, artifact);
    console.log(`Static deployment verified: ${new URL(args.url).origin}`);
  }
}

main().catch((error) => {
  console.error(`Static deployment verification failed: ${error.message}`);
  process.exitCode = 1;
});
