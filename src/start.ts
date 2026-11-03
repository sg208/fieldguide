import {
  createCsrfMiddleware,
  createMiddleware,
  createStart,
} from '@tanstack/react-start';
import { setResponseHeaders } from '@tanstack/react-start/server';
import { buildSecurityHeaders } from './lib/securityHeaders';

// Defining src/start.ts turns off Start's automatic CSRF middleware, so add it back.
const csrfMiddleware = createCsrfMiddleware({
  filter: (context) => context.handlerType === 'serverFn',
});

const securityHeadersMiddleware = createMiddleware().server(
  async ({ next }) => {
    setResponseHeaders(new Headers(buildSecurityHeaders()));
    return next();
  }
);

export const startInstance = createStart(() => ({
  requestMiddleware: [csrfMiddleware, securityHeadersMiddleware],
}));
