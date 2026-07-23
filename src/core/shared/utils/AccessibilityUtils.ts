import { Page } from '@playwright/test';
import { checkA11y } from 'axe-playwright';

/**
 * Shared axe-core scan defaults, so every accessibility test asserts the
 * same way instead of redefining the options object per file. Decoupled
 * from Allure on purpose - not every caller reports to Allure (see
 * tests/accessibility/a11y.spec.ts), so wrapping this in a step is left to
 * the caller (e.g. via `AllureUtils.step`).
 */
export class AccessibilityUtils {
  public static async runAxeScan(page: Page): Promise<void> {
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: { html: true },
    });
  }
}
