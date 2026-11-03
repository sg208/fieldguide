export const SITE_NAME = 'Field Guide';
export const SITE_URL = 'https://fieldguide.engg.app';
export const SITE_TAGLINE = 'what lives near any city';
export const SITE_DESCRIPTION =
  'Pick any city and see the birds, plants, insects and other species people have observed near it, from iNaturalist research-grade records.';
export const AUTHOR_NAME = 'Syailendra Ginting';

export const REPO_URL = 'https://github.com/sg208/fieldguide';
export const LICENSE_URL = `${REPO_URL}/blob/main/LICENSE`;

export const CREDITS = {
  inaturalist: { name: 'iNaturalist', url: 'https://www.inaturalist.org' },
  openMeteo: { name: 'Open-Meteo', url: 'https://open-meteo.com' },
  geonames: { name: 'GeoNames', url: 'https://www.geonames.org' },
} as const;

export const GEO_LICENCE = 'CC BY 4.0';

/** Page title: "{title} · Field Guide". */
export const pageTitle = (title: string): string => `${title} · ${SITE_NAME}`;
