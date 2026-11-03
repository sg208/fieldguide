import { useRef, useState, type ReactNode, type UIEvent } from 'react';
import type { Photo } from '../../server/inat';
import { ArrowLeftIcon, ArrowRightIcon } from '../icons';
import { PhotoCredit } from '../PhotoCredit';

type Props = { photos: Photo[]; name: string };

const navButton =
  'btn min-w-11 px-0 aria-disabled:cursor-default aria-disabled:opacity-45 aria-disabled:hover:border-edge aria-disabled:hover:bg-sheet';

/** Scroll-snap strip of up to 6 photos; every photo carries its full credit (no credit, no photo). */
export const PhotoGallery = ({ photos, name }: Props): ReactNode => {
  const strip = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const shown = photos.filter((photo) => photo.attribution.trim() !== '');
  const total = shown.length;
  if (total === 0) return null;

  const handleScroll = (event: UIEvent<HTMLUListElement>): void => {
    const list = event.currentTarget;
    const first = list.firstElementChild as HTMLElement | null;
    const slide = first ? first.offsetWidth + 12 : 1;
    setIndex(Math.min(total - 1, Math.round(list.scrollLeft / slide)));
  };
  const handleStep = (direction: 1 | -1): void => {
    const list = strip.current;
    const first = list?.firstElementChild as HTMLElement | null;
    if (!list || !first) return;
    const isReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    list.scrollBy({
      left: direction * (first.offsetWidth + 12),
      behavior: isReduced ? 'auto' : 'smooth',
    });
  };

  return (
    <section aria-label="Photos" className="-mx-4 md:mx-0">
      <ul
        ref={strip}
        aria-label={`Photos of ${name}, scroll sideways`}
        // WHY: axe scrollable-region-focusable (WCAG 2.1.1) needs keyboard focus on the scroller; tests/e2e/a11y.e2e.ts proves it.
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        onScroll={handleScroll}
        className="m-0 flex snap-x snap-mandatory list-none gap-3 overflow-x-auto px-4 pb-1 [scroll-padding-inline:16px] md:px-0 md:[scroll-padding-inline:0]"
      >
        {shown.map((photo, position) => (
          <li
            key={photo.mediumUrl}
            className="flex-[0_0_86%] snap-start md:flex-[0_0_100%]"
          >
            <figure className="m-0 rounded-sheet bg-sheet px-2 pt-2 shadow-sheet">
              <img
                src={photo.mediumUrl}
                width={500}
                height={375}
                alt={`${name}, ${position + 1} of ${total}`}
                loading={position === 0 ? 'eager' : 'lazy'}
                className="aspect-[4/3] w-full bg-rule object-cover"
              />
              <figcaption className="px-1 pt-2 pb-2.5">
                <span className="field block text-[0.6875rem]">
                  Photo <span className="mono">{position + 1}</span> of{' '}
                  <span className="mono">{total}</span>
                </span>
                <PhotoCredit
                  attribution={photo.attribution}
                  variant="full"
                  className="!text-sm font-medium"
                />
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex items-center justify-between px-4 md:px-0">
        <p className="text-sm text-ink-2">
          <span className="mono">{index + 1}</span> of{' '}
          <span className="mono">{total}</span> photos
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className={navButton}
            aria-label="Previous photo"
            aria-disabled={index === 0}
            onClick={() => index > 0 && handleStep(-1)}
          >
            <ArrowLeftIcon />
          </button>
          <button
            type="button"
            className={navButton}
            aria-label="Next photo"
            aria-disabled={index >= total - 1}
            onClick={() => index < total - 1 && handleStep(1)}
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </section>
  );
};
