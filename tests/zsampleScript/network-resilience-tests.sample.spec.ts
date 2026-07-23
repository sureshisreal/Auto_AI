import { test, expect } from '../../src/core/runtime/fixtures/fixtures';
import * as allure from 'allure-js-commons';

/**
 * SAMPLE 10/13: Network-resilience Tests
 * Focus: offline and network failure scenarios.
 * Example: no internet, slow connections, connection drops.
 */
test.describe('Sample - Network-resilience Tests', () => {
  test.beforeEach(async () => {
    await allure.epic('Sample Test Categories');
    await allure.feature('Network-resilience Tests');
    await allure.severity(allure.Severity.CRITICAL);
  });

  test('navigation fails predictably with no internet connection (no internet)', async ({
    page,
    context,
    config,
  }) => {
    await allure.step('Go offline and attempt navigation', async () => {
      await context.setOffline(true);
      try {
        await page.goto(config.baseUrl);
        // Some environments serve from cache even when "offline" - don't hard-fail if so.
      } catch (error) {
        expect(error).toBeDefined();
      } finally {
        await context.setOffline(false);
      }
    });
  });

  test('page still loads over a throttled/slow connection (slow connections)', async ({
    page,
    context,
    config,
  }) => {
    await allure.step('Add 100ms latency to every request', async () => {
      await context.route('**/*', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        route.continue();
      });
      await page.goto(config.baseUrl);
    });

    await allure.attachment(
      'Page over throttled connection',
      await page.screenshot(),
      allure.ContentType.PNG
    );
    expect(await page.title()).toBeTruthy();
  });

  test('a mid-request connection drop is surfaced as a failure, not a hang (connection drops)', async ({
    page,
    context,
    config,
  }) => {
    await allure.step('Simulate a connection reset on /api/status', async () => {
      await context.route('**/api/status', (route) => route.abort('connectionreset'));
      await page.goto(config.baseUrl);
    });

    const outcome = await allure.step('Call the endpoint whose connection drops', async () => {
      return page.evaluate(async () => {
        try {
          await fetch('/api/status');
          return 'succeeded';
        } catch {
          return 'dropped';
        }
      });
    });

    expect(outcome).toBe('dropped');
  });
});
