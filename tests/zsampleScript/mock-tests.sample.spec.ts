import { test, expect } from '../../src/core/runtime/fixtures/fixtures';
import * as allure from 'allure-js-commons';

/**
 * SAMPLE 6/13: Mock Tests
 * Focus: error handling via response mocking and stubbing.
 * Example: API failures, slow networks, unavailable services, XHR stubbing.
 */
test.describe('Sample - Mock Tests', () => {
  test.beforeEach(async () => {
    await allure.epic('Sample Test Categories');
    await allure.feature('Mock Tests');
    await allure.severity(allure.Severity.NORMAL);
  });

  test('handles a mocked API failure (API failures)', async ({ page, config }) => {
    await allure.step('Mock /api/data to return 500', async () => {
      await page.route('**/api/data', (route) => {
        route.fulfill({ status: 500, body: JSON.stringify({ error: 'Internal Server Error' }) });
      });
      await page.goto(config.baseUrl);
    });

    const response = await allure.step('Call the mocked endpoint', async () => {
      return page.evaluate(async () => {
        const res = await fetch('/api/data');
        return { status: res.status, ok: res.ok };
      });
    });

    await allure.attachment(
      'Mocked response',
      JSON.stringify(response, null, 2),
      allure.ContentType.JSON
    );
    expect(response.ok).toBeFalsy();
    expect(response.status).toBe(500);
  });

  test('handles a mocked slow network response (slow networks)', async ({ page, config }) => {
    await allure.step('Mock /api/data with a 300ms delay', async () => {
      await page.route('**/api/data', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        route.fulfill({ status: 200, body: JSON.stringify({ data: 'delayed but arrived' }) });
      });
      await page.goto(config.baseUrl);
    });

    const start = Date.now();
    const response = await allure.step('Call the delayed endpoint', async () => {
      return page.evaluate(async () => {
        const res = await fetch('/api/data');
        return res.json();
      });
    });
    const elapsed = Date.now() - start;
    await allure.parameter('elapsedMs', String(elapsed));

    expect(response.data).toBe('delayed but arrived');
    expect(elapsed).toBeGreaterThanOrEqual(300);
  });

  test('handles a mocked unavailable service (unavailable services)', async ({ page, config }) => {
    await allure.step('Mock /api/data as connection-refused', async () => {
      await page.route('**/api/data', (route) => route.abort('connectionrefused'));
      await page.goto(config.baseUrl);
    });

    const requestFailed = await allure.step('Call the unavailable endpoint', async () => {
      return page.evaluate(async () => {
        try {
          await fetch('/api/data');
          return false;
        } catch {
          return true;
        }
      });
    });

    expect(requestFailed).toBe(true);
  });
});
