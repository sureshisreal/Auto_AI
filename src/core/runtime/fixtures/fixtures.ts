import { test as base, Page } from '@playwright/test';
import Config from '../../config/Config';
import Logger from '../../config/logger/Logger';
import { BasePage } from '../../ui/base/BasePage';
import { LoginPage } from '../../../pages/LoginPage';
import { DashboardPage } from '../../../pages/DashboardPage';
import { DemoPage } from '../../../pages/DemoPage';
import { WeSendCVPage } from '../../../pages/WeSendCVPage';
import { ApiClient } from '../../api/ApiClient';
import { AuthService } from '../../api/services/AuthService';
import { JobService } from '../../api/services/JobService';
import { ValidationHelpers } from '../../shared/validations/ValidationHelpers';
import { TestDataProvider } from '../../shared/helpers/TestDataProvider';
import { TestLifecycleHooks } from '../../runtime/hooks/TestLifecycleHooks';
import { PageEventListener } from '../../runtime/listeners/PageEventListener';
import { StorageUtils } from '../../shared/utils/StorageUtils';
import { URLS } from '../../data/testdata/urls.testdata';
import { VisualRegressionUtils } from '../../shared/utils/VisualRegressionUtils';
import { PerformanceUtils } from '../../shared/utils/PerformanceUtils';

type Fixtures = {
  config: typeof Config;
  logger: typeof Logger;
  basePage: BasePage;
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  demoPage: DemoPage;
  weSendCVPage: WeSendCVPage;
  apiClient: ApiClient;
  wesendcvApiClient: ApiClient;
  authService: AuthService;
  jobService: JobService;
  validationHelpers: ValidationHelpers;
  testData: typeof TestDataProvider;
  authenticatedPage: Page;
  visualRegressionUtils: VisualRegressionUtils;
  performanceUtils: PerformanceUtils;
};

/**
 * Every fixture below is Dependency Injection: tests destructure what they
 * need (`{ loginPage, dashboardPage }`) instead of ever calling `new
 * XyzPage(page)` themselves. The `page` fixture is overridden once here so
 * every page object automatically gets console/network logging
 * (PageEventListener) and failure-only screenshot+log capture
 * (TestLifecycleHooks) - no test or page object has to remember to wire it.
 */
export const test = base.extend<Fixtures>({
  page: async ({ page }, use, testInfo) => {
    PageEventListener.attach(page);
    await use(page);
    await TestLifecycleHooks.captureOnFailure(page, testInfo);
  },

  config: async ({}, use) => {
    await use(Config);
  },

  logger: async ({}, use) => {
    await use(Logger);
  },

  basePage: async ({ page }, use) => {
    await use(new BasePage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  demoPage: async ({ page }, use) => {
    await use(new DemoPage(page));
  },

  weSendCVPage: async ({ page }, use) => {
    await use(new WeSendCVPage(page));
  },

  apiClient: async ({ request }, use) => {
    await use(new ApiClient(request, Config.apiBaseUrl));
  },

  wesendcvApiClient: async ({ request }, use) => {
    await use(new ApiClient(request, URLS.WE_SEND_CV));
  },

  authService: async ({ wesendcvApiClient }, use) => {
    await use(new AuthService(wesendcvApiClient));
  },

  jobService: async ({ wesendcvApiClient }, use) => {
    await use(new JobService(wesendcvApiClient));
  },

  validationHelpers: async ({ page }, use) => {
    await use(new ValidationHelpers(page));
  },

  testData: async ({}, use) => {
    await use(TestDataProvider);
  },

  /**
   * Logs in once through the local demo login flow, caches storageState on
   * disk, and reuses it - a real "authenticated context" fixture that
   * stays CI-safe because it's fully local (no external dependency).
   */
  authenticatedPage: async ({ browser }, use) => {
    const stateFile = 'admin.json';
    if (!StorageUtils.storageStateExists(stateFile)) {
      const setupContext = await browser.newContext({ baseURL: Config.baseUrl });
      const setupPage = await setupContext.newPage();
      const loginPage = new LoginPage(setupPage);
      await loginPage.navigate();
      await loginPage.login(Config.adminUsername, Config.adminPassword);
      await setupPage.waitForURL('**/dashboard');
      await StorageUtils.saveStorageState(setupContext, stateFile);
      await setupContext.close();
    }

    const context = await browser.newContext({
      baseURL: Config.baseUrl,
      storageState: StorageUtils.storageStatePath(stateFile),
    });
    const authenticatedPage = await context.newPage();
    await use(authenticatedPage);
    await context.close();
  },

  visualRegressionUtils: async ({ page }, use, testInfo) => {
    await use(new VisualRegressionUtils(page, testInfo.project.name));
  },

  performanceUtils: async ({ page }, use) => {
    await use(new PerformanceUtils(page));
  },
});

export { expect } from '@playwright/test';
