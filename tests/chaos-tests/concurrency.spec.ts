import { test, expect } from '@playwright/test';

test.describe('Chaos Tests - Concurrency & Robustness', () => {
  test('should handle concurrent interactions', async ({ browser }) => {
    const context = await browser.newContext();
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    
    await Promise.all([
      page1.goto('https://example.com'),
      page2.goto('https://example.com')
    ]);
    
    expect(await page1.title()).toBeTruthy();
    expect(await page2.title()).toBeTruthy();
  });
});
