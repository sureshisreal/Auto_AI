# AI Agents & Skills

## Benefits of Page Object Model (POM)
- **Isolation**: Tests don't know about selectors or implementation details
- **Reusability**: Page methods shared across multiple test specs
- **Maintainability**: Update selectors in one place, all tests benefit
- **Scalability**: Easy to add new page objects and test data as the suite grows

## AI Agents — Chatmodes & Skills
This repository ships with **five** AI agent chatmodes and **two** agent skills that power GitHub Copilot,
VS Code agent mode, and any MCP-compatible LLM to automate test planning, generation, debugging, code
review, and manual testing guidance. Chatmodes are personas you switch into (dropdown or `@mention`);
skills are behavior Copilot applies automatically based on what you're doing - there's no "Code Reviewer
chatmode" to switch into, code review is a skill (see table below).

### Agent Overview
| Agent               | File                                                                 | Best for                                  |
|---------------------|----------------------------------------------------------------------|-------------------------------------------|
| 🩺 Healer           | `.github/chatmodes/healer.chatmode.md`                               | Debug & auto-fix failing tests            |
| 📋 Planner          | `.github/chatmodes/planner.chatmode.md`                              | Generate a full test plan for any URL     |
| ⚙️ Generator        | `.github/chatmodes/generator.chatmode.md`                            | Write automated Playwright test specs     |
| 🔌 API Testing      | `.github/chatmodes/api-testing.chatmode.md`                          | Scaffold API & Pact contract tests        |
| 📝 Manual Testing   | `.github/chatmodes/manual-testing.chatmode.md`                       | Step-by-step manual test checklists       |
| 🛠️ Debug Skill      | `.github/skills/playwright-test-debugging/SKILL.md` *(auto-loaded)*  | Copilot auto-loads when debugging tests   |
| 📐 Review Skill     | `.github/skills/code-review/SKILL.md` *(auto-loaded)*                | Copilot auto-loads when reviewing or auditing test code |

## Quick Usage
1. Open Copilot Chat (Ctrl+Alt+I on Windows/Linux, Cmd+Alt+I on macOS)
2. Switch to the desired agent mode from the dropdown (e.g., healer, planner)
3. Type your request

### Example Prompts
| Goal | Example Prompt |
|------|----------------|
| Fix a failing test | `Fix the failing smoke test in tests/wesendcv.spec.ts` |
| Generate a test plan | `Create a test plan for https://wesendcv.com` |
| Write a test spec | `Generate tests from specs/plan.md` |
| Create API/contract tests | `Scaffold API tests for the /api/jobs endpoint` |
| Get a manual test checklist | `Give me a manual test checklist for the login page` |
| Review test code quality | `Review tests/wesendcv.spec.ts for POM compliance and security` |

> **Tip**: All agents follow the POM conventions in this repo — they write page objects to `src/pages/`,
> components to `src/core/ui/components/`, and test data to `src/core/data/testdata/` automatically!

## How to Activate an Agent in VS Code
### Step-by-Step Guide
#### Via Copilot Chat Panel:
- Press Ctrl+Alt+I (Windows/Linux) or Cmd+Alt+I (macOS) to open Copilot Chat
- Look for the agent/chatmode selector dropdown at the top of the chat panel
- Click the dropdown to see all available chatmodes
- Select the chatmode you want
- Type your request and send

#### Via Command Palette:
- Press Ctrl+Shift+P (Windows/Linux) or Cmd+Shift+P (macOS)
- Type "GitHub Copilot: Open Chat"
- In the chat panel, select your desired chatmode
- Start typing your request

#### Quick Mention Syntax:
You can also prefix your message with @ to invoke an agent:
```
@healer Fix the failing test in tests/wesendcv.spec.ts
@planner Create a test plan for https://example.com
@generator Write a Playwright test spec for the WeSendCV login page
@api-testing Create API tests for /api/jobs
@manual-testing Give a manual testing checklist for the login page
```
Skills don't get an `@mention` - just ask a normal question ("review tests/wesendcv.spec.ts for POM
compliance") and Copilot loads the matching skill automatically.

## 🩺 Healer Agent — Auto-fix Failing Tests
### When to use
A test is failing and you want Copilot to diagnose and fix it without manual intervention.

### What it does
- Runs failing tests
- Takes a browser snapshot to see the current page state
- Analyses selectors, timing, assertions, and data issues
- Edits Page Object files and test specs to fix the root cause
- Reruns the test to verify the fix
- If unable to fix, marks it `test.fixme()` with a comment

### Example Workflow
1. User: "The smoke test in tests/wesendcv.spec.ts is failing on CI."
2. Healer:
   - Finds failure: Timeout waiting for 'text=Sign Up'
   - Updates selector in WeSendCVPage.ts
   - Reruns test: passes

## 📋 Planner Agent — Generate Test Plans
### When to use
You need a comprehensive test plan for a page/feature before writing code.

### What it does
- Explores all interactive elements, forms, navigation
- Maps user journeys (happy, edge, error)
- Saves a detailed markdown test plan

## ⚙️ Generator Agent — Write Test Specs
### When to use
You have a test plan and want to turn it into Playwright specs.

### What it does
- Reads the test plan
- Writes complete test files following POM conventions

## 🔌 API Testing Agent
### When to use
You need to create API tests or Pact contracts.

### What it does
- Scaffolds API and contract tests
- Builds API helpers
- Creates test data files

## 📝 Manual Testing Agent
### When to use
You need a manual test checklist.

### What it does
- Generates step-by-step checklists with expected results

## 🛠️ Debug Skill (auto-loaded, not a chatmode)
### When it loads
Automatically, whenever you're debugging a failing test - no dropdown switch or `@mention` needed.

### What it does
- Walks a fixed sequence: check artifacts in `test-results/`, review selectors/waits/assertions, re-run
  `--headed`, re-run `--debug`, check network logs, validate the Page Object Model
- Points you at the same commands used elsewhere in this repo: `npx playwright test <spec> --debug`,
  `npx playwright test <spec> --headed --project=chromium`

## 📐 Review Skill (auto-loaded, not a chatmode)
### When it loads
Automatically, whenever you ask Copilot to review or audit test code.

### What it does
- Checks POM compliance (no raw selectors in specs), Playwright anti-patterns (`waitForTimeout`, brittle
  XPath, positional selectors, `networkidle` misuse), hardcoded credentials, and missing
  negative/accessibility/performance coverage
- Reports findings graded 🔴 Critical / 🟡 Warning / 💡 Suggestion, each with a concrete fix
