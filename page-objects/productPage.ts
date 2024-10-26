import { Locator, Page } from "@playwright/test";

export class ProductPage {
  readonly page: Page

  // ProductAssertionHelper
  readonly cartCount: Locator
  readonly cartBadge: Locator

  constructor(page: Page) {
    this.page = page
    this.cartCount = page.locator('a.shopping_cart_link')
    this.cartBadge = page.locator("span.shopping_cart_badge")
  }
}
