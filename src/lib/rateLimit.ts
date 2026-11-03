// Server functions serialise errors without their class, so match the name or
// the default message of RateLimitedError (src/server/errors.ts).
export const isRateLimited = (error: unknown): boolean =>
  error instanceof Error &&
  (error.name === 'RateLimitedError' || /rate limit/i.test(error.message));
