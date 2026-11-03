import { expect, test } from '@playwright/test';
import { SECURITY_HEADERS } from './helpers';

test('home carries the security headers', async ({ request }) => {
  const response = await request.get('/');
  const headers = response.headers();
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    expect(headers[name]).toBe(value);
  }
  expect(headers['permissions-policy']).toContain('geolocation=(self)');
  const csp = headers['content-security-policy-report-only'] ?? '';
  expect(csp).toContain("connect-src 'self' https://api.inaturalist.org");
  expect(csp).toContain('https://inaturalist-open-data.s3.amazonaws.com');
  expect(csp).toContain('https://static.inaturalist.org');
});

test('service worker is never cached by the browser', async ({ request }) => {
  const response = await request.get('/sw.js');
  expect(response.status()).toBe(200);
  expect(response.headers()['cache-control']).toContain('no-cache');
});

test('hashed assets are immutable for a year', async ({ request }) => {
  const html = await (await request.get('/')).text();
  const asset = /(?:src|href)="(\/assets\/[^"]+\.(?:js|css))"/.exec(html)?.[1];
  expect(asset).toBeDefined();
  const response = await request.get(asset ?? '');
  expect(response.status()).toBe(200);
  expect(response.headers()['cache-control']).toContain('max-age=31536000');
  expect(response.headers()['cache-control']).toContain('immutable');
});
