import { BrowserContext, Cookie, Page } from '@playwright/test';
import * as path from 'path';
import { FilePaths } from '../../config/constants/FilePaths';
import { FileUtils } from './FileUtils';

export class StorageUtils {
  public static storageStatePath(fileName: string): string {
    return path.join(FilePaths.TESTDATA, 'storage-state', fileName);
  }

  public static async saveStorageState(context: BrowserContext, fileName: string): Promise<string> {
    const filePath = this.storageStatePath(fileName);
    await context.storageState({ path: filePath });
    return filePath;
  }

  public static storageStateExists(fileName: string): boolean {
    return FileUtils.fileExists(this.storageStatePath(fileName));
  }

  public static async getLocalStorageItem(page: Page, key: string): Promise<string | null> {
    return page.evaluate((k) => window.localStorage.getItem(k), key);
  }

  public static async setLocalStorageItem(page: Page, key: string, value: string): Promise<void> {
    await page.evaluate(([k, v]) => window.localStorage.setItem(k, v), [key, value]);
  }

  public static async clearLocalStorage(page: Page): Promise<void> {
    await page.evaluate(() => window.localStorage.clear());
  }

  public static async getCookies(context: BrowserContext): Promise<Cookie[]> {
    return context.cookies();
  }

  public static async clearCookies(context: BrowserContext): Promise<void> {
    await context.clearCookies();
  }
}
