import { Locator, Page } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

export class Pagination extends BaseComponent {
  private readonly nextButton: Locator;
  private readonly previousButton: Locator;

  constructor(page: Page, rootLocator: Locator | string) {
    super(page, rootLocator);
    this.nextButton = this.rootLocator.getByRole('button', { name: /next/i });
    this.previousButton = this.rootLocator.getByRole('button', { name: /previous/i });
  }

  public async goToNextPage(): Promise<void> {
    await this.nextButton.click();
  }

  public async goToPreviousPage(): Promise<void> {
    await this.previousButton.click();
  }

  public async isNextEnabled(): Promise<boolean> {
    return this.nextButton.isEnabled();
  }

  public async isPreviousEnabled(): Promise<boolean> {
    return this.previousButton.isEnabled();
  }

  public async getPageIndicatorText(): Promise<string> {
    return (await this.rootLocator.textContent()) ?? '';
  }
}
