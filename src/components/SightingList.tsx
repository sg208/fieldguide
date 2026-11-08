import type { ReactNode } from 'react';
import type { Sighting } from '../server/inat';
import { ExternalLinkIcon } from './icons';

type Props = { city: string; radius: number; sightings: Sighting[] };

// WHY: SSR (workerd) and the browser must print the same string or hydration
// fails; 'en-GB' gives HANDOFF's "13 May 2026". See src/lib/months.ts.
const formatDate = (value: string | null): string => {
  if (!value) return 'Date unknown';
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return 'Date unknown';
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
};

/** Recent research-grade sightings (HANDOFF "SightingsLedger"). */
export const SightingList = ({ city, radius, sightings }: Props): ReactNode => (
  <section className="mt-12" aria-labelledby="h-ledger">
    <h2 id="h-ledger" className="text-h2">
      Recent sightings near {city}
    </h2>
    <p className="mt-1 text-[0.9375rem] text-ink-2">
      Research-grade observations within {radius} km, newest first.
    </p>
    {sightings.length === 0 ? (
      <p role="status" className="mt-4 rounded-sheet bg-sheet p-5 shadow-sheet">
        No research-grade sightings within {radius} km yet. See all records on{' '}
        <a href="https://www.inaturalist.org" className="underline">
          iNaturalist
        </a>
        .
      </p>
    ) : (
      <ul className="mt-4 list-none rounded-sheet bg-sheet p-0 shadow-sheet">
        {sightings.map((sighting) => {
          const date = formatDate(sighting.observedOn);
          return (
            <li
              key={sighting.id}
              className="grid grid-cols-[1fr_auto] items-center gap-x-3 border-t border-rule px-4 py-3 first:border-t-0 sm:grid-cols-[10rem_1fr_minmax(0,12rem)_auto] sm:px-4"
            >
              <span className="mono font-medium whitespace-nowrap">{date}</span>
              <span className="col-start-1 sm:col-start-auto">
                {sighting.placeGuess ?? 'No place name given'}
              </span>
              {sighting.observer && (
                <span className="col-start-1 text-ink-2 sm:col-start-auto sm:truncate">
                  <span className="sr-only">Observer: </span>
                  {sighting.observer}
                </span>
              )}
              <a
                href={sighting.url}
                className="col-start-2 underline row-span-2 row-start-1 inline-flex min-h-6 items-center gap-1.5 sm:col-start-auto sm:row-span-1 sm:row-start-auto"
              >
                View
                <span className="sr-only">
                  {' '}
                  observation from {date} on iNaturalist
                </span>
                <ExternalLinkIcon className="!size-[18px]" />
              </a>
            </li>
          );
        })}
      </ul>
    )}
  </section>
);
