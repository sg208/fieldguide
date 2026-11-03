import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { MarkIcon, SearchIcon } from './icons';

export type HeaderVariant = 'home' | 'app' | 'system';

type Props = { variant: HeaderVariant };

/** home: Credits link · app: Change city (focuses the city field via /#city) · system: none. */
export const Header = ({ variant }: Props): ReactNode => (
  <header className="border-b border-rule bg-board">
    <div className="wrap flex min-h-[60px] items-center justify-between gap-3">
      <Link
        to="/"
        aria-label="Field Guide home"
        className="inline-flex min-h-11 items-center gap-2.5 text-lg font-bold tracking-[-0.01em] no-underline [font-stretch:87%]"
      >
        <MarkIcon className="size-7" />
        <span>Field Guide</span>
      </Link>
      {variant === 'home' && (
        <Link to="/credits" className="btn btn-ghost">
          Credits
        </Link>
      )}
      {variant === 'app' && (
        <Link to="/" hash="city" className="btn btn-ghost">
          <SearchIcon />
          <span>Change city</span>
        </Link>
      )}
    </div>
  </header>
);
