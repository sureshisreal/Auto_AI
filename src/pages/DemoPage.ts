import { Page, Locator } from '@playwright/test';
import { BasePage } from '../core/ui/base/BasePage';

export class DemoPage extends BasePage {
  private readonly animatedBox: Locator;
  private readonly animateButton: Locator;
  private readonly navButton: Locator;

  constructor(page: Page) {
    super(page);
    this.animatedBox = this.page.locator('#animatedBox');
    this.animateButton = this.page.getByRole('button', { name: /animate box/i });
    this.navButton = this.page.getByRole('button', { name: /go to about/i });
  }

  public getAnimatedBox(): Locator {
    return this.animatedBox;
  }

  public getAnimateButton(): Locator {
    return this.animateButton;
  }

  public getNavButton(): Locator {
    return this.navButton;
  }

  public async goToDemo(): Promise<void> {
    await this.navigateTo('/');
  }

  public async clickAnimateButton(): Promise<void> {
    await this.click(this.animateButton);
  }

  public async clickNavButton(): Promise<void> {
    await this.click(this.navButton);
  }

  public async sampleAnimationFrames(durationMs: number): Promise<number[]> {
    const frames: number[] = [];
    const startTime = Date.now();
    while (Date.now() - startTime < durationMs) {
      frames.push(Date.now());
      await this.page.waitForTimeout(16);
    }
    return frames;
  }
}
