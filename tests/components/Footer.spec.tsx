// @vitest-environment happy-dom
// Component specs opt into a DOM per file with the pragma above. vitest.config.ts
// stays on `node` so the unit specs keep running there; copy the pragma line
// into every new tests/components/*.spec.tsx. Render through
// tests/helpers/render.tsx so Link and useQuery have their providers.
import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from '../../src/components/Footer';
import { renderWithProviders } from '../helpers/render';

describe('Footer', () => {
  it('names the data providers and links them to their sites', async () => {
    await renderWithProviders(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveTextContent('Syailendra Ginting');
    expect(footer).toHaveTextContent('CC BY 4.0');
    expect(
      within(footer).getByRole('link', { name: 'iNaturalist' })
    ).toHaveAttribute('href', 'https://www.inaturalist.org');
    expect(
      within(footer).getByRole('link', { name: 'Open-Meteo' })
    ).toHaveAttribute('href', 'https://open-meteo.com');
    expect(
      within(footer).getByRole('link', { name: 'GeoNames' })
    ).toHaveAttribute('href', 'https://www.geonames.org');
  });

  it('links the legal pages, source and the MIT licence', async () => {
    await renderWithProviders(<Footer />);
    const nav = screen.getByRole('navigation', { name: 'Footer' });
    const hrefs = Object.fromEntries(
      within(nav)
        .getAllByRole('link')
        .map((link) => [link.textContent, link.getAttribute('href')])
    );
    expect(hrefs).toEqual({
      Credits: '/credits',
      Privacy: '/privacy',
      Terms: '/terms',
      Accessibility: '/accessibility',
      'Source on GitHub': 'https://github.com/sg208/fieldguide',
      'MIT licence': 'https://github.com/sg208/fieldguide/blob/main/LICENSE',
    });
  });
});
