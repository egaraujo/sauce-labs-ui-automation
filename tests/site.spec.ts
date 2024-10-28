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

test('should display all available products', async({page}) => {
    // navigate to cart
    await page.locator('a.shopping_cart_link').click()
    let cartUrl = page.url()
    expect(cartUrl).toContain('/cart.html')

    // display all items
    await page.locator('div.bm-burger-button').click()
    await page.getByText('All Items').click()
    let productsTitle = await page.locator('span.title').textContent()
    expect(productsTitle).toBe('Products')

    let products = page.locator('div.inventory_item')
    expect(products).toHaveCount(6)
})

test('should link to the about website', async({page}) => {
    await page.locator('div.bm-burger-button').click()
    let about = page.getByText('About')
    await expect(about).toHaveAttribute('href', 'https://saucelabs.com/')
})

test('should log user out', async({page}) => {
    await page.locator('div.bm-burger-button').click()
    await page.getByText('Logout').click()
    let login = page.getByText('Login')
    await expect(login).toBeVisible()
})

test('should reset the app state', async({page}) => {
    // add product to cart
    await page.getByRole('button', {name: 'Add to cart'}).first().click()
    await page.getByText('Sauce Labs Backpack').click()
    let productUrl = page.url()
    expect(productUrl).toContain('inventory-item')

    // verify cart state
    productAssertionHelper.verifyCartState("1", true)

    // reset app state
    await page.locator('div.bm-burger-button').click()
    await page.getByText('Reset App State').click()
    await page.locator('div.bm-cross-button').click()

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