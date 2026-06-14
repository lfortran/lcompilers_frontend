import { test, expect } from '@playwright/test';

test('playground loads successfully', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('button', { name: 'Run' })).toBeVisible();
});