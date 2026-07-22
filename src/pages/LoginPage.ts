import { Page, Locator } from '@playwright/test';
import { BasePage } from '../core/ui/base/BasePage';
import { HeaderComponent } from '../core/ui/components/HeaderComponent';
import { Routes } from '../core/config/constants/Routes';

export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  public readonly header: HeaderComponent;

  constructor(page: Page) {
    super(page);
    this.usernameInput = this.page.getByLabel('Username');
    this.passwordInput = this.page.getByLabel('Password');
    this.loginButton = this.page.getByRole('button', { name: 'Login' });
    this.errorMessage = this.page.locator('.error-message');
    this.header = new HeaderComponent(page);
  }

  public async navigate(): Promise<void> {
    await this.navigateTo(Routes.LOGIN);
  }

  public async enterUsername(username: string): Promise<void> {
    await this.fill(this.usernameInput, username);
  }

  public async enterPassword(password: string): Promise<void> {
    await this.fill(this.passwordInput, password);
  }

  public async clickLogin(): Promise<void> {
    await this.click(this.loginButton);
  }

  public async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  public async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  public getErrorMessageLocator(): Locator {
    return this.errorMessage;
  }
}
