import { Page, Locator } from '@playwright/test';

export class SwagLabsPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;
    readonly productsTitle: Locator;
    readonly sortDropdown: Locator;
    readonly productNames: Locator;
    readonly productPrices: Locator;
    readonly addToCartButtons: Locator;
    readonly cartBadge: Locator;
    readonly checkoutErrorMessage: Locator;
    readonly cartLink: Locator;
    readonly checkoutButton: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postalCodeInput: Locator;
    readonly continueButton: Locator;
    readonly itemTotal: Locator;
    readonly tax: Locator;
    readonly total: Locator;
    readonly finishButton: Locator;
    readonly successTitle: Locator;
    readonly successMessage: Locator;
    readonly burgerMenuButton: Locator;
    readonly allItemsLink: Locator;
    readonly logoutLink: Locator;
    

    constructor(page: Page) {
        this.page = page;

       

        // Login page
        this.usernameInput = page.locator('[data-test="username"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');
        this.errorMessage = page.locator('[data-test="error"]');

        // Products page
        this.productsTitle = page.locator('[data-test="title"]');
        this.sortDropdown = page.locator('[data-test="product-sort-container"]');
        this.productNames = page.locator('[data-test="inventory-item-name"]');
        this.productPrices = page.locator('[data-test="inventory-item-price"]');
        this.addToCartButtons = page.locator('button[data-test^="add-to-cart"]');

        // Cart
        this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
        this.cartLink = page.locator('[data-test="shopping-cart-link"]');

        // Checkout
        this.checkoutErrorMessage = page.locator('[data-test="error"]');
        this.checkoutButton = page.locator('[data-test="checkout"]');
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('[data-test="continue"]');
        this.itemTotal = page.locator('[data-test="subtotal-label"]');
        this.tax = page.locator('[data-test="tax-label"]');
        this.total = page.locator('[data-test="total-label"]');
        this.finishButton = page.locator('[data-test="finish"]');

        // Checkout success
        this.successTitle = page.locator('[data-test="complete-header"]');
        this.successMessage = page.locator('[data-test="complete-text"]');

        // Burger menu
        this.burgerMenuButton = page.locator('#react-burger-menu-btn');
        this.allItemsLink = page.locator('[data-test="inventory-sidebar-link"]');
        this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    }

    async navigate(): Promise<void> {
        await this.page.goto('https://www.saucedemo.com/');
    }

    async login(username: string, password: string): Promise<void> {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async sortProducts(sortOption: string): Promise<void> {
        const sortValues: Record<string, string> = {
            'Name (A to Z)': 'az',
            'Name (Z to A)': 'za',
            'Price (low to high)': 'lohi',
            'Price (high to low)': 'hilo'
        };

        await this.sortDropdown.selectOption(sortValues[sortOption]);
    }

    async getProductNames(): Promise<string[]> {
        return await this.productNames.allTextContents();
    }

    async validateProductSorting(sortOption: string): Promise<boolean> {
    if (sortOption === 'Name (A to Z)') {
        const names = await this.getProductNames();
        const sortedNames = [...names].sort((a, b) => a.localeCompare(b));
        return JSON.stringify(names) === JSON.stringify(sortedNames);
    }

    if (sortOption === 'Name (Z to A)') {
        const names = await this.getProductNames();
        const sortedNames = [...names].sort((a, b) => b.localeCompare(a));
        return JSON.stringify(names) === JSON.stringify(sortedNames);
    }

    if (sortOption === 'Price (low to high)') {
        const prices = await this.getProductPrices();
        const sortedPrices = [...prices].sort((a, b) => a - b);
        return JSON.stringify(prices) === JSON.stringify(sortedPrices);
    }

    if (sortOption === 'Price (high to low)') {
        const prices = await this.getProductPrices();
        const sortedPrices = [...prices].sort((a, b) => b - a);
        return JSON.stringify(prices) === JSON.stringify(sortedPrices);
    }

    return false;
    }

    async getProductPrices(): Promise<number[]> {
        const prices = await this.productPrices.allTextContents();

        return prices.map(price =>
            Number(price.replace('$', '').trim())
        );
    }

    async addAllProductsToCart(): Promise<number> {
        const count = await this.addToCartButtons.count();

        for (let i = count - 1; i >= 0; i--) {
            await this.addToCartButtons.nth(i).click();
        }

        return count;
    }

//     async getAddedProductCount(): Promise<number> {
//     const badgeText = await this.cartBadge.textContent();
//     return Number(badgeText);
// }

    async openCart(): Promise<void> {
        await this.cartLink.click();
    }

    async getCartItemPrices(): Promise<number[]> {
    const cartPrices = this.page.locator('[data-test="inventory-item-price"]');
    const priceTexts = await cartPrices.allTextContents();

    return priceTexts.map(price =>
        Number(price.replace('$', '').trim())
    );
    }

    async calculateCartTotal(): Promise<number> {
    const prices = await this.getCartItemPrices();

    return prices.reduce((total, price) => total + price, 0);
    }

    async startCheckout(): Promise<void> {
        await this.checkoutButton.click();
    }

    async fillCheckoutInformation(
        firstName: string,
        lastName: string,
        postalCode: string
    ): Promise<void> {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
        await this.continueButton.click();
    }

    async continueCheckout(): Promise<void> {
        await this.continueButton.click();
    }

    async getItemTotal(): Promise<number> {
        const text = await this.itemTotal.textContent();
        return Number(text?.replace('Item total: $', '').trim());
    }

    async getTax(): Promise<number> {
        const text = await this.tax.textContent();
        return Number(text?.replace('Tax: $', '').trim());
    }

    async getDisplayedTotal(): Promise<number> {
        const text = await this.total.textContent();
        return Number(text?.replace('Total: $', '').trim());
    }


    async finishCheckout(): Promise<void> {
        await this.finishButton.click();
    }

    

    async openBurgerMenu(): Promise<void> {
        await this.burgerMenuButton.click();
        await this.allItemsLink.waitFor({ state: 'visible' });
    }

    async navigateToAllItems(): Promise<void> {
        await this.allItemsLink.click();
    }

    async logout(): Promise<void> {
        await this.openBurgerMenu();
        await this.logoutLink.click();
    }
}