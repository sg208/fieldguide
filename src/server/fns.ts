import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { groupToIconicTaxa, type GroupKey } from '../lib/groups';
import {
  parseGroup,
  parseId,
  parseMonth,
  parsePage,
  parseRadius,
  type Radius,
} from '../lib/validation';
import { NotFoundError } from './errors';
import { getPlace, searchPlaces } from './geocode';
import { getSightings, getSpeciesCounts, getTaxon } from './inat';

const asRecord = (input: unknown): Record<string, unknown> =>
  typeof input === 'object' && input !== null
    ? (input as Record<string, unknown>)
    : {};

// An id that is not a positive integer can never exist: answer 404, not 500.
const requireId = (value: unknown): number => {
  const id = parseId(value);
  if (id === null) throw notFound();
  return id;
};

export const validateSearchQuery = (input: unknown): { query: string } => {
  const { query } = asRecord(input);
  const trimmed = typeof query === 'string' ? query.trim() : '';
  if (trimmed.length < 2 || trimmed.length > 80) {
    throw new Error('Search text must be 2 to 80 characters');
  }
  return { query: trimmed };
};

export const validatePlaceId = (input: unknown): { placeId: number } => ({
  placeId: requireId(asRecord(input).placeId),
});

export const validateTaxonId = (input: unknown): { taxonId: number } => ({
  taxonId: requireId(asRecord(input).taxonId),
});

export type SpeciesListInput = {
  placeId: number;
  group: GroupKey;
  radius: Radius;
  month?: number;
  page: number;
};

// Coordinates are never read from the client; the place id is resolved server-side.
export const validateSpeciesListInput = (input: unknown): SpeciesListInput => {
  const raw = asRecord(input);
  return {
    placeId: requireId(raw.placeId),
    group: parseGroup(raw.group),
    radius: parseRadius(raw.radius),
    month: parseMonth(raw.month),
    page: parsePage(raw.page),
  };
};

export type SightingsInput = {
  taxonId: number;
  placeId: number;
  radius: Radius;
};

export const validateSightingsInput = (input: unknown): SightingsInput => {
  const raw = asRecord(input);
  return {
    taxonId: requireId(raw.taxonId),
    placeId: requireId(raw.placeId),
    radius: parseRadius(raw.radius),
  };
};

export const withNotFound =
  <TArgs extends unknown[], TResult>(
    run: (...args: TArgs) => Promise<TResult>
  ) =>
  async (...args: TArgs): Promise<TResult> => {
    try {
      return await run(...args);
    } catch (error) {
      if (error instanceof NotFoundError) throw notFound();
      throw error;
    }
  };

export const searchPlacesFn = createServerFn()
  .validator(validateSearchQuery)
  .handler(({ data }) => searchPlaces(data.query));

export const getPlaceFn = createServerFn()
  .validator(validatePlaceId)
  .handler(({ data }) => withNotFound(getPlace)(data.placeId));

export const getSpeciesCountsFn = createServerFn()
  .validator(validateSpeciesListInput)
  .handler(({ data }) =>
    withNotFound(async () => {
      const place = await getPlace(data.placeId);
      return getSpeciesCounts({
        lat: place.latitude,
        lng: place.longitude,
        radius: data.radius,
        iconicTaxa: groupToIconicTaxa(data.group),
        month: data.month,
        page: data.page,
      });
    })()
  );

export const getTaxonFn = createServerFn()
  .validator(validateTaxonId)
  .handler(({ data }) => withNotFound(getTaxon)(data.taxonId));

export const getSightingsFn = createServerFn()
  .validator(validateSightingsInput)
  .handler(({ data }) =>
    withNotFound(async () => {
      const place = await getPlace(data.placeId);
      return getSightings({
        taxonId: data.taxonId,
        lat: place.latitude,
        lng: place.longitude,
        radius: data.radius,
      });
    })()
  );
