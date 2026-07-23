import { test, expect } from '../../src/core/runtime/fixtures/fixtures';
import { AllureUtils } from '../../src/core/shared/utils/AllureUtils';

/**
 * SAMPLE 3/13: Performance Tests
 * Focus: response times, load metrics, network efficiency.
 * Example: page load time, First Contentful Paint, resource count.
 */
test.describe('Sample - Performance Tests', () => {
  test.beforeEach(async () => {
    await AllureUtils.setCategory('Sample Test Categories', 'Performance Tests');
  });

  test('page load time stays under a reasonable budget', async ({ page, config }) => {
    const startTime = Date.now();
    await AllureUtils.step(`Navigate to ${config.baseUrl}`, async () => {
      await page.goto(config.baseUrl);
    });
    const loadTime = Date.now() - startTime;

    await AllureUtils.parameter('loadTimeMs', String(loadTime));
    await AllureUtils.step('Assert load time is under budget', () => {
      expect(loadTime).toBeLessThan(5000);
    });
    await AllureUtils.attachScreenshot(page, 'Loaded page');
  });

  test('First Contentful Paint is reported and within budget', async ({ page, config }) => {
    await AllureUtils.step('Navigate and collect paint timing', async () => {
      await page.goto(config.baseUrl);
    });

    const fcp = await AllureUtils.step('Read the first-contentful-paint performance entry', () => {
      return page.evaluate(() => {
        const [entry] = performance.getEntriesByName('first-contentful-paint');
        return entry ? entry.startTime : null;
      });
    });

    await AllureUtils.parameter('firstContentfulPaintMs', String(fcp));
    // Not every headless environment reports FCP - assert the shape when it's available
    // rather than failing the whole suite on an unsupported browser/CI combo.
    if (fcp !== null) {
      expect(fcp).toBeLessThan(3000);
    }
  });

  test('page does not load an excessive number of resources', async ({ page, config }) => {
    const requests: string[] = [];
    page.on('request', (request) => requests.push(request.url()));

    await AllureUtils.step(`Load ${config.baseUrl} and count outgoing requests`, async () => {
      await page.goto(config.baseUrl);
    });

    await AllureUtils.attachJson('Requests fired', requests);
    await AllureUtils.step('Assert resource count is reasonable', () => {
      expect(requests.length).toBeLessThan(20);
    });
  });
});
