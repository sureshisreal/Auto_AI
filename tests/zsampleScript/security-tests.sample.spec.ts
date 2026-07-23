import { test, expect } from '../../src/core/runtime/fixtures/fixtures';
import { AllureUtils } from '../../src/core/shared/utils/AllureUtils';
import { UserBuilder } from '../../src/core/data/builders/UserBuilder';

/**
 * SAMPLE 4/13: Security Tests
 * Focus: authentication, authorization, and secure access.
 * Example: HTTPS enforcement, XSS prevention, header validation.
 */
test.describe('Sample - Security Tests', () => {
  test.beforeEach(async () => {
    await AllureUtils.setCategory(
      'Sample Test Categories',
      'Security Tests',
      AllureUtils.Severity.BLOCKER
    );
  });

  test('invalid credentials never reach the authenticated area (authentication)', async ({
    loginPage,
    validationHelpers,
    page,
  }) => {
    const attacker = new UserBuilder()
      .withEmail('not-a-real-user@example.com')
      .withPassword('wrong')
      .build();

    await AllureUtils.step('Navigate to login and attempt sign-in', async () => {
      await loginPage.navigate();
      await loginPage.login(attacker.email, attacker.password);
    });
    await AllureUtils.attachScreenshot(page, 'Login attempt result');

    await AllureUtils.step('Verify access was denied', async () => {
      await validationHelpers.verifyText(loginPage.getErrorMessageLocator(), 'Invalid');
      await expect(loginPage.page).not.toHaveURL(/dashboard/);
    });
  });

  test('script-like input in a form field is never executed (XSS prevention)', async ({
    loginPage,
    page,
  }) => {
    const payload = '<script>window.__xssFired = true;</script>';

    await AllureUtils.step('Submit a script-tag payload through the username field', async () => {
      await loginPage.navigate();
      await loginPage.enterUsername(payload);
      await loginPage.enterPassword('irrelevant');
      await loginPage.clickLogin();
    });
    await AllureUtils.attachScreenshot(page, 'Form after malicious input submitted');

    const xssFired = await AllureUtils.step('Verify the payload never executed as script', () => {
      return page.evaluate(() => (window as unknown as { __xssFired?: boolean }).__xssFired);
    });
    expect(xssFired).toBeUndefined();
  });

  test('response headers are present and inspectable (header validation)', async ({
    page,
    config,
  }) => {
    const response = await AllureUtils.step(`Request ${config.baseUrl}`, () =>
      page.goto(config.baseUrl)
    );

    const headers = response?.headers();
    await AllureUtils.attachJson('Response headers', headers);

    await AllureUtils.step('Verify headers are present', () => {
      expect(headers).toBeDefined();
    });
    // In production this is where you'd assert real hardening headers, e.g.:
    // expect(headers?.['x-content-type-options']).toBe('nosniff');
  });
});
