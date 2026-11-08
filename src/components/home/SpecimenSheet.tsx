import type { ReactNode } from 'react';
import type { Specimen } from '../../lib/featured';
import { PhotoCredit } from '../PhotoCredit';

export const attributionOf = (specimen: Specimen): string =>
  `(c) ${specimen.photographer}, some rights reserved (${specimen.licence})`;

const NAME_CLASS = 'font-semibold leading-tight [font-stretch:87%]';

export const SpecimenPhoto = ({
  specimen,
}: {
  specimen: Specimen;
}): ReactNode => (
  <img
    src={specimen.photoUrl}
    width={240}
    height={240}
    alt={specimen.alt}
    loading="lazy"
    className="aspect-square w-full bg-rule object-cover"
  />
);

/** Common name over scientific name; `className` goes before the shared name classes. */
export const SpecimenNames = ({
  specimen,
  className,
}: {
  specimen: Specimen;
  className?: string;
}): ReactNode => (
  <>
    <p className={className ? `${className} ${NAME_CLASS}` : NAME_CLASS}>
      {specimen.commonName}
    </p>
    <p className="sci text-sm text-ink-2" lang="la">
      {specimen.scientificName}
    </p>
  </>
);

type Props = { specimen: Specimen; className?: string };

/** A mounted photo with its names and its credit; the credit is never optional. */
export const SpecimenSheet = ({ specimen, className }: Props): ReactNode => (
  <div className={`bg-sheet shadow-lift rounded-sheet ${className ?? ''}`}>
    <div className="p-2.5 pb-3">
      <SpecimenPhoto specimen={specimen} />
      <SpecimenNames specimen={specimen} className="mt-2.5" />
      <PhotoCredit
        attribution={attributionOf(specimen)}
        className="mt-2 border-t border-rule pt-2"
      />
    </div>
  </div>
);
