import { Locator, Page } from "@playwright/test";

import socialMediaData from "../test-data/socialMediaData.json"

export class ProductPage {
  readonly page: Page

  readonly socialMediaNames: string[]
  readonly footer: Locator
  readonly productSelect: Locator
  readonly priceSelect: Locator
  readonly optionLocator: Locator
  readonly formLocator: Locator
  readonly burgerButton: Locator
  readonly productsTitle: Locator
  readonly inventoryItem: Locator
  readonly crossButton: Locator
  readonly addFirstProductButton: Locator

  // ProductAssertionHelper
  readonly cartCount: Locator
  readonly cartBadge: Locator

  constructor(page: Page) {
    this.page = page
    this.footer = page.locator('div.footer_copy')
    this.productSelect = page.locator('div.inventory_item_name')
    this.priceSelect = page.locator('div.inventory_item_price')
    this.optionLocator = page.locator('select.product_sort_container')
    this.formLocator = page.locator('form')
    this.burgerButton = page.locator('div.bm-burger-button')
    this.productsTitle = page.locator('span.title')
    this.inventoryItem = page.locator('div.inventory_item')
    this.crossButton = page.locator('div.bm-cross-button')
    this.addFirstProductButton = page.getByRole('button', {name: 'Add to cart'}).first()

    // ProductAssertionHelper
    this.cartCount = page.locator('a.shopping_cart_link')
    this.cartBadge = page.locator("span.shopping_cart_badge")

    this.socialMediaNames = this.setSocialMediaNames()
  }

  findSocialMediaLocator(socialMedia: string) { 
    let name = this.socialMediaNames.filter(locator => locator.match(socialMedia.toLowerCase()) !== null)
    return this.page.locator("li.social_" + name[0] +" a")
  }

  private setSocialMediaNames(): string[] {
    var names: string[] = []

    for(var item in socialMediaData) {
      names.push(socialMediaData[item].name.toLowerCase())
    }
    return names
  }

  getUrl(): string {
    return this.page.url()
  }

  getByText(text: string): Locator {
    return this.page.getByText(text)
  }

}