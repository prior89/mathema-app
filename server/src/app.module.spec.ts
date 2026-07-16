import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.spec.ts')
      ? [path]
      : [];
  });
}

describe('AppModule rate-limit configuration', () => {
  it('registers throttler root options exactly once across the module graph', () => {
    // ThrottlerModule is global. A second forRoot() silently replaces the
    // default policy for unrelated routes, as AuthModule previously did.
    const registrations = sourceFiles(__dirname).flatMap((file) => {
      const matches = readFileSync(file, 'utf8').match(
        /\bThrottlerModule\.forRoot(?:Async)?\s*\(/g,
      );
      return matches?.map(() => relative(__dirname, file)) ?? [];
    });

    expect(registrations).toEqual(['app.module.ts']);
  });
});
