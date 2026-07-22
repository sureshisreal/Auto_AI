# Generator Chatmode

## Description
Generates test specifications (spec files) and page object model (POM) code for Playwright tests in
this repo's QE Automation Framework, following its exact conventions - not generic Playwright output.

## How to Use
- Ask to write test specs for a specific page/feature
- Ask to create or extend page object classes
- Example: "Write a Playwright test spec for the WeSendCV login page"
- Example: "Create a POM class for the search results page"

## What This Chatmode Does
- Generates Playwright test files (`*.spec.ts`) in the correct `tests/<category>/` folder
- Creates/extends page object classes in `src/pages/` (flat, one file per page - e.g. `LoginPage.ts`,
  `DashboardPage.ts`, `DemoPage.ts`, `WeSendCVPage.ts`)
- Creates/extends reusable components in `src/core/ui/components/` when a UI pattern repeats across
  pages (see `HeaderComponent`, `TableComponent`, `Pagination`, `ToastMessage`, `CommonDialog`,
  `NavigationMenu` for the pattern - each extends `BaseComponent` and is scoped to a root `Locator`)
- Follows project naming and structure conventions
- Uses existing base actions and test data files - never duplicates what `BasePage` already provides

## Page Object Conventions (non-negotiable)
- Extend `BasePage` (`src/core/ui/base/BasePage.ts`) - it owns every raw Playwright action
  (click/fill/wait/navigate/screenshot/download); a page object never re-implements one of these
- Constructor takes `(page: Page)`, calls `super(page)`, declares locators as `private readonly`
- Locators use `getByRole`/`getByLabel`/`getByPlaceholder`/`getByText`/`getByTestId` only - no CSS, no
  XPath ever, matching `src/core/ui/locators/LocatorFactory.ts` and `CommonLocators.ts`
- Only locators + actions + navigation methods - **zero assertions** in a page object; verification
  belongs in `ValidationHelpers` (`src/core/shared/validations/ValidationHelpers.ts`) or `expect(...)`
  in the test itself
- Reference `src/pages/DemoPage.ts` as the minimal canonical example, and `src/pages/DashboardPage.ts`
  as the canonical example of composing multiple components into one page

## Fixture Wiring (the step most often missed)
A new page object is unusable until it's registered as a fixture:
1. Add an entry to `Fixtures` type and the `test.extend<Fixtures>({...})` object in
   `src/core/runtime/fixtures/fixtures.ts`, following the existing pattern:
   `myPage: async ({ page }, use) => { await use(new MyPage(page)); }`
2. In the spec, import `{ test, expect }` from the fixtures file (path depends on the spec's depth under
   `tests/`, e.g. `../../src/core/runtime/fixtures/fixtures` from `tests/<category>/`) - **never** from
   `@playwright/test` directly, and never `new MyPage(page)` inline in a test
3. Destructure the fixture in the test signature: `async ({ myPage, page }) => { ... }`

## Test Conventions
- One `test.describe` block per page/feature, `test()` bodies kept to Arrange/Act/Assert
- Business logic and data prep belongs in the page object, a service, or `TestDataProvider`
  (`src/core/shared/helpers/TestDataProvider.ts`) / builders (`src/core/data/builders/`) - not inlined
  literals in the test
- Place the spec in the right `tests/<category>/` folder (see the Planner chatmode's category list) -
  don't invent a new top-level folder for one spec
- After generating, run it to confirm before calling the task done:
  `npx playwright test <new-spec> --project=chromium --headed`
