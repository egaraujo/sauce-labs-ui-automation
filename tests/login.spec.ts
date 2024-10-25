import { test, expect } from "@playwright/test";
import { StaticVariables } from "../utils/staticVariables";
import { LoginPage } from "../page-objects/loginPage";
import { LoginAssertionHelper } from '../helpers/loginAssertionHelper';

let loginPage: LoginPage
let loginAssertionHelper: LoginAssertionHelper

test.beforeEach(async ({ page }) => {
  await page.goto("/")

  loginPage = new LoginPage(page)
  loginAssertionHelper = new LoginAssertionHelper(loginPage)
});

test.describe("login", () => {
  test("username, no password", async () => {
    let noPasswordMessage = "Password is required"

    loginPage.loginUsernameOnly("username")

    loginAssertionHelper.performAssertions(noPasswordMessage)
  })

  test("password, no username", async () => {
    let noUsernameMessage = "Username is required"

    loginPage.loginPasswordOnly("password");

    loginAssertionHelper.performAssertions(noUsernameMessage)
  })

  test("inexistent user", async () => {
    let inexistentUserError =
      "Epic sadface: Username and password do not match any user in this service"

    loginPage.login("inexistent", "user")

    loginAssertionHelper.performAssertions(inexistentUserError)
  })

  test("locked out user", async () => {
    let lockedUser = StaticVariables.staticLockedUser
    let lockedPassword = StaticVariables.staticLockedPassword

    let lockedErrorUserMessage =
      "Epic sadface: Sorry, this user has been locked out."

    loginPage.login(lockedUser, lockedPassword)

    loginAssertionHelper.performAssertions(lockedErrorUserMessage)
  });

  test("standard user", async () => {
    let standardUser = StaticVariables.staticStandardUser
    let standardPassword = StaticVariables.staticStandardPassword

    loginPage.login(standardUser, standardPassword)

    await expect(loginPage.appLogo).toHaveText("Swag Labs")
  })
})
