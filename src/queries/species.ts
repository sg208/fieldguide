import { queryOptions, type UseQueryOptions } from '@tanstack/react-query';
import type { GroupKey } from '../lib/groups';
import type { Radius } from '../lib/validation';
import type { SpeciesListInput } from '../server/fns';
import {
  getSightingsFn,
  getSpeciesCountsFn,
  getTaxonFn,
  type SightingsInput,
} from '../server/fns';

const HOUR_MS = 60 * 60 * 1000;
// Mirror the server edge-cache TTLs in src/server/inat.ts
export const SPECIES_STALE_MS = 6 * HOUR_MS;
export const TAXON_STALE_MS = 7 * 24 * HOUR_MS;

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
    queryFn: () => getSpeciesCountsFn({ data: input }),
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
    queryFn: () => getTaxonFn({ data: { taxonId } }),
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
    queryFn: () => getSightingsFn({ data: input }),
    staleTime: SPECIES_STALE_MS,
  });
