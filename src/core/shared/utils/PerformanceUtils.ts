import { Page, test } from '@playwright/test';
import fs from 'fs';
import Logger from '../../config/logger/Logger';

export interface PerformanceThresholds {
  performance?: number;
  accessibility?: number;
  'best-practices'?: number;
  seo?: number;
  pwa?: number;
}

export class PerformanceUtils {
  constructor(private page: Page) {}

  /**
   * Runs Lighthouse performance audit on the current page
   * @param thresholds - Thresholds for audit
   * @returns Lighthouse audit results
   */
  async runLighthouseAudit(
    thresholds: PerformanceThresholds = {
      performance: 70,
      accessibility: 90,
      'best-practices': 80,
      seo: 80,
    }
  ): Promise<any> {
    const url = this.page.url();
    Logger.info(`Running Lighthouse audit on: ${url}`);

    try {
      // playwright-lighthouse ships as an ESM-only package - a static top-level import
      // can't be require()'d from this CommonJS project, so it's loaded lazily here via
      // dynamic import(), which works from CJS and only pays the cost when actually used.
      const { playAudit } = await import('playwright-lighthouse');
      const results = await playAudit({
        page: this.page,
        thresholds,
        port: 9222,
        opts: {
          logLevel: 'info',
          output: 'html',
          onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        },
      });

      Logger.info('Lighthouse audit completed successfully');

      // Attach report to Allure if available
      try {
        const allure = (test as any).info().attachments;
        if (allure) {
          const reportHtml = fs.readFileSync('lighthouse-report.html');
          allure.attachment('lighthouse-report', reportHtml, 'text/html');
        }
      } catch {
        // Ignore if Allure not available
      }

      return results;
    } catch (error) {
      Logger.error(`Lighthouse audit failed: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Captures page load performance metrics
   * @returns Object with performance metrics
   */
  async getPageLoadMetrics(): Promise<any> {
    const metrics = await this.page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.startTime,
        loadComplete: perfData.loadEventEnd - perfData.startTime,
        domInteractive: perfData.domInteractive - perfData.startTime,
        firstPaint: performance.getEntriesByType('paint').find((e) => e.name === 'first-paint')
          ?.startTime,
        firstContentfulPaint: performance
          .getEntriesByType('paint')
          .find((e) => e.name === 'first-contentful-paint')?.startTime,
      };
    });

    Logger.info('Page load metrics captured', metrics);
    return metrics;
  }
}
