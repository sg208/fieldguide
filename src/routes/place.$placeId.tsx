import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { createFileRoute, redirect, useLocation } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { FilterBar, type FilterPatch } from '../components/FilterBar';
import { PlaceCover } from '../components/place/PlaceCover';
import { PlaceResults } from '../components/place/PlaceResults';
import { DEFAULT_GROUP } from '../lib/groups';
import { totalPagesFor } from '../lib/paging';
import { requireId } from '../lib/requireId';
import { SITE_URL, pageTitle } from '../lib/site';
import {
  DEFAULT_RADIUS,
  placeSearchSchema,
  type PlaceSearch,
} from '../lib/validation';
import { placeQuery } from '../queries/places';
import { speciesListQuery } from '../queries/species';
import type { SpeciesPage } from '../server/inat';

// Router infers Link `search` from the return type: optional keys keep it
// optional on every <Link to="/place/$placeId">. Values are always filled.
type SearchInput = Partial<Record<keyof PlaceSearch, unknown>>;

// Defaults stay out of the URL (so /place/1 needs no redirect); readers fill
// them back in with placeSearchSchema.
const toUrlSearch = (input: SearchInput): Partial<PlaceSearch> => {
  const { group, radius, month, page } = placeSearchSchema(input);
  return {
    group: group === DEFAULT_GROUP ? undefined : group,
    radius: radius === DEFAULT_RADIUS ? undefined : radius,
    month,
    page: page === 1 ? undefined : page,
  };
};

export const Route = createFileRoute('/place/$placeId')({
  validateSearch: toUrlSearch,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, params, deps }) => {
    const placeId = requireId(params.placeId);
    const { group, radius, month, page } = placeSearchSchema(deps.search);
    const place = await context.queryClient.ensureQueryData(
      placeQuery(placeId)
    );
    const filtered = speciesListQuery({ placeId, group, radius, month, page });
    const overall = speciesListQuery({
      placeId,
      group: 'all',
      radius,
      page: 1,
    });
    if (typeof window === 'undefined') {
      // SSR: the species names must be in the HTML and in the dehydrated state.
      const list = await context.queryClient.ensureQueryData(filtered);
      await context.queryClient.prefetchQuery(overall);
      const lastPage = totalPagesFor(list.totalResults);
      if (page > Math.max(lastPage, 1)) {
        throw redirect({
          to: '/place/$placeId',
          params,
          search: { ...deps.search, page: Math.max(lastPage, 1) },
        });
      }
    } else {
      // Client filter change: keep the page responsive; the grid shows a skeleton.
      void context.queryClient.prefetchQuery(filtered);
      void context.queryClient.prefetchQuery(overall);
    }
    return {
      place,
      radius,
      total:
        context.queryClient.getQueryData<SpeciesPage>(overall.queryKey)
          ?.totalResults ?? null,
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { place, radius, total } = loaderData;
    const label = [place.name, place.country].filter(Boolean).join(', ');
    const count =
      total === null ? 'species' : `${total.toLocaleString('en')} species`;
    const description = `${count} observed within ${radius} km of ${place.name}, from iNaturalist research-grade records.`;
    const title = pageTitle(`${label}: ${count} within ${radius} km`);
    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: `${SITE_URL}/place/${place.id}` },
      ],
      links: [{ rel: 'canonical', href: `${SITE_URL}/place/${place.id}` }],
    };
  },
  component: PlacePage,
});

function PlacePage(): ReactNode {
  const { place } = Route.useLoaderData();
  const search = placeSearchSchema(Route.useSearch());
  const navigate = Route.useNavigate();
  const location = useLocation();
  const overall = useQuery({
    ...speciesListQuery({
      placeId: place.id,
      group: 'all',
      radius: search.radius,
      page: 1,
    }),
    placeholderData: keepPreviousData,
  });

  const handleFilter = (patch: FilterPatch): void => {
    void navigate({
      search: (previous) => ({ ...previous, ...patch, page: 1 }),
      resetScroll: false,
    });
  };

  return (
    <>
      <a className="skip" href="#results">
        Skip to species
      </a>
      <PlaceCover
        place={place}
        radius={search.radius}
        speciesCount={
          overall.isPlaceholderData ? undefined : overall.data?.totalResults
        }
        shareUrl={`${SITE_URL}${location.pathname}${location.searchStr}`}
      />
      <div className="mt-5">
        <FilterBar
          group={search.group}
          radius={search.radius}
          month={search.month}
          currentMonth={new Date().getMonth() + 1}
          onChange={handleFilter}
        />
      </div>
      <PlaceResults place={place} search={search} onFilter={handleFilter} />
    </>
  );
}
