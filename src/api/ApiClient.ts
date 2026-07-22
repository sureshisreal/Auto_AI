import { APIRequestContext, APIResponse } from '@playwright/test';
import { APIError } from '../exceptions/APIError';
import Logger from '../logger/Logger';

export class ApiClient {
  private request: APIRequestContext;
  private baseUrl: string;
  private logger: typeof Logger;

  constructor(request: APIRequestContext, baseUrl: string) {
    this.request = request;
    this.baseUrl = baseUrl;
    this.logger = Logger;
  }

  public async get(
    endpoint: string,
    options?: { headers?: Record<string, string>, params?: Record<string, string | number> }
  ): Promise<APIResponse> {
    this.logger.info(`GET request to ${this.baseUrl}${endpoint}`);
    try {
      return await this.request.get(`${this.baseUrl}${endpoint}`, options);
    } catch (error) {
      this.logger.error(`GET request failed to ${endpoint}`, { error });
      throw new APIError(`Failed to GET ${endpoint}`);
    }
  }

  public async post(
    endpoint: string,
    data?: any,
    options?: { headers?: Record<string, string> }
  ): Promise<APIResponse> {
    this.logger.info(`POST request to ${this.baseUrl}${endpoint}`);
    try {
      return await this.request.post(`${this.baseUrl}${endpoint}`, { data, ...options });
    } catch (error) {
      this.logger.error(`POST request failed to ${endpoint}`, { error });
      throw new APIError(`Failed to POST ${endpoint}`);
    }
  }

  public async put(
    endpoint: string,
    data?: any,
    options?: { headers?: Record<string, string> }
  ): Promise<APIResponse> {
    this.logger.info(`PUT request to ${this.baseUrl}${endpoint}`);
    try {
      return await this.request.put(`${this.baseUrl}${endpoint}`, { data, ...options });
    } catch (error) {
      this.logger.error(`PUT request failed to ${endpoint}`, { error });
      throw new APIError(`Failed to PUT ${endpoint}`);
    }
  }

  public async patch(
    endpoint: string,
    data?: any,
    options?: { headers?: Record<string, string> }
  ): Promise<APIResponse> {
    this.logger.info(`PATCH request to ${this.baseUrl}${endpoint}`);
    try {
      return await this.request.patch(`${this.baseUrl}${endpoint}`, { data, ...options });
    } catch (error) {
      this.logger.error(`PATCH request failed to ${endpoint}`, { error });
      throw new APIError(`Failed to PATCH ${endpoint}`);
    }
  }

  public async delete(
    endpoint: string,
    options?: { headers?: Record<string, string> }
  ): Promise<APIResponse> {
    this.logger.info(`DELETE request to ${this.baseUrl}${endpoint}`);
    try {
      return await this.request.delete(`${this.baseUrl}${endpoint}`, options);
    } catch (error) {
      this.logger.error(`DELETE request failed to ${endpoint}`, { error });
      throw new APIError(`Failed to DELETE ${endpoint}`);
    }
  }

  public async expectStatus(response: APIResponse, status: number): Promise<void> {
    if (response.status() !== status) {
      throw new APIError(`Expected status ${status}, got ${response.status()}`);
    }
  }

  public async expectOk(response: APIResponse): Promise<void> {
    if (!response.ok()) {
      throw new APIError(`Request failed with status ${response.status()}`);
    }
  }

  public async getJson<T>(response: APIResponse): Promise<T> {
    return await response.json() as T;
  }
}
