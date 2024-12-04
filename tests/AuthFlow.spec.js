import { test, expect } from '@playwright/test';

test.describe('Auth Flow', () => {
    test("login fails with invalid credentials", async ({ page }) => {
        await page.goto("/login");
        await page.fill('input[id="username"]', "invaliduser");
        await page.fill('input[id="password"]', "invalidpassword");
        page.on('dialog', async dialog => {
            expect(dialog.message()).toContain('Invalid username or password');
            await dialog.dismiss();
        });
        await page.click('button:has-text("Login")');
    });

    test("login succeeds with valid credentials", async ({ page }) => {
        await page.goto("/login");
        await page.fill('input[id="username"]', "admin");
        await page.fill('input[id="password"]', "admin");
        await page.click('button:has-text("Submit")');
        await page.waitForURL("http://localhost:3000/");
        expect(page.url()).toBe("http://localhost:3000/");
    });

    test("logout succeeds", async ({ page }) => {
        await page.goto("/login");
        await page.fill('input[id="username"]', "admin");
        await page.fill('input[id="password"]', "admin");
        await page.click('button:has-text("Submit")');
        await page.waitForURL("http://localhost:3000/");
        await page.click('button:has-text("Logout")');
        await page.waitForURL("http://localhost:3000/");
        expect(page.url()).toBe("http://localhost:3000/");
    });
});