import { test, expect } from "@playwright/test";
import { PriceHelper } from '../helpers/priceHelper';
import { StaticVariables } from '../utils/staticVariables';
import { LoginPage } from "../page-objects/loginPage";
import { ProductAssertionHelper } from '../helpers/productAssertionHelper';
import { ProductPage } from '../page-objects/productPage';

let username = StaticVariables.staticStandardUser
let password = StaticVariables.staticStandardPassword

let productPage: ProductPage
let productAssertionHelper: ProductAssertionHelper

import socialMediaData from "../test-data/socialMediaData.json"
import siteData from "../test-data/siteData.json"
import formErrors from "../test-data/formErrors.json"

test.beforeEach(async ({ page }) => {
    await page.goto('/')
    let loginPage: LoginPage = new LoginPage(page)
    loginPage.login(username, password)

    productPage = new ProductPage(page)
    productAssertionHelper = new ProductAssertionHelper(productPage)
})

test('should display all available products', async() => {
    // navigate to cart
    await productPage.cartCount.click()
    let cartUrl = productPage.getUrl()
    expect(cartUrl).toContain(siteData.cartPath)

    // display all items
    await productPage.burgerButton.click()
    await productPage.getByText(siteData.allItemsText).click()
    let productsTitle = await productPage.productsTitle.textContent()
    expect(productsTitle).toBe(siteData.productsText)

    let products = productPage.inventoryItem
    expect(products).toHaveCount(siteData.productCount)
})

test('should link to the about website', async() => {
    await productPage.burgerButton.click()
    let aboutLink = productPage.getByText(siteData.aboutText)
    await expect(aboutLink).toHaveAttribute('href', siteData.sauceLabsUrl)
})

test('should log user out', async() => {
    await productPage.burgerButton.click()
    await productPage.getByText(siteData.logoutText).click()
    let login = productPage.getByText(siteData.loginText)
    await expect(login).toBeVisible()
})

test('should reset the app state', async() => {
    // add product to cart
    await productPage.addFirstProductButton.click()
    expect(productPage.getUrl()).toContain(siteData.inventoryPath)

    // verify cart state
    productAssertionHelper.verifyCartState("1", true)

    // reset app state
    await productPage.burgerButton.click()
    await productPage.getByText(siteData.resetAppText).click()
    await productPage.crossButton.click()

    // verify cart state
    productAssertionHelper.verifyCartState("", false)
}) 

socialMediaData.forEach(socialMedia =>{
    test(`should verify footer link for: ${socialMedia.name}`, async () => {            
            let link = productPage.findSocialMediaLocator(socialMedia.name)
            await expect(link).toHaveText(socialMedia.name)
            await expect(link).toHaveAttribute('href', socialMedia.url)
    })
})

test('should verify footer text', async() => {
    let footer = productPage.footer
    await expect(footer).toHaveText(siteData.footerText)
})

test('should sort products by ascending name', async() => {
    // Name (A to Z)
    let productList = await productPage.productSelect.allTextContents()
    let ascendingProductList = productList.sort()
    expect(productList).toEqual(ascendingProductList)
})

test('should sort products by descending name', async() => {
    // Name (Z to A)
    let productList = await productPage.productSelect.allTextContents()
    let optionList = productPage.optionLocator
    await optionList.selectOption(siteData.descendingNamesSorting)
    const descendingProductList = productList.reverse()
    expect(productList).toEqual(descendingProductList)
})

test('should sort products by ascending price', async() => {
    // Price (low to high)
    let optionList = productPage.optionLocator
    await optionList.selectOption(siteData.ascendingPricesSorting)
    let prices = await productPage.priceSelect.allTextContents()
    let priceList = PriceHelper.formatActualPriceList(prices)
    let ascendingPriceList = PriceHelper.sortPricesAscending(prices)
    expect(priceList).toEqual(ascendingPriceList)
})

test('should sort products by descending price', async() => {
    // Price (high to low)
    let optionList = productPage.optionLocator
    await optionList.selectOption(siteData.descendingPricesSorting)
    let prices = await productPage.priceSelect.allTextContents()
    let priceList = PriceHelper.formatActualPriceList(prices)
    let descendingPriceList = PriceHelper.sortPricesDescending(prices)
    expect(priceList).toEqual(descendingPriceList)
})

test('should check out selected products', async({page}) => {
    // add products to cart
    await page.getByRole('button', {name: 'Add to cart'}).first().click()
    await page.getByRole('button', {name: 'Add to cart'}).last().click()

    // verify cart state
    productAssertionHelper.verifyCartState("2", true)

    // navigate to cart
    await page.locator('a.shopping_cart_link').click()
    let backpackItem = page.getByText('Sauce Labs Backpack')
    let redShirt = page.getByText('Test.allTheThings() T-Shirt (Red)')
    expect(backpackItem).toBeVisible()
    expect(redShirt).toBeVisible()

    // remove one product
    await page.getByRole('button', {name: 'Remove'}).first().click()
    expect(backpackItem).not.toBeVisible()
    expect(redShirt).toBeVisible()

    // verify cart state
    productAssertionHelper.verifyCartState("1", true)

    // continue shopping
    await page.getByRole('button', {name: 'Continue Shopping'}).click()
    await page.getByText('Sauce Labs Fleece Jacket').click()
    await page.getByRole('button', {name: 'Add to cart'}).click()

    // verify cart state
    productAssertionHelper.verifyCartState("2", true)

    // navigate to cart
    await page.locator('a.shopping_cart_link').click()
    redShirt = page.getByText('Test.allTheThings() T-Shirt (Red)')
    let jacket = page.getByText('Sauce Labs Fleece Jacket')
    await expect(redShirt).toBeVisible()
    await expect(jacket).toBeVisible()

    // checkout
    await page.getByRole('button', {name: 'Checkout'}).click()
    let title = await page.locator('span.title').textContent()
    expect(title).toBe('Checkout: Your Information')

    // attempt checkout without completing data
    await page.locator('div.checkout_buttons input').filter({hasText: 'Continue'}).click()

    // verify form errors
    productAssertionHelper.verifyFormErrors(formErrors.FirstName)

    // enter first name
    await page.getByPlaceholder('First Name').fill('John')
    await page.locator('div.checkout_buttons input').filter({hasText: 'Continue'}).click()

    // verify form errors
    productAssertionHelper.verifyFormErrors(formErrors.LastName)

    // enter last name
    await page.getByPlaceholder('Last Name').fill('Taylor')
    await page.locator('div.checkout_buttons input').filter({hasText: 'Continue'}).click()

    // verify form errors
    productAssertionHelper.verifyFormErrors(formErrors.PostalCode)

    // enter postal code and continue
    await page.getByPlaceholder('Postal Code').fill('SW19 7HX')
    await page.locator('div.checkout_buttons input').filter({hasText: 'Continue'}).click()

    // checkout overview
    title = await page.locator('span.title').textContent()
    expect(title).toBe('Checkout: Overview')
    let cartItem = page.locator('div.cart_item')
    await expect(cartItem).toHaveCount(2)

    let paymentInformation = page.locator('div.summary_info')

    await expect(paymentInformation).toContainText('Payment Information:')
    await expect(paymentInformation).toContainText('SauceCard #31337')

    await expect(paymentInformation).toContainText('Shipping Information:')
    await expect(paymentInformation).toContainText('Free Pony Express Delivery!')

    await expect(paymentInformation).toContainText('Price Total')
    await expect(paymentInformation).toContainText('Item total: $65.98')
    await expect(paymentInformation).toContainText('Tax: $5.28')
    await expect(paymentInformation).toContainText('Total: $71.26')
})