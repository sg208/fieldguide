import { NotFoundError, RateLimitedError, UpstreamError } from './errors';

export const USER_AGENT =
  'fieldguide/0.1 (+https://github.com/sg208/fieldguide)';
const TIMEOUT_MS = 8000;
// iNaturalist's limit is per minute; one short wait clears most bursts from a
// cold edge cache without holding the request for long.
const RATE_LIMIT_RETRY_MS = 1200;

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const request = (url: string): Promise<Response | null> =>
  fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  }).catch((): null => null);

export const fetchJson = async <T>(url: string): Promise<T> => {
  const first = await request(url);
  const isRetryable = first?.status === 429;
  if (isRetryable) await wait(RATE_LIMIT_RETRY_MS);
  const response = isRetryable ? await request(url) : first;
  if (!response) {
    throw new UpstreamError(null, 'Upstream request timed out or failed');
  }
  if (response.status === 404) throw new NotFoundError(url);
  if (response.status === 429) throw new RateLimitedError();
  if (!response.ok) throw new UpstreamError(response.status);
  return (await response.json()) as T;
};
