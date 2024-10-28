import { test, expect } from "@playwright/test";
import { StaticVariables } from "../utils/staticVariables";
import { LoginPage } from "../page-objects/loginPage";
import { LoginAssertionHelper } from '../helpers/loginAssertionHelper';

let loginPage: LoginPage
let loginAssertionHelper: LoginAssertionHelper

import errorMessages from "../test-data/errorMessages.json"

test.beforeEach(async ({ page }) => {
  await page.goto("/")

  loginPage = new LoginPage(page)
  loginAssertionHelper = new LoginAssertionHelper(loginPage)
});

test.describe("login", () => {
  test("should not login username with no password", async () => {
    loginPage.loginUsernameOnly("username")
    loginAssertionHelper.performAssertions(errorMessages.PasswordRequired)
  })

  test("should not login missing username with password", async () => {
    loginPage.loginPasswordOnly("password")
    loginAssertionHelper.performAssertions(errorMessages.UsernameRequired)
  })

  test("should not login inexistent user", async () => {
    loginPage.login("inexistent", "user")
    loginAssertionHelper.performAssertions(errorMessages.InexistentUser)
  })

  test("should not login locked out user", async () => {
    let lockedUser = StaticVariables.staticLockedUser
    let lockedPassword = StaticVariables.staticLockedPassword

    loginPage.login(lockedUser, lockedPassword)
    loginAssertionHelper.performAssertions(errorMessages.LockedOutUser)
  });

  test("should login standard user", async () => {
    let standardUser = StaticVariables.staticStandardUser
    let standardPassword = StaticVariables.staticStandardPassword

    loginPage.login(standardUser, standardPassword)
    await expect(loginPage.appLogo).toHaveText(loginPage.appTitle)
  })
})
