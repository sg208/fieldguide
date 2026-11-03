import { queryOptions, type UseQueryOptions } from '@tanstack/react-query';
import { getPlaceFn, searchPlacesFn } from '../server/fns';

const HOUR_MS = 60 * 60 * 1000;
// Mirror the server edge-cache TTLs in src/server/geocode.ts
export const SEARCH_STALE_MS = 24 * HOUR_MS;
export const PLACE_STALE_MS = 7 * 24 * HOUR_MS;

type Result<T extends (...args: never[]) => unknown> = Awaited<ReturnType<T>>;

export const placeSearchQuery = (
  query: string
): UseQueryOptions<
  Result<typeof searchPlacesFn>,
  Error,
  Result<typeof searchPlacesFn>,
  readonly ['places', 'search', string]
> =>
  queryOptions({
    queryKey: ['places', 'search', query] as const,
    queryFn: () => searchPlacesFn({ data: { query } }),
    staleTime: SEARCH_STALE_MS,
  });

export const placeQuery = (
  placeId: number
): UseQueryOptions<
  Result<typeof getPlaceFn>,
  Error,
  Result<typeof getPlaceFn>,
  readonly ['place', number]
> =>
  queryOptions({
    queryKey: ['place', placeId] as const,
    queryFn: () => getPlaceFn({ data: { placeId } }),
    staleTime: PLACE_STALE_MS,
  });
