import { test, expect } from '../../src/core/runtime/fixtures/fixtures';

test.describe('Demo Page - Smoke Tests', () => {
  test('should load demo page successfully', async ({ demoPage }) => {
    // Act
    await demoPage.goToDemo();

    // Assert
    await expect(demoPage.getAnimatedBox()).toBeVisible();
    await expect(demoPage.getAnimateButton()).toBeVisible();
  });

  test('should click animate button', async ({ demoPage }) => {
    // Arrange
    await demoPage.goToDemo();

    // Act
    await demoPage.clickAnimateButton();

    // Assert
    await expect(demoPage.getAnimatedBox()).toBeVisible();
  });
});
