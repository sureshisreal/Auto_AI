import { test } from '../../src/fixtures/fixtures';

test.describe('Accessibility Tests - Keyboard Navigation', () => {
  test('should navigate via keyboard', async ({ demoPage, page }) => {
    // Arrange
    await demoPage.goToDemo();

    // Act
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
  });
});
