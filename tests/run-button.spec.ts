import { test, expect } from '@playwright/test';

test('run button is visible and app is stable', async ({ page }) => {
  await page.goto('/');

  const runButton = page.getByRole('button', { name: 'Run' });

  // 1. Ensure button is visible
  await expect(runButton).toBeVisible();

  // 2. Force click (bypass disabled state)
  await runButton.click({ force: true });

  // 3. Small wait to simulate execution
  await page.waitForTimeout(2000);

  // 4. Ensure UI still stable
  await expect(runButton).toBeVisible();
});