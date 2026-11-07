// @vitest-environment happy-dom
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SightingsSection } from '../../src/components/species/SightingsSection';
import { renderWithProviders } from '../helpers/render';

// Behavior protected: the species page sightings block shows loading, a
// recoverable alert, then the list. Regression: error state loses role=alert
// or the retry stops refetching. Not caught elsewhere: the block lived inline
// in the route file, which no component spec renders.
const serverFns = vi.hoisted(() => ({
  getSightingsFn: vi.fn(),
  getPlaceFn: vi.fn(),
  getSpeciesCountsFn: vi.fn(),
  getTaxonFn: vi.fn(),
}));
vi.mock('../../src/server/fns', () => serverFns);

const props = { taxonId: 4745, placeId: 7, radius: 25 as const, city: 'Medan' };

const sighting = {
  id: 1,
  observedOn: '2026-05-13',
  placeGuess: 'Medan Zoo',
  observer: 'henke911',
  url: 'https://www.inaturalist.org/observations/1',
  photo: null,
};

describe('SightingsSection', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('shows a loading line while sightings load', async () => {
    serverFns.getSightingsFn.mockReturnValue(new Promise(() => {}));
    await renderWithProviders(<SightingsSection {...props} />);
    expect(screen.getByText('Loading sightings…')).toBeInTheDocument();
  });

  it('lists sightings once loaded', async () => {
    serverFns.getSightingsFn.mockResolvedValue([sighting]);
    await renderWithProviders(<SightingsSection {...props} />);
    expect(await screen.findByText('Medan Zoo')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Recent sightings near Medan' })
    ).toBeInTheDocument();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('announces a failure and refetches on Try again', async () => {
    serverFns.getSightingsFn
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValue([sighting]);
    await renderWithProviders(<SightingsSection {...props} />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('We couldn’t load sightings');

    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(await screen.findByText('Medan Zoo')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
    expect(serverFns.getSightingsFn).toHaveBeenCalledTimes(2);
  });
});
