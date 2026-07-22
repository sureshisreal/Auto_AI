import { Page, Locator } from '@playwright/test';

/**
 * Shared, role-based selectors for cross-cutting UI patterns (toast,
 * dialog, alert, spinner) that don't belong to any single page. Backs
 * ToastMessage/CommonDialog and is reusable directly wherever those
 * patterns show up without a dedicated component.
 */
export class CommonLocators {
  public static toast(page: Page): Locator {
    return page.getByRole('status');
  }

  public static dialog(page: Page): Locator {
    return page.getByRole('dialog');
  }

  public static alert(page: Page): Locator {
    return page.getByRole('alert');
  }

  public static spinner(page: Page): Locator {
    return page.getByRole('progressbar');
  }
}
