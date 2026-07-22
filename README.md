# QE Automation Framework

An enterprise-grade, TypeScript Playwright Test framework featuring:
- **Page Object Model (POM) + Component Object Model (COM)**: For maintainable, scalable UI automation
- **Dependency-Injected Fixtures**: Automatically inject pages, services, and helpers into tests
- **Environment-Driven Config**: Multi-environment support via `.env.qa`, `.env.stage`, `.env.uat`, `.env.prod`
- **Advanced Reporting**: Playwright HTML, Allure, JUnit, and custom reporting with screenshots/videos/traces on failure
- **Winston Logging**: Daily rotating logs, console output (dev only), and structured logging
- **AI-Powered Development**: Built-in chatmodes for planning, generation, healing, and review (see [docs/ai-agents.md](file:///Users/sureshbabuisreal/Documents/PersonalGithub/Playwright_aI/docs/ai-agents.md))

## Table of Contents
- [Architecture](#architecture)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Step 1: Install Dependencies](#step-1-install-dependencies)
  - [Step 2: Configure Environment](#step-2-configure-environment)
  - [Step 3: Install Browsers](#step-3-install-browsers)
  - [Step 4: Run Your First Tests](#step-4-run-your-first-tests)
- [Core Concepts](#core-concepts)
- [Running Tests](#running-tests)
  - [Test Categories](#test-categories)
  - [Browser & Environment Selection](#browser--environment-selection)
  - [Debugging Modes](#debugging-modes)
- [How-To Guides](#how-to-guides)
  - [How to Add a New Page Object](#how-to-add-a-new-page-object)
  - [How to Add a New Component](#how-to-add-a-new-component)
  - [How to Add a New Test](#how-to-add-a-new-test)
  - [How to Add a New Environment](#how-to-add-a-new-environment)
  - [How to Use the API Client](#how-to-use-the-api-client)
- [Reporting & Logging](#reporting--logging)
- [Coding Standards](#coding-standards)
- [CI/CD](#cicd)
- [Troubleshooting](#troubleshooting)

---

## Architecture
```mermaid
flowchart TD
    T[Test *.spec.ts] -->|destructures fixtures, never `new`s a page| F[tests/fixtures/*.ts]
    F --> P[Page Objects\nsrc/pages]
    F --> CFG[Config singleton\nconfig/env.config.ts]
    F --> LOG[Winston Logger\nsrc/utils/logging]
    P --> CORE[Core Wrappers\nsrc/core]
    CORE --> PW[Playwright Page/Locator API]
    CFG --> ENV[.env.qa / .env.stage / .env.uat / .env.prod]
```
**Rule of Thumb**:
- Tests only: `Arrange → Act → Assert` using fixtures
- Page Objects only: Locators, Actions, Navigation
- Assertions: In tests or custom assertions
- Components: Reusable UI patterns across pages

---

## Folder Structure
| Path | Purpose |
|------|---------|
| `.github/workflows/` | CI/CD pipelines (PR checks, regression) |
| `config/` | Environment config and Playwright config |
| `src/api/clients/` | API client wrappers (e.g., `auth.api.ts`) |
| `src/api/payload-factories/` | Reusable API payload builders |
| `src/core/` | Base classes: `base.page.ts`, `base.api.ts`, `custom.assertions.ts`, `wait.helpers.ts` |
| `src/pages/components/` | Reusable UI components (Navbar, Table, Modal, etc.) |
| `src/pages/auth/` | Authentication page objects |
| `src/pages/dashboard/` | Dashboard and home page objects |
| `src/test-data/constants/` | Enums and constants: Timeouts, Messages, EnvKeys, etc. |
| `src/test-data/json/` | Static test data in JSON format |
| `src/test-data/factories/` | Dynamic test data builders (Faker) |
| `src/utils/ai/` | AI agent helpers (page indexer, visual diffs) |
| `src/utils/database/` | Optional multi-database clients (Postgres/MySQL/MsSql/Oracle) |
| `src/utils/logging/` | Winston logger |
| `src/utils/reporting/` | Allure/Playwright reporting helpers |
| `tests/smoke/` | Critical path smoke tests |
| `tests/sanity/` | Quick sanity checks for PRs |
| `tests/regression/` | Full regression suite |
| `tests/api/` | API tests |
| `tests/e2e/` | End-to-end user flows |
| `tests/visual/` | Visual regression tests |
| `tests/fixtures/` | Dependency-injected test fixtures |
| `reports/` | Generated test reports (gitignored) |
| `screenshots/` | Screenshots on failure (gitignored) |
| `videos/` | Videos on failure (gitignored) |
| `traces/` | Playwright traces on failure (gitignored) |
| `logs/` | Winston logs (gitignored) |

---

## Prerequisites
| Tool | Required Version |
|------|-------------------|
| Node.js | 18+ |
| npm | 9+ |
| Git | Latest |

---

## Getting Started

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment
1. Copy the example environment file to your target environment:
   ```bash
   cp .env.example .env.qa
   ```
2. Update `.env.qa` with your environment's URLs, credentials, and settings:
   ```env
   ENVIRONMENT=qa
   BASE_URL=http://127.0.0.1:3000
   API_BASE_URL=http://127.0.0.1:3000/api
   ADMIN_USERNAME=admin@example.com
   ADMIN_PASSWORD=AdminPass123!
   HEADLESS=true
   PARALLEL_WORKERS=4
   RETRIES=2
   ```

### Step 3: Install Browsers
```bash
npm run install:browsers
```

### Step 4: Run Your First Tests
The framework includes a local demo app for quick validation! Just run:
```bash
npm test
```
This will automatically start `tools/dev-server.js` and serve the `demo/` app at `http://127.0.0.1:3000`.

---

## Core Concepts

### Fixtures
Fixtures are the only way tests should get access to page objects, services, and helpers! No manual `new` keyword in tests!

**Sample Fixture (`tests/fixtures/page.fixture.ts`)**:
```typescript
import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/auth/login.page';

type PageFixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});
```

---

## Running Tests

### Test Categories
| Command | What it runs |
|---------|--------------|
| `npm test` | All tests across all browsers |
| `npm run test:smoke` | Critical path smoke tests |
| `npm run test:sanity` | Quick PR sanity checks |
| `npm run test:regression` | Full regression suite |
| `npm run test:api` | API-only tests |
| `npm run test:e2e` | End-to-end user flows |

### Browser & Environment Selection
| Command | Effect |
|---------|--------|
| `npx playwright test --project=chromium` | Run tests only in Chromium |
| `ENVIRONMENT=stage npm test` | Use `.env.stage` config |

### Debugging Modes
| Mode | Command |
|------|---------|
| Headed (Visible Browser) | `npm run test:headed` |
| Playwright Debugger | `npm run test:debug` |
| Playwright UI Mode | `npm run test:ui` |

---

## How-To Guides

### How to Add a New Page Object
1. Create a new file in `src/pages/<feature>/`:
   ```typescript
   // src/pages/checkout/checkout.page.ts
   import { Page, Locator } from '@playwright/test';
   import { BasePage } from '@core/base.page';

   export class CheckoutPage extends BasePage {
     private cartItem: Locator;
     private checkoutButton: Locator;

     constructor(page: Page) {
       super(page);
       this.cartItem = this.page.getByTestId('cart-item');
       this.checkoutButton = this.page.getByRole('button', { name: 'Checkout' });
     }

     async navigate(): Promise<void> {
       await this.navigateTo('/checkout');
     }

     async clickCheckout(): Promise<void> {
       await this.click(this.checkoutButton);
     }
   }
   ```
2. Add a fixture for it in `tests/fixtures/page.fixture.ts`
3. Use it in a test:
   ```typescript
   import { test, expect } from '@tests/fixtures/test.fixture';

   test('checkout flow', async ({ checkoutPage }) => {
     await checkoutPage.navigate();
     await checkoutPage.clickCheckout();
   });
   ```

### How to Add a New Component
Components are reusable UI patterns across pages!
1. Create `src/pages/components/modal.component.ts`:
   ```typescript
   import { Page, Locator } from '@playwright/test';
   import { BaseComponent } from '@core/base.component';

   export class ModalComponent extends BaseComponent {
     private confirmButton: Locator;

     constructor(page: Page, rootSelector: string) {
       super(page, rootSelector);
       this.confirmButton = this.rootLocator.getByRole('button', { name: 'Confirm' });
     }

     async confirm(): Promise<void> {
       await this.click(this.confirmButton);
     }
   }
   ```
2. Use it in a page object:
   ```typescript
   this.modal = new ModalComponent(this.page, '[data-testid="checkout-modal"]');
   ```

### How to Add a New Test
1. Create a new test in the appropriate `tests/<category>/` folder
2. Use fixtures for all dependencies:
   ```typescript
   import { test, expect } from '@tests/fixtures/test.fixture';

   test.describe('Login', () => {
     test('valid credentials should login successfully', async ({
       loginPage,
       validationHelpers,
       config,
     }) => {
       // Arrange
       await loginPage.navigate();

       // Act
       await loginPage.login(config.adminUsername, config.adminPassword);

       // Assert
       await validationHelpers.verifyUrl(/\/dashboard/);
     });
   });
   ```

### How to Add a New Environment
1. Create a new `.env.<name>` file (e.g., `.env.preprod`)
2. (Optional) Add the environment to `Environment` enum in `src/test-data/constants/Environment.ts`
3. Run with `ENVIRONMENT=<name> npm test`

### How to Use the API Client
1. Import from `src/api/clients/` or use the `apiClient` fixture:
   ```typescript
   import { test, expect } from '@tests/fixtures/test.fixture';

   test('get users list', async ({ apiClient }) => {
     const response = await apiClient.get('/users');
     await apiClient.expectStatus(response, 200);
     const users = await apiClient.getJson<User[]>(response);
     expect(users.length).toBeGreaterThan(0);
   });
   ```

---

## Reporting & Logging
| Report Type | Location/Command |
|-------------|-------------------|
| Playwright HTML | `reports/playwright-report/`, open with `npx playwright show-report reports/playwright-report` |
| Allure | Generate: `npm run allure:generate`, Open: `npm run allure:open`, Serve: `npm run allure:serve` |
| JUnit | `reports/junit.xml` |
| JSON | `reports/test-results.json` |
| Logs | `logs/app-<date>.log` (info+) and `logs/error.log` (errors only) |

---

## Coding Standards
| Rule | Details |
|------|---------|
| No Duplication | All Playwright actions go through `BasePage` |
| No Assertions in Pages | Assertions only in tests or `CustomAssertions` |
| No Hardcoded Values | Use `config/` or `src/test-data/constants/` |
| No Manual Instantiation | Use fixtures to get dependencies in tests |
| Locator Strategy | Prefer `getByRole` > `getByLabel` > `getByPlaceholder` > `getByText` > `getByTestId`; avoid CSS; *never* use XPath |
| No `console.log` | Use `Logger.info/debug/warn/error` instead |

---

## CI/CD
- **PR Checks**: `.github/workflows/pr-checks.yml` - runs lint + sanity tests on every PR
- **Regression**: `.github/workflows/regression.yml` - scheduled full regression runs
- **Artifacts**: Reports, screenshots, videos, traces are uploaded as artifacts on failure

---

## Troubleshooting
| Issue | Solution |
|-------|----------|
| Failing Test | Check `reports/playwright-report/` first (screenshots/videos/traces + logs) |
| Debugging | Use `npm run test:debug` or `npm run test:ui` |
| Browser Issues | `npm run install:browsers` |
| AI Agents | See [docs/ai-agents.md](file:///Users/sureshbabuisreal/Documents/PersonalGithub/Playwright_aI/docs/ai-agents.md) for planner/generator/healer/reviewer chatmodes |

---

## License
MIT
