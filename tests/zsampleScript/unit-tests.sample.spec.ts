import { test, expect } from '../../src/core/runtime/fixtures/fixtures';
import * as allure from 'allure-js-commons';
import { JsonUtils } from '../../src/core/shared/utils/JsonUtils';
import { Timeouts } from '../../src/core/config/constants/Timeouts';
import { UserBuilder } from '../../src/core/data/builders/UserBuilder';

/**
 * SAMPLE 1/13: Unit Tests
 * Focus: individual functions and utilities, tested in isolation - no browser, no network.
 * Example: API parsing, email validation, timeout calculations.
 *
 * Also demonstrates: allure.step() for readable phases, allure.attachment() with JSON
 * evidence (no page/screenshot exists at this level), and epic/feature/severity labels -
 * these show up in the Allure report even though there's no browser involved.
 */
test.describe('Sample - Unit Tests', () => {
  test.beforeEach(async () => {
    await allure.epic('Sample Test Categories');
    await allure.feature('Unit Tests');
  });

  test('JsonUtils.parseJson parses a raw JSON string into a typed object (API parsing)', async () => {
    await allure.severity(allure.Severity.NORMAL);
    const raw = '{"id":1,"name":"demo"}';

    const parsed = await allure.step('Parse the raw JSON string', async () => {
      return JsonUtils.parseJson<{ id: number; name: string }>(raw);
    });

    await allure.step('Verify the parsed fields', async () => {
      expect(parsed.id).toBe(1);
      expect(parsed.name).toBe('demo');
    });

    await allure.attachment(
      'Parsed result',
      JSON.stringify(parsed, null, 2),
      allure.ContentType.JSON
    );
  });

  test('UserBuilder produces a syntactically valid email address (email validation)', async () => {
    await allure.severity(allure.Severity.CRITICAL);

    const user = await allure.step('Build a random user', async () => new UserBuilder().build());

    await allure.step('Verify the email matches a standard format', async () => {
      expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    await allure.attachment(
      'Generated user',
      JSON.stringify(user, null, 2),
      allure.ContentType.JSON
    );
  });

  test('Timeouts constants stay in a sane relative order (timeout calculations)', async () => {
    await allure.severity(allure.Severity.MINOR);

    await allure.step('Compare timeout tiers', async () => {
      expect(Timeouts.LONG).toBeGreaterThan(Timeouts.DEFAULT);
      expect(Timeouts.API_REQUEST).toBeLessThanOrEqual(Timeouts.LONG);
      expect(Timeouts.SHORT).toBeLessThan(Timeouts.MEDIUM);
    });

    await allure.attachment(
      'Timeouts snapshot',
      JSON.stringify(Timeouts, null, 2),
      allure.ContentType.JSON
    );
  });
});
