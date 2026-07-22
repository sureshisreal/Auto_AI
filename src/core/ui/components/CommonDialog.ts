import { Locator, Page } from '@playwright/test';
import { BaseComponent } from './BaseComponent';
import { Timeouts } from '../../config/constants/Timeouts';

/**
 * Generic confirm/cancel modal. Targets role="dialog", matching the
 * accessible pattern for confirm dialogs, alerts, and modals.
 */
export class CommonDialog extends BaseComponent {
  private readonly confirmButton: Locator;
  private readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page, page.getByRole('dialog'));
    this.confirmButton = this.rootLocator.getByRole('button', { name: /confirm|ok|yes/i });
    this.cancelButton = this.rootLocator.getByRole('button', { name: /cancel|no/i });
  }

  public async waitForOpen(timeout: number = Timeouts.DEFAULT): Promise<void> {
    await this.rootLocator.waitFor({ state: 'visible', timeout });
  }

  public async confirm(): Promise<void> {
    await this.confirmButton.click();
  }

  public async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  public async getMessage(): Promise<string> {
    return (await this.rootLocator.textContent()) ?? '';
  }
}
