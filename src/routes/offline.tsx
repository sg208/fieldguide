import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState, type ReactNode } from 'react';
import { RetryIcon } from '../components/icons';
import { SystemPage } from '../components/SystemPage';
import { pageTitle } from '../lib/site';

type SavedPage = { href: string; title: string; kind: string };

const PAGES_CACHE = 'fieldguide-pages-';

const titleOf = (markup: string, isPlace: boolean): string | null => {
  const raw = /<title[^>]*>([^<]*)<\/title>/i.exec(markup)?.[1];
  if (!raw) return null;
  const withoutSite = raw.replace(/\s·\sField Guide$/, '');
  return (isPlace ? withoutSite.split(':')[0] : withoutSite)?.trim() || null;
};

// Built from Cache Storage at runtime: only place and species pages, newest first.
const readSavedPages = async (): Promise<SavedPage[]> => {
  if (typeof caches === 'undefined') return [];
  const names = (await caches.keys()).filter((name) =>
    name.startsWith(PAGES_CACHE)
  );
  const pages: SavedPage[] = [];
  for (const name of names) {
    const cache = await caches.open(name);
    for (const request of await cache.keys()) {
      const url = new URL(request.url);
      const isPlace = url.pathname.startsWith('/place/');
      if (!isPlace && !url.pathname.startsWith('/species/')) continue;
      const response = await cache.match(request);
      const title = response ? titleOf(await response.text(), isPlace) : null;
      if (!title) continue;
      const radius = url.searchParams.get('radius') ?? '25';
      pages.push({
        href: `${url.pathname}${url.search}`,
        title,
        kind: isPlace ? `Place · ${radius} km` : 'Species',
      });
    }
  }
  return pages.reverse();
};

const SavedList = (): ReactNode => {
  const [pages, setPages] = useState<SavedPage[] | null>(null);
  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        setPages(await readSavedPages());
      } catch {
        // Cache Storage unavailable (private mode, blocked): show the empty state.
        setPages([]);
      }
    };
    void load();
  }, []);
  if (pages === null) return null;
  return (
    <section className="mt-7" aria-labelledby="h-saved">
      <h2 id="h-saved" className="text-[1.125rem]">
        Saved on this device
      </h2>
      {pages.length === 0 ? (
        <p className="mt-2.5 text-ink-2">
          Nothing saved yet. Pages you open while online are kept here for next
          time.
        </p>
      ) : (
        <ul className="mt-2.5 list-none rounded-sheet bg-sheet p-0 shadow-sheet">
          {pages.map((page) => (
            <li
              key={page.href}
              className="border-t border-rule first:border-t-0"
            >
              <a
                href={page.href}
                className="flex min-h-12 items-center justify-between gap-3 px-4 py-2 no-underline hover:bg-board"
              >
                <span>{page.title}</span>
                <span className="text-[0.8125rem] text-ink-2">{page.kind}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

const OfflinePage = (): ReactNode => (
  <SystemPage
    title="You’re offline"
    lede="Field Guide needs a connection to look up new places and species. Pages you opened recently are saved on this device and still work."
    specimen="Not reachable"
    locality="This device"
    status="Offline"
    icon="offline"
    actions={
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => window.location.reload()}
      >
        <RetryIcon />
        Try again
      </button>
    }
  >
    <SavedList />
  </SystemPage>
);

export const Route = createFileRoute('/offline')({
  head: () => ({ meta: [{ title: pageTitle('You’re offline') }] }),
  component: OfflinePage,
});
