import { test, expect } from '../../src/core/runtime/fixtures/fixtures';
import { allure } from 'allure-playwright';

test.describe('Visual Regression Examples', () => {
  test('Demo Page Visual Test', async ({ demoPage, visualRegressionUtils }) => {
    await allure.epic('Visual Testing');
    await allure.feature('Demo Page');
    await allure.severity('normal');

    // Navigate to demo page
    await demoPage.goToDemo();

    // Check visual regression
    const matches = await visualRegressionUtils.checkVisualRegression('demo-page', {
      threshold: 0.1,
    });

    expect(matches).toBeTruthy();
  });

  test('Page Load Metrics', async ({ demoPage, performanceUtils }) => {
    await allure.epic('Performance Testing');
    await allure.feature('Demo Page');
    await allure.severity('normal');

    // Navigate to demo page
    await demoPage.goToDemo();

    // Capture page load metrics
    const metrics = await performanceUtils.getPageLoadMetrics();

    expect(metrics.loadComplete).toBeLessThan(5000);
  });
});
