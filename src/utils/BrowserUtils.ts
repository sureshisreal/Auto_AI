import { devices, Project } from '@playwright/test';
import { BrowserType } from '../enums/BrowserType';

type ProjectStrategy = () => Project;

/**
 * Strategy Pattern for browser selection. Each BrowserType maps to a
 * strategy that builds its Playwright project definition. playwright.config.ts
 * consumes buildProjects() so `BROWSER=firefox npm test` (env-driven) and
 * `npm test -- --project=chromium` (CLI-driven) both work without editing config.
 */
export class BrowserUtils {
  private static readonly desktopStrategies: Record<BrowserType, ProjectStrategy> = {
    [BrowserType.CHROMIUM]: () => ({ name: BrowserType.CHROMIUM, use: { ...devices['Desktop Chrome'] } }),
    [BrowserType.FIREFOX]: () => ({ name: BrowserType.FIREFOX, use: { ...devices['Desktop Firefox'] } }),
    [BrowserType.WEBKIT]: () => ({ name: BrowserType.WEBKIT, use: { ...devices['Desktop Safari'] } })
  };

  private static readonly mobileProjects: Project[] = [
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } }
  ];

  /**
   * Builds the Playwright `projects` array. If BROWSER is set in the
   * environment, only that desktop browser's project is returned; otherwise
   * all desktop + mobile projects are returned and `--project=<name>` can be
   * used to pick one at run time.
   */
  public static buildProjects(): Project[] {
    const requested = this.parseBrowserType(process.env.BROWSER);
    if (requested) {
      return [this.desktopStrategies[requested]()];
    }
    return [...Object.values(this.desktopStrategies).map((strategy) => strategy()), ...this.mobileProjects];
  }

  public static parseBrowserType(value?: string): BrowserType | undefined {
    if (!value) {
      return undefined;
    }
    const normalized = value.trim().toLowerCase();
    return (Object.values(BrowserType) as string[]).includes(normalized) ? (normalized as BrowserType) : undefined;
  }

  public static isMobileProject(projectName: string): boolean {
    return /mobile/i.test(projectName);
  }
}
