import { expect, test } from '@playwright/test';
import { LONDON } from './helpers';

// Raw HTML via request.get: no JavaScript runs, so this is what a crawler sees.
test('place page is server-rendered with species, meta and dehydrated state', async ({
  request,
}) => {
  const response = await request.get(`/place/${LONDON}`);
  expect(response.status()).toBe(200);
  const html = await response.text();

  expect(html).toMatch(/<h1[^>]*>\s*London\s*<\/h1>/);
  expect(html).toMatch(
    /<meta[^>]+property="og:title"[^>]+content="[^"]*London/
  );

  const names = [...html.matchAll(/<h3[^>]*>([^<]+)<\/h3>/g)];
  expect(names.length).toBeGreaterThan(5);

  // TanStack Query dehydrated state is streamed in the document.
  expect(html).toMatch(/queryKey:\$R\[\d+\]=\["place"/);
  expect(html).toMatch(/queryKey:\$R\[\d+\]=\["species"/);
});
