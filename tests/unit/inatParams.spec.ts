import { describe, expect, it } from 'vitest';
import { sightingsQuery, speciesCountsQuery } from '../../src/lib/inatMap';
import { sightingsParams, speciesCountsParams } from '../../src/lib/inatParams';

// Behavior protected: the exact iNaturalist query strings (they double as
// edge-cache keys). Regression: a reordered/renamed param silently busts the cache.
// Not caught elsewhere: inat.spec drives the builders with hand-made params.
const london = { latitude: 51.5, longitude: -0.12 };

describe('speciesCountsParams', () => {
  it('builds the golden query for a group and month', () => {
    const params = speciesCountsParams(london, {
      placeId: 2643743,
      group: 'birds',
      radius: 25,
      month: 5,
      page: 2,
    });
    expect(String(speciesCountsQuery(params))).toBe(
      'lat=51.5&lng=-0.12&radius=25&quality_grade=research&locale=en&page=2&per_page=30&iconic_taxa=Aves&month=5'
    );
  });

  it('leaves out iconic_taxa and month for all groups without a month', () => {
    const params = speciesCountsParams(london, {
      placeId: 2643743,
      group: 'all',
      radius: 10,
      page: 1,
    });
    expect(String(speciesCountsQuery(params))).toBe(
      'lat=51.5&lng=-0.12&radius=10&quality_grade=research&locale=en&page=1&per_page=30'
    );
  });
});

describe('sightingsParams', () => {
  it('builds the golden sightings query', () => {
    const params = sightingsParams(london, {
      taxonId: 4745,
      placeId: 2643743,
      radius: 50,
    });
    expect(String(sightingsQuery(params))).toBe(
      'taxon_id=4745&lat=51.5&lng=-0.12&radius=50&quality_grade=research&locale=en&photos=true&order_by=observed_on&per_page=6'
    );
  });
});
