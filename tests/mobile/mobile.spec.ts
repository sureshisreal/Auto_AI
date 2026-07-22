import { test, expect } from '../../src/core/runtime/fixtures/fixtures';

test.describe('Mobile Tests', () => {
  test.beforeEach(async ({ demoPage }) => {
    await demoPage.goToDemo();
  });

  test('should display page on mobile devices', async ({ demoPage }) => {
    await expect(demoPage.getAnimatedBox()).toBeVisible();
    await expect(demoPage.getAnimateButton()).toBeVisible();
  });

  test('should animate box on mobile', async ({ demoPage }) => {
    await demoPage.clickAnimateButton();
    await expect(demoPage.getAnimatedBox()).toBeVisible();
  });
});
