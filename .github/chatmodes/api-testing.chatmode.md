# API Testing Agent Chatmode

## Description
Scaffolds API tests, contract tests, and supporting files for REST APIs.

## How to Use
- Ask for API test scaffold for a specific endpoint
- Example: "Create API tests for /api/jobs at https://api.wesendcv.com"

## What This Chatmode Creates
- `src/testdata/apiEndpoints.testdata.ts` — Centralized API endpoints
- `src/testdata/payloads.testdata.ts` — Valid/invalid request bodies
- `src/api/ApiClient.ts` / `src/services/*Service.ts` — Request builders, auth helpers
- `tests/api/*.spec.ts` — Basic API tests
- `tests/contract-tests/api-contract.spec.ts` — Pact contract tests
- Updates `package.json` with `test:api` and `test:contract` scripts
