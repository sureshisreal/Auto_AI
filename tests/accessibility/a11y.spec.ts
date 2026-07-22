import { test } from '../../src/fixtures/fixtures';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ demoPage, page }) => {
    await demoPage.goToDemo();
    await injectAxe(page);
  });

  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: { html: true }
    });
  });
});
