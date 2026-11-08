import type { ReactNode } from 'react';
import { SafeHtml } from '../SafeHtml';

type Props = {
  taxonId: number;
  sanitizedSummary: string | null;
  wikipediaUrl: string | null;
};

export const SpeciesAbout = ({
  taxonId,
  sanitizedSummary,
  wikipediaUrl,
}: Props): ReactNode => (
  <section aria-labelledby="h-about">
    <h2 id="h-about" className="mb-3 text-h2">
      About
    </h2>
    {sanitizedSummary ? (
      <>
        <SafeHtml
          sanitizedHtml={sanitizedSummary}
          className="max-w-[68ch] text-read [&_p+p]:mt-3"
        />
        <p className="mt-3 text-sm text-ink-2">
          Summary from{' '}
          {wikipediaUrl ? (
            <a href={wikipediaUrl} className="underline">
              Wikipedia
            </a>
          ) : (
            'Wikipedia'
          )}
          , CC BY-SA 4.0.
        </p>
      </>
    ) : (
      <p className="text-read">
        No Wikipedia summary for this species yet.{' '}
        <a
          href={`https://www.inaturalist.org/taxa/${taxonId}`}
          className="underline"
        >
          See iNaturalist
        </a>
        .
      </p>
    )}
  </section>
);
