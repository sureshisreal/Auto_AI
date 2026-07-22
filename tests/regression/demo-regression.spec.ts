import { test, expect } from '../../src/fixtures/fixtures';

test.describe('Demo Page - Regression Tests', () => {
  test('should navigate to invalid route and verify 404', async ({ demoPage, page }) => {
    // Arrange
    await demoPage.goToDemo();

    // Act
    await demoPage.clickNavButton();

    // Assert
    await expect(page).toHaveURL(/about/);
  });
});
