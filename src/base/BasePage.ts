import { Page, Locator } from '@playwright/test';
import Logger from '../logger/Logger';
import { Timeouts } from '../constants/Timeouts';
import { ElementError } from '../exceptions/ElementError';
import { FilePaths } from '../constants/FilePaths';
import * as path from 'path';

/**
 * BasePage is the single reusable action layer every Page Object extends.
 * It owns all raw Playwright interactions so no page class ever duplicates
 * click/fill/wait logic. It intentionally contains NO assertions -
 * verification belongs to src/validations/ValidationHelpers.ts.
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string): Promise<void> {
    Logger.debug(`Navigating to: ${url}`);
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async click(locator: Locator): Promise<void> {
    Logger.debug(`Clicking locator: ${locator}`);
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  async fill(locator: Locator, text: string): Promise<void> {
    Logger.debug(`Filling locator with text: ${locator}`);
    await locator.waitFor({ state: 'visible' });
    await locator.fill(text);
  }

  async clear(locator: Locator): Promise<void> {
    Logger.debug(`Clearing locator: ${locator}`);
    await locator.waitFor({ state: 'visible' });
    await locator.clear();
  }

  async type(locator: Locator, text: string): Promise<void> {
    Logger.debug(`Typing text into locator: ${locator}`);
    await locator.waitFor({ state: 'visible' });
    await locator.pressSequentially(text);
  }

  async pressKey(key: string): Promise<void> {
    Logger.debug(`Pressing key: ${key}`);
    await this.page.keyboard.press(key);
  }

  async hover(locator: Locator): Promise<void> {
    Logger.debug(`Hovering over locator: ${locator}`);
    await locator.waitFor({ state: 'visible' });
    await locator.hover();
  }

  async doubleClick(locator: Locator): Promise<void> {
    Logger.debug(`Double clicking locator: ${locator}`);
    await locator.waitFor({ state: 'visible' });
    await locator.dblclick();
  }

  async rightClick(locator: Locator): Promise<void> {
    Logger.debug(`Right clicking locator: ${locator}`);
    await locator.waitFor({ state: 'visible' });
    await locator.click({ button: 'right' });
  }

  async dragDrop(source: Locator, target: Locator): Promise<void> {
    Logger.debug(`Dragging ${source} to ${target}`);
    await source.waitFor({ state: 'visible' });
    await target.waitFor({ state: 'visible' });
    await source.dragTo(target);
  }

  async upload(locator: Locator, files: string | string[]): Promise<void> {
    Logger.debug(`Uploading files: ${files}`);
    await locator.waitFor({ state: 'attached' });
    await locator.setInputFiles(files);
  }

  async download(triggerLocator: Locator): Promise<void> {
    Logger.debug(`Downloading file using locator: ${triggerLocator}`);
    await triggerLocator.waitFor({ state: 'visible' });
    const downloadPromise = this.page.waitForEvent('download');
    await triggerLocator.click();
    const download = await downloadPromise;
    const savePath = path.join(FilePaths.DOWNLOADS, download.suggestedFilename());
    await download.saveAs(savePath);
    Logger.info(`Downloaded file: ${savePath}`);
  }

  async scrollIntoView(locator: Locator): Promise<void> {
    Logger.debug(`Scrolling into view: ${locator}`);
    await locator.waitFor({ state: 'attached' });
    await locator.scrollIntoViewIfNeeded();
  }

  async waitForVisible(locator: Locator, timeout: number = Timeouts.DEFAULT): Promise<void> {
    Logger.debug(`Waiting for locator to be visible: ${locator}`);
    try {
      await locator.waitFor({ state: 'visible', timeout });
    } catch {
      throw new ElementError(`Element not visible within ${timeout}ms: ${locator}`);
    }
  }

  async waitForHidden(locator: Locator, timeout: number = Timeouts.DEFAULT): Promise<void> {
    Logger.debug(`Waiting for locator to be hidden: ${locator}`);
    try {
      await locator.waitFor({ state: 'hidden', timeout });
    } catch {
      throw new ElementError(`Element not hidden within ${timeout}ms: ${locator}`);
    }
  }

  async waitForURL(url: string | RegExp, timeout: number = Timeouts.DEFAULT): Promise<void> {
    Logger.debug(`Waiting for URL to be: ${url}`);
    await this.page.waitForURL(url, { timeout });
  }

  async waitForLoadState(state: 'domcontentloaded' | 'load' | 'networkidle' = 'domcontentloaded'): Promise<void> {
    Logger.debug(`Waiting for load state: ${state}`);
    await this.page.waitForLoadState(state);
  }

  /**
   * Accepts either a bare file name (saved under FilePaths.SCREENSHOTS) or
   * an absolute path (saved as-is, e.g. for visual-diff baselines living
   * elsewhere).
   */
  async takeScreenshot(name?: string): Promise<string> {
    const fileName = name || `screenshot-${Date.now()}.png`;
    const filePath = path.isAbsolute(fileName) ? fileName : path.join(FilePaths.SCREENSHOTS, fileName);
    Logger.info(`Taking screenshot: ${filePath}`);
    await this.page.screenshot({ path: filePath, fullPage: true });
    return filePath;
  }

  async getText(locator: Locator): Promise<string> {
    Logger.debug(`Getting text from locator: ${locator}`);
    await locator.waitFor({ state: 'visible' });
    return (await locator.textContent()) ?? '';
  }

  async getAttribute(locator: Locator, attribute: string): Promise<string | null> {
    Logger.debug(`Getting attribute ${attribute} from locator: ${locator}`);
    await locator.waitFor({ state: 'visible' });
    return await locator.getAttribute(attribute);
  }

  async check(locator: Locator): Promise<void> {
    Logger.debug(`Checking checkbox: ${locator}`);
    await locator.waitFor({ state: 'visible' });
    await locator.check();
  }

  async uncheck(locator: Locator): Promise<void> {
    Logger.debug(`Unchecking checkbox: ${locator}`);
    await locator.waitFor({ state: 'visible' });
    await locator.uncheck();
  }

  async selectOption(locator: Locator, option: string | string[]): Promise<void> {
    Logger.debug(`Selecting option(s) ${option} on locator: ${locator}`);
    await locator.waitFor({ state: 'visible' });
    await locator.selectOption(option);
  }

  async switchFrame(selector: string): Promise<import('@playwright/test').FrameLocator> {
    Logger.debug(`Switching to frame: ${selector}`);
    return this.page.frameLocator(selector);
  }

  async closePopup(): Promise<void> {
    Logger.debug('Closing popup via Escape key');
    await this.page.keyboard.press('Escape');
  }

  async acceptAlert(promptText?: string): Promise<void> {
    Logger.debug('Registering handler to accept next alert/dialog');
    this.page.once('dialog', (dialog) => dialog.accept(promptText));
  }

  async dismissAlert(): Promise<void> {
    Logger.debug('Registering handler to dismiss next alert/dialog');
    this.page.once('dialog', (dialog) => dialog.dismiss());
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async refresh(): Promise<void> {
    Logger.debug('Refreshing page');
    await this.page.reload();
  }

  async reload(): Promise<void> {
    await this.refresh();
  }

  async goBack(): Promise<void> {
    Logger.debug('Navigating back');
    await this.page.goBack();
  }

  async goForward(): Promise<void> {
    Logger.debug('Navigating forward');
    await this.page.goForward();
  }
}
