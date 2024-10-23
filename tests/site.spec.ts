import { test, expect } from "@playwright/test";
import { PriceHelper } from '../helpers/priceHelper';
import { StaticVariables } from '../utils/staticVariables';

let username = StaticVariables.staticStandardUser
let password = StaticVariables.staticStandardPassword

test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByPlaceholder('Username').fill(username)
    await page.getByPlaceholder('Password').fill(password)
    await page.getByRole('button', { name: 'Login' }).click()
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
    let cartCount = await page.locator('a.shopping_cart_link').textContent()
    let cartBadge = page.locator('span.shopping_cart_badge')
    expect(cartCount).toContain("1")
    await expect(cartBadge).toBeVisible()

    // reset app state
    await page.locator('div.bm-burger-button').click()
    await page.getByText('Reset App State').click()
    await page.locator('div.bm-cross-button').click()

    // verify cart state
    cartCount = await page.locator('a.shopping_cart_link').textContent()
    cartBadge = page.locator('span.shopping_cart_badge')
    expect(cartCount).toContain('')
    await expect(cartBadge).not.toBeVisible()
})

test('should verify footer content', async({page}) => {
    let link = page.locator('li.social_twitter a')
    await expect(link).toHaveText('Twitter')
    await expect(link).toHaveAttribute('href', 'https://twitter.com/saucelabs')

    link = page.locator('li.social_facebook a')
    await expect(link).toHaveText('Facebook')
    await expect(link).toHaveAttribute('href', 'https://www.facebook.com/saucelabs')

    link = page.locator('li.social_linkedin a')
    await expect(link).toHaveText('LinkedIn')
    await expect(link).toHaveAttribute('href', 'https://www.linkedin.com/company/sauce-labs/')
    
    let footerText = page.locator('div.footer_copy')
    await expect(footerText).toHaveText(
         '© 2024 Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy'
    )
})

test('should sort products by ascending name', async({page}) => {
    // Name (A to Z)
    let productList = await page.locator('div.inventory_item_name').allTextContents()
    let ascendingProductList = productList.sort()
    expect(productList).toEqual(ascendingProductList)
})

test('should sort products by descending name', async({page}) => {
    // Name (Z to A)
    let productList = await page.locator('div.inventory_item_name').allTextContents()
    let optionList = page.locator('select.product_sort_container')
    await optionList.selectOption("Name (Z to A)")
    const descendingProductList = productList.reverse()
    expect(productList).toEqual(descendingProductList)
})

test('should sort products by ascending price', async({page}) => {
    // Price (low to high)
    let optionList = page.locator('select.product_sort_container')
    await optionList.selectOption("Price (low to high)")
    let prices = await page.locator('div.inventory_item_price').allTextContents()
    let priceList = PriceHelper.formatActualPriceList(prices)
    let ascendingPriceList = PriceHelper.sortPricesAscending(prices)
    expect(priceList).toEqual(ascendingPriceList)
})

test('should sort products by descending price', async({page}) => {
    // Price (high to low)
    let optionList = page.locator('select.product_sort_container')
    await optionList.selectOption("Price (high to low)")
    let prices = await page.locator('div.inventory_item_price').allTextContents()
    let priceList = PriceHelper.formatActualPriceList(prices)
    let descendingPriceList = PriceHelper.sortPricesDescending(prices)
    expect(priceList).toEqual(descendingPriceList)
})

test('should check out selected products', async({page}) => {
    // add products to cart
    await page.getByRole('button', {name: 'Add to cart'}).first().click()
    await page.getByRole('button', {name: 'Add to cart'}).last().click()

    // verify cart state
    let cartCount = await page.locator('a.shopping_cart_link').textContent()
    let cartBadge = page.locator('span.shopping_cart_badge')
    expect(cartCount).toContain("2")
    await expect(cartBadge).toBeVisible()

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
    cartCount = await page.locator('a.shopping_cart_link').textContent()
    cartBadge = page.locator('span.shopping_cart_badge')
    expect(cartCount).toContain("1")
    await expect(cartBadge).toBeVisible()

    // add another product
    await page.getByRole('button', {name: 'Continue Shopping'}).click()
    await page.getByText('Sauce Labs Fleece Jacket').click()
    await page.getByRole('button', {name: 'Add to cart'}).click()

    // verify cart state
    cartCount = await page.locator('a.shopping_cart_link').textContent()
    cartBadge = page.locator('span.shopping_cart_badge')
    expect(cartCount).toContain("2")
    await expect(cartBadge).toBeVisible()

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
    let errorText = await page.locator('form').textContent()
    expect(errorText).toContain('Error: First Name is required')

    // enter first name
    await page.getByPlaceholder('First Name').fill('John')
    await page.locator('div.checkout_buttons input').filter({hasText: 'Continue'}).click()

    // verify form errors
    errorText = await page.locator('form').textContent()
    expect(errorText).toContain('Error: Last Name is required')

    // enter last name
    await page.getByPlaceholder('Last Name').fill('Taylor')
    await page.locator('div.checkout_buttons input').filter({hasText: 'Continue'}).click()

    // verify form errors
    errorText = await page.locator('form').textContent()
    expect(errorText).toContain('Error: Postal Code is required')

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