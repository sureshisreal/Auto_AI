import { test, expect } from '@playwright/test';

test.describe('i18n Tests - Localization & Translations', () => {
  test('should check page language', async ({ page }) => {
    await page.goto('https://example.com');
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBeTruthy();
  });
});
