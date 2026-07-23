import { test, expect } from '../../src/core/runtime/fixtures/fixtures';
import { AllureUtils } from '../../src/core/shared/utils/AllureUtils';
import { JsonUtils } from '../../src/core/shared/utils/JsonUtils';
import { Timeouts } from '../../src/core/config/constants/Timeouts';
import { UserBuilder } from '../../src/core/data/builders/UserBuilder';

/**
 * SAMPLE 1/13: Unit Tests
 * Focus: individual functions and utilities, tested in isolation - no browser, no network.
 * Example: API parsing, email validation, timeout calculations.
 *
 * Also demonstrates AllureUtils - step()/attachJson() for evidence (no page/screenshot exists
 * at this level) and setCategory()/severity() for labels - these show up in the Allure report
 * even though there's no browser involved.
 */
test.describe('Sample - Unit Tests', () => {
  test.beforeEach(async () => {
    await AllureUtils.setCategory('Sample Test Categories', 'Unit Tests');
  });

  test('JsonUtils.parseJson parses a raw JSON string into a typed object (API parsing)', async () => {
    await AllureUtils.severity(AllureUtils.Severity.NORMAL);
    const raw = '{"id":1,"name":"demo"}';

    const parsed = await AllureUtils.step('Parse the raw JSON string', () => {
      return JsonUtils.parseJson<{ id: number; name: string }>(raw);
    });

    await AllureUtils.step('Verify the parsed fields', () => {
      expect(parsed.id).toBe(1);
      expect(parsed.name).toBe('demo');
    });

    await AllureUtils.attachJson('Parsed result', parsed);
  });

  test('UserBuilder produces a syntactically valid email address (email validation)', async () => {
    await AllureUtils.severity(AllureUtils.Severity.CRITICAL);

    const user = await AllureUtils.step('Build a random user', () => new UserBuilder().build());

    await AllureUtils.step('Verify the email matches a standard format', () => {
      expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    await AllureUtils.attachJson('Generated user', user);
  });

  test('Timeouts constants stay in a sane relative order (timeout calculations)', async () => {
    await AllureUtils.severity(AllureUtils.Severity.MINOR);

    await AllureUtils.step('Compare timeout tiers', () => {
      expect(Timeouts.LONG).toBeGreaterThan(Timeouts.DEFAULT);
      expect(Timeouts.API_REQUEST).toBeLessThanOrEqual(Timeouts.LONG);
      expect(Timeouts.SHORT).toBeLessThan(Timeouts.MEDIUM);
    });

    await AllureUtils.attachJson('Timeouts snapshot', Timeouts);
  });
});
