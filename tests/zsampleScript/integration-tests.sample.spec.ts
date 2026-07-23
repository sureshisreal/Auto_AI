import { test, expect } from '../../src/core/runtime/fixtures/fixtures';
import * as allure from 'allure-js-commons';

/**
 * SAMPLE 2/13: Integration Tests
 * Focus: end-to-end workflows across multiple components, not one action in isolation.
 * Example: multi-step navigation, full user journeys.
 */
test.describe('Sample - Integration Tests', () => {
  test.beforeEach(async () => {
    await allure.epic('Sample Test Categories');
    await allure.feature('Integration Tests');
    await allure.severity(allure.Severity.CRITICAL);
  });

  test('demo journey: load page -> animate -> navigate to a second page', async ({
    demoPage,
    page,
  }) => {
    await allure.step('Land on the demo page', async () => {
      await demoPage.goToDemo();
      await expect(demoPage.getAnimatedBox()).toBeVisible();
    });
    await allure.attachment('After page load', await page.screenshot(), allure.ContentType.PNG);

    await allure.step('Trigger an interaction that depends on the page having loaded', async () => {
      await demoPage.clickAnimateButton();
      await expect(demoPage.getAnimatedBox()).toBeVisible();
    });
    await allure.attachment(
      'After animation trigger',
      await page.screenshot(),
      allure.ContentType.PNG
    );

    await allure.step('Multi-step navigation to a second page', async () => {
      await demoPage.clickNavButton();
      await expect(page).toHaveURL(/about/);
    });
    await allure.attachment('After navigation', await page.screenshot(), allure.ContentType.PNG);
  });
});
