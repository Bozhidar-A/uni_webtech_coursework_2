import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

// Mock `next-auth/react`
vi.mock("next-auth/react", () => ({
    signIn: vi.fn(),
    signOut: vi.fn(),
}));

// Mock `useAuth`
vi.mock("../src/app/hooks/useAuth", () => ({
    default: vi.fn(() => ({
        isAuthenticated: false,
        username: null,
    })),
}));

// Import after mocks
import Header from "../src/app/components/Header";
import useAuth from "../src/app/hooks/useAuth";
import { signIn, signOut } from "next-auth/react";

// Mock environment variables
vi.stubEnv("NEXT_PUBLIC_NAVIGATION_HOME_PAGE", "/");
vi.stubEnv("NEXT_PUBLIC_NAVIGATION_PACKAGES_PAGE", "/packages");

describe("Header Component", () => {
    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
    });

    it("renders correctly when the user is not authenticated", () => {
        useAuth.mockReturnValue({
            isAuthenticated: false,
            username: null,
        });

        render(<Header />);

        // Verify "Guest" and "Login" button are displayed
        expect(screen.getByText(/Welcome, Guest/i)).not.toBeNull();
        const loginButton = screen.getByRole("button", { name: /Login/i });
        expect(loginButton).not.toBeNull();
    });

    it("renders correctly when the user is authenticated", () => {
        useAuth.mockReturnValue({
            isAuthenticated: true,
            username: "TestUser",
        });

        render(<Header />);

        // Verify username and "Logout" button are displayed
        expect(screen.getByText(/Welcome, TestUser/i)).not.toBeNull();
        const logoutButton = screen.getByRole("button", { name: /Logout/i });
        expect(logoutButton).not.toBeNull();
    });

    it("calls signIn when the Login button is clicked", () => {
        useAuth.mockReturnValue({
            isAuthenticated: false,
            username: null,
        });

        render(<Header />);
        const loginButton = screen.getByRole("button", { name: /Login/i });
        fireEvent.click(loginButton);

        // Verify `signIn` is called
        expect(signIn).toHaveBeenCalled();
    });

    it("calls signOut when the Logout button is clicked", () => {
        useAuth.mockReturnValue({
            isAuthenticated: true,
            username: "TestUser",
        });

        render(<Header />);
        const logoutButton = screen.getByRole("button", { name: /Logout/i });
        fireEvent.click(logoutButton);

        // Verify `signOut` is called
        expect(signOut).toHaveBeenCalled();
    });
});
