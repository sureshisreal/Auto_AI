import { Page } from '@playwright/test';
import Logger from '../logger/Logger';

/**
 * Wires browser console errors, uncaught page errors, and failed network
 * requests into the Winston logger, so they show up in reports/logs
 * without anyone having to remember to check the browser console manually.
 */
export class PageEventListener {
  public static attach(page: Page): void {
    page.on('console', (message) => {
      if (message.type() === 'error') {
        Logger.warn(`Browser console error: ${message.text()}`);
      }
    });

    page.on('pageerror', (error) => {
      Logger.error(`Uncaught page error: ${error.message}`);
    });

    page.on('requestfailed', (request) => {
      Logger.warn(`Request failed: ${request.method()} ${request.url()} - ${request.failure()?.errorText}`);
    });
  }
}
