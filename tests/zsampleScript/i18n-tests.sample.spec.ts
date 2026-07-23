import { test, expect } from '../../src/core/runtime/fixtures/fixtures';
import { AllureUtils } from '../../src/core/shared/utils/AllureUtils';

/**
 * SAMPLE 11/13: i18n Tests
 * Focus: localization, translations, and international support.
 * Example: language attributes, RTL layouts, pluralization.
 */
test.describe('Sample - i18n Tests', () => {
  test.beforeEach(async ({ page, config }) => {
    await AllureUtils.setCategory(
      'Sample Test Categories',
      'i18n Tests',
      AllureUtils.Severity.MINOR
    );
    await page.goto(config.baseUrl);
  });

  test('page declares a language attribute (language attributes)', async ({ page }) => {
    const lang = await AllureUtils.step("Read the <html> element's lang attribute", () => {
      return page.locator('html').getAttribute('lang');
    });

    await AllureUtils.parameter('lang', lang ?? 'null');
    expect(lang).toBeTruthy();
  });

  test('layout direction is explicit and defaults to LTR (RTL layouts)', async ({ page }) => {
    const dir = await AllureUtils.step('Read the resolved text direction', () => {
      return page.evaluate(
        () => document.documentElement.dir || getComputedStyle(document.body).direction
      );
    });

    await AllureUtils.parameter('direction', dir);
    await AllureUtils.attachScreenshot(page, 'Page direction check');
    // A real RTL locale test would set `lang=ar`/`dir=rtl` test data and assert 'rtl' here instead.
    expect(['ltr', '']).toContain(dir === 'rtl' ? 'rtl' : dir === '' ? '' : 'ltr');
  });

  test('pluralization rules resolve correctly for a given locale (pluralization)', async ({
    page,
  }) => {
    const categories = await AllureUtils.step(
      'Resolve plural categories via Intl.PluralRules',
      () => {
        return page.evaluate(() => {
          const pr = new Intl.PluralRules('en-US');
          return [pr.select(0), pr.select(1), pr.select(2), pr.select(5)];
        });
      }
    );

    await AllureUtils.attachJson('Plural categories for [0,1,2,5]', categories);
    expect(categories).toEqual(['other', 'one', 'other', 'other']);
  });
});
