import { test, expect } from '../../src/fixtures/fixtures';

interface StatusResponse {
  status: string;
  timestamp: string;
}

test.describe('API Smoke Tests', () => {
  test('GET /api/status returns ok', async ({ apiClient }) => {
    // Act
    const response = await apiClient.get('/status');

    // Assert
    await apiClient.expectOk(response);
    const body = await apiClient.getJson<StatusResponse>(response);
    expect(body.status).toBe('ok');
  });
});
