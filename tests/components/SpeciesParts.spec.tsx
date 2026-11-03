// @vitest-environment happy-dom
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ConservationBadge } from '../../src/components/ConservationBadge';
import { SightingList } from '../../src/components/SightingList';
import { PhotoGallery } from '../../src/components/species/PhotoGallery';
import type { Photo } from '../../src/server/inat';
import { renderWithProviders } from '../helpers/render';

describe('ConservationBadge', () => {
  it('shows the code and word for a threatened status', async () => {
    await renderWithProviders(<ConservationBadge statusName="Endangered" />);
    expect(
      screen.getByText('IUCN Red List status: Endangered')
    ).toBeInTheDocument();
    expect(screen.getByText('IUCN Red List status')).toBeInTheDocument();
  });

  it('renders nothing for an unknown or missing status', async () => {
    const { container } = await renderWithProviders(
      <ConservationBadge statusName={null} />
    );
    expect(container.querySelector('p')).toBeNull();
  });
});

describe('SightingList', () => {
  it('lists date, place and an accessible link per sighting', async () => {
    await renderWithProviders(
      <SightingList
        city="Medan"
        radius={25}
        sightings={[
          {
            id: 1,
            observedOn: '2026-05-13',
            placeGuess: null,
            observer: 'henke911',
            url: 'https://www.inaturalist.org/observations/1',
            photo: null,
          },
        ]}
      />
    );
    expect(
      screen.getByText(/^(May 13, 2026|13 May 2026)$/)
    ).toBeInTheDocument();
    expect(screen.getByText('No place name given')).toBeInTheDocument();
    expect(screen.getByText('henke911')).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: /View observation from .*2026 on iNaturalist/,
      })
    ).toHaveAttribute('href', 'https://www.inaturalist.org/observations/1');
  });

  it('explains an empty list', async () => {
    await renderWithProviders(
      <SightingList city="Medan" radius={10} sightings={[]} />
    );
    expect(
      screen.getByText(/No research-grade sightings within 10 km yet/)
    ).toBeInTheDocument();
  });
});

describe('PhotoGallery', () => {
  const photo = (attribution: string, id: number): Photo => ({
    squareUrl: `https://static.inaturalist.org/photos/${id}/square.jpg`,
    mediumUrl: `https://static.inaturalist.org/photos/${id}/medium.jpg`,
    attribution,
    licenseCode: null,
  });

  it('shows the full credit under each photo and drops photos without one', async () => {
    await renderWithProviders(
      <PhotoGallery
        name="Milky Stork"
        photos={[
          photo('(c) Minder Singh, some rights reserved (CC BY-NC)', 1),
          photo('', 2),
        ]}
      />
    );
    expect(screen.getAllByRole('img')).toHaveLength(1);
    expect(
      screen.getByText('(c) Minder Singh, some rights reserved (CC BY-NC)')
    ).toBeInTheDocument();
  });
});
