import { test, expect } from '../../src/core/runtime/fixtures/fixtures';
import { allure } from 'allure-playwright';

test.describe('Demo Page - Smoke Tests', () => {
  test('should load demo page successfully with visual and performance checks', async ({
    demoPage,
    visualRegressionUtils,
    performanceUtils,
  }) => {
    await allure.epic('Smoke Tests');
    await allure.feature('Demo Page');
    await allure.severity('critical');

    // Act
    await demoPage.goToDemo();

    // Assert - standard
    await expect(demoPage.getAnimatedBox()).toBeVisible();
    await expect(demoPage.getAnimateButton()).toBeVisible();

    // Visual regression check
    const visualMatch = await visualRegressionUtils.checkVisualRegression('demo-page-smoke');
    expect(visualMatch).toBeTruthy();

    // Performance check
    const metrics = await performanceUtils.getPageLoadMetrics();
    expect(metrics.loadComplete).toBeLessThan(10000);
  });

  test('should click animate button with visual check', async ({
    demoPage,
    visualRegressionUtils,
  }) => {
    await allure.epic('Smoke Tests');
    await allure.feature('Demo Page');
    await allure.severity('normal');

    // Arrange
    await demoPage.goToDemo();

    // Act
    await demoPage.clickAnimateButton();

    // Assert - standard
    await expect(demoPage.getAnimatedBox()).toBeVisible();

    // Visual regression check after interaction
    const visualMatch = await visualRegressionUtils.checkVisualRegression(
      'demo-page-after-animation'
    );
    expect(visualMatch).toBeTruthy();
  });
});
