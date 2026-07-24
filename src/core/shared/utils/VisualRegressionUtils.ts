import { Page, test } from '@playwright/test';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { FilePaths } from '@constants/FilePaths';
import Logger from '@logger/Logger';

export class VisualRegressionUtils {
  /**
   * `projectName` (the running browser project, e.g. "chromium"/"webkit"/"Mobile Safari")
   * namespaces every baseline/actual/diff path so different rendering engines never compare
   * against - or overwrite - each other's screenshots. Without this, whichever project's test
   * happens to run first "wins" the shared baseline and every other browser fails permanently,
   * since real cross-engine rendering differences (fonts, gradients, anti-aliasing) never go away.
   */
  constructor(
    private page: Page,
    private projectName: string = 'default'
  ) {}

  /**
   * Captures a screenshot of the current page
   * @param name - Unique name for the screenshot
   * @param options - Playwright screenshot options
   * @returns Buffer of the screenshot
   */
  async captureScreenshot(
    name: string,
    options?: { fullPage?: boolean; mask?: any[]; threshold?: number }
  ): Promise<Buffer> {
    const screenshot = await this.page.screenshot({
      fullPage: options?.fullPage ?? true,
      mask: options?.mask,
    });

    // Save actual screenshot
    const actualDir = path.join(FilePaths.VISUAL_ACTUAL, this.projectName);
    await fs.mkdir(actualDir, { recursive: true });
    const actualPath = path.join(actualDir, `${name}.png`);
    await fs.writeFile(actualPath, screenshot);
    Logger.info(`Saved actual screenshot: ${actualPath}`);

    return screenshot;
  }

  /**
   * Compares a screenshot against baseline
   * @param actualBuffer - Buffer of the actual screenshot
   * @param name - Unique name for the comparison
   * @param options - Comparison options
   * @returns Promise<boolean> - true if matches, false otherwise
   */
  async compareScreenshot(
    actualBuffer: Buffer,
    name: string,
    options?: { threshold?: number; updateBaseline?: boolean }
  ): Promise<boolean> {
    const { threshold = 0.1, updateBaseline = false } = options || {};
    const baselineDir = path.join(FilePaths.VISUAL_BASELINE, this.projectName);
    const baselinePath = path.join(baselineDir, `${name}.png`);

    // Create baseline directory if doesn't exist
    await fs.mkdir(baselineDir, { recursive: true });

    let baselineBuffer: Buffer | null = null;
    try {
      baselineBuffer = await fs.readFile(baselinePath);
    } catch {
      // Baseline doesn't exist, create it
      await fs.writeFile(baselinePath, actualBuffer);
      Logger.info(`Created new baseline screenshot: ${baselinePath}`);
      return true;
    }

    // If updateBaseline is true, overwrite baseline
    if (updateBaseline) {
      await fs.writeFile(baselinePath, actualBuffer);
      Logger.info(`Updated baseline screenshot: ${baselinePath}`);
      return true;
    }

    // Compare images
    const actualPng = PNG.sync.read(actualBuffer);
    const baselinePng = PNG.sync.read(baselineBuffer);

    // Handle different dimensions
    if (actualPng.width !== baselinePng.width || actualPng.height !== baselinePng.height) {
      Logger.warn(`Screenshot dimensions mismatch: ${name}`);
      const diffPath = path.join(FilePaths.VISUAL_DIFF, this.projectName, `${name}-diff.png`);
      await fs.mkdir(path.dirname(diffPath), { recursive: true });
      await fs.writeFile(diffPath, actualBuffer);
      return false;
    }

    const { width, height } = actualPng;
    const diffPng = new PNG({ width, height });
    const mismatchedPixels = pixelmatch(
      baselinePng.data,
      actualPng.data,
      diffPng.data,
      width,
      height,
      { threshold }
    );

    if (mismatchedPixels > 0) {
      Logger.warn(`Visual mismatch detected: ${name} (${mismatchedPixels} pixels)`);
      const diffPath = path.join(FilePaths.VISUAL_DIFF, this.projectName, `${name}-diff.png`);
      await fs.mkdir(path.dirname(diffPath), { recursive: true });
      await fs.writeFile(diffPath, PNG.sync.write(diffPng));

      // Attach diff to Allure report if available
      try {
        const allure = (test as any).info().attachments;
        if (allure) {
          allure.attachment(`${name}-diff`, fsSync.readFileSync(diffPath), 'image/png');
        }
      } catch {
        // Ignore if Allure not available
      }

      return false;
    }

    Logger.info(`Visual regression test passed: ${name}`);
    return true;
  }

  /**
   * Captures and compares screenshot in one step
   * @param name - Unique name for the test
   * @param options - Screenshot and comparison options
   * @returns Promise<boolean>
   */
  async checkVisualRegression(
    name: string,
    options?: { fullPage?: boolean; mask?: any[]; threshold?: number; updateBaseline?: boolean }
  ): Promise<boolean> {
    const actualBuffer = await this.captureScreenshot(name, options);
    return this.compareScreenshot(actualBuffer, name, options);
  }
}
