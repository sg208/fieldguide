import { notFound } from '@tanstack/react-router';
import { RateLimitedError, UpstreamError } from '../server/errors';
import {
  mapSightings,
  mapSpeciesPage,
  mapTaxon,
  sightingsQuery,
  sightingsUrl,
  speciesCountsQuery,
  speciesCountsUrl,
  taxonUrl,
  type RawSightings,
  type RawSpeciesCounts,
  type RawTaxa,
  type Sighting,
  type SightingsParams,
  type SpeciesCountsParams,
  type SpeciesPage,
  type Taxon,
} from './inatMap';

// Browser-side iNaturalist reads, used only by withBrowserFallback. No custom
// headers: a plain GET stays a CORS simple request (no preflight).
const getJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(8000),
    headers: { Accept: 'application/json' },
  });
  if (response.status === 404) throw notFound();
  if (response.status === 429) throw new RateLimitedError();
  if (!response.ok) throw new UpstreamError(response.status);
  return (await response.json()) as T;
};

export const browserSpeciesCounts = async (
  params: SpeciesCountsParams
): Promise<SpeciesPage> =>
  mapSpeciesPage(
    await getJson<RawSpeciesCounts>(
      speciesCountsUrl(speciesCountsQuery(params))
    )
  );

export const browserTaxon = async (id: number): Promise<Taxon> => {
  const taxon = mapTaxon(await getJson<RawTaxa>(taxonUrl(id)));
  if (!taxon) throw notFound();
  return taxon;
};

export const browserSightings = async (
  params: SightingsParams
): Promise<Sighting[]> =>
  mapSightings(
    await getJson<RawSightings>(sightingsUrl(sightingsQuery(params)))
  );
