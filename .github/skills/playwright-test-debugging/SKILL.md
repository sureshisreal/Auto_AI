# Playwright Test Debugging Skill

## Description
A systematic debugging workflow for Playwright tests, helping diagnose and fix test failures quickly.

## Steps to Use This Skill
1. **Check Test Artifacts**: Look at screenshots, videos, and traces in `test-results/`
2. **Review Test Code**: Verify selectors, waits, and assertions
3. **Run in Headed Mode**: Use `--headed` to see the test execution
4. **Use Playwright Inspector**: Run with `--debug` to step through the test
5. **Check Network Logs**: Inspect API calls and responses
6. **Validate Page Object Model**: Ensure locators and methods are correct

## Common Issues & Fixes
- **Flaky Tests**: Add proper waits, use stable locators
- **Selector Failures**: Prefer `getByRole`, `getByLabel`, avoid brittle selectors
- **Timing Issues**: Use `waitFor`, avoid hard-coded `sleep`

## Example Debug Workflow
```bash
# Run test with debug mode
npx playwright test tests/wesendcv.spec.ts --debug

# Run in headed mode for specific browser
npx playwright test tests/vibe.spec.ts --headed --project=chromium
```
