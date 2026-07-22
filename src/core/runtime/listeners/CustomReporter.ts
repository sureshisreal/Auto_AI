import type { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';
import Logger from '../../config/logger/Logger';

/**
 * Structured execution summary (pass/fail/skip/duration/retries) written
 * through Winston so it lands in the daily log file alongside per-step
 * debug logs, not just on stdout. Registered in playwright.config.ts.
 */
export default class CustomReporter implements Reporter {
  private startTime = 0;
  private passed = 0;
  private failed = 0;
  private skipped = 0;
  private flaky = 0;

  onBegin(config: FullConfig, suite: Suite): void {
    this.startTime = Date.now();
    Logger.info('Test run starting', {
      totalTests: suite.allTests().length,
      workers: config.workers,
      projects: config.projects.map((project) => project.name)
    });
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    switch (result.status) {
      case 'passed':
        this.passed += 1;
        break;
      case 'skipped':
        this.skipped += 1;
        break;
      case 'timedOut':
      case 'failed':
      case 'interrupted':
        this.failed += 1;
        break;
    }
    if (result.status === 'passed' && result.retry > 0) {
      this.flaky += 1;
    }

    const logLevel = result.status === 'passed' ? 'info' : 'error';
    Logger[logLevel](`Test ${result.status}: ${test.titlePath().join(' > ')}`, {
      duration: `${result.duration}ms`,
      retry: result.retry,
      project: test.parent.project()?.name
    });
  }

  onEnd(result: FullResult): void {
    Logger.info('Test run finished', {
      status: result.status,
      durationMs: Date.now() - this.startTime,
      passed: this.passed,
      failed: this.failed,
      skipped: this.skipped,
      flaky: this.flaky
    });
  }
}
