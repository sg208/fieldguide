import { isNotFound } from '@tanstack/react-router';
import { describe, expect, it } from 'vitest';
import { requireId } from '../../src/lib/requireId';

// Behavior protected: ids that can never exist answer 404 from every caller
// (server fns, place and species loaders). Regression: one copy drifts to 500.
// Not caught elsewhere: serverFns.spec only covers the server-fn copy.
const thrownBy = (fn: () => unknown): unknown => {
  try {
    fn();
  } catch (error) {
    return error;
  }
  return undefined;
};

describe('requireId', () => {
  it('returns a positive integer id', () => {
    expect(requireId('7')).toBe(7);
    expect(requireId(42)).toBe(42);
  });

  it.each(['abc', '-1', 0])('throws notFound for %s', (value) => {
    expect(isNotFound(thrownBy(() => requireId(value)))).toBe(true);
  });
});
