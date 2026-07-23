import { defineConfig } from '@playwright/test';
import { BrowserUtils } from './src/core/shared/utils/BrowserUtils';
import Config from './src/core/config/Config';

export default defineConfig({
  testDir: './tests',
  outputDir: './reports/test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : Config.retries,
  workers: process.env.CI ? 1 : undefined,
  globalSetup: require.resolve('./src/core/runtime/hooks/GlobalSetup'),
  globalTeardown: require.resolve('./src/core/runtime/hooks/GlobalTeardown'),
  reporter: [
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['junit', { outputFile: 'reports/junit.xml' }],
    ['json', { outputFile: 'reports/test-results.json' }],
    ['allure-playwright', { resultsDir: 'reports/allure-results' }],
    ['./src/core/runtime/listeners/CustomReporter.ts'],
  ],
  use: {
    baseURL: Config.baseUrl,
    headless: Config.headless,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: BrowserUtils.buildProjects(),
  webServer: {
    command: 'node src/core/tools/dev-server.js',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
  },
});
