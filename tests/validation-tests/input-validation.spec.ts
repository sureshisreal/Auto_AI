import { test, expect } from '../../src/fixtures/fixtures';

test.describe('Validation Tests - Input Validation', () => {
  test('should reject empty credentials', async ({ loginPage }) => {
    // Arrange
    await loginPage.navigate();

    // Act
    await loginPage.clickLogin();

    // Assert
    await expect(loginPage.getErrorMessageLocator()).toBeVisible();
  });
});
