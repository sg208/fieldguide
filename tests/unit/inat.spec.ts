import { afterEach, describe, expect, it, vi } from 'vitest';
import { NotFoundError, UpstreamError } from '../../src/server/errors';
import { searchPlaces, getPlace } from '../../src/server/geocode';
import {
  getSightings,
  getSpeciesCounts,
  getTaxon,
} from '../../src/server/inat';

const stubFetch = (body: unknown): ReturnType<typeof vi.fn> => {
  const mock = vi.fn(
    async () =>
      new Response(JSON.stringify(body), {
        headers: { 'content-type': 'application/json' },
      })
  );
  vi.stubGlobal('fetch', mock);
  return mock;
};

const urlOf = (mock: ReturnType<typeof vi.fn>): URL =>
  new URL(String(mock.mock.calls[0]?.[0]));

describe('iNaturalist and geocoding clients', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('getSpeciesCounts builds the query and maps results', async () => {
    const mock = stubFetch({
      total_results: 152,
      results: [
        {
          count: 839,
          taxon: {
            id: 72486,
            name: 'Alopochen aegyptiaca',
            preferred_common_name: 'Egyptian Goose',
            rank: 'species',
            iconic_taxon_name: 'Aves',
            default_photo: {
              square_url: 'https://x/square.jpg',
              medium_url: 'https://x/medium.jpg',
              attribution: '(c) A, some rights reserved (CC BY)',
              license_code: 'cc-by',
            },
          },
        },
      ],
    });

    const page = await getSpeciesCounts({
      lat: 51.5,
      lng: -0.12,
      radius: 25,
      iconicTaxa: ['Aves'],
      month: 5,
      page: 2,
    });

    const url = urlOf(mock);
    expect(url.origin + url.pathname).toBe(
      'https://api.inaturalist.org/v1/observations/species_counts'
    );
    expect(Object.fromEntries(url.searchParams)).toMatchObject({
      lat: '51.5',
      lng: '-0.12',
      radius: '25',
      quality_grade: 'research',
      locale: 'en',
      iconic_taxa: 'Aves',
      month: '5',
      page: '2',
      per_page: '30',
    });
    expect(page.totalResults).toBe(152);
    expect(page.results[0]).toEqual({
      taxonId: 72486,
      name: 'Alopochen aegyptiaca',
      commonName: 'Egyptian Goose',
      rank: 'species',
      iconicTaxon: 'Aves',
      observationCount: 839,
      photo: {
        squareUrl: 'https://x/square.jpg',
        mediumUrl: 'https://x/medium.jpg',
        attribution: '(c) A, some rights reserved (CC BY)',
        licenseCode: 'cc-by',
      },
    });
  });

  it('getSpeciesCounts omits optional filters and tolerates a missing photo', async () => {
    const mock = stubFetch({
      total_results: 1,
      results: [{ count: 1, taxon: { id: 1, name: 'X y', rank: 'species' } }],
    });

    const page = await getSpeciesCounts({
      lat: 1,
      lng: 2,
      radius: 10,
      page: 1,
    });

    const params = urlOf(mock).searchParams;
    expect(params.has('iconic_taxa')).toBe(false);
    expect(params.has('month')).toBe(false);
    expect(page.results[0]?.photo).toBeNull();
    expect(page.results[0]?.commonName).toBeNull();
  });

  it('getTaxon maps the detail fields', async () => {
    const mock = stubFetch({
      results: [
        {
          id: 14886,
          name: 'Mimus polyglottos',
          preferred_common_name: 'Northern Mockingbird',
          rank: 'species',
          iconic_taxon_name: 'Aves',
          wikipedia_url: 'https://en.wikipedia.org/wiki/Mimus polyglottos',
          wikipedia_summary: 'The <b>northern mockingbird</b>',
          conservation_status: { status: 'EN', geoprivacy: 'obscured' },
          establishment_means: { establishment_means: 'native' },
          observations_count: 248193,
          ancestors: [
            {
              id: 1,
              name: 'Animalia',
              rank: 'kingdom',
              preferred_common_name: 'Animals',
            },
          ],
          taxon_photos: [
            {
              photo: {
                square_url: 's',
                medium_url: 'm',
                attribution: 'attr',
                license_code: null,
              },
            },
          ],
        },
      ],
    });

    const taxon = await getTaxon(14886);

    expect(urlOf(mock).pathname).toBe('/v1/taxa/14886');
    expect(taxon).toMatchObject({
      id: 14886,
      commonName: 'Northern Mockingbird',
      conservationStatus: 'EN',
      isLocationObscured: true,
      establishmentMeans: 'native',
      observationsCount: 248193,
      wikipediaSummary: 'The <b>northern mockingbird</b>',
      ancestors: [
        { id: 1, name: 'Animalia', rank: 'kingdom', commonName: 'Animals' },
      ],
    });
    expect(taxon.photos[0]).toEqual({
      squareUrl: 's',
      mediumUrl: 'm',
      attribution: 'attr',
      licenseCode: null,
    });
  });

  it('searchPlaces asks for 8 English results', async () => {
    const mock = stubFetch({
      results: [
        {
          id: 2643743,
          name: 'London',
          admin1: 'England',
          country: 'United Kingdom',
          country_code: 'GB',
          latitude: 51.5,
          longitude: -0.12,
          population: 8961989,
          timezone: 'Europe/London',
        },
      ],
    });

    const places = await searchPlaces('London');

    const params = urlOf(mock).searchParams;
    expect(urlOf(mock).host).toBe('geocoding-api.open-meteo.com');
    expect(params.get('name')).toBe('London');
    expect(params.get('count')).toBe('8');
    expect(params.get('language')).toBe('en');
    expect(places[0]).toEqual({
      id: 2643743,
      name: 'London',
      admin1: 'England',
      country: 'United Kingdom',
      countryCode: 'GB',
      latitude: 51.5,
      longitude: -0.12,
      population: 8961989,
      timezone: 'Europe/London',
    });
  });

  it('searchPlaces returns [] when the API omits results', async () => {
    stubFetch({ generationtime_ms: 0.1 });
    expect(await searchPlaces('zzzzqq')).toEqual([]);
  });

  it('getPlace maps a single place', async () => {
    const mock = stubFetch({
      id: 2643743,
      name: 'London',
      latitude: 51.5,
      longitude: -0.12,
      country_code: 'GB',
      country: 'United Kingdom',
      timezone: 'Europe/London',
    });

    const place = await getPlace(2643743);

    expect(urlOf(mock).pathname).toBe('/v1/get');
    expect(urlOf(mock).searchParams.get('id')).toBe('2643743');
    expect(place).toMatchObject({
      id: 2643743,
      admin1: null,
      population: null,
      countryCode: 'GB',
    });
  });
});

