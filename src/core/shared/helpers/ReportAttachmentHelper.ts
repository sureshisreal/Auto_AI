import { TestInfo } from '@playwright/test';
import * as fs from 'fs';

/**
 * Attaches artifacts to Playwright's TestInfo. Both the HTML reporter and
 * the Allure reporter pick up testInfo.attachments automatically, so a
 * single attach() call surfaces content in every report.
 */
export class ReportAttachmentHelper {
  public static async attachScreenshot(testInfo: TestInfo, filePath: string, name = 'screenshot'): Promise<void> {
    if (fs.existsSync(filePath)) {
      await testInfo.attach(name, { path: filePath, contentType: 'image/png' });
    }
  }

  public static async attachText(testInfo: TestInfo, name: string, body: string): Promise<void> {
    await testInfo.attach(name, { body, contentType: 'text/plain' });
  }

  public static async attachJson(testInfo: TestInfo, name: string, data: unknown): Promise<void> {
    await testInfo.attach(name, { body: JSON.stringify(data, null, 2), contentType: 'application/json' });
  }
}
