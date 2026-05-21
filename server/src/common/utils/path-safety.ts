/**
 * Filesystem-path guard for admin-supplied file references.
 *
 * Threat model: admin endpoints (content-ingest JSON_BULK source) accept a
 * filePath and the server reads it. Without this guard the admin -- or a
 * compromised admin account -- can request /etc/passwd, .env, .keystore.env,
 * or anything else the node process can read.
 *
 * Defence:
 *   1. Resolve the path to absolute (collapses ../ traversal)
 *   2. Verify it sits inside an env-pinned allowlisted directory
 *   3. Reject symlinks pointing outside the allowed directory
 *
 * The allowlist is NCERT_INGEST_DIR; in dev it defaults to
 * `server/scripts/ncert-import` (relative to repo root), in prod it MUST be
 * set explicitly or the guard refuses every path.
 */
import * as path from 'node:path';
import * as fs from 'node:fs/promises';

function resolveAllowedRoot(): string | null {
  const env = process.env.NCERT_INGEST_DIR?.trim();
  if (env) return path.resolve(env);
  // Dev default: <repo>/server/scripts/ncert-import. Resolve via cwd so it
  // works whether the process starts from repo root or server/.
  if (process.env.NODE_ENV !== 'production') {
    return path.resolve(process.cwd(), 'scripts', 'ncert-import');
  }
  return null;
}

export async function assertSafeIngestPath(filePath: string): Promise<string> {
  if (!filePath || typeof filePath !== 'string') {
    throw new Error('filePath required');
  }
  const root = resolveAllowedRoot();
  if (!root) {
    throw new Error('NCERT_INGEST_DIR is not set; refusing to read arbitrary paths');
  }
  const resolved = path.resolve(filePath);
  // Trailing separator ensures /etc/passwd isn't accepted when root=/etc/pass.
  const rootWithSep = root.endsWith(path.sep) ? root : root + path.sep;
  if (!resolved.startsWith(rootWithSep) && resolved !== root) {
    throw new Error(
      `filePath ${filePath} is outside NCERT_INGEST_DIR (${root})`,
    );
  }
  // Reject symlinks that target outside the allowed root (fs.realpath
  // collapses any link chain).
  try {
    const real = await fs.realpath(resolved);
    if (!real.startsWith(rootWithSep) && real !== root) {
      throw new Error(
        `filePath ${filePath} symlinks outside NCERT_INGEST_DIR (${real})`,
      );
    }
  } catch (e: any) {
    // ENOENT is fine -- caller will get a proper error when it tries to read.
    if (e?.code !== 'ENOENT') throw e;
  }
  return resolved;
}
