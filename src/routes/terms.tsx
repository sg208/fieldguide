import { createFileRoute } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { LegalPage } from '../components/LegalPage';
import { REPO_URL, pageTitle } from '../lib/site';

const TermsPage = (): ReactNode => (
  <LegalPage
    title="Terms"
    lede="Free to use, offered as is."
    current="terms"
    updated="Last updated 3 November 2026"
  >
    <h2>What this is</h2>
    <p>
      Field Guide is a free, non-commercial portfolio project by Syailendra
      Ginting. It shows public data from iNaturalist and Open-Meteo. It is not
      affiliated with or endorsed by iNaturalist, the California Academy of
      Sciences, the National Geographic Society, Open-Meteo or GeoNames.
    </p>
    <h2>The data</h2>
    <p>
      Species lists, counts, photos and sightings come from iNaturalist
      research-grade observations. They show where people have recorded species,
      not a complete survey. Do not rely on them for safety decisions such as
      identifying edible fungi or plants, dangerous animals, or medical matters.
    </p>
    <h2>Photos and text</h2>
    <p>
      Every photo belongs to the photographer credited under it and is shown
      under the licence they chose. If you reuse a photo, follow its licence,
      not ours. Species summaries come from Wikipedia under CC BY-SA 4.0.
    </p>
    <h2>The code</h2>
    <p>
      The source code is MIT-licensed at{' '}
      <a href={REPO_URL}>github.com/sg208/fieldguide</a>. The MIT licence covers
      the code only, not the data or photos.
    </p>
    <h2>Fair use of the service</h2>
    <p>
      Please don’t scrape or load-test the site. It runs on a free hosting tier
      and shares iNaturalist’s rate limits.
    </p>
    <h2>No warranty</h2>
    <p>
      Field Guide is provided as is, without warranty of any kind. It may be
      wrong, out of date or unavailable.
    </p>
    <h2>Contact</h2>
    <p>
      Open an issue at <a href={REPO_URL}>github.com/sg208/fieldguide</a>.
    </p>
  </LegalPage>
);

export const Route = createFileRoute('/terms')({
  head: () => ({
    meta: [
      { title: pageTitle('Terms') },
      {
        name: 'description',
        content: 'Field Guide is free to use and offered as is.',
      },
    ],
  }),
  component: TermsPage,
});
