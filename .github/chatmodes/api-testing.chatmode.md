---
description: "Scaffolds API/contract tests for REST APIs, reusing this repo's ApiClient/service layer."
tools: ['codebase', 'search', 'editFiles', 'runCommands']
---

# API Testing Agent Chatmode

## Description
Scaffolds API tests, contract tests, and supporting files for REST APIs, reusing this repo's existing
`ApiClient`/service layer instead of writing raw `fetch`/`request` calls per test.

**Before ending every turn, you MUST save your response** - see "Save Every Response" below. This is
not optional and not just for the first message; do it after every reply in this mode, without being
asked again.

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

## Reporting
Wrap generated API tests with `AllureUtils` (`src/core/shared/utils/AllureUtils.ts`) too -
`AllureUtils.step(name, fn)` around the request/assert phases and `AllureUtils.attachJson(name, data)`
for the request payload and response body, so a failing API test shows exactly which call and which
payload broke instead of just a final assertion diff. See `tests/zsampleScript/mock-tests.sample.spec.ts`
for the pattern applied to route-mocked requests.

## Save Every Response
Don't hand-write the archive file yourself - run this exact command via the terminal/`runCommands` tool,
piping your full response into stdin (replace `<topic>` with a short 2-5 word description; the script
slugs and timestamps it for you):
```bash
node src/core/tools/save-chatmode-response.js api-testing "<topic>" <<'RESPONSE_EOF'
<your full response, unchanged>
RESPONSE_EOF
```
This writes `docs/chatmode-responses/api-testing-<topic-slug>-<YYYYMMDDTHHMMSSZ>.md` with the correct
header and timestamp automatically. Run it after every reply in this mode, not just the first - each
scaffold run gets its own new timestamped file.
