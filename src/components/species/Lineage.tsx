import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { GROUPS } from '../../lib/groups';
import type { Radius } from '../../lib/validation';
import type { Taxon } from '../../server/inat';

const RANKS = [
  'kingdom',
  'phylum',
  'class',
  'order',
  'family',
  'genus',
  'species',
];
const ITALIC_RANKS = new Set(['genus', 'species']);

type Props = {
  taxon: Taxon;
  /** Present when the page has a place: class rows link to that group there. */
  place?: { id: number; radius: Radius };
};

/** Ancestry breadcrumb (HANDOFF "Lineage"): an ordered list, current taxon last. */
export const Lineage = ({ taxon, place }: Props): ReactNode => {
  const rows = [
    ...taxon.ancestors,
    {
      id: taxon.id,
      name: taxon.name,
      rank: taxon.rank,
      commonName: taxon.commonName,
    },
  ].filter((row) => RANKS.includes(row.rank));
  return (
    <nav aria-labelledby="h-lineage">
      <h2 id="h-lineage" className="mb-3 text-h2">
        Lineage
      </h2>
      <ol className="m-0 list-none rounded-sheet bg-sheet p-0 shadow-sheet">
        {rows.map((row) => {
          const isCurrent = row.id === taxon.id;
          const group = GROUPS.find((entry) => entry.iconicTaxon === row.name);
          const nameClass = `font-semibold ${ITALIC_RANKS.has(row.rank) ? 'sci' : ''}`;
          return (
            <li
              key={row.id}
              aria-current={isCurrent ? 'page' : undefined}
              className={`grid grid-cols-[88px_1fr] gap-3 border-t border-rule px-4 py-[9px] first:border-t-0 ${isCurrent ? 'bg-stamp-soft' : ''}`}
            >
              <span className="field pt-[3px]">{row.rank}</span>
              <span>
                {place && group && row.rank === 'class' ? (
                  <Link
                    to="/place/$placeId"
                    params={{ placeId: String(place.id) }}
                    search={{ group: group.key, radius: place.radius }}
                    className={`${nameClass} underline`}
                  >
                    {row.name}
                  </Link>
                ) : (
                  <span
                    className={nameClass}
                    lang={ITALIC_RANKS.has(row.rank) ? 'la' : undefined}
                  >
                    {row.name}
                  </span>
                )}
                {(isCurrent ? taxon.commonName : row.commonName) && (
                  <span className="ml-1 text-sm text-ink-2">
                    {isCurrent ? taxon.commonName : row.commonName}
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
