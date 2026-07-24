# Playwright Test Debugging Skill

## Description
A systematic debugging workflow for Playwright tests in this repo, helping diagnose and fix test
failures quickly using the artifacts this framework already produces.

## Steps to Use This Skill
1. **Check the Playwright HTML report**: `npx playwright show-report reports/html` - screenshot,
   video, and trace are attached automatically for every failure (`outputDir` is `reports/test-results`,
   not the Playwright default `test-results/` - this repo moved it under `reports/`), plus the last 50
   Winston log lines via `TestLifecycleHooks.captureOnFailure`
2. **Check the Allure report, if the spec uses AllureUtils**: `npm run allurereport`, then open the
   failing test's **Test body** tab - specs written with `AllureUtils.step`
   (`src/core/shared/utils/AllureUtils.ts`, see `tests/zsampleScript/` for reference examples) show a
   named step timeline with a screenshot at each step, which localizes the failure to a specific phase
   far faster than one end-of-test screenshot. Regenerate after every run - it doesn't rebuild itself.
3. **Review Test Code**: Verify selectors, waits, and assertions; confirm the page object extends
   `BasePage` and the spec imports `{ test, expect }` from `src/core/runtime/fixtures/fixtures`, not
   `@playwright/test` directly
4. **Run in Headed Mode**: Use `--headed` to see the test execution
5. **Use Playwright Inspector**: Run with `--debug` to step through the test
6. **Check Network Logs**: `PageEventListener` (`src/core/runtime/listeners/PageEventListener.ts`)
   logs console/network activity per test automatically - check `reports/logs/app-<date>.log`
7. **Validate Page Object Model**: Ensure locators (`getByRole`/`getByLabel`/`getByTestId` - never
   XPath) and methods are correct

## Common Issues & Fixes
- **Flaky Tests**: Add proper waits, use stable locators; CI always retries twice
  (`playwright.config.ts`) - check the retry timeline in Allure to see if only the first attempt failed
- **Selector Failures**: Prefer `getByRole`, `getByLabel`, avoid brittle selectors
- **Timing Issues**: Use `waitFor` or `WaitUtils` (`src/core/shared/utils/WaitUtils.ts`), avoid
  hard-coded `page.waitForTimeout(...)`

## Example Debug Workflow
```bash
# Run test with debug mode
npx playwright test tests/wesendcv/wesendcv.spec.ts --debug

# Run in headed mode for specific browser
npx playwright test tests/vibe/vibe.spec.ts --headed --project=chromium
```
