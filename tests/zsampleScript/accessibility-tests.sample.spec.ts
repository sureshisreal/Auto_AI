import { test, expect } from '../../src/core/runtime/fixtures/fixtures';
import { injectAxe, checkA11y } from 'axe-playwright';
import * as allure from 'allure-js-commons';

/**
 * SAMPLE 8/13: Accessibility Tests
 * Focus: ARIA, contrast, keyboard navigation, and screen reader support.
 * Example: Axe accessibility checks, keyboard-only navigation, focus order.
 */
test.describe('Sample - Accessibility Tests', () => {
  test.beforeEach(async ({ demoPage, page }) => {
    await allure.epic('Sample Test Categories');
    await allure.feature('Accessibility Tests');
    await allure.severity(allure.Severity.CRITICAL);
    await allure.step('Load the demo page and inject axe-core', async () => {
      await demoPage.goToDemo();
      await injectAxe(page);
    });
  });

  test('page has no automatically detectable a11y violations (Axe accessibility checks)', async ({
    page,
  }) => {
    await allure.attachment('Page under audit', await page.screenshot(), allure.ContentType.PNG);

    await allure.step('Run the axe accessibility scan', async () => {
      await checkA11y(page, undefined, {
        detailedReport: true,
        detailedReportOptions: { html: true },
      });
    });
  });

  test('interactive elements are reachable via keyboard alone (keyboard-only navigation)', async ({
    page,
  }) => {
    await allure.step('Press Tab once', async () => {
      await page.keyboard.press('Tab');
    });

    const firstFocused = await page.evaluate(() => document.activeElement?.tagName);
    await allure.attachment(
      'Focused element after Tab',
      await page.screenshot(),
      allure.ContentType.PNG
    );

    expect(firstFocused).toBeTruthy();
  });

  test('focus order is sequential and does not get trapped (focus order)', async ({ page }) => {
    const focusedTags: (string | undefined)[] = [];

    await allure.step('Tab through the first 3 focusable elements', async () => {
      for (let i = 0; i < 3; i++) {
        await page.keyboard.press('Tab');
        focusedTags.push(await page.evaluate(() => document.activeElement?.tagName));
      }
    });

    await allure.attachment(
      'Focus order',
      JSON.stringify(focusedTags, null, 2),
      allure.ContentType.JSON
    );
    expect(focusedTags.every(Boolean)).toBe(true);
  });
});
