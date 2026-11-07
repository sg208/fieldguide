import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import type { Place } from '../server/geocode';

export type ListState = 'loading' | 'error' | 'empty' | 'results';

type Props = {
  id: string;
  query: string;
  state: ListState;
  places: readonly Place[];
  activeIndex: number;
  onActivate: (index: number) => void;
};

export const optionId = (listId: string, index: number): string =>
  `${listId}-option-${index}`;

/** 2004652 -> "2.0M", 250000 -> "250K", 18400 -> "18K"; under 1000 stays exact. */
export const formatPopulation = (population: number): string => {
  if (population >= 1_000_000) return `${(population / 1_000_000).toFixed(1)}M`;
  if (population >= 1_000) return `${Math.round(population / 1_000)}K`;
  return String(population);
};

export const listStateOf = ({
  isStale,
  isPending,
  isError,
  count,
}: {
  isStale: boolean;
  isPending: boolean;
  isError: boolean;
  count: number;
}): ListState => {
  if (isStale || isPending) return 'loading';
  if (isError) return 'error';
  if (count === 0) return 'empty';
  return 'results';
};

export const statusMessage = (
  state: ListState,
  query: string,
  count: number
): string => {
  if (state === 'loading') return `Looking up “${query}”…`;
  if (state === 'error')
    return 'City search isn’t responding. Try again in a moment.';
  if (state === 'empty') {
    return `No city called “${query}”. Check the spelling, or try the nearest larger city.`;
  }
  return `${count} ${count === 1 ? 'city' : 'cities'} found.`;
};

const Highlighted = ({
  text,
  query,
}: {
  text: string;
  query: string;
}): ReactNode => {
  const start = text.toLowerCase().indexOf(query.toLowerCase());
  if (start < 0 || query === '') return text;
  const end = start + query.length;
  return (
    <>
      {text.slice(0, start)}
      <span className="underline decoration-2 underline-offset-4">
        {text.slice(start, end)}
      </span>
      {text.slice(end)}
    </>
  );
};

const secondLine = (place: Place): string => {
  const where = [place.admin1, place.country].filter(Boolean).join(', ');
  return place.population
    ? `${where} · ${formatPopulation(place.population)}`
    : where;
};

const MESSAGE_CLASS = 'px-4 py-3.5 text-sm text-ink-2';

export const PlaceResultList = ({
  id,
  query,
  state,
  places,
  activeIndex,
  onActivate,
}: Props): ReactNode => (
  <ul
    id={id}
    role="listbox"
    aria-label="Cities"
    aria-busy={state === 'loading'}
    onMouseDown={(event) => event.preventDefault()}
    className="absolute inset-x-0 top-full z-20 m-0 mt-2 list-none overflow-hidden rounded-sheet border border-edge bg-sheet p-0 text-ink shadow-lift [font-stretch:100%]"
  >
    {state !== 'results' ? (
      <li
        role="option"
        aria-disabled="true"
        aria-selected="false"
        className={MESSAGE_CLASS}
      >
        {statusMessage(state, query, 0)}
      </li>
    ) : (
      places.map((place, index) => {
        const isActive = index === activeIndex;
        return (
          <li
            key={place.id}
            id={optionId(id, index)}
            role="option"
            aria-selected={isActive}
            onMouseMove={() => onActivate(index)}
            className={isActive ? 'bg-stamp-soft' : undefined}
          >
            <Link
              to="/place/$placeId"
              params={{ placeId: String(place.id) }}
              preload="intent"
              tabIndex={-1}
              className="flex min-h-14 items-center justify-between gap-3 px-4 py-2 no-underline"
            >
              <span className="min-w-0">
                <span className="block text-base font-semibold [font-stretch:87%]">
                  <Highlighted text={place.name} query={query} />
                </span>
                <span className="block truncate text-sm text-ink-2">
                  {secondLine(place)}
                </span>
              </span>
              {place.countryCode && (
                <span className="mono shrink-0 rounded-label border border-edge px-1.5 text-micro">
                  {place.countryCode}
                </span>
              )}
            </Link>
          </li>
        );
      })
    )}
  </ul>
);
