import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  NotFoundError,
  RateLimitedError,
  UpstreamError,
} from '../../src/server/errors';
import { USER_AGENT, fetchJson } from '../../src/server/upstream';

const jsonResponse = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

describe('fetchJson', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns parsed JSON and sends the User-Agent and a timeout signal', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ ok: true }));
    vi.stubGlobal('fetch', fetchMock);

    const data = await fetchJson<{ ok: boolean }>('https://example.test/a');

    expect(data).toEqual({ ok: true });
    const [url, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url).toBe('https://example.test/a');
    expect(new Headers(init.headers).get('user-agent')).toBe(
      'fieldguide/0.1 (+https://github.com/sg208/fieldguide)'
    );
    expect(USER_AGENT).toBe(
      'fieldguide/0.1 (+https://github.com/sg208/fieldguide)'
    );
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it('maps 404 to NotFoundError', async () => {
    vi.stubGlobal('fetch', async () => jsonResponse({}, 404));
    await expect(fetchJson('https://example.test/x')).rejects.toBeInstanceOf(
      NotFoundError
    );
  });

  it('retries a 429 once and returns the second answer', async () => {
    vi.useFakeTimers();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({}, 429))
      .mockResolvedValueOnce(jsonResponse({ ok: true }));
    vi.stubGlobal('fetch', fetchMock);

    const pending = fetchJson<{ ok: boolean }>('https://example.test/x');
    await vi.runAllTimersAsync();

    await expect(pending).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });

  it('maps a second 429 to RateLimitedError', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn(async () => jsonResponse({}, 429));
    vi.stubGlobal('fetch', fetchMock);

    const pending = fetchJson('https://example.test/x');
    const assertion = expect(pending).rejects.toBeInstanceOf(RateLimitedError);
    await vi.runAllTimersAsync();

    await assertion;
    expect(fetchMock).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });

  it('maps other failures to UpstreamError with the status', async () => {
    vi.stubGlobal('fetch', async () => jsonResponse({}, 500));
    await expect(fetchJson('https://example.test/x')).rejects.toMatchObject({
      name: 'UpstreamError',
      status: 500,
    });
  });

  it('wraps a timeout abort in UpstreamError', async () => {
    vi.stubGlobal('fetch', async () => {
      throw new DOMException('timed out', 'TimeoutError');
    });
    await expect(fetchJson('https://example.test/x')).rejects.toBeInstanceOf(
      UpstreamError
    );
  });
});
