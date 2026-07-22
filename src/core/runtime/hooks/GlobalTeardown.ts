import Logger from '../../config/logger/Logger';

/**
 * Runs once after the whole suite. Kept intentionally light - per-test
 * artifact cleanup/capture lives in TestLifecycleHooks, not here.
 */
export default async function globalTeardown(): Promise<void> {
  Logger.info('Global teardown complete');
}
