// @vitest-environment happy-dom
import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LegalPage } from '../../src/components/LegalPage';
import { renderWithProviders } from '../helpers/render';

describe('LegalPage', () => {
  it('has one h1, the lede, and the body inside an article', async () => {
    await renderWithProviders(
      <LegalPage title="Privacy" lede="No account." current="privacy">
        <h2>What we collect</h2>
        <p>Nothing.</p>
      </LegalPage>
    );
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Privacy' })
    ).toBeInTheDocument();
    expect(screen.getByText('No account.')).toBeInTheDocument();
    expect(
      within(screen.getByRole('article')).getByText('Nothing.')
    ).toBeInTheDocument();
  });

  it('links the four documents and marks only the current one', async () => {
    await renderWithProviders(
      <LegalPage title="Terms" lede="Free." current="terms">
        <p>x</p>
      </LegalPage>
    );
    const nav = screen.getByRole('navigation', { name: 'Legal and info' });
    const links = within(nav).getAllByRole('link');
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/privacy',
      '/terms',
      '/accessibility',
      '/credits',
    ]);
    const current = links.filter(
      (link) => link.getAttribute('aria-current') === 'page'
    );
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveTextContent('Terms');
  });

  it('shows the last-updated line when given', async () => {
    await renderWithProviders(
      <LegalPage
        title="Credits"
        lede="Thanks."
        current="credits"
        updated="Last updated 3 November 2026"
      >
        <p>x</p>
      </LegalPage>
    );
    expect(
      screen.getByText('Last updated 3 November 2026')
    ).toBeInTheDocument();
  });
});
