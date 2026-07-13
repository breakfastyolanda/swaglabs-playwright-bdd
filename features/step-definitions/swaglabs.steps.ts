import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';

// Task 4.1 - Login using a valid user
Given('I am on the Swag Labs login page', async function (this: CustomWorld) {
    await this.swagLabsPage.navigate();
});

When(
    'I login with username {string} and password {string}',
    async function (this: CustomWorld, username: string, password: string) {
        await this.swagLabsPage.login(username, password);
    }
);

Then('the Products page should be displayed', async function (this: CustomWorld) {
    await expect(this.swagLabsPage.productsTitle).toHaveText('Products');
});

// Task 4.2 - Login using invalid users (negative tests)
Then('a login error message should be displayed', async function (this: CustomWorld) {
    await expect(this.swagLabsPage.errorMessage).toBeVisible();
});

// Task 4.3 and 4.4 - Sort products by all available options and validate sorting
Given('I am logged into Swag Labs', async function (this: CustomWorld) {
    await this.swagLabsPage.navigate();
    await this.swagLabsPage.login('standard_user', 'secret_sauce');
    await expect(this.swagLabsPage.productsTitle).toHaveText('Products');
});

When(
    'I sort the products by {string}',
    async function (this: CustomWorld, sortOption: string) {
        await this.swagLabsPage.sortProducts(sortOption);
    }
);

Then(
    'the products should be correctly sorted by {string}',
    async function (this: CustomWorld, sortOption: string) {
        const isSorted = await this.swagLabsPage.validateProductSorting(sortOption);
        expect(isSorted).toBe(true);
    }
);

// Task 4.5 - Add all products to cart and validate cart count
let expectedProductCount: number;

When('I add all products to the cart', async function (this: CustomWorld) {
    expectedProductCount = await this.swagLabsPage.addAllProductsToCart();
});

Then('the cart badge should display the correct product count', async function (this: CustomWorld) {
    await expect(this.swagLabsPage.cartBadge)
        .toHaveText(expectedProductCount.toString());
});


//Task 4.6 - Validate cart total before checkout
Given('I have added all products to the cart', async function (this: CustomWorld) {
    const productPrices = await this.swagLabsPage.getProductPrices();

    this.expectedCartTotal = productPrices.reduce(
        (total, price) => total + price,
        0
    );

    await this.swagLabsPage.addAllProductsToCart();
});

When('I open the shopping cart', async function (this: CustomWorld) {
    await this.swagLabsPage.openCart();
});

Then(
    'the calculated cart total should match the sum of all product prices',
    async function (this: CustomWorld) {
        const cartPrices = await this.swagLabsPage.getCartItemPrices();

        const actualCartTotal = cartPrices.reduce(
            (total, price) => total + price,
            0
        );

        expect(actualCartTotal).toBeCloseTo(this.expectedCartTotal, 2);
    }
);

// Task 4.7 - Complete checkout with valid information
Given('I proceed to checkout', async function (this: CustomWorld) {
    await this.swagLabsPage.openCart();
    await this.swagLabsPage.startCheckout();
});

When('I enter valid checkout information', async function (this: CustomWorld) {
    await this.swagLabsPage.fillCheckoutInformation(
        'Yolanda',
        'Breakfast',
        '8000'
    );
});

Then('I should proceed to the checkout overview page', async function (this: CustomWorld) {
    await expect(this.swagLabsPage.finishButton).toBeVisible();
});


// Task 4.8 - Checkout with missing required information
When(
    'I enter first name {string}, last name {string} and postal code {string}',
    async function (
        this: CustomWorld,
        firstName: string,
        lastName: string,
        postalCode: string
    ) {
        await this.swagLabsPage.fillCheckoutInformation(
            firstName,
            lastName,
            postalCode
        );
    }
);

Then('a checkout error message should be displayed', async function (this: CustomWorld) {
    await expect(this.swagLabsPage.checkoutErrorMessage).toBeVisible();
});

// Task 4.9 - Validate checkout totals and tax
Then(
    'the displayed item total should match the calculated product total',
    async function (this: CustomWorld) {
        const displayedItemTotal = await this.swagLabsPage.getItemTotal();

        expect(displayedItemTotal).toBeCloseTo(this.expectedCartTotal, 2);
    }
);

Then('tax should be displayed', async function (this: CustomWorld) {
    const tax = await this.swagLabsPage.getTax();

    expect(tax).toBeGreaterThan(0);
});

// Task 4.10 - Complete purchase and validate post-checkout journey
When('I complete the checkout', async function (this: CustomWorld) {
    await this.swagLabsPage.finishCheckout();
});

Then('the checkout should complete successfully', async function (this: CustomWorld) {
    await expect(this.swagLabsPage.successTitle).toBeVisible();
});

Then('the success title should be displayed', async function (this: CustomWorld) {
    await expect(this.swagLabsPage.successTitle).toBeVisible();
});

Then('the success description should be displayed', async function (this: CustomWorld) {
    await expect(this.swagLabsPage.successMessage).toBeVisible();
});

Then('the cart badge should not display a number', async function (this: CustomWorld) {
    await expect(this.swagLabsPage.cartBadge).not.toBeVisible();
});

When('I open the burger menu', async function (this: CustomWorld) {
    await this.swagLabsPage.openBurgerMenu();
});

When('I navigate to All Items', async function (this: CustomWorld) {
    await this.swagLabsPage.navigateToAllItems();
});

Then('the cart should be empty', async function (this: CustomWorld) {
    await expect(this.swagLabsPage.cartBadge).not.toBeVisible();
});

When('I logout', async function (this: CustomWorld) {
    await this.swagLabsPage.logout();
});

Then('the Login page should be displayed', async function (this: CustomWorld) {
    await expect(this.swagLabsPage.loginButton).toBeVisible();
});