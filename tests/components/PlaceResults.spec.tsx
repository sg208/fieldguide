// @vitest-environment happy-dom
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState, type ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PlaceResults } from '../../src/components/place/PlaceResults';
import type { FilterPatch } from '../../src/components/FilterBar';
import type { PlaceSearch } from '../../src/lib/validation';
import { renderWithProviders } from '../helpers/render';

// Protects: empty-state actions ("Widen to…") unmount their own button, so
// focus must land on the results heading instead of dropping to <body>.
const serverFns = vi.hoisted(() => ({
  getSightingsFn: vi.fn(),
  getPlaceFn: vi.fn(),
  getSpeciesCountsFn: vi.fn(),
  getTaxonFn: vi.fn(),
}));
vi.mock('../../src/server/fns', () => serverFns);

const place = {
  id: 7,
  name: 'Medan',
  admin1: null,
  country: 'Indonesia',
  countryCode: 'ID',
  latitude: 3.59,
  longitude: 98.67,
  population: null,
};

const species = {
  taxonId: 4745,
  name: 'Mycteria cinerea',
  commonName: 'Milky Stork',
  observationCount: 12,
  photo: null,
};

const Harness = (): ReactNode => {
  const [search, setSearch] = useState<PlaceSearch>({
    group: 'birds',
    radius: 10,
    month: undefined,
    page: 1,
  });
  const handleFilter = (patch: FilterPatch): void => {
    setSearch((current) => ({ ...current, ...patch }));
  };
  return (
    <PlaceResults
      place={place as never}
      search={search}
      onFilter={handleFilter}
    />
  );
};

describe('PlaceResults', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('moves focus to the results heading after widening an empty search', async () => {
    serverFns.getSpeciesCountsFn.mockImplementation(
      async ({ data }: { data: { radius: number } }) =>
        data.radius === 10
          ? { totalResults: 0, results: [] }
          : { totalResults: 1, results: [species] }
    );
    await renderWithProviders(<Harness />);

    await userEvent.click(
      await screen.findByRole('button', { name: 'Widen to 25 km' })
    );

    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 2 })).toHaveFocus()
    );
    expect(screen.getByText('Milky Stork')).toBeInTheDocument();
  });
});
