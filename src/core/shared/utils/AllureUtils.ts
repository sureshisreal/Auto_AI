import { Page, BrowserContext } from '@playwright/test';
import * as allure from 'allure-js-commons';

/**
 * A single façade over `allure-js-commons` so tests import one thing
 * (`AllureUtils`) instead of duplicating the same step/attachment/label
 * boilerplate in every spec. Wraps only the patterns actually repeated
 * across this framework's tests - for anything else, `allure-js-commons`
 * itself still has the full API.
 */
export class AllureUtils {
  public static readonly Severity = allure.Severity;
  public static readonly ContentType = allure.ContentType;

  /** Wraps a block of actions as a named, collapsible step in the report. */
  public static async step<T>(name: string, body: () => T | Promise<T>): Promise<T> {
    return allure.step(name, body);
  }

  /**
   * Same as `step`, but for a flat list of actions run in sequence - skips
   * writing `async () => { await a(); await b(); }` at the call site when
   * there's nothing to return and no per-action naming needed.
   */
  public static async steps(
    name: string,
    ...actions: Array<() => unknown | Promise<unknown>>
  ): Promise<void> {
    await allure.step(name, async () => {
      for (const action of actions) {
        await action();
      }
    });
  }

  /** Sets the epic/feature/severity labels a test is grouped and prioritized by. */
  public static async setCategory(
    epic: string,
    feature: string,
    severity: string = allure.Severity.NORMAL
  ): Promise<void> {
    await allure.epic(epic);
    await allure.feature(feature);
    await allure.severity(severity);
  }

  /** Shows a named parameter value on the test's report page. */
  public static async parameter(name: string, value: string): Promise<void> {
    return allure.parameter(name, value);
  }

  /** Sets just the severity - for suites where it varies test-by-test rather than uniformly. */
  public static async severity(value: string): Promise<void> {
    return allure.severity(value);
  }

  /** Captures and attaches a PNG screenshot, regardless of pass/fail. */
  public static async attachScreenshot(page: Page, name = 'Screenshot'): Promise<void> {
    await allure.attachment(name, await page.screenshot(), allure.ContentType.PNG);
  }

  /** Attaches arbitrary data as pretty-printed JSON. */
  public static async attachJson(name: string, data: unknown): Promise<void> {
    await allure.attachment(name, JSON.stringify(data, null, 2), allure.ContentType.JSON);
  }

  /**
   * Attaches the video recorded for `page`. Requires a context created with
   * `recordVideo` set (the default fixture context doesn't enable it) -
   * closes that context to finalize the file before attaching it.
   */
  public static async attachVideo(
    page: Page,
    context: BrowserContext,
    name = 'Recording'
  ): Promise<void> {
    const video = page.video();
    await context.close();
    if (video) {
      await allure.attachmentPath(name, await video.path(), allure.ContentType.WEBM);
    }
  }
}
