import { test } from '@playwright/test';
import { expectNoAxeViolations, LONDON, MEDAN, MILKY_STORK } from './helpers';

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'place', path: `/place/${LONDON}` },
  {
    name: 'species',
    path: `/species/${MILKY_STORK}?place=${MEDAN}&radius=25`,
  },
  { name: 'privacy', path: '/privacy' },
  { name: 'terms', path: '/terms' },
  { name: 'accessibility', path: '/accessibility' },
  { name: 'credits', path: '/credits' },
  { name: 'offline', path: '/offline' },
] as const;

for (const { name, path } of PAGES) {
  test(`axe: ${name} has no violations`, async ({ page }) => {
    await page.goto(path);
    await page.getByRole('heading', { level: 1 }).first().waitFor();
    await page.waitForLoadState('networkidle');
    await expectNoAxeViolations(page);
  });
}

test.describe('dark colour scheme', () => {
  test.use({ colorScheme: 'dark' });
  for (const { name, path } of PAGES.filter((item) =>
    ['home', 'place'].includes(item.name)
  )) {
    test(`axe dark: ${name} has no violations`, async ({ page }) => {
      await page.goto(path);
      await page.getByRole('heading', { level: 1 }).first().waitFor();
      await page.waitForLoadState('networkidle');
      await expectNoAxeViolations(page);
    });
  }
});
