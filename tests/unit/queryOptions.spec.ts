import type { SpeciesListInput } from '../../src/server/fns';
import { describe, expect, it } from 'vitest';
import {
  placeQuery,
  placeSearchQuery,
  PLACE_STALE_MS,
  SEARCH_STALE_MS,
} from '../../src/queries/places';
import {
  sightingsQuery,
  speciesListQuery,
  SPECIES_STALE_MS,
  taxonQuery,
  TAXON_STALE_MS,
} from '../../src/queries/species';

const hour = 60 * 60 * 1000;

describe('query options', () => {
  it('stale times match the server cache TTLs', () => {
    expect(SPECIES_STALE_MS).toBe(6 * hour);
    expect(PLACE_STALE_MS).toBe(7 * 24 * hour);
    expect(TAXON_STALE_MS).toBe(7 * 24 * hour);
    expect(SEARCH_STALE_MS).toBe(24 * hour);
    expect(
      speciesListQuery({ placeId: 1, group: 'all', radius: 25, page: 1 })
        .staleTime
    ).toBe(6 * hour);
    expect(placeQuery(1).staleTime).toBe(7 * 24 * hour);
    expect(taxonQuery(1).staleTime).toBe(7 * 24 * hour);
    expect(placeSearchQuery('Lon').staleTime).toBe(24 * hour);
  });

  it('placeSearchQuery and placeQuery keys are stable', () => {
    expect(placeSearchQuery('Lon').queryKey).toEqual(
      placeSearchQuery('Lon').queryKey
    );
    expect(placeSearchQuery('Lon').queryKey).not.toEqual(
      placeSearchQuery('Par').queryKey
    );
    expect(placeQuery(2643743).queryKey).toEqual(['place', 2643743]);
  });

  it('speciesListQuery key changes with every filter', () => {
    const base: SpeciesListInput = {
      placeId: 1,
      group: 'birds',
      radius: 25,
      month: 5,
      page: 2,
    };
    const key = (override: Partial<SpeciesListInput>): readonly unknown[] =>
      speciesListQuery({ ...base, ...override }).queryKey;

    expect(key({})).toEqual(key({}));
    const variants = [
      key({ placeId: 2 }),
      key({ group: 'plants' }),
      key({ radius: 50 }),
      key({ month: 6 }),
      key({ month: undefined }),
      key({ page: 3 }),
    ].map((value) => JSON.stringify(value));
    expect(new Set([JSON.stringify(key({})), ...variants]).size).toBe(7);
  });

  it('taxonQuery and sightingsQuery keys include their ids and radius', () => {
    expect(taxonQuery(14886).queryKey).toEqual(['taxon', 14886]);
    const a = sightingsQuery({ taxonId: 1, placeId: 2, radius: 25 }).queryKey;
    expect(a).toEqual(
      sightingsQuery({ taxonId: 1, placeId: 2, radius: 25 }).queryKey
    );
    expect(a).not.toEqual(
      sightingsQuery({ taxonId: 1, placeId: 2, radius: 50 }).queryKey
    );
    expect(a).not.toEqual(
      sightingsQuery({ taxonId: 1, placeId: 3, radius: 25 }).queryKey
    );
    expect(a).not.toEqual(
      sightingsQuery({ taxonId: 9, placeId: 2, radius: 25 }).queryKey
    );
  });
});
