import { test, expect } from '@playwright/test';

test.describe('Resilience Tests - Resource Failure Handling', () => {
  test('should handle missing resources', async ({ page }) => {
    await page.route('**/*.css', route => route.abort());
    await page.goto('https://example.com');
    expect(await page.title()).toBeTruthy();
  });
});
