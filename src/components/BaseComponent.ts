import { Page, Locator } from '@playwright/test';

export class BaseComponent {
  protected page: Page;
  protected rootLocator: Locator;

  constructor(page: Page, rootLocator: Locator | string) {
    this.page = page;
    this.rootLocator = typeof rootLocator === 'string' 
      ? page.locator(rootLocator) 
      : rootLocator;
  }

  protected getLocator(selector: string | Locator): Locator {
    if (typeof selector === 'string') {
      return this.rootLocator.locator(selector);
    }
    return selector;
  }
}
