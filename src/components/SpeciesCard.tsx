import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import type { Radius } from '../lib/validation';
import type { SpeciesCount } from '../server/inat';
import { PhotoCredit } from './PhotoCredit';

export type CardSpecies = Pick<
  SpeciesCount,
  'taxonId' | 'name' | 'commonName' | 'observationCount' | 'photo'
>;

type Props = {
  species: CardSpecies;
  rank: number;
  placeId: number;
  radius: Radius;
  /** First row: load the image eagerly. */
  isEager: boolean;
  /** Conservation status from the API; the species list does not supply it today. */
  status?: 'CR' | 'EN' | 'VU';
  establishment?: 'introduced' | 'endemic';
  /** Forces the "Opened" flag; the `:target` style covers real back navigation. */
  isReturnTarget?: boolean;
};

const STATUS_LABEL = {
  CR: 'Critically endangered',
  EN: 'Endangered',
  VU: 'Vulnerable',
} as const;

const badgeClass =
  'inline-flex h-[22px] items-center rounded-label border border-current px-1.5 text-[0.6875rem] font-semibold tracking-[0.06em] uppercase';

const smallUrl = (mediumUrl: string): string =>
  mediumUrl.replace('/medium.', '/small.');

/** HANDOFF SpecimenCard. The li carries `#t-<taxonId>` for the species page's back link. */
export const SpeciesCard = ({
  species,
  rank,
  placeId,
  radius,
  isEager,
  status,
  establishment,
  isReturnTarget = false,
}: Props): ReactNode => {
  const { photo } = species;
  const hasPhoto = photo !== null && photo.attribution.trim() !== '';
  const title = species.commonName ?? species.name;
  return (
    <li
      id={`t-${species.taxonId}`}
      className={`group relative row-span-2 grid grid-rows-subgrid rounded-sheet bg-sheet shadow-sheet transition-[transform,box-shadow] duration-200 ease-settle hover:-translate-y-0.5 hover:shadow-lift motion-reduce:hover:translate-y-0 target:outline-2 target:outline-offset-3 target:outline-stamp has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-3 has-[a:focus-visible]:outline-stamp ${
        isReturnTarget ? 'outline-2 outline-offset-3 outline-stamp' : ''
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute top-[-6px] right-2.5 z-20 rounded-t-label rounded-b-label bg-stamp px-2 pt-1 pb-1.5 text-[0.6875rem] font-semibold tracking-[0.06em] text-on-stamp uppercase group-target:block ${
          isReturnTarget ? 'block' : 'hidden'
        }`}
      >
        Opened
      </span>
      <Link
        to="/species/$taxonId"
        params={{ taxonId: String(species.taxonId) }}
        search={{ place: placeId, radius }}
        preload="intent"
        className="flex flex-col rounded-sheet no-underline after:absolute after:inset-0 after:rounded-sheet after:content-[''] focus-visible:outline-none"
      >
        {hasPhoto ? (
          <img
            src={smallUrl(photo.mediumUrl)}
            srcSet={`${smallUrl(photo.mediumUrl)} 240w, ${photo.mediumUrl} 500w`}
            sizes="(min-width: 1024px) 240px, 46vw"
            width={240}
            height={240}
            loading={isEager ? 'eager' : 'lazy'}
            alt=""
            className="aspect-square w-full rounded-t-sheet bg-rule object-cover"
          />
        ) : (
          <div className="grid aspect-square w-full place-items-center rounded-t-sheet bg-sheet p-3">
            <span className="grid size-full place-items-center rounded-label border-[1.5px] border-dashed border-edge text-sm text-ink-2">
              No photo yet
            </span>
          </div>
        )}
        <div className="flex flex-1 flex-col border-t border-rule px-3 py-2.5">
          <span className="mono text-micro text-ink-2">No. {rank}</span>
          <h3 className="mt-0.5 text-base font-semibold lg:text-h3">{title}</h3>
          {species.commonName !== null && (
            <p
              lang="la"
              className="sci mt-0.5 text-sm leading-[1.3] text-ink-2"
            >
              {species.name}
            </p>
          )}
          {(status !== undefined || establishment !== undefined) && (
            <div className="mt-2 flex flex-wrap gap-1">
              {status !== undefined && (
                <span
                  className={`${badgeClass} text-redlist shadow-[inset_0_0_0_1px_currentColor]`}
                >
                  {STATUS_LABEL[status]}
                </span>
              )}
              {establishment !== undefined && (
                <span
                  className={`${badgeClass} ${
                    establishment === 'introduced'
                      ? 'text-introduced'
                      : 'text-endemic'
                  }`}
                >
                  {establishment === 'introduced' ? 'Introduced' : 'Endemic'}
                </span>
              )}
            </div>
          )}
          <p className="mt-auto flex justify-between border-t border-rule pt-1.5 text-xs">
            <span>
              <b className="mono text-[0.9375rem] font-semibold">
                {species.observationCount.toLocaleString('en')}
              </b>{' '}
              obs.
            </span>
          </p>
        </div>
      </Link>
      <div className="relative z-10 border-t border-rule px-3 pt-2 pb-2.5">
        {hasPhoto && <PhotoCredit attribution={photo.attribution} />}
      </div>
    </li>
  );
};
