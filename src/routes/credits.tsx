import { createFileRoute } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { LegalPage } from '../components/LegalPage';
import {
  AUTHOR_NAME,
  CREDITS,
  GEO_LICENCE,
  LICENSE_URL,
  REPO_URL,
  pageTitle,
} from '../lib/site';

const CreditsPage = (): ReactNode => (
  <LegalPage
    title="Credits"
    lede="Field Guide is built on other people’s work."
    current="credits"
  >
    <h2>Observations and photos: iNaturalist</h2>
    <p>
      Species, counts, photos and sightings come from{' '}
      <a href={CREDITS.inaturalist.url}>iNaturalist</a> (inaturalist.org), a
      joint initiative of the California Academy of Sciences and the National
      Geographic Society. Only research-grade observations are used. Each photo
      is © its photographer and shown under the licence printed beside it; a
      photo without a credit is never shown.
    </p>
    <h2>Species summaries: Wikipedia</h2>
    <p>
      Short summaries come from Wikipedia via iNaturalist, under CC BY-SA 4.0.
    </p>
    <h2>City search: Open-Meteo and GeoNames</h2>
    <p>
      Geocoding by <a href={CREDITS.openMeteo.url}>Open-Meteo</a>{' '}
      (open-meteo.com), {GEO_LICENCE}, using place data from{' '}
      <a href={CREDITS.geonames.url}>GeoNames</a> (geonames.org), {GEO_LICENCE}.
    </p>
    <h2>Type</h2>
    <p>
      Archivo by Omnibus-Type and Red Hat Mono by Red Hat, both under the SIL
      Open Font License, self-hosted via Fontsource.
    </p>
    <h2>Icons</h2>
    <p>
      Lucide (<a href="https://lucide.dev">lucide.dev</a>), ISC licence.
    </p>
    <h2>Made by</h2>
    <p>
      {AUTHOR_NAME}. Source code:{' '}
      <a href={REPO_URL}>github.com/sg208/fieldguide</a> (
      <a href={LICENSE_URL}>MIT licence</a>).
    </p>
  </LegalPage>
);

export const Route = createFileRoute('/credits')({
  head: () => ({
    meta: [
      { title: pageTitle('Credits') },
      {
        name: 'description',
        content:
          'Field Guide is built on iNaturalist, Open-Meteo, GeoNames and Wikipedia.',
      },
    ],
  }),
  component: CreditsPage,
});
