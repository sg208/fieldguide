import { readFileSync } from 'node:fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

type Req = { url: string; method: string; mode: string };
type Handler = (event: Record<string, unknown>) => void;

const ORIGIN = 'https://fieldguide.engg.app';
const SOURCE = readFileSync('public/sw.js', 'utf8');

const req = (path: string, init: Partial<Req> = {}): Req => ({
  url: path.startsWith('http') ? path : `${ORIGIN}${path}`,
  method: 'GET',
  mode: 'cors',
  ...init,
});
const html = (body: string): Response =>
  new Response(body, { headers: { 'content-type': 'text/html' } });

// In-memory Cache Storage: keyed by request URL, insertion order = age.
const createCaches = (): {
  store: Map<string, Map<string, Response>>;
  api: Record<string, unknown>;
} => {
  const store = new Map<string, Map<string, Response>>();
  // Like the real Cache Storage, a bare path resolves against the origin.
  const keyOf = (key: string | Req): string => {
    const raw = typeof key === 'string' ? key : key.url;
    return raw.startsWith('/') ? `${ORIGIN}${raw}` : raw;
  };
  const open = async (name: string): Promise<unknown> => {
    const entries = store.get(name) ?? new Map<string, Response>();
    store.set(name, entries);
    return {
      match: async (key: string | Req): Promise<Response | undefined> =>
        entries.get(keyOf(key))?.clone(),
      put: async (key: string | Req, response: Response): Promise<void> => {
        entries.delete(keyOf(key));
        entries.set(keyOf(key), response);
      },
      delete: async (key: string | Req): Promise<boolean> =>
        entries.delete(keyOf(key)),
      keys: async (): Promise<{ url: string }[]> =>
        [...entries.keys()].map((url) => ({ url })),
      addAll: async (urls: string[]): Promise<void> => {
        for (const url of urls) entries.set(`${ORIGIN}${url}`, html(url));
      },
    };
  };
  return {
    store,
    api: {
      open,
      keys: async (): Promise<string[]> => [...store.keys()],
      delete: async (name: string): Promise<boolean> => store.delete(name),
      match: async (key: string | Req): Promise<Response | undefined> => {
        for (const entries of store.values()) {
          const hit = entries.get(keyOf(key));
          if (hit) return hit.clone();
        }
        return undefined;
      },
    },
  };
};

const load = (): {
  store: Map<string, Map<string, Response>>;
  fetchMock: ReturnType<typeof vi.fn>;
  handlers: Record<string, Handler>;
  install: () => Promise<void>;
  activate: () => Promise<void>;
  request: (r: Req) => Promise<Response | 'passthrough'>;
} => {
  const handlers: Record<string, Handler> = {};
  const { store, api } = createCaches();
  const fetchMock = vi.fn(async () => html('network'));
  const scope = {
    addEventListener: (type: string, handler: Handler): void => {
      handlers[type] = handler;
    },
    skipWaiting: vi.fn(),
    caches: api,
    clients: { claim: vi.fn() },
    location: { origin: ORIGIN },
  };
  new Function('self', 'caches', 'fetch', 'URL', SOURCE)(
    scope,
    api,
    fetchMock,
    URL
  );
  const run = async (type: string): Promise<void> => {
    const pending: Promise<unknown>[] = [];
    handlers[type]?.({ waitUntil: (p: Promise<unknown>) => pending.push(p) });
    await Promise.all(pending);
  };
  return {
    store,
    fetchMock,
    handlers,
    install: (): Promise<void> => run('install'),
    activate: (): Promise<void> => run('activate'),
    request: async (request): Promise<Response | 'passthrough'> => {
      const pending: Promise<unknown>[] = [];
      const result: { responded?: Promise<Response> } = {};
      handlers.fetch?.({
        request,
        respondWith: (p: Promise<Response>) => {
          result.responded = p;
        },
        waitUntil: (p: Promise<unknown>) => pending.push(p),
      });
      const response = result.responded
        ? await result.responded
        : 'passthrough';
      await Promise.all(pending);
      return response;
    },
  };
};

