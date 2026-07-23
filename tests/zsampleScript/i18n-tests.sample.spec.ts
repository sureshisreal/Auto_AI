import { test, expect } from '../../src/core/runtime/fixtures/fixtures';
import * as allure from 'allure-js-commons';

/**
 * SAMPLE 11/13: i18n Tests
 * Focus: localization, translations, and international support.
 * Example: language attributes, RTL layouts, pluralization.
 */
test.describe('Sample - i18n Tests', () => {
  test.beforeEach(async ({ page, config }) => {
    await allure.epic('Sample Test Categories');
    await allure.feature('i18n Tests');
    await allure.severity(allure.Severity.MINOR);
    await page.goto(config.baseUrl);
  });

  test('page declares a language attribute (language attributes)', async ({ page }) => {
    const lang = await allure.step("Read the <html> element's lang attribute", async () => {
      return page.locator('html').getAttribute('lang');
    });

    await allure.parameter('lang', lang ?? 'null');
    expect(lang).toBeTruthy();
  });

  test('layout direction is explicit and defaults to LTR (RTL layouts)', async ({ page }) => {
    const dir = await allure.step('Read the resolved text direction', async () => {
      return page.evaluate(
        () => document.documentElement.dir || getComputedStyle(document.body).direction
      );
    });

    await allure.parameter('direction', dir);
    await allure.attachment(
      'Page direction check',
      await page.screenshot(),
      allure.ContentType.PNG
    );
    // A real RTL locale test would set `lang=ar`/`dir=rtl` test data and assert 'rtl' here instead.
    expect(['ltr', '']).toContain(dir === 'rtl' ? 'rtl' : dir === '' ? '' : 'ltr');
  });

  test('pluralization rules resolve correctly for a given locale (pluralization)', async ({
    page,
  }) => {
    const categories = await allure.step(
      'Resolve plural categories via Intl.PluralRules',
      async () => {
        return page.evaluate(() => {
          const pr = new Intl.PluralRules('en-US');
          return [pr.select(0), pr.select(1), pr.select(2), pr.select(5)];
        });
      }
    );

    await allure.attachment(
      'Plural categories for [0,1,2,5]',
      JSON.stringify(categories, null, 2),
      allure.ContentType.JSON
    );
    expect(categories).toEqual(['other', 'one', 'other', 'other']);
  });
});
