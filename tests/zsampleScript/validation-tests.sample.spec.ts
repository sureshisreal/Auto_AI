import { test } from '../../src/core/runtime/fixtures/fixtures';
import * as allure from 'allure-js-commons';
import { UserBuilder } from '../../src/core/data/builders/UserBuilder';

/**
 * SAMPLE 5/13: Validation Tests
 * Focus: input validation, data integrity, format compliance.
 * Example: email/phone/URL validation, length constraints, malicious pattern detection.
 */
test.describe('Sample - Validation Tests', () => {
  test.beforeEach(async () => {
    await allure.epic('Sample Test Categories');
    await allure.feature('Validation Tests');
    await allure.severity(allure.Severity.NORMAL);
  });

  test('malformed email is rejected with a visible error (format compliance)', async ({
    loginPage,
    validationHelpers,
    page,
  }) => {
    const badFormatUser = new UserBuilder()
      .withEmail('not-an-email')
      .withPassword('whatever123')
      .build();
    await allure.parameter('email', badFormatUser.email);

    await allure.step('Submit a malformed email', async () => {
      await loginPage.navigate();
      await loginPage.login(badFormatUser.email, badFormatUser.password);
    });
    await allure.attachment('Validation result', await page.screenshot(), allure.ContentType.PNG);

    await allure.step('Verify the error message is shown', async () => {
      await validationHelpers.verifyText(loginPage.getErrorMessageLocator(), 'Invalid');
    });
  });

  test('an extremely long input does not crash the form (length constraints)', async ({
    loginPage,
    validationHelpers,
    page,
  }) => {
    const veryLongEmail = `${'a'.repeat(500)}@example.com`;
    await allure.parameter('emailLength', String(veryLongEmail.length));

    await allure.step('Submit a 500+ character email', async () => {
      await loginPage.navigate();
      await loginPage.login(veryLongEmail, 'whatever123');
    });
    await allure.attachment(
      'Form after long input',
      await page.screenshot(),
      allure.ContentType.PNG
    );

    await allure.step('Verify the form degrades gracefully', async () => {
      await validationHelpers.verifyElementVisible(loginPage.getErrorMessageLocator());
    });
  });

  test('a SQL-injection-style payload is treated as plain text (malicious pattern detection)', async ({
    loginPage,
    validationHelpers,
    page,
  }) => {
    const maliciousInput = "' OR '1'='1'; --";

    await allure.step('Submit a SQL-injection-style payload', async () => {
      await loginPage.navigate();
      await loginPage.login(maliciousInput, maliciousInput);
    });
    await allure.attachment(
      'Form after malicious input',
      await page.screenshot(),
      allure.ContentType.PNG
    );

    // The app should degrade to a normal "invalid credentials" error, not crash or bypass auth.
    await allure.step('Verify auth was not bypassed', async () => {
      await validationHelpers.verifyText(loginPage.getErrorMessageLocator(), 'Invalid');
    });
  });
});
