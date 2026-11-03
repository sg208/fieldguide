import { expect, test } from '@playwright/test';

test('manifest declares the installable app', async ({ request }) => {
  const response = await request.get('/manifest.webmanifest');
  expect(response.status()).toBe(200);
  const manifest = await response.json();
  expect(manifest.name).toBe('Field Guide');
  expect(manifest.start_url).toBe('/');
  expect(manifest.display).toBe('standalone');
  expect(manifest.theme_color).toBe('#E4E8E1');
  expect(manifest.background_color).toBe('#E4E8E1');

  const icons: { sizes: string; purpose: string; type: string }[] =
    manifest.icons;
  const has = (sizes: string, purpose: string): boolean =>
    icons.some(
      (icon) =>
        icon.sizes === sizes &&
        icon.purpose === purpose &&
        icon.type === 'image/png'
    );
  expect(has('192x192', 'any')).toBe(true);
  expect(has('512x512', 'any')).toBe(true);
  expect(has('512x512', 'maskable')).toBe(true);
});

test('every manifest icon is served', async ({ request }) => {
  const manifest = await (await request.get('/manifest.webmanifest')).json();
  for (const icon of manifest.icons as { src: string }[]) {
    const response = await request.get(icon.src);
    expect(response.status(), icon.src).toBe(200);
  }
});

test('service worker registers and serves the offline page without a network', async ({
  page,
  context,
}) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  // The worker claims clients on activate; wait until it controls this page.
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);

  await context.setOffline(true);
  await page.goto('/place/2643743').catch(() => undefined);
  await expect(page).toHaveURL(/\/offline$/);
  await expect(
    page.getByRole('heading', { level: 1, name: 'You’re offline' })
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
  await context.setOffline(false);
});
