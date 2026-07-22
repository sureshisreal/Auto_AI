# API Testing Agent Chatmode

## Description
Scaffolds API tests, contract tests, and supporting files for REST APIs, reusing this repo's existing
`ApiClient`/service layer instead of writing raw `fetch`/`request` calls per test.

## How to Use
- Ask for API test scaffold for a specific endpoint
- Example: "Create API tests for /api/jobs at https://api.wesendcv.com"

## Existing Building Blocks - Extend These, Don't Duplicate
- `src/core/api/ApiClient.ts` — GET/POST/PUT/PATCH/DELETE wrapper with built-in status/JSON assertions;
  every new API call should go through this, not a raw `request.get(...)`
- `src/core/api/services/AuthService.ts`, `JobService.ts` — the pattern to follow: a service class wraps
  `ApiClient` with domain-specific methods (e.g. `login()`, `createJob()`); add new domains the same way
  (`src/core/api/services/<Domain>Service.ts`)
- `src/core/api/database/DatabaseClientFactory.create(DatabaseType.<X>, options)` — optional DB-level
  assertions (Postgres/MySQL/MsSql/Oracle). None of the four driver packages (`pg`, `mysql2`, `mssql`,
  `oracledb`) are installed by default - only add the one actually needed, and expect a
  `DatabaseError` naming the missing package if it's forgotten

## What This Chatmode Creates
- `src/core/data/testdata/apiEndpoints.testdata.ts` — Centralized API endpoints (extend, don't
  hardcode a URL inline in a test)
- `src/core/data/testdata/payloads.testdata.ts` — Valid/invalid request bodies
- `src/core/api/services/*Service.ts` — Domain service classes wrapping `ApiClient` (see AuthService/JobService)
- `tests/api/*.spec.ts` — Basic API tests
- `tests/contract-tests/api-contract.spec.ts` — Pact contract tests (`@pact-foundation/pact`)
- `tests/mock-tests/` — Playwright route-mocked (`page.route`) variants when a real backend call would
  be slow/flaky - prefer this for edge cases the real API can't easily produce on demand
- Updates `package.json` with `test:api` and `test:contract` scripts if they don't already exist
  (they currently do: `npm run test:api`, `npm run test:contract`)

## Fixture Wiring
New services need a fixture entry in `src/core/runtime/fixtures/fixtures.ts`, following the existing
`apiClient`/`wesendcvApiClient`/`authService`/`jobService` pattern, so tests destructure the service
(`async ({ jobService }) => ...`) instead of instantiating it inline. Base URL always comes from
`Config.apiBaseUrl` (`src/core/config/Config.ts`) or a dedicated URL in `urls.testdata.ts` - never a
hardcoded string.
