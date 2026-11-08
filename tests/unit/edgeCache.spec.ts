import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CACHE_SCHEMA, cached } from '../../src/server/edgeCache';
import { NotFoundError, UpstreamError } from '../../src/server/errors';

// Cache API stand-in (system boundary): keyed by request URL
const createFakeCache = (): Cache & { store: Map<string, Response> } => {
  const store = new Map<string, Response>();
  return {
    store,
    match: async (request: RequestInfo | URL) =>
      store.get(new Request(request).url)?.clone(),
    put: async (request: RequestInfo | URL, response: Response) => {
      store.set(new Request(request).url, response);
    },
  } as unknown as Cache & { store: Map<string, Response> };
};

describe('cached', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-03T00:00:00Z'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls the fetcher on a miss and stores the result', async () => {
    const cache = createFakeCache();
    const fetcher = vi.fn(async () => ({ name: 'London' }));

    const value = await cached('place:1', 60, fetcher, { cache });

    expect(value).toEqual({ name: 'London' });
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(cache.store.size).toBe(1);
  });

  it('treats an unreadable stored entry as a miss', async () => {
    const cache = createFakeCache();
    await cached('place:1', 60, async () => 'first', { cache });
    const [storedKey] = [...cache.store.keys()];
    cache.store.set(storedKey ?? '', new Response('{broken'));
    const fetcher = vi.fn(async () => 'second');

    const value = await cached('place:1', 60, fetcher, { cache });

    expect(value).toBe('second');
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('versions the cache key so a new data shape never reads an old entry', async () => {
    const cache = createFakeCache();
    await cached('place:1', 60, async () => 'v', { cache });

    const [storedKey] = [...cache.store.keys()];
    expect(storedKey).toContain(encodeURIComponent(`${CACHE_SCHEMA}:place:1`));
  });

  it('serves a fresh hit without calling the fetcher', async () => {
    const cache = createFakeCache();
    await cached('place:1', 60, async () => 'first', { cache });
    vi.advanceTimersByTime(59_000);
    const fetcher = vi.fn(async () => 'second');

    const value = await cached('place:1', 60, fetcher, { cache });

    expect(value).toBe('first');
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('refetches after the ttl expires', async () => {
    const cache = createFakeCache();
    await cached('place:1', 60, async () => 'first', { cache });
    vi.advanceTimersByTime(61_000);

    const value = await cached('place:1', 60, async () => 'second', { cache });

    expect(value).toBe('second');
  });

  it('serves the stale entry when the upstream fails', async () => {
    const cache = createFakeCache();
    await cached('place:1', 60, async () => 'first', { cache });
    vi.advanceTimersByTime(3_600_000);

    const value = await cached(
      'place:1',
      60,
      async () => {
        throw new UpstreamError(503);
      },
      { cache }
    );

    expect(value).toBe('first');
  });

  it('rethrows when the upstream fails and nothing is stored', async () => {
    const cache = createFakeCache();
    await expect(
      cached(
        'place:2',
        60,
        async () => {
          throw new UpstreamError(503);
        },
        { cache }
      )
    ).rejects.toBeInstanceOf(UpstreamError);
  });

  it('never serves stale data for a 404', async () => {
    const cache = createFakeCache();
    await cached('place:1', 60, async () => 'first', { cache });
    vi.advanceTimersByTime(3_600_000);

    await expect(
      cached(
        'place:1',
        60,
        async () => {
          throw new NotFoundError('gone');
        },
        { cache }
      )
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it('writes through waitUntil when provided', async () => {
    const cache = createFakeCache();
    const waitUntil = vi.fn();

    await cached('place:3', 60, async () => 1, { cache, waitUntil });

    expect(waitUntil).toHaveBeenCalledTimes(1);
  });

  it('falls through to the fetcher when no cache exists', async () => {
    const fetcher = vi.fn(async () => 'live');

    const value = await cached('place:4', 60, fetcher, { cache: undefined });

    expect(value).toBe('live');
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});
