# GitHub Copilot Instructions for Playwright AI Agent Framework

## General Guidelines
- Use TypeScript for all test files
- Follow the Page Object Model pattern for maintainable tests
- Use Playwright's built-in assertions and locators
- Prefer stable locators like `getByRole`, `getByLabel`, `getByTestId`

## Code Style
- Use ESLint and Prettier for code formatting
- Follow the existing directory structure
- Place page objects in `tests/pages/`
- Place test data in `tests/data/`
- Organize tests into appropriate category directories under `tests/`

## Testing Best Practices
- Include both positive and negative test cases
- Add accessibility checks where applicable
- Use visual regression testing for UI changes
- Write mobile-friendly tests with device emulation
- Use API mocking for faster and more reliable tests

## MCP & Chatmodes
- Utilize the MCP server for AI-assisted test execution
- Use the planner chatmode to design test suites
- Use the healer chatmode to diagnose and fix test failures
