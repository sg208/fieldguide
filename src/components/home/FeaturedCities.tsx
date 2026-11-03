import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { CONTINENTS, COVER_BG_CLASS } from '../../lib/continents';
import {
  FEATURED_CITIES,
  formatCoordinates,
  type FeaturedCity,
} from '../../lib/featured';

const Drawer = ({ city }: { city: FeaturedCity }): ReactNode => (
  <li>
    <Link
      to="/place/$placeId"
      params={{ placeId: String(city.geonameId) }}
      preload="intent"
      className="flex h-full flex-col overflow-hidden rounded-sheet bg-sheet no-underline shadow-sheet transition-[transform,box-shadow] duration-200 ease-settle hover:-translate-y-0.5 hover:shadow-lift motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <span
        className={`field flex items-center justify-between px-3 py-1.5 !text-white ${COVER_BG_CLASS[city.continent]}`}
      >
        {CONTINENTS[city.continent]}
      </span>
      <span className="mx-3 mt-3 block flex-1 rounded-[2px] border border-rule px-3 pt-2.5 pb-3">
        <h3 className="text-[1.375rem] font-bold tracking-[-0.015em] lg:text-[1.625rem]">
          {city.name}
        </h3>
        <span className="mt-0.5 block text-sm text-ink-2">
          {city.region}, {city.country}
        </span>
        <span className="mono mt-2 block whitespace-nowrap text-xs text-ink-2">
          {formatCoordinates(city.lat, city.lng)}
        </span>
      </span>
      <span
        aria-hidden="true"
        className="mx-auto my-3 block h-1.5 w-11 rounded-[3px] bg-rule"
      />
    </Link>
  </li>
);

export const FeaturedCities = (): ReactNode => (
  <section className="wrap pt-6 pb-2" aria-labelledby="h-drawers">
    <h2 id="h-drawers" className="text-h2 font-semibold">
      Or open a drawer
    </h2>
    <p className="mt-1 text-[0.9375rem] text-ink-2">
      Eight cities on six continents.
    </p>
    <ul className="mt-5 grid list-none grid-cols-2 gap-3 p-0 md:grid-cols-4 md:gap-4">
      {FEATURED_CITIES.map((city) => (
        <Drawer key={city.geonameId} city={city} />
      ))}
    </ul>
  </section>
);
