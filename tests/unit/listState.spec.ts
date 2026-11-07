import { describe, expect, it } from 'vitest';
import { listStateOf } from '../../src/components/PlaceResultList';

const settled = { isStale: false, isPending: false, isError: false, count: 3 };

describe('listStateOf', () => {
  it('is loading while the typed text is ahead of the debounced query', () => {
    expect(listStateOf({ ...settled, isStale: true })).toBe('loading');
  });

  it('is loading while the request is pending', () => {
    expect(listStateOf({ ...settled, isPending: true })).toBe('loading');
  });

  it('prefers loading over error', () => {
    expect(listStateOf({ ...settled, isStale: true, isError: true })).toBe(
      'loading'
    );
  });

  it('is error when the request failed', () => {
    expect(listStateOf({ ...settled, isError: true })).toBe('error');
  });

  it('prefers error over empty', () => {
    expect(listStateOf({ ...settled, isError: true, count: 0 })).toBe('error');
  });

  it('is empty when nothing matched', () => {
    expect(listStateOf({ ...settled, count: 0 })).toBe('empty');
  });

  it('is results when places came back', () => {
    expect(listStateOf(settled)).toBe('results');
  });
});
