import { expect, Page } from "@playwright/test";

export class ProductPage {

    readonly page: Page;

    constructor(page: Page){
        this.page = page;
    }

    async footerLinkAssertions(locator: string, text: string, url: string){
        let link = this.page.locator(locator);
        await expect(link).toHaveText(text);
        await expect(link).toHaveAttribute('href', url);
    }

    async assertCartState(productCount: string, isBadgeVisible: boolean){
        let cartCount = await this.page.locator('a.shopping_cart_link').textContent();
        let cartBadge = this.page.locator('span.shopping_cart_badge');
        expect(cartCount).toContain(productCount);

        if(isBadgeVisible)
        {
            await expect(cartBadge).toBeVisible();
        }
        else
        {
            await expect(cartBadge).not.toBeVisible();
        }
    }
}