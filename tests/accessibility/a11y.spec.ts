import { test } from '../../src/core/runtime/fixtures/fixtures';
import { injectAxe } from 'axe-playwright';
import { AccessibilityUtils } from '../../src/core/shared/utils/AccessibilityUtils';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ demoPage, page }) => {
    await demoPage.goToDemo();
    await injectAxe(page);
  });

  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await AccessibilityUtils.runAxeScan(page);
  });
});
