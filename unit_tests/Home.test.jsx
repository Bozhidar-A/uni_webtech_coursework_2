import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

// Mock `next/router` for Link components
vi.mock("next/router", () => ({
    useRouter: vi.fn(() => ({
        push: vi.fn(),
        pathname: "/",
    })),
}));

// Mock `next-auth/react`
vi.mock("next-auth/react", () => ({
    signIn: vi.fn(),
    signOut: vi.fn(),
}));

// Mock `useAuth` Hook
vi.mock("../src/app/hooks/useAuth", () => ({
    default: vi.fn(() => ({
        isAuthenticated: false,
        username: null,
    })),
}));

import Home from "../src/app/page.jsx";
import useAuth from "../src/app/hooks/useAuth";
import { signIn } from "next-auth/react";

// Mock environment variables
vi.stubEnv("NEXT_PUBLIC_API_PACKAGES", "/packages");

describe("Home Page", () => {
    afterEach(() => {
        cleanup(); // Clear the DOM between tests
        vi.restoreAllMocks(); // Reset mocks
    });

    it("renders correctly when the user is not authenticated", () => {
        // Mock unauthenticated state
        useAuth.mockReturnValue({
            isAuthenticated: false,
            username: null,
        });

        render(<Home />);

        // Check for the login message and button
        const heading = screen.getByText(/Welcome to the manager service/i);
        expect(heading).toBeTruthy();

        const loginButton = screen.getByRole("button", {
            name: /Welcome to the manager service/i,
        });
        expect(loginButton).toBeTruthy();
    });

    it("renders correctly when the user is authenticated", () => {
        // Mock authenticated state
        useAuth.mockReturnValue({
            isAuthenticated: true,
            username: "TestUser",
        });

        render(<Home />);

        // Check for the packages link
        const heading = screen.getByText(/You are logged in. Click here to head to packages/i);
        expect(heading).toBeTruthy();

        const link = screen.getByRole("link", {
            name: /You are logged in. Click here to head to packages/i,
        });
        expect(link.getAttribute("href")).to.equal("/packages");
    });

    it("calls signIn when the login button is clicked", () => {
        // Mock unauthenticated state
        useAuth.mockReturnValue({
            isAuthenticated: false,
            username: null,
        });

        render(<Home />);

        // Click the login button
        const loginButton = screen.getByRole("button", {
            name: /Welcome to the manager service/i,
        });
        fireEvent.click(loginButton);

        // Ensure signIn is called
        expect(signIn).toHaveBeenCalled();
    });
});
