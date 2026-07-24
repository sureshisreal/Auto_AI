import { FullConfig, request } from '@playwright/test';
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
  // Create all required directories
  [
    FilePaths.REPORTS,
    FilePaths.SCREENSHOTS,
    FilePaths.VIDEOS,
    FilePaths.LOGS,
    FilePaths.DOWNLOADS,
    FilePaths.VISUAL_BASELINE,
    FilePaths.VISUAL_DIFF,
    FilePaths.VISUAL_ACTUAL,
  ].forEach((dir) => {
    if (!FileUtils.fileExists(dir)) {
      FileUtils.writeFile(path.join(dir, '.gitkeep'), '');
    }
  });

  // Environment health check
  Logger.info('Running environment health check...');
  try {
    const apiRequestContext = await request.newContext({
      baseURL: Config.baseUrl,
    });

    // Simple check - just try to load the base URL
    const response = await apiRequestContext.get('/');
    if (response.ok()) {
      Logger.info('Environment health check passed');
    } else {
      Logger.warn(`Environment health check returned status: ${response.status()}`);
    }

    await apiRequestContext.dispose();
  } catch (error) {
    Logger.warn(`Environment health check failed - continuing anyway: ${(error as Error).message}`);
  }

  const allureResultsDir = path.join(FilePaths.REPORTS, 'allure-results');
  const projectNames = config.projects.map((project) => project.name).join(', ');
  const environmentProperties = [
    `Environment=${Config.environment}`,
    `Base.URL=${Config.baseUrl}`,
    `Browsers=${projectNames}`,
    `Retries=${config.projects[0]?.retries ?? 0}`,
    `Workers=${config.workers}`,
  ].join('\n');
  FileUtils.writeFile(path.join(allureResultsDir, 'environment.properties'), environmentProperties);

  Logger.info('Global setup complete', {
    environment: Config.environment,
    baseUrl: Config.baseUrl,
    projects: projectNames,
  });
}
