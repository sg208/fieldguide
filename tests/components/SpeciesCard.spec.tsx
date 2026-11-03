// @vitest-environment happy-dom
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SpeciesCard } from '../../src/components/SpeciesCard';
import { renderWithProviders } from '../helpers/render';

// Protects: HANDOFF SpecimenCard + 7.2 (credit always shown with the photo,
// no-photo fallback, badges only when supplied, `#t-<id>` return anchor).
// Turns red if: a photo renders without its credit, or a badge is invented.
// Existing tests miss it: PhotoCredit.spec covers parsing, not the card.
const species = {
  taxonId: 4745,
  name: 'Mycteria cinerea',
  commonName: 'Milky Stork',
  observationCount: 1234,
  photo: {
    squareUrl: 'https://static.inaturalist.org/photos/1/square.jpg',
    mediumUrl: 'https://static.inaturalist.org/photos/1/medium.jpg',
    attribution: '(c) Minder Singh, some rights reserved (CC BY-NC)',
    licenseCode: 'cc-by-nc',
  },
};

const renderCard = (
  overrides: Partial<Parameters<typeof SpeciesCard>[0]> = {}
): ReturnType<typeof renderWithProviders> =>
  renderWithProviders(
    <ul>
      <SpeciesCard
        species={species}
        rank={7}
        placeId={1214520}
        radius={25}
        isEager={false}
        {...overrides}
      />
    </ul>
  );

describe('SpeciesCard', () => {
  it('links to the species page with place and radius, and carries the anchor id', async () => {
    const { container } = await renderCard();
    const link = await screen.findByRole('link', { name: /Milky Stork/ });
    expect(link).toHaveAttribute(
      'href',
      '/species/4745?place=1214520&radius=25'
    );
    expect(container.querySelector('li#t-4745')).not.toBeNull();
  });

  it('shows names, rank, observation count and the photo credit with the photo', async () => {
    await renderCard();
    expect(
      await screen.findByRole('heading', { level: 3, name: 'Milky Stork' })
    ).toBeInTheDocument();
    const sci = screen.getByText('Mycteria cinerea');
    expect(sci).toHaveAttribute('lang', 'la');
    expect(screen.getByText(/No\.\s*7/)).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
    expect(screen.getByText('© Minder Singh')).toBeInTheDocument();
    expect(screen.getByText('CC BY-NC')).toBeInTheDocument();
    expect(screen.getByText('Photo')).toBeInTheDocument();
    const image = document.querySelector('img');
    expect(image).toHaveAttribute('width', '240');
    expect(image).toHaveAttribute('height', '240');
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  it('loads the first-row image eagerly', async () => {
    await renderCard({ isEager: true });
    await screen.findByRole('heading', { level: 3 });
    expect(document.querySelector('img')).toHaveAttribute('loading', 'eager');
  });

  it('falls back to the scientific name when there is no common name', async () => {
    await renderCard({ species: { ...species, commonName: null } });
    expect(
      await screen.findByRole('heading', {
        level: 3,
        name: 'Mycteria cinerea',
      })
    ).toBeInTheDocument();
    expect(screen.getAllByText('Mycteria cinerea')).toHaveLength(1);
  });

  it('shows "No photo yet" and no image when there is no photo', async () => {
    await renderCard({ species: { ...species, photo: null } });
    expect(await screen.findByText('No photo yet')).toBeInTheDocument();
    expect(document.querySelector('img')).toBeNull();
    expect(screen.queryByText('Photo')).toBeNull();
  });

  it('never shows a photo whose credit is empty', async () => {
    await renderCard({
      species: { ...species, photo: { ...species.photo, attribution: '' } },
    });
    expect(await screen.findByText('No photo yet')).toBeInTheDocument();
    expect(document.querySelector('img')).toBeNull();
  });

  it('renders badges only when the data supplies them', async () => {
    const { unmount } = await renderCard();
    await screen.findByRole('heading', { level: 3 });
    expect(screen.queryByText('Endangered')).toBeNull();
    expect(screen.queryByText('Introduced')).toBeNull();
    unmount();
    await renderCard({ status: 'EN', establishment: 'introduced' });
    expect(await screen.findByText('Endangered')).toBeInTheDocument();
    expect(screen.getByText('Introduced')).toBeInTheDocument();
  });

  // happy-dom applies no CSS, so the flag's visibility is read from its
  // classes: `hidden` until :target (or the prop) shows it.
  it('shows the Opened flag on the return target', async () => {
    const { unmount } = await renderCard();
    expect(await screen.findByText('Opened')).toHaveClass('hidden');
    unmount();
    await renderCard({ isReturnTarget: true });
    const flag = await screen.findByText('Opened');
    expect(flag).toHaveClass('block');
    expect(flag).not.toHaveClass('hidden');
  });
});
