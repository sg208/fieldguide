import { createFileRoute } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { LegalPage } from '../components/LegalPage';
import { REPO_URL, pageTitle } from '../lib/site';

const AccessibilityPage = (): ReactNode => (
  <LegalPage
    title="Accessibility"
    lede="Built to WCAG 2.2 AA."
    current="accessibility"
    updated="Last reviewed 3 November 2026"
  >
    <h2>Our target</h2>
    <p>
      Field Guide aims to meet WCAG 2.2 level AA on current versions of Chrome,
      Safari, Firefox and Edge, with VoiceOver, TalkBack and NVDA.
    </p>
    <h2>What we did</h2>
    <ul>
      <li>Every page has one main heading, landmarks and a skip link.</li>
      <li>
        City search follows the ARIA combobox pattern: arrow keys move through
        results, Enter picks one, Escape closes the list.
      </li>
      <li>
        Filters are standard radio buttons and switches, so they work with a
        keyboard and screen readers. The radius scale shows the chosen distance
        by fill and weight, not colour alone.
      </li>
      <li>
        Text and controls meet AA contrast in light and dark mode. Focus is
        always visible.
      </li>
      <li>
        Touch targets are at least 44 by 44 pixels, apart from inline text
        links.
      </li>
      <li>
        Motion is limited to small lifts and fades and switches off when your
        device asks for reduced motion.
      </li>
      <li>
        Photos on species pages have text alternatives; photo credits are real
        text you can select and read aloud.
      </li>
    </ul>
    <h2>Known gaps</h2>
    <p>
      Photo descriptions are generic (“Milky Stork, 2 of 6”) because iNaturalist
      photos do not come with descriptions. Wikipedia summaries can contain
      specialist terms. Some observer names are in scripts our font does not
      include; they use your system font.
    </p>
    <h2>Tell us</h2>
    <p>
      If something gets in your way, open an issue at{' '}
      <a href={REPO_URL}>github.com/sg208/fieldguide</a> with the page and what
      happened.
    </p>
  </LegalPage>
);

export const Route = createFileRoute('/accessibility')({
  head: () => ({
    meta: [
      { title: pageTitle('Accessibility') },
      {
        name: 'description',
        content:
          'Field Guide is built to WCAG 2.2 AA. What we did and known gaps.',
      },
    ],
  }),
  component: AccessibilityPage,
});
