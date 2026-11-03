// @vitest-environment happy-dom
import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FeaturedCities } from '../../src/components/home/FeaturedCities';
import { HeroFigure } from '../../src/components/home/HeroFigure';
import { renderWithProviders } from '../helpers/render';

describe('FeaturedCities', () => {
  it('links eight drawers to their place pages', async () => {
    await renderWithProviders(<FeaturedCities />);
    const list = screen.getByRole('list');
    const links = within(list).getAllByRole('link');
    expect(links).toHaveLength(8);
    const laPaz = within(list).getByRole('link', { name: /La Paz/ });
    expect(laPaz).toHaveAttribute('href', '/place/3911925');
    expect(laPaz).toHaveTextContent('La Paz Department, Bolivia');
    expect(laPaz).toHaveTextContent('South America');
  });
});

describe('HeroFigure', () => {
  it('keeps a photo credit under every specimen photo', async () => {
    await renderWithProviders(<HeroFigure />);
    expect(screen.getAllByRole('img', { hidden: true })).toHaveLength(2);
    expect(
      screen.getByText('© Thomas Job', { exact: false })
    ).toBeInTheDocument();
    expect(screen.getAllByText('CC BY-NC', { exact: false })).toHaveLength(2);
  });
});
