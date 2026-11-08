import { describe, expect, it } from 'vitest';
import { LIST_CAP, PER_PAGE, totalPagesFor } from '../../src/lib/paging';

// Behavior protected: page count shown in the pager and used by the place
// loader's out-of-range redirect. Regression: an off-by-one or lost 10-page cap.
// Not caught elsewhere: the arithmetic was inlined in two untested places.
describe('totalPagesFor', () => {
  it.each([
    [0, 0],
    [30, 1],
    [31, 2],
    [301, 10],
    [100000, 10],
  ])('%i results -> %i pages', (total, pages) => {
    expect(totalPagesFor(total)).toBe(pages);
  });

  it('exposes the page size and list cap', () => {
    expect(PER_PAGE).toBe(30);
    expect(LIST_CAP).toBe(300);
  });
});
