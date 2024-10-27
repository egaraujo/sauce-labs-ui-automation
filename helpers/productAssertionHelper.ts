import { expect } from "@playwright/test";
import { ProductPage } from "../page-objects/productPage";

export class ProductAssertionHelper {
  readonly productPage: ProductPage;

  constructor(page: ProductPage) {
    this.productPage = page;
  }

  async verifyCartState(products: string, cartBadgeShouldBeVisible: boolean) {
    let cartCount = this.productPage.cartCount
    let cartBadge = this.productPage.cartBadge 
    expect(cartCount).toHaveText(products)

    if(cartBadgeShouldBeVisible) {
      await expect(cartBadge).toBeVisible()
    }
    else {
      await expect(cartBadge).not.toBeVisible()
    }
  }

  async verifyFormErrors(errorMessage: string) {
    let errorText = await this.productPage.formLocator.textContent()
    expect(errorText).toContain(errorMessage)
  }

}
