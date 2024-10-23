import { test, expect } from "@playwright/test";
import { StaticVariables } from "../utils/staticVariables";

test.beforeEach(async ({ page }) => {
  await page.goto("/")
})

test.describe("login", () => {
  test("username, no password", async ({ page }) => {
    let noPasswordMessage = 'Password is required'

    await page.getByPlaceholder("Username").fill("username")
    await page.getByRole("button", { name: "Login" }).click()

    await expect(page.getByPlaceholder("Username")).toHaveClass(
      "input_error form_input error"
    )
    await expect(page.getByPlaceholder("Password")).toHaveClass(
      "input_error form_input error"
    )
    await expect(page.locator("form div.form_group svg")).toHaveCount(2)
    await expect(
      page.locator("div.error-message-container.error")
    ).toContainText(noPasswordMessage)
  })

  test("password, no username", async ({ page }) => {
    let noUsernameMessage = 'Username is required'

    await page.getByPlaceholder("Password").fill("password")
    await page.getByRole("button", { name: "Login" }).click()

    await expect(page.getByPlaceholder("Username")).toHaveClass(
      "input_error form_input error"
    )
    await expect(page.getByPlaceholder("Password")).toHaveClass(
      "input_error form_input error"
    )
    await expect(page.locator("form div.form_group svg")).toHaveCount(2)
    await expect(
      page.locator("div.error-message-container.error")
    ).toContainText(noUsernameMessage)
  })

  test("inexistent user", async ({ page }) => {
    let inexistentUserError = 
    'Epic sadface: Username and password do not match any user in this service'

    await page.getByPlaceholder("Username").fill("inexistent")
    await page.getByPlaceholder("Password").fill("user")
    await page.getByRole("button", { name: "Login" }).click()

    await expect(page.getByPlaceholder("Username")).toHaveClass(
      "input_error form_input error"
    )
    await expect(page.getByPlaceholder("Password")).toHaveClass(
      "input_error form_input error"
    )
    await expect(page.locator("form div.form_group svg")).toHaveCount(2)
    await expect(
      page.locator("div.error-message-container.error")
    ).toContainText(inexistentUserError)
  })

  test("locked out user", async ({ page }) => {
    let lockedUser = StaticVariables.staticLockedUser
    let lockedPassword = StaticVariables.staticLockedPassword
    let lockedErrorUserMessage = "Epic sadface: Sorry, this user has been locked out."

    await page.getByPlaceholder("Username").fill(lockedUser)
    await page.getByPlaceholder("Password").fill(lockedPassword)
    await page.getByRole("button", { name: "Login" }).click()

    await expect(page.getByPlaceholder("Username")).toHaveClass(
      "input_error form_input error"
    )
    await expect(page.getByPlaceholder("Password")).toHaveClass(
      "input_error form_input error"
    )
    await expect(page.locator("form div.form_group svg")).toHaveCount(2)
    await expect(
      page.locator("div.error-message-container.error")
    ).toContainText(lockedErrorUserMessage)
  })

  test("standard user", async ({ page }) => {
    let standardUser = StaticVariables.staticStandardUser
    let standardPassword = StaticVariables.staticStandardPassword

    await page.getByPlaceholder("Username").fill(standardUser)
    await page.getByPlaceholder("Password").fill(standardPassword)
    await page.getByRole("button", { name: "Login" }).click()

    await expect(page.locator("div.app_logo")).toHaveText("Swag Labs")
  })
})