describe('service worker', () => {
  let sw: ReturnType<typeof load>;
  beforeEach(() => {
    sw = load();
  });

  it('precaches /offline into a versioned cache on install', async () => {
    await sw.install();
    const names = [...sw.store.keys()];
    expect(names.length).toBeGreaterThan(0);
    expect(names.every((name) => /^fieldguide-[a-z]+-v\d+$/.test(name))).toBe(
      true
    );
    const urls = [...sw.store.values()].flatMap((entries) => [
      ...entries.keys(),
    ]);
    expect(urls).toContain(`${ORIGIN}/offline`);
  });

  it('precaches the hashed assets the offline page needs to hydrate', async () => {
    sw.fetchMock.mockResolvedValue(
      html(
        '<link rel="stylesheet" href="/assets/styles-aaa.css"><script src="/assets/offline-bbb.js"></script><link href="/assets/offline-bbb.js">'
      )
    );
    await sw.install();
    const assets = [
      ...(sw.store.get('fieldguide-assets-v1')?.keys() ?? []),
    ].sort();
    expect(assets).toEqual([
      `${ORIGIN}/assets/offline-bbb.js`,
      `${ORIGIN}/assets/styles-aaa.css`,
    ]);
  });

  it('serves navigations network-first and saves place pages', async () => {
    const response = await sw.request(
      req('/place/1214520?radius=25', { mode: 'navigate' })
    );
    expect(sw.fetchMock).toHaveBeenCalledTimes(1);
    expect(await (response as Response).text()).toBe('network');
    const saved = [...sw.store.values()].flatMap((entries) => [
      ...entries.keys(),
    ]);
    expect(saved).toContain(`${ORIGIN}/place/1214520?radius=25`);
  });

  it('falls back to a saved copy, then redirects to /offline, when the network fails', async () => {
    await sw.install();
    const page = req('/species/14623', { mode: 'navigate' });
    await sw.request(page);
    sw.fetchMock.mockRejectedValue(new TypeError('offline'));

    const saved = await sw.request(page);
    expect(await (saved as Response).text()).toBe('network');

    const unknown = await sw.request(req('/place/999', { mode: 'navigate' }));
    expect((unknown as Response).status).toBe(302);
    expect((unknown as Response).headers.get('location')).toBe(
      `${ORIGIN}/offline`
    );
  });

  it('serves hashed /assets/* cache-first', async () => {
    const first = await sw.request(req('/assets/index-abc123.js'));
    expect(first).toBeInstanceOf(Response);
    await sw.request(req('/assets/index-abc123.js'));
    expect(sw.fetchMock).toHaveBeenCalledTimes(1);
  });

  it('never intercepts server functions or non-GET requests', async () => {
    expect(await sw.request(req('/_serverFn/abc'))).toBe('passthrough');
    expect(await sw.request(req('/_serverFn/abc', { method: 'POST' }))).toBe(
      'passthrough'
    );
    expect(
      await sw.request(req('/place/1', { method: 'POST', mode: 'navigate' }))
    ).toBe('passthrough');
    expect(sw.fetchMock).not.toHaveBeenCalled();
    expect([...sw.store.values()].every((entries) => entries.size === 0)).toBe(
      true
    );
  });

  it('caches iNaturalist photos cache-first and ignores other origins', async () => {
    const photo = 'https://static.inaturalist.org/photos/1/medium.jpg';
    await sw.request(req(photo));
    await sw.request(req(photo));
    expect(sw.fetchMock).toHaveBeenCalledTimes(1);

    expect(await sw.request(req('https://example.com/x.jpg'))).toBe(
      'passthrough'
    );
  });

  it('caps saved pages at 40, dropping the oldest', async () => {
    for (const n of Array.from({ length: 41 }, (_, index) => index + 1)) {
      await sw.request(req(`/species/${n}`, { mode: 'navigate' }));
    }
    const pages = [...sw.store.entries()].find(([name]) =>
      name.startsWith('fieldguide-pages-')
    )?.[1];
    expect(pages?.size).toBe(40);
    expect(pages?.has(`${ORIGIN}/species/1`)).toBe(false);
    expect(pages?.has(`${ORIGIN}/species/41`)).toBe(true);
  });

  it('deletes caches from other versions on activate and keeps current ones', async () => {
    await sw.install();
    const current = [...sw.store.keys()];
    sw.store.set('fieldguide-shell-v0', new Map());
    sw.store.set('unrelated', new Map());
    await sw.activate();
    expect(sw.store.has('fieldguide-shell-v0')).toBe(false);
    expect(sw.store.has('unrelated')).toBe(false);
    for (const name of current) expect(sw.store.has(name)).toBe(true);
  });
});
