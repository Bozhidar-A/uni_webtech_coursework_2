import { test, expect } from '@playwright/test';
import { assert } from 'console';

test.describe('Route Protection', () => {
    test("cannot go to home without auth", async ({ page }) => {
        await page.goto("/");
        assert(page.url() !== "http://localhost:3000/");
    });

    test("cannot go to login after auth", async ({ page }) => {
        await page.goto("/login");
        await page.fill('input[id="username"]', "admin");
        await page.fill('input[id="password"]', "admin");
        await page.click('button:has-text("Submit")');
        await page.waitForURL("http://localhost:3000/");
        await page.goto("/login");
        assert(page.url() !== "http://localhost:3000/login");
    });

    test("cannot visit packages without auth", async ({ page }) => {
        await page.goto("/packages");
        assert(page.url() !== "http://localhost:3000/packages");
    });

    test("can visit packages with auth", async ({ page }) => {
        await page.goto("/login");
        await page.fill('input[id="username"]', "admin");
        await page.fill('input[id="password"]', "admin");
        await page.click('button:has-text("Submit")');
        await page.waitForURL("http://localhost:3000/");
        await page.goto("/packages");
        assert(page.url() === "http://localhost:3000/packages");
    });
});