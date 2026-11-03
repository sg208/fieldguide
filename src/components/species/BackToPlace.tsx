import { Link } from '@tanstack/react-router';
import type { MouseEvent, ReactNode } from 'react';
import type { Radius } from '../../lib/validation';
import { ArrowLeftIcon } from '../icons';

type Props = {
  placeId: number;
  city: string;
  radius: Radius;
  taxonId: number;
  /** Tailwind background class for the place's continent cover colour. */
  coverClass: string;
};

/** True when the page we came from is this place (same origin), so back restores scroll and filters. */
const cameFromPlace = (placeId: number): boolean => {
  if (document.referrer === '') return false;
  try {
    const from = new URL(document.referrer);
    return (
      from.origin === window.location.origin &&
      from.pathname === `/place/${placeId}`
    );
  } catch {
    return false;
  }
};

export const BackToPlace = ({
  placeId,
  city,
  radius,
  taxonId,
  coverClass,
}: Props): ReactNode => {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>): void => {
    const isPlainClick =
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey;
    if (isPlainClick && cameFromPlace(placeId)) {
      event.preventDefault();
      window.history.back();
    }
  };
  return (
    <Link
      to="/place/$placeId"
      params={{ placeId: String(placeId) }}
      search={{ radius }}
      hash={`t-${taxonId}`}
      onClick={handleClick}
      className={`mt-4 inline-flex min-h-11 items-center gap-2 rounded-[6px_6px_0_0] py-0 pr-3.5 pl-2.5 text-[0.9375rem] font-semibold text-white no-underline hover:brightness-110 ${coverClass}`}
    >
      <ArrowLeftIcon className="!size-[18px]" />
      Back to {city}
    </Link>
  );
};
