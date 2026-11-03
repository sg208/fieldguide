// @vitest-environment happy-dom
import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Pagination } from '../../src/components/Pagination';
import { renderWithProviders } from '../helpers/render';

// Protects: HANDOFF Pager (links with ?page, aria-current, disabled ends,
// first/last/current±1 with ellipsis).
// Turns red if: the current page loses aria-current, ends stay clickable, or
// the window of numbers stops collapsing.
// Existing tests miss it: validation.spec only clamps the page number.
describe('Pagination', () => {
  it('marks the current page and links the others with ?page', async () => {
    await renderWithProviders(<Pagination page={5} totalPages={10} />);
    const nav = await screen.findByRole('navigation', { name: 'Pages' });
    expect(within(nav).getByRole('link', { name: 'Page 5' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(within(nav).getByRole('link', { name: 'Page 6' })).toHaveAttribute(
      'href',
      expect.stringContaining('page=6')
    );
    expect(within(nav).getByRole('link', { name: 'Page 1' })).toBeVisible();
    expect(within(nav).getByRole('link', { name: 'Page 10' })).toBeVisible();
    expect(within(nav).queryByRole('link', { name: 'Page 8' })).toBeNull();
    expect(within(nav).getAllByText('…').length).toBeGreaterThan(0);
  });

  it('disables Prev on the first page and Next on the last, but not the other end', async () => {
    const { unmount } = await renderWithProviders(
      <Pagination page={1} totalPages={10} />
    );
    const prev = await screen.findByText('Prev');
    expect(prev.closest('a')).toBeNull();
    expect(prev.closest('[aria-disabled="true"]')).not.toBeNull();
    expect(screen.getByText('Next').closest('a')).toHaveAttribute(
      'href',
      expect.stringContaining('page=2')
    );
    unmount();
    await renderWithProviders(<Pagination page={10} totalPages={10} />);
    expect(
      (await screen.findByText('Next')).closest('[aria-disabled="true"]')
    ).not.toBeNull();
    expect(screen.getByText('Prev').closest('a')).toHaveAttribute(
      'href',
      expect.stringContaining('page=9')
    );
  });

  it('renders nothing for a single page', async () => {
    await renderWithProviders(<Pagination page={1} totalPages={1} />);
    expect(screen.queryByRole('navigation', { name: 'Pages' })).toBeNull();
  });
});
