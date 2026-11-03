import { isRateLimited } from './rateLimit';

const IS_BROWSER = typeof window !== 'undefined';

/**
 * Runs the server function; if iNaturalist rate-limited the Worker (its egress
 * IPs are shared) and we are in the browser, asks iNaturalist directly instead.
 */
export const withBrowserFallback = async <T>(
  server: () => Promise<T>,
  browser: () => Promise<T>,
  isBrowser = IS_BROWSER
): Promise<T> => {
  try {
    return await server();
  } catch (error) {
    if (!isBrowser || !isRateLimited(error)) throw error;
    return browser();
  }
};
