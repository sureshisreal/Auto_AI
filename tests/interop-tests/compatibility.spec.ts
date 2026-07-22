import { test, expect } from '@playwright/test';

test.describe('Interop Tests - Cross-Browser Compatibility', () => {
  test('should render page correctly across browsers', async ({ page }) => {
    await page.goto('https://example.com');
    expect(await page.title()).toBeTruthy();
  });
});
