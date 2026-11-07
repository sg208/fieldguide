import { queryOptions, type UseQueryOptions } from '@tanstack/react-query';
import { CACHE_TTL_SECONDS, toMilliseconds } from '../lib/cacheTtl';
import { getPlaceFn, searchPlacesFn } from '../server/fns';

export const SEARCH_STALE_MS = toMilliseconds(CACHE_TTL_SECONDS.search);
export const PLACE_STALE_MS = toMilliseconds(CACHE_TTL_SECONDS.place);

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
