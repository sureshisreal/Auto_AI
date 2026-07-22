import { test, expect } from '@playwright/test';

test.describe('Invalid Route Tests', () => {
  test('should show 404 for invalid route', async ({ page }) => {
    const response = await page.goto('/about');
    expect(response?.status()).toBe(404);
  });
});
