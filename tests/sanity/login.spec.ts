import { test, expect } from '../../src/fixtures/fixtures';
import { UserBuilder } from '../../src/builders/UserBuilder';

test.describe('Login Page', () => {
  test('should navigate to login page', async ({ loginPage }) => {
    // Arrange & Act
    await loginPage.navigate();

    // Assert
    expect(await loginPage.header.isLogoVisible()).toBe(true);
  });

  test('should show error message for invalid credentials', async ({ loginPage, validationHelpers }) => {
    // Arrange
    const invalidUser = new UserBuilder().withEmail('invalid@example.com').withPassword('wrongpassword').build();

    // Act
    await loginPage.navigate();
    await loginPage.login(invalidUser.email, invalidUser.password);

    // Assert
    await validationHelpers.verifyText(loginPage.getErrorMessageLocator(), 'Invalid');
  });
});
