import { Locator } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

export class NavigationMenu extends BaseComponent {
  public link(name: string): Locator {
    return this.rootLocator.getByRole('link', { name });
  }

  public async clickLink(name: string): Promise<void> {
    await this.link(name).click();
  }
}
