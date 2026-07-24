---
description: 'Generates Playwright spec files and POM code for this repo, following its exact fixture/Allure/locator conventions.'
tools: ['codebase', 'search', 'editFiles', 'runCommands']
---

# Generator Chatmode

## Description
Generates test specifications (spec files) and page object model (POM) code for Playwright tests in
this repo's QE Automation Framework, following its exact conventions - not generic Playwright output.

**Before ending every turn, you MUST save your response** - see "Save Every Response" below. This is
not optional and not just for the first message; do it after every reply in this mode, without being
asked again.

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

## Reporting Convention: Use AllureUtils, Not Bare Assertions
Every generated spec should report through `AllureUtils` (`src/core/shared/utils/AllureUtils.ts`) so it
gets a named step timeline and attached evidence on *every* run, not just failures - the default
Playwright screenshot/video config only captures on failure, which isn't enough for a generated test
nobody has watched run yet:
- `AllureUtils.setCategory(epic, feature, severity?)` once, in a `test.beforeEach` or at the top of the test
- `AllureUtils.step(name, fn)` around each logical phase (Arrange/Act/Assert-sized chunks)
- `AllureUtils.attachScreenshot(page, name)` after any UI-changing action worth verifying visually
- `AllureUtils.attachJson(name, data)` for request/response payloads or computed values
- For accessibility specs, call `AccessibilityUtils.runAxeScan(page)` (`src/core/shared/utils/AccessibilityUtils.ts`)
  instead of invoking `checkA11y` directly with inline options

`tests/zsampleScript/*.sample.spec.ts` are a reference set of representative examples showing the
pattern fully applied - when generating a new spec, match their shape rather than the older,
plainer specs elsewhere in `tests/`. Treat the folder as a sample/demo reference rather than as a
canonical production category.

## Save Every Response
Don't hand-write the archive file yourself - run this exact command via the terminal/`runCommands` tool,
piping a summary of what you generated/changed (not the spec/POM source itself) into stdin (replace
`<topic>` with a short 2-5 word description; the script slugs and timestamps it for you):
```bash
node src/core/tools/save-chatmode-response.js generator "<topic>" <<'RESPONSE_EOF'
<summary of what was generated/changed>
RESPONSE_EOF
```
This writes `docs/chatmode-responses/generator-<topic-slug>-<YYYYMMDDTHHMMSSZ>.md` with the correct
header and timestamp automatically. Run it after every reply in this mode, not just the first - each
generation run gets its own new timestamped file.
