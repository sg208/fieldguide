import { Link, type LinkComponentProps } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from './icons';

type Props = {
  page: number;
  totalPages: number;
  /** Fired when a page link is used, so the page can move focus to the results. */
  onNavigate?: () => void;
};

type Item = number | 'gap-start' | 'gap-end';

/** First, last, current and its neighbours; gaps collapse to an ellipsis. */
const buildItems = (page: number, totalPages: number): Item[] => {
  const shown = [
    ...new Set(
      [1, page - 1, page, page + 1, totalPages].filter(
        (value) => value >= 1 && value <= totalPages
      )
    ),
  ].sort((a, b) => a - b);
  return shown.flatMap((value, index): Item[] => {
    const previous = shown[index - 1] ?? 0;
    const gap: Item[] =
      value - previous > 1 ? [index === 0 ? 'gap-start' : 'gap-end'] : [];
    return [...gap, value];
  });
};

const numberClass =
  'mono inline-flex h-11 min-w-11 items-center justify-center rounded-control text-[0.9375rem] hover:bg-sheet';

/** HANDOFF Pager: Prev/Next links, numbered links from 640px, "Page n of N" below. */
export const Pagination = ({
  page,
  totalPages,
  onNavigate,
}: Props): ReactNode => {
  if (totalPages <= 1) return null;
  const toPage = (target: number): LinkComponentProps<'a'> => ({
    to: '.',
    search: (previous: Record<string, unknown>): Record<string, unknown> => ({
      ...previous,
      page: target,
    }),
    resetScroll: false,
    onClick: onNavigate,
  });
  return (
    <nav
      aria-label="Pages"
      className="mt-8 flex items-center justify-between gap-2 border-t border-rule pt-4"
    >
      {page > 1 ? (
        <Link {...toPage(page - 1)} className="btn">
          <ArrowLeftIcon />
          <span>Prev</span>
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="btn pointer-events-none opacity-45"
        >
          <ArrowLeftIcon />
          <span>Prev</span>
        </span>
      )}
      <ol className="m-0 hidden list-none gap-1 p-0 sm:flex">
        {buildItems(page, totalPages).map((item) =>
          typeof item === 'string' ? (
            <li key={item}>
              <span aria-hidden="true" className={`${numberClass} text-ink-2`}>
                …
              </span>
            </li>
          ) : (
            <li key={item}>
              <Link
                {...toPage(item)}
                aria-label={`Page ${item}`}
                aria-current={item === page ? 'page' : undefined}
                className={`${numberClass} no-underline ${
                  item === page
                    ? 'bg-stamp font-bold text-on-stamp hover:bg-stamp'
                    : ''
                }`}
              >
                {item}
              </Link>
            </li>
          )
        )}
      </ol>
      <p className="text-center text-sm text-ink-2 sm:hidden">
        Page <span className="mono">{page}</span> of{' '}
        <span className="mono">{totalPages}</span>
      </p>
      {page < totalPages ? (
        <Link {...toPage(page + 1)} className="btn">
          <span>Next</span>
          <ArrowRightIcon />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="btn pointer-events-none opacity-45"
        >
          <span>Next</span>
          <ArrowRightIcon />
        </span>
      )}
    </nav>
  );
};
