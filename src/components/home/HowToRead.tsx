import type { ReactNode } from 'react';
import { LABEL_SPECIMEN } from '../../lib/featured';
import { PhotoCredit } from '../PhotoCredit';
import { attributionOf } from './SpecimenSheet';

const KEY: readonly { term: string; detail: string }[] = [
  {
    term: 'Common and scientific name',
    detail: 'As iNaturalist lists them. The italic line is the species.',
  },
  {
    term: 'Observations',
    detail: 'Research-grade records inside the radius you chose.',
  },
  {
    term: 'Photo credit',
    detail: 'The photographer and their licence. Every photo keeps its credit.',
  },
];

export const HowToRead = (): ReactNode => (
  <section
    className="wrap mt-14 grid items-start gap-6 lg:mt-22 lg:grid-cols-[5fr_7fr] lg:gap-14"
    aria-labelledby="h-label"
  >
    <div>
      <h2 id="h-label" className="text-h2 font-semibold">
        How to read a label
      </h2>
      <p className="mt-2 max-w-[56ch] text-ink-2">
        Each species gets a sheet. The number is how many research-grade
        observations people have shared near the city, not how many animals live
        there. A common bird near a busy park will outrank a rare one in the
        hills.
      </p>
    </div>
    <div className="grid grid-cols-[150px_minmax(0,1fr)] items-start gap-3.5 min-[421px]:grid-cols-[minmax(0,200px)_minmax(0,1fr)] min-[421px]:gap-5">
      <article
        aria-label={`Example label: ${LABEL_SPECIMEN.commonName}`}
        className="overflow-hidden rounded-sheet bg-sheet shadow-sheet"
      >
        <img
          src={LABEL_SPECIMEN.photoUrl}
          width={240}
          height={240}
          alt={LABEL_SPECIMEN.alt}
          loading="lazy"
          className="aspect-square w-full bg-rule object-cover"
        />
        <div className="border-t border-rule px-3 pt-2.5 pb-3">
          <p className="font-semibold leading-tight [font-stretch:87%]">
            {LABEL_SPECIMEN.commonName}
          </p>
          <p className="sci text-sm text-ink-2" lang="la">
            {LABEL_SPECIMEN.scientificName}
          </p>
          <p className="mt-2 flex justify-between gap-2 border-t border-rule pt-1.5 text-xs">
            <span>
              <span className="mono">15</span> obs.
            </span>
            <span>within 25&nbsp;km</span>
          </p>
        </div>
        <PhotoCredit
          attribution={attributionOf(LABEL_SPECIMEN)}
          className="border-t border-rule px-3 pt-2 pb-2.5"
        />
      </article>
      <dl className="m-0 grid gap-3.5">
        {KEY.map((item) => (
          <div key={item.term} className="border-t border-rule pt-2">
            <dt className="text-[0.9375rem] font-semibold">{item.term}</dt>
            <dd className="m-0 mt-0.5 text-sm text-ink-2">{item.detail}</dd>
          </div>
        ))}
      </dl>
    </div>
  </section>
);
