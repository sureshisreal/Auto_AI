import { test, expect } from '../../src/core/runtime/fixtures/fixtures';
import * as allure from 'allure-js-commons';
import { UserBuilder } from '../../src/core/data/builders/UserBuilder';

/**
 * SAMPLE 4/13: Security Tests
 * Focus: authentication, authorization, and secure access.
 * Example: HTTPS enforcement, XSS prevention, header validation.
 */
test.describe('Sample - Security Tests', () => {
  test.beforeEach(async () => {
    await allure.epic('Sample Test Categories');
    await allure.feature('Security Tests');
    await allure.severity(allure.Severity.BLOCKER);
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

    await allure.step('Navigate to login and attempt sign-in', async () => {
      await loginPage.navigate();
      await loginPage.login(attacker.email, attacker.password);
    });
    await allure.attachment(
      'Login attempt result',
      await page.screenshot(),
      allure.ContentType.PNG
    );

    await allure.step('Verify access was denied', async () => {
      await validationHelpers.verifyText(loginPage.getErrorMessageLocator(), 'Invalid');
      await expect(loginPage.page).not.toHaveURL(/dashboard/);
    });
  });

  test('script-like input in a form field is never executed (XSS prevention)', async ({
    loginPage,
    page,
  }) => {
    const payload = '<script>window.__xssFired = true;</script>';

    await allure.step('Submit a script-tag payload through the username field', async () => {
      await loginPage.navigate();
      await loginPage.enterUsername(payload);
      await loginPage.enterPassword('irrelevant');
      await loginPage.clickLogin();
    });
    await allure.attachment(
      'Form after malicious input submitted',
      await page.screenshot(),
      allure.ContentType.PNG
    );

    const xssFired = await allure.step('Verify the payload never executed as script', async () => {
      return page.evaluate(() => (window as unknown as { __xssFired?: boolean }).__xssFired);
    });
    expect(xssFired).toBeUndefined();
  });

  test('response headers are present and inspectable (header validation)', async ({
    page,
    config,
  }) => {
    const response = await allure.step(`Request ${config.baseUrl}`, async () =>
      page.goto(config.baseUrl)
    );

    const headers = response?.headers();
    await allure.attachment(
      'Response headers',
      JSON.stringify(headers, null, 2),
      allure.ContentType.JSON
    );

    await allure.step('Verify headers are present', async () => {
      expect(headers).toBeDefined();
    });
    // In production this is where you'd assert real hardening headers, e.g.:
    // expect(headers?.['x-content-type-options']).toBe('nosniff');
  });
});
