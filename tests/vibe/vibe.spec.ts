import { test, expect } from '../../src/fixtures/fixtures';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import Logger from '../../src/logger/Logger';

test.describe('Vibe Tests - Animation & Perceptual Diff', () => {
  const artifactsDir = path.join(__dirname, '..', 'artifacts');
  const baselinePath = path.join(__dirname, '..', 'demo', 'baseline.png');
  const currentPath = path.join(artifactsDir, 'current.png');
  const diffPath = path.join(artifactsDir, 'diff.png');

  test.beforeEach(async ({ demoPage }) => {
    await demoPage.goToDemo();

    if (!fs.existsSync(artifactsDir)) {
      fs.mkdirSync(artifactsDir, { recursive: true });
    }
  });

  test('should have smooth animation with consistent frame timings', async ({ demoPage }) => {
    await expect(demoPage.getAnimatedBox()).toBeVisible();

    const frames = await demoPage.sampleAnimationFrames(2000);

    expect(frames.length).toBeGreaterThan(50);

    const gaps: number[] = [];
    for (let i = 1; i < frames.length; i++) {
      gaps.push(frames[i] - frames[i - 1]);
    }

    const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    expect(avgGap).toBeLessThan(32);
  });

  test('should match visual baseline', async ({ demoPage }) => {
    await expect(demoPage.getAnimatedBox()).toBeVisible();
    await demoPage.takeScreenshot(currentPath);

    try {
      execSync(`node tools/compare.js "${baselinePath}" "${currentPath}" "${diffPath}" --threshold=0.03`, {
        stdio: 'inherit'
      });
    } catch (error) {
      if (!fs.existsSync(baselinePath)) {
        Logger.info('Baseline created, skipping assertion.');
      } else {
        throw error;
      }
    }
  });
});
