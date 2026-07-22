import { Timeouts } from '../../config/constants/Timeouts';
import { ElementError } from '../../shared/exceptions/ElementError';

export class WaitUtils {
  /**
   * Polls a condition until it returns true or the timeout elapses.
   * Use for state that isn't expressible as a Locator wait (e.g. app state).
   */
  public static async waitForCondition(
    condition: () => Promise<boolean> | boolean,
    timeout: number = Timeouts.DEFAULT,
    intervalMs = 200
  ): Promise<void> {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      if (await condition()) {
        return;
      }
      await this.sleep(intervalMs);
    }
    throw new ElementError(`Condition not met within ${timeout}ms`);
  }

  public static async sleep(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
