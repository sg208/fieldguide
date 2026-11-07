import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Behavior protected: the browser fallback glue in src/queries/species.ts asks
// iNaturalist with the place's coordinates when the Worker is rate limited.
// Regression: wrong coordinates/params or swallowing non-rate-limit errors.
// Not caught elsewhere: browserFallback.spec covers the helper, not the glue.
const serverFns = vi.hoisted(() => ({
  getPlaceFn: vi.fn(),
  getSpeciesCountsFn: vi.fn(),
  getSightingsFn: vi.fn(),
  getTaxonFn: vi.fn(),
}));
vi.mock('../../src/server/fns', () => serverFns);

const rateLimit = (): Error => new Error('Upstream rate limit reached');
const emptyJson = (body: unknown): Response =>
  new Response(JSON.stringify(body), { status: 200 });

const loadQueries = async (): Promise<
  typeof import('../../src/queries/species')
> => {
  // WHY: withBrowserFallback reads `window` once at module load.
  vi.stubGlobal('window', {});
  vi.resetModules();
  return import('../../src/queries/species');
};

const runQuery = async (options: { queryFn?: unknown }): Promise<unknown> =>
  (options.queryFn as (context: unknown) => Promise<unknown>)({});

describe('species query browser fallback', () => {
  const fetchStub = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchStub);
    serverFns.getPlaceFn.mockResolvedValue({
      id: 7,
      name: 'Testville',
      latitude: 51.5,
      longitude: -0.12,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
    fetchStub.mockReset();
  });

  it('speciesListQuery asks iNaturalist with place coordinates', async () => {
    const { speciesListQuery } = await loadQueries();
    serverFns.getSpeciesCountsFn.mockRejectedValue(rateLimit());
    fetchStub.mockResolvedValue(emptyJson({ total_results: 0, results: [] }));

    const page = await runQuery(
      speciesListQuery({
        placeId: 7,
        group: 'birds',
        radius: 25,
        month: 5,
        page: 2,
      })
    );

    expect(page).toEqual({ totalResults: 0, results: [] });
    const url = new URL(String(fetchStub.mock.calls[0]?.[0]));
    expect(url.pathname).toBe('/v1/observations/species_counts');
    expect(url.searchParams.get('lat')).toBe('51.5');
    expect(url.searchParams.get('lng')).toBe('-0.12');
    expect(url.searchParams.get('radius')).toBe('25');
    expect(url.searchParams.get('iconic_taxa')).toBe('Aves');
    expect(url.searchParams.get('month')).toBe('5');
    expect(url.searchParams.get('page')).toBe('2');
  });

  it('sightingsQuery asks iNaturalist with place coordinates', async () => {
    const { sightingsQuery } = await loadQueries();
    serverFns.getSightingsFn.mockRejectedValue(rateLimit());
    fetchStub.mockResolvedValue(emptyJson({ results: [] }));

    const sightings = await runQuery(
      sightingsQuery({ taxonId: 4745, placeId: 7, radius: 50 })
    );

    expect(sightings).toEqual([]);
    const url = new URL(String(fetchStub.mock.calls[0]?.[0]));
    expect(url.pathname).toBe('/v1/observations');
    expect(url.searchParams.get('taxon_id')).toBe('4745');
    expect(url.searchParams.get('lat')).toBe('51.5');
    expect(url.searchParams.get('lng')).toBe('-0.12');
    expect(url.searchParams.get('radius')).toBe('50');
  });

  it('taxonQuery asks iNaturalist for the taxon id', async () => {
    const { taxonQuery } = await loadQueries();
    serverFns.getTaxonFn.mockRejectedValue(rateLimit());
    fetchStub.mockResolvedValue(
      emptyJson({
        results: [{ id: 4745, name: 'Mycteria cinerea', rank: 'species' }],
      })
    );

    const taxon = await runQuery(taxonQuery(4745));

    expect(taxon).toMatchObject({ id: 4745, name: 'Mycteria cinerea' });
    expect(String(fetchStub.mock.calls[0]?.[0])).toContain('/taxa/4745');
  });

  it('rethrows an error that is not a rate limit', async () => {
    const { sightingsQuery } = await loadQueries();
    serverFns.getSightingsFn.mockRejectedValue(new Error('boom'));

    await expect(
      runQuery(sightingsQuery({ taxonId: 1, placeId: 7, radius: 25 }))
    ).rejects.toThrow('boom');
    expect(fetchStub).not.toHaveBeenCalled();
  });
});
