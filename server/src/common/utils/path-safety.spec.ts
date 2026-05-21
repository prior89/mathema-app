import * as path from 'node:path';
import { assertSafeIngestPath } from './path-safety';

describe('assertSafeIngestPath', () => {
  const ORIG_DIR = process.env.NCERT_INGEST_DIR;
  const ORIG_ENV = process.env.NODE_ENV;
  // Use a guaranteed-absolute test root that does not depend on cwd.
  const ROOT = path.resolve('/tmp/ingest-allowed');

  beforeEach(() => {
    process.env.NCERT_INGEST_DIR = ROOT;
    process.env.NODE_ENV = 'test';
  });
  afterAll(() => {
    process.env.NCERT_INGEST_DIR = ORIG_DIR;
    process.env.NODE_ENV = ORIG_ENV;
  });

  it('rejects empty filePath', async () => {
    await expect(assertSafeIngestPath('')).rejects.toThrow(/filePath required/);
  });

  it('rejects path outside the allowed root', async () => {
    await expect(assertSafeIngestPath('/etc/passwd')).rejects.toThrow(/outside NCERT_INGEST_DIR/);
  });

  it('rejects ../-traversal attempts that escape the root', async () => {
    const bad = path.join(ROOT, '..', '..', 'etc', 'passwd');
    await expect(assertSafeIngestPath(bad)).rejects.toThrow(/outside NCERT_INGEST_DIR/);
  });

  it('rejects sibling-prefix attack (root=/tmp/ingest-allowed vs /tmp/ingest-allowed-evil)', async () => {
    await expect(
      assertSafeIngestPath(path.resolve('/tmp/ingest-allowed-evil/x.json')),
    ).rejects.toThrow(/outside NCERT_INGEST_DIR/);
  });

  it('accepts paths inside the allowed root', async () => {
    const ok = path.join(ROOT, 'class-7.json');
    await expect(assertSafeIngestPath(ok)).resolves.toBe(ok);
  });

  it('refuses when NCERT_INGEST_DIR is missing AND NODE_ENV is production', async () => {
    delete process.env.NCERT_INGEST_DIR;
    process.env.NODE_ENV = 'production';
    await expect(assertSafeIngestPath('/anything')).rejects.toThrow(/NCERT_INGEST_DIR is not set/);
  });
});
