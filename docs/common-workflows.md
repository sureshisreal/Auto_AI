# QA Automation Framework — Common Workflows

This section shows how to combine agents to accomplish realistic testing tasks.

---

## Workflow 1: Test New Feature From Scratch
### Scenario
Your team built a new CV Upload feature. You need to create comprehensive tests before shipping to production.

### Steps
1. **Plan the tests (use Planner)**  
   ```
   @planner Create a test plan for the CV upload feature at `https://wesendcv.com/upload`
   ```
   → Outputs: `specs/cv-upload-plan.md` with 8-12 test scenarios

2. **Generate test code (use Generator)**  
   ```
   @generator Generate Playwright tests from specs/cv-upload-plan.md
   ```
   → Outputs: `tests/integration-tests/cv-upload.spec.ts` + Page Object + Test Data

3. **Review generated code (use Code Reviewer)**  
   ```
   @code-reviewer Review tests/integration-tests/cv-upload.spec.ts for POM compliance and coverage
   ```
   → Outputs: Review report with suggestions (usually minimal for generated code)

4. **Run tests locally**  
   ```bash
   npm run test:headed tests/integration-tests/cv-upload.spec.ts
   ```

5. **Add API tests (use API Testing Agent)**  
   ```
   @api-testing Scaffold API tests for the /api/upload endpoint
   ```
   → Outputs: `tests/unit-tests/api.spec.ts` + Contract tests

6. **Final review (use Code Reviewer again)**  
   ```
   @code-reviewer Audit tests/integration-tests/cv-upload.spec.ts and tests/unit-tests/api.spec.ts before shipping
   ```

### Timeline
30-45 minutes per feature (instead of 2-3 hours of manual test writing)

---

## Workflow 2: Debug & Fix Failing Tests in CI
### Scenario
Your tests were passing locally, but CI broke them after a deployment. You need to diagnose and fix ASAP.

### Steps
1. **View CI failure (GitHub Actions)**  
   - Click the failed test run in GitHub
   - See error: "Timeout waiting for selector 'button[name="submit"]'"

2. **Use Healer to diagnose & fix**  
   ```
   @healer The upload form tests are timing out in CI on tests/integration-tests/cv-upload.spec.ts
   ```
   → **Healer does**:
     - Runs the test locally
     - Takes screenshot of current page state
     - Identifies selector moved to `button[data-testid="submit"]`
     - Automatically updates Page Object with new selector
     - Reruns test: ✅ PASSES
     - Reports: "Fixed selector in WeSendCVPage.ts (line 92)"

3. **Verify the fix**  
   ```bash
   npm test tests/integration-tests/cv-upload.spec.ts
   ```

4. **Commit & push**  
   ```bash
   git add tests/pages/WeSendCVPage.ts
   git commit -m "Fix: Update CV upload selector for new DOM structure"
   git push
   ```

### Timeline
5-10 minutes (instead of 30-60 minutes of manual debugging)

---

## Workflow 3: Add Missing Test Coverage
### Scenario
Code review feedback: "Your tests only cover the happy path. Add edge cases and error scenarios."

### Steps
1. **Get code review feedback (use Code Reviewer)**  
   ```
   @code-reviewer Check tests/integration-tests/cv-upload.spec.ts for coverage gaps
   ```
   → Reports: "Missing 4 edge case tests: invalid file type, file too large, network timeout, server error"

2. **Ask Planner for edge case scenarios (use Planner)**  
   ```
   @planner What are the edge cases and error flows for CV file upload?
   ```
   → Outputs: `specs/cv-upload-edge-cases.md` with 5-7 error scenarios

3. **Generate the missing tests (use Generator)**  
   ```
   @generator Generate tests for the edge cases in specs/cv-upload-edge-cases.md and add to tests/integration-tests/cv-upload.spec.ts
   ```
   → Appends new test cases to existing spec file

4. **Review coverage again (use Code Reviewer)**  
   ```
   @code-reviewer Review tests/integration-tests/cv-upload.spec.ts - is coverage now complete?
   ```
   → Reports: "✅ Good coverage. Happy path + 5 edge cases + 2 error scenarios"

5. **Run full test suite**  
   ```bash
   npm test tests/integration-tests/
   ```

### Timeline
15-20 minutes

---

## Workflow 4: Security & Accessibility Audit Before Release
### Scenario
You're shipping to production. Ensure your tests cover security and accessibility requirements.

### Steps
1. **Get security review (use Code Reviewer)**  
   ```
   @code-reviewer Review tests/security-tests/ and tests/authentication/ - are we covering OWASP Top 10?
   ```
   → Reports: "Missing tests for: CSRF protection, XSS payloads, SQL injection attempt, API rate limiting"

2. **Generate security tests (use Planner + Generator)**  
   ```
   @planner What are the top security scenarios for a job application platform?
   ```
   Then:
   ```
   @generator Generate security tests from specs/security-scenarios.md
   ```
   → Outputs: Enhanced `tests/security-tests/` with new attack scenarios

3. **Get accessibility review (use Code Reviewer)**  
   ```
   @code-reviewer Do our tests cover WCAG 2.1 Level AA accessibility? Check tests/accessibility/
   ```
   → Reports: "Missing: Color contrast verification, focus management in modals, ARIA label validation"

4. **Generate a11y tests (use Generator)**  
   ```
   @generator Create accessibility tests for keyboard navigation, screen reader support, and color contrast in tests/accessibility/
   ```

5. **Run security + a11y tests**  
   ```bash
   npx playwright test tests/security-tests/ tests/accessibility/
   ```

6. **Final audit (use Code Reviewer)**  
   ```
   @code-reviewer Perform final audit of all tests before production release - check coverage, security, a11y
   ```

### Timeline
1-2 hours (comprehensive security + a11y coverage)

---

## Workflow 5: Create Manual Testing Guide for QA Team
### Scenario
You need to hand off testing to a QA team that prefers manual checklists for exploratory testing.

### Steps
1. **Generate manual checklist (use Manual Testing Chatmode)**  
   ```
   @manualtesting Create a comprehensive manual test checklist for `https://wesendcv.com`
   ```
   → Outputs: Detailed checklist with:
     - Page sections to test
     - Step-by-step procedures
     - Expected results
     - Edge cases
     - Browser/device matrix

2. **Export as PDF or share**
   - Copy checklist to team wiki/Confluence
   - Or save as PDF for offline testing

3. **Share with QA team**
   - Slack: "Manual test checklist ready in #qa-testing"
   - Jira: Link to shared document

4. **Combine with automated tests**
   ```
   @manualtesting Create a manual regression checklist that complements our automated test suite
   ```
   → Focuses on exploratory testing, UX validation, and edge cases that automation may miss

### Timeline
10-15 minutes per feature

---

## Workflow 6: Batch Process: Review & Fix Multiple Test Files
### Scenario
You have 5 test files that need refactoring for POM compliance. You want to fix them all at once.

### Steps
1. **Audit all test files**  
   ```
   @code-reviewer Audit all test files in tests/integration-tests/ and tests/security-tests/ for POM compliance and best practices
   ```
   → Reports: Aggregated review of all files with priorities

2. **Ask Healer to apply fixes**  
   ```
   @code-reviewer You identified these issues [paste list]. Can you fix them across all files?
   ```
   → **Healer applies fixes**:
     - Moves inline selectors to Page Objects
     - Extracts hardcoded test data to `tests/data/`
     - Replaces anti-patterns
     - Reruns all tests to verify

3. **Verify all tests pass**  
   ```bash
   npm test tests/integration-tests/ tests/security-tests/
   ```

4. **Commit batch changes**  
   ```bash
   git add tests/
   git commit -m "Refactor: POM compliance across integration & security tests"
   git push
   ```

### Timeline
20-30 minutes for 5+ files (instead of 2-3 hours manual refactoring)

---

## Workflow 7: API Contract Testing for Microservices
### Scenario
Your team has multiple APIs. You need to ensure frontend tests will work with backend APIs (consumer-driven contract testing).

### Steps
1. **Scaffold contract tests (use API Testing Agent)**  
   ```
   @api-testing Create Pact consumer-driven contract tests for our APIs:
   - /api/jobs (list, get, create)
   - /api/users (login, profile, logout)
   - /api/uploads (post file)
   ```
   → Outputs: `tests/contract-tests/` with Pact setup

2. **Generate API interaction tests (use Generator)**  
   ```
   @generator Write integration tests that invoke these API endpoints and validate responses
   ```
   → Outputs: `tests/unit-tests/api.spec.ts` with full coverage

3. **Run contract tests**  
   ```bash
   npm run test:contract
   ```
   → Generates `pacts/` contract files for backend validation

4. **Share contracts with backend team**
   - Contracts in `pacts/` are human-readable JSON
   - Backend team uses Pact verification to ensure their changes don't break frontend

### Timeline
30-45 minutes to set up contract testing for 3+ APIs

---

## Using Agents with the MCP Flow
For fully programmatic agent usage (no VS Code UI), start the Playwright MCP server and send chatmode prompts via API:
```bash
# Start MCP server
npx playwright run-test-mcp-server

# Or add as an npm script
npm set-script mcp:start "npx playwright run-test-mcp-server"
npm run mcp:start
```

The `.vscode/mcp.json` file pre-configures the MCP entrypoint for VS Code's agent runtime.

---

## Skills vs Chatmodes vs Custom Instructions
| Feature | Purpose | Location | When to Use |
|---------|---------|----------|-------------|
| Agent Skills | Contextual instructions auto-loaded when relevant | `.github/skills/` | Complex workflows, debugging guides, repo-specific patterns |
| Chatmodes | Role-based agent personas with dedicated toolsets | `.github/chatmodes/` | Healer, Planner, Generator, API, Manual, Code Reviewer — explicit invocation |
| Custom Instructions | Global rules applied to every Copilot interaction | `.github/copilot-instructions.md` | Coding standards, architecture rules, project conventions |

### Skills registered in this repo
| Skill | File | Auto-triggered when… |
|-------|------|---------------------|
| 🛠️ playwright-test-debugging | `.github/skills/playwright-test-debugging/SKILL.md` | Debugging or fixing a failing test |
| 📐 code-review | `.github/skills/code-review/SKILL.md` | Reviewing, auditing, or inspecting test code |
