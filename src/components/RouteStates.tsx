import {
  Link,
  useRouter,
  type ErrorComponentProps,
} from '@tanstack/react-router';
import { useEffect, type ReactNode } from 'react';
import { isRateLimited } from '../lib/rateLimit';
import { RetryIcon, SearchIcon } from './icons';
import { SystemPage } from './SystemPage';

/** 404 (HANDOFF 8.5). Used as notFoundComponent on the root and router default. */
export const NotFound = (): ReactNode => (
  <SystemPage
    title="Not in the collection"
    lede="There is no page at this address. The link may have a typo, or the place or species ID no longer exists on iNaturalist or GeoNames."
    specimen="None on file"
    locality="Unknown"
    status="404"
    actions={
      <>
        <Link to="/" hash="city" className="btn btn-primary">
          <SearchIcon />
          Search a city
        </Link>
        <Link
          to="/place/$placeId"
          params={{ placeId: '1214520' }}
          className="btn"
        >
          Open the Medan drawer
        </Link>
      </>
    }
  />
);

/** 500 (HANDOFF 8.5). The error object is never shown: it may carry upstream detail. */
// A busy page retries once by itself: on the client the loaders re-run and the
// queries fall back to asking iNaturalist from the browser. The timestamp
// keeps a still-busy retry from looping.
const AUTO_RETRY_GAP_MS = 30_000;
const autoRetry = { lastAt: 0 };

export const RouteError = ({
  error,
  reset,
}: ErrorComponentProps): ReactNode => {
  const router = useRouter();
  const isBusy = isRateLimited(error);
  const handleRetry = (): void => {
    reset();
    void router.invalidate();
  };

  useEffect((): void => {
    if (!isBusy || Date.now() - autoRetry.lastAt < AUTO_RETRY_GAP_MS) return;
    autoRetry.lastAt = Date.now();
    reset();
    void router.invalidate();
  }, [isBusy, reset, router]);
  return (
    <SystemPage
      title={isBusy ? 'iNaturalist is busy' : 'Something went wrong'}
      lede={
        isBusy
          ? 'Too many requests reached iNaturalist at once. Field Guide is asking again from your browser; if this page stays, wait a minute and try again.'
          : 'Field Guide hit an error loading this page. Try again, or start from a city.'
      }
      specimen="Unreadable"
      locality="Unknown"
      status={isBusy ? 'Busy' : 'Error'}
      icon="alert"
      actions={
        <>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleRetry}
          >
            <RetryIcon />
            Try again
          </button>
          <Link to="/" hash="city" className="btn">
            <SearchIcon />
            Search a city
          </Link>
        </>
      }
    />
  );
};
