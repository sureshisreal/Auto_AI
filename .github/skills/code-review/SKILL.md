# Code Review Skill

## Description
Reviews test files and page objects for quality, POM compliance, security, and Playwright best practices.

## What This Skill Checks
- **POM Compliance**: All selectors are in page objects, no raw selectors in specs
- **Playwright Anti-patterns**: `waitForTimeout`, brittle XPath, positional selectors, `networkidle` misuse
- **Security**: No hardcoded credentials, proper use of test data
- **Coverage**: Checks for negative tests, accessibility, and performance counterparts
- **Maintainability**: Consistent naming, proper use of fixtures

## Severity Levels
- 🔴 **Critical**: Must fix before merging
- 🟡 **Warning**: Should fix soon
- 💡 **Suggestion**: Nice to have

## Example Review Output
```markdown
# Code Review: tests/wesendcv.spec.ts
**Status:** ❌ Needs fixes before merge

## 🔴 Critical Issues
1. Raw selectors in test file (lines 45, 67)
   - Fix: Add methods to WeSendCVPage.ts
2. Hardcoded credentials (line 12)
   - Fix: Import from data/users.ts

## 🟡 Warnings
1. Missing negative tests
2. Hard sleep (line 23)
```
