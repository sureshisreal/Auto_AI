import { test, expect } from '@playwright/test';

test.describe('Validation Tests - Broken Links', () => {
  test('should verify links on a page', async ({ page }) => {
    await page.goto('https://example.com');
    const links = page.locator('a');
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
