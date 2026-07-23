import { test, expect } from '../../src/core/runtime/fixtures/fixtures';
import { AllureUtils } from '../../src/core/shared/utils/AllureUtils';

/**
 * SAMPLE 2/13: Integration Tests
 * Focus: end-to-end workflows across multiple components, not one action in isolation.
 * Example: multi-step navigation, full user journeys.
 */
test.describe('Sample - Integration Tests', () => {
  test.beforeEach(async () => {
    await AllureUtils.setCategory(
      'Sample Test Categories',
      'Integration Tests',
      AllureUtils.Severity.CRITICAL
    );
  });

  test('demo journey: load page -> animate -> navigate to a second page', async ({
    demoPage,
    page,
  }) => {
    await AllureUtils.step('Land on the demo page', async () => {
      await demoPage.goToDemo();
      await expect(demoPage.getAnimatedBox()).toBeVisible();
    });
    await AllureUtils.attachScreenshot(page, 'After page load');

    await AllureUtils.step(
      'Trigger an interaction that depends on the page having loaded',
      async () => {
        await demoPage.clickAnimateButton();
        await expect(demoPage.getAnimatedBox()).toBeVisible();
      }
    );
    await AllureUtils.attachScreenshot(page, 'After animation trigger');

    await AllureUtils.step('Multi-step navigation to a second page', async () => {
      await demoPage.clickNavButton();
      await expect(page).toHaveURL(/about/);
    });
    await AllureUtils.attachScreenshot(page, 'After navigation');
  });
});
