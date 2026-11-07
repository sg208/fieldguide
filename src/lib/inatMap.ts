import type { IconicTaxon } from './groups';
import { PER_PAGE } from './paging';

// Pure iNaturalist URL builders and response mappers, shared by the Worker
// (src/server/inat.ts) and the browser fallback (src/lib/inatBrowser.ts).

export const INAT_BASE = 'https://api.inaturalist.org/v1';

export type Photo = {
  squareUrl: string;
  mediumUrl: string;
  attribution: string;
  licenseCode: string | null;
};

export type SpeciesCount = {
  taxonId: number;
  name: string;
  commonName: string | null;
  rank: string;
  iconicTaxon: string | null;
  observationCount: number;
  photo: Photo | null;
};

export type SpeciesPage = { totalResults: number; results: SpeciesCount[] };

export type Ancestor = {
  id: number;
  name: string;
  rank: string;
  commonName: string | null;
};

export type Taxon = {
  id: number;
  name: string;
  commonName: string | null;
  rank: string;
  iconicTaxon: string | null;
  wikipediaUrl: string | null;
  conservationStatus: string | null;
  establishmentMeans: string | null;
  observationsCount: number;
  ancestors: Ancestor[];
  isLocationObscured: boolean;
  photos: Photo[];
  wikipediaSummary: string | null;
};

export type Sighting = {
  id: number;
  observedOn: string | null;
  placeGuess: string | null;
  observer: string | null;
  url: string;
  photo: Photo | null;
};

type RawPhoto = {
  square_url?: string;
  medium_url?: string;
  url?: string;
  attribution?: string;
  license_code?: string | null;
};

type RawTaxon = {
  id: number;
  name: string;
  rank: string;
  preferred_common_name?: string;
  iconic_taxon_name?: string;
  default_photo?: RawPhoto | null;
};

type RawFullTaxon = RawTaxon & {
  wikipedia_url?: string | null;
  wikipedia_summary?: string | null;
  conservation_status?: { status?: string; geoprivacy?: string } | null;
  establishment_means?: { establishment_means?: string } | null;
  observations_count?: number;
  ancestors?: RawTaxon[];
  taxon_photos?: { photo: RawPhoto }[];
};

export type RawSpeciesCounts = {
  total_results: number;
  results: { count: number; taxon: RawTaxon }[];
};

export type RawTaxa = { results: RawFullTaxon[] };

export type RawSightings = {
  results: {
    id: number;
    observed_on?: string | null;
    place_guess?: string | null;
    user?: { login?: string; name?: string | null } | null;
    uri: string;
    photos?: RawPhoto[];
  }[];
};

const toPhoto = (raw: RawPhoto | null | undefined): Photo | null => {
  const squareUrl = raw?.square_url ?? raw?.url;
  if (!raw || !squareUrl) return null;
  return {
    squareUrl,
    mediumUrl: raw.medium_url ?? squareUrl.replace('square.', 'medium.'),
    attribution: raw.attribution ?? '',
    licenseCode: raw.license_code ?? null,
  };
};

export type SpeciesCountsParams = {
  lat: number;
  lng: number;
  radius: number;
  iconicTaxa?: IconicTaxon[];
  month?: number;
  page: number;
  perPage?: number;
};

export const speciesCountsQuery = (
  params: SpeciesCountsParams
): URLSearchParams => {
  const {
    lat,
    lng,
    radius,
    iconicTaxa,
    month,
    page,
    perPage = PER_PAGE,
  } = params;
  const query = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    radius: String(radius),
    quality_grade: 'research',
    locale: 'en',
    page: String(page),
    per_page: String(perPage),
  });
  if (iconicTaxa?.length) query.set('iconic_taxa', iconicTaxa.join(','));
  if (month) query.set('month', String(month));
  return query;
};

export const speciesCountsUrl = (query: URLSearchParams): string =>
  `${INAT_BASE}/observations/species_counts?${query}`;

export const mapSpeciesPage = (data: RawSpeciesCounts): SpeciesPage => ({
  totalResults: data.total_results,
  results: data.results.map(({ count, taxon }) => ({
    taxonId: taxon.id,
    name: taxon.name,
    commonName: taxon.preferred_common_name ?? null,
    rank: taxon.rank,
    iconicTaxon: taxon.iconic_taxon_name ?? null,
    observationCount: count,
    photo: toPhoto(taxon.default_photo),
  })),
});

export const taxonUrl = (id: number): string =>
  `${INAT_BASE}/taxa/${id}?locale=en`;

/** Null when iNaturalist has no taxon with that id. */
export const mapTaxon = (data: RawTaxa): Taxon | null => {
  const raw = data.results[0];
  if (!raw) return null;
  return {
    id: raw.id,
    name: raw.name,
    commonName: raw.preferred_common_name ?? null,
    rank: raw.rank,
    iconicTaxon: raw.iconic_taxon_name ?? null,
    wikipediaUrl: raw.wikipedia_url ?? null,
    conservationStatus: raw.conservation_status?.status ?? null,
    establishmentMeans: raw.establishment_means?.establishment_means ?? null,
    observationsCount: raw.observations_count ?? 0,
    ancestors: (raw.ancestors ?? []).map((ancestor) => ({
      id: ancestor.id,
      name: ancestor.name,
      rank: ancestor.rank,
      commonName: ancestor.preferred_common_name ?? null,
    })),
    isLocationObscured:
      raw.conservation_status?.geoprivacy === 'obscured' ||
      raw.conservation_status?.geoprivacy === 'private',
    photos: (raw.taxon_photos ?? [])
      .map((entry) => toPhoto(entry.photo))
      .filter((photo): photo is Photo => photo !== null),
    wikipediaSummary: raw.wikipedia_summary ?? null,
  };
};

export type SightingsParams = {
  taxonId: number;
  lat: number;
  lng: number;
  radius: number;
  perPage?: number;
};

export const sightingsQuery = (params: SightingsParams): URLSearchParams => {
  const { taxonId, lat, lng, radius, perPage = 6 } = params;
  return new URLSearchParams({
    taxon_id: String(taxonId),
    lat: String(lat),
    lng: String(lng),
    radius: String(radius),
    quality_grade: 'research',
    locale: 'en',
    photos: 'true',
    order_by: 'observed_on',
    per_page: String(perPage),
  });
};

export const sightingsUrl = (query: URLSearchParams): string =>
  `${INAT_BASE}/observations?${query}`;

export const mapSightings = (data: RawSightings): Sighting[] =>
  data.results.map((raw) => ({
    id: raw.id,
    observedOn: raw.observed_on ?? null,
    placeGuess: raw.place_guess ?? null,
    observer: raw.user?.name || raw.user?.login || null,
    url: raw.uri,
    photo: toPhoto(raw.photos?.[0]),
  }));
