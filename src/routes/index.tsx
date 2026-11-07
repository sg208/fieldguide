import { createFileRoute } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { FeaturedCities } from '../components/home/FeaturedCities';
import { HeroFigure } from '../components/home/HeroFigure';
import { HowToRead } from '../components/home/HowToRead';
import { SearchBox } from '../components/SearchBox';
import { HOME_TITLE, SITE_DESCRIPTION } from '../lib/site';

const Home = (): ReactNode => (
  <>
    <section
      className="wrap grid gap-10 pt-10 pb-8 lg:grid-cols-[7fr_5fr] lg:items-center lg:pt-22 lg:pb-14"
      aria-labelledby="h1"
    >
      <div>
        <h1
          id="h1"
          className="max-w-[14ch] text-hero font-bold tracking-[-0.03em] [font-stretch:80%]"
        >
          What lives near<span className="sr-only"> any city?</span>
        </h1>
        <SearchBox />
        <p className="mt-7 max-w-[52ch] text-read text-ink-2 lg:text-[1.1875rem]">
          Birds, plants, insects and more, ranked by how often people have
          photographed and identified them within 10, 25 or 50&nbsp;km. Every
          record is an iNaturalist research-grade observation.
        </p>
      </div>
      <HeroFigure />
    </section>
    <FeaturedCities />
    <HowToRead />
  </>
);

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: HOME_TITLE },
      { name: 'description', content: SITE_DESCRIPTION },
      { property: 'og:title', content: HOME_TITLE },
      { property: 'og:description', content: SITE_DESCRIPTION },
    ],
  }),
  component: Home,
});
