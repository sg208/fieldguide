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
} from '../lib/inatMap';
import { cached } from './edgeCache';
import { NotFoundError } from './errors';
import { fetchJson } from './upstream';

export type {
  Ancestor,
  Photo,
  Sighting,
  SightingsParams,
  SpeciesCount,
  SpeciesCountsParams,
  SpeciesPage,
  Taxon,
} from '../lib/inatMap';

const SPECIES_TTL = 6 * 60 * 60;
const TAXON_TTL = 7 * 24 * 60 * 60;

export const getSpeciesCounts = (
  params: SpeciesCountsParams
): Promise<SpeciesPage> => {
  const query = speciesCountsQuery(params);
  return cached(`inat:species:${query}`, SPECIES_TTL, async () =>
    mapSpeciesPage(await fetchJson<RawSpeciesCounts>(speciesCountsUrl(query)))
  );
};

export const getTaxon = (id: number): Promise<Taxon> =>
  cached(`inat:taxon:${id}`, TAXON_TTL, async () => {
    const taxon = mapTaxon(await fetchJson<RawTaxa>(taxonUrl(id)));
    if (!taxon) throw new NotFoundError(`taxon ${id}`);
    return taxon;
  });

export const getSightings = (params: SightingsParams): Promise<Sighting[]> => {
  const query = sightingsQuery(params);
  return cached(`inat:sightings:${query}`, SPECIES_TTL, async () =>
    mapSightings(await fetchJson<RawSightings>(sightingsUrl(query)))
  );
};
