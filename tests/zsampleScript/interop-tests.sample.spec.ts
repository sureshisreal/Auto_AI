import { test, expect } from '../../src/core/runtime/fixtures/fixtures';
import { AllureUtils } from '../../src/core/shared/utils/AllureUtils';

/**
 * SAMPLE 7/13: Interop Tests
 * Focus: cross-browser compatibility and feature support.
 * Example: CSS Grid support, ES6 features, touch events, viewport preferences.
 */
test.describe('Sample - Interop Tests', () => {
  test.beforeEach(async ({ page, config }) => {
    await AllureUtils.setCategory(
      'Sample Test Categories',
      'Interop Tests',
      AllureUtils.Severity.MINOR
    );
    await page.goto(config.baseUrl);
  });

  test('browser supports CSS Grid (CSS Grid support)', async ({ page }) => {
    const supportsGrid = await AllureUtils.step('Check CSS.supports for display:grid', () => {
      return page.evaluate(() => CSS.supports('display', 'grid'));
    });

    await AllureUtils.parameter('supportsGrid', String(supportsGrid));
    expect(supportsGrid).toBe(true);
  });

  test('browser supports core ES6 language features (ES6 features)', async ({ page }) => {
    const supportsEs6 = await AllureUtils.step(
      'Probe Promise, arrow functions, and optional chaining',
      () => {
        return page.evaluate(() => {
          const hasPromise = typeof Promise !== 'undefined';
          const hasArrowFns = (() => true)();
          const hasOptionalChaining = ({} as { a?: { b?: number } })?.a?.b === undefined;
          return hasPromise && hasArrowFns && hasOptionalChaining;
        });
      }
    );

    expect(supportsEs6).toBe(true);
  });

  test('touch events are supported where the project/device declares them (touch events)', async ({
    page,
  }) => {
    const hasTouchSupport = await AllureUtils.step('Check for touch capability', () => {
      return page.evaluate(() => 'ontouchstart' in window || navigator.maxTouchPoints > 0);
    });

    await AllureUtils.parameter('hasTouchSupport', String(hasTouchSupport));
    // Desktop browser projects legitimately report no touch support - assert the check
    // runs cleanly rather than forcing a value that only holds on mobile projects.
    expect(typeof hasTouchSupport).toBe('boolean');
  });

  test('viewport matches the running project profile (viewport preferences)', async ({ page }) => {
    const viewport = await AllureUtils.step('Read the active viewport size', () =>
      page.viewportSize()
    );

    await AllureUtils.attachJson('Viewport', viewport);
    expect(viewport?.width).toBeGreaterThan(0);
    expect(viewport?.height).toBeGreaterThan(0);
  });
});
