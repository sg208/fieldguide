import { NotFoundError } from './errors';

type CacheDeps = {
  cache?: Cache;
  waitUntil?: (promise: Promise<unknown>) => void;
};

type Entry<T> = { fetchedAt: number; data: T };

// Entries outlive their ttl so a failing upstream can fall back to stale data.
const RETENTION_SECONDS = 30 * 24 * 60 * 60;
const KEY_ORIGIN = 'https://cache.fieldguide.internal/';
// Bump when a mapped upstream shape changes, so old entries are never read.
export const CACHE_SCHEMA = 'v2';

const getDefaultCache = (): Cache | undefined =>
  (globalThis as { caches?: { default?: Cache } }).caches?.default;

const loadWaitUntil = async (): Promise<CacheDeps['waitUntil']> => {
  try {
    const workers = await import('cloudflare:workers');
    return workers.waitUntil;
  } catch {
    // Not running in a Worker request (tests, build): caller awaits the write.
    return undefined;
  }
};

const toRequest = (key: string): Request =>
  new Request(KEY_ORIGIN + encodeURIComponent(`${CACHE_SCHEMA}:${key}`));

const readEntry = async <T>(
  cache: Cache,
  key: string
): Promise<Entry<T> | null> => {
  const response = await cache.match(toRequest(key));
  return response ? ((await response.json()) as Entry<T>) : null;
};

const writeEntry = async <T>(
  cache: Cache,
  key: string,
  data: T,
  deps: CacheDeps
): Promise<void> => {
  const body = JSON.stringify({ fetchedAt: Date.now(), data });
  const write = cache.put(
    toRequest(key),
    new Response(body, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `public, max-age=${RETENTION_SECONDS}`,
      },
    })
  );
  const waitUntil = deps.waitUntil ?? (await loadWaitUntil());
  if (waitUntil) waitUntil(write);
  else await write;
};

export const cached = async <T>(
  key: string,
  ttlSeconds: number,
  fn: () => Promise<T>,
  deps: CacheDeps = {}
): Promise<T> => {
  const cache = 'cache' in deps ? deps.cache : getDefaultCache();
  if (!cache) return fn();

  const stored = await readEntry<T>(cache, key);
  if (stored && Date.now() - stored.fetchedAt < ttlSeconds * 1000) {
    return stored.data;
  }
  try {
    const data = await fn();
    await writeEntry(cache, key, data, deps);
    return data;
  } catch (error) {
    if (stored && !(error instanceof NotFoundError)) return stored.data;
    throw error;
  }
};