describe('getSightings', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('maps observations and derives a medium photo from the square url', async () => {
    const mock = stubFetch({
      results: [
        {
          id: 412470519,
          observed_on: '2026-11-01',
          place_guess: 'Queens County, US-NY, US',
          user: { login: 'evan', name: 'Evan R' },
          uri: 'https://www.inaturalist.org/observations/412470519',
          photos: [
            {
              url: 'https://s3/photos/1/square.jpg',
              attribution: '(c) E, some rights reserved (CC BY-NC)',
              license_code: 'cc-by-nc',
            },
          ],
        },
        { id: 2, uri: 'https://www.inaturalist.org/observations/2' },
      ],
    });

    const sightings = await getSightings({
      taxonId: 14886,
      lat: 40.7,
      lng: -74,
      radius: 25,
    });

    const params = urlOf(mock).searchParams;
    expect(params.get('taxon_id')).toBe('14886');
    expect(params.get('quality_grade')).toBe('research');
    expect(sightings[0]).toEqual({
      id: 412470519,
      observedOn: '2026-11-01',
      placeGuess: 'Queens County, US-NY, US',
      observer: 'Evan R',
      url: 'https://www.inaturalist.org/observations/412470519',
      photo: {
        squareUrl: 'https://s3/photos/1/square.jpg',
        mediumUrl: 'https://s3/photos/1/medium.jpg',
        attribution: '(c) E, some rights reserved (CC BY-NC)',
        licenseCode: 'cc-by-nc',
      },
    });
    expect(sightings[1]?.photo).toBeNull();
  });
});

describe('getPlace for an unknown id', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('turns the Open-Meteo 400 "Location ID not found" into NotFoundError', async () => {
    vi.stubGlobal(
      'fetch',
      async () =>
        new Response(
          JSON.stringify({ error: true, reason: 'Location ID not found.' }),
          { status: 400 }
        )
    );

    await expect(getPlace(999999999)).rejects.toBeInstanceOf(NotFoundError);
  });

  it('keeps other upstream failures as UpstreamError', async () => {
    vi.stubGlobal('fetch', async () => new Response('{}', { status: 502 }));

    await expect(getPlace(1)).rejects.toBeInstanceOf(UpstreamError);
  });
});
