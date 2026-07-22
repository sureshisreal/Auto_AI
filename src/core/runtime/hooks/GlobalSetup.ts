import { FullConfig } from '@playwright/test';
import Config from '../../config/Config';
import Logger from '../../config/logger/Logger';
import { FileUtils } from '../../shared/utils/FileUtils';
import { FilePaths } from '../../config/constants/FilePaths';
import * as path from 'path';

/**
 * Runs once before the whole suite. Ensures report/artifact directories
 * exist and publishes environment info that the Allure reporter picks up
 * automatically (Environment tab: Browser, Environment, Retries, Base URL).
 */
export default async function globalSetup(config: FullConfig): Promise<void> {
  [FilePaths.REPORTS, FilePaths.SCREENSHOTS, FilePaths.VIDEOS, FilePaths.LOGS, FilePaths.DOWNLOADS].forEach(
    (dir) => {
      if (!FileUtils.fileExists(dir)) {
        FileUtils.writeFile(path.join(dir, '.gitkeep'), '');
      }
    }
  );

  const allureResultsDir = path.join(FilePaths.REPORTS, 'allure-results');
  const projectNames = config.projects.map((project) => project.name).join(', ');
  const environmentProperties = [
    `Environment=${Config.environment}`,
    `Base.URL=${Config.baseUrl}`,
    `Browsers=${projectNames}`,
    `Retries=${config.projects[0]?.retries ?? 0}`,
    `Workers=${config.workers}`
  ].join('\n');
  FileUtils.writeFile(path.join(allureResultsDir, 'environment.properties'), environmentProperties);

  Logger.info('Global setup complete', {
    environment: Config.environment,
    baseUrl: Config.baseUrl,
    projects: projectNames
  });
}
