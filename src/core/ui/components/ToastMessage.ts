import { Page } from '@playwright/test';
import { BaseComponent } from './BaseComponent';
import { Timeouts } from '../../config/constants/Timeouts';

/**
 * Generic toast/notification component. Targets role="status" by default,
 * matching the common accessible pattern for transient notifications.
 */
export class ToastMessage extends BaseComponent {
  constructor(page: Page) {
    super(page, page.getByRole('status'));
  }

  public async waitForVisible(timeout: number = Timeouts.DEFAULT): Promise<void> {
    await this.rootLocator.waitFor({ state: 'visible', timeout });
  }

  public async waitForHidden(timeout: number = Timeouts.DEFAULT): Promise<void> {
    await this.rootLocator.waitFor({ state: 'hidden', timeout });
  }

  public async getMessage(): Promise<string> {
    return (await this.rootLocator.textContent()) ?? '';
  }
}
