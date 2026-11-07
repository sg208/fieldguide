import { CACHE_TTL_SECONDS } from '../lib/cacheTtl';
import { cached } from './edgeCache';
import { NotFoundError, UpstreamError } from './errors';
import { fetchJson } from './upstream';

const BASE = 'https://geocoding-api.open-meteo.com/v1';

export type Place = {
  id: number;
  name: string;
  admin1: string | null;
  country: string | null;
  countryCode: string | null;
  latitude: number;
  longitude: number;
  population: number | null;
  timezone: string | null;
};

type RawPlace = {
  id: number;
  name: string;
  admin1?: string;
  country?: string;
  country_code?: string;
  latitude: number;
  longitude: number;
  population?: number;
  timezone?: string;
};

const toPlace = (raw: RawPlace): Place => ({
  id: raw.id,
  name: raw.name,
  admin1: raw.admin1 ?? null,
  country: raw.country ?? null,
  countryCode: raw.country_code ?? null,
  latitude: raw.latitude,
  longitude: raw.longitude,
  population: raw.population ?? null,
  timezone: raw.timezone ?? null,
});

export const searchPlaces = (name: string): Promise<Place[]> => {
  const query = name.trim();
  const params = new URLSearchParams({
    name: query,
    count: '8',
    language: 'en',
  });
  return cached(
    `geo:search:${query.toLowerCase()}`,
    CACHE_TTL_SECONDS.search,
    async () => {
      const data = await fetchJson<{ results?: RawPlace[] }>(
        `${BASE}/search?${params}`
      );
      return (data.results ?? []).map(toPlace);
    }
  );
};

export const getPlace = (id: number): Promise<Place> =>
  cached(`geo:place:${id}`, CACHE_TTL_SECONDS.place, async () => {
    const params = new URLSearchParams({ id: String(id), language: 'en' });
    try {
      return toPlace(await fetchJson<RawPlace>(`${BASE}/get?${params}`));
    } catch (error) {
      // Open-Meteo answers an unknown id with 400 "Location ID not found."
      if (error instanceof UpstreamError && error.status === 400) {
        throw new NotFoundError(`place ${id}`);
      }
      throw error;
    }
  });
