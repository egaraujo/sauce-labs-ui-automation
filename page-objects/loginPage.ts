import { Locator, Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page

  // LoginAssertionHelper
  readonly usernameInput: Locator 
  readonly passwordInput: Locator
  readonly errorClasses: string
  readonly errorImage: Locator
  readonly errorDiv: Locator

  //Successful Login
  readonly appLogo: Locator
  readonly appTitle: string

  constructor(page: Page) {
    this.page = page

    // LoginAssertionHelper
    this.usernameInput = this.page.getByPlaceholder("Username")
    this.passwordInput = this.page.getByPlaceholder("Password")
    this.errorClasses = "input_error form_input error"
    this.errorImage = page.locator("form div.form_group svg")
    this.errorDiv = this.page.locator("div.error-message-container.error")

    //Successful Login
    this.appLogo = page.locator("div.app_logo")
    this.appTitle = "Swag Labs"
  }

  async login(username: string, password: string) {
    await this.page.getByPlaceholder("Username").fill(username)
    await this.page.getByPlaceholder("Password").fill(password)
    await this.page.getByRole("button", { name: "Login" }).click()
  }

  async loginUsernameOnly(username: string) {
    await this.page.getByPlaceholder("Username").fill(username)
    await this.page.getByRole("button", { name: "Login" }).click()
  }

  async loginPasswordOnly(password: string) {
    await this.page.getByPlaceholder("Password").fill(password)
    await this.page.getByRole("button", { name: "Login" }).click()
  }
}
