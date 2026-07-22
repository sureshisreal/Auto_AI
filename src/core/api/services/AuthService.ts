import { ApiClient } from '../../api/ApiClient';
import { API_ENDPOINTS } from '../../data/testdata/apiEndpoints.testdata';
import { ApiResponse } from '../../data/models/ApiResponse.model';
import Logger from '../../config/logger/Logger';

export interface AuthTokenResponse {
  token?: string;
  [key: string]: unknown;
}

/**
 * Service layer wrapping ApiClient for auth-related API calls, so tests
 * and fixtures never construct raw HTTP requests themselves.
 */
export class AuthService {
  constructor(private readonly apiClient: ApiClient) {}

  public async login(email: string, password: string): Promise<ApiResponse<AuthTokenResponse>> {
    const response = await this.apiClient.post(API_ENDPOINTS.wesendcv.auth.login, { email, password });
    const body = await this.apiClient.getJson<AuthTokenResponse>(response);
    Logger.info(`AuthService.login attempted for ${email}`, { status: response.status() });
    return { status: response.status(), ok: response.ok(), body };
  }

  public async logout(): Promise<void> {
    await this.apiClient.post(API_ENDPOINTS.wesendcv.auth.logout);
  }
}
