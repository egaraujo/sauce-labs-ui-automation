import { expect } from '@playwright/test';
import { LoginPage } from '../page-objects/loginPage';

export class LoginAssertionHelper {
  readonly loginPage: LoginPage

  constructor(page: LoginPage) {
    this.loginPage = page
  }

  async performAssertions(errorMessage: string) {
    await expect(this.loginPage.usernameInput)
      .toHaveClass(this.loginPage.errorClasses)

    await expect(this.loginPage.passwordInput)
      .toHaveClass(this.loginPage.errorClasses)

    await expect(this.loginPage.errorImage).toHaveCount(2)

    expect(this.loginPage.errorDiv).toContainText(errorMessage)
  }
}
