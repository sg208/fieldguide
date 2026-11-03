import { describe, expect, it } from 'vitest';
import { GROUPS, groupToIconicTaxa } from '../../src/lib/groups';
import {
  parseGroup,
  parseId,
  parseMonth,
  parsePage,
  parseRadius,
  placeSearchSchema,
} from '../../src/lib/validation';

describe('parseId', () => {
  it('accepts positive integer ids as number or string', () => {
    expect(parseId('2643743')).toBe(2643743);
    expect(parseId(42)).toBe(42);
  });

  it.each(['abc', '', '0', '-5', '1.5', '12abc', null, undefined, 1.5, 0])(
    'rejects %j',
    (value) => {
      expect(parseId(value)).toBeNull();
    }
  );
});

describe('parseRadius', () => {
  it('defaults to 25', () => {
    expect(parseRadius(undefined)).toBe(25);
  });

  it.each([10, 25, 50, '10', '50'])('allows %j', (value) => {
    expect(parseRadius(value)).toBe(Number(value));
  });

  it.each([7, 0, 100, -10, 'abc', '', 25.5, null])(
    'falls back to 25 for %j',
    (value) => {
      expect(parseRadius(value)).toBe(25);
    }
  );
});

describe('parseMonth', () => {
  it.each([1, 6, 12, '3'])('allows %j', (value) => {
    expect(parseMonth(value)).toBe(Number(value));
  });

  it.each([0, 13, -1, 1.5, 'abc', '', null, undefined])('drops %j', (value) => {
    expect(parseMonth(value)).toBeUndefined();
  });
});

describe('parseGroup', () => {
  it('defaults to all', () => {
    expect(parseGroup(undefined)).toBe('all');
  });

  it('accepts every listed group key', () => {
    GROUPS.forEach((group) => expect(parseGroup(group.key)).toBe(group.key));
    expect(GROUPS.map((group) => group.key)).toEqual([
      'all',
      'birds',
      'plants',
      'insects',
      'mammals',
      'reptiles',
      'amphibians',
      'fish',
      'fungi',
      'mollusks',
      'arachnids',
    ]);
  });

  it.each(['dragons', 'Aves', 'birds,plants', '', 5, null])(
    'falls back to all for %j',
    (value) => {
      expect(parseGroup(value)).toBe('all');
    }
  );
});

describe('groupToIconicTaxa', () => {
  it('maps slugs to iNaturalist iconic taxa', () => {
    expect(groupToIconicTaxa('birds')).toEqual(['Aves']);
    expect(groupToIconicTaxa('fish')).toEqual(['Actinopterygii']);
    expect(groupToIconicTaxa('all')).toBeUndefined();
  });
});

describe('parsePage', () => {
  it('defaults to 1', () => {
    expect(parsePage(undefined)).toBe(1);
  });

  it.each([1, 5, 10, '7'])('allows %j', (value) => {
    expect(parsePage(value)).toBe(Number(value));
  });

  it.each([0, 11, -1, 2.5, 'abc', null])('falls back to 1 for %j', (value) => {
    expect(parsePage(value)).toBe(1);
  });
});

describe('placeSearchSchema', () => {
  it('returns defaults for an empty search', () => {
    expect(placeSearchSchema({})).toEqual({
      group: 'all',
      radius: 25,
      month: undefined,
      page: 1,
    });
  });

  it('falls back per field on invalid values and keeps valid ones', () => {
    expect(
      placeSearchSchema({ group: 'birds', radius: '7', month: '13', page: '3' })
    ).toEqual({ group: 'birds', radius: 25, month: undefined, page: 3 });
  });
});
