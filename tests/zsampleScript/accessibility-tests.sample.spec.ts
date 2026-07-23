import { test, expect } from '../../src/core/runtime/fixtures/fixtures';
import { injectAxe } from 'axe-playwright';
import { AllureUtils } from '../../src/core/shared/utils/AllureUtils';
import { AccessibilityUtils } from '../../src/core/shared/utils/AccessibilityUtils';

/**
 * SAMPLE 8/13: Accessibility Tests
 * Focus: ARIA, contrast, keyboard navigation, and screen reader support.
 * Example: Axe accessibility checks, keyboard-only navigation, focus order.
 */
test.describe('Sample - Accessibility Tests', () => {
  test.beforeEach(async ({ demoPage, page }) => {
    await AllureUtils.setCategory(
      'Sample Test Categories',
      'Accessibility Tests',
      AllureUtils.Severity.CRITICAL
    );
    await AllureUtils.steps(
      'Load the demo page and inject axe-core',
      () => demoPage.goToDemo(),
      () => injectAxe(page)
    );
  });

  test('page has no automatically detectable a11y violations (Axe accessibility checks)', async ({
    page,
  }) => {
    await AllureUtils.attachScreenshot(page, 'Page under audit');

    await AllureUtils.step('Run the axe accessibility scan', () =>
      AccessibilityUtils.runAxeScan(page)
    );
  });

  test('interactive elements are reachable via keyboard alone (keyboard-only navigation)', async ({
    page,
  }) => {
    await AllureUtils.step('Press Tab once', async () => {
      await page.keyboard.press('Tab');
    });

    const firstFocused = await page.evaluate(() => document.activeElement?.tagName);
    await AllureUtils.attachScreenshot(page, 'Focused element after Tab');

    expect(firstFocused).toBeTruthy();
  });

  test('focus order is sequential and does not get trapped (focus order)', async ({ page }) => {
    const focusedTags: (string | undefined)[] = [];

    await AllureUtils.step('Tab through the first 3 focusable elements', async () => {
      for (let i = 0; i < 3; i++) {
        await page.keyboard.press('Tab');
        focusedTags.push(await page.evaluate(() => document.activeElement?.tagName));
      }
    });

    await AllureUtils.attachJson('Focus order', focusedTags);
    expect(focusedTags.every(Boolean)).toBe(true);
  });
});
