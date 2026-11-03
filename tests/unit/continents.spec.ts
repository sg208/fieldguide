import { describe, expect, it } from 'vitest';
import {
  CONTINENTS,
  COVER_BG_CLASS,
  continentFromCountry,
} from '../../src/lib/continents';

describe('continentFromCountry', () => {
  it.each([
    ['ID', 'asia'],
    ['NG', 'africa'],
    ['IS', 'europe'],
    ['BO', 'samerica'],
    ['CA', 'namerica'],
    ['MX', 'namerica'],
    ['AU', 'oceania'],
    ['AQ', 'antarctica'],
    ['RU', 'europe'],
    ['TR', 'asia'],
  ])('%s -> %s', (code, continent) => {
    expect(continentFromCountry(code)).toBe(continent);
  });

  it('is case-insensitive', () => {
    expect(continentFromCountry('ke')).toBe('africa');
  });

  it('falls back to neutral for unknown, empty or missing codes', () => {
    expect(continentFromCountry('ZZ')).toBe('neutral');
    expect(continentFromCountry('')).toBe('neutral');
    expect(continentFromCountry(undefined)).toBe('neutral');
    expect(continentFromCountry(null)).toBe('neutral');
  });
});

describe('continent tokens', () => {
  it('has a cover class and a label for every continent', () => {
    expect(COVER_BG_CLASS.samerica).toBe('bg-cover-samerica');
    expect(COVER_BG_CLASS.neutral).toBe('bg-cover-neutral');
    expect(CONTINENTS.samerica).toBe('South America');
    expect(Object.keys(CONTINENTS)).toEqual(Object.keys(COVER_BG_CLASS));
  });
});
