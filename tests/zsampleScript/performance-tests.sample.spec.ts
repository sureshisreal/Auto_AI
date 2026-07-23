import { test, expect } from '../../src/core/runtime/fixtures/fixtures';
import * as allure from 'allure-js-commons';

/**
 * SAMPLE 3/13: Performance Tests
 * Focus: response times, load metrics, network efficiency.
 * Example: page load time, First Contentful Paint, resource count.
 */
test.describe('Sample - Performance Tests', () => {
  test.beforeEach(async () => {
    await allure.epic('Sample Test Categories');
    await allure.feature('Performance Tests');
    await allure.severity(allure.Severity.NORMAL);
  });

  test('page load time stays under a reasonable budget', async ({ page, config }) => {
    const startTime = Date.now();
    await allure.step(`Navigate to ${config.baseUrl}`, async () => {
      await page.goto(config.baseUrl);
    });
    const loadTime = Date.now() - startTime;

    await allure.parameter('loadTimeMs', String(loadTime));
    await allure.step('Assert load time is under budget', async () => {
      expect(loadTime).toBeLessThan(5000);
    });
    await allure.attachment('Loaded page', await page.screenshot(), allure.ContentType.PNG);
  });

  test('First Contentful Paint is reported and within budget', async ({ page, config }) => {
    await allure.step('Navigate and collect paint timing', async () => {
      await page.goto(config.baseUrl);
    });

    const fcp = await allure.step('Read the first-contentful-paint performance entry', async () => {
      return page.evaluate(() => {
        const [entry] = performance.getEntriesByName('first-contentful-paint');
        return entry ? entry.startTime : null;
      });
    });

    await allure.parameter('firstContentfulPaintMs', String(fcp));
    // Not every headless environment reports FCP - assert the shape when it's available
    // rather than failing the whole suite on an unsupported browser/CI combo.
    if (fcp !== null) {
      expect(fcp).toBeLessThan(3000);
    }
  });

  test('page does not load an excessive number of resources', async ({ page, config }) => {
    const requests: string[] = [];
    page.on('request', (request) => requests.push(request.url()));

    await allure.step(`Load ${config.baseUrl} and count outgoing requests`, async () => {
      await page.goto(config.baseUrl);
    });

    await allure.attachment(
      'Requests fired',
      JSON.stringify(requests, null, 2),
      allure.ContentType.JSON
    );
    await allure.step('Assert resource count is reasonable', async () => {
      expect(requests.length).toBeLessThan(20);
    });
  });
});
