import { Before, After, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium } from '@playwright/test';
import { CustomWorld } from './world';
import { SwagLabsPage } from '../pages/SwagLabsPage';

setDefaultTimeout(30 * 1000);

Before(async function (this: CustomWorld) {
    this.browser = await chromium.launch({
        headless: true
    });

    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
    this.swagLabsPage = new SwagLabsPage(this.page);
});

After(async function (this: CustomWorld, scenario) {
    if (scenario.result?.status === Status.FAILED && this.page) {
        const screenshot = await this.page.screenshot({
            fullPage: true
        });

        await this.attach(screenshot, 'image/png');
    }

    await this.page?.close();
    await this.context?.close();
    await this.browser?.close();
});