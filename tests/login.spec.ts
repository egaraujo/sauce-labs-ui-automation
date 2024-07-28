import { test, expect } from "@playwright/test";
import { LoginPage } from "../page-objects/loginPage";
import { StaticVariables } from "../utils/staticVariables";

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('login', () => {

  test('username, no password', async ({ page }) => {
    await page.getByPlaceholder('Username').fill('username');
    await page.getByRole('button', { name: 'Login' }).click();

    let loginPage = new LoginPage(page)
    loginPage.assertLoginErrors('Password is required')
  });

  test('password, no username', async ({ page }) => {
    await page.getByPlaceholder('Password').fill('password');
    await page.getByRole('button', { name: 'Login' }).click();

    let loginPage = new LoginPage(page)
    loginPage.assertLoginErrors('Epic sadface: Username is required')
  });

  test('inexistent user', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.login('inexistent', 'user')

    loginPage.assertLoginErrors(
      'Epic sadface: Username and password do not match any user in this service'
    )
  });

  test('locked out user', async ({ page }) => {
    let lockedUser = StaticVariables.staticLockedUser
    let lockedPassword = StaticVariables.staticLockedPassword

    const loginPage = new LoginPage(page)
    await loginPage.login(lockedUser, lockedPassword)

    loginPage.assertLoginErrors('Epic sadface: Sorry, this user has been locked out.')
  });

  test('standard user', async ({ page }) => {
    let standardUser = StaticVariables.staticStandardUser
    let standardPassword = StaticVariables.staticStandardPassword

    const loginPage = new LoginPage(page)
    await loginPage.login(standardUser, standardPassword)

    await expect(page.locator('div.app_logo')).toHaveText('Swag Labs');
  });

});
