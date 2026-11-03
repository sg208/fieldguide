import { NotFoundError, RateLimitedError, UpstreamError } from './errors';

export const USER_AGENT =
  'fieldguide/0.1 (+https://github.com/sg208/fieldguide)';
const TIMEOUT_MS = 8000;

export const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  }).catch((): null => null);
  if (!response) {
    throw new UpstreamError(null, 'Upstream request timed out or failed');
  }
  if (response.status === 404) throw new NotFoundError(url);
  if (response.status === 429) throw new RateLimitedError();
  if (!response.ok) throw new UpstreamError(response.status);
  return (await response.json()) as T;
};
