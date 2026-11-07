import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useRef, type ReactNode } from 'react';
import { speciesListQuery } from '../../queries/species';
import type { PlaceSearch } from '../../lib/validation';
import type { Place } from '../../server/geocode';
import type { FilterPatch } from '../FilterBar';
import { Pagination } from '../Pagination';
import { SpeciesGrid } from '../SpeciesGrid';
import { EmptyState, ErrorState, groupLabel } from './ResultStates';
import { monthLabel } from '../../lib/months';
import { LIST_CAP, PER_PAGE, totalPagesFor } from '../../lib/paging';
import { isRateLimited } from '../../lib/rateLimit';

type Props = {
  place: Place;
  search: PlaceSearch;
  onFilter: (patch: FilterPatch) => void;
};

/** Results region: heading, live count, grid or state block, pager. */
export const PlaceResults = ({ place, search, onFilter }: Props): ReactNode => {
  const { group, radius, month, page } = search;
  const query = useQuery({
    ...speciesListQuery({ placeId: place.id, group, radius, month, page }),
    placeholderData: keepPreviousData,
  });
  const headingRef = useRef<HTMLHeadingElement>(null);
  const shouldFocusRef = useRef(false);

  const isLoading = query.isPending || query.isPlaceholderData;
  useEffect(() => {
    if (!shouldFocusRef.current || isLoading) return;
    shouldFocusRef.current = false;
    headingRef.current?.focus();
    headingRef.current?.scrollIntoView({ block: 'start' });
  }, [isLoading, page]);

  const total = query.data?.totalResults ?? 0;
  const totalPages = totalPagesFor(total);
  const first = (page - 1) * PER_PAGE + 1;
  const last = Math.min(first + PER_PAGE - 1, total);
  const heading = `${group === 'all' ? 'All groups' : groupLabel(group)}${
    month === undefined ? '' : ` in ${monthLabel(month)}`
  }, most observed first`;
  const isEmpty = !isLoading && !query.isError && total === 0;

  return (
    <section className="wrap scroll-mt-40">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 pt-5 pb-3">
        <h2
          id="results"
          ref={headingRef}
          tabIndex={-1}
          className="scroll-mt-40 text-h2 focus:outline-none"
        >
          {heading}
        </h2>
        {total > 0 && (
          <p className="text-sm text-ink-2">
            Page {page} of {totalPages} · species {first}–{last} of {total}
          </p>
        )}
      </div>
      <p role="status" className="sr-only">
        {!isLoading && total > 0
          ? `${total} species, page ${page} of ${totalPages}`
          : ''}
      </p>
      {query.isError && !query.isPlaceholderData ? (
        <ErrorState
          isRateLimited={isRateLimited(query.error)}
          onRetry={() => void query.refetch()}
        />
      ) : isEmpty ? (
        <EmptyState
          placeName={place.name}
          group={group}
          radius={radius}
          month={month}
          onWiden={(next) => onFilter({ radius: next })}
          onAllMonths={() => onFilter({ month: undefined })}
          onAllGroups={() => onFilter({ group: 'all' })}
        />
      ) : (
        <>
          {isLoading && (
            <p role="status" className="sr-only">
              Loading species…
            </p>
          )}
          <SpeciesGrid
            species={query.data?.results ?? []}
            placeId={place.id}
            radius={radius}
            startRank={first}
            isLoading={isLoading}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            onNavigate={() => {
              shouldFocusRef.current = true;
            }}
          />
          {total > LIST_CAP && (
            <p className="mt-4 max-w-[68ch] text-sm text-ink-2">
              Field Guide lists the 300 most observed species for each search.
              Counts are research-grade iNaturalist observations inside the
              circle, not population sizes.
            </p>
          )}
        </>
      )}
    </section>
  );
};
