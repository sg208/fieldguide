// @vitest-environment happy-dom
import { useLocation } from '@tanstack/react-router';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { SearchBox } from '../../src/components/SearchBox';
import { createTestQueryClient, renderWithProviders } from '../helpers/render';

// Boundary: the Worker server function behind placeSearchQuery.
const searchPlacesFn = vi.hoisted(() => vi.fn());
vi.mock('../../src/server/fns', () => ({
  searchPlacesFn,
  getPlaceFn: vi.fn(),
}));

const place = (
  id: number,
  name: string,
  countryCode: string,
  country: string
): Record<string, unknown> => ({
  id,
  name,
  admin1: 'Region',
  country,
  countryCode,
  latitude: 1,
  longitude: 2,
  population: id === 1 ? 2_004_652 : null,
  timezone: null,
});
const TWO = [
  place(1, 'La Paz', 'BO', 'Bolivia'),
  place(2, 'La Paz', 'MX', 'Mexico'),
];

const Pathname = (): ReactNode => (
  <p data-testid="path">{useLocation().pathname}</p>
);
const setup = async (): Promise<ReturnType<typeof userEvent.setup>> => {
  await renderWithProviders(
    <>
      <SearchBox />
      <Pathname />
    </>,
    { queryClient: createTestQueryClient() }
  );
  return userEvent.setup();
};
const combobox = (): HTMLElement =>
  screen.getByRole('combobox', { name: 'City' });

describe('SearchBox', () => {
  it('is a labelled, collapsed combobox until two characters are typed', async () => {
    searchPlacesFn.mockReset();
    const user = await setup();
    expect(combobox()).toHaveAttribute('aria-expanded', 'false');
    await user.type(combobox(), 'L');
    expect(combobox()).toHaveAttribute('aria-expanded', 'false');
    expect(searchPlacesFn).not.toHaveBeenCalled();
  });

  it('lists options, announces the count and selects with the keyboard', async () => {
    searchPlacesFn.mockReset().mockResolvedValue(TWO);
    const user = await setup();
    await user.type(combobox(), 'La Paz');
    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(2));
    expect(combobox()).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('2 cities found.');
    expect(searchPlacesFn).toHaveBeenCalledWith({ data: { query: 'La Paz' } });

    await user.keyboard('{Enter}'); // two results, none active: do nothing
    expect(screen.getByTestId('path')).toHaveTextContent('/');

    await user.keyboard('{ArrowDown}{ArrowDown}');
    const second = screen.getAllByRole('option')[1]!;
    expect(second).toHaveAttribute('aria-selected', 'true');
    expect(combobox()).toHaveAttribute('aria-activedescendant', second.id);
    await user.keyboard('{ArrowDown}'); // wraps
    expect(screen.getAllByRole('option')[0]).toHaveAttribute(
      'aria-selected',
      'true'
    );
    await user.keyboard('{ArrowUp}{Enter}');
    await waitFor(() =>
      expect(screen.getByTestId('path')).toHaveTextContent('/place/2')
    );
  });

  it('gives each option a real link to its place page', async () => {
    searchPlacesFn.mockReset().mockResolvedValue(TWO);
    const user = await setup();
    await user.type(combobox(), 'La Paz');
    await screen.findByText('2 cities found.');
    const links = screen.getAllByRole('link', { hidden: true });
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/place/1',
      '/place/2',
    ]);
  });

  it('selects the only result on Enter; Escape closes then clears', async () => {
    searchPlacesFn.mockReset().mockResolvedValue([TWO[0]]);
    const user = await setup();
    await user.type(combobox(), 'Medan');
    await screen.findByText('1 city found.');
    await user.keyboard('{Escape}');
    expect(combobox()).toHaveAttribute('aria-expanded', 'false');
    expect(combobox()).toHaveValue('Medan');
    await user.keyboard('{Escape}');
    expect(combobox()).toHaveValue('');

    await user.type(combobox(), 'Medan');
    await screen.findByText('1 city found.');
    await user.keyboard('{Enter}');
    await waitFor(() =>
      expect(screen.getByTestId('path')).toHaveTextContent('/place/1')
    );
  });

  it('says so when nothing matches', async () => {
    searchPlacesFn.mockReset().mockResolvedValue([]);
    const user = await setup();
    await user.type(combobox(), 'Zzzq');
    const list = await screen.findByRole('listbox');
    await waitFor(() =>
      expect(within(list).getByRole('option')).toHaveTextContent(
        'No city called “Zzzq”. Check the spelling, or try the nearest larger city.'
      )
    );
    expect(screen.getByRole('status')).toHaveTextContent('No city called');
  });

  it('shows an error message when the search fails', async () => {
    searchPlacesFn.mockReset().mockRejectedValue(new Error('boom'));
    const user = await setup();
    await user.type(combobox(), 'Lagos');
    const list = await screen.findByRole('listbox');
    await waitFor(() =>
      expect(within(list).getByRole('option')).toHaveTextContent(
        'City search isn’t responding. Try again in a moment.'
      )
    );
  });

  it('clears the field from the clear button', async () => {
    searchPlacesFn.mockReset().mockResolvedValue(TWO);
    const user = await setup();
    await user.type(combobox(), 'La');
    await user.click(screen.getByRole('button', { name: 'Clear city search' }));
    expect(combobox()).toHaveValue('');
    expect(combobox()).toHaveFocus();
  });
});
