import type { ExecutionContext } from '@nestjs/common';
import { hasNamedThrottle, skipUnlessNamedThrottle } from './named-throttle';

function contextFor(handler: object, controller: object): ExecutionContext {
  return {
    getHandler: () => handler,
    getClass: () => controller,
  } as unknown as ExecutionContext;
}

describe('named throttler routing', () => {
  it('skips a named throttler on ordinary application routes', () => {
    const context = contextFor(() => undefined, class UsersController {});

    expect(hasNamedThrottle(context, 'auth')).toBe(false);
    expect(skipUnlessNamedThrottle('auth')(context)).toBe(true);
  });

  it('enables a named throttler when the handler opts in', () => {
    const handler = () => undefined;
    Reflect.defineMetadata('THROTTLER:LIMITauth', 5, handler);
    const context = contextFor(handler, class AuthController {});

    expect(hasNamedThrottle(context, 'auth')).toBe(true);
    expect(skipUnlessNamedThrottle('auth')(context)).toBe(false);
  });

  it('enables a named throttler when the controller opts in', () => {
    class InviteController {}
    Reflect.defineMetadata('THROTTLER:LIMITauth', 3, InviteController);
    const context = contextFor(() => undefined, InviteController);

    expect(hasNamedThrottle(context, 'auth')).toBe(true);
  });
});
