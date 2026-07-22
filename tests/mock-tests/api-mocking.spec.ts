import { test, expect } from '@playwright/test';

test.describe('Mock Tests - API Response Stubbing', () => {
  test('should mock an API response', async ({ page }) => {
    // Arrange
    await page.route('**/api/data', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ data: 'mocked data' })
      });
    });
    await page.goto('https://example.com');

    // Act
    const response = await page.evaluate(async () => {
      const res = await fetch('/api/data');
      return res.json();
    });

    // Assert
    expect(response.data).toBe('mocked data');
  });
});
