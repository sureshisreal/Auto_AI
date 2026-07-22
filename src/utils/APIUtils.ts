import Logger from '../logger/Logger';

export interface SimpleApiOptions {
  headers?: Record<string, string>;
  body?: unknown;
}

/**
 * Minimal fetch-based HTTP helper for use outside a Playwright test
 * context (globalSetup/teardown, standalone scripts) where the
 * APIRequestContext fixture isn't available. Inside a test, prefer the
 * `apiClient` fixture backed by src/api/ApiClient.ts.
 */
export class APIUtils {
  public static async get<T>(url: string, options: SimpleApiOptions = {}): Promise<T> {
    const response = await fetch(url, { method: 'GET', headers: options.headers });
    return this.parse<T>(url, response);
  }

  public static async post<T>(url: string, options: SimpleApiOptions = {}): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...options.headers },
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    return this.parse<T>(url, response);
  }

  private static async parse<T>(url: string, response: Response): Promise<T> {
    if (!response.ok) {
      Logger.error(`APIUtils request failed: ${response.status} ${response.statusText} (${url})`);
    }
    return (await response.json()) as T;
  }
}
