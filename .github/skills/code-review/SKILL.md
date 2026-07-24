# Code Review Skill

## Description
Reviews test files and page objects for quality, POM compliance, security, Playwright best practices,
and Allure reporting coverage - against this repo's actual conventions, not generic Playwright advice.

## What This Skill Checks
- **POM Compliance**: locators/actions only in `src/pages/*.ts` or `src/core/ui/components/*.ts`, never
  a raw `page.locator(...)`/`page.click(...)` inline in a spec; page objects extend `BasePage`
  (`src/core/ui/base/BasePage.ts`) instead of re-implementing an action it already provides
- **Zero assertions in page objects**: any `expect(...)`, `toBe`, or `toHave*` inside `src/pages/` or
  `src/core/ui/components/` is a critical finding - that belongs in the test or in `ValidationHelpers`
  (`src/core/shared/validations/ValidationHelpers.ts`)
- **Fixture usage**: no `new LoginPage(page)` (or any page/service) inline in a test - it should be a
  registered fixture in `src/core/runtime/fixtures/fixtures.ts`, destructured in the test signature
- **Locator strategy**: `getByRole`/`getByLabel`/`getByPlaceholder`/`getByText`/`getByTestId` only - CSS
  selectors are a warning, XPath is always critical
- **Playwright anti-patterns**: `waitForTimeout`, brittle positional selectors, `networkidle` misuse
- **Security**: no hardcoded credentials/URLs - should come from `Config`
  (`src/core/config/Config.ts`) or `src/core/config/constants/`; test data from
  `src/core/data/testdata/`, `src/core/data/builders/` (e.g. `UserBuilder`), not inline literals
- **Allure evidence**: a UI-interacting spec with no `AllureUtils.step`/`attachScreenshot`
  (`src/core/shared/utils/AllureUtils.ts`) is a suggestion-level finding - it'll pass or fail with no
  step timeline or screenshot evidence in the report. Compare against the sample files in
  `tests/zsampleScript/` for the expected shape, but keep in mind that folder is a reference area,
  not the repository's production execution category.
- **Duplication**: the same locator/action sequence copy-pasted across two or more page objects
  should be a shared method on `BasePage` (`src/core/ui/base/BasePage.ts`) or a common component in
  `src/core/ui/components/`; the same multi-step flow (e.g. login, navigation) repeated across specs
  should be a fixture in `fixtures.ts` or a page-object method, not re-typed per test; the same
  `allure.step`/attachment boilerplate repeated across specs should use `AllureUtils.step`/`steps()`
  (`src/core/shared/utils/AllureUtils.ts`) instead - see how `AccessibilityUtils.runAxeScan()`
  (`src/core/shared/utils/AccessibilityUtils.ts`) was extracted once both `tests/accessibility/a11y.spec.ts`
  and the sample accessibility spec needed the same axe-core setup. Also watch for a new util
  reimplementing logic an existing util already provides at the `src/core/shared/utils/` layer itself -
  e.g. `ScreenshotUtils.compare()` and `VisualRegressionUtils.compareScreenshot()` are two independent
  pixelmatch/pngjs diffing implementations that should have been one. Two near-identical call sites is a
  suggestion; three or more, any duplicated assertion/validation logic, or two utils solving the same
  problem, is a warning.
- **Coverage**: negative tests, accessibility counterparts, missing edge cases

## Severity Levels
- 🔴 **Critical**: Must fix before merging
- 🟡 **Warning**: Should fix soon
- 💡 **Suggestion**: Nice to have

## Example Review Output
```markdown
# Code Review: tests/wesendcv/wesendcv.spec.ts
**Status:** ❌ Needs fixes before merge

## 🔴 Critical Issues
1. Raw selector in test file (line 45): `page.locator('.submit-btn')`
   - Fix: Add a `getByRole`-based locator + action method to `src/pages/WeSendCVPage.ts`
2. Hardcoded credential (line 12): `'admin@example.com'`
   - Fix: Use `Config.adminUsername` or `new UserBuilder().build()`
     (`src/core/data/builders/UserBuilder.ts`)

## 🟡 Warnings
1. Missing negative test case (invalid input)
2. Hard sleep at line 23 (`page.waitForTimeout(2000)`) - use `WaitUtils` or Playwright auto-waiting
3. Same 4-step login sequence duplicated in 3 specs (lines 15-19) - extract to a `loginPage.login()`
   method or a fixture instead of repeating it per test

## 💡 Suggestions
1. No `AllureUtils.step`/`attachScreenshot` around the login flow - add named steps so a failure
   shows which phase broke, not just the final assertion
```
