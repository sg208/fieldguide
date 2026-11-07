import type { ReactNode } from 'react';
import type { Radius } from '../lib/validation';
import { SpeciesCard, type CardSpecies } from './SpeciesCard';

const EAGER_COUNT = 4;
const SKELETON_COUNT = 10;

type Props = {
  species: CardSpecies[];
  placeId: number;
  radius: Radius;
  /** Rank of the first card: (page - 1) * PER_PAGE + 1. */
  startRank: number;
  isLoading: boolean;
};

const SkeletonCard = (): ReactNode => (
  <li
    aria-hidden="true"
    className="rounded-sheet bg-sheet shadow-sheet motion-safe:animate-pulse"
  >
    <div className="aspect-square bg-rule" />
    <div className="grid gap-2 border-t border-rule p-3">
      <div className="mt-1.5 h-3 w-[30%] rounded-label bg-rule" />
      <div className="h-3 w-[80%] rounded-label bg-rule" />
      <div className="h-3 w-[60%] rounded-label bg-rule" />
    </div>
  </li>
);

/** Species list: 2 / 3 / 4 / 5 columns; a skeleton of the same box while a filter change loads. */
export const SpeciesGrid = ({
  species,
  placeId,
  radius,
  startRank,
  isLoading,
}: Props): ReactNode => (
  <ul
    aria-busy={isLoading}
    className="m-0 grid list-none grid-cols-2 gap-3 p-0 min-[340px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5 xl:grid-cols-5"
  >
    {isLoading
      ? Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <SkeletonCard key={index} />
        ))
      : species.map((entry, index) => (
          <SpeciesCard
            key={entry.taxonId}
            species={entry}
            rank={startRank + index}
            placeId={placeId}
            radius={radius}
            isEager={index < EAGER_COUNT}
          />
        ))}
  </ul>
);
