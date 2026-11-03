import type { Continent } from './continents';

// Hard-coded so the home page needs no API call. Ids verified against
// the Open-Meteo place lookup (get by id); names and regions follow HANDOFF.
export type FeaturedCity = {
  geonameId: number;
  name: string;
  region: string;
  country: string;
  countryCode: string;
  continent: Continent;
  lat: number;
  lng: number;
};

export const FEATURED_CITIES: readonly FeaturedCity[] = [
  {
    geonameId: 1214520,
    name: 'Medan',
    region: 'North Sumatra',
    country: 'Indonesia',
    countryCode: 'ID',
    continent: 'asia',
    lat: 3.58333,
    lng: 98.66667,
  },
  {
    geonameId: 2332459,
    name: 'Lagos',
    region: 'Lagos',
    country: 'Nigeria',
    countryCode: 'NG',
    continent: 'africa',
    lat: 6.45407,
    lng: 3.39467,
  },
  {
    geonameId: 3413829,
    name: 'Reykjavik',
    region: 'Capital Region',
    country: 'Iceland',
    countryCode: 'IS',
    continent: 'europe',
    lat: 64.13548,
    lng: -21.89541,
  },
  {
    geonameId: 3911925,
    name: 'La Paz',
    region: 'La Paz Department',
    country: 'Bolivia',
    countryCode: 'BO',
    continent: 'samerica',
    lat: -16.5,
    lng: -68.15,
  },
  {
    geonameId: 2028462,
    name: 'Ulaanbaatar',
    region: 'Ulaanbaatar',
    country: 'Mongolia',
    countryCode: 'MN',
    continent: 'asia',
    lat: 47.90771,
    lng: 106.88324,
  },
  {
    geonameId: 6173331,
    name: 'Vancouver',
    region: 'British Columbia',
    country: 'Canada',
    countryCode: 'CA',
    continent: 'namerica',
    lat: 49.24966,
    lng: -123.11934,
  },
  {
    geonameId: 184745,
    name: 'Nairobi',
    region: 'Nairobi County',
    country: 'Kenya',
    countryCode: 'KE',
    continent: 'africa',
    lat: -1.28333,
    lng: 36.81667,
  },
  {
    geonameId: 2172797,
    name: 'Cairns',
    region: 'Queensland',
    country: 'Australia',
    countryCode: 'AU',
    continent: 'oceania',
    lat: -16.92366,
    lng: 145.76613,
  },
];

/** `3.58° N  98.66° E`, two decimals, narrow no-break space before the hemisphere. */
const NARROW_NBSP = String.fromCharCode(0x202f);
const NBSP = String.fromCharCode(0xa0);

export const formatCoordinates = (lat: number, lng: number): string => {
  const part = (value: number, positive: string, negative: string): string =>
    `${Math.abs(value).toFixed(2)}°${NARROW_NBSP}${value >= 0 ? positive : negative}`;
  return `${part(lat, 'N', 'S')}${NBSP}${NBSP}${part(lng, 'E', 'W')}`;
};

// Specimen photos named by HANDOFF §8.2 (shipped as-is with their credits).
// Hosted by iNaturalist (CSP img-src allows the host); each keeps its credit.
export type Specimen = {
  photoUrl: string;
  alt: string;
  commonName: string;
  scientificName: string;
  photographer: string;
  licence: string;
};

const PHOTO_HOST = 'https://inaturalist-open-data.s3.amazonaws.com/photos';

export const HERO_SPECIMENS: readonly Specimen[] = [
  {
    photoUrl: `${PHOTO_HOST}/77613552/small.jpg`,
    alt: 'Eastern Cattle-Egret in breeding plumage',
    commonName: 'Eastern Cattle-Egret',
    scientificName: 'Ardea coromanda',
    photographer: 'Ben Tsai蔡維哲',
    licence: 'CC BY-NC',
  },
  {
    photoUrl: `${PHOTO_HOST}/115048419/small.jpg`,
    alt: 'Asian Weaver Ant on a leaf',
    commonName: 'Asian Weaver Ant',
    scientificName: 'Oecophylla smaragdina',
    photographer: 'Thomas Job',
    licence: 'CC BY-NC',
  },
];

export const LABEL_SPECIMEN: Specimen = {
  photoUrl: `${PHOTO_HOST}/191239279/small.jpg`,
  alt: 'Yellow-vented Bulbul perched on a branch',
  commonName: 'Yellow-vented Bulbul',
  scientificName: 'Pycnonotus goiavier',
  photographer: 'Sam Hambly',
  licence: 'CC BY-NC',
};
