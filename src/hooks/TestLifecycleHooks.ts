import { Page, TestInfo } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { ReportAttachmentHelper } from '../helpers/ReportAttachmentHelper';
import Logger from '../logger/Logger';
import { FilePaths } from '../constants/FilePaths';

/**
 * Failure-only capture: screenshot + recent log tail, attached to the
 * report. Called from fixtures.ts after each page-based fixture tears
 * down, so every test gets this automatically without remembering to
 * call it itself.
 */
export class TestLifecycleHooks {
  public static async captureOnFailure(page: Page, testInfo: TestInfo): Promise<void> {
    if (testInfo.status === testInfo.expectedStatus) {
      return;
    }

    Logger.error(`Test failed: ${testInfo.title}`, { status: testInfo.status, retry: testInfo.retry });

    if (!page.isClosed()) {
      const screenshotPath = path.join(
        FilePaths.SCREENSHOTS,
        `${testInfo.title.replace(/\s+/g, '-')}-${Date.now()}.png`
      );
      try {
        await page.screenshot({ path: screenshotPath, fullPage: true });
        await ReportAttachmentHelper.attachScreenshot(testInfo, screenshotPath, 'failure-screenshot');
      } catch (error) {
        Logger.warn(`Could not capture failure screenshot: ${(error as Error).message}`);
      }
    }

    const logFile = path.join(FilePaths.LOGS, `app-${new Date().toISOString().split('T')[0]}.log`);
    if (fs.existsSync(logFile)) {
      const tail = fs.readFileSync(logFile, 'utf-8').split('\n').slice(-50).join('\n');
      await ReportAttachmentHelper.attachText(testInfo, 'log-tail', tail);
    }
  }
}
