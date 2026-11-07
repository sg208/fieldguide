import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';

const DOCUMENTS = [
  { key: 'privacy', to: '/privacy', label: 'Privacy' },
  { key: 'terms', to: '/terms', label: 'Terms' },
  { key: 'accessibility', to: '/accessibility', label: 'Accessibility' },
  { key: 'credits', to: '/credits', label: 'Credits' },
] as const;

type LegalDocument = (typeof DOCUMENTS)[number]['key'];

type Props = {
  title: string;
  lede: string;
  current: LegalDocument;
  /** e.g. "Last updated 3 November 2026". */
  updated?: string;
  children: ReactNode;
};

const linkBase =
  'flex min-h-11 items-center rounded-chip border border-edge bg-sheet px-3.5 text-[0.9375rem] font-[550] no-underline hover:border-ink lg:rounded-control lg:border-0 lg:bg-transparent lg:hover:bg-sheet';
const linkCurrent =
  'aria-[current=page]:border-stamp aria-[current=page]:bg-stamp aria-[current=page]:text-on-stamp lg:aria-[current=page]:bg-stamp-soft lg:aria-[current=page]:font-bold lg:aria-[current=page]:text-ink';

/** Legal and info document frame (design/comps/legal.html): neutral cover, doc nav, text sheet. */
export const LegalPage = ({
  title,
  lede,
  current,
  updated,
  children,
}: Props): ReactNode => (
  <>
    <section className="wrap mt-5" aria-labelledby="h1">
      <div className="rounded-sheet bg-cover-neutral px-5 pt-5 pb-6 text-white shadow-sheet md:px-8 md:pt-7 md:pb-8">
        <h1 id="h1" className="text-title">
          {title}
        </h1>
        <p className="mt-2 opacity-90">{lede}</p>
      </div>
    </section>
    <div className="wrap mt-6 grid gap-6 lg:mt-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
      <nav aria-label="Legal and info">
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0 lg:sticky lg:top-6 lg:flex-col lg:gap-0.5">
          {DOCUMENTS.map((item) => (
            <li key={item.key}>
              <Link
                to={item.to}
                aria-current={item.key === current ? 'page' : undefined}
                className={`${linkBase} ${linkCurrent}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <article className="rounded-sheet bg-sheet px-5 pt-6 pb-8 shadow-sheet md:px-12 md:pt-10 md:pb-12">
        <div className="max-w-[68ch] text-read [&_a]:underline [&_h2]:mt-9 [&_h2]:mb-2.5 [&_h2]:text-h2 [&_h2:first-child]:mt-0 [&_li+li]:mt-1.5 [&_p+p]:mt-3 [&_ul+p]:mt-3 [&_ul]:mt-2.5 [&_ul]:list-disc [&_ul]:pl-[1.2em]">
          {children}
          {updated && <p className="mt-8 text-sm text-ink-2">{updated}</p>}
        </div>
      </article>
    </div>
  </>
);

/** "At a glance" summary list (privacy). */
export const LegalGlance = ({
  rows,
}: {
  rows: readonly (readonly [string, string])[];
}): ReactNode => (
  <dl
    aria-label="At a glance"
    className="mb-8 rounded-label border border-rule text-base"
  >
    {rows.map(([term, detail]) => (
      <div
        key={term}
        className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-t border-rule px-3.5 py-2.5 first:border-t-0"
      >
        <dt className="font-[550]">{term}</dt>
        <dd className="m-0 font-[650]">{detail}</dd>
      </div>
    ))}
  </dl>
);
