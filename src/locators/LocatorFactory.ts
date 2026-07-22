import { Page, Locator } from '@playwright/test';

/**
 * Utility Pattern: standardized locator construction that steers every
 * page/component toward resilient, accessibility-first locators
 * (getByRole/getByLabel/getByPlaceholder/getByText/getByTestId) instead of
 * fragile CSS or XPath.
 */
export class LocatorFactory {
  public static byTestId(page: Page, testId: string): Locator {
    return page.getByTestId(testId);
  }

  public static byRoleAndName(
    page: Page,
    role: Parameters<Page['getByRole']>[0],
    name: string | RegExp
  ): Locator {
    return page.getByRole(role, { name });
  }

  public static byLabel(page: Page, label: string | RegExp): Locator {
    return page.getByLabel(label);
  }

  public static byPlaceholder(page: Page, placeholder: string | RegExp): Locator {
    return page.getByPlaceholder(placeholder);
  }

  public static byText(page: Page, text: string | RegExp): Locator {
    return page.getByText(text);
  }
}
