import { expect, test } from '@playwright/test';
import { LONDON } from './helpers';

const NOT_FOUND = 'Not in the collection';

test('unknown place id shows the 404 UI', async ({ page }) => {
  const response = await page.goto('/place/999999999');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(NOT_FOUND);
});

test('unknown species id shows the 404 UI', async ({ page }) => {
  const response = await page.goto('/species/999999999');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(NOT_FOUND);
});

test('non-numeric place id is a 404', async ({ page }) => {
  const response = await page.goto('/place/abc');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(NOT_FOUND);
});

test('invalid radius falls back to the default radius, not a 500', async ({
  page,
}) => {
  // The first hop is a redirect to the clean URL; assert the final state.
  const response = await page.goto(`/place/${LONDON}?radius=7`);
  expect(response?.status()).toBe(200);
  await expect(page).toHaveURL(new RegExp(`/place/${LONDON}$`));
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('London');
  await expect(page.getByRole('radio', { name: '25 km' })).toBeChecked();
});

test('a valid place page does not answer 500', async ({ request }) => {
  const response = await request.get(`/place/${LONDON}`);
  expect(response.status()).toBeLessThan(500);
});
