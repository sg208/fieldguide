import {
  Link,
  useRouter,
  type ErrorComponentProps,
} from '@tanstack/react-router';
import type { ReactNode } from 'react';
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
export const RouteError = ({ reset }: ErrorComponentProps): ReactNode => {
  const router = useRouter();
  const handleRetry = (): void => {
    reset();
    void router.invalidate();
  };
  return (
    <SystemPage
      title="Something went wrong"
      lede="Field Guide hit an error loading this page. Try again, or start from a city."
      specimen="Unreadable"
      locality="Unknown"
      status="Error"
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
