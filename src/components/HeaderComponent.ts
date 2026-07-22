import { Page, Locator } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

export class HeaderComponent extends BaseComponent {
  private logo: Locator;
  private navigationMenu: Locator;
  private userProfileButton: Locator;
  private logoutButton: Locator;

  constructor(page: Page) {
    super(page, page.locator('header'));
    this.logo = this.rootLocator.locator('.logo');
    this.navigationMenu = this.rootLocator.locator('nav');
    this.userProfileButton = this.rootLocator.getByRole('button', { name: 'Profile' });
    this.logoutButton = this.rootLocator.getByRole('button', { name: 'Logout' });
  }

  public async isLogoVisible(): Promise<boolean> {
    return await this.logo.isVisible();
  }

  public async clickUserProfile(): Promise<void> {
    await this.userProfileButton.click();
  }

  public async clickLogout(): Promise<void> {
    await this.logoutButton.click();
  }
}
