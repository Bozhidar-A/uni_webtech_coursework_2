import { test, expect, request } from '@playwright/test';

test.describe('Packages', () => {
    test('Button click changes status text', async ({ page }) => {
        // Navigate to login and authenticate
        await page.goto('/login');
        await page.fill('input[id="username"]', 'admin');
        await page.fill('input[id="password"]', 'admin');
        await page.click('button:has-text("Submit")');
        await page.waitForURL('http://localhost:3000/');
        await page.click('h1:has-text("You are logged in. Click here to head to packages")');

        // Locate the first package's container by ID
        const firstPackage = page.locator('#package_comp_inst').first();

        // Locate the status text and button within the package container
        let statusText = firstPackage.locator('#status_text');
        let toggleButton = firstPackage.locator('#status_button');

        // Capture the initial status text
        const initialStatus = (await statusText.textContent())?.trim();
        console.log('Initial status:', initialStatus);

        // Click the toggle button
        await toggleButton.click();

        // Re-fetch the statusText locator to ensure it targets the updated element
        statusText = firstPackage.locator('#status_text');

        // Wait for the status to update and verify
        await expect(statusText).not.toHaveText(initialStatus, { timeout: 5000 });

        const updatedStatus = (await statusText.textContent())?.trim();
        console.log('Updated status:', updatedStatus);

        // Verify the status text has changed
        expect(updatedStatus).not.toBe(initialStatus);

        // Click the toggle button again to revert the status
        await toggleButton.click();

        // Re-fetch the statusText locator to ensure it targets the updated element
        statusText = firstPackage.locator('#status_text');

        // Wait for the status to revert and verify
        await expect(statusText).toHaveText(initialStatus, { timeout: 5000 });

        const revertedStatus = (await statusText.textContent())?.trim();
        console.log('Reverted status:', revertedStatus);

        // Verify the status text reverted
        expect(revertedStatus).toBe(initialStatus);
    });

    test("cant fetch without auth API", async ({ request }) => {
        const res = await request.fetch('http://localhost:3000/api/backend/packages');

        //accessing a protedted route without auth should return a redirect to login
        //even if its an API request
        expect(res.url()).toContain('/login');
    });

    test('can fetch with auth API', async () => {
        const apiRequest = await request.newContext();
        const authRes = await apiRequest.post('http://localhost:3000/api/auth/backend/login', {
            data: {
                username: 'admin',
                password: 'admin',
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const authData = await authRes.json();

        const token = authData.accessToken;

        const res = await apiRequest.get('http://localhost:3000/api/backend/packages', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("DEBUG - Packages response status:", res.status());
        expect(res.status()).toBe(200);

        await apiRequest.dispose();
    });
});
