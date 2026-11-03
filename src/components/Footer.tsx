import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import {
  AUTHOR_NAME,
  CREDITS,
  GEO_LICENCE,
  LICENSE_URL,
  REPO_URL,
  SITE_NAME,
} from '../lib/site';

const linkClass =
  'inline-flex min-h-11 items-center text-ink underline underline-offset-4';

const ExternalLink = ({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}): ReactNode => (
  <a href={href} className="text-ink underline underline-offset-[0.2em]">
    {children}
  </a>
);

export const Footer = (): ReactNode => (
  <footer className="mt-[72px] border-t border-rule pt-8 pb-10 text-sm text-ink-2">
    <div className="wrap grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
      <p className="max-w-[68ch]">
        <strong className="text-ink">{SITE_NAME}</strong> is a portfolio project
        by {AUTHOR_NAME}. Species, counts and photos come from{' '}
        <ExternalLink href={CREDITS.inaturalist.url}>
          {CREDITS.inaturalist.name}
        </ExternalLink>{' '}
        research-grade observations; every photo belongs to the person credited
        under it. City search by{' '}
        <ExternalLink href={CREDITS.openMeteo.url}>
          {CREDITS.openMeteo.name}
        </ExternalLink>{' '}
        with{' '}
        <ExternalLink href={CREDITS.geonames.url}>
          {CREDITS.geonames.name}
        </ExternalLink>{' '}
        data ({GEO_LICENCE}).
      </p>
      <nav aria-label="Footer">
        <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-1 p-0">
          <li>
            <Link to="/credits" className={linkClass}>
              Credits
            </Link>
          </li>
          <li>
            <Link to="/privacy" className={linkClass}>
              Privacy
            </Link>
          </li>
          <li>
            <Link to="/terms" className={linkClass}>
              Terms
            </Link>
          </li>
          <li>
            <Link to="/accessibility" className={linkClass}>
              Accessibility
            </Link>
          </li>
          <li>
            <a href={REPO_URL} className={linkClass}>
              Source on GitHub
            </a>
          </li>
          <li>
            <a href={LICENSE_URL} className={linkClass}>
              MIT licence
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </footer>
);
