import type { ReactNode } from 'react';
import { AlertIcon, SearchIcon, WifiOffIcon } from './icons';

type Props = {
  title: string;
  lede: string;
  /** Rows of the mount figure's label field. */
  specimen: string;
  locality: string;
  status: string;
  icon?: 'search' | 'alert' | 'offline';
  /** Action buttons (`.btn` / `.btn-primary`). */
  actions: ReactNode;
  /** Extra content under the actions (offline: saved list). */
  children?: ReactNode;
};

const ICONS = {
  search: SearchIcon,
  alert: AlertIcon,
  offline: WifiOffIcon,
} as const;

/** 404 / error / offline frame (design/comps/404.html): mount figure + text. Renders inside root <main>. */
export const SystemPage = ({
  title,
  lede,
  specimen,
  locality,
  status,
  icon = 'search',
  actions,
  children,
}: Props): ReactNode => {
  const Glyph = ICONS[icon];
  return (
    <div className="wrap grid items-center gap-8 pt-10 pb-6 lg:grid-cols-[5fr_6fr] lg:gap-[72px] lg:pt-24 lg:pb-12">
      <figure
        aria-hidden="true"
        className="order-2 m-0 w-full max-w-[420px] justify-self-center rounded-sheet bg-sheet p-4 shadow-sheet lg:order-none"
      >
        <div className="grid aspect-video place-items-center rounded-label border-[1.5px] border-dashed border-edge text-ink-2">
          <Glyph className="!size-10" />
        </div>
        <dl className="mt-3.5 rounded-label border border-rule">
          {[
            ['Specimen', specimen],
            ['Locality', locality],
            ['Status', status],
          ].map(([term, detail]) => (
            <div
              key={term}
              className="grid grid-cols-[110px_1fr] gap-2.5 border-t border-rule px-3 py-2 text-sm first:border-t-0"
            >
              <dt className="field pt-px">{term}</dt>
              <dd className={term === 'Status' ? 'mono' : undefined}>
                {detail}
              </dd>
            </div>
          ))}
        </dl>
      </figure>
      <div>
        <h1 className="text-title">{title}</h1>
        <p className="mt-3.5 max-w-[48ch] text-read text-ink-2">{lede}</p>
        <div className="mt-6 flex flex-wrap gap-2.5">{actions}</div>
        {children}
      </div>
    </div>
  );
};
