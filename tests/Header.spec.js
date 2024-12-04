import { test, expect } from '@playwright/test';

// Mock environment variables in your application setup (not handled directly in Playwright tests)
process.env.NEXT_PUBLIC_NAVIGATION_HOME_PAGE = '/';
process.env.NEXT_PUBLIC_NAVIGATION_PACKAGES_PAGE = '/packages';
const home = "http://localhost:3000/";

test.describe('Header Component', () => {
    test('renders correctly when the user is authenticated', async ({ page }) => {
        // Mock the session API to simulate an authenticated user
        await page.route('**/api/auth/session', (route) =>
            route.fulfill({
                status: 200,
                body: JSON.stringify({
                    user: {
                        username: 'TestUser',
                    },
                    accessToken: 'mock-access-token',
                }),
            })
        );

        // Navigate to the page
        await page.goto(home); // Replace '/' with the actual route

        // Ensure the "Welcome, TestUser" text and "Logout" button are visible
        await expect(page.locator('text=Welcome, TestUser')).toBeVisible();
        await expect(page.locator('button:has-text("Logout")')).toBeVisible();
    });

    test('renders correctly when the user is not authenticated', async ({ page }) => {
        // Mock the unauthenticated state
        await page.route('**/api/auth/session', (route) =>
            route.fulfill({
                status: 200,
                body: JSON.stringify(null), // No session data
            })
        );

        // Navigate to the page
        await page.goto(home);

        // Verify the guest message and login button
        await expect(page.locator('text=Welcome, Guest')).toBeVisible();
        await expect(page.locator('button:has-text("Login")')).toBeVisible();
    });

    test('calls signIn when the Login button is clicked', async ({ page }) => {
        // Log all network requests to debug issues
        page.on('request', (request) => {
            console.log(`Request URL: ${request.url()}, Method: ${request.method()}`);
        });


        // Mock the signIn endpoint to simulate the authentication process
        await page.route('**/api/auth/signin', (route) =>
            route.fulfill({
                status: 200,
                body: JSON.stringify({
                    message: 'Sign-in successful',
                }),
            })
        );

        // Navigate to the page where the header component is rendered
        await page.goto(home); // Replace '/' with the actual route

        // Ensure the "Login" button is visible
        const loginButton = page.locator('button:has-text("Login")');
        await expect(loginButton).toBeVisible();

        await loginButton.click()
        await page.waitForURL('**/login*')

        // /api/auth/signin redirects to /login
        const signInRequest = page.url().includes('/login');

        // Verify the request was made
        expect(signInRequest).toBeTruthy();
    });


    test('calls signOut when the Logout button is clicked', async ({ page }) => {
        // Mock the session API to simulate an authenticated user
        await page.route('**/api/auth/session', (route) =>
            route.fulfill({
                status: 200,
                body: JSON.stringify({
                    user: {
                        username: 'TestUser',
                    },
                    accessToken: 'mock-access-token',
                }),
            })
        );

        // Log all network requests to verify the expected request
        page.on('request', (request) => {
            console.log('Request URL:', request.url(), 'Method:', request.method());
        });

        // Mock the authentication state
        await page.route('**/api/auth', (route) =>
            route.fulfill({
                status: 200,
                body: JSON.stringify({ isAuthenticated: true, username: 'TestUser' }),
            })
        );

        // Navigate to the page
        await page.goto(home);

        await page.click('role=button[name="Logout"]');

        const signOutRequest = await page.waitForRequest((request) =>
            request.url().includes('/api/auth/signout') && request.method() === 'POST'
        )

        // Wait for the `signOut` request (filtering by `POST` method)

        // Verify `signOut` request was made
        expect(signOutRequest).toBeTruthy();
    });
});
