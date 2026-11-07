import { queryOptions, type UseQueryOptions } from '@tanstack/react-query';
import { CACHE_TTL_SECONDS, toMilliseconds } from '../lib/cacheTtl';
import { withBrowserFallback } from '../lib/browserFallback';
import type { GroupKey } from '../lib/groups';
import {
  browserSightings,
  browserSpeciesCounts,
  browserTaxon,
} from '../lib/inatBrowser';
import {
  sightingsParams,
  speciesCountsParams,
  type SightingsInput,
  type SpeciesListInput,
} from '../lib/inatParams';
import type { Radius } from '../lib/validation';
import {
  getPlaceFn,
  getSightingsFn,
  getSpeciesCountsFn,
  getTaxonFn,
} from '../server/fns';

export const SPECIES_STALE_MS = toMilliseconds(CACHE_TTL_SECONDS.species);
export const TAXON_STALE_MS = toMilliseconds(CACHE_TTL_SECONDS.taxon);

type Result<T extends (...args: never[]) => unknown> = Awaited<ReturnType<T>>;

export const speciesListQuery = (
  input: SpeciesListInput
): UseQueryOptions<
  Result<typeof getSpeciesCountsFn>,
  Error,
  Result<typeof getSpeciesCountsFn>,
  readonly ['species', number, GroupKey, Radius, number | null, number]
> =>
  queryOptions({
    queryKey: [
      'species',
      input.placeId,
      input.group,
      input.radius,
      input.month ?? null,
      input.page,
    ] as const,
    queryFn: () =>
      withBrowserFallback(
        () => getSpeciesCountsFn({ data: input }),
        async () => {
          const place = await getPlaceFn({ data: { placeId: input.placeId } });
          return browserSpeciesCounts(speciesCountsParams(place, input));
        }
      ),
    staleTime: SPECIES_STALE_MS,
  });

export const taxonQuery = (
  taxonId: number
): UseQueryOptions<
  Result<typeof getTaxonFn>,
  Error,
  Result<typeof getTaxonFn>,
  readonly ['taxon', number]
> =>
  queryOptions({
    queryKey: ['taxon', taxonId] as const,
    queryFn: () =>
      withBrowserFallback(
        () => getTaxonFn({ data: { taxonId } }),
        () => browserTaxon(taxonId)
      ),
    staleTime: TAXON_STALE_MS,
  });

export const sightingsQuery = (
  input: SightingsInput
): UseQueryOptions<
  Result<typeof getSightingsFn>,
  Error,
  Result<typeof getSightingsFn>,
  readonly ['sightings', number, number, Radius]
> =>
  queryOptions({
    queryKey: [
      'sightings',
      input.taxonId,
      input.placeId,
      input.radius,
    ] as const,
    queryFn: () =>
      withBrowserFallback(
        () => getSightingsFn({ data: input }),
        async () => {
          const place = await getPlaceFn({ data: { placeId: input.placeId } });
          return browserSightings(sightingsParams(place, input));
        }
      ),
    staleTime: SPECIES_STALE_MS,
  });
