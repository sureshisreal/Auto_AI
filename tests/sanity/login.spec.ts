import { test, expect } from '../../src/core/runtime/fixtures/fixtures';
import { UserBuilder } from '../../src/core/data/builders/UserBuilder';
import { allure } from 'allure-playwright';

test.describe('Login Page', () => {
  test('should navigate to login page with visual and performance checks', async ({
    loginPage,
    visualRegressionUtils,
    performanceUtils,
  }) => {
    await allure.epic('Sanity Tests');
    await allure.feature('Login Page');
    await allure.severity('critical');

    // Arrange & Act
    await loginPage.navigate();

    // Assert - standard
    expect(await loginPage.header.isLogoVisible()).toBe(true);

    // Visual regression check
    const visualMatch = await visualRegressionUtils.checkVisualRegression('login-page');
    expect(visualMatch).toBeTruthy();

    // Performance check
    const metrics = await performanceUtils.getPageLoadMetrics();
    expect(metrics.loadComplete).toBeLessThan(10000);
  });

  test('should show error message for invalid credentials with visual check', async ({
    loginPage,
    validationHelpers,
    visualRegressionUtils,
  }) => {
    await allure.epic('Sanity Tests');
    await allure.feature('Login Page');
    await allure.severity('normal');

    // Arrange
    const invalidUser = new UserBuilder()
      .withEmail('invalid@example.com')
      .withPassword('wrongpassword')
      .build();

    // Act
    await loginPage.navigate();
    await loginPage.login(invalidUser.email, invalidUser.password);

    // Assert - standard
    await validationHelpers.verifyText(loginPage.getErrorMessageLocator(), 'Invalid');

    // Visual regression check for error state
    const visualMatch = await visualRegressionUtils.checkVisualRegression('login-page-error-state');
    expect(visualMatch).toBeTruthy();
  });
});
