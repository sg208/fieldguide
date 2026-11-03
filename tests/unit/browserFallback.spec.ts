import { afterEach, describe, expect, it, vi } from 'vitest';
import { withBrowserFallback } from '../../src/lib/browserFallback';
import { browserSpeciesCounts, browserTaxon } from '../../src/lib/inatBrowser';
import { RateLimitedError } from '../../src/server/errors';

// What a rate limit looks like after server-fn serialisation: class lost.
const serialisedRateLimit = (): Error =>
  new Error('Upstream rate limit reached');

describe('withBrowserFallback', () => {
  it('returns the server answer when the server succeeds', async () => {
    const browser = vi.fn(async () => 'browser');
    await expect(
      withBrowserFallback(async () => 'server', browser, true)
    ).resolves.toBe('server');
    expect(browser).not.toHaveBeenCalled();
  });

  it('asks iNaturalist from the browser when the server is rate limited', async () => {
    const server = async (): Promise<string> => {
      throw serialisedRateLimit();
    };
    await expect(
      withBrowserFallback(server, async () => 'browser', true)
    ).resolves.toBe('browser');
  });

  it('rethrows a rate limit during SSR (no browser)', async () => {
    const browser = vi.fn(async () => 'browser');
    const server = async (): Promise<string> => {
      throw serialisedRateLimit();
    };
    await expect(withBrowserFallback(server, browser, false)).rejects.toThrow(
      /rate limit/
    );
    expect(browser).not.toHaveBeenCalled();
  });

  it('rethrows other errors without falling back', async () => {
    const browser = vi.fn(async () => 'browser');
    const server = async (): Promise<string> => {
      throw new Error('Upstream request failed');
    };
    await expect(withBrowserFallback(server, browser, true)).rejects.toThrow(
      'Upstream request failed'
    );
    expect(browser).not.toHaveBeenCalled();
  });
});

describe('browser iNaturalist client', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches and maps a taxon without a User-Agent header', async () => {
    const fetchMock = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            results: [{ id: 4745, name: 'Mycteria cinerea', rank: 'species' }],
          })
        )
    );
    vi.stubGlobal('fetch', fetchMock);

    const taxon = await browserTaxon(4745);

    expect(taxon.name).toBe('Mycteria cinerea');
    const [url, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url).toBe('https://api.inaturalist.org/v1/taxa/4745?locale=en');
    expect(new Headers(init.headers).has('user-agent')).toBe(false);
  });

  it('maps a 429 to RateLimitedError', async () => {
    vi.stubGlobal('fetch', async () => new Response('{}', { status: 429 }));
    await expect(
      browserSpeciesCounts({ lat: 1, lng: 2, radius: 25, page: 1 })
    ).rejects.toBeInstanceOf(RateLimitedError);
  });
});
