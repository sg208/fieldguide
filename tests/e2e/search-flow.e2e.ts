import { expect, test } from '@playwright/test';

test('search, pick London, then filters update the URL and back restores them', async ({
  page,
}) => {
  await page.goto('/');
  const input = page.getByRole('combobox');
  await input.fill('Lon');

  const option = page
    .getByRole('listbox', { name: 'Cities' })
    .getByRole('option')
    .filter({ hasText: 'London' })
    .filter({ hasText: 'United Kingdom' })
    .first();
  await expect(option).toBeVisible();
  await option.click();

  await expect(page).toHaveURL(/\/place\/\d+$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/London/);

  const filter = page.getByRole('form', { name: 'Filter species' });
  const grid = page.getByRole('heading', { level: 2, name: /most observed/ });

  await filter.getByRole('radio', { name: 'Birds' }).click();
  await expect(page).toHaveURL(/group=birds/);
  await expect(grid).toContainText('Birds');

  await filter.getByRole('radio', { name: '50 km' }).click();
  await expect(page).toHaveURL(/radius=50/);

  await filter.getByRole('switch').click();
  await expect(page).toHaveURL(/month=\d+/);
  await expect(grid).toContainText(' in ');

  await page.goBack();
  await expect(page).not.toHaveURL(/month=/);
  await expect(page).toHaveURL(/radius=50/);
  await expect(page).toHaveURL(/group=birds/);
  await expect(filter.getByRole('radio', { name: '50 km' })).toBeChecked();
  await expect(grid).not.toContainText(' in ');

  await page.goBack();
  await expect(page).not.toHaveURL(/radius=/);
  await expect(page).toHaveURL(/group=birds/);
  await expect(filter.getByRole('radio', { name: '25 km' })).toBeChecked();
});
