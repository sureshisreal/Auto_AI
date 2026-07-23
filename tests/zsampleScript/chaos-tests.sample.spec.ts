import { test, expect } from '../../src/core/runtime/fixtures/fixtures';
import * as allure from 'allure-js-commons';

/**
 * SAMPLE 13/13: Chaos Tests
 * Focus: concurrency, race conditions, and system robustness.
 * Example: multiple users, DB failures, random delays.
 */
test.describe('Sample - Chaos Tests', () => {
  test.beforeEach(async () => {
    await allure.epic('Sample Test Categories');
    await allure.feature('Chaos Tests');
    await allure.severity(allure.Severity.NORMAL);
  });

  test('multiple concurrent users can load the app at the same time (multiple users)', async ({
    browser,
    config,
  }) => {
    const context = await browser.newContext();
    const [user1, user2, user3] = await Promise.all([
      context.newPage(),
      context.newPage(),
      context.newPage(),
    ]);

    await allure.step('3 users hit the app simultaneously', async () => {
      await Promise.all([
        user1.goto(config.baseUrl),
        user2.goto(config.baseUrl),
        user3.goto(config.baseUrl),
      ]);
    });

    await allure.attachment('User 1 view', await user1.screenshot(), allure.ContentType.PNG);
    for (const page of [user1, user2, user3]) {
      expect(await page.title()).toBeTruthy();
    }

    await context.close();
  });

  test('one user surviving a backend outage while another succeeds (DB/backend failures)', async ({
    browser,
    config,
  }) => {
    const context = await browser.newContext();
    const [healthyUser, degradedUser] = await Promise.all([context.newPage(), context.newPage()]);

    await degradedUser.route('**/api/status', (route) => route.abort());

    await allure.step('Healthy user and backend-degraded user load concurrently', async () => {
      await Promise.all([healthyUser.goto(config.baseUrl), degradedUser.goto(config.baseUrl)]);
    });

    await allure.attachment(
      'Degraded user view',
      await degradedUser.screenshot(),
      allure.ContentType.PNG
    );
    // The degraded user's page still renders even though its backend call is broken.
    expect(await healthyUser.title()).toBeTruthy();
    expect(await degradedUser.title()).toBeTruthy();

    await context.close();
  });

  test('requests completing in a random order do not corrupt page state (random delays)', async ({
    browser,
    config,
  }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await context.route('**/*.png', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 200));
      route.continue();
    });

    await allure.step('Load the page with randomized image response timing', async () => {
      await page.goto(config.baseUrl);
    });

    expect(await page.title()).toBeTruthy();
    await context.close();
  });
});
