import { expect, Page } from "@playwright/test";

export class LoginPage {

    readonly page: Page;

    constructor(page: Page){
        this.page = page;
    }

    async login(username: string, password: string){
        await this.page.getByPlaceholder('Username').fill(username);
        await this.page.getByPlaceholder('Password').fill(password);
        await this.page.getByRole('button', { name: 'Login' }).click();
    }

    async assertLoginErrors(errorMessage: string){
        await expect(this.page.getByPlaceholder('Username')).toHaveClass(
            'input_error form_input error'
        );
        await expect(this.page.getByPlaceholder('Password')).toHaveClass(
            'input_error form_input error'
        );
        await expect(this.page.locator('form div.form_group svg')).toHaveCount(2);
        await expect(
            this.page.locator('div.error-message-container.error')
        ).toContainText(errorMessage);
    }
}