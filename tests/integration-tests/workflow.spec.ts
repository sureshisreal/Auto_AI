import { test, expect } from '../../src/fixtures/fixtures';

test.describe('Integration Tests - E2E Workflows', () => {
  test('should complete a sample user workflow on demo site', async ({ demoPage }) => {
    // Arrange
    await demoPage.goToDemo();

    // Act
    await demoPage.clickAnimateButton();

    // Assert
    await expect(demoPage.getAnimatedBox()).toBeVisible();
  });
});
