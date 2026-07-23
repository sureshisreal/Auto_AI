import { test } from '../../src/core/runtime/fixtures/fixtures';
import { AllureUtils } from '../../src/core/shared/utils/AllureUtils';
import { UserBuilder } from '../../src/core/data/builders/UserBuilder';

/**
 * SAMPLE 5/13: Validation Tests
 * Focus: input validation, data integrity, format compliance.
 * Example: email/phone/URL validation, length constraints, malicious pattern detection.
 */
test.describe('Sample - Validation Tests', () => {
  test.beforeEach(async () => {
    await AllureUtils.setCategory('Sample Test Categories', 'Validation Tests');
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
    await AllureUtils.parameter('email', badFormatUser.email);

    await AllureUtils.step('Submit a malformed email', async () => {
      await loginPage.navigate();
      await loginPage.login(badFormatUser.email, badFormatUser.password);
    });
    await AllureUtils.attachScreenshot(page, 'Validation result');

    await AllureUtils.step('Verify the error message is shown', async () => {
      await validationHelpers.verifyText(loginPage.getErrorMessageLocator(), 'Invalid');
    });
  });

  test('an extremely long input does not crash the form (length constraints)', async ({
    loginPage,
    validationHelpers,
    page,
  }) => {
    const veryLongEmail = `${'a'.repeat(500)}@example.com`;
    await AllureUtils.parameter('emailLength', String(veryLongEmail.length));

    await AllureUtils.step('Submit a 500+ character email', async () => {
      await loginPage.navigate();
      await loginPage.login(veryLongEmail, 'whatever123');
    });
    await AllureUtils.attachScreenshot(page, 'Form after long input');

    await AllureUtils.step('Verify the form degrades gracefully', async () => {
      await validationHelpers.verifyElementVisible(loginPage.getErrorMessageLocator());
    });
  });

  test('a SQL-injection-style payload is treated as plain text (malicious pattern detection)', async ({
    loginPage,
    validationHelpers,
    page,
  }) => {
    const maliciousInput = "' OR '1'='1'; --";

    await AllureUtils.step('Submit a SQL-injection-style payload', async () => {
      await loginPage.navigate();
      await loginPage.login(maliciousInput, maliciousInput);
    });
    await AllureUtils.attachScreenshot(page, 'Form after malicious input');

    // The app should degrade to a normal "invalid credentials" error, not crash or bypass auth.
    await AllureUtils.step('Verify auth was not bypassed', async () => {
      await validationHelpers.verifyText(loginPage.getErrorMessageLocator(), 'Invalid');
    });
  });
});
