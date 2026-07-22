import { test, expect } from '../../src/fixtures/fixtures';
import { URLS } from '../../src/testdata/urls.testdata';

test.describe('WeSendCV Tests - POM & Data-Driven', () => {
  test('should load WeSendCV homepage', async ({ weSendCVPage }) => {
    // Act
    await weSendCVPage.goToWeSendCV(URLS.WE_SEND_CV);

    // Assert
    await expect(weSendCVPage.getNavigationMenu()).toBeVisible();
  });
});
