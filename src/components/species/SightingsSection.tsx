import { useQuery } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import type { Radius } from '../../lib/validation';
import { sightingsQuery } from '../../queries/species';
import { SightingList } from '../SightingList';

type Props = {
  taxonId: number;
  placeId: number;
  radius: Radius;
  city: string;
};

/** Sightings near a city; owns its loading and error states so the page survives a failed fetch. */
export const SightingsSection = ({
  taxonId,
  placeId,
  radius,
  city,
}: Props): ReactNode => {
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
  if (!data)
    return (
      <p role="status" className="mt-12 text-ink-2">
        Loading sightings…
      </p>
    );
  return <SightingList city={city} radius={radius} sightings={data} />;
};
