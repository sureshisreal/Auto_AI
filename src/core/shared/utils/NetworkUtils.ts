import { Page, Route } from '@playwright/test';
import Logger from '../../config/logger/Logger';

export class NetworkUtils {
  public static async mockResponse(page: Page, urlPattern: string | RegExp, payload: unknown, status = 200): Promise<void> {
    await page.route(urlPattern, (route: Route) =>
      route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(payload) })
    );
  }

  public static async mockError(
    page: Page,
    urlPattern: string | RegExp,
    status = 500,
    message = 'Internal Server Error'
  ): Promise<void> {
    await page.route(urlPattern, (route: Route) =>
      route.fulfill({ status, contentType: 'application/json', body: JSON.stringify({ error: message }) })
    );
  }

  public static async abortRequests(page: Page, urlPattern: string | RegExp): Promise<void> {
    await page.route(urlPattern, (route: Route) => route.abort());
  }

  public static async goOffline(page: Page): Promise<void> {
    await page.context().setOffline(true);
    Logger.info('Network set to offline');
  }

  public static async goOnline(page: Page): Promise<void> {
    await page.context().setOffline(false);
    Logger.info('Network set to online');
  }
}
