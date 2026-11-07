import type { ReactNode } from 'react';
import { GROUPS } from '../../lib/groups';
import type { Taxon } from '../../server/inat';
import { ConservationBadge, conservationFor } from '../ConservationBadge';
import { ShareButton } from '../ShareButton';
import { ExternalLinkIcon } from '../icons';

type Props = {
  taxon: Taxon;
  taxonId: number;
  wikipediaUrl: string | null;
  shareUrl: string;
};

/** Name, status, facts and outbound links for one species. */
export const SpeciesSummary = ({
  taxon,
  taxonId,
  wikipediaUrl,
  shareUrl,
}: Props): ReactNode => {
  const name = taxon.commonName ?? taxon.name;
  const status = conservationFor(taxon.conservationStatus);
  const group = GROUPS.find((entry) => entry.iconicTaxon === taxon.iconicTaxon);

  return (
    <section
      aria-labelledby="h1"
      className="rounded-sheet bg-sheet p-5 shadow-sheet lg:p-7"
    >
      <h1 id="h1" className="text-title">
        {name}
      </h1>
      {taxon.commonName && (
        <p lang="la" className="sci mt-1.5 text-xl text-ink-2">
          {taxon.name}
        </p>
      )}
      <ConservationBadge statusName={taxon.conservationStatus} />
      <dl className="mt-5 grid grid-cols-[auto_1fr]">
        <dt className="border-t border-rule py-2.5 pr-4">Worldwide</dt>
        <dd className="m-0 border-t border-rule py-2.5 font-semibold">
          <span className="mono">
            {new Intl.NumberFormat('en').format(taxon.observationsCount)}
          </span>{' '}
          observations
        </dd>
        {group && (
          <>
            <dt className="border-t border-rule py-2.5 pr-4">Group</dt>
            <dd className="m-0 border-t border-rule py-2.5 font-semibold">
              {group.label}
            </dd>
          </>
        )}
      </dl>
      {(taxon.isLocationObscured || status?.isThreatened) && (
        <p className="mt-4 rounded-label bg-board px-3.5 py-3 text-sm text-ink-2">
          iNaturalist hides the exact location of threatened species, so a
          sighting can sit several kilometres from the point shown on its
          record.
        </p>
      )}
      <div className="mt-5 flex flex-wrap gap-2">
        <a
          className="btn btn-primary"
          href={`https://www.inaturalist.org/taxa/${taxonId}`}
        >
          iNaturalist <ExternalLinkIcon />
        </a>
        {wikipediaUrl && (
          <a className="btn" href={wikipediaUrl}>
            Wikipedia <ExternalLinkIcon />
          </a>
        )}
        <ShareButton title={name} url={shareUrl} className="btn" />
      </div>
    </section>
  );
};
