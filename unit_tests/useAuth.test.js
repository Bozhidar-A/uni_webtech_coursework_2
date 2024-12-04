import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

// Mock the `next-auth/react` module
vi.mock("next-auth/react", () => ({
    useSession: vi.fn(),
    getSession: vi.fn(),
}));

import useAuth from "../src/app/hooks/useAuth";
import { useSession, getSession } from "next-auth/react";

describe("useAuth Hook", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("returns default unauthenticated state", () => {
        // Mock useSession to return null session
        useSession.mockReturnValue({ data: null, status: "unauthenticated" });

        const { result } = renderHook(() => useAuth());
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.username).toBe(null);
    });

    it("returns authenticated state when session is available", () => {
        // Mock useSession to return an authenticated session
        useSession.mockReturnValue({
            data: {
                user: {
                    username: "TestUser",
                },
                accessToken: "fake-access-token",
            },
            status: "authenticated",
        });

        const { result } = renderHook(() => useAuth());
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.username).toBe("TestUser");
    });

    it("calls getSession when RefreshTokens is invoked", async () => {
        const mockGetSession = vi.fn();
        vi.mocked(getSession).mockImplementation(mockGetSession);

        vi.mocked(useSession).mockReturnValue({
            data: {
                user: {
                    username: "TestUser",
                },
                accessToken: "fake-access-token",
            },
            status: "authenticated",
        });

        const { result } = renderHook(() => useAuth());
        await result.current.RefreshTokens();

        expect(mockGetSession).toHaveBeenCalled();
    });
});
