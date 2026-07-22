# GitHub Copilot Instructions for Playwright AI Agent Framework

## General Guidelines
- Use TypeScript for all test files
- Follow the Page Object Model pattern for maintainable tests
- Use Playwright's built-in assertions and locators
- Prefer stable locators like `getByRole`, `getByLabel`, `getByTestId`

## Code Style
- Use ESLint and Prettier for code formatting
- Follow the existing directory structure
- Place page objects in `src/pages/` (extend `BasePage` in `src/core/ui/base/BasePage.ts`)
- Place reusable components in `src/core/ui/components/` (extend `BaseComponent`)
- Place test data in `src/core/data/testdata/` (static) or `src/core/data/builders/` (Fluent builders)
- Never assert inside a page object - use `ValidationHelpers`
  (`src/core/shared/validations/ValidationHelpers.ts`) or `expect()` in the test
- Never instantiate a page/service with `new` in a test - use the fixtures in
  `src/core/runtime/fixtures/fixtures.ts`
- Organize tests into appropriate category directories under `tests/`

## Testing Best Practices
- Include both positive and negative test cases
- Add accessibility checks where applicable
- Use visual regression testing for UI changes
- Write mobile-friendly tests with device emulation
- Use API mocking for faster and more reliable tests

## MCP & Chatmodes
- Utilize the MCP server (`mcp/mcp-server.ts`, `npm run mcp:server`) for AI-assisted test execution
- Five chatmodes in `.github/chatmodes/`: `healer` (diagnose & fix failing tests), `planner` (design test
  plans), `generator` (write specs/page objects), `api-testing` (scaffold API/contract tests),
  `manual-testing` (write manual QA checklists)
- Two auto-loaded skills in `.github/skills/` need no explicit invocation: `playwright-test-debugging`
  (loads while debugging a failing test) and `code-review` (loads when asked to review/audit test code)
