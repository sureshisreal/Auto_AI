import { test, expect } from '../../src/fixtures/fixtures';

test.describe('E2E Tests - Critical-Path Flows', () => {
  test('should complete a full user journey on demo site', async ({ demoPage }) => {
    // Act
    await demoPage.goToDemo();

    // Assert
    await expect(demoPage.getAnimatedBox()).toBeVisible();

    // Act
    await demoPage.clickAnimateButton();
  });
});
