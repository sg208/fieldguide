import { useQuery } from '@tanstack/react-query';
import { Link, createFileRoute, notFound } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import {
  ConservationBadge,
  conservationFor,
} from '../components/ConservationBadge';
import { SafeHtml } from '../components/SafeHtml';
import { ShareButton } from '../components/ShareButton';
import { SightingList } from '../components/SightingList';
import { ExternalLinkIcon, SearchIcon } from '../components/icons';
import { BackToPlace } from '../components/species/BackToPlace';
import { Lineage } from '../components/species/Lineage';
import { PhotoGallery } from '../components/species/PhotoGallery';
import { COVER_BG_CLASS, continentFromCountry } from '../lib/continents';
import { GROUPS } from '../lib/groups';
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

const Sightings = ({
  taxonId,
  placeId,
  radius,
  city,
}: {
  taxonId: number;
  placeId: number;
  radius: Radius;
  city: string;
}): ReactNode => {
  const { data, isError, refetch } = useQuery(
    sightingsQuery({ taxonId, placeId, radius })
  );
  if (isError) {
    return (
      <section className="mt-12" role="alert">
        <h2 className="text-h2">Recent sightings near {city}</h2>
        <p className="mt-3">
          We couldn’t load sightings. Try again in a moment.
        </p>
        <button
          type="button"
          className="btn mt-3"
          onClick={() => void refetch()}
        >
          Try again
        </button>
      </section>
    );
  }
  if (!data) return <p className="mt-12 text-ink-2">Loading sightings…</p>;
  return <SightingList city={city} radius={radius} sightings={data} />;
};

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
  const status = conservationFor(taxon.conservationStatus);
  const group = GROUPS.find((entry) => entry.iconicTaxon === taxon.iconicTaxon);
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
        <section
          aria-labelledby="h1"
          className="rounded-sheet bg-sheet p-5 shadow-sheet lg:p-7"
        >
          <h1 id="h1" className="text-title">
            {name}
          </h1>
          {taxon.commonName && (
            <p lang="la" className="sci mt-1.5 text-xl text-ink-2">
              {taxon.name}
            </p>
          )}
          <ConservationBadge statusName={taxon.conservationStatus} />
          <dl className="mt-5 grid grid-cols-[auto_1fr]">
            <dt className="border-t border-rule py-2.5 pr-4">Worldwide</dt>
            <dd className="m-0 border-t border-rule py-2.5 font-semibold">
              <span className="mono">
                {new Intl.NumberFormat('en').format(taxon.observationsCount)}
              </span>{' '}
              observations
            </dd>
            {group && (
              <>
                <dt className="border-t border-rule py-2.5 pr-4">Group</dt>
                <dd className="m-0 border-t border-rule py-2.5 font-semibold">
                  {group.label}
                </dd>
              </>
            )}
          </dl>
          {(taxon.isLocationObscured || status?.isThreatened) && (
            <p className="mt-4 rounded-label bg-board px-3.5 py-3 text-sm text-ink-2">
              iNaturalist hides the exact location of threatened species, so a
              sighting can sit several kilometres from the point shown on its
              record.
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              className="btn btn-primary"
              href={`https://www.inaturalist.org/taxa/${id}`}
            >
              iNaturalist <ExternalLinkIcon />
            </a>
            {wikipedia && (
              <a className="btn" href={wikipedia}>
                Wikipedia <ExternalLinkIcon />
              </a>
            )}
            <ShareButton title={name} url={shareUrl} className="btn" />
          </div>
        </section>
      </div>
      <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-10 lg:mt-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
        <section aria-labelledby="h-about">
          <h2 id="h-about" className="mb-3 text-h2">
            About
          </h2>
          {summary ? (
            <>
              <SafeHtml
                sanitizedHtml={summary}
                className="max-w-[68ch] text-read [&_p+p]:mt-3"
              />
              <p className="mt-3 text-sm text-ink-2">
                Summary from{' '}
                {wikipedia ? (
                  <a href={wikipedia} className="underline">
                    Wikipedia
                  </a>
                ) : (
                  'Wikipedia'
                )}
                , CC BY-SA 4.0.
              </p>
            </>
          ) : (
            <p className="text-read">
              No Wikipedia summary for this species yet.{' '}
              <a
                href={`https://www.inaturalist.org/taxa/${id}`}
                className="underline"
              >
                See iNaturalist
              </a>
              .
            </p>
          )}
        </section>
        <Lineage
          taxon={taxon}
          place={placeId === undefined ? undefined : { id: placeId, radius }}
        />
      </div>
      {placeId !== undefined && place ? (
        <Sightings
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
    const id = parseId(params.taxonId);
    if (id === null) throw notFound();
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
