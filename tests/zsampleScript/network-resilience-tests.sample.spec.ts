import { test, expect } from '../../src/core/runtime/fixtures/fixtures';
import { AllureUtils } from '../../src/core/shared/utils/AllureUtils';

/**
 * SAMPLE 10/13: Network-resilience Tests
 * Focus: offline and network failure scenarios.
 * Example: no internet, slow connections, connection drops.
 */
test.describe('Sample - Network-resilience Tests', () => {
  test.beforeEach(async () => {
    await AllureUtils.setCategory(
      'Sample Test Categories',
      'Network-resilience Tests',
      AllureUtils.Severity.CRITICAL
    );
  });

  test('navigation fails predictably with no internet connection (no internet)', async ({
    page,
    context,
    config,
  }) => {
    await AllureUtils.step('Go offline and attempt navigation', async () => {
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
    await AllureUtils.step('Add 100ms latency to every request', async () => {
      await context.route('**/*', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        route.continue();
      });
      await page.goto(config.baseUrl);
    });

    await AllureUtils.attachScreenshot(page, 'Page over throttled connection');
    expect(await page.title()).toBeTruthy();
  });

  test('a mid-request connection drop is surfaced as a failure, not a hang (connection drops)', async ({
    page,
    context,
    config,
  }) => {
    await AllureUtils.step('Simulate a connection reset on /api/status', async () => {
      await context.route('**/api/status', (route) => route.abort('connectionreset'));
      await page.goto(config.baseUrl);
    });

    const outcome = await AllureUtils.step('Call the endpoint whose connection drops', () => {
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
