import type { ReactNode } from 'react';
import {
  CONTINENTS,
  COVER_BG_CLASS,
  continentFromCountry,
} from '../../lib/continents';
import type { Place } from '../../server/geocode';
import { ShareButton } from '../ShareButton';

type Props = {
  place: Place;
  radius: number;
  /** Species within the radius, any group, any month; undefined while loading. */
  speciesCount: number | undefined;
  shareUrl: string;
};

const formatCoordinate = (
  value: number,
  positive: string,
  negative: string
): string =>
  `${Math.abs(value).toFixed(3)}° ${value >= 0 ? positive : negative}`;

export const formatPopulation = (population: number): string =>
  population >= 1_000_000
    ? `${(population / 1_000_000).toFixed(2)} million`
    : population.toLocaleString('en');

/** HANDOFF FolderCover: continent-coloured tab and cover inside the page container. */
export const PlaceCover = ({
  place,
  radius,
  speciesCount,
  shareUrl,
}: Props): ReactNode => {
  const continent = continentFromCountry(place.countryCode);
  const region = [place.admin1, place.country].filter(Boolean).join(', ');
  const shareText =
    speciesCount === undefined
      ? `What lives near ${place.name}`
      : `What lives near ${place.name}: ${speciesCount} species within ${radius} km`;
  return (
    <section aria-labelledby="place-title" className="wrap mt-5">
      <span
        className={`inline-flex h-[30px] items-center rounded-t-[6px] px-3.5 text-micro font-semibold tracking-[0.08em] text-white uppercase ${COVER_BG_CLASS[continent]}`}
      >
        {CONTINENTS[continent]}
      </span>
      <div
        className={`rounded-[0_3px_3px_3px] text-white shadow-sheet ${COVER_BG_CLASS[continent]}`}
      >
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 px-5 pt-5 pb-6 lg:items-end lg:px-8 lg:pt-7 lg:pb-8">
          <div>
            <h1 id="place-title" className="text-place">
              {place.name}
            </h1>
            {region !== '' && (
              <p className="mt-1.5 text-read opacity-90">{region}</p>
            )}
            <p className="mt-3 max-w-[40ch] text-read">
              {speciesCount === undefined ? (
                <span className="opacity-90">Counting species…</span>
              ) : (
                <>
                  <strong className="mono text-[1.25em] font-semibold">
                    {speciesCount.toLocaleString('en')}
                  </strong>{' '}
                  species observed within {radius}&nbsp;km
                </>
              )}
            </p>
          </div>
          <div className="contents lg:col-start-2 lg:row-start-1 lg:flex lg:flex-col lg:items-end lg:gap-4">
            <dl className="col-span-full row-start-2 m-0 flex flex-wrap gap-x-4 gap-y-1 text-sm lg:col-auto lg:row-auto lg:grid lg:min-w-[340px] lg:grid-cols-[auto_auto] lg:gap-0 lg:rounded-label lg:border lg:border-white/45 lg:bg-white/10">
              <Fact term="Coordinates" mono>
                {formatCoordinate(place.latitude, 'N', 'S')} ·{' '}
                {formatCoordinate(place.longitude, 'E', 'W')}
              </Fact>
              {place.population !== null && place.population > 0 && (
                <Fact term="Population">
                  {formatPopulation(place.population)}
                </Fact>
              )}
              <Fact term="Records" isDesktopOnly>
                iNaturalist, research grade
              </Fact>
            </dl>
            <div className="col-start-2 row-start-1 lg:col-auto lg:row-auto">
              <ShareButton
                title={place.name}
                url={shareUrl}
                text={shareText}
                className="btn min-w-11 border-white/70 bg-transparent px-3 text-white hover:border-white hover:bg-white/10 focus-visible:outline-white sm:px-4"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Fact = ({
  term,
  mono = false,
  isDesktopOnly = false,
  children,
}: {
  term: string;
  mono?: boolean;
  isDesktopOnly?: boolean;
  children: ReactNode;
}): ReactNode => (
  <div className={`lg:contents ${isDesktopOnly ? 'hidden' : ''}`}>
    <dt className="field sr-only !text-white lg:not-sr-only lg:border-r lg:border-b lg:border-white/30 lg:px-3 lg:py-2">
      {term}
    </dt>
    <dd
      className={`m-0 lg:border-b lg:border-white/30 lg:px-3 lg:py-2 ${mono ? 'mono' : ''}`}
    >
      {children}
    </dd>
  </div>
);
