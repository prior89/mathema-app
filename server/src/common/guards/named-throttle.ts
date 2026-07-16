import 'reflect-metadata';
import type { ExecutionContext } from '@nestjs/common';

/**
 * Named throttlers are evaluated for every route by @nestjs/throttler. Keep a
 * named policy dormant unless the handler or controller explicitly opts into
 * it with `@Throttle({ [name]: ... })`.
 */
export function hasNamedThrottle(
  context: ExecutionContext,
  name: string,
): boolean {
  const metadataKey = `THROTTLER:LIMIT${name}`;
  return [context.getHandler(), context.getClass()].some(
    (target) => Reflect.getMetadata(metadataKey, target) !== undefined,
  );
}

export function skipUnlessNamedThrottle(name: string) {
  return (context: ExecutionContext): boolean =>
    !hasNamedThrottle(context, name);
}
