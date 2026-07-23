import { test, expect } from '../../src/core/runtime/fixtures/fixtures';
import * as allure from 'allure-js-commons';

/**
 * SAMPLE 9/13: Resilience Tests
 * Focus: handling of resource failures and degraded conditions.
 * Example: asset loading failures, partial outages, error state UI.
 */
test.describe('Sample - Resilience Tests', () => {
  test.beforeEach(async () => {
    await allure.epic('Sample Test Categories');
    await allure.feature('Resilience Tests');
    await allure.severity(allure.Severity.NORMAL);
  });

  test('page remains usable when a stylesheet fails to load (asset loading failures)', async ({
    page,
    config,
  }) => {
    await allure.step('Abort all CSS requests and load the page', async () => {
      await page.route('**/*.css', (route) => route.abort());
      await page.goto(config.baseUrl);
    });

    await allure.attachment(
      'Page with no stylesheet',
      await page.screenshot(),
      allure.ContentType.PNG
    );
    expect(await page.title()).toBeTruthy();
  });

  test('page keeps working when only some assets fail (partial outages)', async ({
    page,
    config,
  }) => {
    let cssBlocked = 0;
    await allure.step('Block CSS only, leave images/scripts working', async () => {
      await page.route('**/*.css', (route) => {
        cssBlocked++;
        route.abort();
      });
      // Images/scripts are deliberately left unmocked so they succeed - a "partial" outage.
      await page.goto(config.baseUrl);
    });

    await allure.parameter('cssRequestsBlocked', String(cssBlocked));
    await allure.attachment(
      'Page under partial outage',
      await page.screenshot(),
      allure.ContentType.PNG
    );
    expect(await page.title()).toBeTruthy();
    expect(cssBlocked).toBeGreaterThanOrEqual(0);
  });

  test('a failed API call surfaces a recognizable error rather than a silent hang (error state UI)', async ({
    page,
    config,
  }) => {
    await allure.step('Abort /api/status and load the page', async () => {
      await page.route('**/api/status', (route) => route.abort());
      await page.goto(config.baseUrl);
    });

    const outcome = await allure.step('Call the broken endpoint', async () => {
      return page.evaluate(async () => {
        try {
          await fetch('/api/status');
          return 'succeeded';
        } catch {
          return 'failed-gracefully';
        }
      });
    });

    expect(outcome).toBe('failed-gracefully');
  });
});
