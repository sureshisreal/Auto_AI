import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export class WeSendCVPage extends BasePage {
  private readonly loginButton: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;
  private readonly navigationMenu: Locator;

  constructor(page: Page) {
    super(page);
    this.loginButton = this.page.getByRole('button', { name: /login|sign in/i });
    this.emailInput = this.page.getByLabel(/email/i);
    this.passwordInput = this.page.getByLabel(/password/i);
    this.submitButton = this.page.getByRole('button', { name: /submit|login/i });
    // wesendcv.com renders more than one <nav> (visible main menu + a hidden
    // dropdown nav), so scope to the first one to keep this a strict-mode-safe locator.
    this.navigationMenu = this.page.locator('nav').first();
  }

  public getNavigationMenu(): Locator {
    return this.navigationMenu;
  }

  public async goToWeSendCV(url: string): Promise<void> {
    await this.navigateTo(url);
  }

  public async login(email: string, password: string): Promise<void> {
    if (await this.loginButton.isVisible()) {
      await this.click(this.loginButton);
    }
    await this.fill(this.emailInput, email);
    await this.fill(this.passwordInput, password);
    await this.click(this.submitButton);
  }
}
