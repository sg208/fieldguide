import { describe, expect, it } from 'vitest';
import { monthLabel } from '../../src/lib/months';

// Behavior protected: the one English month table behind the filter pill and
// the results heading. Regression: the two copies disagree or shift by one.
// Not caught elsewhere: FilterBar spec only checks one month through the DOM.
describe('monthLabel', () => {
  it('names January, May and December', () => {
    expect(monthLabel(1)).toBe('January');
    expect(monthLabel(5)).toBe('May');
    expect(monthLabel(12)).toBe('December');
  });

  it.each([0, 13, -1])('returns an empty string for %i', (month) => {
    expect(monthLabel(month)).toBe('');
  });
});
