import { test, expect } from '../../src/core/runtime/fixtures/fixtures';
import { URLS } from '../../src/core/data/testdata/urls.testdata';

test.describe('WeSendCV Tests - POM & Data-Driven', () => {
  test('should load WeSendCV homepage', async ({ weSendCVPage }) => {
    // Act
    await weSendCVPage.goToWeSendCV(URLS.WE_SEND_CV);

    // Assert
    await expect(weSendCVPage.getNavigationMenu()).toBeVisible();
  });
});
