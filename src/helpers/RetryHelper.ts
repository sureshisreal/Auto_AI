import Logger from '../logger/Logger';

export interface RetryOptions {
  attempts?: number;
  delayMs?: number;
}

/** Generic retry-with-backoff for flaky external calls (API, DB, network). */
export class RetryHelper {
  public static async retry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
    const attempts = options.attempts ?? 3;
    const delayMs = options.delayMs ?? 500;
    let lastError: unknown;

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        Logger.warn(`Retry attempt ${attempt}/${attempts} failed: ${(error as Error).message}`);
        if (attempt < attempts) {
          await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
        }
      }
    }
    throw lastError;
  }
}
