import { Page, expect, Locator } from '@playwright/test';
import { ElementError } from '../exceptions/ElementError';

export class ValidationHelpers {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async verifyText(locator: Locator, expectedText: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await expect(locator).toContainText(expectedText);
  }

  public async verifyTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  public async verifyUrl(expectedUrl: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(expectedUrl);
  }

  public async verifyElementVisible(locator: Locator): Promise<void> {
    try {
      await expect(locator).toBeVisible();
    } catch {
      throw new ElementError('Element not visible');
    }
  }

  public async verifyEnabled(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await expect(locator).toBeEnabled();
  }

  public async verifyDisabled(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await expect(locator).toBeDisabled();
  }

  public async verifyAttribute(locator: Locator, attribute: string, expectedValue: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await expect(locator).toHaveAttribute(attribute, expectedValue);
  }

  public async verifyCount(locator: Locator, expectedCount: number): Promise<void> {
    await expect(locator).toHaveCount(expectedCount);
  }
}
