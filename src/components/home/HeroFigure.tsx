import type { ReactNode } from 'react';
import { HERO_SPECIMENS } from '../../lib/featured';
import { SpecimenSheet } from './SpecimenSheet';

/** Two static sheets from the Medan drawer; desktop only (decorative support, credits intact). */
export const HeroFigure = (): ReactNode => (
  <figure
    aria-label="Two sheets from Medan"
    className="relative m-0 hidden h-[420px] lg:block"
  >
    <SpecimenSheet
      specimen={HERO_SPECIMENS[0]}
      className="absolute top-12 left-0 w-[220px]"
    />
    <SpecimenSheet
      specimen={HERO_SPECIMENS[1]}
      className="absolute top-0 right-0 w-[220px]"
    />
    <figcaption className="absolute bottom-0 left-0 text-xs text-ink-2">
      From the Medan drawer, 25&nbsp;km
    </figcaption>
  </figure>
);
