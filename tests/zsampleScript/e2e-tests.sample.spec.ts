import { test, expect } from '../../src/core/runtime/fixtures/fixtures';
import * as allure from 'allure-js-commons';
import { UserBuilder } from '../../src/core/data/builders/UserBuilder';
import { LoginPage } from '../../src/pages/LoginPage';
import { FilePaths } from '../../src/core/config/constants/FilePaths';

/**
 * SAMPLE 12/13: E2E Tests
 * Focus: critical-path user journeys and full workflows, driven entirely through the POM.
 * Example: signup, purchase, upload flows using POM.
 *
 * This demo app has no signup/purchase/upload flow, so the login journey stands in as the
 * critical path - the pattern (navigate -> act -> assert, entirely via page objects) is what
 * transfers to a real signup/checkout/upload flow.
 */
test.describe('Sample - E2E Tests', () => {
  test.beforeEach(async () => {
    await allure.epic('Sample Test Categories');
    await allure.feature('E2E Tests');
    await allure.severity(allure.Severity.BLOCKER);
  });

  test('critical path: a user attempts to sign in end-to-end via the POM', async ({
    loginPage,
    validationHelpers,
    page,
  }) => {
    const user = new UserBuilder().build();

    await allure.step('Land on the login page', async () => {
      await loginPage.navigate();
      expect(await loginPage.header.isLogoVisible()).toBe(true);
    });
    await allure.attachment('Login page', await page.screenshot(), allure.ContentType.PNG);

    await allure.step('Drive the entire flow through LoginPage', async () => {
      await loginPage.login(user.email, user.password);
    });

    await allure.step('Verify the journey ends in the expected state', async () => {
      await validationHelpers.verifyText(loginPage.getErrorMessageLocator(), 'Invalid');
    });
    await allure.attachment('End of journey', await page.screenshot(), allure.ContentType.PNG);
  });

  test('critical path with full video evidence attached', async ({ browser, config }) => {
    // A custom context is required here (not the default fixture `page`) because video
    // recording must be turned on per-context via `recordVideo`, and the file is only
    // finalized once that context closes - see the `authenticatedPage` fixture in
    // fixtures.ts for the same "custom context for a specific need" pattern.
    const context = await browser.newContext({
      baseURL: config.baseUrl,
      recordVideo: { dir: FilePaths.VIDEOS },
    });
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    const user = new UserBuilder().build();

    await allure.step('Run the critical-path journey with video recording on', async () => {
      await loginPage.navigate();
      await loginPage.login(user.email, user.password);
      await expect(loginPage.getErrorMessageLocator()).toBeVisible();
    });

    const video = page.video();
    await context.close(); // flushes and finalizes the video file

    if (video) {
      const videoPath = await video.path();
      await allure.attachmentPath('Critical path recording', videoPath, allure.ContentType.WEBM);
    }
  });
});
