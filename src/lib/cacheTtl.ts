// Single source for edge-cache TTLs (Worker) and the matching client staleTime.
const SECONDS_PER_HOUR = 60 * 60;
const SECONDS_PER_DAY = 24 * SECONDS_PER_HOUR;

export const CACHE_TTL_SECONDS = {
  species: 6 * SECONDS_PER_HOUR,
  taxon: 7 * SECONDS_PER_DAY,
  place: 7 * SECONDS_PER_DAY,
  search: SECONDS_PER_DAY,
} as const;

export const toMilliseconds = (seconds: number): number => seconds * 1000;
