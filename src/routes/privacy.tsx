import { createFileRoute } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { LegalGlance, LegalPage } from '../components/LegalPage';
import { REPO_URL, pageTitle } from '../lib/site';

const GLANCE = [
  ['Cookies', 'None'],
  ['Analytics or ads', 'None'],
  ['Accounts', 'None'],
  ['Saved on your device', 'Page cache'],
] as const;

const PrivacyPage = (): ReactNode => (
  <LegalPage
    title="Privacy"
    lede="No account, no cookies, no tracking."
    current="privacy"
    updated="Last updated 3 November 2026"
  >
    <LegalGlance rows={GLANCE} />
    <h2>What Field Guide collects</h2>
    <p>
      Nothing about you. There are no accounts, no cookies, no analytics, no
      advertising and no tracking scripts. Field Guide does not use local
      storage or any other browser storage to identify you.
    </p>
    <h2>What your browser sends</h2>
    <p>
      When you search for a city or open a page, your browser asks our server at
      fieldguide.engg.app for it. Our server then asks the data providers on
      your behalf:
    </p>
    <ul>
      <li>
        <b>Open-Meteo</b> receives the city name you type, to find matching
        places.
      </li>
      <li>
        <b>iNaturalist</b> receives the coordinates of the city you picked, the
        radius, and the filters you chose, to return species, photos and
        sightings.
      </li>
    </ul>
    <p>
      These requests normally come from our server, not from your browser, so
      Open-Meteo and iNaturalist do not see your IP address for them. There are
      two exceptions. Photos load directly from iNaturalist’s image servers
      (inaturalist-open-data.s3.amazonaws.com and static.inaturalist.org). And
      when iNaturalist is too busy to answer our server, your browser sends the
      same species request to api.inaturalist.org itself. Both see your IP
      address.
    </p>
    <h2>Hosting</h2>
    <p>
      Field Guide runs on Cloudflare. Like any host, Cloudflare processes your
      IP address and basic request details to deliver pages and protect the site
      from abuse. See{' '}
      <a href="https://www.cloudflare.com/privacypolicy/">
        Cloudflare’s privacy policy
      </a>
      . Our server also keeps request logs for a few days to debug errors; they
      include your IP address.
    </p>
    <h2>Saved on your device</h2>
    <p>
      Field Guide is an installable web app. Its service worker keeps a copy of
      the app and of pages you recently opened in your browser’s cache, so they
      load fast and work offline. This cache stays on your device and is never
      sent to us. Clear it any time by clearing site data for
      fieldguide.engg.app in your browser settings.
    </p>
    <h2>Your location</h2>
    <p>Field Guide never asks for your location. You pick a city by name.</p>
    <h2>Links to other sites</h2>
    <p>
      Species pages link to iNaturalist and Wikipedia. Those sites have their
      own privacy policies once you follow a link.
    </p>
    <h2>Changes and contact</h2>
    <p>
      If this page changes, the date below changes with it, and the history is
      public in the <a href={REPO_URL}>source repository</a>. Questions: open an
      issue there.
    </p>
  </LegalPage>
);

export const Route = createFileRoute('/privacy')({
  head: () => ({
    meta: [
      { title: pageTitle('Privacy') },
      {
        name: 'description',
        content:
          'No account, no cookies, no tracking. How Field Guide handles data.',
      },
    ],
  }),
  component: PrivacyPage,
});
