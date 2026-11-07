import { useQuery } from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { SearchIcon } from '../components/icons';
import { BackToPlace } from '../components/species/BackToPlace';
import { Lineage } from '../components/species/Lineage';
import { PhotoGallery } from '../components/species/PhotoGallery';
import { SightingsSection } from '../components/species/SightingsSection';
import { SpeciesAbout } from '../components/species/SpeciesAbout';
import { SpeciesSummary } from '../components/species/SpeciesSummary';
import { COVER_BG_CLASS, continentFromCountry } from '../lib/continents';
import { requireId } from '../lib/requireId';
import { safeWikipediaUrl, sanitizeHtml } from '../lib/sanitize';
import { SITE_URL, pageTitle } from '../lib/site';
import { parseId, parseRadius, type Radius } from '../lib/validation';
import { placeQuery } from '../queries/places';
import { sightingsQuery, taxonQuery } from '../queries/species';

type SpeciesSearch = { place?: number; radius: Radius };

const stripTags = (html: string): string =>
  html
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const SpeciesPage = (): ReactNode => {
  const { taxonId } = Route.useParams();
  const { place: placeId, radius } = Route.useSearch();
  const id = Number(taxonId);
  const { taxon } = Route.useLoaderData();
  const { data: place } = useQuery({
    ...placeQuery(placeId ?? 0),
    enabled: placeId !== undefined,
  });
  const name = taxon.commonName ?? taxon.name;
  const summary = taxon.wikipediaSummary
    ? sanitizeHtml(taxon.wikipediaSummary)
    : null;
  const wikipedia = safeWikipediaUrl(taxon.wikipediaUrl);
  const shareUrl = `${SITE_URL}/species/${id}${placeId ? `?place=${placeId}&radius=${radius}` : ''}`;

  return (
    <div className="wrap pb-4">
      {placeId !== undefined && place && (
        <BackToPlace
          placeId={placeId}
          city={place.name}
          radius={radius}
          taxonId={id}
          coverClass={COVER_BG_CLASS[continentFromCountry(place.countryCode)]}
        />
      )}
      <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-6 lg:mt-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-start lg:gap-12">
        <PhotoGallery photos={taxon.photos.slice(0, 6)} name={name} />
        <SpeciesSummary
          taxon={taxon}
          taxonId={id}
          wikipediaUrl={wikipedia}
          shareUrl={shareUrl}
        />
      </div>
      <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-10 lg:mt-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
        <SpeciesAbout
          taxonId={id}
          sanitizedSummary={summary}
          wikipediaUrl={wikipedia}
        />
        <Lineage
          taxon={taxon}
          place={placeId === undefined ? undefined : { id: placeId, radius }}
        />
      </div>
      {placeId !== undefined && place ? (
        <SightingsSection
          taxonId={id}
          placeId={placeId}
          radius={radius}
          city={place.name}
        />
      ) : (
        <p className="mt-12 text-read">
          Pick a city to see sightings near it.{' '}
          <Link
            to="/"
            hash="city"
            className="inline-flex items-center gap-1.5 underline"
          >
            <SearchIcon className="!size-[18px]" />
            Search a city
          </Link>
        </p>
      )}
    </div>
  );
};

export const Route = createFileRoute('/species/$taxonId')({
  validateSearch: (search: Record<string, unknown>): SpeciesSearch => {
    const place = parseId(search.place);
    return place === null
      ? { radius: parseRadius(search.radius) }
      : { place, radius: parseRadius(search.radius) };
  },
  loaderDeps: ({ search }) => ({ place: search.place, radius: search.radius }),
  loader: async ({ context, params, deps }) => {
    const id = requireId(params.taxonId);
    const { queryClient } = context;
    const taxon = await queryClient.ensureQueryData(taxonQuery(id));
    if (deps.place === undefined) return { taxon, city: null };
    const place = await queryClient.ensureQueryData(placeQuery(deps.place));
    // Sightings failing must not take the page down: the component shows its own error state.
    await queryClient.prefetchQuery(
      sightingsQuery({ taxonId: id, placeId: deps.place, radius: deps.radius })
    );
    return { taxon, city: place.name };
  },
  head: ({ loaderData }) => {
    const taxon = loaderData?.taxon;
    if (!taxon) return {};
    const name = taxon.commonName ?? taxon.name;
    const city = loaderData?.city;
    const title = `${name} (${taxon.name})${city ? ` near ${city}` : ''}`;
    const description =
      stripTags(taxon.wikipediaSummary ?? '').slice(0, 200) ||
      `${name} (${taxon.name}): photos, lineage and recent sightings from iNaturalist research-grade observations.`;
    const image = taxon.photos[0]?.mediumUrl;
    return {
      meta: [
        { title: pageTitle(title) },
        { name: 'description', content: description },
        { property: 'og:title', content: pageTitle(title) },
        { property: 'og:description', content: description },
        ...(image ? [{ property: 'og:image', content: image }] : []),
      ],
    };
  },
  component: SpeciesPage,
});
