import { isNotFound } from '@tanstack/react-router';
import { describe, expect, it } from 'vitest';
import {
  validatePlaceId,
  validateSightingsInput,
  validateSpeciesListInput,
  validateTaxonId,
  validateSearchQuery,
  withNotFound,
} from '../../src/server/fns';
import { NotFoundError, UpstreamError } from '../../src/server/errors';

const thrownBy = (fn: () => unknown): unknown => {
  try {
    fn();
  } catch (error) {
    return error;
  }
  return undefined;
};

describe('server function validators', () => {
  it('validateSearchQuery trims and bounds the query', () => {
    expect(validateSearchQuery({ query: '  Lon ' })).toEqual({ query: 'Lon' });
    expect(() => validateSearchQuery({ query: 'a' })).toThrow();
    expect(() => validateSearchQuery({ query: 'x'.repeat(81) })).toThrow();
    expect(() => validateSearchQuery({ query: 5 })).toThrow();
    expect(() => validateSearchQuery(null)).toThrow();
  });

  it('validatePlaceId accepts numeric ids and 404s anything else', () => {
    expect(validatePlaceId({ placeId: '2643743' })).toEqual({
      placeId: 2643743,
    });
    expect(
      isNotFound(thrownBy(() => validatePlaceId({ placeId: 'abc' })))
    ).toBe(true);
    expect(isNotFound(thrownBy(() => validatePlaceId({ placeId: '-1' })))).toBe(
      true
    );
  });

  it('validateTaxonId 404s a non-numeric id', () => {
    expect(validateTaxonId({ taxonId: 14886 })).toEqual({ taxonId: 14886 });
    expect(isNotFound(thrownBy(() => validateTaxonId({ taxonId: 'x' })))).toBe(
      true
    );
  });

  it('validateSpeciesListInput applies defaults and falls back on bad filters', () => {
    expect(validateSpeciesListInput({ placeId: '1' })).toEqual({
      placeId: 1,
      group: 'all',
      radius: 25,
      month: undefined,
      page: 1,
    });
    expect(
      validateSpeciesListInput({
        placeId: 1,
        group: 'dragons',
        radius: 7,
        month: 13,
        page: 99,
      })
    ).toEqual({
      placeId: 1,
      group: 'all',
      radius: 25,
      month: undefined,
      page: 1,
    });
    expect(
      validateSpeciesListInput({
        placeId: 1,
        group: 'birds',
        radius: 50,
        month: 5,
        page: 3,
      })
    ).toEqual({ placeId: 1, group: 'birds', radius: 50, month: 5, page: 3 });
  });

  it('validateSpeciesListInput ignores client-supplied coordinates', () => {
    const input = validateSpeciesListInput({ placeId: 1, lat: 1, lng: 2 });
    expect(input).not.toHaveProperty('lat');
    expect(input).not.toHaveProperty('lng');
  });

  it('validateSightingsInput needs both ids and clamps the radius', () => {
    expect(
      validateSightingsInput({ taxonId: 5, placeId: '7', radius: 9 })
    ).toEqual({ taxonId: 5, placeId: 7, radius: 25 });
    expect(
      isNotFound(thrownBy(() => validateSightingsInput({ taxonId: 5 })))
    ).toBe(true);
  });
});

describe('withNotFound', () => {
  it('turns NotFoundError into the router notFound()', async () => {
    const run = withNotFound(async () => {
      throw new NotFoundError('missing');
    });
    const error = await run().catch((caught: unknown) => caught);
    expect(isNotFound(error)).toBe(true);
  });

  it('passes other errors and values through', async () => {
    await expect(
      withNotFound(async () => {
        throw new UpstreamError(500);
      })()
    ).rejects.toBeInstanceOf(UpstreamError);
    expect(await withNotFound(async () => 'ok')()).toBe('ok');
  });
});
