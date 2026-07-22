import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/api/ApiClient';
import { TEST_PAYLOADS } from '../../src/testdata/payloads.testdata';

interface Post {
  id: number;
  title: string;
  body: string;
}

test.describe('API Unit Tests', () => {
  test('GET https://jsonplaceholder.typicode.com/posts/1 returns 200', async ({ request }) => {
    // These tests hit arbitrary absolute URLs, not this app's own API, so
    // ApiClient is constructed with an empty base URL rather than via the
    // shared `apiClient` fixture (which is bound to Config.apiBaseUrl).
    const api = new ApiClient(request, '');

    const response = await api.get('https://jsonplaceholder.typicode.com/posts/1');
    await api.expectStatus(response, 200);
    const data = await api.getJson<Post>(response);
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('title');
    expect(data).toHaveProperty('body');
  });

  // Note: page.route() only intercepts requests the *browser page* makes -
  // it cannot intercept Node-side APIRequestContext calls (ApiClient/the
  // `request` fixture use a separate network stack). These two tests mock
  // via the page's own fetch() to actually exercise the interception.
  test('POST /api/jobs with valid payload (mocked) should work', async ({ page }) => {
    const validJobPayload = TEST_PAYLOADS.job.valid();
    await page.route('**/api/jobs', (route) => {
      route.fulfill({
        status: 201,
        body: JSON.stringify({ id: 1, ...validJobPayload })
      });
    });
    await page.goto('https://example.com');

    const response = await page.evaluate(async (payload) => {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return { status: res.status, ok: res.ok };
    }, validJobPayload);

    expect(response.ok).toBeTruthy();
    expect(response.status).toBe(201);
  });

  test('POST /api/jobs with invalid payload returns 400 (mocked)', async ({ page }) => {
    const invalidJobPayload = TEST_PAYLOADS.job.invalid();
    await page.route('**/api/jobs', (route) => {
      route.fulfill({
        status: 400,
        body: JSON.stringify({ error: 'Invalid payload' })
      });
    });
    await page.goto('https://example.com');

    const response = await page.evaluate(async (payload) => {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return { status: res.status };
    }, invalidJobPayload);

    expect(response.status).toBe(400);
  });
});
