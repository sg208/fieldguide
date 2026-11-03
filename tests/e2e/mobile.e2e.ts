import { expect, test } from '@playwright/test';
import { LONDON } from './helpers';

test.use({ viewport: { width: 375, height: 667 }, hasTouch: true });

const expectNoHorizontalScroll = async (
  page: import('@playwright/test').Page
): Promise<void> => {
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(0);
};

test('home does not scroll sideways at 375px', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expectNoHorizontalScroll(page);
});

test('place page does not scroll sideways at 375px', async ({ page }) => {
  await page.goto(`/place/${LONDON}`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('London');
  await expectNoHorizontalScroll(page);
});

test('footer links are at least 44px tall', async ({ page }) => {
  await page.goto('/');
  const links = page
    .getByRole('navigation', { name: 'Footer' })
    .getByRole('link');
  const count = await links.count();
  expect(count).toBeGreaterThanOrEqual(6);
  for (let i = 0; i < count; i += 1) {
    const box = await links.nth(i).boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  }
});

test('filter targets are at least 44px tall', async ({ page }) => {
  await page.goto(`/place/${LONDON}`);
  const filter = page.getByRole('form', { name: 'Filter species' });
  await expect(filter).toBeVisible();
  const targets = [
    filter.getByRole('radio', { name: 'Birds' }),
    filter.getByRole('radio', { name: '25 km' }),
    // The switch input is small; its label is the touch target.
    filter.locator('label:has([role="switch"])'),
  ];
  for (const target of targets) {
    const box = await target.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  }
});
