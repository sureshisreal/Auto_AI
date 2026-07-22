import { test, expect } from '@playwright/test';

test.describe('Performance Tests - Load Times & Metrics', () => {
  test('should have reasonable page load time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('https://example.com');
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(5000); // 5 seconds
  });
});
