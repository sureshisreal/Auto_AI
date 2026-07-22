import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import * as fs from 'fs';
import * as path from 'path';
import { FilePaths } from '../constants/FilePaths';

export interface ScreenshotComparisonResult {
  diffPixels: number;
  percentDiff: number;
  passed: boolean;
  diffImagePath: string;
}

export class ScreenshotUtils {
  public static buildScreenshotPath(name: string): string {
    return path.join(FilePaths.SCREENSHOTS, name.endsWith('.png') ? name : `${name}.png`);
  }

  /** Pixel-diffs two PNGs - the same technique tools/compare.js uses, exposed as a reusable framework utility. */
  public static compare(
    baselinePath: string,
    currentPath: string,
    diffPath: string,
    threshold = 0.03
  ): ScreenshotComparisonResult {
    const baseline = PNG.sync.read(fs.readFileSync(baselinePath));
    const current = PNG.sync.read(fs.readFileSync(currentPath));
    const { width, height } = baseline;
    const diff = new PNG({ width, height });

    const diffPixels = pixelmatch(baseline.data, current.data, diff.data, width, height, { threshold: 0.1 });
    const percentDiff = (diffPixels / (width * height)) * 100;

    const dir = path.dirname(diffPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(diffPath, PNG.sync.write(diff));

    return {
      diffPixels,
      percentDiff,
      passed: percentDiff <= threshold * 100,
      diffImagePath: diffPath
    };
  }
}
